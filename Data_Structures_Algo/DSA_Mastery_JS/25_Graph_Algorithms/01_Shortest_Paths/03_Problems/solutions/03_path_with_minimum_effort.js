/**
 * 03. Path With Minimum Effort   (LeetCode 1631 — Medium)
 *
 * PROBLEM
 * heights is a grid. You walk from the top-left to the bottom-right (4 directions). The
 * EFFORT of a route is the LARGEST absolute height difference between two consecutive
 * cells on it. Return the minimum possible effort.
 *
 * EXAMPLES
 * Input: [[1,2,2],[3,8,2],[5,3,5]]            Output: 2   (route 1,3,5,3,5 has max diff 2)
 * Input: [[1,2,3],[3,8,4],[5,3,5]]            Output: 1   (route 1,2,3,4,5)
 * Input: [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]   Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Minimising the MAX step, not the sum? (yes - "min-max" path)
 * - 1 x 1 grid -> 0
 *
 * APPROACH 1 — Brute force (binary search on effort + BFS)   O(m*n * log(maxHeight))
 * "Can we reach the end using only steps with diff <= limit?" is monotonic in limit.
 * Binary search the limit (0..10^6) and BFS to check. A solid alternative, O(mn log H).
 *
 * APPROACH 2 — Optimal (Dijkstra with max instead of sum)   O(m*n log(m*n))
 * Same Dijkstra skeleton, but the "distance" of a path is the max edge on it:
 *   candidate = Math.max(effortSoFar, |h[next] - h[cur]|)
 * The greedy argument still holds: the cell popped with the smallest max-so-far is final.
 *
 * Dry run on [[1,2,2],[3,8,2],[5,3,5]]:
 *   pop (0,0) effort 0: (0,1) diff 1 -> 1, (1,0) diff 2 -> 2
 *   pop (0,1) effort 1: (0,2) diff 0 -> 1, (1,1) diff 6 -> 6
 *   pop (0,2) effort 1: (1,2) diff 0 -> 1
 *   pop (1,2) effort 1: (2,2) diff 3 -> 3, (1,1) 6 -> 6 no better
 *   pop (1,0) effort 2: (2,0) diff 2 -> 2, (1,1) diff 5 -> 5
 *   pop (2,0) effort 2: (2,1) diff 2 -> 2
 *   pop (2,1) effort 2: (2,2) diff 2 -> 2 (better than 3)
 *   pop (2,2) effort 2 -> answer 2
 *
 * EDGE CASES
 * - single cell -> 0
 * - single row -> max adjacent diff
 * - all equal -> 0
 */

const { MinHeap } = require('../../02_Implementations/shortest_paths');
const { DIRS } = require('../../../../23_Graphs/02_Implementations/graph');

function bruteForce(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
  function reachable(limit) {
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const stack = [[0, 0]];
    visited[0][0] = true;
    while (stack.length) {
      const [r, c] = stack.pop();
      if (r === rows - 1 && c === cols - 1) return true;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || visited[nr][nc]) continue;
        if (Math.abs(heights[nr][nc] - heights[r][c]) > limit) continue;
        visited[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
    return false;
  }
  let low = 0;
  let high = 1e6;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (reachable(mid)) high = mid;
    else low = mid + 1;
  }
  return low;
}

function optimal(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
  const effort = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
  effort[0][0] = 0;
  const heap = new MinHeap();
  heap.push([0, 0, 0]);                                   // [effort, row, col]
  while (!heap.isEmpty()) {
    const [e, row, col] = heap.pop();
    if (e > effort[row][col]) continue;
    if (row === rows - 1 && col === cols - 1) return e;   // first pop of target = answer
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      const candidate = Math.max(e, Math.abs(heights[r][c] - heights[row][col])); // min-max
      if (candidate < effort[r][c]) {
        effort[r][c] = candidate;
        heap.push([candidate, r, c]);
      }
    }
  }
  return effort[rows - 1][cols - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 2, 2], [3, 8, 2], [5, 3, 5]]), 2);
  assert.strictEqual(solve([[1, 2, 3], [3, 8, 4], [5, 3, 5]]), 1);
  assert.strictEqual(solve([[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]), 0);
  assert.strictEqual(solve([[7]]), 0);
  assert.strictEqual(solve([[1, 10, 6]]), 9);
  assert.strictEqual(solve([[4, 4], [4, 4]]), 0);
}
console.log('✓ 03-path-with-minimum-effort passed');

module.exports = { optimal, bruteForce };
