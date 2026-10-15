/**
 * 03. Find Pivot Index   (LeetCode 724 — Easy)
 *
 * PROBLEM
 * Return the leftmost index where the sum of all numbers strictly to its left equals the
 * sum of all numbers strictly to its right. Return -1 if none exists.
 *
 * EXAMPLES
 * Input: [1, 7, 3, 6, 5, 6]   Output: 3   Explanation: left 1+7+3 = 11, right 5+6 = 11
 * Input: [1, 2, 3]            Output: -1
 * Input: [2, 1, -1]           Output: 0   Explanation: left sum is 0 (nothing), right 1 + -1 = 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Edge pivots allowed (index 0 or n-1 with an empty side summing to 0)? (yes)
 * - Return the leftmost? (yes)
 * - Negatives? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each index, sum the left part and the right part separately.
 *
 * APPROACH 2 — Optimal (total sum + running left sum)   O(n) time, O(1) space
 * rightSum(i) = total - leftSum(i) - nums[i]. So walk once keeping leftSum:
 *   if leftSum === total - leftSum - nums[i] -> i is the pivot
 *   leftSum += nums[i]
 * No prefix ARRAY needed: the running sum is a prefix sum computed on the fly.
 *
 * Dry run on [1, 7, 3, 6, 5, 6], total 28:
 *   i=0 left 0,  right 28-0-1 = 27  no; left=1
 *   i=1 left 1,  right 28-1-7 = 20  no; left=8
 *   i=2 left 8,  right 28-8-3 = 17  no; left=11
 *   i=3 left 11, right 28-11-6 = 11 YES -> 3
 *
 * EDGE CASES
 * - Single element -> 0 (both sides empty)
 * - Empty -> -1
 * - Pivot at the last index: [1, -1, 2] -> 2
 * - No pivot -> -1
 */

function bruteForce(nums) {
  for (let i = 0; i < nums.length; i++) {
    let left = 0;
    for (let j = 0; j < i; j++) left += nums[j];
    let right = 0;
    for (let j = i + 1; j < nums.length; j++) right += nums[j];
    if (left === right) return i;
  }
  return -1;
}

function optimal(nums) {
  const total = nums.reduce((sum, x) => sum + x, 0);
  let leftSum = 0;

  for (let i = 0; i < nums.length; i++) {
    const rightSum = total - leftSum - nums[i];
    if (leftSum === rightSum) return i;
    leftSum += nums[i];
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 7, 3, 6, 5, 6]), 3);
  assert.strictEqual(solve([1, 2, 3]), -1);
  assert.strictEqual(solve([2, 1, -1]), 0);
  assert.strictEqual(solve([1, -1, 2]), 2);
  assert.strictEqual(solve([5]), 0);
  assert.strictEqual(solve([]), -1);
  assert.strictEqual(solve([0, 0, 0]), 0); // leftmost
  assert.strictEqual(solve([-1, -1, -1, -1, -1, 0]), 2);
}
console.log('✓ 03-find-pivot-index passed');

module.exports = { optimal, bruteForce };
