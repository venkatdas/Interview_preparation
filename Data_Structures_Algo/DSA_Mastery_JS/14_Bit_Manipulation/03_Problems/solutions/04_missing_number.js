/**
 * 04. Missing Number   (LeetCode 268 — Easy)
 *
 * PROBLEM
 * nums contains n distinct numbers from the range [0, n]. Exactly one number of the range
 * is missing. Return it.
 *
 * EXAMPLES
 * Input: [3,0,1]              Output: 2
 * Input: [0,1]                Output: 2
 * Input: [9,6,4,2,3,5,7,0,1]  Output: 8
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Numbers are distinct and within [0, n]? (yes)
 * - Can we modify / sort the input? (not needed)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Put the numbers in a Set; scan 0..n and return the first one not in the set.
 * (Also common: Gauss sum n(n+1)/2 - sum(nums), O(1) space but can overflow in other languages.)
 *
 * APPROACH 2 — Optimal (XOR)   O(n) time, O(1) space
 * XOR all indices 0..n together with all values. Every number that IS present appears twice
 * (once as an index, once as a value) and cancels. The missing number appears only once
 * (as an index) and survives.
 *
 * Dry run on [3,0,1] (n = 3):
 *   result = 0 ^ 1 ^ 2 ^ 3        (indices 0..n)
 *          ^ 3 ^ 0 ^ 1            (values)
 *   pairs cancel: (0^0)(1^1)(3^3) -> leaves 2
 *
 * EDGE CASES
 * - [0] -> 1
 * - missing is 0 -> [1] -> 0
 * - missing is n (the largest) -> [0,1] -> 2
 */

function bruteForce(nums) {
  const seen = new Set(nums);
  for (let candidate = 0; candidate <= nums.length; candidate++) {
    if (!seen.has(candidate)) return candidate;
  }
  return -1;
}

function optimal(nums) {
  let result = nums.length;                  // start with the index n (no value slot for it)
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];                   // pair index i with value nums[i]
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 0, 1]), 2);
  assert.strictEqual(solve([0, 1]), 2);
  assert.strictEqual(solve([9, 6, 4, 2, 3, 5, 7, 0, 1]), 8);
  assert.strictEqual(solve([0]), 1);
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([1, 2, 3]), 0);
}
console.log('✓ 04-missing-number passed');

module.exports = { optimal, bruteForce };
