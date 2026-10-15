/**
 * 12. 01 Matrix   (LeetCode 542 — Medium)
 *
 * PROBLEM
 * Given a binary matrix, return a matrix of the same size where each cell holds the
 * distance to the NEAREST 0 (4-directional moves). There is at least one 0.
 *
 * EXAMPLES
 * Input: [[0,0,0],[0,1,0],[0,0,0]]   Output: [[0,0,0],[0,1,0],[0,0,0]]
 * Input: [[0,0,0],[0,1,0],[1,1,1]]   Output: [[0,0,0],[0,1,0],[1,2,1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - At least one 0 guaranteed? (yes)
 * - Return a new matrix or modify in place? (either - we return a new one)
 *
 * APPROACH 1 — Brute force (BFS from every 1)   O((m*n)^2) time
 * For each 1 run a BFS until the first 0. Same shape as Walls and Gates brute force.
 *
 * APPROACH 2 — Optimal (multi-source BFS from all 0s)   O(m*n) time, O(m*n) space
 * All 0 cells are sources at distance 0. BFS outward; a 1 cell gets its distance the
 * first time it is reached. Identical to Walls and Gates with gates = 0s and no walls.
 *
 * Dry run on [[0,0,0],[0,1,0],[1,1,1]]:
 *   queue = all 0 cells. Level 1 reaches (1,1),(2,0),(2,2) -> 1. Level 2 reaches (2,1) -> 2.
 *
 * (A two-pass DP also works: top-left pass then bottom-right pass, O(1) extra space.
 *  BFS is the graph way and generalises.)
 *
 * EDGE CASES
 * - all zeros -> all zeros
 * - 1 x 1 containing 0
 * - a 1 far from every 0 (long corridor) -> distance grows linearly
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(mat) {
  const rows = mat.length;
  const cols = mat[0].length;
  const result = mat.map((row) => [...row]);

  function nearestZero(sr, sc) {
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const queue = [[sr, sc, 0]];
    visited[sr][sc] = true;
    let head = 0;
    while (head < queue.length) {
      const [row, col, dist] = queue[head++];
      if (mat[row][col] === 0) return dist;
      for (const [dr, dc] of DIRS) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || c < 0 || r >= rows || c >= cols || visited[r][c]) continue;
        visited[r][c] = true;
        queue.push([r, c, dist + 1]);
      }
    }
    return -1; // unreachable per constraints
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 1) result[r][c] = nearestZero(r, c);
    }
  }
  return result;
}

function optimal(mat) {
  const rows = mat.length;
  const cols = mat[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1)); // -1 = unseen
  const queue = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) {
        dist[r][c] = 0;
        queue.push([r, c]);
      }
    }
  }
  let head = 0;
  while (head < queue.length) {
    const [row, col] = queue[head++];
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols || dist[r][c] !== -1) continue;
      dist[r][c] = dist[row][col] + 1;
      queue.push([r, c]);
    }
  }
  return dist;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[0, 0, 0], [0, 1, 0], [0, 0, 0]]), [[0, 0, 0], [0, 1, 0], [0, 0, 0]]);
  assert.deepStrictEqual(solve([[0, 0, 0], [0, 1, 0], [1, 1, 1]]), [[0, 0, 0], [0, 1, 0], [1, 2, 1]]);
  assert.deepStrictEqual(solve([[0]]), [[0]]);
  assert.deepStrictEqual(solve([[0, 1, 1, 1]]), [[0, 1, 2, 3]]);
  assert.deepStrictEqual(solve([[1], [1], [0]]), [[2], [1], [0]]);
  assert.deepStrictEqual(solve([[1, 0, 1], [1, 1, 1], [1, 0, 1]]), [[1, 0, 1], [2, 1, 2], [1, 0, 1]]);
}
console.log('✓ 12-01-matrix passed');

module.exports = { optimal, bruteForce };
