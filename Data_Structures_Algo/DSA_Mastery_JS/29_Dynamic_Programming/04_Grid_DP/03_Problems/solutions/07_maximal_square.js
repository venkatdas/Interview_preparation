/**
 * 07. Maximal Square   (LeetCode 221 — Medium)
 *
 * PROBLEM
 * Given an m x n binary matrix (characters '0' / '1'), find the largest square containing
 * only '1's and return its AREA.
 *
 * EXAMPLES
 * Input: [["1","0","1","0","0"],
 *         ["1","0","1","1","1"],
 *         ["1","1","1","1","1"],
 *         ["1","0","0","1","0"]]        Output: 4   Explanation: a 2x2 square of ones
 * Input: [["0","1"],["1","0"]]         Output: 1
 * Input: [["0"]]                       Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= m, n <= 300; cells are the characters '0' and '1' (not numbers)
 * - Return area (side * side), not the side length
 *
 * STATE
 *   dp[i][j] = side of the largest all-ones square whose bottom-right corner is (i, j)
 * RECURRENCE
 *   dp[i][j] = 0                                             if cell is '0'
 *   dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) otherwise
 * BASE CASES
 *   first row / column: 1 if the cell is '1' else 0
 * ANSWER
 *   (max over all dp[i][j])^2
 *
 * APPROACH 1 — Brute force   O((m*n) * min(m,n)^2) time
 * For every cell as a top-left corner, grow the side while the new row and column are
 * all ones. Shown here as uncached recursion on "largest square ending at (i, j)".
 *
 * APPROACH 2 — Memoization   O(m*n) time, O(m*n) space
 * APPROACH 3 — Tabulation    O(m*n) time, O(m*n) space
 *
 * Dry run on the 4x5 example:
 *   1 0 1 0 0        1 0 1 0 0
 *   1 0 1 1 1   ->   1 0 1 1 1
 *   1 1 1 1 1        1 1 1 2 2       dp[2][3] = 1 + min(1, 1, 1) = 2
 *   1 0 0 1 0        1 0 0 1 0
 *   max side = 2 -> area 4
 *
 * APPROACH 4 — One row + prevDiagonal   O(m*n) time, O(n) space
 *
 * EDGE CASES
 * - all '0' -> 0
 * - all '1' -> min(m, n)^2
 * - single row / column -> 1 if any '1' else 0
 */

function bruteForce(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  function largest(i, j) {
    if (i < 0 || j < 0 || matrix[i][j] === '0') return 0;
    return 1 + Math.min(largest(i - 1, j), largest(i, j - 1), largest(i - 1, j - 1));
  }
  let bestSide = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) bestSide = Math.max(bestSide, largest(i, j));
  }
  return bestSide * bestSide;
}

function memo(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const cache = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  function largest(i, j) {
    if (i < 0 || j < 0 || matrix[i][j] === '0') return 0;
    if (cache[i][j] !== -1) return cache[i][j];
    cache[i][j] = 1 + Math.min(largest(i - 1, j), largest(i, j - 1), largest(i - 1, j - 1));
    return cache[i][j];
  }
  let bestSide = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) bestSide = Math.max(bestSide, largest(i, j));
  }
  return bestSide * bestSide;
}

function tabulation(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  let bestSide = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === '0') continue;
      if (i === 0 || j === 0) dp[i][j] = 1;
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      bestSide = Math.max(bestSide, dp[i][j]);
    }
  }
  return bestSide * bestSide;
}

function optimized(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const row = new Array(cols).fill(0);
  let bestSide = 0;
  for (let i = 0; i < rows; i++) {
    let prevDiagonal = 0;
    for (let j = 0; j < cols; j++) {
      const above = row[j];
      if (matrix[i][j] === '0') row[j] = 0;
      else if (i === 0 || j === 0) row[j] = 1;
      else row[j] = 1 + Math.min(above, row[j - 1], prevDiagonal);
      prevDiagonal = above;
      bestSide = Math.max(bestSide, row[j]);
    }
  }
  return bestSide * bestSide;
}

// ---------- tests ----------
const assert = require('assert');
const big = [
  ['1', '0', '1', '0', '0'],
  ['1', '0', '1', '1', '1'],
  ['1', '1', '1', '1', '1'],
  ['1', '0', '0', '1', '0'],
];
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(big), 4);
  assert.strictEqual(solve([['0', '1'], ['1', '0']]), 1);
  assert.strictEqual(solve([['0']]), 0);
  assert.strictEqual(solve([['1']]), 1);
  assert.strictEqual(solve([['1', '1', '1'], ['1', '1', '1'], ['1', '1', '1']]), 9);
  assert.strictEqual(solve([['0', '0'], ['0', '0']]), 0);
  assert.strictEqual(solve([['1', '1', '0', '1']]), 1);          // single row
  assert.strictEqual(solve([['1', '1'], ['1', '1'], ['0', '1']]), 4);
}
console.log('✓ 07-maximal-square passed');

module.exports = { bruteForce, memo, tabulation, optimized };
