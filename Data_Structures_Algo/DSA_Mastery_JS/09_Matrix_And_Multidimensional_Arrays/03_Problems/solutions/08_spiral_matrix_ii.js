/**
 * 08. Spiral Matrix II   (LeetCode 59 — Medium)
 *
 * PROBLEM
 * Given n, generate an n x n matrix filled with 1 .. n^2 in spiral order (clockwise).
 *
 * EXAMPLES
 * Input: 3   Output: [[1,2,3],[8,9,4],[7,6,5]]
 * Input: 1   Output: [[1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n >= 1? (yes)
 *
 * APPROACH 1 — Brute force (walk and turn when blocked)   O(n^2) time, O(1) extra
 * Fill the grid with 0 (0 means empty). Walk right; when the next cell is out of bounds or
 * already filled, turn clockwise. Place the next number each step.
 *
 * APPROACH 2 — Optimal (four shrinking walls, same as Spiral Matrix)   O(n^2) time, O(1) extra
 * Identical skeleton to problem 07, but writing a counter instead of reading. Because the
 * matrix is square, the two guards are still needed for the final cell when n is odd
 * (the centre is a 1x1 remaining square).
 *
 * Dry run for n = 3:
 *   top row:    1 2 3     top=1
 *   right col:  4 5       right=1
 *   bottom row: 6 7       bottom=1
 *   left col:   8         left=1
 *   top row:    9         -> [[1,2,3],[8,9,4],[7,6,5]]
 *
 * EDGE CASES
 * - n = 1 -> [[1]]
 * - n = 2 -> [[1,2],[4,3]]
 */

function bruteForce(n) {
  const grid = Array.from({ length: n }, () => new Array(n).fill(0));
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let r = 0, c = 0, d = 0;
  for (let value = 1; value <= n * n; value++) {
    grid[r][c] = value;
    let nr = r + dirs[d][0], nc = c + dirs[d][1];
    if (nr < 0 || nr >= n || nc < 0 || nc >= n || grid[nr][nc] !== 0) {
      d = (d + 1) % 4;
      nr = r + dirs[d][0]; nc = c + dirs[d][1];
    }
    r = nr; c = nc;
  }
  return grid;
}

function optimal(n) {
  const grid = Array.from({ length: n }, () => new Array(n).fill(0));
  let top = 0, bottom = n - 1, left = 0, right = n - 1;
  let value = 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) grid[top][c] = value++;
    top++;
    for (let r = top; r <= bottom; r++) grid[r][right] = value++;
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) grid[bottom][c] = value++;
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) grid[r][left] = value++;
      left++;
    }
  }
  return grid;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(3), [[1, 2, 3], [8, 9, 4], [7, 6, 5]]);
  assert.deepStrictEqual(solve(1), [[1]]);
  assert.deepStrictEqual(solve(2), [[1, 2], [4, 3]]);
  assert.deepStrictEqual(solve(4), [[1, 2, 3, 4], [12, 13, 14, 5], [11, 16, 15, 6], [10, 9, 8, 7]]);
  assert.strictEqual(solve(5).flat().reduce((a, b) => a + b, 0), (25 * 26) / 2); // all 1..25 present
}
console.log('✓ 08-spiral-matrix-ii passed');

module.exports = { optimal, bruteForce };
