/**
 * 02. Island Perimeter   (LeetCode 463 — Easy)
 *
 * PROBLEM
 * A grid of 0 (water) and 1 (land) contains exactly one island (one connected group of
 * land cells, no lakes). Each cell is a 1 x 1 square. Return the perimeter of the island.
 *
 * EXAMPLES
 * Input: [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]   Output: 16
 * Input: [[1]]                                         Output: 4
 * Input: [[1,0]]                                       Output: 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly one island, no lakes? (yes per problem - but the counting approach works
 *   even with several islands)
 * - Can the grid be empty? (assume at least 1 x 1)
 *
 * APPROACH 1 — Brute force (DFS and count exposed sides)   O(m*n) time, O(m*n) space
 * Find a land cell, DFS the island. For each land cell, each of its 4 sides contributes 1
 * to the perimeter if the side faces water or the edge of the grid. The DFS is not really
 * needed since there is only one island, but it is the "graph" way and it generalises to
 * "perimeter of the island containing (r, c)".
 *
 * APPROACH 2 — Optimal (count cells and shared edges)   O(m*n) time, O(1) space
 * Every land cell starts with 4 sides. Every pair of adjacent land cells hides 2 sides
 * (one on each cell). So:
 *   perimeter = 4 * land - 2 * sharedEdges
 * To count each shared edge once, only look DOWN and RIGHT from each land cell.
 *
 * Dry run on [[1,1],[1,0]]:
 *   (0,0) land=1, right (0,1) land -> shared=1, down (1,0) land -> shared=2
 *   (0,1) land=2, down (1,1) water
 *   (1,0) land=3, right (1,1) water
 *   perimeter = 4*3 - 2*2 = 8   (draw it: an L shape of 3 squares has 8 unit sides)
 *
 * EDGE CASES
 * - single cell -> 4
 * - a full row of k cells -> 2k + 2
 * - all water -> 0
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  function dfs(row, col) {
    visited[row][col] = true;
    let sides = 0;
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      const isWaterOrEdge = r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === 0;
      if (isWaterOrEdge) sides++;                     // this side is exposed
      else if (!visited[r][c]) sides += dfs(r, c);    // neighbour land, keep exploring
    }
    return sides;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) return dfs(r, c);         // exactly one island
    }
  }
  return 0;
}

function optimal(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let land = 0;
  let shared = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1) continue;
      land++;
      if (r + 1 < rows && grid[r + 1][c] === 1) shared++; // edge with the cell below
      if (c + 1 < cols && grid[r][c + 1] === 1) shared++; // edge with the cell to the right
    }
  }
  return 4 * land - 2 * shared;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]]), 16);
  assert.strictEqual(solve([[1]]), 4);
  assert.strictEqual(solve([[1, 0]]), 4);
  assert.strictEqual(solve([[1, 1, 1, 1]]), 10);
  assert.strictEqual(solve([[1, 1], [1, 0]]), 8);
  assert.strictEqual(solve([[0, 0], [0, 0]]), 0);
}
console.log('✓ 02-island-perimeter passed');

module.exports = { optimal, bruteForce };
