/**
 * 08. Maximum Subarray (as DP / Kadane)   (LeetCode 53 — Medium)
 *
 * PROBLEM
 * Find the contiguous subarray with the largest sum and return that sum.
 *
 * EXAMPLES
 * Input: [-2,1,-3,4,-1,2,1,-5,4]   Output: 6   Explanation: [4,-1,2,1]
 * Input: [1]                        Output: 1
 * Input: [5,4,-1,7,8]               Output: 23
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= nums.length <= 10^5, values can be negative
 * - Must the subarray be non-empty? (yes, so all-negative input returns the max element)
 *
 * DP DEFINITION
 * STATE:       dp[i] = max sum of a subarray that ENDS exactly at index i
 * RECURRENCE:  dp[i] = max(nums[i], dp[i-1] + nums[i])
 *              (either start fresh at i, or extend the best subarray ending at i-1)
 * BASE CASES:  dp[0] = nums[0]
 * ANSWER:      max over all dp[i]  (the answer is NOT in the last cell!)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Try every start, extend to every end, track the best running sum.
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * bestEndingAt(i) = max(nums[i], nums[i] + bestEndingAt(i-1)), cached.
 *
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]:
 *   nums : -2   1  -3   4  -1   2   1  -5   4
 *   dp   : -2   1  -2   4   3   5   6   1   5
 *   answer = max(dp) = 6
 *
 * APPROACH 4 — Space optimized (Kadane's algorithm)   O(n) time, O(1) space
 * Only dp[i-1] is needed, so keep one running variable.
 *
 * EDGE CASES
 * - All negative: [-3, -1, -2] -> -1
 * - Single element
 */

function bruteForce(nums) {
  let best = -Infinity;
  for (let start = 0; start < nums.length; start++) {
    let runningSum = 0;
    for (let end = start; end < nums.length; end++) {
      runningSum += nums[end];
      best = Math.max(best, runningSum);
    }
  }
  return best;
}

function memo(nums) {
  const cache = new Map();
  function bestEndingAt(index) {
    if (index === 0) return nums[0];
    if (cache.has(index)) return cache.get(index);
    const result = Math.max(nums[index], nums[index] + bestEndingAt(index - 1));
    cache.set(index, result);
    return result;
  }
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) best = Math.max(best, bestEndingAt(i));
  return best;
}

function tabulation(nums) {
  const dp = new Array(nums.length);
  dp[0] = nums[0];
  let best = dp[0];
  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
    best = Math.max(best, dp[i]);
  }
  return best;
}

function optimized(nums) {
  let bestEndingHere = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    // a negative running sum only hurts, so restart at nums[i] in that case
    bestEndingHere = Math.max(nums[i], bestEndingHere + nums[i]);
    best = Math.max(best, bestEndingHere);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([5, 4, -1, 7, 8]), 23);
  assert.strictEqual(solve([-3, -1, -2]), -1);
  assert.strictEqual(solve([-1]), -1);
  assert.strictEqual(solve([0, 0, 0]), 0);
}
console.log('✓ 08-maximum-subarray passed');

module.exports = { bruteForce, memo, tabulation, optimized };
