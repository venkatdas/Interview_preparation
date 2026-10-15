/**
 * 01. Two Sum   (LeetCode 1 — Easy)
 *
 * PROBLEM
 * Given an array of integers nums and an integer target, return the indices of the
 * two numbers that add up to target. Exactly one answer exists, and you may not use
 * the same element twice.
 *
 * EXAMPLES
 * Input: nums = [2, 7, 11, 15], target = 9   Output: [0, 1]   Explanation: 2 + 7 = 9
 * Input: nums = [3, 2, 4], target = 6        Output: [1, 2]   Explanation: 3 + 3 is NOT allowed (same index)
 * Input: nums = [3, 3], target = 6           Output: [0, 1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is exactly one answer guaranteed? (yes -> we can return as soon as we find it)
 * - Can numbers be negative? (yes, hashing doesn't care)
 * - Does the order of the returned indices matter? (no)
 * - Is the array sorted? (no -> if it were, two pointers would use O(1) space; see 06_Two_Pointers)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every pair (i, j) with i < j check nums[i] + nums[j] === target.
 * Two nested loops. Fine for tiny inputs, too slow for 10^5 elements.
 *
 * APPROACH 2 — Optimal (complement lookup with a Map)   O(n) time, O(n) space
 * The inner loop of the brute force only SEARCHES for one specific value:
 * target - nums[i]. A hash map answers "have I seen this value, and where?" in O(1).
 * Walk the array once. For each number:
 *   1. complement = target - num
 *   2. if the map already has complement -> answer is [map.get(complement), i]
 *   3. otherwise store num -> i in the map
 * Checking BEFORE inserting guarantees we never pair an element with itself.
 *
 * Dry run on nums = [2, 7, 11, 15], target = 9:
 *   i=0 num=2  complement=7  map has 7? no   -> map = {2:0}
 *   i=1 num=7  complement=2  map has 2? YES  -> return [0, 1]
 *
 * EDGE CASES
 * - Two equal numbers that form the answer: [3, 3], 6 -> [0, 1] (check-then-insert handles it)
 * - Negative numbers and zero: [-1, 0, 1], 0 -> [0, 2]
 * - Duplicates that are NOT the answer: [3, 2, 4], 6 -> [1, 2], not [0, 0]
 */

function bruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}

function optimal(nums, target) {
  const indexOf = new Map(); // value -> index where we saw it

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (indexOf.has(complement)) {
      return [indexOf.get(complement), i];
    }
    // insert AFTER the check so an element can't pair with itself
    indexOf.set(nums[i], i);
  }
  return [];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([2, 7, 11, 15], 9), [0, 1]);
  assert.deepStrictEqual(solve([3, 2, 4], 6), [1, 2]);
  assert.deepStrictEqual(solve([3, 3], 6), [0, 1]);
  assert.deepStrictEqual(solve([-1, 0, 1], 0), [0, 2]);
  assert.deepStrictEqual(solve([1, 5], 10), []);
  assert.deepStrictEqual(solve([], 1), []);
  assert.deepStrictEqual(solve([0, 4, 3, 0], 0), [0, 3]);
}
console.log('✓ 01-two-sum passed');

module.exports = { optimal, bruteForce };
