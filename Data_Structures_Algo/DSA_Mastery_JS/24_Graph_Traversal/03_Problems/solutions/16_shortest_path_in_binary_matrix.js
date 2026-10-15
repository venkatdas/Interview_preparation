/**
 * 16. Shortest Path in Binary Matrix   (LeetCode 1091 — Medium)
 *
 * PROBLEM
 * n x n grid of 0 (open) and 1 (blocked). A clear path goes from (0,0) to (n-1,n-1)
 * through open cells, moving in any of the 8 directions (diagonals allowed). Return the
 * length of the shortest clear path (number of cells), or -1.
 *
 * EXAMPLES
 * Input: [[0,1],[1,0]]                 Output: 2   (diagonal)
 * Input: [[0,0,0],[1,1,0],[1,1,0]]     Output: 4
 * Input: [[1,0,0],[1,1,0],[1,1,0]]     Output: -1  (start is blocked)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 8 directions, not 4? (yes - read carefully, it changes the DIRS array)
 * - Path length counts cells, not moves? (cells: a 1 x 1 grid answer is 1)
 * - Start or end blocked -> -1
 *
 * APPROACH 1 — Brute force (DFS trying all paths)   exponential time
 * DFS from (0,0) exploring every simple path and keeping the minimum length. Correct but
 * explodes on anything beyond tiny grids. DFS does NOT give shortest paths for free.
 *
 * APPROACH 2 — Optimal (BFS, 8 directions)   O(n^2) time, O(n^2) space
 * Unweighted grid, shortest path -> BFS. Store the path length with each cell (or use
 * levels). Return when we pop the target.
 *
 * Dry run on [[0,0,0],[1,1,0],[1,1,0]]:
 *   queue [(0,0,len 1)]
 *   pop (0,0): push (0,1,2)              (1,0),(1,1) blocked
 *   pop (0,1): push (0,2,3), (1,2,3)     (diagonal to (1,2))
 *   pop (0,2): (1,2) already seen
 *   pop (1,2): push (2,2,4)
 *   pop (2,2): target -> 4
 *
 * EDGE CASES
 * - 1 x 1 open grid -> 1
 * - start or end is 1 -> -1
 * - no route -> -1
 */

const { DIRS_8 } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(grid) {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));
  let best = Infinity;

  function dfs(row, col, length) {
    if (length >= best) return;                // prune: already worse
    if (row === n - 1 && col === n - 1) { best = length; return; }
    for (const [dr, dc] of DIRS_8) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= n || c >= n || grid[r][c] === 1 || visited[r][c]) continue;
      visited[r][c] = true;
      dfs(r, c, length + 1);
      visited[r][c] = false;                   // backtrack - allow other paths through here
    }
  }

  visited[0][0] = true;
  dfs(0, 0, 1);
  return best === Infinity ? -1 : best;
}

function optimal(grid) {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  const dist = Array.from({ length: n }, () => new Array(n).fill(0)); // 0 = unseen
  dist[0][0] = 1;                                 // path length counts cells
  const queue = [[0, 0]];
  let head = 0;
  while (head < queue.length) {
    const [row, col] = queue[head++];
    if (row === n - 1 && col === n - 1) return dist[row][col];
    for (const [dr, dc] of DIRS_8) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= n || c >= n || grid[r][c] === 1 || dist[r][c] !== 0) continue;
      dist[r][c] = dist[row][col] + 1;
      queue.push([r, c]);
    }
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 1], [1, 0]]), 2);
  assert.strictEqual(solve([[0, 0, 0], [1, 1, 0], [1, 1, 0]]), 4);
  assert.strictEqual(solve([[1, 0, 0], [1, 1, 0], [1, 1, 0]]), -1);
  assert.strictEqual(solve([[0]]), 1);
  assert.strictEqual(solve([[0, 0], [0, 1]]), -1);
  assert.strictEqual(solve([[0, 1, 1], [1, 1, 1], [1, 1, 0]]), -1);
  assert.strictEqual(solve([[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]), 6);
}
console.log('✓ 16-shortest-path-in-binary-matrix passed');

module.exports = { optimal, bruteForce };
