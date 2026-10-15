/**
 * 09. Shortest Path in a Grid with Obstacles Elimination   (LeetCode 1293 — Hard)
 *
 * PROBLEM
 * Grid of 0 (empty) and 1 (obstacle). You may remove at most k obstacles. Return the
 * minimum number of steps from (0,0) to (m-1,n-1), or -1 if impossible.
 *
 * EXAMPLES
 * Input: grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1   Output: 6
 * Explanation: go down through (3,2) by eliminating one obstacle: 6 steps instead of 10.
 * Input: grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1   Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - k can be larger than the number of obstacles? (yes; if k >= m + n - 2 the straight
 *   Manhattan route is always possible -> answer m + n - 2)
 * - Start / end cells can be obstacles? (LeetCode: no)
 *
 * The STATE is not just the cell. Two visits to the same cell with different numbers of
 * eliminations left are different situations. Node = (row, col, eliminationsLeft).
 *
 * APPROACH 1 — Brute force (DFS with backtracking over all routes)   exponential
 * Try every path, decrementing k on obstacles, track the shortest. Only for tiny grids.
 *
 * APPROACH 2 — Optimal (BFS over (r, c, k) states)   O(m*n*k) time and space
 * All steps cost 1 -> BFS. Visited is per (cell, k). Pruning trick: store for each cell
 * the MOST eliminations we have ever arrived with; arriving with fewer or equal is never
 * better (same position, fewer resources), so skip it.
 *
 * Dry run on grid [[0,1],[1,0]], k = 1:
 *   start (0,0,k=1) steps 0
 *   neighbours: (0,1) obstacle -> state (0,1,k=0) steps 1; (1,0) obstacle -> (1,0,0) steps 1
 *   from (0,1,0): (1,1) free -> (1,1,0) steps 2 -> target -> 2
 *
 * EDGE CASES
 * - 1 x 1 -> 0
 * - k = 0 -> plain BFS on free cells
 * - k >= m + n - 2 -> m + n - 2 immediately
 */

const { DIRS } = require('../../../../23_Graphs/02_Implementations/graph');

function bruteForce(grid, k) {
  const rows = grid.length;
  const cols = grid[0].length;
  let best = Infinity;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  function dfs(row, col, left, steps) {
    if (steps >= best) return;
    if (row === rows - 1 && col === cols - 1) { best = steps; return; }
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols || visited[r][c]) continue;
      const cost = grid[r][c];
      if (cost > left) continue;
      visited[r][c] = true;
      dfs(r, c, left - cost, steps + 1);
      visited[r][c] = false;
    }
  }
  visited[0][0] = true;
  dfs(0, 0, k, 0);
  return best === Infinity ? -1 : best;
}

function optimal(grid, k) {
  const rows = grid.length;
  const cols = grid[0].length;
  if (k >= rows + cols - 2) return rows + cols - 2;      // can bulldoze straight through

  // bestLeft[r][c] = max eliminations we still had when we reached (r, c)
  const bestLeft = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  bestLeft[0][0] = k;
  const queue = [[0, 0, k]];
  let steps = 0;
  let head = 0;
  while (head < queue.length) {
    const levelEnd = queue.length;
    for (; head < levelEnd; head++) {
      const [row, col, left] = queue[head];
      if (row === rows - 1 && col === cols - 1) return steps;
      for (const [dr, dc] of DIRS) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
        const nextLeft = left - grid[r][c];               // obstacle costs 1 elimination
        if (nextLeft < 0 || nextLeft <= bestLeft[r][c]) continue; // dominated state
        bestLeft[r][c] = nextLeft;
        queue.push([r, c, nextLeft]);
      }
    }
    steps++;
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 0, 0], [1, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 0]], 1), 6);
  assert.strictEqual(solve([[0, 1, 1], [1, 1, 1], [1, 0, 0]], 1), -1);
  assert.strictEqual(solve([[0]], 0), 0);
  assert.strictEqual(solve([[0, 1], [1, 0]], 1), 2);
  assert.strictEqual(solve([[0, 1], [1, 0]], 0), -1);
  assert.strictEqual(solve([[0, 1, 1], [1, 1, 1], [1, 0, 0]], 2), 4);
  assert.strictEqual(solve([[0, 0], [0, 0]], 5), 2);
}
console.log('✓ 09-shortest-path-with-obstacles-elimination passed');

module.exports = { optimal, bruteForce };
