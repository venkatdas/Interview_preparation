/**
 * 01. Transpose Matrix   (LeetCode 867 — Easy)
 *
 * PROBLEM
 * Return the transpose of a matrix: flip it over its main diagonal so that row i becomes
 * column i. An m x n matrix becomes n x m.
 *
 * EXAMPLES
 * Input: [[1,2,3],[4,5,6],[7,8,9]]   Output: [[1,4,7],[2,5,8],[3,6,9]]
 * Input: [[1,2,3],[4,5,6]]           Output: [[1,4],[2,5],[3,6]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the matrix be non-square? (yes -> you cannot do it in place)
 * - Empty matrix? (return [])
 *
 * APPROACH 1 — Brute force (build column by column)   O(m n) time, O(m n) space
 * For each column index c, collect grid[r][c] for every r into a new row. Same complexity
 * as the "optimal" one; it is just a different way of writing the same loops.
 *
 * APPROACH 2 — Optimal (allocate n x m, result[c][r] = grid[r][c])   O(m n) time, O(m n) space
 * Allocate the result with swapped dimensions (careful: fresh row arrays!) and copy each
 * cell to its mirrored position. You must touch every cell once, so O(m n) is optimal.
 *
 * Dry run on [[1,2,3],[4,5,6]] (2x3 -> 3x2):
 *   result = [[_,_],[_,_],[_,_]]
 *   (0,0)=1 -> result[0][0]; (0,1)=2 -> result[1][0]; (0,2)=3 -> result[2][0]
 *   (1,0)=4 -> result[0][1]; (1,1)=5 -> result[1][1]; (1,2)=6 -> result[2][1]
 *   -> [[1,4],[2,5],[3,6]]
 *
 * EDGE CASES
 * - 1 x n -> n x 1
 * - [] -> []
 * - square matrix (in-place variant possible: swap grid[r][c] with grid[c][r] for c > r)
 */

function bruteForce(matrix) {
  if (matrix.length === 0) return [];
  const result = [];
  for (let c = 0; c < matrix[0].length; c++) {
    result.push(matrix.map((row) => row[c]));
  }
  return result;
}

function optimal(matrix) {
  const rows = matrix.length;
  if (rows === 0) return [];
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => new Array(rows)); // fresh rows, swapped dims
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) result[c][r] = matrix[r][c];
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
  assert.deepStrictEqual(solve([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
  assert.deepStrictEqual(solve([[1, 2, 3]]), [[1], [2], [3]]);
  assert.deepStrictEqual(solve([[1], [2]]), [[1, 2]]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([[7]]), [[7]]);
}
console.log('✓ 01-transpose-matrix passed');

module.exports = { optimal, bruteForce };
