/**
 * 16. Median of Two Sorted Arrays   (LeetCode 4 — Hard)
 *
 * PROBLEM
 * Given two sorted arrays of sizes m and n, return the median of the combined sorted
 * array in O(log(m + n)).
 *
 * EXAMPLES
 * Input: [1,3], [2]       Output: 2.0    (merged [1,2,3])
 * Input: [1,2], [3,4]     Output: 2.5    (merged [1,2,3,4], (2+3)/2)
 * Input: [], [1]          Output: 1.0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Either array may be empty, but not both
 * - Median of an even count = average of the two middle values
 * - Values can be negative
 *
 * APPROACH 1 — Brute force (merge)   O(m + n) time, O(m + n) space
 * Merge the two arrays like merge sort, then pick the middle element(s). Simple,
 * and what you should write first in an interview before attempting the log version.
 *
 * APPROACH 2 — Optimal (binary search the partition of the smaller array)   O(log min(m, n)) time, O(1) space
 * Think of cutting each array into a left part and a right part so that:
 *   - left parts together hold half of all elements: (m + n + 1) / 2 (rounded down)
 *   - every element in the left parts <= every element in the right parts
 * If we cut A after i elements, B must be cut after j = half - i elements. The second
 * condition only needs checking at the boundary:
 *   A[i-1] <= B[j]  and  B[j-1] <= A[i]
 * Binary search i over [0, m] (A is the SHORTER array so j is never negative):
 *   A[i-1] > B[j]  -> i is too big  -> hi = i - 1
 *   B[j-1] > A[i]  -> i is too small -> lo = i + 1
 *   else found. Median = max(left parts) if odd total, else avg(max(left), min(right)).
 * Use -Infinity / +Infinity for out-of-range neighbours so empty parts work.
 *
 * Dry run A=[1,2], B=[3,4]: m=2 n=2 half=2
 *   lo=0 hi=2 i=1 j=1: A[0]=1 <= B[1]=4 ok; B[0]=3 <= A[1]=2? NO -> i too small -> lo=2
 *   i=2 j=0: A[1]=2 <= B[0]=3 ok; B[-1]=-Inf <= A[2]=+Inf ok -> found
 *   maxLeft = max(A[1]=2, B[-1]=-Inf) = 2; minRight = min(A[2]=+Inf, B[0]=3) = 3
 *   total even -> (2 + 3) / 2 = 2.5
 *
 * EDGE CASES
 * - one array empty
 * - all of A smaller than all of B (cut at i = m)
 * - duplicates across arrays
 * - sizes 1 and 1
 */

function bruteForce(nums1, nums2) {
  const merged = [];
  let i = 0, j = 0;
  while (i < nums1.length || j < nums2.length) {
    if (j >= nums2.length || (i < nums1.length && nums1[i] <= nums2[j])) merged.push(nums1[i++]);
    else merged.push(nums2[j++]);
  }
  const n = merged.length;
  return n % 2 === 1 ? merged[(n - 1) / 2] : (merged[n / 2 - 1] + merged[n / 2]) / 2;
}

function optimal(nums1, nums2) {
  // always binary search the shorter array
  if (nums1.length > nums2.length) return optimal(nums2, nums1);
  const A = nums1, B = nums2;
  const m = A.length, n = B.length;
  const half = Math.floor((m + n + 1) / 2);      // size of the combined left part

  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = lo + ((hi - lo) >> 1);             // A contributes i elements to the left part
    const j = half - i;                          // B contributes the rest

    const aLeft = i === 0 ? -Infinity : A[i - 1];
    const aRight = i === m ? Infinity : A[i];
    const bLeft = j === 0 ? -Infinity : B[j - 1];
    const bRight = j === n ? Infinity : B[j];

    if (aLeft <= bRight && bLeft <= aRight) {    // correct partition
      const maxLeft = Math.max(aLeft, bLeft);
      if ((m + n) % 2 === 1) return maxLeft;
      const minRight = Math.min(aRight, bRight);
      return (maxLeft + minRight) / 2;
    }
    if (aLeft > bRight) hi = i - 1;              // too many from A on the left
    else lo = i + 1;                             // too few from A on the left
  }
  throw new Error('inputs are not sorted');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3], [2]), 2);
  assert.strictEqual(solve([1, 2], [3, 4]), 2.5);
  assert.strictEqual(solve([], [1]), 1);
  assert.strictEqual(solve([2], []), 2);
  assert.strictEqual(solve([1, 2], [1, 2]), 1.5);
  assert.strictEqual(solve([1, 2, 3], [4, 5, 6]), 3.5);
  assert.strictEqual(solve([4, 5, 6], [1, 2, 3]), 3.5);
  assert.strictEqual(solve([-5, -3], [-4, 10]), -3.5);
  assert.strictEqual(solve([1], [2, 3, 4, 5, 6]), 3.5);
}
for (let trial = 0; trial < 500; trial++) {
  const a = Array.from({ length: Math.floor(Math.random() * 7) }, () => Math.floor(Math.random() * 20) - 10).sort((x, y) => x - y);
  const b = Array.from({ length: Math.floor(Math.random() * 7) }, () => Math.floor(Math.random() * 20) - 10).sort((x, y) => x - y);
  if (a.length + b.length === 0) continue;
  assert.strictEqual(optimal(a, b), bruteForce(a, b), JSON.stringify([a, b]));
}
console.log('✓ 16-median-of-two-sorted-arrays passed');

module.exports = { optimal, bruteForce };
