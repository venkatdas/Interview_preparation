/**
 * 07. Longest Increasing Path in a Matrix   (LeetCode 329 — Hard)
 *
 * PROBLEM
 * Given an m x n integer matrix, return the length of the longest path where each step
 * moves to a 4-neighbour with a STRICTLY larger value.
 *
 * EXAMPLES
 * Input: [[9,9,4],[6,6,8],[2,1,1]]   Output: 4   (1 -> 2 -> 6 -> 9)
 * Input: [[3,4,5],[3,2,6],[2,2,1]]   Output: 4   (3 -> 4 -> 5 -> 6)
 * Input: [[1]]                       Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strictly increasing? (yes - so there can be no cycles: the graph "smaller -> larger"
 *   is automatically a DAG, which is why memoisation works without a visited set)
 * - Diagonals? (no)
 *
 * APPROACH 1 — Brute force (plain DFS from every cell, no memo)   exponential
 * From every cell, DFS to every larger neighbour, return 1 + max. Each cell is recomputed
 * many times - O(2^(m+n)) in the worst case.
 *
 * APPROACH 2 — Optimal (DFS + memo = DP in topological order)   O(m*n) time, O(m*n)
 * longest(r, c) = 1 + max(longest(neighbour)) over strictly larger neighbours.
 * Because edges only go to larger values, the graph is a DAG, and memoised DFS computes
 * every cell exactly once, AFTER its successors - that is a topological order computed
 * implicitly. (The explicit alternative: Kahn's on the "smaller -> larger" edges, counting
 * levels - also O(m*n).)
 *
 * Dry run on [[9,9,4],[6,6,8],[2,1,1]]:
 *   longest(2,1) [value 1]: neighbours (2,0)=2 -> longest(2,0)
 *     longest(2,0) [2]: neighbours (1,0)=6 -> longest(1,0)
 *       longest(1,0) [6]: neighbours (0,0)=9 -> 1 (no larger neighbours) ... = 2
 *     = 3
 *   = 4. memo stores every result; later cells reuse them. Answer 4.
 *
 * EDGE CASES
 * - 1 x 1 -> 1
 * - all equal values -> 1 (no strictly larger neighbour)
 * - a snake path through the whole matrix -> m*n
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  function longest(row, col) {
    let best = 1;
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      if (matrix[r][c] > matrix[row][col]) best = Math.max(best, 1 + longest(r, c));
    }
    return best;
  }
  let answer = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) answer = Math.max(answer, longest(r, c));
  }
  return answer;
}

function optimal(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const memo = Array.from({ length: rows }, () => new Array(cols).fill(0)); // 0 = unknown

  function longest(row, col) {
    if (memo[row][col]) return memo[row][col];
    let best = 1;                                   // the cell itself
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      if (matrix[r][c] > matrix[row][col]) {        // edge to a strictly larger cell
        best = Math.max(best, 1 + longest(r, c));
      }
    }
    memo[row][col] = best;                          // computed once, after successors
    return best;
  }

  let answer = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) answer = Math.max(answer, longest(r, c));
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[9, 9, 4], [6, 6, 8], [2, 1, 1]]), 4);
  assert.strictEqual(solve([[3, 4, 5], [3, 2, 6], [2, 2, 1]]), 4);
  assert.strictEqual(solve([[1]]), 1);
  assert.strictEqual(solve([[7, 7], [7, 7]]), 1);
  assert.strictEqual(solve([[1, 2, 3, 4]]), 4);
  assert.strictEqual(solve([[1, 2], [4, 3]]), 4);      // 1 -> 2 -> 3 -> 4 snake
}
console.log('✓ 07-longest-increasing-path-in-matrix passed');

module.exports = { optimal, bruteForce };
