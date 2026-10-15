/**
 * 09. Find Minimum in Rotated Sorted Array   (LeetCode 153 — Medium)
 *
 * PROBLEM
 * A sorted array of distinct integers was rotated 1..n times. Return the minimum
 * element in O(log n).
 *
 * EXAMPLES
 * Input: [3,4,5,1,2]       Output: 1
 * Input: [4,5,6,7,0,1,2]   Output: 0
 * Input: [11,13,15,17]     Output: 11  (rotated n times = not rotated)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Distinct values? (yes; with duplicates use the shrink trick from problem 08)
 * - Can the array be not rotated at all? (yes)
 *
 * APPROACH 1 — Brute force   O(n)
 * Math.min(...nums) or a single scan.
 *
 * APPROACH 2 — Optimal (compare mid with RIGHT end)   O(log n) time, O(1) space
 * The minimum is the only element smaller than its left neighbour (the "drop").
 * Compare nums[mid] with nums[right]:
 *   nums[mid] > nums[right] -> the drop is to the RIGHT of mid: left = mid + 1
 *   nums[mid] < nums[right] -> mid could be the minimum, or the drop is left: right = mid
 * (Comparing with nums[left] instead does NOT work when the array is not rotated.)
 * Loop while left < right; nums[left] is the minimum.
 *
 * Dry run [4,5,6,7,0,1,2]:
 *   l=0 r=6 mid=3 (7) > nums[6]=2 -> l=4
 *   l=4 r=6 mid=5 (1) < 2         -> r=5
 *   l=4 r=5 mid=4 (0) < nums[5]=1 -> r=4
 *   l === r === 4 -> nums[4] = 0
 *
 * EDGE CASES
 * - single element
 * - not rotated -> nums[0]
 * - rotated by 1 ([2,3,4,5,1]) and by n-1 ([5,1,2,3,4])
 */

function bruteForce(nums) {
  let min = nums[0];
  for (const value of nums) if (value < min) min = value;
  return min;
}

function optimal(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] > nums[right]) left = mid + 1;   // the drop is after mid
    else right = mid;                              // mid may be the minimum
  }
  return nums[left];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 4, 5, 1, 2]), 1);
  assert.strictEqual(solve([4, 5, 6, 7, 0, 1, 2]), 0);
  assert.strictEqual(solve([11, 13, 15, 17]), 11);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([2, 1]), 1);
  assert.strictEqual(solve([2, 3, 4, 5, 1]), 1);
  assert.strictEqual(solve([5, 1, 2, 3, 4]), 1);
  assert.strictEqual(solve([-2, -1, -5, -4, -3]), -5);
}
for (let trial = 0; trial < 300; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const base = Array.from({ length: n }, (_, i) => i * 3 - 10);
  const k = Math.floor(Math.random() * n);
  const rotated = base.slice(k).concat(base.slice(0, k));
  assert.strictEqual(optimal(rotated), base[0]);
}
console.log('✓ 09-find-minimum-rotated-sorted-array passed');

module.exports = { optimal, bruteForce };
