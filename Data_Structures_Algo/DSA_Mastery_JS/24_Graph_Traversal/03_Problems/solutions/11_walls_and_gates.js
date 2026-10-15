/**
 * 11. Walls and Gates   (LeetCode 286 — Medium)
 *
 * PROBLEM
 * Grid with three kinds of cells: -1 wall, 0 gate, INF (2^31 - 1) empty room. Fill every
 * empty room with the distance to its NEAREST gate. Leave INF if no gate is reachable.
 *
 * EXAMPLES
 * Input:                      Output:
 *   INF  -1   0  INF            3  -1   0   1
 *   INF INF INF  -1             2   2   1  -1
 *   INF  -1 INF  -1             1  -1   2  -1
 *     0  -1 INF INF             0  -1   3   4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Modify in place? (yes)
 * - Multiple gates? (yes - this is the whole point)
 *
 * APPROACH 1 — Brute force (BFS from EACH room)   O((m*n)^2) time
 * For every empty room run a BFS until you hit a gate. m*n rooms, each BFS O(m*n).
 * (A slightly better brute force: BFS from each GATE and keep the min - still O(g * m*n).)
 *
 * APPROACH 2 — Optimal (multi-source BFS from all gates)   O(m*n) time, O(m*n) space
 * Flip the question: instead of "how far is each room from a gate", ask "how far does
 * each gate reach". Put ALL gates in the queue at distance 0 and BFS outward. The first
 * time BFS touches a room is from its nearest gate. Writing the distance into the cell
 * doubles as the visited mark (only INF cells get expanded).
 *
 * Dry run (small):
 *     INF  0           queue [(0,1),(1,0)]
 *      0  INF          pop (0,1): (0,0)=1, (1,1)=1    pop (1,0): both already 1
 *   result [[1,0],[0,1]]
 *
 * EDGE CASES
 * - no gates -> grid unchanged
 * - rooms boxed in by walls stay INF
 * - empty grid
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');
const INF = 2147483647;

function bruteForce(rooms) {
  const rows = rooms.length;
  if (!rows) return rooms;
  const cols = rooms[0].length;
  const result = rooms.map((row) => [...row]);

  function distanceToNearestGate(sr, sc) {
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const queue = [[sr, sc, 0]];
    visited[sr][sc] = true;
    let head = 0;
    while (head < queue.length) {
      const [row, col, dist] = queue[head++];
      if (rooms[row][col] === 0) return dist;
      for (const [dr, dc] of DIRS) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
        if (rooms[r][c] === -1 || visited[r][c]) continue;
        visited[r][c] = true;
        queue.push([r, c, dist + 1]);
      }
    }
    return INF;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === INF) result[r][c] = distanceToNearestGate(r, c);
    }
  }
  for (let r = 0; r < rows; r++) rooms[r] = result[r];
  return rooms;
}

function optimal(rooms) {
  const rows = rooms.length;
  if (!rows) return rooms;
  const cols = rooms[0].length;
  const queue = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === 0) queue.push([r, c]);   // every gate is a source
    }
  }
  let head = 0;
  while (head < queue.length) {
    const [row, col] = queue[head++];
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      if (rooms[r][c] !== INF) continue;           // wall, gate, or already filled
      rooms[r][c] = rooms[row][col] + 1;           // first touch = nearest gate
      queue.push([r, c]);
    }
  }
  return rooms;
}

// ---------- tests ----------
const assert = require('assert');
const sample = [
  [INF, -1, 0, INF],
  [INF, INF, INF, -1],
  [INF, -1, INF, -1],
  [0, -1, INF, INF],
];
const expected = [
  [3, -1, 0, 1],
  [2, 2, 1, -1],
  [1, -1, 2, -1],
  [0, -1, 3, 4],
];
const clone = (g) => g.map((row) => [...row]);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(clone(sample)), expected);
  assert.deepStrictEqual(solve([[INF, 0], [0, INF]]), [[1, 0], [0, 1]]);
  assert.deepStrictEqual(solve([[INF, INF]]), [[INF, INF]]);          // no gates
  assert.deepStrictEqual(solve([[0, -1, INF]]), [[0, -1, INF]]);      // blocked
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([[-1]]), [[-1]]);
}
console.log('✓ 11-walls-and-gates passed');

module.exports = { optimal, bruteForce, INF };
