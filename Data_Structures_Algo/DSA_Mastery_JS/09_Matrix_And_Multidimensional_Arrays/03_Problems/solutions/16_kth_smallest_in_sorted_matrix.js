/**
 * 16. Kth Smallest Element in a Sorted Matrix   (LeetCode 378 — Medium)
 *
 * PROBLEM
 * An n x n matrix has rows and columns sorted ascending. Return the k-th smallest element
 * (1-indexed, counting duplicates). Aim for better than O(n^2) extra memory.
 *
 * EXAMPLES
 * Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8   Output: 13
 *   Explanation: sorted: 1,5,9,10,11,12,13,13,15 -> 8th is 13
 * Input: matrix = [[-5]], k = 1   Output: -5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Rows and columns sorted, but not fully sorted end to end? (right - so no 1D binary search)
 * - 1 <= k <= n^2? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2 log n) time, O(n^2) space
 * Flatten, sort, index k - 1. (A min-heap over rows gives O(k log n) - also fine.)
 *
 * APPROACH 2 — Optimal (binary search on the VALUE)   O(n log(max - min)) time, O(1) space
 * The answer lies between matrix[0][0] and matrix[n-1][n-1]. For a candidate value mid,
 * count how many cells are <= mid. Because rows and columns are sorted, this count is
 * found with a staircase walk from the bottom-left in O(n): move up when the cell > mid
 * (the whole row to the right is bigger), move right when it is <= mid (the whole column
 * above is smaller, so add the column height so far).
 * If count >= k, the answer is <= mid -> hi = mid; else lo = mid + 1. The loop ends with
 * lo === hi equal to the smallest value whose count >= k, which is always an element of
 * the matrix (counts only change at actual values).
 *
 * Dry run on the example, k = 8: lo=1, hi=15
 *   mid=8:  count(<=8)=2  < 8 -> lo=9
 *   mid=12: count(<=12)=6 < 8 -> lo=13
 *   mid=14: count(<=14)=8 >= 8 -> hi=14
 *   mid=13: count(<=13)=8 >= 8 -> hi=13   lo=13=hi -> 13
 *
 * EDGE CASES
 * - 1x1 -> that element
 * - k = 1 -> matrix[0][0]; k = n^2 -> bottom-right
 * - duplicates: the count includes them, so the answer respects them
 * - negative values: use lo/hi from the matrix, not 0
 */

function bruteForce(matrix, k) {
  return matrix.flat().sort((a, b) => a - b)[k - 1];
}

function countLessOrEqual(matrix, value) {
  const n = matrix.length;
  let count = 0;
  let r = n - 1;       // start bottom-left
  let c = 0;
  while (r >= 0 && c < n) {
    if (matrix[r][c] <= value) {
      count += r + 1;  // this cell and everything above it in the column are <= value
      c++;
    } else {
      r--;             // too big: everything to the right in this row is too big as well
    }
  }
  return count;
}

function optimal(matrix, k) {
  const n = matrix.length;
  let lo = matrix[0][0];
  let hi = matrix[n - 1][n - 1];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (countLessOrEqual(matrix, mid) >= k) hi = mid; // answer is mid or smaller
    else lo = mid + 1;                                // need a bigger value
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8), 13);
  assert.strictEqual(solve([[-5]], 1), -5);
  assert.strictEqual(solve([[1, 2], [1, 3]], 2), 1);
  assert.strictEqual(solve([[1, 2], [1, 3]], 4), 3);
  assert.strictEqual(solve([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 1), 1);
  assert.strictEqual(solve([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 9), 15);
  assert.strictEqual(solve([[-10, -5], [-3, 0]], 3), -3);
}
console.log('✓ 16-kth-smallest-in-sorted-matrix passed');

module.exports = { optimal, bruteForce };
