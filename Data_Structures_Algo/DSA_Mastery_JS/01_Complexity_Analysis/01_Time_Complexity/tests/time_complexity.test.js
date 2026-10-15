const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const C = require('../02_Implementations/complexity_examples');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(11);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (n, lo, hi) => Array.from({ length: n }, () => randInt(lo, hi));

describe('O(1) and O(log n): getFirst, binarySearch', () => {
  it('getFirst returns the first element or undefined', () => {
    assert.equal(C.getFirst([4, 5]), 4);
    assert.equal(C.getFirst([]), undefined);
  });
  it('binarySearch handles empty, single, ends and missing values', () => {
    assert.equal(C.binarySearch([], 3), -1);
    assert.equal(C.binarySearch([3], 3), 0);
    assert.equal(C.binarySearch([1, 3, 5, 7], 1), 0);
    assert.equal(C.binarySearch([1, 3, 5, 7], 7), 3);
    assert.equal(C.binarySearch([1, 3, 5, 7], 4), -1);
    assert.equal(C.binarySearch([-9, -3, 0, 2], -3), 1);
  });
  it('binarySearch matches indexOf on random sorted distinct arrays', () => {
    for (let t = 0; t < 200; t++) {
      const arr = [...new Set(randArray(randInt(0, 30), -50, 50))].sort((a, b) => a - b);
      const target = randInt(-55, 55);
      assert.equal(C.binarySearch(arr, target), arr.indexOf(target));
    }
  });
});

describe('O(n) and O(n log n): sumAll, mergeSort', () => {
  it('sumAll handles empty and negatives', () => {
    assert.equal(C.sumAll([]), 0);
    assert.equal(C.sumAll([-1, -2, 3]), 0);
  });
  it('mergeSort handles empty, single, duplicates, sorted and reverse-sorted input', () => {
    assert.deepEqual(C.mergeSort([]), []);
    assert.deepEqual(C.mergeSort([1]), [1]);
    assert.deepEqual(C.mergeSort([2, 1, 2, 1]), [1, 1, 2, 2]);
    assert.deepEqual(C.mergeSort([1, 2, 3, 4]), [1, 2, 3, 4]);
    assert.deepEqual(C.mergeSort([4, 3, 2, 1]), [1, 2, 3, 4]);
  });
  it('mergeSort matches the built-in sort on random arrays', () => {
    for (let t = 0; t < 200; t++) {
      const arr = randArray(randInt(0, 40), -100, 100);
      assert.deepEqual(C.mergeSort(arr), [...arr].sort((a, b) => a - b));
    }
  });
});

describe('O(n^2): hasDuplicatePair, countCommon', () => {
  it('hasDuplicatePair edge cases', () => {
    assert.equal(C.hasDuplicatePair([]), false);
    assert.equal(C.hasDuplicatePair([1]), false);
    assert.equal(C.hasDuplicatePair([1, 2, 1]), true);
    assert.equal(C.hasDuplicatePair([-1, 1]), false);
  });
  it('hasDuplicatePair agrees with a Set on random input', () => {
    for (let t = 0; t < 200; t++) {
      const arr = randArray(randInt(0, 20), 0, 30);
      assert.equal(C.hasDuplicatePair(arr), new Set(arr).size !== arr.length);
    }
  });
  it('countCommon counts every matching pair', () => {
    assert.equal(C.countCommon([], [1]), 0);
    assert.equal(C.countCommon([1, 2], [2, 3]), 1);
    assert.equal(C.countCommon([1, 1], [1, 1]), 4);
  });
});

describe('exponential and factorial: allSubsets, fib, allPermutations', () => {
  it('allSubsets returns 2^n subsets', () => {
    assert.deepEqual(C.allSubsets([]), [[]]);
    for (let n = 0; n <= 8; n++) assert.equal(C.allSubsets(Array.from({ length: n }, (_, i) => i)).length, 2 ** n);
    const keys = C.allSubsets([1, 2, 3]).map((s) => s.join(',')).sort();
    assert.deepEqual(keys, ['', '1', '1,2', '1,2,3', '1,3', '2', '2,3', '3']);
  });
  it('fibNaive and fibMemo agree; memo handles larger n', () => {
    for (let n = 0; n <= 20; n++) assert.equal(C.fibMemo(n), C.fibNaive(n));
    assert.equal(C.fibMemo(50), 12586269025);
  });
  it('allPermutations returns n! distinct orderings', () => {
    assert.deepEqual(C.allPermutations([]), [[]]);
    const perms = C.allPermutations([1, 2, 3, 4]);
    assert.equal(perms.length, 24);
    assert.equal(new Set(perms.map((p) => p.join(','))).size, 24);
  });
});

describe('amortized analysis: simulatePushes', () => {
  it('copies fewer than 2n elements in total', () => {
    assert.equal(C.simulatePushes(0), 0);
    assert.equal(C.simulatePushes(1), 0);
    assert.equal(C.simulatePushes(5), 1 + 2 + 4);
    for (const n of [10, 100, 1000, 12345]) assert.ok(C.simulatePushes(n) < 2 * n);
  });
});
