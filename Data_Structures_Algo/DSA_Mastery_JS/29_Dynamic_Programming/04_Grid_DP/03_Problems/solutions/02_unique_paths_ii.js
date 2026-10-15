/**
 * 02. Unique Paths II   (LeetCode 63 — Medium)
 *
 * PROBLEM
 * Same robot (top-left to bottom-right, moves right or down), but the grid now has
 * obstacles: grid[i][j] === 1 is a wall you cannot step on. Count the distinct paths.
 *
 * EXAMPLES
 * Input: [[0,0,0],[0,1,0],[0,0,0]]   Output: 2
 *   Explanation: the middle cell is blocked; go around it on the top-right or bottom-left.
 * Input: [[0,1],[0,0]]               Output: 1
 * Input: [[1]]                       Output: 0   Explanation: start is blocked
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= m, n <= 100
 * - Can the start or goal be an obstacle? (yes -> answer 0)
 *
 * STATE
 *   dp[i][j] = number of paths from (0, 0) to (i, j) that avoid obstacles
 * RECURRENCE
 *   dp[i][j] = 0                         if grid[i][j] is an obstacle
 *   dp[i][j] = dp[i-1][j] + dp[i][j-1]   otherwise (out-of-grid parents count as 0)
 * BASE CASES
 *   dp[0][0] = grid[0][0] === 0 ? 1 : 0
 *   NOTE: the first row / column are NOT all 1s anymore. After the first obstacle in
 *   that row, every cell to its right is 0 (nothing can reach it).
 * ANSWER
 *   dp[m-1][n-1]
 *
 * APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space
 * paths(i, j) returns 0 for obstacles / out of bounds, 1 at the start, else the sum of
 * the two parents.
 *
 * APPROACH 2 — Memoization   O(m*n) time, O(m*n) space
 * APPROACH 3 — Tabulation    O(m*n) time, O(m*n) space
 *
 * Dry run on [[0,0,0],[0,1,0],[0,0,0]]:
 *      j=0  j=1  j=2
 * i=0 [ 1    1    1 ]
 * i=1 [ 1    0    1 ]     dp[1][1] = 0 (obstacle), dp[1][2] = 1 + 0 = 1
 * i=2 [ 1    1    2 ]     dp[2][1] = 0 + 1 = 1, dp[2][2] = 1 + 1 = 2  -> answer 2
 *
 * APPROACH 4 — One row   O(m*n) time, O(n) space
 * row[j] = obstacle ? 0 : row[j] + row[j-1]. Handle j = 0 separately (no left parent).
 *
 * EDGE CASES
 * - start or goal blocked -> 0
 * - obstacle in the first row: cells after it in that row are unreachable
 * - 1x1 grid with 0 -> 1
 */

function bruteForce(grid) {
  const rows = grid.length, cols = grid[0].length;
  function paths(i, j) {
    if (i < 0 || j < 0 || grid[i][j] === 1) return 0; // out of grid or wall
    if (i === 0 && j === 0) return 1;                  // reached the start
    return paths(i - 1, j) + paths(i, j - 1);
  }
  return paths(rows - 1, cols - 1);
}

function memo(grid) {
  const rows = grid.length, cols = grid[0].length;
  const cache = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  function paths(i, j) {
    if (i < 0 || j < 0 || grid[i][j] === 1) return 0;
    if (i === 0 && j === 0) return 1;
    if (cache[i][j] !== -1) return cache[i][j];
    cache[i][j] = paths(i - 1, j) + paths(i, j - 1);
    return cache[i][j];
  }
  return paths(rows - 1, cols - 1);
}

function tabulation(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) { dp[i][j] = 0; continue; } // wall: nobody stands here
      if (i === 0 && j === 0) { dp[i][j] = 1; continue; }
      const fromTop = i > 0 ? dp[i - 1][j] : 0;
      const fromLeft = j > 0 ? dp[i][j - 1] : 0;
      dp[i][j] = fromTop + fromLeft;
    }
  }
  return dp[rows - 1][cols - 1];
}

function optimized(grid) {
  const rows = grid.length, cols = grid[0].length;
  const row = new Array(cols).fill(0);
  row[0] = grid[0][0] === 0 ? 1 : 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        row[j] = 0; // a wall kills the count coming from above
      } else if (j > 0) {
        row[j] += row[j - 1]; // above (old row[j]) + left (new row[j-1])
      }
      // j === 0 and not a wall: keep row[0] as it is (only the path from above)
    }
  }
  return row[cols - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([[0, 0, 0], [0, 1, 0], [0, 0, 0]]), 2);
  assert.strictEqual(solve([[0, 1], [0, 0]]), 1);
  assert.strictEqual(solve([[1]]), 0);                      // start blocked
  assert.strictEqual(solve([[0]]), 1);                      // 1x1 free
  assert.strictEqual(solve([[0, 0], [0, 1]]), 0);           // goal blocked
  assert.strictEqual(solve([[0, 1, 0, 0]]), 0);             // single row, blocked
  assert.strictEqual(solve([[0], [0], [0]]), 1);            // single column
  assert.strictEqual(solve([[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]]), 2);
}
console.log('✓ 02-unique-paths-ii passed');

module.exports = { bruteForce, memo, tabulation, optimized };
