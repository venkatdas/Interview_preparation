/**
 * 09. Merge Sorted Array   (LeetCode 88 — Easy)
 *
 * PROBLEM
 * nums1 has length m + n: the first m slots hold sorted values, the last n slots are
 * zeros (free space). nums2 has n sorted values. Merge nums2 INTO nums1 so that nums1
 * is sorted. Do it in place.
 *
 * EXAMPLES
 * Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3   Output: [1, 2, 2, 3, 5, 6]
 * Input: nums1 = [1], m = 1, nums2 = [], n = 0                        Output: [1]
 * Input: nums1 = [0], m = 0, nums2 = [1], n = 1                       Output: [1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are both inputs sorted ascending? (yes)
 * - Is the free space in nums1 guaranteed to be exactly n? (yes)
 * - Duplicates allowed? (yes, keep all of them)
 *
 * APPROACH 1 — Brute force   O((m+n) log(m+n)) time, O(1) extra space (sort is in place)
 * Copy nums2 into the free slots of nums1, then sort nums1 with a numeric comparator.
 *
 * APPROACH 2 — Optimal (fill from the back, two pointers)   O(m + n) time, O(1) space
 * Merging from the FRONT would overwrite unprocessed nums1 values. But the back of
 * nums1 is empty, so merge from the back: compare the largest remaining of each array
 * and place the bigger one at the last free slot. Pointers: i = m-1 (nums1), j = n-1
 * (nums2), write = m+n-1. If nums2 runs out first we are done; if nums1 runs out first,
 * copy the rest of nums2.
 *
 * Dry run on nums1 = [1, 2, 3, 0, 0, 0], nums2 = [2, 5, 6]:
 *   i=2(3) j=2(6) write=5: 6 > 3 -> nums1[5]=6, j=1     [1,2,3,0,0,6]
 *   i=2(3) j=1(5) write=4: 5 > 3 -> nums1[4]=5, j=0     [1,2,3,0,5,6]
 *   i=2(3) j=0(2) write=3: 3 > 2 -> nums1[3]=3, i=1     [1,2,3,3,5,6]
 *   i=1(2) j=0(2) write=2: 2 <= 2 -> nums1[2]=2, j=-1   [1,2,2,3,5,6]
 *   j < 0 -> stop. nums1's leftovers are already in place.
 *
 * EDGE CASES
 * - n = 0 -> nums1 unchanged
 * - m = 0 -> nums1 becomes a copy of nums2
 * - All of nums2 smaller than all of nums1 -> nums1 values all shift right
 * - Duplicates across the two arrays
 */

function bruteForce(nums1, m, nums2, n) {
  for (let j = 0; j < n; j++) nums1[m + j] = nums2[j];
  nums1.sort((a, b) => a - b); // numeric comparator, never the default string sort
  return nums1;
}

function optimal(nums1, m, nums2, n) {
  let i = m - 1;          // last real value in nums1
  let j = n - 1;          // last value in nums2
  let write = m + n - 1;  // last slot of nums1

  // while nums2 still has values; if nums2 is empty first, nums1's rest is already sorted in place
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[write] = nums1[i];
      i--;
    } else {
      nums1[write] = nums2[j];
      j--;
    }
    write--;
  }
  return nums1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3), [1, 2, 2, 3, 5, 6]);
  assert.deepStrictEqual(solve([1], 1, [], 0), [1]);
  assert.deepStrictEqual(solve([0], 0, [1], 1), [1]);
  assert.deepStrictEqual(solve([4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3), [1, 2, 3, 4, 5, 6]);
  assert.deepStrictEqual(solve([1, 2, 3, 0, 0, 0], 3, [4, 5, 6], 3), [1, 2, 3, 4, 5, 6]);
  assert.deepStrictEqual(solve([2, 2, 0, 0], 2, [2, 2], 2), [2, 2, 2, 2]);
  assert.deepStrictEqual(solve([-3, 0, 0], 1, [-5, -4], 2), [-5, -4, -3]);
}
console.log('✓ 09-merge-sorted-array passed');

module.exports = { optimal, bruteForce };
