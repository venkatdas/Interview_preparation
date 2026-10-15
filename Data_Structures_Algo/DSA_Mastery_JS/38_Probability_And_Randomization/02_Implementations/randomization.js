/**
 * Randomization toolkit for DSA interviews.
 *
 * Every function that uses randomness takes an optional `rng` argument:
 * a function that returns a float in [0, 1). It defaults to Math.random.
 * WHY: tests pass a seeded generator (mulberry32) so a "random" failure
 * can be reproduced exactly by re-running with the same seed.
 *
 * [Essential]  mulberry32, randInt, fisherYates, reservoirSample, WeightedPicker,
 *              rand10FromRand7, quickselect, chiSquare helpers
 * [Advanced]   AliasTable (Vose), randomizedQuicksort, seeded polynomial hash,
 *              monteCarloPi, rand10 with leftover reuse
 */

// ---------------------------------------------------------------------------
// Seeded PRNG
// ---------------------------------------------------------------------------

/**
 * mulberry32 — tiny 32-bit seeded PRNG. Returns a function rng() -> [0, 1).
 * Not cryptographically secure; perfect for reproducible tests.
 * O(1) per call.
 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform integer in [lo, hi] (both inclusive). O(1). */
function randInt(lo, hi, rng = Math.random) {
  if (!Number.isInteger(lo) || !Number.isInteger(hi) || lo > hi) {
    throw new RangeError('randInt needs integers lo <= hi');
  }
  // Math.floor(rng() * size) is uniform because rng() is uniform on [0, 1).
  return lo + Math.floor(rng() * (hi - lo + 1));
}

// ---------------------------------------------------------------------------
// Shuffling
// ---------------------------------------------------------------------------

/**
 * Fisher–Yates (Knuth) shuffle, in place. O(n) time, O(1) extra space.
 * For i from the end down to 1, swap a[i] with a[j], j uniform in [0, i].
 * Each of the n! orders has probability 1/n * 1/(n-1) * ... * 1 = 1/n!.
 */
function fisherYates(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); // j in [0, i] — INCLUDING i
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * The classic WRONG shuffle: swap every i with ANY index j in [0, n-1].
 * It produces n^n equally likely swap sequences, and n^n is not divisible
 * by n! for n >= 3, so some orders must be more likely than others.
 * Kept here only to demonstrate (and detect) the bias.
 */
function naiveBiasedShuffle(arr, rng = Math.random) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(rng() * n);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------------------
// Reservoir sampling
// ---------------------------------------------------------------------------

/**
 * Pick k items uniformly from a stream of unknown length (Algorithm R).
 * O(n) time, O(k) space. Item number i (1-based) replaces a random reservoir
 * slot with probability k / i. Every item ends in the sample with prob k / n.
 */
function reservoirSample(iterable, k, rng = Math.random) {
  if (!Number.isInteger(k) || k < 0) throw new RangeError('k must be a non-negative integer');
  const reservoir = [];
  let seen = 0;
  for (const item of iterable) {
    seen++;
    if (reservoir.length < k) {
      reservoir.push(item);
    } else {
      const j = Math.floor(rng() * seen); // j in [0, seen-1]
      if (j < k) reservoir[j] = item;     // happens with probability k / seen
    }
  }
  return reservoir;
}

// ---------------------------------------------------------------------------
// Weighted random pick
// ---------------------------------------------------------------------------

/**
 * WeightedPicker: build prefix sums once (O(n)), then each pick is a
 * random number in [0, total) plus a binary search (O(log n)).
 *
 *   weights   [1, 3, 2]
 *   prefix    [1, 4, 6]      index 0 owns [0,1), index 1 owns [1,4), index 2 owns [4,6)
 */
