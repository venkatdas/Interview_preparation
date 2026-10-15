/**
 * 01. Running Sum of 1d Array   (LeetCode 1480 — Easy)
 *
 * PROBLEM
 * Given an array nums, return runningSum where runningSum[i] = nums[0] + ... + nums[i].
 *
 * EXAMPLES
 * Input: [1, 2, 3, 4]      Output: [1, 3, 6, 10]
 * Input: [1, 1, 1, 1, 1]   Output: [1, 2, 3, 4, 5]
 * Input: [3, 1, 2, 10, 1]  Output: [3, 4, 6, 16, 17]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Modify in place or return a new array? (either; we return a new one)
 * - Negatives? (fine)
 * - Empty? ([])
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * For each i, sum nums[0..i] from scratch.
 *
 * APPROACH 2 — Optimal (prefix sum, one pass)   O(n) time, O(n) output (O(1) extra if in place)
 * runningSum[i] = runningSum[i - 1] + nums[i]. Each element reuses the previous total.
 * This IS the prefix-sum array (without the leading zero convention).
 *
 * Dry run on [3, 1, 2, 10, 1]:
 *   i=0: 3
 *   i=1: 3 + 1 = 4
 *   i=2: 4 + 2 = 6
 *   i=3: 6 + 10 = 16
 *   i=4: 16 + 1 = 17
 *
 * EDGE CASES
 * - Empty -> []
 * - Single element -> itself
 * - Negatives can make the running sum go down
 */

function bruteForce(nums) {
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = 0; j <= i; j++) sum += nums[j];
    result.push(sum);
  }
  return result;
}

function optimal(nums) {
  const result = new Array(nums.length);
  let running = 0;
  for (let i = 0; i < nums.length; i++) {
    running += nums[i];
    result[i] = running;
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 4]), [1, 3, 6, 10]);
  assert.deepStrictEqual(solve([1, 1, 1, 1, 1]), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(solve([3, 1, 2, 10, 1]), [3, 4, 6, 16, 17]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([7]), [7]);
  assert.deepStrictEqual(solve([5, -5, 2]), [5, 0, 2]);
}
console.log('✓ 01-running-sum passed');

module.exports = { optimal, bruteForce };
