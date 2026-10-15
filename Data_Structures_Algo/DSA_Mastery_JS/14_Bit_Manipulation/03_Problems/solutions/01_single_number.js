/**
 * 01. Single Number   (LeetCode 136 — Easy)
 *
 * PROBLEM
 * Every element in nums appears exactly twice except one, which appears once.
 * Find it in O(n) time and O(1) extra space.
 *
 * EXAMPLES
 * Input: [2,2,1]        Output: 1
 * Input: [4,1,2,1,2]    Output: 4
 * Input: [1]            Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly one element appears once? (yes)
 * - Negative numbers allowed? (yes, XOR does not care)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Count with a hash map, return the key with count 1. Simple but uses extra memory.
 *
 * APPROACH 2 — Optimal (XOR)   O(n) time, O(1) space
 * XOR every number together. a ^ a = 0 and a ^ 0 = a, and XOR is commutative, so every
 * pair cancels out and only the single number survives.
 *
 * Dry run on [4,1,2,1,2]:
 *   0 ^ 4 = 4
 *   4 ^ 1 = 5      (100 ^ 001 = 101)
 *   5 ^ 2 = 7      (101 ^ 010 = 111)
 *   7 ^ 1 = 6      (111 ^ 001 = 110)
 *   6 ^ 2 = 4      (110 ^ 010 = 100)  -> 4
 *
 * EDGE CASES
 * - single element -> itself
 * - negative numbers: -3 ^ -3 = 0 still holds
 * - the single number is 0 -> result 0 (correct)
 */

function bruteForce(nums) {
  const counts = new Map();
  for (const num of nums) counts.set(num, (counts.get(num) || 0) + 1);
  for (const [num, count] of counts) if (count === 1) return num;
  return undefined;
}

function optimal(nums) {
  let result = 0;
  for (const num of nums) result ^= num; // pairs cancel, the single number remains
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 2, 1]), 1);
  assert.strictEqual(solve([4, 1, 2, 1, 2]), 4);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([-3, 5, -3]), 5);
  assert.strictEqual(solve([0, 7, 7]), 0);
  assert.strictEqual(solve([10, 10, 20, 20, 30]), 30);
}
console.log('✓ 01-single-number passed');

module.exports = { optimal, bruteForce };
