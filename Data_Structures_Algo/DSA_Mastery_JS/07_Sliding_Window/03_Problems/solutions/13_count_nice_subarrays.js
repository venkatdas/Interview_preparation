/**
 * 13. Count Number of Nice Subarrays   (LeetCode 1248 — Medium)
 *
 * PROBLEM
 * A subarray is "nice" if it contains exactly k odd numbers. Return the number of nice
 * contiguous subarrays.
 *
 * EXAMPLES
 * Input: nums = [1, 1, 2, 1, 1], k = 3   Output: 2   Explanation: [1,1,2,1] and [1,2,1,1]
 * Input: nums = [2, 4, 6], k = 1         Output: 0
 * Input: nums = [2, 2, 2, 1, 2, 2, 1, 2, 2, 2], k = 2   Output: 16
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly k, not at least? (exactly)
 * - Values positive? (yes; only parity matters, so map each to 0/1)
 * - 1 <= k <= n? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each start, extend right counting odds; count when odds === k; break when > k.
 *
 * APPROACH 2 — Optimal ("at most K" trick on a counter)   O(n) time, O(1) space
 * Treat each number as 1 (odd) or 0 (even). "Exactly k odds" = atMost(k) - atMost(k - 1),
 * where atMost(k) counts subarrays with at most k ones using a window:
 *   expand: odds += nums[right] % 2
 *   while odds > k: odds -= nums[left] % 2; left++
 *   total += right - left + 1
 * (08_Prefix_Sums_And_Difference_Arrays solves the same problem with a prefix count + hash map. Compare them.)
 *
 * Dry run of atMost on [1, 1, 2, 1, 1], k = 3:
 *   r=0 odds 1 +1 | r=1 odds 2 +2 | r=2 odds 2 +3 | r=3 odds 3 +4
 *   r=4 odds 4 > 3 -> drop nums[0]=1 odds 3 left=1 -> +4   total 14
 *   atMost(2): r=0 +1, r=1 +2, r=2 +3, r=3 odds 3 -> drop 1 (left=1) +3, r=4 odds 3 -> drop 1 (left=2) +3 = 12
 *   exactly(3) = 14 - 12 = 2
 *
 * EDGE CASES
 * - No odd numbers -> 0
 * - All odd, k = 1 -> n
 * - k larger than the number of odds -> 0
 */

function bruteForce(nums, k) {
  let count = 0;
  for (let start = 0; start < nums.length; start++) {
    let odds = 0;
    for (let end = start; end < nums.length; end++) {
      if (nums[end] % 2 === 1) odds++;
      if (odds > k) break;
      if (odds === k) count++;
    }
  }
  return count;
}

function countAtMost(nums, k) {
  if (k < 0) return 0;
  let left = 0;
  let odds = 0;
  let total = 0;

  for (let right = 0; right < nums.length; right++) {
    odds += nums[right] % 2;
    while (odds > k) {
      odds -= nums[left] % 2;
      left++;
    }
    total += right - left + 1;
  }
  return total;
}

function optimal(nums, k) {
  return countAtMost(nums, k) - countAtMost(nums, k - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1, 2, 1, 1], 3), 2);
  assert.strictEqual(solve([2, 4, 6], 1), 0);
  assert.strictEqual(solve([2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2), 16);
  assert.strictEqual(solve([1, 3, 5], 1), 3);
  assert.strictEqual(solve([1], 2), 0);
  assert.strictEqual(solve([], 1), 0);
  assert.strictEqual(solve([2, 1, 2], 1), 4);
}
console.log('✓ 13-count-nice-subarrays passed');

module.exports = { optimal, bruteForce, countAtMost };
