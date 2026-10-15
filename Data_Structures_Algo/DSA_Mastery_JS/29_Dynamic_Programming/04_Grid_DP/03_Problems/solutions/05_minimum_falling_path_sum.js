/**
 * 05. Minimum Falling Path Sum   (LeetCode 931 — Medium)
 *
 * PROBLEM
 * Given an n x n matrix, a "falling path" starts at any cell in the first row and moves
 * down one row at a time to the same column, the column to the left, or the column to the
 * right. Return the minimum sum of any falling path.
 *
 * EXAMPLES
 * Input: [[2,1,3],[6,5,4],[7,8,9]]   Output: 13   Explanation: 1 -> 5 -> 7 or 1 -> 4 -> 8
 * Input: [[-19,57],[-40,-5]]         Output: -59  Explanation: -19 -> -40
 * Input: [[7]]                       Output: 7
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 100, values in -100 .. 100
 * - May we start in any column? (yes) End in any column? (yes)
 *
 * STATE
 *   dp[i][j] = minimum falling path sum that ENDS at cell (i, j)
 * RECURRENCE
 *   dp[i][j] = matrix[i][j] + min(dp[i-1][j-1], dp[i-1][j], dp[i-1][j+1])
 *   (out-of-range columns count as Infinity)
 * BASE CASES
 *   dp[0][j] = matrix[0][j]
 * ANSWER
 *   min over j of dp[n-1][j]   (the path may end anywhere)
 *
 * APPROACH 1 — Brute force recursion   O(3^n * n) time, O(n) space
 * For every starting column, try all three moves at every row.
 *
 * APPROACH 2 — Memoization   O(n^2) time, O(n^2) space
 * APPROACH 3 — Tabulation    O(n^2) time, O(n^2) space
 *
 * Dry run on [[2,1,3],[6,5,4],[7,8,9]]:
 *   row 0:  2  1  3
 *   row 1:  6+min(2,1)=7   5+min(2,1,3)=6   4+min(1,3)=5
 *   row 2:  7+min(7,6)=13  8+min(7,6,5)=13  9+min(6,5)=14
 *   answer = min(13, 13, 14) = 13
 *
 * APPROACH 4 — Two rows   O(n^2) time, O(n) space
 * Each row only needs the previous row. Because cell j reads j-1, j AND j+1 of the row
 * above, we cannot overwrite in place; keep `prev` and build `curr`.
 *
 * EDGE CASES
 * - 1x1 matrix -> that value
 * - negative values -> fine, min handles them
 * - n = 2: only two columns, the "middle" option and one side exist
 */

function bruteForce(matrix) {
  const n = matrix.length;
  function fall(i, j) {
    if (j < 0 || j >= n) return Infinity;
    if (i === n - 1) return matrix[i][j];
    return matrix[i][j] + Math.min(fall(i + 1, j - 1), fall(i + 1, j), fall(i + 1, j + 1));
  }
  let best = Infinity;
  for (let start = 0; start < n; start++) best = Math.min(best, fall(0, start));
  return best;
}

function memo(matrix) {
  const n = matrix.length;
  const cache = Array.from({ length: n }, () => new Array(n).fill(null));
  function fall(i, j) {
    if (j < 0 || j >= n) return Infinity;
    if (i === n - 1) return matrix[i][j];
    if (cache[i][j] !== null) return cache[i][j];
    cache[i][j] = matrix[i][j] + Math.min(fall(i + 1, j - 1), fall(i + 1, j), fall(i + 1, j + 1));
    return cache[i][j];
  }
  let best = Infinity;
  for (let start = 0; start < n; start++) best = Math.min(best, fall(0, start));
  return best;
}

function tabulation(matrix) {
  const n = matrix.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  dp[0] = [...matrix[0]];
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const upLeft = j > 0 ? dp[i - 1][j - 1] : Infinity;
      const up = dp[i - 1][j];
      const upRight = j < n - 1 ? dp[i - 1][j + 1] : Infinity;
      dp[i][j] = matrix[i][j] + Math.min(upLeft, up, upRight);
    }
  }
  return Math.min(...dp[n - 1]);
}

function optimized(matrix) {
  const n = matrix.length;
  let prev = [...matrix[0]];
  for (let i = 1; i < n; i++) {
    const curr = new Array(n);
    for (let j = 0; j < n; j++) {
      const upLeft = j > 0 ? prev[j - 1] : Infinity;
      const upRight = j < n - 1 ? prev[j + 1] : Infinity;
      curr[j] = matrix[i][j] + Math.min(upLeft, prev[j], upRight);
    }
    prev = curr; // the new row becomes "the row above" for the next iteration
  }
  return Math.min(...prev);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([[2, 1, 3], [6, 5, 4], [7, 8, 9]]), 13);
  assert.strictEqual(solve([[-19, 57], [-40, -5]]), -59);
  assert.strictEqual(solve([[7]]), 7);
  assert.strictEqual(solve([[1, 2], [3, 4]]), 4);                 // 1 -> 3
  assert.strictEqual(solve([[0, 0, 0], [0, 0, 0], [0, 0, 0]]), 0);
  assert.strictEqual(solve([[100, 1, 100], [1, 100, 100], [100, 100, 1]]), 102); // 1 -> 1 -> 100 or 1 -> 100 -> 1
}
console.log('✓ 05-minimum-falling-path-sum passed');

module.exports = { bruteForce, memo, tabulation, optimized };
