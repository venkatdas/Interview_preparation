/**
 * 10. Rotting Oranges   (LeetCode 994 — Medium)
 *
 * PROBLEM
 * Grid cells: 0 empty, 1 fresh orange, 2 rotten orange. Every minute, each rotten orange
 * rots its 4 fresh neighbours. Return the minutes until no fresh orange remains, or -1
 * if that is impossible.
 *
 * EXAMPLES
 * Input: [[2,1,1],[1,1,0],[0,1,1]]   Output: 4
 * Input: [[2,1,1],[0,1,1],[1,0,1]]   Output: -1   (bottom-left orange is unreachable)
 * Input: [[0,2]]                     Output: 0    (nothing fresh)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Multiple rotten oranges at the start? (yes -> multi-source)
 * - No oranges at all? (0)
 * - Can I mutate the grid? (yes; otherwise copy)
 *
 * APPROACH 1 — Brute force (simulate minute by minute)   O(minutes * m*n) time
 * Each minute, scan the grid, collect fresh cells next to a rotten one, rot them all at
 * once. Stop when nothing changes. Minutes can be O(m*n), so O((m*n)^2) worst case.
 *
 * APPROACH 2 — Optimal (multi-source BFS by levels)   O(m*n) time, O(m*n) space
 *   1. Push ALL rotten cells into the queue; count fresh cells.
 *   2. BFS level by level. Each level = one minute. Rot fresh neighbours, decrement fresh.
 *   3. If fresh > 0 at the end -> -1, else the number of levels that rotted something.
 *
 * Dry run on [[2,1,1],[1,1,0],[0,1,1]]:
 *   queue [(0,0)] fresh=6
 *   min 1: (0,1),(1,0) rot                fresh=4
 *   min 2: (0,2),(1,1) rot                fresh=2
 *   min 3: (2,1) rot                      fresh=1
 *   min 4: (2,2) rot                      fresh=0
 *   answer 4
 *
 * EDGE CASES
 * - no fresh oranges -> 0 (even with no rotten ones)
 * - fresh orange with no rotten anywhere -> -1
 * - count minutes only when a level actually rots something (do not add +1 for the
 *   final empty level)
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let minutes = 0;
  while (true) {
    const toRot = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== 1) continue;
        const nextToRotten = DIRS.some(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          return nr >= 0 && nc >= 0 && nr < rows && nc < cols && grid[nr][nc] === 2;
        });
        if (nextToRotten) toRot.push([r, c]);
      }
    }
    if (toRot.length === 0) break;
    for (const [r, c] of toRot) grid[r][c] = 2;   // rot simultaneously
    minutes++;
  }
  const anyFresh = grid.some((row) => row.includes(1));
  return anyFresh ? -1 : minutes;
}

function optimal(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);  // all sources at level 0
      else if (grid[r][c] === 1) fresh++;
    }
  }

  let minutes = 0;
  let head = 0;
  while (head < queue.length && fresh > 0) {
    const levelEnd = queue.length;               // freeze this minute's rotten cells
    for (; head < levelEnd; head++) {
      const [row, col] = queue[head];
      for (const [dr, dc] of DIRS) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== 1) continue;
        grid[r][c] = 2;                          // rot = visited
        fresh--;
        queue.push([r, c]);
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}

// ---------- tests ----------
const assert = require('assert');
const clone = (g) => g.map((row) => [...row]);
const cases = [
  [[[2, 1, 1], [1, 1, 0], [0, 1, 1]], 4],
  [[[2, 1, 1], [0, 1, 1], [1, 0, 1]], -1],
  [[[0, 2]], 0],
  [[[0]], 0],
  [[[1]], -1],
  [[[2, 2], [1, 1], [0, 0], [2, 0]], 1],
  [[[2, 1, 1, 1, 2]], 2],
];
for (const solve of [bruteForce, optimal]) {
  for (const [grid, expected] of cases) assert.strictEqual(solve(clone(grid)), expected);
}
console.log('✓ 10-rotting-oranges passed');

module.exports = { optimal, bruteForce };
