/**
 * 01. Hiking Robot   (Original — Medium)
 *
 * PROBLEM
 * A robot stands on the top-left cell of a height map `grid` (rows x cols of integers)
 * and must reach the bottom-right cell, moving up/down/left/right. The robot has a climb
 * setting e: it can step between two neighbouring cells only if their heights differ by at
 * most e. Return the smallest e that lets the robot reach the goal.
 *
 * EXAMPLES
 * Input: [[1, 2, 2],
 *         [3, 8, 2],
 *         [5, 3, 5]]        Output: 2   Explanation: 1-3-5-3-5 needs at most 2
 * Input: [[4]]              Output: 0
 * Input: [[1, 10]]          Output: 9
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 100 x 100 cells, heights 0..10^6.
 * - Moves in 4 directions only.
 *
 * APPROACH 1 — Brute force   O(D * R * C) time, O(R * C) space (D = number of distinct differences)
 * Collect every height difference between neighbours (plus 0), sort them, and try them
 * one by one from smallest: BFS with that limit; the first that reaches the goal wins.
 *
 * APPROACH 2 — Optimal (binary search on the answer + BFS feasibility check)   O(R * C * log(maxH)) time, O(R * C) space
 * If limit e works, every larger e works too (more edges allowed), so the answer is the
 * first e in [0, maxH - minH] where BFS reaches the goal -> binary search.
 * (Alternative: Dijkstra where a path's cost is its largest step — same idea, different tool.)
 *
 * Dry run on the 3x3 example (lo=0, hi=7):
 *   e=3: BFS reaches (2,2) via 1-2-2-2-5? 2->5 is 3 ok -> yes   hi=3
 *   e=1: from 1 -> 2 -> 2 -> 2, then 2->5 (3) and 2->8 (6) blocked; 1->3 (2) blocked -> no  lo=2
 *   e=2: 1->3->5->3->5 -> yes   hi=2
 *   answer 2
 *
 * EDGE CASES
 * - 1x1 grid -> 0
 * - flat grid -> 0
 * - one row / one column -> max adjacent difference along the line
 *
 * COMMON MISTAKES
 * - Marking cells visited only when popped (cells get queued many times).
 * - Setting hi to the max height instead of max - min (still correct, just more steps).
 */

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function canReach(grid, e) {
  const R = grid.length, C = grid[0].length;
  const seen = Array.from({ length: R }, () => new Array(C).fill(false));
  const q = [[0, 0]]; seen[0][0] = true;
  for (let h = 0; h < q.length; h++) {
    const [r, c] = q[h];
    if (r === R - 1 && c === C - 1) return true;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= R || nc >= C || seen[nr][nc]) continue;
      if (Math.abs(grid[nr][nc] - grid[r][c]) > e) continue;
      seen[nr][nc] = true; q.push([nr, nc]);
    }
  }
  return false;
}

function bruteForce(grid) {
  const diffs = new Set([0]);
  for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[0].length; c++) {
    if (r + 1 < grid.length) diffs.add(Math.abs(grid[r + 1][c] - grid[r][c]));
    if (c + 1 < grid[0].length) diffs.add(Math.abs(grid[r][c + 1] - grid[r][c]));
  }
  for (const e of [...diffs].sort((a, b) => a - b)) if (canReach(grid, e)) return e;
  return -1; // unreachable: the largest difference always connects the grid
}

function optimal(grid) {
  let lo = 0, hi = Math.max(...grid.flat()) - Math.min(...grid.flat());
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canReach(grid, mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 2, 2], [3, 8, 2], [5, 3, 5]]), 2);
  assert.strictEqual(solve([[4]]), 0);
  assert.strictEqual(solve([[1, 10]]), 9);
  assert.strictEqual(solve([[7, 7], [7, 7]]), 0);
  assert.strictEqual(solve([[1], [4], [2]]), 3);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(501);
for (let t = 0; t < 300; t++) {
  const R = 1 + Math.floor(rand() * 4), C = 1 + Math.floor(rand() * 4);
  const grid = Array.from({ length: R }, () => Array.from({ length: C }, () => Math.floor(rand() * 10)));
  assert.strictEqual(optimal(grid), bruteForce(grid));
}
console.log('✓ set_05/01_hiking_robot passed');
module.exports = { optimal, bruteForce };
