/**
 * 02. Subset Sum Count <= Target   (Original — Medium)
 *
 * PROBLEM
 * Given n integers (n <= 40, values may be negative, |value| <= 1e9) and a target T,
 * count how many of the 2^n subsets (including the empty one) have sum <= T.
 *
 * EXAMPLES
 * nums=[1,2,3], T=3   -> 5   ({}, {1}, {2}, {3}, {1,2})
 * nums=[-5,10], T=0   -> 2   ({}, {-5})
 * nums=[], T=-1       -> 0   (the empty subset has sum 0 > -1)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Does the empty subset count? (yes)
 * - Are equal-valued elements different subsets? (yes, subsets are by index)
 * - Sums fit in a double exactly? (40 * 1e9 = 4e10 < 2^53, yes)
 *
 * APPROACH 1 — Brute force   O(2^n * n) time, O(1) space
 * Loop over every bitmask, add the chosen values, compare with T. Fine for n <= 20,
 * hopeless for n = 40 (~10^12 subsets).
 *
 * APPROACH 2 — Optimal (meet in the middle + two pointers)   O(2^(n/2)) time and space
 * A subset = (subset of left half) + (subset of right half). So:
 *   L = sorted subset sums of left half, R = sorted subset sums of right half.
 *   Count pairs (l, r) with l + r <= T. Both sorted -> two pointers:
 *   i goes up through L, j comes down through R; for each L[i] all of R[0..j] work.
 * Sorted sums are produced by merging (sortedSubsetSums), so no extra log factor.
 *
 * Dry run nums=[1,2,3], T=3: left=[1] -> L=[0,1]; right=[2,3] -> R=[0,2,3,5]
 *   i=0 (L=0): j from 3: 0+5>3 j=2; 0+3<=3 -> add 3
 *   i=1 (L=1): 1+3>3 j=1; 1+2<=3 -> add 2
 *   total 5
 *
 * EDGE CASES
 * - empty array -> 1 if T >= 0 else 0
 * - all negative values, T very large -> 2^n
 */
const { splitHalves, sortedSubsetSums, countPairsAtMost } = require('../../02_Implementations/meet_in_the_middle');

function bruteForce(nums, T) {
  let count = 0;
  for (let mask = 0; mask < 2 ** nums.length; mask++) {
    let s = 0;
    for (let i = 0; i < nums.length; i++) if (mask & (1 << i)) s += nums[i];
    if (s <= T) count++;
  }
  return count;
}

function optimal(nums, T) {
  const [left, right] = splitHalves(nums);
  return countPairsAtMost(sortedSubsetSums(left), sortedSubsetSums(right), T);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3], 3), 5);
  assert.strictEqual(solve([-5, 10], 0), 2);
  assert.strictEqual(solve([], -1), 0);
  assert.strictEqual(solve([], 0), 1);
  assert.strictEqual(solve([2, 2, 2], 2), 4);
  assert.strictEqual(solve([-1, -2, -3], 100), 8);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2);
for (let t = 0; t < 200; t++) {
  const n = Math.floor(rand() * 14);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 21) - 10);
  const T = Math.floor(rand() * 41) - 20;
  assert.strictEqual(optimal(nums, T), bruteForce(nums, T));
}
// n = 40, all ones: subsets with sum <= 20 = sum_{k<=20} C(40,k)
const ones = new Array(40).fill(1);
let expected = 0, c = 1;
for (let k = 0; k <= 20; k++) { expected += c; c = (c * (40 - k)) / (k + 1); }
assert.strictEqual(optimal(ones, 20), expected);
console.log('✓ 02_subset_sum_count_at_most passed');

module.exports = { optimal, bruteForce };
