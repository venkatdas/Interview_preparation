/**
 * streaming.js — building blocks for ONLINE algorithms (data arrives one item at a time).
 *
 * An online algorithm must answer after every item WITHOUT seeing the future, and usually
 * with memory much smaller than the whole stream. Everything in this file follows that rule:
 *
 *   MinHeap               comparator-based binary heap (used by median + top-k)
 *   RunningStats          Welford's mean / variance in O(1) memory
 *   StreamingMedian       two heaps, O(log n) add, O(1) median
 *   reservoirSample /
 *   Reservoir             uniform sample of k items from a stream of unknown length
 *   MisraGries            heavy hitters (items with frequency > n/k) in k-1 counters
 *   CountMinSketch        approximate frequencies, never under-estimates
 *   HyperLogLog           approximate count of DISTINCT items in a few KB
 *   MovingAverage, Ema    fixed-window average and exponential moving average
 *   SlidingLogRateLimiter keep timestamps of the last window, allow up to `limit`
 *   TokenBucket           refill-by-time bucket; time is passed in for determinism
 *   mulberry32            tiny seeded PRNG so random behaviour is reproducible
 *
 * Run: node streaming.js
 */

// ---------- seeded random numbers ----------
// WHY: sampling and sketches use randomness; a seed makes tests reproducible.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- 32-bit hashing ----------
// FNV-1a over the string form, then a murmur3 "fmix" finaliser so every output bit
// depends on every input bit (FNV alone has weak low bits). `seed` gives independent
// hash functions for Count-Min rows.
function hash32(value, seed = 0) {
  const s = String(value);
  let h = (0x811c9dc5 ^ seed) >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

// ---------- MinHeap ----------
// compare(a, b) < 0 means a should be closer to the top. Pass (a, b) => b - a for a max-heap.
class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.compare = compare;
    this.data = [];
  }
  size() { return this.data.length; }
  isEmpty() { return this.data.length === 0; }
  peek() { return this.data[0]; }
  push(value) {
    const d = this.data;
    d.push(value);
    let i = d.length - 1;
    while (i > 0) {                          // sift up: swap with parent while smaller
      const p = (i - 1) >> 1;
      if (this.compare(d[i], d[p]) >= 0) break;
      [d[i], d[p]] = [d[p], d[i]];
      i = p;
    }
    return this;
  }
  pop() {
    const d = this.data;
    if (d.length === 0) return undefined;
    const top = d[0];
    const last = d.pop();
    if (d.length > 0) {
      d[0] = last;
      let i = 0;
      for (;;) {                             // sift down: swap with the smaller child
        const l = 2 * i + 1, r = l + 1;
        let best = i;
        if (l < d.length && this.compare(d[l], d[best]) < 0) best = l;
        if (r < d.length && this.compare(d[r], d[best]) < 0) best = r;
        if (best === i) break;
        [d[i], d[best]] = [d[best], d[i]];
        i = best;
      }
    }
    return top;
  }
}

// ---------- RunningStats (Welford) ----------
// WHY not sum and sum-of-squares? var = E[x^2] - E[x]^2 subtracts two huge, nearly equal
// numbers and loses precision ("catastrophic cancellation"). Welford updates the mean and
// the sum of squared deviations (m2) incrementally and stays accurate.
class RunningStats {
  constructor() { this.n = 0; this.mean = 0; this.m2 = 0; this.min = Infinity; this.max = -Infinity; }
  add(x) {
    if (typeof x !== 'number' || Number.isNaN(x)) throw new TypeError('RunningStats.add expects a number');
    this.n++;
    const delta = x - this.mean;             // distance from the OLD mean
    this.mean += delta / this.n;
    this.m2 += delta * (x - this.mean);      // times distance from the NEW mean
    if (x < this.min) this.min = x;
    if (x > this.max) this.max = x;
    return this;
  }
  variance() { return this.n > 0 ? this.m2 / this.n : 0; }              // population
  sampleVariance() { return this.n > 1 ? this.m2 / (this.n - 1) : 0; }  // Bessel-corrected
  stdDev() { return Math.sqrt(this.variance()); }
}