class WeightedPicker {
  constructor(weights, rng = Math.random) {
    if (!Array.isArray(weights) || weights.length === 0) throw new RangeError('need at least one weight');
    this.prefix = [];
    let total = 0;
    for (const w of weights) {
      if (!(w >= 0) || !Number.isFinite(w)) throw new RangeError('weights must be finite and >= 0');
      total += w;
      this.prefix.push(total);
    }
    if (total <= 0) throw new RangeError('total weight must be positive');
    this.total = total;
    this.rng = rng;
  }

  pick() {
    const target = this.rng() * this.total; // in [0, total)
    // first index whose prefix sum is STRICTLY greater than target
    let lo = 0;
    let hi = this.prefix.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.prefix[mid] > target) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}

/**
 * [Advanced] Vose's alias method: O(n) build, O(1) per pick.
 * Worth it when you pick millions of times from a fixed distribution.
 * Idea: chop the distribution into n columns of height 1; each column holds
 * at most two outcomes (itself and one "alias").
 */
class AliasTable {
  constructor(weights, rng = Math.random) {
    const n = weights.length;
    if (n === 0) throw new RangeError('need at least one weight');
    const total = weights.reduce((s, w) => s + w, 0);
    if (!(total > 0)) throw new RangeError('total weight must be positive');
    this.prob = new Array(n).fill(0);
    this.alias = new Array(n).fill(0);
    this.rng = rng;
    const scaled = weights.map((w) => (w * n) / total);
    const small = [];
    const large = [];
    scaled.forEach((p, i) => (p < 1 ? small : large).push(i));
    while (small.length && large.length) {
      const s = small.pop();
      const l = large.pop();
      this.prob[s] = scaled[s];
      this.alias[s] = l;
      scaled[l] = scaled[l] + scaled[s] - 1; // l gave away (1 - scaled[s])
      (scaled[l] < 1 ? small : large).push(l);
    }
    // leftovers are (up to rounding) exactly 1
    for (const i of large) this.prob[i] = 1;
    for (const i of small) this.prob[i] = 1;
  }

  pick() {
    const n = this.prob.length;
    const col = Math.floor(this.rng() * n);
    return this.rng() < this.prob[col] ? col : this.alias[col];
  }
}

// ---------------------------------------------------------------------------
// Rejection sampling
// ---------------------------------------------------------------------------

/** A fair 7-sided die built on an rng (used to drive rand10 demos). */
function makeRand7(rng = Math.random) {
  return () => 1 + Math.floor(rng() * 7);
}

/**
 * rand10 from rand7 by rejection sampling.
 * Two rolls give 49 equally likely cells; keep the first 40 (4 full copies of
 * 1..10), reject 41..49 and retry. Acceptance prob 40/49, so the expected
 * number of rounds is 49/40 and expected rand7 calls is 2 * 49/40 = 2.45.
 */
function rand10FromRand7(rand7) {
  for (;;) {
    const cell = (rand7() - 1) * 7 + rand7(); // uniform in 1..49
    if (cell <= 40) return 1 + ((cell - 1) % 10);
  }
}

/**
 * [Advanced] Same idea, but re-use the rejected leftovers instead of throwing
 * them away. Expected rand7 calls drops to about 2.19.
 */
function rand10FromRand7Reuse(rand7) {
  for (;;) {
    let a = (rand7() - 1) * 7 + rand7(); // 1..49
    if (a <= 40) return 1 + ((a - 1) % 10);
    a -= 40; // uniform in 1..9
    let b = (a - 1) * 7 + rand7(); // 1..63
    if (b <= 60) return 1 + ((b - 1) % 10);
    b -= 60; // uniform in 1..3
    const c = (b - 1) * 7 + rand7(); // 1..21
    if (c <= 20) return 1 + ((c - 1) % 10);
  }
}

/**
 * Generic rejection sampling: draw from `propose` until `accept(x)` holds.
 * If acceptance probability is p, the number of tries is Geometric(p),
 * expected 1/p tries.
 */
function rejectionSample(propose, accept, maxTries = 1e7) {
  for (let t = 0; t < maxTries; t++) {
    const x = propose();
    if (accept(x)) return x;
  }
  throw new Error('rejection sampling gave up (acceptance probability too low?)');
}

