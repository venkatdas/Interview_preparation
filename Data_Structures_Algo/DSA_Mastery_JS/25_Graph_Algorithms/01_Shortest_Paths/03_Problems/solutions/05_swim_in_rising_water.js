/**
 * 05. Swim in Rising Water   (LeetCode 778 — Hard)
 *
 * PROBLEM
 * n x n grid where grid[r][c] is the elevation of that cell (a permutation of 0..n*n-1).
 * At time t the water level is t; you can move between 4-adjacent cells only if BOTH have
 * elevation <= t. Starting at (0,0), find the least t at which you can reach (n-1,n-1).
 *
 * EXAMPLES
 * Input: [[0,2],[1,3]]   Output: 3   (you must pass through 3 eventually)
 * Input: [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]
 * Output: 16
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - The answer is at least max(grid[0][0], grid[n-1][n-1])? (yes)
 * - Min-max path problem again: minimise the maximum cell on the path.
 *
 * APPROACH 1 — Brute force (binary search on t + DFS reachability)   O(n^2 log n^2)
 * "Can we reach the end using only cells <= t" is monotonic. Binary search t in
 * [0, n*n - 1] with a DFS check. Also a fine interview answer.
 *
 * APPROACH 2 — Optimal (Dijkstra, min-max)   O(n^2 log n)
 * dist[cell] = minimum "water level needed" to reach that cell =
 *   max(dist[prev], grid[cell]). Pop the smallest; the first time we pop the target,
 * that value is the answer.
 *
 * Dry run on [[0,2],[1,3]]:
 *   pop (0,0) level 0: (0,1) -> max(0,2)=2, (1,0) -> max(0,1)=1
 *   pop (1,0) level 1: (1,1) -> max(1,3)=3
 *   pop (0,1) level 2: (1,1) -> max(2,3)=3 no better
 *   pop (1,1) level 3 -> answer 3
 *
 * (Union-find alternative: add cells in elevation order, union with lower neighbours,
 *  stop when start and end connect.)
 *
 * EDGE CASES
 * - 1 x 1 -> grid[0][0]
 * - start cell is the highest -> answer is grid[0][0]
 */

const { MinHeap } = require('../../02_Implementations/shortest_paths');
const { DIRS } = require('../../../../23_Graphs/02_Implementations/graph');

function bruteForce(grid) {
  const n = grid.length;
  function canReach(level) {
    if (grid[0][0] > level) return false;
    const visited = Array.from({ length: n }, () => new Array(n).fill(false));
    const stack = [[0, 0]];
    visited[0][0] = true;
    while (stack.length) {
      const [r, c] = stack.pop();
      if (r === n - 1 && c === n - 1) return true;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= n || nc >= n || visited[nr][nc]) continue;
        if (grid[nr][nc] > level) continue;
        visited[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return false;
  }
  let low = 0;
  let high = n * n - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (canReach(mid)) high = mid;
    else low = mid + 1;
  }
  return low;
}

function optimal(grid) {
  const n = grid.length;
  const level = Array.from({ length: n }, () => new Array(n).fill(Infinity));
  level[0][0] = grid[0][0];
  const heap = new MinHeap();
  heap.push([grid[0][0], 0, 0]);
  while (!heap.isEmpty()) {
    const [t, row, col] = heap.pop();
    if (t > level[row][col]) continue;
    if (row === n - 1 && col === n - 1) return t;
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= n || c >= n) continue;
      const candidate = Math.max(t, grid[r][c]);       // water must cover the new cell too
      if (candidate < level[r][c]) {
        level[r][c] = candidate;
        heap.push([candidate, r, c]);
      }
    }
  }
  return level[n - 1][n - 1];
}

// ---------- tests ----------
const assert = require('assert');
const big = [[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 2], [1, 3]]), 3);
  assert.strictEqual(solve(big), 16);
  assert.strictEqual(solve([[0]]), 0);
  assert.strictEqual(solve([[3, 2], [0, 1]]), 3);
  assert.strictEqual(solve([[0, 1, 2], [5, 4, 3], [6, 7, 8]]), 8);
  assert.strictEqual(solve([[1, 0], [2, 3]]), 3);
}
console.log('✓ 05-swim-in-rising-water passed');

module.exports = { optimal, bruteForce };
