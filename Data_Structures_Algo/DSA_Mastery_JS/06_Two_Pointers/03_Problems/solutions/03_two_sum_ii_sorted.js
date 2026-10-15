/**
 * 03. Two Sum II - Input Array Is Sorted   (LeetCode 167 — Medium)
 *
 * PROBLEM
 * Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers
 * that add up to target. Return their 1-based indices [index1, index2] with
 * index1 < index2. Exactly one solution exists. Use only O(1) extra space.
 *
 * EXAMPLES
 * Input: numbers = [2, 7, 11, 15], target = 9   Output: [1, 2]
 * Input: numbers = [2, 3, 4], target = 6        Output: [1, 3]
 * Input: numbers = [-1, 0], target = -1         Output: [1, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Sorted ascending? (yes; this is THE hint for two pointers)
 * - 1-based output? (yes, LeetCode quirk)
 * - O(1) space required? (yes -> rules out the hash map from 05_Hashing)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Check every pair. Ignores the sorted order completely.
 *
 * APPROACH 2 — Optimal (opposite-end pointers)   O(n) time, O(1) space
 * left at the smallest, right at the largest.
 *   sum < target  -> we need more; the only way to grow the sum is left++
 *   sum > target  -> we need less; the only way to shrink the sum is right--
 *   sum == target -> done
 * Why this never misses: if sum < target, numbers[left] is too small to pair with
 * numbers[right] AND with anything to the left of right (those are even smaller).
 * So numbers[left] can be discarded for good. Symmetric for right.
 *
 * Dry run on [2, 7, 11, 15], target 9:
 *   left=0 (2), right=3 (15): 17 > 9 -> right=2
 *   left=0 (2), right=2 (11): 13 > 9 -> right=1
 *   left=0 (2), right=1 (7):  9 == 9 -> [1, 2]
 *
 * (Binary search for the complement is O(n log n) and also O(1) space; two pointers is better.)
 *
 * EDGE CASES
 * - Negative numbers (sorted order still holds, the logic is unchanged)
 * - Duplicates: [1, 1, 3], target 2 -> [1, 2]
 * - Answer is the two ends
 */

function bruteForce(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];
    }
  }
  return [];
}

function optimal(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1]; // 1-based
    if (sum < target) left++;   // need a larger sum
    else right--;               // need a smaller sum
  }
  return [];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([2, 7, 11, 15], 9), [1, 2]);
  assert.deepStrictEqual(solve([2, 3, 4], 6), [1, 3]);
  assert.deepStrictEqual(solve([-1, 0], -1), [1, 2]);
  assert.deepStrictEqual(solve([1, 1, 3], 2), [1, 2]);
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5], 6), [1, 5]);
  assert.deepStrictEqual(solve([-5, -3, 0, 2, 8], 5), [2, 5]);
  assert.deepStrictEqual(solve([1, 2], 10), []);
}
console.log('✓ 03-two-sum-ii-sorted passed');

module.exports = { optimal, bruteForce };
