/**
 * 09. Rotting Oranges   (LeetCode 994 — Medium)
 *
 * PROBLEM
 * In a grid, 0 = empty, 1 = fresh orange, 2 = rotten orange. Every minute, a
 * rotten orange rots its 4-directional fresh neighbours. Return the minimum
 * minutes until no fresh orange remains, or -1 if that is impossible.
 *
 * EXAMPLES
 * Input: [[2,1,1],[1,1,0],[0,1,1]]   Output: 4
 * Input: [[2,1,1],[0,1,1],[1,0,1]]   Output: -1   Explanation: bottom-left orange is unreachable
 * Input: [[0,2]]                     Output: 0    Explanation: nothing fresh to begin with
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Several rotten oranges can start at once? (yes -> MULTI-SOURCE BFS)
 * - Diagonals count? (no, only 4 directions)
 * - Can I modify the grid? (yes; otherwise copy it)
 *
 * APPROACH 1 — Brute force (simulate minute by minute)   O(minutes * m*n) time
 * Each minute, scan the whole grid, collect fresh cells next to rotten ones,
 * rot them all at once. Repeat until nothing changes. Worst case the rot
 * travels a long snake path, so minutes can be ~m*n -> O((m*n)^2).
 *
 * APPROACH 2 — Optimal (multi-source BFS with a queue)   O(m*n) time, O(m*n) space
 * BFS explores in "layers" of equal distance - exactly what minutes are.
 *   1. Put ALL rotten oranges in the queue at the start (distance 0) and count fresh ones.
 *   2. Process the queue level by level: for each cell, rot fresh neighbours,
 *      push them, decrement the fresh count.
 *   3. Each level processed = 1 minute (only count a minute if something rotted).
 *   4. If fresh > 0 at the end -> -1.
 *
 * Dry run on [[2,1,1],[1,1,0],[0,1,1]]:
 *   minute 0: queue [(0,0)]  fresh=6
 *   minute 1: rot (0,1),(1,0)            fresh=4
 *   minute 2: rot (0,2),(1,1)            fresh=2
 *   minute 3: rot (2,1)                  fresh=1
 *   minute 4: rot (2,2)                  fresh=0  -> 4
 *
 * EDGE CASES
 * - no fresh oranges -> 0 (even with no rotten ones)
 * - no rotten oranges but fresh ones -> -1
 * - unreachable fresh orange -> -1
 */

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function bruteForce(grid) {
  const g = grid.map((row) => [...row]);
  const rows = g.length;
  const cols = g[0].length;
  let minutes = 0;

  while (true) {
    const toRot = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (g[r][c] !== 1) continue;
        const nearRotten = DIRECTIONS.some(([dr, dc]) => g[r + dr]?.[c + dc] === 2);
        if (nearRotten) toRot.push([r, c]);
      }
    }
    if (toRot.length === 0) break;
    for (const [r, c] of toRot) g[r][c] = 2;
    minutes++;
  }
  const anyFresh = g.some((row) => row.includes(1));
  return anyFresh ? -1 : minutes;
}

function optimal(grid) {
  const g = grid.map((row) => [...row]); // don't mutate the caller's grid
  const rows = g.length;
  const cols = g[0].length;

  let queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c] === 2) queue.push([r, c]); // all sources start together
      else if (g[r][c] === 1) fresh++;
    }
  }

  let minutes = 0;
  while (queue.length && fresh > 0) {
    const nextLevel = []; // processing level-by-level = one minute per level
    for (const [r, c] of queue) {
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (g[nr][nc] !== 1) continue;
        g[nr][nc] = 2; // mark visited by rotting it
        fresh--;
        nextLevel.push([nr, nc]);
      }
    }
    queue = nextLevel;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[2, 1, 1], [1, 1, 0], [0, 1, 1]]), 4);
  assert.strictEqual(solve([[2, 1, 1], [0, 1, 1], [1, 0, 1]]), -1);
  assert.strictEqual(solve([[0, 2]]), 0);
  assert.strictEqual(solve([[0]]), 0);
  assert.strictEqual(solve([[1]]), -1);
  assert.strictEqual(solve([[2, 2], [1, 1], [0, 0], [2, 0]]), 1);
  assert.strictEqual(solve([[1, 2], [1, 1], [1, 1]]), 3);
}
// the input grid must not be modified
const input = [[2, 1]];
optimal(input);
assert.deepStrictEqual(input, [[2, 1]]);
console.log('✓ 09-rotting-oranges passed');

module.exports = { optimal, bruteForce };
