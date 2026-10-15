/**
 * 08. Longest Increasing Path in a Matrix   (LeetCode 329 — Hard)
 *
 * PROBLEM
 * Given an m x n matrix of integers, return the length of the longest path such that
 * every step moves to a 4-direction neighbour (up / down / left / right) with a STRICTLY
 * larger value. You may start anywhere. No diagonal moves, no wrapping.
 *
 * EXAMPLES
 * Input: [[9,9,4],[6,6,8],[2,1,1]]   Output: 4   Explanation: 1 -> 2 -> 6 -> 9
 * Input: [[3,4,5],[3,2,6],[2,2,1]]   Output: 4   Explanation: 3 -> 4 -> 5 -> 6
 * Input: [[1]]                       Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= m, n <= 200
 * - Strictly increasing? (yes -> no cycles are possible, so the grid is a DAG)
 * - Path length counts cells (a single cell is a path of length 1)
 *
 * WHY THIS IS STILL DP WITH 4 DIRECTIONS
 * Normally 4-direction moves create cycles and DP has no fill order. Here a move is only
 * allowed to a strictly larger value, so you can never come back: the cells form a DAG
 * ordered by value. Memoized DFS computes each cell once.
 *
 * STATE
 *   longest(i, j) = length of the longest increasing path STARTING at (i, j)
 * RECURRENCE
 *   longest(i, j) = 1 + max(longest(ni, nj)) over neighbours with matrix[ni][nj] > matrix[i][j]
 * BASE CASES
 *   a cell with no larger neighbour -> 1
 * ANSWER
 *   max over all cells of longest(i, j)
 *
 * APPROACH 1 — Brute force DFS from every cell   O(2^(m+n)) worst, O(m*n) stack
 * Explore every increasing path. The same cell gets re-explored from every path that
 * reaches it.
 *
 * APPROACH 2 — Memoized DFS   O(m*n) time, O(m*n) space
 * Cache longest(i, j). Each cell is expanded once; each expansion looks at 4 neighbours.
 *
 * Dry run on [[9,9,4],[6,6,8],[2,1,1]]:
 *   longest(2,1) [value 1]: neighbours 6 (up), 2 (left), 1 (right, not larger)
 *     longest(2,0) [2]: up is 6 -> longest(1,0) [6]: up is 9 -> longest(0,0) [9] = 1
 *       longest(1,0) = 1 + 1 = 2, longest(2,0) = 1 + 2 = 3
 *     longest(1,1) [6]: up 9 -> 1, right 8 -> longest(1,2) [8]: up 4 no, down 1 no -> 1
 *       longest(1,1) = 2
 *   longest(2,1) = 1 + max(3, 2) = 4  -> answer 4
 *
 * APPROACH 3 — Tabulation by sorted values   O(m*n log(m*n)) time, O(m*n) space
 * Sort all cells by value (descending). Process them in that order: when we reach a cell,
 * every strictly larger neighbour has already been finalised. This is a topological order
 * of the DAG, so a plain loop works with no recursion (safe for deep paths).
 *
 * EDGE CASES
 * - 1x1 -> 1
 * - all equal values -> 1 (no move is allowed)
 * - a snake path through the whole grid -> length m*n (deep recursion for memo DFS)
 */

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function bruteForce(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  function longest(i, j) {
    let best = 1;
    for (const [di, dj] of DIRECTIONS) {
      const ni = i + di, nj = j + dj;
      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && matrix[ni][nj] > matrix[i][j]) {
        best = Math.max(best, 1 + longest(ni, nj));
      }
    }
    return best;
  }
  let answer = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) answer = Math.max(answer, longest(i, j));
  }
  return answer;
}

function memo(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const cache = Array.from({ length: rows }, () => new Array(cols).fill(0)); // 0 = unknown
  function longest(i, j) {
    if (cache[i][j] !== 0) return cache[i][j];
    let best = 1;
    for (const [di, dj] of DIRECTIONS) {
      const ni = i + di, nj = j + dj;
      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && matrix[ni][nj] > matrix[i][j]) {
        best = Math.max(best, 1 + longest(ni, nj));
      }
    }
    cache[i][j] = best;
    return best;
  }
  let answer = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) answer = Math.max(answer, longest(i, j));
  }
  return answer;
}

function tabulation(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  // every cell, sorted so that LARGER values come first (topological order of the DAG)
  const cells = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) cells.push([i, j]);
  }
  cells.sort((a, b) => matrix[b[0]][b[1]] - matrix[a[0]][a[1]]);

  const dp = Array.from({ length: rows }, () => new Array(cols).fill(1));
  let answer = 1;
  for (const [i, j] of cells) {
    for (const [di, dj] of DIRECTIONS) {
      const ni = i + di, nj = j + dj;
      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && matrix[ni][nj] > matrix[i][j]) {
        dp[i][j] = Math.max(dp[i][j], 1 + dp[ni][nj]); // neighbour is larger -> already final
      }
    }
    answer = Math.max(answer, dp[i][j]);
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([[9, 9, 4], [6, 6, 8], [2, 1, 1]]), 4);
  assert.strictEqual(solve([[3, 4, 5], [3, 2, 6], [2, 2, 1]]), 4);
  assert.strictEqual(solve([[1]]), 1);
  assert.strictEqual(solve([[7, 7], [7, 7]]), 1);                  // all equal
  assert.strictEqual(solve([[1, 2, 3, 4, 5]]), 5);                 // single row
  assert.strictEqual(solve([[5], [4], [3]]), 3);                   // single column
  assert.strictEqual(solve([[1, 2, 3], [6, 5, 4], [7, 8, 9]]), 9); // snake through everything
}
console.log('✓ 08-longest-increasing-path-in-matrix passed');

module.exports = { bruteForce, memo, tabulation };
