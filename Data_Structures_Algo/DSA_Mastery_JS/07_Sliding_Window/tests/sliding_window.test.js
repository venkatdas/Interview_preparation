const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const W = require('../02_Implementations/sliding_window_templates');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(23);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

// Brute-force references: check every subarray.
const bruteFixed = (a, k) => { if (a.length < k || k === 0) return 0; let best = -Infinity; for (let i = 0; i + k <= a.length; i++) best = Math.max(best, a.slice(i, i + k).reduce((x, y) => x + y, 0)); return best; };
const distinct = (a, i, j) => new Set(a.slice(i, j + 1)).size;
const bruteMaxDistinct = (a, m) => { let best = 0; for (let i = 0; i < a.length; i++) for (let j = i; j < a.length; j++) if (distinct(a, i, j) <= m) best = Math.max(best, j - i + 1); return best; };
const bruteMinLen = (a, target) => { let best = Infinity; for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; if (s >= target) { best = Math.min(best, j - i + 1); break; } } } return best === Infinity ? 0 : best; };
const bruteCount = (a, pred) => { let c = 0; for (let i = 0; i < a.length; i++) for (let j = i; j < a.length; j++) if (pred(distinct(a, i, j))) c++; return c; };
const bruteWindowMax = (a, k) => { const out = []; for (let i = 0; i + k <= a.length; i++) out.push(Math.max(...a.slice(i, i + k))); return out; };

describe('fixedWindow', () => {
  it('normal, k = n, k > n, k = 0', () => {
    assert.equal(W.fixedWindow([2, 1, 5, 1, 3, 2], 3), 9);
    assert.equal(W.fixedWindow([1, 2, 3], 3), 6);
    assert.equal(W.fixedWindow([1, 2], 3), 0);
    assert.equal(W.fixedWindow([1, 2], 0), 0);
  });
  it('all negative values', () => {
    assert.equal(W.fixedWindow([-5, -1, -3], 2), -4);
  });
  it('matches brute force on random input', () => {
    for (let t = 0; t < 300; t++) {
      const a = randArray(randInt(1, 20), -10, 10);
      const k = randInt(1, a.length);
      assert.equal(W.fixedWindow(a, k), bruteFixed(a, k));
    }
  });
});

describe('variableWindowMax (longest window with at most m distinct values)', () => {
  it('handles empty, all-equal and all-distinct arrays', () => {
    assert.equal(W.variableWindowMax([], 2), 0);
    assert.equal(W.variableWindowMax([7, 7, 7], 1), 3);
    assert.equal(W.variableWindowMax([1, 2, 3, 4], 1), 1);
    assert.equal(W.variableWindowMax([1, 2, 3, 4], 10), 4);
  });
  it('matches brute force on random input', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(0, 15), 0, 4);
      const m = randInt(1, 4);
      assert.equal(W.variableWindowMax(a, m), bruteMaxDistinct(a, m));
    }
  });
});

describe('variableWindowMin (shortest window with sum >= target, positives)', () => {
  it('handles impossible targets, single element and whole array', () => {
    assert.equal(W.variableWindowMin([1, 1, 1], 10), 0);
    assert.equal(W.variableWindowMin([10], 7), 1);
    assert.equal(W.variableWindowMin([1, 2, 3], 6), 3);
    assert.equal(W.variableWindowMin([], 1), 0);
  });
  it('matches brute force on random positive input', () => {
    for (let t = 0; t < 300; t++) {
      const a = randArray(randInt(0, 20), 1, 9);
      const target = randInt(1, 40);
      assert.equal(W.variableWindowMin(a, target), bruteMinLen(a, target));
    }
  });
});

describe('atMostK / exactlyK', () => {
  it('handles k = 0 and negative k without hanging', () => {
    assert.equal(W.atMostK([1, 2], 0), 0);
    assert.equal(W.atMostK([1, 2], -1), 0);
    assert.equal(W.exactlyK([1, 2], 0), 0);
  });
  it('known values', () => {
    assert.equal(W.atMostK([1, 2, 1, 2, 3], 2), 12);
    assert.equal(W.exactlyK([1, 2, 1, 2, 3], 2), 7);
    assert.equal(W.exactlyK([], 1), 0);
  });
  it('match brute force counts on random input', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(0, 12), 1, 4);
      const k = randInt(1, 4);
      assert.equal(W.atMostK(a, k), bruteCount(a, (d) => d <= k));
      assert.equal(W.exactlyK(a, k), bruteCount(a, (d) => d === k));
    }
  });
});

