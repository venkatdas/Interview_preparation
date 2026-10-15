/**
 * 07. Search in Rotated Sorted Array   (LeetCode 33 — Medium)
 *
 * PROBLEM
 * A sorted array of DISTINCT integers was rotated at an unknown pivot
 * ([0,1,2,4,5,6,7] -> [4,5,6,7,0,1,2]). Return the index of target, or -1. O(log n).
 *
 * EXAMPLES
 * Input: [4,5,6,7,0,1,2], 0   Output: 4
 * Input: [4,5,6,7,0,1,2], 3   Output: -1
 * Input: [1], 0               Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Distinct values? (yes; duplicates break the "which half is sorted" test -> problem 08)
 * - Rotation may be 0 (array fully sorted)
 *
 * APPROACH 1 — Brute force   O(n)
 * Linear scan. (Or: find the rotation point in O(log n), then binary search the right
 * half - two searches; the optimal does it in one.)
 *
 * APPROACH 2 — Optimal (one binary search, pick the sorted half)   O(log n) time, O(1) space
 * At any mid, at least one of [left..mid] and [mid..right] is sorted:
 *   if nums[left] <= nums[mid] -> left half is sorted
 *       if nums[left] <= target < nums[mid] -> target is in it: right = mid - 1
 *       else                                -> left = mid + 1
 *   else                       -> right half is sorted
 *       if nums[mid] < target <= nums[right] -> left = mid + 1
 *       else                                 -> right = mid - 1
 * We only ever trust the range check on the SORTED half, which is why it is safe.
 *
 * Dry run [4,5,6,7,0,1,2], target 0:
 *   l=0 r=6 mid=3 (7): nums[0]=4 <= 7 -> left half sorted; 4 <= 0 < 7? no -> l=4
 *   l=4 r=6 mid=5 (1): nums[4]=0 <= 1 -> left half sorted; 0 <= 0 < 1? yes -> r=4
 *   l=4 r=4 mid=4 (0) === target -> 4
 *
 * EDGE CASES
 * - no rotation (plain sorted)
 * - rotated by 1 ([5,1,2,3,4]) and by n-1 ([2,3,4,5,1])
 * - single element; two elements [3,1]
 * - target is the pivot (the minimum) or the maximum
 */

function bruteForce(nums, target) {
  return nums.indexOf(target);
}

function optimal(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {                       // left half [left..mid] is sorted
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;  // inside it
      else left = mid + 1;                               // must be in the other half
    } else {                                             // right half [mid..right] is sorted
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([4, 5, 6, 7, 0, 1, 2], 0), 4);
  assert.strictEqual(solve([4, 5, 6, 7, 0, 1, 2], 3), -1);
  assert.strictEqual(solve([1], 0), -1);
  assert.strictEqual(solve([1], 1), 0);
  assert.strictEqual(solve([3, 1], 1), 1);
  assert.strictEqual(solve([3, 1], 3), 0);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 4), 3);          // no rotation
  assert.strictEqual(solve([4, 5, 6, 7, 0, 1, 2], 7), 3);    // the maximum
  assert.strictEqual(solve([4, 5, 6, 7, 0, 1, 2], 4), 0);
  assert.strictEqual(solve([4, 5, 6, 7, 0, 1, 2], 2), 6);
  assert.strictEqual(solve([], 5), -1);
}
// random rotations cross-checked against indexOf
for (let trial = 0; trial < 300; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const base = Array.from({ length: n }, (_, i) => i * 2 - 5);
  const k = Math.floor(Math.random() * n);
  const rotated = base.slice(k).concat(base.slice(0, k));
  const target = Math.floor(Math.random() * 30) - 8;
  assert.strictEqual(optimal(rotated, target), rotated.indexOf(target), JSON.stringify([rotated, target]));
}
console.log('✓ 07-search-rotated-sorted-array passed');

module.exports = { optimal, bruteForce };
