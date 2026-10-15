const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const P = require('../02_Implementations/prefix_sum');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(31);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (n, lo = -10, hi = 10) => Array.from({ length: n }, () => randInt(lo, hi));
const sum = (a, l, r) => { let s = 0; for (let i = l; i <= r; i++) s += a[i]; return s; };

describe('buildPrefix / buildSuffix', () => {
  it('handles empty and single arrays', () => {
    assert.deepEqual(P.buildPrefix([]), [0]);
    assert.deepEqual(P.buildPrefix([5]), [0, 5]);
    assert.deepEqual(P.buildSuffix([]), [0]);
    assert.deepEqual(P.buildSuffix([5]), [5, 0]);
  });
  it('prefix[n] equals suffix[0] equals the total, including negatives', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(0, 20));
      const pre = P.buildPrefix(a), suf = P.buildSuffix(a);
      const total = a.reduce((x, y) => x + y, 0);
      assert.equal(pre[a.length], total);
      assert.equal(suf[0], total);
      for (let i = 0; i <= a.length; i++) assert.equal(pre[i] + suf[i], total);
    }
  });
});

describe('NumArray (range sum)', () => {
  it('single-element and whole-array ranges', () => {
    const na = new P.NumArray([-2, 0, 3, -5, 2, -1]);
    assert.equal(na.sumRange(3, 3), -5);
    assert.equal(na.sumRange(0, 5), -3);
  });
  it('matches a loop on random arrays and ranges', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(1, 25));
      const na = new P.NumArray(a);
      for (let q = 0; q < 10; q++) {
        const l = randInt(0, a.length - 1), r = randInt(l, a.length - 1);
        assert.equal(na.sumRange(l, r), sum(a, l, r));
      }
    }
  });
});

describe('NumMatrix (2D range sum)', () => {
  it('handles a 1x1 matrix and a single row', () => {
    assert.equal(new P.NumMatrix([[7]]).sumRegion(0, 0, 0, 0), 7);
    assert.equal(new P.NumMatrix([[1, 2, 3]]).sumRegion(0, 1, 0, 2), 5);
  });
  it('matches nested loops on random matrices', () => {
    for (let t = 0; t < 100; t++) {
      const rows = randInt(1, 6), cols = randInt(1, 6);
      const m = Array.from({ length: rows }, () => randArray(cols));
      const nm = new P.NumMatrix(m);
      for (let q = 0; q < 10; q++) {
        const r1 = randInt(0, rows - 1), r2 = randInt(r1, rows - 1), c1 = randInt(0, cols - 1), c2 = randInt(c1, cols - 1);
        let ref = 0;
        for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) ref += m[r][c];
        assert.equal(nm.sumRegion(r1, c1, r2, c2), ref);
      }
    }
  });
});

describe('DifferenceArray (range updates)', () => {
  it('no updates gives zeros; full-range and single-cell updates', () => {
    assert.deepEqual(new P.DifferenceArray(3).toArray(), [0, 0, 0]);
    const d = new P.DifferenceArray(4);
    d.addToRange(0, 3, 2);
    d.addToRange(2, 2, -5);
    assert.deepEqual(d.toArray(), [2, 2, -3, 2]);
  });
  it('matches direct updates on random batches', () => {
    for (let t = 0; t < 200; t++) {
      const n = randInt(1, 20);
      const d = new P.DifferenceArray(n);
      const ref = new Array(n).fill(0);
      for (let u = 0; u < randInt(0, 15); u++) {
        const l = randInt(0, n - 1), r = randInt(l, n - 1), v = randInt(-5, 5);
        d.addToRange(l, r, v);
        for (let i = l; i <= r; i++) ref[i] += v;
      }
      assert.deepEqual(d.toArray(), ref);
    }
  });
});

describe('buildPrefixXor / buildPrefixMax', () => {
  it('prefix XOR answers range XOR queries', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(1, 15), 0, 63);
      const px = P.buildPrefixXor(a);
      const l = randInt(0, a.length - 1), r = randInt(l, a.length - 1);
      let ref = 0; for (let i = l; i <= r; i++) ref ^= a[i];
      assert.equal(px[r + 1] ^ px[l], ref);
    }
  });
  it('prefix max is non-decreasing and matches Math.max of each prefix', () => {
    assert.deepEqual(P.buildPrefixMax([]), []);
    assert.deepEqual(P.buildPrefixMax([5, 4, 3]), [5, 5, 5]);
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(1, 15));
      const pm = P.buildPrefixMax(a);
      for (let i = 0; i < a.length; i++) assert.equal(pm[i], Math.max(...a.slice(0, i + 1)));
    }
  });
});

describe('solution files: extra edge cases', () => {
  const subK = require('../03_Problems/solutions/05_subarray_sum_equals_k');
  const maxLen = require('../03_Problems/solutions/06_maximum_size_subarray_sum_equals_k');
  const contig = require('../03_Problems/solutions/07_contiguous_array');
  const divK = require('../03_Problems/solutions/08_subarray_sums_divisible_by_k');
  const car = require('../03_Problems/solutions/13_car_pooling');

  it('Subarray Sum Equals K: zeros and negatives vs brute force', () => {
    assert.equal(subK.optimal([0, 0], 0), 3);
    for (let t = 0; t < 200; t++) { const a = randArray(randInt(0, 15), -3, 3); const k = randInt(-4, 4); assert.equal(subK.optimal(a, k), subK.bruteForce(a, k)); }
  });
  it('Maximum Size Subarray Sum Equals k: none found, whole array, random', () => {
    assert.equal(maxLen.optimal([1, 2], 10), 0);
    assert.equal(maxLen.optimal([1, -1, 5, -2, 3], 3), 4);
    for (let t = 0; t < 200; t++) { const a = randArray(randInt(0, 15), -3, 3); const k = randInt(-4, 4); assert.equal(maxLen.optimal(a, k), maxLen.bruteForce(a, k)); }
  });
  it('Contiguous Array: all zeros, alternating, random', () => {
    assert.equal(contig.optimal([0, 0, 0]), 0);
    assert.equal(contig.optimal([0, 1, 0, 1]), 4);
    for (let t = 0; t < 200; t++) { const a = randArray(randInt(0, 15), 0, 1); assert.equal(contig.optimal(a), contig.bruteForce(a)); }
  });
  it('Subarray Sums Divisible by K: negative prefix remainders', () => {
    assert.equal(divK.optimal([-1, 2, 9], 2), 2);
    assert.equal(divK.optimal([-5], 5), 1);
    for (let t = 0; t < 200; t++) { const a = randArray(randInt(1, 15), -9, 9); const k = randInt(1, 6); assert.equal(divK.optimal(a, k), divK.bruteForce(a, k)); }
  });
  it('Car Pooling: drop-off and pick-up at the same stop', () => {
    assert.equal(car.optimal([[2, 1, 5], [3, 5, 7]], 3), true);
    assert.equal(car.optimal([[2, 1, 5], [3, 4, 7]], 4), false);
    for (let t = 0; t < 200; t++) {
      const trips = Array.from({ length: randInt(1, 6) }, () => { const a = randInt(0, 9); return [randInt(1, 4), a, randInt(a + 1, 10)]; });
      const cap = randInt(1, 10);
      assert.equal(car.optimal(trips.map((x) => [...x]), cap), car.bruteForce(trips.map((x) => [...x]), cap));
    }
  });
});