// ---------- StreamingMedian (two heaps) ----------
// low  = max-heap holding the smaller half, high = min-heap holding the larger half.
// Invariant: low.size() === high.size() or low.size() === high.size() + 1,
//            and every value in low <= every value in high.
class StreamingMedian {
  constructor() {
    this.low = new MinHeap((a, b) => b - a);
    this.high = new MinHeap((a, b) => a - b);
  }
  size() { return this.low.size() + this.high.size(); }
  add(x) {
    // 1. push into low, 2. move low's max to high (keeps the ordering invariant),
    // 3. rebalance sizes so low is never smaller than high.
    this.low.push(x);
    this.high.push(this.low.pop());
    if (this.high.size() > this.low.size()) this.low.push(this.high.pop());
    return this;
  }
  median() {
    if (this.size() === 0) return undefined;
    if (this.low.size() > this.high.size()) return this.low.peek();
    return (this.low.peek() + this.high.peek()) / 2;
  }
}

// ---------- Reservoir sampling (Algorithm R) ----------
// Keep the first k items. For item number i (1-based, i > k) keep it with probability k/i,
// replacing a uniformly random slot. Every item ends up in the sample with probability k/n.
class Reservoir {
  constructor(k, rng = Math.random) {
    if (!Number.isInteger(k) || k < 0) throw new RangeError('k must be a non-negative integer');
    this.k = k; this.rng = rng; this.seen = 0; this.sample = [];
  }
  add(item) {
    this.seen++;
    if (this.sample.length < this.k) { this.sample.push(item); return this; }
    const j = Math.floor(this.rng() * this.seen);   // 0 .. seen-1
    if (j < this.k) this.sample[j] = item;           // happens with probability k/seen
    return this;
  }
  get() { return this.sample.slice(); }
}
function reservoirSample(iterable, k, rng = Math.random) {
  const r = new Reservoir(k, rng);
  for (const x of iterable) r.add(x);
  return r.get();
}

// ---------- Misra-Gries heavy hitters ----------
// Keeps at most k-1 counters. When a new item arrives and all counters are busy,
// decrement EVERY counter (and drop zeros). Each decrement "cancels" k distinct items,
// so any item with true frequency > n/k must survive. Counts are under-estimates by at most n/k.
class MisraGries {
  constructor(k) {
    if (!Number.isInteger(k) || k < 2) throw new RangeError('k must be an integer >= 2');
    this.k = k; this.counters = new Map(); this.n = 0;
  }
  add(item) {
    this.n++;
    const c = this.counters;
    if (c.has(item)) c.set(item, c.get(item) + 1);
    else if (c.size < this.k - 1) c.set(item, 1);
    else {
      for (const [key, v] of c) {
        if (v === 1) c.delete(key); else c.set(key, v - 1);
      }
    }
    return this;
  }
  /** candidates: a SUPERSET of items with frequency > n/k (verify with a second pass if exact). */
  candidates() { return [...this.counters.keys()]; }
  estimate(item) { return this.counters.get(item) || 0; }
}

// ---------- Count-Min Sketch ----------
// depth rows x width columns of counters, one hash per row. add() bumps one cell per row;
// estimate() takes the MIN across rows. Collisions only ever ADD, so the estimate is
// never below the truth; with width = ceil(e/eps), depth = ceil(ln(1/delta)) the error is
// <= eps * n with probability >= 1 - delta.
class CountMinSketch {
  constructor(width = 272, depth = 5) {
    this.width = width; this.depth = depth;
    this.table = Array.from({ length: depth }, () => new Uint32Array(width));
  }
  add(item, count = 1) {
    for (let r = 0; r < this.depth; r++) this.table[r][hash32(item, r * 0x9e3779b1) % this.width] += count;
    return this;
  }
  estimate(item) {
    let best = Infinity;
    for (let r = 0; r < this.depth; r++) best = Math.min(best, this.table[r][hash32(item, r * 0x9e3779b1) % this.width]);
    return best;
  }
}

