/**
 * 01. Maximum Average Subarray I   (LeetCode 643 — Easy)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, find the contiguous subarray of length
 * exactly k with the maximum average. Return that average.
 *
 * EXAMPLES
 * Input: nums = [1, 12, -5, -6, 50, 3], k = 4   Output: 12.75   Explanation: (12 - 5 - 6 + 50) / 4
 * Input: nums = [5], k = 1                      Output: 5.0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly k, not "at least k"? (exactly)
 * - 1 <= k <= nums.length? (yes)
 * - Negatives allowed? (yes; a FIXED window doesn't care, only variable-size windows on sums do)
 * - Floating point tolerance? (answers within 1e-5 accepted)
 *
 * APPROACH 1 — Brute force   O(n * k) time, O(1) space
 * For every start index, sum the next k elements. Recomputes overlapping sums.
 *
 * APPROACH 2 — Optimal (fixed-size sliding window)   O(n) time, O(1) space
 * Max average = max sum / k, so track the max window SUM.
 * Sum the first k elements. Then for each new right index, add nums[right] and subtract
 * nums[right - k] (the element that just left on the left). Keep the best sum.
 *
 * Dry run on [1, 12, -5, -6, 50, 3], k = 4:
 *   first window [1,12,-5,-6] sum = 2, best = 2
 *   right=4: + 50 - 1  -> 51, best 51
 *   right=5: + 3 - 12  -> 42
 *   best 51 / 4 = 12.75
 *
 * EDGE CASES
 * - k === nums.length -> average of the whole array
 * - All negative -> still the max (least negative) window
 * - k = 1 -> max element
 */

function bruteForce(nums, k) {
  let best = -Infinity;
  for (let start = 0; start + k <= nums.length; start++) {
    let sum = 0;
    for (let i = start; i < start + k; i++) sum += nums[i];
    best = Math.max(best, sum);
  }
  return best / k;
}

function optimal(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let bestSum = windowSum;

  for (let right = k; right < nums.length; right++) {
    windowSum += nums[right] - nums[right - k]; // slide: new element in, old element out
    bestSum = Math.max(bestSum, windowSum);
  }
  return bestSum / k;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 12, -5, -6, 50, 3], 4), 12.75);
  assert.strictEqual(solve([5], 1), 5);
  assert.strictEqual(solve([0, 1, 1, 3, 3], 4), 2);
  assert.strictEqual(solve([-1, -2, -3], 2), -1.5);
  assert.strictEqual(solve([4, 0, 4, 3, 3], 5), 2.8);
  assert.strictEqual(solve([7, 1, 9], 1), 9);
}
console.log('✓ 01-maximum-average-subarray passed');

module.exports = { optimal, bruteForce };
