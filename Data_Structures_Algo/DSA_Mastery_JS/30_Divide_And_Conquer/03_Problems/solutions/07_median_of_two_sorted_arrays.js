/**
 * 07. Median of Two Sorted Arrays   (LeetCode 4 — Hard)
 *
 * PROBLEM
 * Given two sorted arrays nums1 (size m) and nums2 (size n), return the median of all
 * m + n numbers. Required complexity: O(log(m + n)).
 *
 * EXAMPLES
 * Input: [1,3], [2]      Output: 2.0
 * Input: [1,2], [3,4]    Output: 2.5
 * Input: [], [1]         Output: 1.0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - One array may be empty, but not both
 * - Median of an even count = average of the two middle values
 *
 * APPROACH 1 — Brute force   O(m + n) time, O(m + n) space
 * Merge the two arrays (two pointers) and read the middle element(s).
 *
 * APPROACH 2 — Optimal (Binary search on the partition of the shorter array)   O(log(min(m, n)))
 * We want to cut both arrays into a LEFT part and a RIGHT part such that
 *   - left parts together hold half of all elements:  i + j = (m + n + 1) / 2
 *   - every left element <= every right element:  A[i-1] <= B[j] and B[j-1] <= A[i]
 * Binary search i (how many of A go left) in [0, m]; j is then fixed. If A[i-1] > B[j],
 * i is too big -> move left; if B[j-1] > A[i], i is too small -> move right.
 * Once found: maxLeft = max(A[i-1], B[j-1]); minRight = min(A[i], B[j]).
 * Odd total -> maxLeft; even -> (maxLeft + minRight) / 2. Use +-Infinity for edges.
 * This is divide & conquer in the "throw away half the search space each step" sense.
 *
 * Dry run A = [1,2], B = [3,4]: m = n = 2, half = 2
 *   i = 1, j = 1: A[0]=1 <= B[1]=4 ok; B[0]=3 <= A[1]=2? no -> i too small -> lo = 2
 *   i = 2, j = 0: A[1]=2 <= B[0]=3 ok; B[-1]=-Inf <= A[2]=+Inf ok -> found
 *   maxLeft = max(2, -Inf) = 2; minRight = min(+Inf, 3) = 3; even -> 2.5
 *
 * EDGE CASES
 * - one array empty
 * - all of A smaller than all of B (partition at the edge: i = m)
 * - duplicates across arrays
 * - single element total
 */

function bruteForce(nums1, nums2) {
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length || j < nums2.length) {
    if (j >= nums2.length || (i < nums1.length && nums1[i] <= nums2[j])) merged.push(nums1[i++]);
    else merged.push(nums2[j++]);
  }
  const total = merged.length;
  if (total % 2 === 1) return merged[(total - 1) / 2];
  return (merged[total / 2 - 1] + merged[total / 2]) / 2;
}

function optimal(nums1, nums2) {
  if (nums1.length > nums2.length) return optimal(nums2, nums1);   // binary search the shorter one
  const A = nums1;
  const B = nums2;
  const m = A.length;
  const n = B.length;
  const half = Math.floor((m + n + 1) / 2);
  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;            // elements of A in the left part
    const j = half - i;                  // elements of B in the left part
    const aLeft = i > 0 ? A[i - 1] : -Infinity;
    const aRight = i < m ? A[i] : Infinity;
    const bLeft = j > 0 ? B[j - 1] : -Infinity;
    const bRight = j < n ? B[j] : Infinity;
    if (aLeft <= bRight && bLeft <= aRight) {
      const maxLeft = Math.max(aLeft, bLeft);
      const minRight = Math.min(aRight, bRight);
      return (m + n) % 2 === 1 ? maxLeft : (maxLeft + minRight) / 2;
    }
    if (aLeft > bRight) hi = i - 1;      // too many from A on the left
    else lo = i + 1;                     // too few from A on the left
  }
  throw new Error('inputs were not sorted');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3], [2]), 2);
  assert.strictEqual(solve([1, 2], [3, 4]), 2.5);
  assert.strictEqual(solve([], [1]), 1);
  assert.strictEqual(solve([2], []), 2);
  assert.strictEqual(solve([1, 2], [3, 4, 5, 6, 7]), 4);
  assert.strictEqual(solve([1, 1], [1, 1]), 1);
  assert.strictEqual(solve([5, 6, 7], [1, 2, 3]), 4);
}
for (let trial = 0; trial < 300; trial++) {
  const a = Array.from({ length: Math.floor(Math.random() * 8) }, () => Math.floor(Math.random() * 20)).sort((x, y) => x - y);
  const b = Array.from({ length: Math.floor(Math.random() * 8) }, () => Math.floor(Math.random() * 20)).sort((x, y) => x - y);
  if (a.length + b.length === 0) continue;
  assert.strictEqual(optimal(a, b), bruteForce(a, b));
}
console.log('✓ 07-median-of-two-sorted-arrays passed');

module.exports = { optimal, bruteForce };
