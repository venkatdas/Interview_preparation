const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const B = require('../02_Implementations/binary_search_templates');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(41);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const sortedArray = (n, lo = -10, hi = 10) => Array.from({ length: n }, () => randInt(lo, hi)).sort((a, b) => a - b);
const bruteLower = (a, x) => { const i = a.findIndex((v) => v >= x); return i === -1 ? a.length : i; };
const bruteUpper = (a, x) => { const i = a.findIndex((v) => v > x); return i === -1 ? a.length : i; };

describe('search / searchRecursive (exact match)', () => {
  it('empty, single, first, last, missing', () => {
    for (const f of [B.search, B.searchRecursive]) {
      assert.equal(f([], 1), -1);
      assert.equal(f([4], 4), 0);
      assert.equal(f([4], 5), -1);
      assert.equal(f([1, 3, 5], 1), 0);
      assert.equal(f([1, 3, 5], 5), 2);
      assert.equal(f([1, 3, 5], 4), -1);
    }
  });
  it('finds some copy among duplicates and works with negatives', () => {
    const a = [-3, -3, -3, 0, 2];
    assert.equal(a[B.search(a, -3)], -3);
  });
  it('matches includes/indexOf on random sorted arrays', () => {
    for (let t = 0; t < 300; t++) {
      const a = sortedArray(randInt(0, 25)), x = randInt(-12, 12);
      for (const f of [B.search, B.searchRecursive]) {
        const i = f(a, x);
        if (a.includes(x)) assert.equal(a[i], x); else assert.equal(i, -1);
      }
    }
  });
});

describe('lowerBound / upperBound', () => {
  it('insert position at front, middle and end', () => {
    assert.equal(B.lowerBound([2, 4], 1), 0);
    assert.equal(B.lowerBound([2, 4], 3), 1);
    assert.equal(B.lowerBound([2, 4], 5), 2);
    assert.equal(B.upperBound([], 0), 0);
  });
  it('count of a value = upper - lower (duplicates)', () => {
    const a = [1, 2, 2, 2, 5];
    assert.equal(B.upperBound(a, 2) - B.lowerBound(a, 2), 3);
    assert.equal(B.upperBound(a, 3) - B.lowerBound(a, 3), 0);
  });
  it('match linear scans on random sorted arrays', () => {
    for (let t = 0; t < 300; t++) {
      const a = sortedArray(randInt(0, 25)), x = randInt(-12, 12);
      assert.equal(B.lowerBound(a, x), bruteLower(a, x));
      assert.equal(B.upperBound(a, x), bruteUpper(a, x));
    }
  });
});

describe('searchOnAnswer / searchLast / searchReal', () => {
  it('first true and last true on monotone predicates', () => {
    assert.equal(B.searchOnAnswer(0, 100, () => true), 0);
    assert.equal(B.searchOnAnswer(0, 100, (x) => x >= 100), 100);
    assert.equal(B.searchLast(0, 100, () => true), 100);
    assert.equal(B.searchLast(0, 100, (x) => x <= 0), 0);
  });
  it('match a linear scan for random thresholds', () => {
    for (let t = 0; t < 300; t++) {
      const lo = randInt(-50, 0), hi = randInt(1, 50), th = randInt(lo, hi);
      assert.equal(B.searchOnAnswer(lo, hi, (x) => x >= th), th);
      assert.equal(B.searchLast(lo, hi, (x) => x <= th), th);
    }
  });
  it('works on ranges beyond 32-bit integers', () => {
    const big = 2 ** 40 + 7;
    assert.equal(B.searchOnAnswer(0, 2 ** 45, (x) => x >= big), big);
  });
  it('searchReal finds square and cube roots', () => {
    assert.ok(Math.abs(B.searchReal(0, 2, (x) => x * x < 2) - Math.SQRT2) < 1e-9);
    assert.ok(Math.abs(B.searchReal(0, 30, (x) => x * x * x < 27) - 3) < 1e-9);
  });
});

describe('solution files: extra edge cases', () => {
  const firstLast = require('../03_Problems/solutions/04_first_and_last_position');
  const rotated = require('../03_Problems/solutions/07_search_rotated_sorted_array');
  const minRot = require('../03_Problems/solutions/09_find_minimum_rotated_sorted_array');
  const koko = require('../03_Problems/solutions/12_koko_eating_bananas');
  const median = require('../03_Problems/solutions/16_median_of_two_sorted_arrays');
  const rotate = (a, k) => a.slice(k).concat(a.slice(0, k));

  it('First and Last Position: empty, all equal, random vs brute force', () => {
    assert.deepEqual(firstLast.optimal([], 1), [-1, -1]);
    assert.deepEqual(firstLast.optimal([2, 2, 2], 2), [0, 2]);
    for (let t = 0; t < 200; t++) { const a = sortedArray(randInt(0, 15), 0, 5); const x = randInt(-1, 6); assert.deepEqual(firstLast.optimal(a, x), firstLast.bruteForce(a, x)); }
  });
  it('Search in Rotated Sorted Array: two elements, not rotated, every rotation', () => {
    assert.equal(rotated.optimal([3, 1], 1), 1);
    assert.equal(rotated.optimal([1, 3], 3), 1);
    for (let t = 0; t < 200; t++) {
      const base = [...new Set(sortedArray(randInt(1, 12), -20, 20))];
      const a = rotate(base, randInt(0, base.length - 1));
      const x = randInt(-21, 21);
      assert.equal(rotated.optimal(a, x), a.indexOf(x));
    }
  });
  it('Find Minimum in Rotated Sorted Array: every rotation', () => {
    assert.equal(minRot.optimal([1]), 1);
    for (let t = 0; t < 200; t++) {
      const base = [...new Set(sortedArray(randInt(1, 12), -20, 20))];
      assert.equal(minRot.optimal(rotate(base, randInt(0, base.length - 1))), base[0]);
    }
  });
  it('Koko Eating Bananas: h equals number of piles, single pile, random', () => {
    assert.equal(koko.optimal([3, 6, 7, 11], 4), 11);
    assert.equal(koko.optimal([10], 10), 1);
    for (let t = 0; t < 100; t++) { const piles = Array.from({ length: randInt(1, 6) }, () => randInt(1, 30)); const h = randInt(piles.length, 40); assert.equal(koko.optimal(piles, h), koko.bruteForce(piles, h)); }
  });
  it('Median of Two Sorted Arrays: one empty, different sizes, random vs merge', () => {
    assert.equal(median.optimal([], [1]), 1);
    assert.equal(median.optimal([1, 2], [3, 4]), 2.5);
    for (let t = 0; t < 200; t++) {
      const a = sortedArray(randInt(0, 8)), b = sortedArray(randInt(a.length ? 0 : 1, 8));
      assert.equal(median.optimal(a, b), median.bruteForce(a, b));
    }
  });
});
