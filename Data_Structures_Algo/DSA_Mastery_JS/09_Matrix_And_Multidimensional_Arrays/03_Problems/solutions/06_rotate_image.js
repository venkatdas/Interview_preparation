/**
 * 06. Rotate Image   (LeetCode 48 — Medium)
 *
 * PROBLEM
 * Rotate an n x n matrix 90 degrees clockwise, IN PLACE (O(1) extra space).
 *
 * EXAMPLES
 * Input: [[1,2,3],[4,5,6],[7,8,9]]   Output: [[7,4,1],[8,5,2],[9,6,3]]
 * Input: [[1,2],[3,4]]               Output: [[3,1],[4,2]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Square only? (yes - a non-square rotation changes dimensions and cannot be in place)
 * - Clockwise? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n^2) space
 * Build a new matrix where result[c][n-1-r] = grid[r][c], then copy it back. Correct, but
 * uses O(n^2) extra space which the problem forbids.
 *
 * APPROACH 2 — Optimal (transpose + reverse each row)   O(n^2) time, O(1) space
 * Transpose flips over the main diagonal (rows become columns). Reversing each row then
 * turns that into a clockwise rotation. Both steps are in place.
 * (For anticlockwise: transpose + reverse each COLUMN. For 180: reverse rows + reverse each row.)
 * Alternative: rotate 4 cells at a time in rings (more index arithmetic, same complexity).
 *
 * Dry run on [[1,2,3],[4,5,6],[7,8,9]]:
 *   transpose -> [[1,4,7],[2,5,8],[3,6,9]]
 *   reverse rows -> [[7,4,1],[8,5,2],[9,6,3]]
 *
 * EDGE CASES
 * - 1x1 -> unchanged
 * - 2x2 -> works (loop c > r swaps only (0,1))
 * - transposing with c >= 0 instead of c > r would swap each pair twice and undo itself
 */

function bruteForce(matrix) {
  const n = matrix.length;
  const rotated = Array.from({ length: n }, () => new Array(n));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) rotated[c][n - 1 - r] = matrix[r][c];
  }
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) matrix[r][c] = rotated[r][c];
  return matrix;
}

function optimal(matrix) {
  const n = matrix.length;
  // 1. transpose in place: swap each pair above the diagonal with its mirror
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {
      [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];
    }
  }
  // 2. reverse every row
  for (const row of matrix) row.reverse();
  return matrix;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [[7, 4, 1], [8, 5, 2], [9, 6, 3]]);
  assert.deepStrictEqual(solve([[1, 2], [3, 4]]), [[3, 1], [4, 2]]);
  assert.deepStrictEqual(solve([[1]]), [[1]]);
  assert.deepStrictEqual(
    solve([[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]),
    [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]
  );
  // four rotations bring it back
  const m = [[1, 2], [3, 4]];
  solve(solve(solve(solve(m))));
  assert.deepStrictEqual(m, [[1, 2], [3, 4]]);
}
console.log('✓ 06-rotate-image passed');

module.exports = { optimal, bruteForce };
