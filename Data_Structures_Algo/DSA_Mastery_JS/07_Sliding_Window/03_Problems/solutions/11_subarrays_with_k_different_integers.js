/**
 * 11. Subarrays with K Different Integers   (LeetCode 992 — Hard)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return the number of contiguous
 * subarrays that contain EXACTLY k distinct integers.
 *
 * EXAMPLES
 * Input: nums = [1, 2, 1, 2, 3], k = 2   Output: 7
 *   Explanation: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]
 * Input: nums = [1, 2, 1, 3, 4], k = 3   Output: 3
 *   Explanation: [1,2,1,3], [2,1,3], [1,3,4]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Count, not list? (count)
 * - 1 <= k <= n? (yes)
 * - Values positive ints? (any hashable values work)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(k) space
 * For every start, extend right with a Set; count windows whose set size === k; break at > k.
 *
 * APPROACH 2 — Optimal (the "at most K" trick)   O(n) time, O(k) space
 * "Exactly k" is NOT monotonic (growing a window can go from k to k+1 distinct, then
 * shrinking can bring it back). But "AT MOST k" IS monotonic, and:
 *     exactly(k) = atMost(k) - atMost(k - 1)
 * atMost(k): standard longest-valid window. For each right, every subarray that ends at
 * right and starts in [left, right] is valid -> add (right - left + 1).
 *
 * Dry run of atMost on [1, 2, 1, 2, 3], k = 2:
 *   r=0 {1} left 0 -> +1 (total 1)
 *   r=1 {1,2} -> +2 (3)
 *   r=2 {1,2} -> +3 (6)
 *   r=3 {1,2} -> +4 (10)
 *   r=4 {1:2,2:2,3:1} size 3 -> shrink: drop nums[0]=1 -> {1:1,2:2,3:1} still 3
 *                                       drop nums[1]=2 -> {1:1,2:1,3:1} still 3
 *                                       drop nums[2]=1 -> {2:1,3:1} size 2, left=3 -> +2 (12)
 *   atMost(2) = 12. atMost(1): r=0 +1, r=1 shrink to [1] +1, r=2 +1, r=3 +1, r=4 +1 = 5
 *   exactly(2) = 12 - 5 = 7
 *
 * EDGE CASES
 * - k = 1 -> count of all runs' subarrays
 * - k > distinct values in nums -> 0
 * - All same value with k = 1 -> n(n+1)/2
 */

function bruteForce(nums, k) {
  let count = 0;
  for (let start = 0; start < nums.length; start++) {
    const seen = new Set();
    for (let end = start; end < nums.length; end++) {
      seen.add(nums[end]);
      if (seen.size > k) break;
      if (seen.size === k) count++;
    }
  }
  return count;
}

function countAtMost(nums, k) {
  if (k < 0) return 0;
  const counts = new Map();
  let left = 0;
  let total = 0;

  for (let right = 0; right < nums.length; right++) {
    counts.set(nums[right], (counts.get(nums[right]) ?? 0) + 1);

    while (counts.size > k) {
      const leaving = nums[left];
      counts.set(leaving, counts.get(leaving) - 1);
      if (counts.get(leaving) === 0) counts.delete(leaving);
      left++;
    }
    total += right - left + 1; // all subarrays ending at `right` with start in [left, right]
  }
  return total;
}

function optimal(nums, k) {
  return countAtMost(nums, k) - countAtMost(nums, k - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 1, 2, 3], 2), 7);
  assert.strictEqual(solve([1, 2, 1, 3, 4], 3), 3);
  assert.strictEqual(solve([1, 1, 1], 1), 6);
  assert.strictEqual(solve([1, 2, 3], 4), 0);
  assert.strictEqual(solve([1, 2], 1), 2);
  assert.strictEqual(solve([], 1), 0);
  assert.strictEqual(solve([2, 1, 2, 1, 2], 2), 10);
}
console.log('✓ 11-subarrays-with-k-different-integers passed');

module.exports = { optimal, bruteForce, countAtMost };
