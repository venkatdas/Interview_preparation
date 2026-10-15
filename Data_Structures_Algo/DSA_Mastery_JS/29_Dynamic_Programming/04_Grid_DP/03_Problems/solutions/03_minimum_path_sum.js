/**
 * 03. Minimum Path Sum   (LeetCode 64 — Medium)
 *
 * PROBLEM
 * Given an m x n grid of non-negative numbers, find a path from top-left to bottom-right
 * (moving only right or down) that minimises the sum of the numbers along the path.
 * Return that minimum sum. Bonus: return the path itself.
 *
 * EXAMPLES
 * Input: [[1,3,1],[1,5,1],[4,2,1]]   Output: 7   Explanation: 1 -> 3 -> 1 -> 1 -> 1
 * Input: [[1,2,3],[4,5,6]]           Output: 12  Explanation: 1 -> 2 -> 3 -> 6
 * Input: [[5]]                       Output: 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= m, n <= 200, 0 <= grid[i][j] <= 200
 * - Negative numbers? (no; with negatives the recurrence still works, min just gets smaller)
 * - Do they want the sum only, or the actual path too?
 *
 * STATE
 *   dp[i][j] = minimum path sum from (0, 0) to (i, j)
 * RECURRENCE
 *   dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
 * BASE CASES
 *   dp[0][0] = grid[0][0]
 *   dp[0][j] = dp[0][j-1] + grid[0][j]   (first row: only from the left)
 *   dp[i][0] = dp[i-1][0] + grid[i][0]   (first column: only from above)
 * ANSWER
 *   dp[m-1][n-1]
 *
 * APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space
 * cost(i, j) = grid[i][j] + min(cost(i-1, j), cost(i, j-1)), Infinity when out of bounds.
 *
 * APPROACH 2 — Memoization   O(m*n) time, O(m*n) space
 * APPROACH 3 — Tabulation    O(m*n) time, O(m*n) space
 *
 * Dry run on [[1,3,1],[1,5,1],[4,2,1]]:
 * grid        dp
 * 1 3 1       1  4  5
 * 1 5 1   ->  2  7  6       dp[1][2] = 1 + min(5, 7) = 6
 * 4 2 1       6  8  7       dp[2][2] = 1 + min(6, 8) = 7  -> answer 7
 *
 * Path reconstruction: start at (2,2) value 7. Parents: above (1,2)=6, left (2,1)=8.
 * 7 - 1 = 6 matches "above", so move to (1,2). Repeat until (0,0).
 * Path = (0,0) (0,1) (0,2) (1,2) (2,2)  -> values 1,3,1,1,1 = 7.
 *
 * APPROACH 4 — One row   O(m*n) time, O(n) space
 *
 * EDGE CASES
 * - 1x1 grid -> grid[0][0]
 * - single row / single column -> sum of all cells
 */

function bruteForce(grid) {
  function cost(i, j) {
    if (i < 0 || j < 0) return Infinity;      // not a real cell
    if (i === 0 && j === 0) return grid[0][0];
    return grid[i][j] + Math.min(cost(i - 1, j), cost(i, j - 1));
  }
  return cost(grid.length - 1, grid[0].length - 1);
}

function memo(grid) {
  const rows = grid.length, cols = grid[0].length;
  const cache = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  function cost(i, j) {
    if (i < 0 || j < 0) return Infinity;
    if (i === 0 && j === 0) return grid[0][0];
    if (cache[i][j] !== -1) return cache[i][j];
    cache[i][j] = grid[i][j] + Math.min(cost(i - 1, j), cost(i, j - 1));
    return cache[i][j];
  }
  return cost(rows - 1, cols - 1);
}

function buildTable(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const fromTop = i > 0 ? dp[i - 1][j] : Infinity;
      const fromLeft = j > 0 ? dp[i][j - 1] : Infinity;
      const bestParent = (i === 0 && j === 0) ? 0 : Math.min(fromTop, fromLeft);
      dp[i][j] = grid[i][j] + bestParent;
    }
  }
  return dp;
}

function tabulation(grid) {
  const dp = buildTable(grid);
  return dp[grid.length - 1][grid[0].length - 1];
}

function optimized(grid) {
  const rows = grid.length, cols = grid[0].length;
  const row = new Array(cols).fill(Infinity);
  row[0] = 0; // so that row[0] + grid[0][0] = grid[0][0] on the first step
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // row[j] = above (previous row's value), row[j-1] = left (already updated)
      const fromLeft = j > 0 ? row[j - 1] : Infinity;
      row[j] = grid[i][j] + Math.min(row[j], fromLeft);
    }
  }
  return row[cols - 1];
}

// Walk the table backwards from the goal to recover the actual cells of the best path.
function reconstructPath(grid) {
  const dp = buildTable(grid);
  let i = grid.length - 1, j = grid[0].length - 1;
  const path = [[i, j]];
  while (i > 0 || j > 0) {
    // which parent produced dp[i][j]? The one whose value equals dp[i][j] - grid[i][j].
    const need = dp[i][j] - grid[i][j];
    if (i > 0 && dp[i - 1][j] === need) i--;
    else j--;
    path.push([i, j]);
  }
  return path.reverse();
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([[1, 3, 1], [1, 5, 1], [4, 2, 1]]), 7);
  assert.strictEqual(solve([[1, 2, 3], [4, 5, 6]]), 12);
  assert.strictEqual(solve([[5]]), 5);
  assert.strictEqual(solve([[1, 2, 3, 4]]), 10);        // single row
  assert.strictEqual(solve([[1], [2], [3]]), 6);        // single column
  assert.strictEqual(solve([[0, 0], [0, 0]]), 0);       // all zeros
  assert.strictEqual(solve([[9, 1, 1], [9, 9, 1], [9, 9, 1]]), 13); // 9 -> 1 -> 1 -> 1 -> 1
}
assert.deepStrictEqual(
  reconstructPath([[1, 3, 1], [1, 5, 1], [4, 2, 1]]),
  [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]
);
assert.deepStrictEqual(reconstructPath([[5]]), [[0, 0]]);
console.log('✓ 03-minimum-path-sum passed');

module.exports = { bruteForce, memo, tabulation, optimized, reconstructPath };