// ---------- HyperLogLog (simple version) ----------
// Hash each item to 32 bits. The first b bits pick a register; in the remaining bits count
// the position of the first 1-bit (rank). Seeing rank r is like flipping r-1 tails in a row,
// which needs about 2^r tries -> the max rank per register estimates log2(distinct/m).
// A harmonic mean across m = 2^b registers smooths out luck. Std error ~ 1.04 / sqrt(m).
class HyperLogLog {
  constructor(b = 10) {
    if (b < 4 || b > 16) throw new RangeError('b must be in 4..16');
    this.b = b; this.m = 1 << b; this.registers = new Uint8Array(this.m);
    this.alpha = this.m >= 128 ? 0.7213 / (1 + 1.079 / this.m) : ({ 16: 0.673, 32: 0.697, 64: 0.709 })[this.m];
  }
  add(item) {
    const h = hash32(item);
    const idx = h >>> (32 - this.b);                  // top b bits -> register
    const rest = (h << this.b) >>> 0;                 // remaining bits, left-aligned
    const rank = rest === 0 ? 32 - this.b + 1 : Math.clz32(rest) + 1;
    if (rank > this.registers[idx]) this.registers[idx] = rank;
    return this;
  }
  count() {
    let sum = 0, zeros = 0;
    for (const r of this.registers) { sum += 2 ** -r; if (r === 0) zeros++; }
    let est = this.alpha * this.m * this.m / sum;
    // small-range correction: with many empty registers, linear counting is more accurate
    if (est <= 2.5 * this.m && zeros > 0) est = this.m * Math.log(this.m / zeros);
    return Math.round(est);
  }
}

// ---------- Moving averages ----------
// Fixed window: keep the last `size` values in a circular buffer and a running sum.
class MovingAverage {
  constructor(size) {
    if (!Number.isInteger(size) || size <= 0) throw new RangeError('size must be a positive integer');
    this.size = size; this.buf = new Array(size); this.count = 0; this.head = 0; this.sum = 0;
  }
  next(val) {
    if (this.count === this.size) this.sum -= this.buf[this.head];  // evict oldest
    else this.count++;
    this.buf[this.head] = val;
    this.sum += val;
    this.head = (this.head + 1) % this.size;
    return this.sum / this.count;
  }
}
// EMA: new = alpha * x + (1 - alpha) * old. O(1) memory, recent values weigh more.
class Ema {
  constructor(alpha) {
    if (!(alpha > 0 && alpha <= 1)) throw new RangeError('alpha must be in (0, 1]');
    this.alpha = alpha; this.value = undefined;
  }
  next(x) {
    this.value = this.value === undefined ? x : this.alpha * x + (1 - this.alpha) * this.value;
    return this.value;
  }
}

