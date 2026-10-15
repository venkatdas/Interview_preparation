/**
 * 04. Maximum Subarray   (LeetCode 53 — Medium)
 *
 * PROBLEM
 * Given an integer array, find the contiguous subarray (at least one element) with
 * the largest sum and return that sum.
 *
 * EXAMPLES
 * Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]   Output: 6    Explanation: [4, -1, 2, 1]
 * Input: [1]                               Output: 1
 * Input: [5, 4, -1, 7, 8]                  Output: 23   Explanation: the whole array
 * Input: [-3, -1, -2]                      Output: -1   Explanation: must pick at least one element
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can all numbers be negative? (yes -> answer is the largest single element, NOT 0)
 * - Subarray means contiguous? (yes; "subsequence" would be a different problem)
 * - Return the sum or the subarray itself? (sum; indices are an easy follow-up)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start index, extend the end index and keep a running sum; track the max.
 * (The naive triple loop that re-sums each subarray is O(n^3).)
 *
 * APPROACH 2 — Optimal (Kadane's algorithm)   O(n) time, O(1) space
 * At each index decide: "extend the best subarray ending at the previous index, or
 * start a new subarray here?" If the previous running sum is negative it only hurts,
 * so start fresh. currentSum = max(num, currentSum + num). Track the global best.
 *
 * Dry run on [-2, 1, -3, 4, -1, 2, 1, -5, 4]:
 *   num -2: current = -2             best = -2
 *   num  1: current = max(1, -1)=1   best = 1
 *   num -3: current = max(-3,-2)=-2  best = 1
 *   num  4: current = max(4, 2)=4    best = 4
 *   num -1: current = 3              best = 4
 *   num  2: current = 5              best = 5
 *   num  1: current = 6              best = 6
 *   num -5: current = 1              best = 6
 *   num  4: current = 5              best = 6   -> 6
 *
 * EDGE CASES
 * - All negative -> max element
 * - Single element
 * - Zeros mixed in: [0, -1, 0] -> 0
 * - Empty array (not allowed by the problem; we return 0 defensively)
 */

function bruteForce(nums) {
  if (nums.length === 0) return 0;
  let best = -Infinity;
  for (let start = 0; start < nums.length; start++) {
    let runningSum = 0;
    for (let end = start; end < nums.length; end++) {
      runningSum += nums[end];        // sum of nums[start..end] without re-adding
      best = Math.max(best, runningSum);
    }
  }
  return best;
}

function optimal(nums) {
  if (nums.length === 0) return 0;
  let currentSum = nums[0]; // best sum of a subarray that ENDS at the current index
  let best = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // a negative currentSum can only drag us down, so restart at nums[i] instead
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    best = Math.max(best, currentSum);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([5, 4, -1, 7, 8]), 23);
  assert.strictEqual(solve([-3, -1, -2]), -1);
  assert.strictEqual(solve([0, -1, 0]), 0);
  assert.strictEqual(solve([-1]), -1);
  assert.strictEqual(solve([]), 0);
}
console.log('✓ 04-maximum-subarray passed');

module.exports = { optimal, bruteForce };