/** Uniform random point inside the unit circle via rejection from the square. */
function randomPointInCircle(radius = 1, rng = Math.random) {
  return rejectionSample(
    () => [(2 * rng() - 1) * radius, (2 * rng() - 1) * radius],
    ([x, y]) => x * x + y * y <= radius * radius,
  );
}

// ---------------------------------------------------------------------------
// Randomized selection / sorting
// ---------------------------------------------------------------------------

/**
 * Three-way partition of a[lo..hi] around pivot value p.
 * Returns [lt, gt]: a[lo..lt-1] < p, a[lt..gt] === p, a[gt+1..hi] > p.
 * Three-way matters: with many duplicates a two-way partition goes O(n^2).
 */
function swap(a, i, j) {
  const tmp = a[i];
  a[i] = a[j];
  a[j] = tmp;
}

function partition3(a, lo, hi, p) {
  let lt = lo;
  let i = lo;
  let gt = hi;
  while (i <= gt) {
    if (a[i] < p) {
      swap(a, lt, i);
      lt++;
      i++;
    } else if (a[i] > p) {
      swap(a, i, gt); // do NOT advance i: the value swapped in is unexamined
      gt--;
    } else {
      i++;
    }
  }
  return [lt, gt];
}

/**
 * Randomized quickselect: value that would sit at index k (0-based) after
 * sorting. Expected O(n) time (n + n/2 + n/4 + ... on average), worst O(n^2)
 * with vanishing probability. Works on a copy; input is not changed.
 */
function quickselect(arr, k, rng = Math.random) {
  if (!Number.isInteger(k) || k < 0 || k >= arr.length) throw new RangeError('k out of range');
  const a = arr.slice();
  let lo = 0;
  let hi = a.length - 1;
  for (;;) {
    const p = a[lo + Math.floor(rng() * (hi - lo + 1))];
    const [lt, gt] = partition3(a, lo, hi, p);
    if (k < lt) hi = lt - 1;
    else if (k > gt) lo = gt + 1;
    else return p;
  }
}

/** [Advanced] Randomized quicksort, expected O(n log n) for EVERY input. */
function randomizedQuicksort(arr, rng = Math.random) {
  const a = arr.slice();
  const stack = [[0, a.length - 1]]; // explicit stack: no recursion depth issues
  while (stack.length) {
    const [lo, hi] = stack.pop();
    if (lo >= hi) continue;
    const p = a[lo + Math.floor(rng() * (hi - lo + 1))];
    const [lt, gt] = partition3(a, lo, hi, p);
    stack.push([lo, lt - 1], [gt + 1, hi]);
  }
  return a;
}

// ---------------------------------------------------------------------------
// Hashing with a random seed
// ---------------------------------------------------------------------------

/**
 * [Advanced] Polynomial string hash with a RANDOM base chosen at runtime.
 * A fixed base can be attacked with crafted collisions (anti-hash tests);
 * a random base makes any fixed pair of different strings collide with
 * probability about len / MOD.
 */
function makeSeededStringHash(rng = Math.random) {
  const MOD = 1000000007n;
  const base = BigInt(256 + Math.floor(rng() * 1e9)) % MOD;
  return function hash(s) {
    let h = 0n;
    for (let i = 0; i < s.length; i++) h = (h * base + BigInt(s.charCodeAt(i))) % MOD;
    return Number(h);
  };
}

// ---------------------------------------------------------------------------
// Monte Carlo and statistics helpers
// ---------------------------------------------------------------------------

/** Monte Carlo estimate of pi: fraction of random square points inside the circle, times 4. */
function monteCarloPi(samples, rng = Math.random) {
  let inside = 0;
  for (let i = 0; i < samples; i++) {
    const x = rng();
    const y = rng();
    if (x * x + y * y <= 1) inside++;
  }
  return (4 * inside) / samples;
}

