/**
 * 06. Grid to Graph   (Original — Medium)
 *
 * PROBLEM
 *   A grid of strings uses '.' for an open cell and '#' for a wall. Turn it into
 *   an explicit undirected graph: cell (r, c) becomes vertex id = r * cols + c,
 *   and two OPEN cells that share a side (up / down / left / right) are connected.
 *   Return { n, adj, edgeCount } where n = rows * cols, adj[id] is the sorted list
 *   of neighbours (walls get an empty list) and edgeCount counts each edge once.
 *
 * EXAMPLES
 *   ["..",
 *    ".#"]  -> n = 4, adj = [[1,2],[0],[0],[]], edgeCount = 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 *   - 4-directional or 8-directional? (4)
 *   - Empty grid? (n = 0, adj = [], edgeCount = 0)
 *   - In interviews you usually DON'T build this graph: you walk the grid directly.
 *     This exercise makes the hidden graph visible.
 *
 * APPROACH 1 — Brute force   O((R*C)^2) time
 *   Compare every pair of open cells; connect them when their Manhattan distance is 1.
 *
 * APPROACH 2 — Optimal (look at 4 neighbours)   O(R*C) time and space
 *   For each open cell, check the 4 directions; if the neighbour is inside the grid
 *   and open, add it. Directions are checked in id order (up, left, right, down) so
 *   each list comes out sorted. edgeCount = (sum of list lengths) / 2.
 *   Dry run ["..", ".#"] (ids 0 1 / 2 3):
 *     id 0 (0,0): right 1 open, down 2 open -> [1,2]
 *     id 1 (0,1): left 0 open, down 3 wall  -> [0]
 *     id 2 (1,0): up 0 open, right 3 wall   -> [0]
 *     id 3 wall -> []          edgeCount = 4 / 2 = 2
 *
 * EDGE CASES
 *   all walls -> no edges; single open cell -> one vertex with no neighbours;
 *   1 x N corridor -> a path graph.
 */
const DIRS_IN_ID_ORDER = [[-1, 0], [0, -1], [0, 1], [1, 0]]; // up, left, right, down

function bruteForce(grid) {
  const rows = grid.length, cols = rows ? grid[0].length : 0, n = rows * cols;
  const adj = Array.from({ length: n }, () => []);
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
    const [ra, ca] = [Math.floor(a / cols), a % cols], [rb, cb] = [Math.floor(b / cols), b % cols];
    if (grid[ra][ca] === '.' && grid[rb][cb] === '.' && Math.abs(ra - rb) + Math.abs(ca - cb) === 1) adj[a].push(b);
  }
  return { n, adj, edgeCount: adj.reduce((s, l) => s + l.length, 0) / 2 };
}

function optimal(grid) {
  const rows = grid.length, cols = rows ? grid[0].length : 0, n = rows * cols;
  const adj = Array.from({ length: n }, () => []);
  let degreeSum = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '.') continue;
      for (const [dr, dc] of DIRS_IN_ID_ORDER) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] !== '.') continue;
        adj[r * cols + c].push(nr * cols + nc);
        degreeSum++;
      }
    }
  }
  return { n, adj, edgeCount: degreeSum / 2 };
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(optimal(['..', '.#']), { n: 4, adj: [[1, 2], [0], [0], []], edgeCount: 2 });
assert.deepStrictEqual(optimal([]), { n: 0, adj: [], edgeCount: 0 });
assert.deepStrictEqual(optimal(['##']), { n: 2, adj: [[], []], edgeCount: 0 });
assert.deepStrictEqual(optimal(['.']), { n: 1, adj: [[]], edgeCount: 0 });
assert.strictEqual(optimal(['....']).edgeCount, 3);   // corridor = path graph
assert.strictEqual(optimal(['..', '..']).edgeCount, 4); // 2x2 square = 4-cycle
let seed = 13;
const rand = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
for (let t = 0; t < 200; t++) {
  const rows = 1 + rand(5), cols = 1 + rand(5);
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rand(3) ? '.' : '#')).join(''));
  assert.deepStrictEqual(optimal(grid), bruteForce(grid));
}
console.log('✓ 06_grid_to_graph passed');
module.exports = { optimal, bruteForce };
