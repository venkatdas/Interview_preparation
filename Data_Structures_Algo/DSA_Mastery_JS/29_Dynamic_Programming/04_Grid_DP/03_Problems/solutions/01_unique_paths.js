/**
 * 01. Unique Paths   (LeetCode 62 — Medium)
 *
 * PROBLEM
 * A robot stands at the top-left corner of an m x n grid and wants to reach the
 * bottom-right corner. It can only move RIGHT or DOWN. How many distinct paths exist?
 *
 * EXAMPLES
 * Input: m = 3, n = 7   Output: 28
 * Input: m = 3, n = 2   Output: 3    Explanation: RDD, DRD, DDR
 * Input: m = 1, n = 1   Output: 1    Explanation: already there
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= m, n <= 100 (answer fits in a JS number, <= 2 * 10^9)
 * - Only right / down moves? (yes)
 * - Any blocked cells? (no, see 02-unique-paths-ii for that)
 *
 * STATE
 *   dp[i][j] = number of distinct paths from (0, 0) to cell (i, j)
 * RECURRENCE
 *   dp[i][j] = dp[i-1][j] + dp[i][j-1]   (you arrive from above or from the left)
 * BASE CASES
 *   dp[0][j] = 1 for all j, dp[i][0] = 1 for all i   (only one straight line)
 * ANSWER
 *   dp[m-1][n-1]
 *
 * APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space
 * paths(i, j) = paths(i-1, j) + paths(i, j-1). The same cell is recomputed many times
 * (paths(1,1) is reached from (1,2), (2,1), ... all over again).
 *
 * APPROACH 2 — Memoization   O(m*n) time, O(m*n) space
 * Same recursion, but store each (i, j) result in a table so it is computed once.
 *
 * APPROACH 3 — Tabulation   O(m*n) time, O(m*n) space
 * Fill the table top to bottom, left to right, so parents are always ready.
 *
 * Dry run m = 3, n = 3:
 *      j=0  j=1  j=2
 * i=0 [ 1    1    1 ]
 * i=1 [ 1    2    3 ]      dp[1][1] = 1 + 1 = 2, dp[1][2] = 1 + 2 = 3
 * i=2 [ 1    3    6 ]      dp[2][2] = 3 + 3 = 6  -> answer 6
 *
 * APPROACH 4 — One row   O(m*n) time, O(n) space
 * row[j] += row[j-1]: row[j] still holds "above", row[j-1] already holds "left".
 *
 * EDGE CASES
 * - m = 1 or n = 1 -> exactly 1 path
 * - m = n = 1      -> 1
 */

function bruteForce(m, n) {
  function paths(i, j) {
    if (i === 0 || j === 0) return 1; // first row / column: one straight path
    return paths(i - 1, j) + paths(i, j - 1);
  }
  return paths(m - 1, n - 1);
}

function memo(m, n) {
  const cache = Array.from({ length: m }, () => new Array(n).fill(-1));
  function paths(i, j) {
    if (i === 0 || j === 0) return 1;
    if (cache[i][j] !== -1) return cache[i][j];
    cache[i][j] = paths(i - 1, j) + paths(i, j - 1);
    return cache[i][j];
  }
  return paths(m - 1, n - 1);
}

function tabulation(m, n) {
  // fill everything with 1: this already covers the first row and first column
  const dp = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}

function optimized(m, n) {
  const row = new Array(n).fill(1); // row 0
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      // row[j] = value from the row above, row[j-1] = value just computed to the left
      row[j] += row[j - 1];
    }
  }
  return row[n - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(3, 7), 28);
  assert.strictEqual(solve(3, 2), 3);
  assert.strictEqual(solve(1, 1), 1);
  assert.strictEqual(solve(1, 5), 1);
  assert.strictEqual(solve(5, 1), 1);
  assert.strictEqual(solve(3, 3), 6);
  assert.strictEqual(solve(4, 4), 20);
}
// the fast versions can handle the largest input
assert.strictEqual(tabulation(10, 10), 48620);
assert.strictEqual(optimized(10, 10), 48620);
console.log('✓ 01-unique-paths passed');

module.exports = { bruteForce, memo, tabulation, optimized };
