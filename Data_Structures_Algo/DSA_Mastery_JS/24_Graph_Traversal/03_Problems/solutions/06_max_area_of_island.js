/**
 * 06. Max Area of Island   (LeetCode 695 — Medium)
 *
 * PROBLEM
 * Grid of 0/1. An island is a 4-directionally connected group of 1s. Return the area
 * (cell count) of the largest island, or 0 if there is none.
 *
 * EXAMPLES
 * Input: [[0,0,1,0,0],[0,1,1,0,0],[0,0,0,1,1],[1,0,0,1,1]]   Output: 4
 * Input: [[0,0,0]]                                          Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I mutate the grid? (yes here; otherwise keep a visited matrix)
 * - Diagonals? (no)
 *
 * APPROACH 1 — Brute force (BFS with visited matrix)   O(m*n) time, O(m*n) space
 * For each unvisited land cell run a BFS, counting cells popped. Same complexity as the
 * DFS version; it is the no-recursion, no-mutation variant.
 *
 * APPROACH 2 — Optimal (DFS that RETURNS the size)   O(m*n) time, O(m*n) space
 * Same as Number of Islands, but the sink function returns 1 + sizes of the 4 neighbour
 * calls. Keep the max.
 *
 * Dry run on [[1,1,0],[0,1,0],[0,0,1]]:
 *   area(0,0) = 1 + area(1,0)=0 + area(-1,0)=0 + area(0,1)=[1 + area(1,1)=[1 + 0...] ] ...
 *   = 3, max = 3. Later area(2,2) = 1. Answer 3.
 *
 * EDGE CASES
 * - all water -> 0
 * - all land -> m*n
 * - 1 x 1
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let best = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1 || visited[r][c]) continue;
      let area = 0;
      const queue = [[r, c]];
      visited[r][c] = true;
      let head = 0;
      while (head < queue.length) {
        const [row, col] = queue[head++];
        area++;
        for (const [dr, dc] of DIRS) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (grid[nr][nc] !== 1 || visited[nr][nc]) continue;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
      best = Math.max(best, area);
    }
  }
  return best;
}

function optimal(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  function area(row, col) {
    if (row < 0 || col < 0 || row >= rows || col >= cols) return 0;
    if (grid[row][col] !== 1) return 0;
    grid[row][col] = 0;                               // sink
    let total = 1;                                    // this cell
    for (const [dr, dc] of DIRS) total += area(row + dr, col + dc);
    return total;
  }

  let best = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) best = Math.max(best, area(r, c));
    }
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
const clone = (g) => g.map((row) => [...row]);
const big = [[0, 0, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 1, 1], [1, 0, 0, 1, 1]];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(clone(big)), 4);
  assert.strictEqual(solve([[0, 0, 0]]), 0);
  assert.strictEqual(solve([[1]]), 1);
  assert.strictEqual(solve([[1, 1], [1, 1]]), 4);
  assert.strictEqual(solve([[1, 0, 1, 1]]), 2);
  assert.strictEqual(solve([[1, 1, 0], [0, 1, 0], [0, 0, 1]]), 3);
}
console.log('✓ 06-max-area-of-island passed');

module.exports = { optimal, bruteForce };
