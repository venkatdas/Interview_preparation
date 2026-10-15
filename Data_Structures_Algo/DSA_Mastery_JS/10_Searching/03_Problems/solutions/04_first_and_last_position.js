/**
 * 04. Find First and Last Position of Element in Sorted Array   (LeetCode 34 — Medium)
 *
 * PROBLEM
 * Given a sorted array (may contain duplicates) and a target, return [first, last]
 * index of the target, or [-1, -1] if absent. O(log n) required.
 *
 * EXAMPLES
 * Input: [5,7,7,8,8,10], 8   Output: [3,4]
 * Input: [5,7,7,8,8,10], 6   Output: [-1,-1]
 * Input: [], 0               Output: [-1,-1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates allowed (that is the whole point)
 * - Non-decreasing order? (yes)
 *
 * APPROACH 1 — Brute force   O(n) time
 * Scan once, remember the first and last index where nums[i] === target.
 *
 * APPROACH 2 — Optimal (lowerBound + upperBound)   O(log n) time, O(1) space
 * first = lowerBound(target): first index with value >= target.
 *   If first === n or nums[first] !== target -> not present.
 * last = upperBound(target) - 1: upperBound is the first index with value > target,
 *   so the slot before it is the last copy of target.
 * Two binary searches, each O(log n).
 *
 * Dry run [5,7,7,8,8,10], target 8:
 *   lowerBound: l=0 r=6 mid=3 (8 >= 8) r=3; mid=1 (7 < 8) l=2; mid=2 (7 < 8) l=3 -> 3
 *   upperBound: l=0 r=6 mid=3 (8 <= 8) l=4; mid=5 (10 > 8) r=5; mid=4 (8 <= 8) l=5 -> 5
 *   answer [3, 5 - 1] = [3, 4]
 *
 * EDGE CASES
 * - target absent (between values, below min, above max)
 * - whole array equals target -> [0, n-1]
 * - single occurrence -> [i, i]
 */

function bruteForce(nums, target) {
  let first = -1, last = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (first === -1) first = i;
      last = i;
    }
  }
  return [first, last];
}

function lowerBound(nums, target) {
  let left = 0, right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) left = mid + 1; else right = mid;
  }
  return left;
}

function upperBound(nums, target) {
  let left = 0, right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] <= target) left = mid + 1; else right = mid;
  }
  return left;
}

function optimal(nums, target) {
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = upperBound(nums, target) - 1;
  return [first, last];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([5, 7, 7, 8, 8, 10], 8), [3, 4]);
  assert.deepStrictEqual(solve([5, 7, 7, 8, 8, 10], 6), [-1, -1]);
  assert.deepStrictEqual(solve([], 0), [-1, -1]);
  assert.deepStrictEqual(solve([1], 1), [0, 0]);
  assert.deepStrictEqual(solve([2, 2, 2, 2], 2), [0, 3]);
  assert.deepStrictEqual(solve([1, 2, 3], 0), [-1, -1]);
  assert.deepStrictEqual(solve([1, 2, 3], 4), [-1, -1]);
  assert.deepStrictEqual(solve([-3, -3, -1, 0], -3), [0, 1]);
}
console.log('✓ 04-first-and-last-position passed');

module.exports = { optimal, bruteForce };
