/**
 * 01. Two Sum   (LeetCode 1 — Easy)
 *
 * PROBLEM
 * Given an array of integers `nums` and an integer `target`, return the indices of
 * the two numbers that add up to `target`. Exactly one answer exists, and you may
 * not use the same element twice.
 *
 * EXAMPLES
 * Input: nums = [2, 7, 11, 15], target = 9   Output: [0, 1]   Explanation: 2 + 7 = 9
 * Input: nums = [3, 2, 4], target = 6        Output: [1, 2]   Explanation: 3 + 3 is not allowed (same index)
 * Input: nums = [3, 3], target = 6           Output: [0, 1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the array sorted? (no -> otherwise two pointers would work, see 06_Two_Pointers)
 * - Can there be negative numbers? (yes)
 * - Return indices or values? (indices) Does the order of the pair matter? (no)
 * - Is there always exactly one solution? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Try every pair (i, j) with i < j and check nums[i] + nums[j] === target.
 *
 * APPROACH 2 — Optimal (hash map, one pass)   O(n) time, O(n) space
 * For each number ask: "have I already seen target - num?" A Map from value -> index
 * answers that in O(1). If yes, done. If no, store the current number and move on.
 * One pass is enough because when we reach the SECOND number of the pair, the first
 * one is already in the map.
 *
 * Dry run on [2, 7, 11, 15], target 9:
 *   i=0 num=2  need 7  not in map  -> map {2:0}
 *   i=1 num=7  need 2  in map at 0 -> return [0, 1]
 *
 * EDGE CASES
 * - Duplicates that form the answer: [3, 3] -> the check happens BEFORE inserting, so index 0 is found for index 1
 * - Negative numbers and zero: [-1, 0, 1], target 0 -> [0, 2]
 * - Two elements only
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
  const seen = new Map(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];
    if (seen.has(needed)) return [seen.get(needed), i];
    seen.set(nums[i], i); // insert AFTER checking so we never pair an element with itself
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
  assert.deepStrictEqual(solve([5, -5], 0), [0, 1]);
  assert.deepStrictEqual(solve([1, 2], 5), []);
  assert.deepStrictEqual(solve([], 5), []);
}
console.log('✓ 01-two-sum passed');

module.exports = { optimal, bruteForce };
