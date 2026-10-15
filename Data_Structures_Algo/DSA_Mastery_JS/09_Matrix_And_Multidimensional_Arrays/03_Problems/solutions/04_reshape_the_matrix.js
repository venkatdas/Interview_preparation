/**
 * 04. Reshape the Matrix   (LeetCode 566 — Easy)
 *
 * PROBLEM
 * Reshape an m x n matrix into an r x c matrix keeping the row-major order of elements.
 * If r * c !== m * n, return the original matrix unchanged.
 *
 * EXAMPLES
 * Input: mat = [[1,2],[3,4]], r = 1, c = 4   Output: [[1,2,3,4]]
 * Input: mat = [[1,2],[3,4]], r = 2, c = 4   Output: [[1,2],[3,4]]   Explanation: 8 != 4 cells
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Return the same reference or a copy when impossible? (same reference is accepted)
 *
 * APPROACH 1 — Brute force (flatten then chunk)   O(m n) time, O(m n) space
 * Flatten into a 1D array, then slice it into rows of length c. Easy to read.
 *
 * APPROACH 2 — Optimal (1D index <-> 2D index arithmetic)   O(m n) time, O(r c) output
 * Walk a single counter k from 0 to m*n - 1. The source cell is
 *   (Math.floor(k / n), k % n)      and the target cell is   (Math.floor(k / c), k % c).
 * No intermediate array. This "flatten index" trick also powers binary search on a sorted
 * matrix and many grid DP problems.
 *
 * Dry run on [[1,2],[3,4]], r=1, c=4 (n=2):
 *   k=0: src (0,0)=1 -> dst (0,0)
 *   k=1: src (0,1)=2 -> dst (0,1)
 *   k=2: src (1,0)=3 -> dst (0,2)
 *   k=3: src (1,1)=4 -> dst (0,3)   -> [[1,2,3,4]]
 *
 * EDGE CASES
 * - same shape requested -> a copy with same contents
 * - 1 x n -> n x 1
 * - size mismatch -> original
 */

function bruteForce(mat, r, c) {
  const flat = mat.flat();
  if (flat.length !== r * c) return mat;
  const result = [];
  for (let i = 0; i < flat.length; i += c) result.push(flat.slice(i, i + c));
  return result;
}

function optimal(mat, r, c) {
  const m = mat.length;
  const n = mat[0].length;
  if (m * n !== r * c) return mat;

  const result = Array.from({ length: r }, () => new Array(c));
  for (let k = 0; k < m * n; k++) {
    result[Math.floor(k / c)][k % c] = mat[Math.floor(k / n)][k % n];
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 2], [3, 4]], 1, 4), [[1, 2, 3, 4]]);
  assert.deepStrictEqual(solve([[1, 2], [3, 4]], 2, 4), [[1, 2], [3, 4]]);
  assert.deepStrictEqual(solve([[1, 2], [3, 4]], 4, 1), [[1], [2], [3], [4]]);
  assert.deepStrictEqual(solve([[1, 2, 3, 4, 5, 6]], 2, 3), [[1, 2, 3], [4, 5, 6]]);
  assert.deepStrictEqual(solve([[7]], 1, 1), [[7]]);
  assert.deepStrictEqual(solve([[1, 2], [3, 4]], 2, 2), [[1, 2], [3, 4]]);
}
console.log('✓ 04-reshape-the-matrix passed');

module.exports = { optimal, bruteForce };
