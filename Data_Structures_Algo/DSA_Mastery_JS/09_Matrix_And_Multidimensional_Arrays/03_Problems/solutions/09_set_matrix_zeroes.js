/**
 * 09. Set Matrix Zeroes   (LeetCode 73 — Medium)
 *
 * PROBLEM
 * If a cell is 0, set its entire row and column to 0. Do it in place. Follow-up: O(1) extra
 * space.
 *
 * EXAMPLES
 * Input: [[1,1,1],[1,0,1],[1,1,1]]            Output: [[1,0,1],[0,0,0],[1,0,1]]
 * Input: [[0,1,2,0],[3,4,5,2],[1,3,1,5]]      Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Must it be O(1) extra space, or is O(m + n) acceptable? (O(m+n) is the normal answer, O(1) is the follow-up)
 * - Values can be any integers, including negatives? (yes)
 *
 * APPROACH 1 — Brute force / standard   O(m n) time, O(m + n) space
 * First pass: record which rows and columns contain a 0 (two Sets or boolean arrays).
 * Second pass: zero any cell whose row or column is flagged. You cannot zero during the
 * first pass - the new zeros would be mistaken for original zeros.
 *
 * APPROACH 2 — Optimal (first row and first column as the flags)   O(m n) time, O(1) space
 * Use grid[r][0] as the flag for row r and grid[0][c] as the flag for column c. Cell (0,0)
 * is shared by both, so keep one extra boolean `firstColHasZero` for column 0 (grid[0][0]
 * will serve as the row-0 flag).
 *   1. Scan column 0 -> firstColHasZero.
 *   2. For c >= 1, scan every cell; if 0, set grid[r][0] = 0 and grid[0][c] = 0.
 *   3. For r >= 1, c >= 1 (bottom-right block): if grid[r][0] === 0 or grid[0][c] === 0 -> 0.
 *   4. If grid[0][0] === 0, zero row 0. If firstColHasZero, zero column 0.
 * Order matters: the first row/column must be processed LAST, after they have served as flags.
 *
 * Dry run on [[1,1,1],[1,0,1],[1,1,1]]:
 *   firstColHasZero = false
 *   (1,1)=0 -> grid[1][0]=0, grid[0][1]=0  -> [[1,0,1],[0,0,1],[1,1,1]]
 *   block: (1,2): row flag 0 -> 0; (2,1): col flag 0 -> 0 -> [[1,0,1],[0,0,0],[1,0,1]]
 *   grid[0][0] = 1 -> row 0 untouched; firstColHasZero false -> done
 *
 * EDGE CASES
 * - zero in the first row or first column (the tricky part - test it)
 * - no zeros -> unchanged
 * - all zeros -> all zeros
 * - 1 x n or n x 1
 */

function bruteForce(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const zeroRows = new Set();
  const zeroCols = new Set();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 0) { zeroRows.add(r); zeroCols.add(c); }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (zeroRows.has(r) || zeroCols.has(c)) matrix[r][c] = 0;
    }
  }
  return matrix;
}

function optimal(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // 1. column 0 needs its own flag because grid[0][0] is taken by row 0
  let firstColHasZero = false;
  for (let r = 0; r < rows; r++) if (matrix[r][0] === 0) firstColHasZero = true;

  // 2. use first row / first column as flags for the rest
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }

  // 3. zero the inner block based on the flags
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }

  // 4. finally the first row and the first column themselves
  if (matrix[0][0] === 0) for (let c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstColHasZero) for (let r = 0; r < rows; r++) matrix[r][0] = 0;

  return matrix;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 1, 1], [1, 0, 1], [1, 1, 1]]), [[1, 0, 1], [0, 0, 0], [1, 0, 1]]);
  assert.deepStrictEqual(solve([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]), [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]);
  assert.deepStrictEqual(solve([[1, 2], [3, 4]]), [[1, 2], [3, 4]]);
  assert.deepStrictEqual(solve([[1, 0]]), [[0, 0]]);
  assert.deepStrictEqual(solve([[1], [0], [3]]), [[0], [0], [0]]);
  assert.deepStrictEqual(solve([[1, 2, 3], [0, 5, 6]]), [[0, 2, 3], [0, 0, 0]]);
  assert.deepStrictEqual(solve([[-1, 2], [3, 0]]), [[-1, 0], [0, 0]]);
}
console.log('✓ 09-set-matrix-zeroes passed');

module.exports = { optimal, bruteForce };
