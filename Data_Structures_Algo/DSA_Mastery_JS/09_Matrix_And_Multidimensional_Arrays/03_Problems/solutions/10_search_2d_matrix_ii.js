/**
 * 10. Search a 2D Matrix II   (LeetCode 240 — Medium)
 *
 * PROBLEM
 * Each row is sorted left to right and each column is sorted top to bottom (but rows do NOT
 * continue into each other). Return true if target is in the matrix.
 *
 * EXAMPLES
 * Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5    Output: true
 * Input: same matrix, target = 20   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the matrix fully sorted (row i ends <= row i+1 starts)? (no - that is LeetCode 74, one binary search)
 * - Duplicates? (possible; we only need existence)
 *
 * APPROACH 1 — Brute force   O(m n) time, O(1) space
 * Scan every cell. (Binary search in each row gives O(m log n), also "brute-ish".)
 *
 * APPROACH 2 — Optimal (staircase search from the top-right)   O(m + n) time, O(1) space
 * Start at the top-right corner. That cell is the LARGEST in its row and the SMALLEST in
 * its column. Compare with target:
 *   equal   -> found
 *   greater -> the whole column below is bigger too -> move LEFT (eliminate a column)
 *   smaller -> the whole row to the left is smaller too -> move DOWN (eliminate a row)
 * Each step throws away a full row or column, so at most m + n steps.
 * (Starting bottom-left works symmetrically. Top-left does NOT work: both directions grow.)
 *
 * Dry run for target 5:
 *   (0,4)=15 > 5 -> left  (0,3)=11 > 5 -> left  (0,2)=7 > 5 -> left  (0,1)=4 < 5 -> down
 *   (1,1)=5 == 5 -> true
 *
 * EDGE CASES
 * - empty matrix -> false
 * - target smaller than the top-left or larger than the bottom-right -> false quickly
 * - 1 x n or n x 1 -> degenerates to a linear scan
 */

function bruteForce(matrix, target) {
  for (const row of matrix) for (const value of row) if (value === target) return true;
  return false;
}

function optimal(matrix, target) {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  let r = 0;
  let c = matrix[0].length - 1;             // top-right corner
  while (r < matrix.length && c >= 0) {
    const value = matrix[r][c];
    if (value === target) return true;
    if (value > target) c--;                // everything below in this column is even bigger
    else r++;                               // everything to the left in this row is even smaller
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
const grid = [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(grid, 5), true);
  assert.strictEqual(solve(grid, 20), false);
  assert.strictEqual(solve(grid, 1), true);
  assert.strictEqual(solve(grid, 30), true);
  assert.strictEqual(solve(grid, 0), false);
  assert.strictEqual(solve([], 1), false);
  assert.strictEqual(solve([[5]], 5), true);
  assert.strictEqual(solve([[1, 3, 5]], 3), true);
  assert.strictEqual(solve([[1], [3], [5]], 4), false);
}
console.log('✓ 10-search-2d-matrix-ii passed');

module.exports = { optimal, bruteForce };