/** Expected number of trials until first success with probability p (geometric). */
function expectedTrialsUntilSuccess(p) {
  if (!(p > 0 && p <= 1)) throw new RangeError('p must be in (0, 1]');
  return 1 / p;
}

/** Run `experiment()` `trials` times and return the average result. */
function simulateMean(experiment, trials) {
  let sum = 0;
  for (let i = 0; i < trials; i++) sum += experiment();
  return sum / trials;
}

/**
 * Pearson chi-square statistic: sum over buckets of (observed - expected)^2 / expected.
 * counts: observed counts per bucket. probs: expected probability per bucket
 * (defaults to uniform).
 */
function chiSquare(counts, probs) {
  const total = counts.reduce((s, c) => s + c, 0);
  const k = counts.length;
  let stat = 0;
  for (let i = 0; i < k; i++) {
    const expected = total * (probs ? probs[i] : 1 / k);
    if (expected === 0) {
      if (counts[i] !== 0) return Infinity; // impossible outcome observed
      continue;
    }
    stat += (counts[i] - expected) ** 2 / expected;
  }
  return stat;
}

/**
 * "Chi-square-ish" bucket check with a deliberately WIDE band.
 * For df = k-1 degrees of freedom the statistic has mean df and variance 2*df.
 * We accept when stat <= df + sigmas * sqrt(2*df). sigmas = 6 means a fair
 * generator essentially never fails, while a real bias (which grows the
 * statistic in proportion to the sample size) is still caught.
 */
function looksUniform(counts, probs, sigmas = 6) {
  const df = Math.max(1, counts.length - 1);
  return chiSquare(counts, probs) <= df + sigmas * Math.sqrt(2 * df);
}