describe('monotonicDequeMax', () => {
  it('handles k = 1, k = n, sorted and reverse-sorted input', () => {
    assert.deepEqual(W.monotonicDequeMax([3, 1, 2], 1), [3, 1, 2]);
    assert.deepEqual(W.monotonicDequeMax([3, 1, 2], 3), [3]);
    assert.deepEqual(W.monotonicDequeMax([1, 2, 3, 4], 2), [2, 3, 4]);
    assert.deepEqual(W.monotonicDequeMax([4, 3, 2, 1], 2), [4, 3, 2]);
    assert.deepEqual(W.monotonicDequeMax([], 2), []);
  });
  it('handles duplicates and negatives', () => {
    assert.deepEqual(W.monotonicDequeMax([-1, -1, -3, -1], 2), [-1, -1, -1]);
  });
  it('matches brute force on random input', () => {
    for (let t = 0; t < 300; t++) {
      const a = randArray(randInt(1, 20), -10, 10);
      const k = randInt(1, a.length);
      assert.deepEqual(W.monotonicDequeMax(a, k), bruteWindowMax(a, k));
    }
  });
});

describe('solution files: extra edge cases', () => {
  const lsw = require('../03_Problems/solutions/03_longest_substring_without_repeating');
  const rep = require('../03_Problems/solutions/04_longest_repeating_character_replacement');
  const kdiff = require('../03_Problems/solutions/11_subarrays_with_k_different_integers');
  const mws = require('../03_Problems/solutions/14_minimum_window_substring');
  const flips = require('../03_Problems/solutions/15_min_k_consecutive_bit_flips');
  const randStr = (n, abc) => Array.from({ length: n }, () => abc[randInt(0, abc.length - 1)]).join('');

  it('Longest Substring Without Repeating: empty, spaces, random vs brute force', () => {
    assert.equal(lsw.optimal(''), 0);
    assert.equal(lsw.optimal(' '), 1);
    assert.equal(lsw.optimal('abba'), 2);
    for (let t = 0; t < 200; t++) { const s = randStr(randInt(0, 15), 'abcd'); assert.equal(lsw.optimal(s), lsw.bruteForce(s)); }
  });
  it('Longest Repeating Character Replacement: k = 0, k >= n, random vs brute force', () => {
    assert.equal(rep.optimal('ABAB', 0), 1);
    assert.equal(rep.optimal('ABC', 5), 3);
    for (let t = 0; t < 200; t++) { const s = randStr(randInt(1, 12), 'AB'); const k = randInt(0, 3); assert.equal(rep.optimal(s, k), rep.bruteForce(s, k)); }
  });
  it('Subarrays with K Different Integers: random vs brute force', () => {
    for (let t = 0; t < 200; t++) { const a = randArray(randInt(1, 12), 1, 4); const k = randInt(1, 4); assert.equal(kdiff.optimal(a, k), kdiff.bruteForce(a, k)); }
  });
  it('Minimum Window Substring: repeated chars in t, no window, t longer than s', () => {
    assert.equal(mws.optimal('ADOBECODEBANC', 'ABC'), 'BANC');
    assert.equal(mws.optimal('aa', 'aa'), 'aa');
    assert.equal(mws.optimal('a', 'aa'), '');
    assert.equal(mws.optimal('abc', 'd'), '');
    for (let t = 0; t < 200; t++) {
      const s = randStr(randInt(1, 12), 'abc'), p = randStr(randInt(1, 3), 'abc');
      assert.equal(mws.optimal(s, p).length, mws.bruteForce(s, p).length);
    }
  });
  it('Minimum K Consecutive Bit Flips: impossible case and random vs brute force', () => {
    assert.equal(flips.optimal([1, 1, 0], 2), -1);
    assert.equal(flips.optimal([1, 1, 1], 3), 0);
    for (let t = 0; t < 200; t++) { const a = randArray(randInt(1, 12), 0, 1); const k = randInt(1, a.length); assert.equal(flips.optimal([...a], k), flips.bruteForce([...a], k)); }
  });
});
