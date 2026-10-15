/**
 * 11. Missing Number   (LeetCode 268 — Easy)
 *
 * PROBLEM
 * Given an array of n DISTINCT numbers taken from the range [0, n], exactly one
 * number of the range is missing. Return it.
 *
 * EXAMPLES
 * Input: [3, 0, 1]                      Output: 2   Explanation: n = 3, range 0..3, 2 is missing
 * Input: [0, 1]                         Output: 2   Explanation: n = 2, range 0..2
 * Input: [9, 6, 4, 2, 3, 5, 7, 0, 1]    Output: 8
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are values distinct and all within 0..n? (yes)
 * - Exactly one missing? (yes)
 * - O(n) time and O(1) space required? (that is the follow-up)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every number 0..n, scan the array to see whether it is present.
 * (Middle ground: put the array in a Set and check 0..n -> O(n) time, O(n) space.)
 *
 * APPROACH 2 — Optimal (sum formula, or XOR)   O(n) time, O(1) space
 * The sum of 0..n is n * (n + 1) / 2. Subtract the actual sum of the array; what is
 * left is the missing number. Alternative without overflow worries: XOR every index
 * 0..n and every value; pairs cancel (x ^ x = 0) and the lone survivor is the answer.
 *
 * Dry run on [3, 0, 1]:
 *   n = 3, expected sum = 3 * 4 / 2 = 6
 *   actual sum = 3 + 0 + 1 = 4
 *   6 - 4 = 2
 * XOR version: 0^1^2^3 = 0, then ^3^0^1 -> leaves 2
 *
 * EDGE CASES
 * - Missing number is 0: [1] -> 0
 * - Missing number is n: [0, 1] -> 2
 * - Single element
 */

function bruteForce(nums) {
  for (let candidate = 0; candidate <= nums.length; candidate++) {
    if (!nums.includes(candidate)) return candidate; // includes is O(n) -> O(n^2) overall
  }
  return -1;
}

function optimal(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;                   // sum of 0..n (Gauss)
  const actualSum = nums.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

function optimalXor(nums) {
  let result = nums.length;                 // start with n, the index nobody loops over
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];                  // every present value cancels with its index
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, optimalXor]) {
  assert.strictEqual(solve([3, 0, 1]), 2);
  assert.strictEqual(solve([0, 1]), 2);
  assert.strictEqual(solve([9, 6, 4, 2, 3, 5, 7, 0, 1]), 8);
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([0]), 1);
  assert.strictEqual(solve([1, 2, 3]), 0);
  assert.strictEqual(solve([0, 2, 3]), 1);
}
console.log('✓ 11-missing-number passed');

module.exports = { optimal, bruteForce, optimalXor };
