/**
 * 07. Spiral Matrix   (LeetCode 54 — Medium)
 *
 * PROBLEM
 * Return all elements of an m x n matrix in spiral order (clockwise from the top-left).
 *
 * EXAMPLES
 * Input: [[1,2,3],[4,5,6],[7,8,9]]              Output: [1,2,3,6,9,8,7,4,5]
 * Input: [[1,2,3,4],[5,6,7,8],[9,10,11,12]]     Output: [1,2,3,4,8,12,11,10,9,5,6,7]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-square allowed? (yes - this is where bugs hide)
 * - Empty matrix? (return [])
 *
 * APPROACH 1 — Brute force (simulate walking with a visited grid)   O(m n) time, O(m n) space
 * Start at (0,0) heading right. Step until the next cell is out of bounds or visited, then
 * turn clockwise. Stop after m*n cells. Simple to reason about, needs a visited matrix.
 *
 * APPROACH 2 — Optimal (four shrinking walls)   O(m n) time, O(1) extra (besides output)
 * Keep top, bottom, left, right. Each loop: walk the top row (then top++), the right column
 * (right--), the bottom row if top <= bottom (bottom--), the left column if left <= right
 * (left++). The two `if` guards prevent double-visiting on the final single row/column.
 *
 * Dry run on 3x4 [[1,2,3,4],[5,6,7,8],[9,10,11,12]]:
 *   top row:    1 2 3 4     top=1
 *   right col:  8 12        right=2
 *   bottom row: 11 10 9     bottom=1
 *   left col:   5           left=1
 *   top row:    6 7         top=2 > bottom -> stop
 *
 * EDGE CASES
 * - 1 x n and n x 1 -> the guards matter
 * - 1 x 1 -> [x]
 * - [] -> []
 */

function bruteForce(matrix) {
  const rows = matrix.length;
  if (rows === 0) return [];
  const cols = matrix[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
  const result = [];
  let r = 0, c = 0, d = 0;
  for (let k = 0; k < rows * cols; k++) {
    result.push(matrix[r][c]);
    visited[r][c] = true;
    let nr = r + dirs[d][0], nc = c + dirs[d][1];
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) {
      d = (d + 1) % 4;                           // turn clockwise
      nr = r + dirs[d][0]; nc = c + dirs[d][1];
    }
    r = nr; c = nc;
  }
  return result;
}

function optimal(matrix) {
  const result = [];
  if (matrix.length === 0) return result;
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;
    if (top <= bottom) {                          // still a row left to walk back along
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {                          // still a column left to walk up
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5]);
  assert.deepStrictEqual(solve([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
  assert.deepStrictEqual(solve([[1, 2, 3]]), [1, 2, 3]);
  assert.deepStrictEqual(solve([[1], [2], [3]]), [1, 2, 3]);
  assert.deepStrictEqual(solve([[7]]), [7]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([[1, 2], [3, 4], [5, 6]]), [1, 2, 4, 6, 5, 3]);
}
console.log('✓ 07-spiral-matrix passed');

module.exports = { optimal, bruteForce };
