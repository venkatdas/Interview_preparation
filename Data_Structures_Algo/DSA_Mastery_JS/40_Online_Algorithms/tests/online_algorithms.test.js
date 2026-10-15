const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  mulberry32, MinHeap, RunningStats, StreamingMedian, Reservoir, reservoirSample, MisraGries,
  CountMinSketch, HyperLogLog, MovingAverage, Ema, SlidingLogRateLimiter, TokenBucket,
} = require('../02_Implementations/streaming');

describe('MinHeap', () => {
  it('pops in sorted order, supports a max-heap comparator', () => {
    const h = new MinHeap();
    [5, 1, 4, 1, 3].forEach(x => h.push(x));
    assert.deepEqual([h.pop(), h.pop(), h.pop(), h.pop(), h.pop()], [1, 1, 3, 4, 5]);
    const mx = new MinHeap((a, b) => b - a);
    [2, 9, 4].forEach(x => mx.push(x));
    assert.equal(mx.peek(), 9);
  });
  it('handles empty input', () => {
    const h = new MinHeap();
    assert.equal(h.pop(), undefined);
    assert.equal(h.peek(), undefined);
    assert.equal(h.isEmpty(), true);
  });
  it('matches sorting on random inputs', () => {
    const rng = mulberry32(1);
    for (let t = 0; t < 200; t++) {
      const arr = Array.from({ length: Math.floor(rng() * 30) }, () => Math.floor(rng() * 40) - 20);
      const h = new MinHeap();
      arr.forEach(x => h.push(x));
      const out = [];
      while (h.size()) out.push(h.pop());
      assert.deepEqual(out, [...arr].sort((a, b) => a - b));
    }
  });
});

describe('RunningStats (Welford)', () => {
  it('computes mean / variance of a small stream', () => {
    const s = new RunningStats();
    [2, 4, 4, 4, 5, 5, 7, 9].forEach(x => s.add(x));
    assert.equal(s.mean, 5);
    assert.equal(s.variance(), 4);
    assert.equal(s.stdDev(), 2);
    assert.equal(s.min, 2);
    assert.equal(s.max, 9);
  });
  it('handles empty and single-element streams, rejects NaN', () => {
    const s = new RunningStats();
    assert.equal(s.variance(), 0);
    s.add(3);
    assert.equal(s.sampleVariance(), 0);
    assert.throws(() => s.add(NaN));
  });
  it('matches two-pass variance on random inputs', () => {
    const rng = mulberry32(2);
    for (let t = 0; t < 200; t++) {
      const xs = Array.from({ length: 1 + Math.floor(rng() * 50) }, () => rng() * 1000 - 500);
      const s = new RunningStats();
      xs.forEach(x => s.add(x));
      const m = xs.reduce((a, b) => a + b, 0) / xs.length;
      const v = xs.reduce((a, x) => a + (x - m) ** 2, 0) / xs.length;
      assert.ok(Math.abs(s.mean - m) < 1e-9);
      assert.ok(Math.abs(s.variance() - v) < 1e-6);
    }
  });
});

describe('StreamingMedian', () => {
  it('handles duplicates / negatives', () => {
    const m = new StreamingMedian();
    [-1, -1, 5, -3].forEach(x => m.add(x));
    assert.equal(m.median(), -1);
  });
  it('matches brute force on random inputs', () => {
    const rng = mulberry32(3);
    for (let t = 0; t < 200; t++) {
      const m = new StreamingMedian(), seen = [];
      for (let i = 0; i < 25; i++) {
        const x = Math.floor(rng() * 30) - 15;
        m.add(x); seen.push(x);
        const s = [...seen].sort((a, b) => a - b), n = s.length;
        assert.equal(m.median(), n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2);
      }
    }
  });
});

describe('Reservoir sampling', () => {
  it('returns everything when the stream is shorter than k, nothing for k = 0', () => {
    assert.deepEqual(reservoirSample([1, 2, 3], 5, mulberry32(4)), [1, 2, 3]);
    assert.deepEqual(reservoirSample([1, 2, 3], 0, mulberry32(4)), []);
    assert.throws(() => new Reservoir(-1));
  });
  it('is roughly uniform', () => {
    const rng = mulberry32(5), counts = new Array(8).fill(0), trials = 16000;
    for (let t = 0; t < trials; t++) for (const x of reservoirSample([0, 1, 2, 3, 4, 5, 6, 7], 2, rng)) counts[x]++;
    for (const c of counts) assert.ok(Math.abs(c / trials - 0.25) < 0.02);
  });
});

