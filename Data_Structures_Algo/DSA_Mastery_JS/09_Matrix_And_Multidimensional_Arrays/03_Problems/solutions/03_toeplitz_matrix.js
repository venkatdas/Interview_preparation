/**
 * 03. Toeplitz Matrix   (LeetCode 766 — Easy)
 *
 * PROBLEM
 * A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same value
 * all along it. Return true if the given m x n matrix is Toeplitz.
 *
 * EXAMPLES
 * Input: [[1,2,3,4],[5,1,2,3],[9,5,1,2]]   Output: true
 * Input: [[1,2],[2,2]]                     Output: false   Explanation: diagonal 1,2 differs
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Follow-up: what if only one row fits in memory at a time? (compare row i with row i-1 shifted by one)
 * - Non-square allowed? (yes)
 *
 * APPROACH 1 — Brute force   O(m n) time, O(m + n) space
 * Group cells by their diagonal id r - c in a Map (diagonal id -> first value seen). If any
 * cell disagrees with its diagonal's value, return false.
 *
 * APPROACH 2 — Optimal (compare with the up-left neighbour)   O(m n) time, O(1) space
 * Cell (r, c) is on the same diagonal as (r-1, c-1). If every cell equals its up-left
 * neighbour, then by induction every diagonal is constant. One pass, no extra memory.
 *
 * Dry run on [[1,2],[2,2]]:
 *   (1,1)=2 vs (0,0)=1 -> differ -> false
 *
 * EDGE CASES
 * - single row or single column -> always true (every diagonal has one cell)
 * - 1x1 -> true
 */

function bruteForce(matrix) {
  const firstOnDiagonal = new Map();
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      const id = r - c;
      if (!firstOnDiagonal.has(id)) firstOnDiagonal.set(id, matrix[r][c]);
      else if (firstOnDiagonal.get(id) !== matrix[r][c]) return false;
    }
  }
  return true;
}

function optimal(matrix) {
  for (let r = 1; r < matrix.length; r++) {
    for (let c = 1; c < matrix[0].length; c++) {
      if (matrix[r][c] !== matrix[r - 1][c - 1]) return false; // same diagonal, different value
    }
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 2, 3, 4], [5, 1, 2, 3], [9, 5, 1, 2]]), true);
  assert.strictEqual(solve([[1, 2], [2, 2]]), false);
  assert.strictEqual(solve([[1, 2, 3]]), true);
  assert.strictEqual(solve([[1], [2], [3]]), true);
  assert.strictEqual(solve([[7]]), true);
  assert.strictEqual(solve([[1, 2], [3, 1], [4, 3]]), true);
  assert.strictEqual(solve([[1, 2], [3, 1], [4, 9]]), false);
}
console.log('✓ 03-toeplitz-matrix passed');

module.exports = { optimal, bruteForce };
