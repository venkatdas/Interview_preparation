/**
 * 10. Walls and Gates / 01 Matrix   (LeetCode 286 — Medium, 542 — Medium)
 *
 * PROBLEM
 * Walls and Gates: a grid with -1 (wall), 0 (gate), INF (empty room). Fill each
 * empty room with the distance to its NEAREST gate. Rooms that can't reach a
 * gate stay INF.
 *
 * 01 Matrix: a binary grid. For each cell, return the distance to the nearest 0.
 * Same idea: the 0s are the "gates", and there are no walls.
 *
 * EXAMPLES
 * Walls and Gates:
 *   [[INF,-1,0,INF],          [[3,-1,0,1],
 *    [INF,INF,INF,-1],   ->    [2,2,1,-1],
 *    [INF,-1,INF,-1],          [1,-1,2,-1],
 *    [0,-1,INF,INF]]           [0,-1,3,4]]
 * 01 Matrix:
 *   [[0,0,0],[0,1,0],[1,1,1]]  ->  [[0,0,0],[0,1,0],[1,2,1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 4-directional moves? (yes)
 * - Multiple gates / zeros? (yes -> multi-source BFS again)
 * - In-place modification OK? (Walls and Gates: yes. 01 Matrix: return a new grid)
 *
 * APPROACH 1 — Brute force (BFS from every room)   O((m*n)^2) time
 * For each empty cell run its own BFS until it hits a gate. Each BFS is O(m*n),
 * and there are O(m*n) cells.
 *
 * APPROACH 2 — Optimal (multi-source BFS from all gates at once)   O(m*n) time, O(m*n) space
 * Flip the question: instead of "how far is each room from a gate", ask "how
 * far does each gate reach". Start BFS from ALL gates simultaneously (all at
 * distance 0). The first time BFS reaches a room, that is its nearest-gate
 * distance (BFS visits in increasing distance order). Set it and enqueue it.
 * A room with a value already set has been visited; skip it.
 *
 * Dry run (01 Matrix [[0,0,0],[0,1,0],[1,1,1]]):
 *   queue = all zeros (7 cells), their dist = 0
 *   level 1: (1,1) gets 1, (2,0) gets 1, (2,2) gets 1
 *   level 2: (2,1) gets 2
 *   done.
 *
 * EDGE CASES
 * - no gates at all -> everything stays INF (Walls and Gates)
 * - room fully surrounded by walls -> stays INF
 * - 1x1 grid
 */

const INF = 2147483647;
const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// ---------- Walls and Gates ----------
function bruteForceWallsAndGates(rooms) {
  const rows = rooms.length;
  const cols = rows ? rooms[0].length : 0;
  const result = rooms.map((row) => [...row]);

  const distanceToGate = (sr, sc) => {
    const seen = new Set([`${sr},${sc}`]);
    let queue = [[sr, sc]];
    let dist = 0;
    while (queue.length) {
      const next = [];
      for (const [r, c] of queue) {
        if (rooms[r][c] === 0) return dist;
        for (const [dr, dc] of DIRECTIONS) {
          const nr = r + dr;
          const nc = c + dc;
          const key = `${nr},${nc}`;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || rooms[nr][nc] === -1 || seen.has(key)) continue;
          seen.add(key);
          next.push([nr, nc]);
        }
      }
      queue = next;
      dist++;
    }
    return INF;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === INF) result[r][c] = distanceToGate(r, c);
    }
  }
  return result;
}

function wallsAndGates(rooms) {
  const rows = rooms.length;
  const cols = rows ? rooms[0].length : 0;
  const queue = [];
  let head = 0; // pointer-based queue: no O(n) shift

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === 0) queue.push([r, c]); // every gate is a source
    }
  }

  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (rooms[nr][nc] !== INF) continue; // wall, gate, or already filled
      rooms[nr][nc] = rooms[r][c] + 1;     // first visit = shortest distance
      queue.push([nr, nc]);
    }
  }
  return rooms;
}

// ---------- 01 Matrix ----------
function bruteForceZeroOneMatrix(mat) {
  // treat 1s as INF rooms and 0s as gates, then reuse the per-cell BFS
  const rooms = mat.map((row) => row.map((v) => (v === 0 ? 0 : INF)));
  return bruteForceWallsAndGates(rooms);
}

function zeroOneMatrix(mat) {
  const rows = mat.length;
  const cols = rows ? mat[0].length : 0;
  const dist = mat.map((row) => row.map((v) => (v === 0 ? 0 : -1))); // -1 = not visited
  const queue = [];
  let head = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) queue.push([r, c]);
    }
  }

  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (dist[nr][nc] !== -1) continue;
      dist[nr][nc] = dist[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
  return dist;
}

const optimal = zeroOneMatrix;
const bruteForce = bruteForceZeroOneMatrix;

// ---------- tests ----------
const assert = require('assert');

const gatesInput = () => [
  [INF, -1, 0, INF],
  [INF, INF, INF, -1],
  [INF, -1, INF, -1],
  [0, -1, INF, INF],
];
const gatesExpected = [
  [3, -1, 0, 1],
  [2, 2, 1, -1],
  [1, -1, 2, -1],
  [0, -1, 3, 4],
];
for (const solve of [bruteForceWallsAndGates, wallsAndGates]) {
  assert.deepStrictEqual(solve(gatesInput()), gatesExpected);
  assert.deepStrictEqual(solve([[INF]]), [[INF]]);                 // no gate
  assert.deepStrictEqual(solve([[0, INF, -1, INF]]), [[0, 1, -1, INF]]); // blocked by a wall
  assert.deepStrictEqual(solve([[-1]]), [[-1]]);
}
for (const solve of [bruteForceZeroOneMatrix, zeroOneMatrix]) {
  assert.deepStrictEqual(solve([[0, 0, 0], [0, 1, 0], [0, 0, 0]]), [[0, 0, 0], [0, 1, 0], [0, 0, 0]]);
  assert.deepStrictEqual(solve([[0, 0, 0], [0, 1, 0], [1, 1, 1]]), [[0, 0, 0], [0, 1, 0], [1, 2, 1]]);
  assert.deepStrictEqual(solve([[0]]), [[0]]);
  assert.deepStrictEqual(solve([[0, 1, 1, 1]]), [[0, 1, 2, 3]]);
}
console.log('✓ 10-walls-and-gates-01-matrix passed');

module.exports = { optimal, bruteForce, wallsAndGates, zeroOneMatrix, bruteForceWallsAndGates, bruteForceZeroOneMatrix, INF };
