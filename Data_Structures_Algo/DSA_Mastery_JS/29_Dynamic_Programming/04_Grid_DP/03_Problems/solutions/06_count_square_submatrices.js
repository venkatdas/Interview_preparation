/**
 * 06. Count Square Submatrices with All Ones   (LeetCode 1277 — Medium)
 *
 * PROBLEM
 * Given an m x n matrix of 0s and 1s, count how many square submatrices consist entirely
 * of 1s. Squares of every size count (1x1, 2x2, 3x3, ...).
 *
 * EXAMPLES
 * Input: [[0,1,1,1],[1,1,1,1],[0,1,1,1]]   Output: 15
 *   Explanation: 10 squares of side 1, 4 of side 2, 1 of side 3.
 * Input: [[1,0,1],[1,1,0],[1,1,0]]         Output: 7
 *   Explanation: 6 squares of side 1, 1 of side 2.
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= m, n <= 300
 * - Squares only, not rectangles? (yes)
 *
 * STATE
 *   dp[i][j] = side length of the largest all-ones square whose bottom-right corner is (i, j)
 *   KEY INSIGHT: that number is also HOW MANY squares end at (i, j)
 *   (side 1, side 2, ..., side dp[i][j] all fit), so the answer is the sum of the table.
 * RECURRENCE
 *   dp[i][j] = 0                                              if matrix[i][j] === 0
 *   dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])  otherwise
 *   A k-square at (i, j) needs (k-1)-squares above, to the left and diagonally; the
 *   smallest of the three is the bottleneck.
 * BASE CASES
 *   first row / first column: dp = matrix value (only a 1x1 square can end there)
 * ANSWER
 *   sum of all dp[i][j]
 *
 * APPROACH 1 — Brute force   O(m * n * min(m,n)^2) time, O(1) space
 * For every top-left corner and every side length, check that every cell is 1.
 * Implemented recursively on "largest square ending at (i, j)" to match the other versions.
 *
 * APPROACH 2 — Memoization   O(m*n) time, O(m*n) space
 * APPROACH 3 — Tabulation    O(m*n) time, O(m*n) space
 *
 * Dry run on [[0,1,1,1],[1,1,1,1],[0,1,1,1]]:
 *   matrix        dp
 *   0 1 1 1       0 1 1 1
 *   1 1 1 1  ->   1 1 2 2     dp[1][2] = 1 + min(1, 1, 1) = 2
 *   0 1 1 1       0 1 2 3     dp[2][3] = 1 + min(2, 2, 2) = 3
 *   sum = (0+1+1+1) + (1+1+2+2) + (0+1+2+3) = 3 + 6 + 6 = 15
 *
 * APPROACH 4 — One row   O(m*n) time, O(n) space
 * dp[i][j] needs dp[i-1][j-1] (up-left), which the in-place row has already overwritten.
 * Keep the overwritten value in a variable `prevDiagonal` before writing.
 *
 * EDGE CASES
 * - all zeros -> 0
 * - all ones n x n -> sum of k^2 for k = 1..n (e.g. 2x2 -> 5, 3x3 -> 14)
 * - single row / column -> number of ones
 */

function bruteForce(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  // largest square ending at (i, j), recomputed every time (no cache)
  function largest(i, j) {
    if (i < 0 || j < 0 || matrix[i][j] === 0) return 0;
    return 1 + Math.min(largest(i - 1, j), largest(i, j - 1), largest(i - 1, j - 1));
  }
  let count = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) count += largest(i, j);
  }
  return count;
}

function memo(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const cache = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  function largest(i, j) {
    if (i < 0 || j < 0 || matrix[i][j] === 0) return 0;
    if (cache[i][j] !== -1) return cache[i][j];
    cache[i][j] = 1 + Math.min(largest(i - 1, j), largest(i, j - 1), largest(i - 1, j - 1));
    return cache[i][j];
  }
  let count = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) count += largest(i, j);
  }
  return count;
}

function tabulation(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  let count = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === 0) continue;
      if (i === 0 || j === 0) dp[i][j] = 1;
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      count += dp[i][j];
    }
  }
  return count;
}

function optimized(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const row = new Array(cols).fill(0); // row i-1 at the start of iteration i
  let count = 0;
  for (let i = 0; i < rows; i++) {
    let prevDiagonal = 0; // dp[i-1][j-1] before it got overwritten
    for (let j = 0; j < cols; j++) {
      const above = row[j]; // still dp[i-1][j]
      if (matrix[i][j] === 0) {
        row[j] = 0;
      } else if (i === 0 || j === 0) {
        row[j] = 1;
      } else {
        row[j] = 1 + Math.min(above, row[j - 1], prevDiagonal);
      }
      prevDiagonal = above; // for the next column, "up-left" is this column's old "above"
      count += row[j];
    }
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([[0, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]]), 15);
  assert.strictEqual(solve([[1, 0, 1], [1, 1, 0], [1, 1, 0]]), 7);
  assert.strictEqual(solve([[0]]), 0);
  assert.strictEqual(solve([[1]]), 1);
  assert.strictEqual(solve([[1, 1], [1, 1]]), 5);
  assert.strictEqual(solve([[1, 1, 1], [1, 1, 1], [1, 1, 1]]), 14);
  assert.strictEqual(solve([[1, 0, 1, 1]]), 3);        // single row
  assert.strictEqual(solve([[0, 0], [0, 0]]), 0);      // all zeros
}
console.log('✓ 06-count-square-submatrices passed');

module.exports = { bruteForce, memo, tabulation, optimized };
