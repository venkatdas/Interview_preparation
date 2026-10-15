/**
 * 08. Minimum Cost to Make at Least One Valid Path in a Grid   (LeetCode 1368 — Hard)
 *
 * PROBLEM
 * Each grid cell has an arrow: 1 = right, 2 = left, 3 = down, 4 = up. Starting at (0,0)
 * you follow arrows for free; changing a cell's arrow (once) costs 1. Return the minimum
 * cost so that a path from (0,0) to (m-1,n-1) exists.
 *
 * EXAMPLES
 * Input: [[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]   Output: 3
 * Input: [[1,1,3],[3,2,2],[1,1,4]]                   Output: 0
 * Input: [[1,2],[4,3]]                               Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Moving in the arrow direction costs 0, any other direction costs 1? (yes)
 * - You can change an arrow at most once but it never matters: once you leave a cell you
 *   do not return on a shortest path.
 *
 * This is a shortest path where every edge weighs 0 or 1: the classic 0-1 BFS case.
 *
 * APPROACH 1 — Alternative (Dijkstra)   O(m*n log(m*n))
 * Treat each move as an edge with weight 0 (arrow direction) or 1 (any other). Standard
 * Dijkstra with the heap. Shown as `dijkstraVersion`.
 *
 * APPROACH 2 — Optimal (0-1 BFS with a deque)   O(m*n) time, O(m*n) space
 * Same relaxation, but instead of a heap: 0-cost moves push to the FRONT of the deque,
 * 1-cost moves push to the BACK. The deque stays sorted by cost, so the first time we pop
 * the target its cost is minimal.
 *
 * Dry run on [[1,2],[4,3]]  (arrows: (0,0) right, (0,1) left, (1,0) up, (1,1) down):
 *   pop (0,0) cost 0: right -> (0,1) cost 0 (front); down -> (1,0) cost 1 (back)
 *   pop (0,1) cost 0: its arrow is left (back to (0,0), no better); down -> (1,1) cost 1
 *   pop (1,0) cost 1 ... pop (1,1) cost 1 -> answer 1
 *
 * EDGE CASES
 * - 1 x 1 -> 0
 * - arrows already form a path -> 0
 * - every arrow points away -> at most m + n - 2
 */

const { MinHeap, Deque } = require('../../02_Implementations/shortest_paths');

// index = arrow value; DIRECTION[1] = right, [2] = left, [3] = down, [4] = up
const DIRECTION = [null, [0, 1], [0, -1], [1, 0], [-1, 0]];

function dijkstraVersion(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const cost = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  cost[0][0] = 0;
  const heap = new MinHeap();
  heap.push([0, 0, 0]);
  while (!heap.isEmpty()) {
    const [c, row, col] = heap.pop();
    if (c > cost[row][col]) continue;
    if (row === rows - 1 && col === cols - 1) return c;
    for (let arrow = 1; arrow <= 4; arrow++) {
      const [dr, dc] = DIRECTION[arrow];
      const r = row + dr;
      const cc = col + dc;
      if (r < 0 || cc < 0 || r >= rows || cc >= cols) continue;
      const step = grid[row][col] === arrow ? 0 : 1;
      if (c + step < cost[r][cc]) {
        cost[r][cc] = c + step;
        heap.push([c + step, r, cc]);
      }
    }
  }
  return cost[rows - 1][cols - 1];
}

function optimal(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const cost = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  cost[0][0] = 0;
  const deque = new Deque();
  deque.pushFront([0, 0]);
  while (deque.size() > 0) {
    const [row, col] = deque.popFront();
    for (let arrow = 1; arrow <= 4; arrow++) {
      const [dr, dc] = DIRECTION[arrow];
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      const step = grid[row][col] === arrow ? 0 : 1;        // free if we follow the arrow
      if (cost[row][col] + step < cost[r][c]) {
        cost[r][c] = cost[row][col] + step;
        if (step === 0) deque.pushFront([r, c]);             // same cost -> process soon
        else deque.pushBack([r, c]);                         // one more -> process later
      }
    }
  }
  return cost[rows - 1][cols - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [dijkstraVersion, optimal]) {
  assert.strictEqual(solve([[1, 1, 1, 1], [2, 2, 2, 2], [1, 1, 1, 1], [2, 2, 2, 2]]), 3);
  assert.strictEqual(solve([[1, 1, 3], [3, 2, 2], [1, 1, 4]]), 0);
  assert.strictEqual(solve([[1, 2], [4, 3]]), 1);
  assert.strictEqual(solve([[2, 2, 2], [2, 2, 2]]), 3);
  assert.strictEqual(solve([[4]]), 0);
  assert.strictEqual(solve([[1, 1, 3], [3, 3, 3]]), 0);
}
console.log('✓ 08-minimum-cost-valid-path passed');

module.exports = { optimal, dijkstraVersion };
