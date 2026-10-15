/**
 * 11. Search a 2D Matrix   (LeetCode 74 — Medium)
 *
 * PROBLEM
 * An m x n matrix has each row sorted ascending, and the first element of each row is
 * greater than the last element of the previous row. Return true if target is in it.
 * O(log(m * n)) required.
 *
 * EXAMPLES
 * matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]
 * Input: target = 3    Output: true
 * Input: target = 13   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Rows "chain" (row i+1 starts after row i ends)? (yes; if NOT, that is LeetCode 240,
 *   solved with the staircase walk from the top-right corner in O(m + n))
 * - m, n >= 1
 *
 * APPROACH 1 — Brute force   O(m * n)
 * Scan every cell. (Or O(m + n) staircase walk, which also works here.)
 *
 * APPROACH 2 — Optimal (treat the matrix as one flat sorted array)   O(log(m*n)) time, O(1) space
 * Reading the matrix row by row gives a sorted list of length m * n. Binary search
 * over virtual indices 0..m*n-1 and translate on the fly:
 *   row = Math.floor(index / n),  col = index % n
 * Plain Template 1 otherwise.
 *
 * Dry run target = 3, m=3 n=4 (12 cells):
 *   l=0 r=11 mid=5 -> row 1 col 1 -> 11 > 3 -> r=4
 *   l=0 r=4  mid=2 -> row 0 col 2 -> 5 > 3  -> r=1
 *   l=0 r=1  mid=0 -> row 0 col 0 -> 1 < 3  -> l=1
 *   l=1 r=1  mid=1 -> row 0 col 1 -> 3 === 3 -> true
 *
 * EDGE CASES
 * - 1x1 matrix
 * - single row / single column
 * - target smaller than matrix[0][0] or larger than the last cell
 */

function bruteForce(matrix, target) {
  for (const row of matrix) for (const value of row) if (value === target) return true;
  return false;
}

function optimal(matrix, target) {
  const rows = matrix.length;
  if (rows === 0) return false;
  const cols = matrix[0].length;
  let left = 0, right = rows * cols - 1;          // virtual flat indices
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    const value = matrix[Math.floor(mid / cols)][mid % cols];   // translate to (row, col)
    if (value === target) return true;
    if (value < target) left = mid + 1;
    else right = mid - 1;
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
const matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(matrix, 3), true);
  assert.strictEqual(solve(matrix, 13), false);
  assert.strictEqual(solve(matrix, 1), true);
  assert.strictEqual(solve(matrix, 60), true);
  assert.strictEqual(solve(matrix, 0), false);
  assert.strictEqual(solve(matrix, 61), false);
  assert.strictEqual(solve([[5]], 5), true);
  assert.strictEqual(solve([[5]], 4), false);
  assert.strictEqual(solve([[1, 2, 3]], 2), true);          // single row
  assert.strictEqual(solve([[1], [2], [3]], 3), true);      // single column
  assert.strictEqual(solve([], 1), false);
}
console.log('✓ 11-search-2d-matrix passed');

module.exports = { optimal, bruteForce };
