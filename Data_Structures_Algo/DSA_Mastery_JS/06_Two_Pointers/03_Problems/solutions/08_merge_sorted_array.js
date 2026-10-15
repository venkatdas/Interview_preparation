/**
 * 08. Merge Sorted Array   (LeetCode 88 — Easy)
 *
 * PROBLEM
 * nums1 has length m + n: the first m elements are sorted values, the last n are zeros
 * (empty space). nums2 has n sorted values. Merge nums2 into nums1 IN PLACE so nums1 is sorted.
 *
 * EXAMPLES
 * Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3
 * Output: nums1 = [1, 2, 2, 3, 5, 6]
 * Input: nums1 = [1], m = 1, nums2 = [], n = 0   Output: [1]
 * Input: nums1 = [0], m = 0, nums2 = [1], n = 1  Output: [1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the spare room guaranteed to be exactly n slots at the END of nums1? (yes)
 * - In place, O(1) extra space? (yes)
 * - Duplicates across the arrays? (fine)
 *
 * APPROACH 1 — Brute force   O((m+n) log(m+n)) time, O(1) space
 * Copy nums2 into the empty slots and sort nums1. Ignores that both halves are sorted.
 *
 * APPROACH 2 — Optimal (two pointers, fill from the BACK)   O(m + n) time, O(1) space
 * Merging from the front would overwrite nums1 values we haven't used yet.
 * The empty space is at the END, so fill from the end: compare the largest remaining
 * of each array and place the bigger one at position write = m + n - 1, moving down.
 * Stop when nums2 is exhausted: any leftover nums1 values are already in place.
 *
 * Dry run on nums1 = [1, 2, 3, _, _, _], nums2 = [2, 5, 6]:
 *   i=2 (3) j=2 (6) write=5: 6 bigger -> nums1[5]=6, j=1
 *   i=2 (3) j=1 (5) write=4: 5 bigger -> nums1[4]=5, j=0
 *   i=2 (3) j=0 (2) write=3: 3 bigger -> nums1[3]=3, i=1
 *   i=1 (2) j=0 (2) write=2: tie -> take nums2 (either works) nums1[2]=2, j=-1
 *   j < 0 -> stop. nums1 = [1, 2, 2, 3, 5, 6]
 *
 * EDGE CASES
 * - n = 0 -> nothing to do
 * - m = 0 -> copy nums2 over entirely
 * - all of nums2 smaller than all of nums1 -> nums1 values shift to the end
 */

function bruteForce(nums1, m, nums2, n) {
  for (let j = 0; j < n; j++) nums1[m + j] = nums2[j];
  nums1.sort((a, b) => a - b);
  return nums1;
}

function optimal(nums1, m, nums2, n) {
  let i = m - 1;          // last real value in nums1
  let j = n - 1;          // last value in nums2
  let write = m + n - 1;  // last slot in nums1

  while (j >= 0) {
    // if nums1 still has values and its current one is bigger, take it; otherwise take nums2
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[write] = nums1[i];
      i--;
    } else {
      nums1[write] = nums2[j];
      j--;
    }
    write--;
  }
  // leftover nums1 values (i >= 0) are already in their final place
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
  assert.deepStrictEqual(solve([2, 0], 1, [1], 1), [1, 2]);
  assert.deepStrictEqual(solve([-1, 0, 0], 1, [-3, -2], 2), [-3, -2, -1]);
}
console.log('✓ 08-merge-sorted-array passed');

module.exports = { optimal, bruteForce };