describe('Sketches', () => {
  it('Misra-Gries keeps every item above n/k', () => {
    const rng = mulberry32(6);
    for (let t = 0; t < 200; t++) {
      const k = 2 + Math.floor(rng() * 4), mg = new MisraGries(k), freq = new Map(), n = 100;
      for (let i = 0; i < n; i++) {
        const x = rng() < 0.45 ? 'A' : 'x' + Math.floor(rng() * 20);
        mg.add(x); freq.set(x, (freq.get(x) || 0) + 1);
      }
      for (const [x, f] of freq) if (f > n / k) assert.ok(mg.candidates().includes(x));
    }
    assert.throws(() => new MisraGries(1));
  });
  it('Count-Min never under-estimates', () => {
    const cms = new CountMinSketch(64, 4), rng = mulberry32(7), truth = new Map();
    for (let i = 0; i < 3000; i++) {
      const x = Math.floor(rng() * 300);
      cms.add(x); truth.set(x, (truth.get(x) || 0) + 1);
    }
    for (const [x, f] of truth) assert.ok(cms.estimate(x) >= f);
    assert.equal(new CountMinSketch().estimate('never'), 0);
  });
  it('HyperLogLog estimates distinct counts within 10% and ignores duplicates', () => {
    const hll = new HyperLogLog(11);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 20000; i++) hll.add('id' + i);
    assert.ok(Math.abs(hll.count() - 20000) / 20000 < 0.1);
    assert.equal(new HyperLogLog(10).count(), 0);
  });
});

describe('Windows and rate limiters', () => {
  it('MovingAverage and Ema', () => {
    const m = new MovingAverage(2);
    assert.deepEqual([m.next(2), m.next(4), m.next(10)], [2, 3, 7]);
    assert.throws(() => new MovingAverage(0));
    const e = new Ema(1);
    e.next(5);
    assert.equal(e.next(9), 9);
  });
  it('SlidingLogRateLimiter matches brute force on random inputs', () => {
    const rng = mulberry32(8);
    for (let t = 0; t < 200; t++) {
      const limit = 1 + Math.floor(rng() * 3), win = 5 + Math.floor(rng() * 10);
      const lim = new SlidingLogRateLimiter(limit, win), ok = [];
      let time = 0;
      for (let i = 0; i < 50; i++) {
        time += Math.floor(rng() * 4);
        const expect = ok.filter(a => a > time - win).length < limit;
        assert.equal(lim.allow(time), expect);
        if (expect) ok.push(time);
      }
    }
  });
  it('TokenBucket allows bursts then refills', () => {
    const tb = new TokenBucket(3, 1 / 100, 0);
    assert.deepEqual([tb.allow(0), tb.allow(0), tb.allow(0), tb.allow(0)], [true, true, true, false]);
    assert.equal(tb.allow(100), true);
    assert.equal(tb.allow(10000, 3), true);   // refill capped at capacity
    assert.equal(tb.allow(10000), false);
  });
});

describe('solutions on extra edge cases', () => {
  it('Kth largest with k = 1 is a running max', () => {
    const { optimal } = require('../03_Problems/solutions/03_kth_largest_in_a_stream');
    const kl = optimal(1, []);
    assert.deepEqual([3, 1, 4, 1, 5].map(x => kl.add(x)), [3, 3, 4, 4, 5]);
  });
  it('Stock span on a flat series', () => {
    const { optimal } = require('../03_Problems/solutions/05_online_stock_span');
    const s = optimal();
    assert.deepEqual([7, 7, 7, 7].map(p => s.next(p)), [1, 2, 3, 4]);
  });
  it('Ski rental break-even ratio is 2 - 1/B', () => {
    const { optimal, bruteForce } = require('../03_Problems/solutions/06_ski_rental_simulation');
    for (const B of [1, 2, 7, 25]) assert.equal(bruteForce(B).buyDay, optimal(B).buyDay);
    assert.equal(optimal(2).ratio, 1.5);
  });
  it('Heavy hitters: one item stream', () => {
    const { optimal } = require('../03_Problems/solutions/07_heavy_hitters_misra_gries');
    assert.deepEqual(optimal(['z', 'z', 'z'], 5), [['z', 3]]);
  });
  it('Disjoint intervals: fill a gap from both sides', () => {
    const { optimal } = require('../03_Problems/solutions/09_data_stream_as_disjoint_intervals');
    const d = optimal();
    [10, 12, 11, 0].forEach(v => d.addNum(v));
    assert.deepEqual(d.getIntervals(), [[0, 0], [10, 12]]);
  });
});
