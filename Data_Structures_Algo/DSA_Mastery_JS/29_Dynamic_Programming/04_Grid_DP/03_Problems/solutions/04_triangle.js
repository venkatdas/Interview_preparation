/**
 * 04. Triangle   (LeetCode 120 — Medium)
 *
 * PROBLEM
 * Given a triangle array (row i has i + 1 numbers), find the minimum path sum from top to
 * bottom. From index j in one row you may move to index j or j + 1 in the next row.
 *
 * EXAMPLES
 * Input: [[2],[3,4],[6,5,7],[4,1,8,3]]   Output: 11   Explanation: 2 + 3 + 5 + 1
 * Input: [[-10]]                         Output: -10
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= rows <= 200, values can be negative (-10^4 .. 10^4)
 * - Follow-up: can you do it in O(rows) extra space? (yes, bottom-up with one array)
 *
 * STATE
 *   dp[i][j] = minimum path sum from cell (i, j) DOWN to the bottom row
 *   (we define it "from here to the end" so the answer lands at the top, dp[0][0])
 * RECURRENCE
 *   dp[i][j] = triangle[i][j] + min(dp[i+1][j], dp[i+1][j+1])
 * BASE CASES
 *   dp[last][j] = triangle[last][j]
 * ANSWER
 *   dp[0][0]
 *
 * APPROACH 1 — Brute force recursion   O(2^rows) time, O(rows) space
 * best(i, j) tries both children. The cell (i, j) is reached by many different paths
 * from above, so it is recomputed over and over.
 *
 * APPROACH 2 — Memoization   O(rows^2) time, O(rows^2) space
 * APPROACH 3 — Tabulation (bottom row first)   O(rows^2) time, O(rows^2) space
 *
 * Dry run on [[2],[3,4],[6,5,7],[4,1,8,3]]:
 *   row 3:  4  1  8  3           (base)
 *   row 2:  6+min(4,1)=7   5+min(1,8)=6   7+min(8,3)=10
 *   row 1:  3+min(7,6)=9   4+min(6,10)=10
 *   row 0:  2+min(9,10)=11                 -> answer 11
 *
 * APPROACH 4 — One array   O(rows^2) time, O(rows) space
 * Keep only the row below. Since cell j reads j and j+1 of the row below and we write
 * j, a left-to-right pass in place is safe (j+1 has not been overwritten yet).
 *
 * EDGE CASES
 * - single row -> that value
 * - negative values -> min still works, no special handling
 */

function bruteForce(triangle) {
  const last = triangle.length - 1;
  function best(i, j) {
    if (i === last) return triangle[i][j];
    return triangle[i][j] + Math.min(best(i + 1, j), best(i + 1, j + 1));
  }
  return best(0, 0);
}

function memo(triangle) {
  const last = triangle.length - 1;
  const cache = triangle.map((row) => new Array(row.length).fill(null));
  function best(i, j) {
    if (i === last) return triangle[i][j];
    if (cache[i][j] !== null) return cache[i][j];
    cache[i][j] = triangle[i][j] + Math.min(best(i + 1, j), best(i + 1, j + 1));
    return cache[i][j];
  }
  return best(0, 0);
}

function tabulation(triangle) {
  const rows = triangle.length;
  const dp = triangle.map((row) => new Array(row.length).fill(0));
  dp[rows - 1] = [...triangle[rows - 1]]; // base: bottom row
  for (let i = rows - 2; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      dp[i][j] = triangle[i][j] + Math.min(dp[i + 1][j], dp[i + 1][j + 1]);
    }
  }
  return dp[0][0];
}

function optimized(triangle) {
  const rows = triangle.length;
  const below = [...triangle[rows - 1]]; // "row below" values
  for (let i = rows - 2; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      // below[j] and below[j+1] still belong to row i+1 when we write below[j]
      below[j] = triangle[i][j] + Math.min(below[j], below[j + 1]);
    }
  }
  return below[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]), 11);
  assert.strictEqual(solve([[-10]]), -10);
  assert.strictEqual(solve([[1], [2, 3]]), 3);
  assert.strictEqual(solve([[1], [-5, 10], [100, 100, -100]]), -89); // negatives: 1 + 10 - 100
  assert.strictEqual(solve([[0], [0, 0], [0, 0, 0]]), 0);
  assert.strictEqual(solve([[5], [9, 6], [4, 6, 8], [10, 2, 3, 12]]), 19); // 5 + 6 + 6 + 2
}
console.log('✓ 04-triangle passed');

module.exports = { bruteForce, memo, tabulation, optimized };
