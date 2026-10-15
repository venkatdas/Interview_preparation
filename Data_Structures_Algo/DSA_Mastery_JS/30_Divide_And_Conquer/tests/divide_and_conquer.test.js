// node:test suite for 30_Divide_And_Conquer.
// Run: node --test 30_Divide_And_Conquer/tests/divide_and_conquer.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  mergeSort, merge, countInversions, maxSubarrayDC, power, mulMod, mergeKSortedArrays,
} = require('../02_Implementations/divide_and_conquer');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(30);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArr = (len, lo = -20, hi = 20) => Array.from({ length: len }, () => randInt(lo, hi));
const numSort = (a) => a.slice().sort((x, y) => x - y);

function bruteInversions(a) {
  let c = 0;
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) c++;
  return c;
}
function bruteMaxSub(a) {
  let best = -Infinity;
  for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; best = Math.max(best, s); } }
  return best;
}

describe('mergeSort / merge', () => {
  it('sorts normal, empty, single, duplicates, sorted and reverse-sorted input', () => {
    assert.deepEqual(mergeSort([5, 2, 9, 1]), [1, 2, 5, 9]);
    assert.deepEqual(mergeSort([]), []);
    assert.deepEqual(mergeSort([7]), [7]);
    assert.deepEqual(mergeSort([3, 1, 3, 1]), [1, 1, 3, 3]);
    assert.deepEqual(mergeSort([1, 2, 3, 4]), [1, 2, 3, 4]);
    assert.deepEqual(mergeSort([4, 3, 2, 1]), [1, 2, 3, 4]);
  });
  it('does not mutate the input', () => {
    const a = [3, 1, 2];
    mergeSort(a);
    assert.deepEqual(a, [3, 1, 2]);
  });
  it('merge handles one empty side', () => {
    assert.deepEqual(merge([], [1, 2]), [1, 2]);
    assert.deepEqual(merge([1, 2], []), [1, 2]);
    assert.deepEqual(merge([], []), []);
  });
  it('matches built-in sort on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArr(randInt(0, 40));
      assert.deepEqual(mergeSort(a), numSort(a));
    }
  });
});

describe('countInversions', () => {
  it('handles known cases', () => {
    assert.equal(countInversions([2, 4, 1, 3, 5]), 3);
    assert.equal(countInversions([]), 0);
    assert.equal(countInversions([1]), 0);
    assert.equal(countInversions([1, 2, 3]), 0);
    assert.equal(countInversions([5, 4, 3, 2, 1]), 10); // n(n-1)/2
  });
  it('does not count equal elements', () => {
    assert.equal(countInversions([2, 2, 2]), 0);
    assert.equal(countInversions([3, 3, 1]), 2);
  });
  it('matches O(n^2) brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArr(randInt(0, 30), -5, 5);
      assert.equal(countInversions(a), bruteInversions(a));
    }
  });
});

describe('maxSubarrayDC', () => {
  it('handles the classic example, single, all-negative and empty', () => {
    assert.equal(maxSubarrayDC([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    assert.equal(maxSubarrayDC([-7]), -7);
    assert.equal(maxSubarrayDC([-3, -1, -2]), -1);
    assert.equal(maxSubarrayDC([]), 0);
  });
  it('handles all-positive (whole array) and zeros', () => {
    assert.equal(maxSubarrayDC([1, 2, 3]), 6);
    assert.equal(maxSubarrayDC([0, 0, 0]), 0);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArr(randInt(1, 30));
      assert.equal(maxSubarrayDC(a), bruteMaxSub(a));
    }
  });
});

describe('power / mulMod', () => {
  it('handles exponent 0, 1, negative, and base 0 / 1 / -1', () => {
    assert.equal(power(5, 0), 1);
    assert.equal(power(5, 1), 5);
    assert.equal(power(2, -3), 0.125);
    assert.equal(power(0, 5), 0);
    assert.equal(power(1, 1e9), 1);
    assert.equal(power(-1, 1e9 + 1), -1);
  });
  it('modular power matches BigInt for large exponents', () => {
    const MOD = 1_000_000_007;
    for (let t = 0; t < 100; t++) {
      const base = randInt(-1e9, 1e9);
      const exp = randInt(0, 1e9);
      let r = 1n, b = ((BigInt(base) % BigInt(MOD)) + BigInt(MOD)) % BigInt(MOD), e = BigInt(exp);
      while (e > 0n) { if (e & 1n) r = (r * b) % BigInt(MOD); b = (b * b) % BigInt(MOD); e >>= 1n; }
      assert.equal(power(base, exp, MOD), Number(r));
    }
  });
  it('mulMod matches BigInt for values near 1e9 (no 2^53 overflow)', () => {
    const MOD = 1_000_000_007;
    for (let t = 0; t < 200; t++) {
      const a = randInt(0, MOD - 1), b = randInt(0, MOD - 1);
      assert.equal(mulMod(a, b, MOD), Number((BigInt(a) * BigInt(b)) % BigInt(MOD)));
    }
  });
  it('matches Math.pow for small integers', () => {
    for (let t = 0; t < 200; t++) {
      const b = randInt(-6, 6), e = randInt(0, 15);
      assert.equal(power(b, e), Math.pow(b, e));
    }
  });
});

describe('mergeKSortedArrays', () => {
  it('handles no arrays, empty arrays and a single array', () => {
    assert.deepEqual(mergeKSortedArrays([]), []);
    assert.deepEqual(mergeKSortedArrays([[], [], []]), []);
    assert.deepEqual(mergeKSortedArrays([[1, 2, 3]]), [1, 2, 3]);
  });
  it('merges with duplicates and negatives', () => {
    assert.deepEqual(mergeKSortedArrays([[1, 4, 5], [1, 3, 4], [2, 6]]), [1, 1, 2, 3, 4, 4, 5, 6]);
    assert.deepEqual(mergeKSortedArrays([[-3, 0], [-5], [0, 0]]), [-5, -3, 0, 0, 0]);
  });
  it('does not return the same array object for k = 1', () => {
    const only = [1, 2];
    assert.notEqual(mergeKSortedArrays([only]), only);
  });
  it('matches flatten + sort on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const arrays = Array.from({ length: randInt(0, 7) }, () => numSort(randArr(randInt(0, 8))));
      assert.deepEqual(mergeKSortedArrays(arrays), numSort(arrays.flat()));
    }
  });
});

