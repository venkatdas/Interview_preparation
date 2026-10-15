/**
 * 05. Count of Range Sum, sorted-list version   (LeetCode 327 — Hard)
 *
 * PROBLEM
 * Count the subarrays of nums whose sum lies in [lower, upper] (inclusive).
 *
 * EXAMPLES
 * Input: nums = [-2,5,-1], lower = -2, upper = 2   Output: 3   ([-2], [-1], [-2,5,-1])
 * Input: nums = [0], lower = 0, upper = 0           Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5; sums fit in doubles
 * - Subarrays are non-empty and contiguous
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * For every start extend the end with a running sum and count.
 *
 * APPROACH 2 — Optimal (Prefix sums + sorted list of seen prefixes)
 *   O(n log n) comparisons + O(n) per insert for the splice => O(n^2) worst case memmove,
 *   but with a tiny constant; fine up to ~10^5 in practice.
 * sum(j..i-1) = P[i] - P[j]. For each new prefix P[i], count earlier prefixes P[j] with
 *   P[i] - upper <= P[j] <= P[i] - lower
 * That is countBetween(P[i] - upper, P[i] - lower) on a sorted multiset of seen prefixes
 * (two bisects). Then insert P[i].
 * Alternatives with guaranteed O(n log n): Fenwick tree over compressed prefix sums
 * (../../34_Range_Query_Data_Structures/02_Fenwick_Tree/), segment tree (../../34_Range_Query_Data_Structures/01_Segment_Tree/), or merge sort
 * (../../../30_Divide_And_Conquer/).
 *
 * Dry run: nums = [-2,5,-1], lower -2, upper 2; prefixes 0, -2, 3, 2
 *   seen {0}:   P=-2: count in [-4, 0] -> 1 (the 0)        seen {-2, 0}
 *   P=3:        count in [1, 5]  -> 0                        seen {-2, 0, 3}
 *   P=2:        count in [0, 4]  -> 2 (0 and 3)              total 3
 *
 * EDGE CASES
 * - single element
 * - lower === upper
 * - all zeros with range [0,0] -> n(n+1)/2
 */

const { SortedList } = require('../../02_Implementations/sorted_list');

function bruteForce(nums, lower, upper) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum >= lower && sum <= upper) count++;
    }
  }
  return count;
}

function optimal(nums, lower, upper) {
  const seen = new SortedList([0]);    // prefix sum of the empty prefix
  let prefix = 0;
  let count = 0;
  for (const x of nums) {
    prefix += x;
    count += seen.countBetween(prefix - upper, prefix - lower);
    seen.add(prefix);
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([-2, 5, -1], -2, 2), 3);
  assert.strictEqual(solve([0], 0, 0), 1);
  assert.strictEqual(solve([0, 0, 0], 0, 0), 6);
  assert.strictEqual(solve([1, 2, 3], 10, 20), 0);
  assert.strictEqual(solve([-3], -3, -3), 1);
  assert.strictEqual(solve([2, -1, 2], 1, 3), 5);
}
for (let trial = 0; trial < 200; trial++) {
  const n = 1 + Math.floor(Math.random() * 10);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 21) - 10);
  const lower = Math.floor(Math.random() * 21) - 15;
  const upper = lower + Math.floor(Math.random() * 15);
  assert.strictEqual(optimal(nums, lower, upper), bruteForce(nums, lower, upper));
}
console.log('✓ 05-count-of-range-sum-sorted-list passed');

module.exports = { optimal, bruteForce };