/** Count how often each key appears when calling `draw()` `trials` times. */
function bucketCounts(draw, trials, keyOf = (x) => x) {
  const counts = new Map();
  for (let i = 0; i < trials; i++) {
    const key = keyOf(draw());
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');
  const rng = mulberry32(12345);

  // mulberry32 is deterministic and in range
  const r1 = mulberry32(7);
  const r2 = mulberry32(7);
  for (let i = 0; i < 100; i++) {
    const x = r1();
    assert.strictEqual(x, r2());
    assert.ok(x >= 0 && x < 1);
  }

  // randInt stays in range and hits every value
  const seenInts = new Set();
  for (let i = 0; i < 2000; i++) {
    const v = randInt(3, 8, rng);
    assert.ok(v >= 3 && v <= 8);
    seenInts.add(v);
  }
  assert.strictEqual(seenInts.size, 6);

  // Fisher–Yates: a permutation, and all 6 orders of [1,2,3] equally likely
  const fy = bucketCounts(() => fisherYates([1, 2, 3], rng), 60000, (a) => a.join(''));
  assert.strictEqual(fy.size, 6);
  assert.ok(looksUniform([...fy.values()]), 'Fisher-Yates should look uniform');

  // the naive shuffle is detectably biased
  const nv = bucketCounts(() => naiveBiasedShuffle([1, 2, 3], rng), 60000, (a) => a.join(''));
  assert.ok(!looksUniform([...nv.values()]), 'naive shuffle should be caught as biased');

  // reservoir sampling: each of 10 items chosen with prob 3/10
  const resCounts = new Array(10).fill(0);
  for (let t = 0; t < 20000; t++) {
    const s = reservoirSample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3, rng);
    assert.strictEqual(new Set(s).size, 3);
    for (const x of s) resCounts[x]++;
  }
  assert.ok(looksUniform(resCounts));
  assert.deepStrictEqual(reservoirSample([1, 2], 5, rng), [1, 2]); // k > n -> everything

  // weighted pick matches weights; zero weight never picked
  const wp = new WeightedPicker([1, 0, 3, 6], rng);
  const wCounts = [0, 0, 0, 0];
  for (let t = 0; t < 50000; t++) wCounts[wp.pick()]++;
  assert.strictEqual(wCounts[1], 0);
  assert.ok(looksUniform(wCounts, [0.1, 0, 0.3, 0.6]));

  const alias = new AliasTable([1, 0, 3, 6], rng);
  const aCounts = [0, 0, 0, 0];
  for (let t = 0; t < 50000; t++) aCounts[alias.pick()]++;
  assert.ok(looksUniform(aCounts, [0.1, 0, 0.3, 0.6]));

  // rand10 from rand7: uniform, and expected calls ~2.45
  let calls = 0;
  const base7 = makeRand7(rng);
  const counted7 = () => { calls++; return base7(); };
  const tenCounts = new Array(10).fill(0);
  const N10 = 50000;
  for (let t = 0; t < N10; t++) tenCounts[rand10FromRand7(counted7) - 1]++;
  assert.ok(looksUniform(tenCounts));
  assert.ok(Math.abs(calls / N10 - 2.45) < 0.1, `avg calls ${calls / N10}`);
  const reuseCounts = new Array(10).fill(0);
  for (let t = 0; t < N10; t++) reuseCounts[rand10FromRand7Reuse(base7) - 1]++;
  assert.ok(looksUniform(reuseCounts));

  // point in circle
  for (let t = 0; t < 1000; t++) {
    const [x, y] = randomPointInCircle(2, rng);
    assert.ok(x * x + y * y <= 4);
  }

  // quickselect and quicksort vs brute force (sort)
  for (let t = 0; t < 300; t++) {
    const n = 1 + Math.floor(rng() * 30);
    const arr = Array.from({ length: n }, () => Math.floor(rng() * 10) - 5); // many duplicates
    const sorted = arr.slice().sort((x, y) => x - y);
    const k = Math.floor(rng() * n);
    assert.strictEqual(quickselect(arr, k, rng), sorted[k]);
    assert.deepStrictEqual(randomizedQuicksort(arr, rng), sorted);
  }

  // seeded hash: equal strings equal hash; deterministic for a fixed seed
  const h1 = makeSeededStringHash(mulberry32(1));
  const h2 = makeSeededStringHash(mulberry32(1));
  assert.strictEqual(h1('hello'), h2('hello'));
  assert.notStrictEqual(h1('hello'), h1('world'));

  // Monte Carlo pi within a generous band; geometric expectation
  assert.ok(Math.abs(monteCarloPi(200000, rng) - Math.PI) < 0.05);
  assert.strictEqual(expectedTrialsUntilSuccess(0.25), 4);
  const avgRollsForSix = simulateMean(() => {
    let rolls = 0;
    while (true) { rolls++; if (randInt(1, 6, rng) === 6) return rolls; }
  }, 50000);
  assert.ok(Math.abs(avgRollsForSix - 6) < 0.3);

  // linearity of expectation: expected fixed points of a random permutation is 1
  const avgFixed = simulateMean(() => {
    const p = fisherYates([0, 1, 2, 3, 4, 5, 6, 7], rng);
    return p.filter((v, i) => v === i).length;
  }, 40000);
  assert.ok(Math.abs(avgFixed - 1) < 0.08);

  assert.throws(() => randInt(5, 1));
  assert.throws(() => new WeightedPicker([0, 0]));
  assert.throws(() => quickselect([1, 2], 2));

  console.log('✓ randomization.js self-test passed');
}

module.exports = {
  mulberry32,
  randInt,
  fisherYates,
  naiveBiasedShuffle,
  reservoirSample,
  WeightedPicker,
  AliasTable,
  makeRand7,
  rand10FromRand7,
  rand10FromRand7Reuse,
  rejectionSample,
  randomPointInCircle,
  partition3,
  quickselect,
  randomizedQuicksort,
  makeSeededStringHash,
  monteCarloPi,
  expectedTrialsUntilSuccess,
  simulateMean,
  chiSquare,
  looksUniform,
  bucketCounts,
};