// ---------- selected problem solutions on extra edge cases ----------
describe('solutions: extra edge cases', () => {
  const pow = require('../03_Problems/solutions/01_pow_and_super_pow');
  const maxSub = require('../03_Problems/solutions/02_maximum_subarray_dc');
  const beautiful = require('../03_Problems/solutions/05_beautiful_array');
  const smaller = require('../03_Problems/solutions/06_count_of_smaller_numbers_after_self');
  const median = require('../03_Problems/solutions/07_median_of_two_sorted_arrays');

  it('Pow(x, n) and Super Pow: zero exponent, negative exponent, fractional base', () => {
    assert.equal(pow.optimal(3, 0), 1);
    assert.equal(pow.optimal(-2, 3), -8);
    assert.ok(Math.abs(pow.optimal(2, -10) - 1 / 1024) < 1e-15);
    assert.ok(Math.abs(pow.optimal(0.5, 4) - 0.0625) < 1e-15);
    assert.equal(pow.superPow(2, [0]), 1);
    assert.equal(pow.superPow(1337, [5, 0]), 0);
    for (let t = 0; t < 100; t++) {
      const a = randInt(1, 3000);
      const b = String(randInt(0, 500)).split('').map(Number);
      assert.equal(pow.superPow(a, b), pow.superPowBrute(a, b));
    }
  });

  it('Maximum Subarray: single negative, alternating signs, random vs brute', () => {
    assert.equal(maxSub.optimal([-1]), -1);
    assert.equal(maxSub.optimal([5, -9, 6, -2, 3]), 7);
    for (let t = 0; t < 200; t++) {
      const a = randArr(randInt(1, 25));
      assert.equal(maxSub.optimal(a), maxSub.bruteForce(a));
    }
  });

  it('Beautiful Array: every n from 1 to 60 is a valid permutation', () => {
    for (let n = 1; n <= 60; n++) {
      const arr = beautiful.optimal(n);
      assert.deepEqual(numSort(arr), Array.from({ length: n }, (_, i) => i + 1));
      assert.ok(beautiful.isBeautiful(arr), `n=${n}`);
    }
  });

  it('Count of Smaller After Self: empty, duplicates, sorted ascending, random vs brute', () => {
    assert.deepEqual(smaller.optimal([]), []);
    assert.deepEqual(smaller.optimal([2, 2, 2]), [0, 0, 0]);
    assert.deepEqual(smaller.optimal([1, 2, 3]), [0, 0, 0]);
    assert.deepEqual(smaller.optimal([3, 2, 1]), [2, 1, 0]);
    for (let t = 0; t < 200; t++) {
      const a = randArr(randInt(0, 25), -4, 4);
      assert.deepEqual(smaller.optimal(a), smaller.bruteForce(a));
    }
  });

  it('Median of Two Sorted Arrays: one empty, all equal, disjoint ranges, random vs brute', () => {
    assert.equal(median.optimal([], [1]), 1);
    assert.equal(median.optimal([2, 2], [2, 2]), 2);
    assert.equal(median.optimal([1, 2], [3, 4]), 2.5);
    assert.equal(median.optimal([10, 20, 30], [1]), 15);
    for (let t = 0; t < 200; t++) {
      const a = numSort(randArr(randInt(0, 8)));
      const b = numSort(randArr(randInt(a.length === 0 ? 1 : 0, 8)));
      assert.equal(median.optimal(a, b), median.bruteForce(a, b));
    }
  });
});
