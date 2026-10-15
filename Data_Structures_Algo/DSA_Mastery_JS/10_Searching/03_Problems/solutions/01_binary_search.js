/**
 * 01. Binary Search   (LeetCode 704 — Easy)
 *
 * PROBLEM
 * Given a sorted array of distinct integers and a target, return the index of the
 * target, or -1 if it is not present. Must run in O(log n).
 *
 * EXAMPLES
 * Input: nums = [-1,0,3,5,9,12], target = 9   Output: 4
 * Input: nums = [-1,0,3,5,9,12], target = 2   Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Sorted ascending? Distinct? (yes, yes)
 * - n up to 10^4; values fit in 32 bits
 * - Empty array -> -1
 *
 * APPROACH 1 — Brute force (linear scan)   O(n) time, O(1) space
 * Walk the array and compare each element. Ignores the sorted property.
 *
 * APPROACH 2 — Optimal (Template 1, left <= right)   O(log n) time, O(1) space
 * Keep an inclusive range [left, right] that must contain the target if it exists.
 * Look at the middle: equal -> done; smaller -> target is to the right (left = mid + 1);
 * bigger -> target is to the left (right = mid - 1). Stop when the range is empty.
 *
 * Dry run nums = [-1,0,3,5,9,12], target = 9:
 *   left=0 right=5 mid=2 nums[2]=3 < 9  -> left=3
 *   left=3 right=5 mid=4 nums[4]=9 === 9 -> return 4
 * target = 2:
 *   mid=2 (3) > 2 -> right=1; mid=0 (-1) < 2 -> left=1; mid=1 (0) < 2 -> left=2 > right -> -1
 *
 * EDGE CASES
 * - [] -> -1
 * - single element, match and no match
 * - target smaller than everything / larger than everything (loop must terminate)
 */

function bruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) if (nums[i] === target) return i;
  return -1;
}

function optimal(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;   // discard mid and everything left of it
    else right = mid - 1;                     // discard mid and everything right of it
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([-1, 0, 3, 5, 9, 12], 9), 4);
  assert.strictEqual(solve([-1, 0, 3, 5, 9, 12], 2), -1);
  assert.strictEqual(solve([-1, 0, 3, 5, 9, 12], -1), 0);
  assert.strictEqual(solve([-1, 0, 3, 5, 9, 12], 12), 5);
  assert.strictEqual(solve([-1, 0, 3, 5, 9, 12], 100), -1);
  assert.strictEqual(solve([-1, 0, 3, 5, 9, 12], -100), -1);
  assert.strictEqual(solve([], 1), -1);
  assert.strictEqual(solve([5], 5), 0);
  assert.strictEqual(solve([5], 3), -1);
}
console.log('✓ 01-binary-search passed');

module.exports = { optimal, bruteForce };
