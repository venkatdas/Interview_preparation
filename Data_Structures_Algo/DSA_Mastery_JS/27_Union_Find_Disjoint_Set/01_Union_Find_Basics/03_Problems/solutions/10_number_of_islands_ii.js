/**
 * 10. Number of Islands II   (LeetCode 305 — Hard)
 *
 * PROBLEM
 * Start with an m x n grid of all water. positions[i] = [r, c] turns that cell into land,
 * one at a time. After EACH addition, report the number of islands. Return the list of
 * counts.
 *
 * EXAMPLES
 * Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]   Output: [1,1,2,3]
 * Explanation:
 *   add (0,0): 1 island
 *   add (0,1): joins (0,0) -> 1
 *   add (1,2): separate -> 2
 *   add (2,1): separate -> 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the same position appear twice? (yes - the count must NOT change)
 * - Up to 10^4 positions on a 10^4 x 10^4 grid -> we cannot afford a traversal per step
 *
 * APPROACH 1 — Brute force (re-run DFS island count after every addition)
 *   O(k * m * n) time
 * Keep the grid, after each new land cell run Number of Islands from scratch.
 * Way too slow for big inputs, but a perfect correctness oracle for tests.
 *
 * APPROACH 2 — Optimal (Union-Find, incremental)   O(k * alpha) time, O(m*n) space
 * This is the "dynamic connectivity" case where DFS loses and union-find wins.
 *   1. UnionFind over m*n cell ids (id = r * n + c); islands = 0; land = Set.
 *   2. For each position:
 *      - if already land: push current islands, continue
 *      - mark land, islands++
 *      - for each of the 4 neighbours that is land: if union succeeds, islands--
 *      - push islands
 *
 * Dry run m=3,n=3 positions [[0,0],[0,1],[1,2],[2,1]]:
 *   (0,0): islands 1, no land neighbours             -> [1]
 *   (0,1): islands 2, neighbour (0,0) union ok -> 1  -> [1,1]
 *   (1,2): islands 2, no land neighbours             -> [1,1,2]
 *   (2,1): islands 3, (1,1)? water (2,0)? water      -> [1,1,2,3]
 *
 * EDGE CASES
 * - duplicate position -> same count as before
 * - adding a cell that joins 3 or 4 islands at once -> islands decreases by up to 3
 * - 1 x 1 grid
 */

const { UnionFind } = require('../../02_Implementations/union_find');
const { DIRS } = require('../../../../23_Graphs/02_Implementations/graph');

function bruteForce(m, n, positions) {
  const grid = Array.from({ length: m }, () => new Array(n).fill(0));
  const counts = [];
  function countIslands() {
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));
    let count = 0;
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] !== 1 || visited[r][c]) continue;
        count++;
        const stack = [[r, c]];
        visited[r][c] = true;
        while (stack.length) {
          const [row, col] = stack.pop();
          for (const [dr, dc] of DIRS) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
            if (grid[nr][nc] !== 1 || visited[nr][nc]) continue;
            visited[nr][nc] = true;
            stack.push([nr, nc]);
          }
        }
      }
    }
    return count;
  }
  for (const [r, c] of positions) {
    grid[r][c] = 1;
    counts.push(countIslands());
  }
  return counts;
}

function optimal(m, n, positions) {
  const uf = new UnionFind(m * n);
  const isLand = new Array(m * n).fill(false);
  const id = (r, c) => r * n + c;
  let islands = 0;
  const result = [];

  for (const [row, col] of positions) {
    const cell = id(row, col);
    if (isLand[cell]) {                         // duplicate: nothing changes
      result.push(islands);
      continue;
    }
    isLand[cell] = true;
    islands++;                                  // assume a brand-new island...
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= m || c >= n) continue;
      const neighbor = id(r, c);
      if (isLand[neighbor] && uf.union(cell, neighbor)) {
        islands--;                              // ...and subtract one per island it joined
      }
    }
    result.push(islands);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(3, 3, [[0, 0], [0, 1], [1, 2], [2, 1]]), [1, 1, 2, 3]);
  assert.deepStrictEqual(solve(1, 1, [[0, 0]]), [1]);
  assert.deepStrictEqual(solve(1, 1, [[0, 0], [0, 0]]), [1, 1]);
  assert.deepStrictEqual(solve(3, 3, [[0, 1], [1, 0], [1, 2], [2, 1], [1, 1]]), [1, 2, 3, 4, 1]); // joins 4
  assert.deepStrictEqual(solve(2, 2, [[0, 0], [1, 1], [0, 1]]), [1, 2, 1]);
  assert.deepStrictEqual(solve(2, 3, []), []);
}
console.log('✓ 10-number-of-islands-ii passed');

module.exports = { optimal, bruteForce };
