/**
 * 11. Diagonal Traverse   (LeetCode 498 — Medium)
 *
 * PROBLEM
 * Return all elements of an m x n matrix in diagonal zigzag order: the first anti-diagonal
 * going up-right, the next going down-left, alternating.
 *
 * EXAMPLES
 * Input: [[1,2,3],[4,5,6],[7,8,9]]   Output: [1,2,4,7,5,3,6,8,9]
 * Input: [[1,2],[3,4]]               Output: [1,2,3,4]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Which direction first? (up-right, so the first diagonal after [1] is 2 then 4)
 * - Non-square allowed? (yes)
 *
 * APPROACH 1 — Brute force (group by r + c, then reverse every other group)   O(m n) time, O(m n) space
 * Cells on the same anti-diagonal share d = r + c. Bucket cells by d (row-major order gives
 * each bucket in down-left order), then reverse the buckets with even d so they go up-right.
 *
 * APPROACH 2 — Optimal (walk each diagonal directly)   O(m n) time, O(1) extra
 * For d from 0 to m + n - 2: the diagonal's cells are (r, d - r) for valid r. Going
 * "up-right" means r decreasing; "down-left" means r increasing. Compute the start cell
 * for the chosen direction, step along while in bounds. No buckets, no reversing.
 *
 * Dry run on 3x3:
 *   d=0 up:   (0,0)=1
 *   d=1 down: (0,1)=2 (1,0)=4
 *   d=2 up:   (2,0)=7 (1,1)=5 (0,2)=3
 *   d=3 down: (1,2)=6 (2,1)=8
 *   d=4 up:   (2,2)=9      -> [1,2,4,7,5,3,6,8,9]
 *
 * EDGE CASES
 * - single row / single column -> just that row / column in order
 * - empty -> []
 * - 1x1
 */

function bruteForce(mat) {
  if (mat.length === 0) return [];
  const rows = mat.length, cols = mat[0].length;
  const buckets = Array.from({ length: rows + cols - 1 }, () => []);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) buckets[r + c].push(mat[r][c]);
  const result = [];
  buckets.forEach((bucket, d) => {
    if (d % 2 === 0) bucket.reverse();  // even diagonals go up-right
    result.push(...bucket);
  });
  return result;
}

function optimal(mat) {
  if (mat.length === 0) return [];
  const rows = mat.length, cols = mat[0].length;
  const result = [];
  for (let d = 0; d < rows + cols - 1; d++) {
    if (d % 2 === 0) {
      // up-right: start at the lowest possible row, move r--, c++
      let r = Math.min(d, rows - 1);
      let c = d - r;
      while (r >= 0 && c < cols) result.push(mat[r--][c++]);
    } else {
      // down-left: start at the lowest possible column, move r++, c--
      let c = Math.min(d, cols - 1);
      let r = d - c;
      while (c >= 0 && r < rows) result.push(mat[r++][c--]);
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 4, 7, 5, 3, 6, 8, 9]);
  assert.deepStrictEqual(solve([[1, 2], [3, 4]]), [1, 2, 3, 4]);
  assert.deepStrictEqual(solve([[1, 2, 3, 4]]), [1, 2, 3, 4]);
  assert.deepStrictEqual(solve([[1], [2], [3]]), [1, 2, 3]);
  assert.deepStrictEqual(solve([[7]]), [7]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([[1, 2, 3], [4, 5, 6]]), [1, 2, 4, 5, 3, 6]);
}
console.log('✓ 11-diagonal-traverse passed');

module.exports = { optimal, bruteForce };
