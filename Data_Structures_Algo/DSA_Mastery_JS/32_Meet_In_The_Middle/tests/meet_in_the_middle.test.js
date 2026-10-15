const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  splitHalves, subsetSums, sortedSubsetSums, subsetSumsBySize,
  countPairsAtMost, closestPairSum, countPairsEqual, lowerBound, upperBound,
  countSubsetsAtMost, closestSubsetSum,
} = require('../02_Implementations/meet_in_the_middle');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const asc = (a, b) => a - b;
function allSums(arr) {
  const out = [];
  for (let m = 0; m < 1 << arr.length; m++) {
    let s = 0;
    for (let i = 0; i < arr.length; i++) if (m & (1 << i)) s += arr[i];
    out.push(s);
  }
  return out;
}

describe('meet in the middle helpers', () => {
  it('handles normal case', () => {
    assert.deepEqual(splitHalves([1, 2, 3, 4]), [[1, 2], [3, 4]]);
    assert.deepEqual(sortedSubsetSums([1, 2, 4]), [0, 1, 2, 3, 4, 5, 6, 7]);
    assert.equal(countSubsetsAtMost([1, 2, 3], 3), 5);
    assert.equal(closestSubsetSum([7, -9, 15, -2], -5), 1);
  });

  it('handles empty input', () => {
    assert.deepEqual(splitHalves([]), [[], []]);
    assert.deepEqual(subsetSums([]), [0]);
    assert.deepEqual(sortedSubsetSums([]), [0]);
    assert.deepEqual(subsetSumsBySize([]), [[0]]);
    assert.equal(countPairsAtMost([], [], 5), 0);
    assert.equal(countPairsEqual([], [1], 1), 0);
    assert.throws(() => closestPairSum([], [1], 0), RangeError);
    assert.equal(countSubsetsAtMost([], 0), 1);
    assert.equal(countSubsetsAtMost([], -1), 0);
  });

  it('handles duplicates and negatives', () => {
    assert.deepEqual(sortedSubsetSums([2, 2]), [0, 2, 2, 4]);   // duplicates kept: two different subsets
    assert.equal(countPairsEqual([0, 0], [0, 0, 0], 0), 6);
    assert.deepEqual(sortedSubsetSums([-3, 1]), [-3, -2, 0, 1]);
    assert.equal(lowerBound([1, 2, 2, 3], 2), 1);
    assert.equal(upperBound([1, 2, 2, 3], 2), 3);
    assert.equal(lowerBound([], 5), 0);
    assert.equal(countSubsetsAtMost([-1, -1, -1], -2), 4);
  });

  it('subsetSumsBySize groups by number of chosen items', () => {
    const by = subsetSumsBySize([1, 2, 4]).map(l => l.sort(asc));
    assert.deepEqual(by, [[0], [1, 2, 4], [3, 5, 6], [7]]);
  });

  it('rejects halves that are too large', () => {
    assert.throws(() => subsetSums(new Array(30).fill(1)), RangeError);
    assert.throws(() => subsetSumsBySize(new Array(21).fill(1)), RangeError);
  });

  it('matches brute force on random inputs', () => {
    const rand = mulberry32(2024);
    for (let t = 0; t < 200; t++) {
      const n = Math.floor(rand() * 12);
      const arr = Array.from({ length: n }, () => Math.floor(rand() * 41) - 20);
      const all = allSums(arr).sort(asc);
      assert.deepEqual(sortedSubsetSums(arr), all);
      const target = Math.floor(rand() * 61) - 30;
      assert.equal(countSubsetsAtMost(arr, target), all.filter(s => s <= target).length);
      assert.equal(closestSubsetSum(arr, target), Math.min(...all.map(s => Math.abs(s - target))));
      const [L, R] = splitHalves(arr);
      const expectedEq = all.filter(s => s === target).length;
      assert.equal(countPairsEqual(subsetSums(L), subsetSums(R), target), expectedEq);
    }
  });
});

describe('meet in the middle problem solutions', () => {
  const four = require('../03_Problems/solutions/01_four_sum_ii');
  const atMost = require('../03_Problems/solutions/02_subset_sum_count_at_most');
  const split = require('../03_Problems/solutions/03_equal_sum_split');
  const closest = require('../03_Problems/solutions/04_closest_subsequence_sum');
  const partition = require('../03_Problems/solutions/05_partition_min_sum_difference');
  const average = require('../03_Problems/solutions/06_split_array_same_average');

  it('4Sum II extra edge cases', () => {
    assert.equal(four.optimal([1, -1], [0], [0], [0]), 0);
    assert.equal(four.optimal([1, -1], [1, -1], [0], [0]), 2);
    assert.equal(four.optimal([1e9], [-1e9], [1e9], [-1e9]), 1);
  });

  it('subset count <= target extra edge cases', () => {
    assert.equal(atMost.optimal([0, 0, 0], 0), 8);
    assert.equal(atMost.optimal([1e9, 1e9], 1e9), 3);
  });

  it('equal-sum split extra edge cases', () => {
    assert.equal(split.optimal([2, 4, 6]), 2);
    assert.equal(split.optimal([1, 3]), 0);
  });

  it('closest subsequence sum extra edge cases', () => {
    assert.equal(closest.optimal([0], 0), 0);
    assert.equal(closest.optimal([-5], -100), 95);
  });

  it('partition and same-average extra edge cases', () => {
    assert.equal(partition.optimal([0, 0]), 0);
    assert.equal(partition.optimal([-1, -1, 4, 4]), 0);
    assert.equal(average.optimal([1, 3]), false);
    assert.equal(average.optimal([2, 2]), true);
    assert.equal(average.optimal([0]), false);
  });
});