// ---------- Rate limiters ----------
// Sliding log: allow a request at time t if fewer than `limit` requests happened in (t - window, t].
// Exact, but memory is O(limit). Times must be non-decreasing.
class SlidingLogRateLimiter {
  constructor(limit, windowMs) { this.limit = limit; this.windowMs = windowMs; this.log = []; this.head = 0; }
  allow(t) {
    while (this.head < this.log.length && this.log[this.head] <= t - this.windowMs) this.head++;
    if (this.head > 1024 && this.head * 2 > this.log.length) { this.log = this.log.slice(this.head); this.head = 0; }
    if (this.log.length - this.head < this.limit) { this.log.push(t); return true; }
    return false;
  }
}
// Token bucket: holds up to `capacity` tokens, refills `ratePerMs` tokens per ms.
// A request costs `cost` tokens. Allows bursts up to capacity, average rate = ratePerMs.
class TokenBucket {
  constructor(capacity, ratePerMs, startTime = 0) {
    this.capacity = capacity; this.rate = ratePerMs; this.tokens = capacity; this.last = startTime;
  }
  allow(t, cost = 1) {
    this.tokens = Math.min(this.capacity, this.tokens + (t - this.last) * this.rate);  // lazy refill
    this.last = t;
    if (this.tokens >= cost) { this.tokens -= cost; return true; }
    return false;
  }
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');
  const rng = mulberry32(42);
  const close = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(b));

  // MinHeap vs sort
  for (let t = 0; t < 50; t++) {
    const arr = Array.from({ length: Math.floor(rng() * 40) }, () => Math.floor(rng() * 100) - 50);
    const h = new MinHeap();
    arr.forEach(x => h.push(x));
    const out = [];
    while (!h.isEmpty()) out.push(h.pop());
    assert.deepStrictEqual(out, [...arr].sort((a, b) => a - b));
  }
  assert.strictEqual(new MinHeap().pop(), undefined);

  // RunningStats vs two-pass
  const rs = new RunningStats();
  const xs = Array.from({ length: 500 }, () => 1e9 + rng() * 10);   // big offset: naive formula struggles
  xs.forEach(x => rs.add(x));
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length;
  assert.ok(close(rs.mean, mean, 1e-12));
  assert.ok(Math.abs(rs.variance() - v) < 1e-3);
  assert.strictEqual(new RunningStats().variance(), 0);

  // StreamingMedian vs sorting the prefix
  for (let t = 0; t < 30; t++) {
    const sm = new StreamingMedian(); const seen = [];
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(rng() * 20) - 10;
      sm.add(x); seen.push(x);
      const s = [...seen].sort((a, b) => a - b); const m = s.length;
      const expect = m % 2 ? s[(m - 1) / 2] : (s[m / 2 - 1] + s[m / 2]) / 2;
      assert.strictEqual(sm.median(), expect);
    }
  }
  assert.strictEqual(new StreamingMedian().median(), undefined);

  // Reservoir: each of 10 items should be chosen about k/n = 30% of the time
  const counts = new Array(10).fill(0);
  for (let t = 0; t < 20000; t++) for (const x of reservoirSample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3, rng)) counts[x]++;
  for (const c of counts) assert.ok(Math.abs(c / 20000 - 0.3) < 0.02, `reservoir bias ${c}`);
  assert.deepStrictEqual(reservoirSample([1, 2], 5), [1, 2]);

  // Misra-Gries: every item with freq > n/k must be a candidate; estimate within n/k
  for (let t = 0; t < 30; t++) {
    const k = 2 + Math.floor(rng() * 5), mg = new MisraGries(k), freq = new Map();
    const n = 300;
    for (let i = 0; i < n; i++) {
      const x = rng() < 0.4 ? 'hot' : 'v' + Math.floor(rng() * 30);
      mg.add(x); freq.set(x, (freq.get(x) || 0) + 1);
    }
    for (const [x, f] of freq) {
      if (f > n / k) assert.ok(mg.candidates().includes(x));
      assert.ok(mg.estimate(x) <= f && f - mg.estimate(x) <= n / k);
    }
  }

  // CountMin never under-estimates, and is close for a skewed stream
  const cms = new CountMinSketch(200, 5), truth = new Map();
  for (let i = 0; i < 5000; i++) {
    const x = 'k' + Math.floor(rng() ** 3 * 500);
    cms.add(x); truth.set(x, (truth.get(x) || 0) + 1);
  }
  for (const [x, f] of truth) { assert.ok(cms.estimate(x) >= f); assert.ok(cms.estimate(x) - f <= 5000 * Math.E / 200); }

  // HyperLogLog within 10% (std error with b=10 is ~3.3%)
  for (const n of [100, 1000, 50000]) {
    const hll = new HyperLogLog(10);
    for (let i = 0; i < n; i++) { hll.add('user-' + i); hll.add('user-' + (i >> 1)); }  // duplicates must not count
    assert.ok(Math.abs(hll.count() - n) / n < 0.1, `hll ${n} -> ${hll.count()}`);
  }

  // MovingAverage vs slice, EMA
  const ma = new MovingAverage(3);
  assert.strictEqual(ma.next(1), 1); assert.strictEqual(ma.next(10), 5.5);
  assert.ok(close(ma.next(3), 14 / 3)); assert.ok(close(ma.next(5), 6));
  const ma2 = new MovingAverage(5), hist = [];
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(rng() * 100); hist.push(x);
    const w = hist.slice(-5);
    assert.ok(close(ma2.next(x), w.reduce((a, b) => a + b, 0) / w.length));
  }
  const ema = new Ema(0.5); ema.next(10); assert.strictEqual(ema.next(20), 15);

  // Sliding log vs brute force
  for (let t = 0; t < 20; t++) {
    const limit = 1 + Math.floor(rng() * 4), win = 10 + Math.floor(rng() * 20);
    const lim = new SlidingLogRateLimiter(limit, win), accepted = [];
    let time = 0;
    for (let i = 0; i < 200; i++) {
      time += Math.floor(rng() * 5);
      const expect = accepted.filter(a => a > time - win).length < limit;
      assert.strictEqual(lim.allow(time), expect);
      if (expect) accepted.push(time);
    }
  }

  // Token bucket: capacity 2, 1 token per 10ms
  const tb = new TokenBucket(2, 0.1, 0);
  assert.deepStrictEqual([tb.allow(0), tb.allow(0), tb.allow(0), tb.allow(5), tb.allow(10)], [true, true, false, false, true]);

  console.log('✓ streaming.js self-test passed');
}

module.exports = {
  mulberry32, hash32, MinHeap, RunningStats, StreamingMedian, Reservoir, reservoirSample,
  MisraGries, CountMinSketch, HyperLogLog, MovingAverage, Ema, SlidingLogRateLimiter, TokenBucket,
};
