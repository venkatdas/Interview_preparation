/**
 * 06. Nearest Charger   (Original — Medium)
 *
 * PROBLEM
 * A warehouse floor is a grid of strings: '.' open floor, '#' shelf (blocked), 'C' charger.
 * Robots move up/down/left/right one cell per step and cannot enter shelves.
 * Return a grid of numbers: for each open cell or charger, the minimum steps to reach ANY
 * charger (0 on a charger); -1 for shelves and for cells that cannot reach a charger.
 *
 * EXAMPLES
 * grid = ["C.#",
 *         "..#",
 *         "#.C"]   ->  [[0, 1, -1],
 *                       [1, 2, -1],
 *                       [-1, 1, 0]]
 * grid = ["..", ".."] (no charger) -> all -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= rows, cols <= 300 (up to 9 * 10^4 cells); there may be 0 or many chargers.
 * - Diagonal moves? (no) Can robots pass through chargers? (yes)
 *
 * PATTERN: multi-source BFS on a grid (graph traversal). Clues: "minimum steps",
 * "nearest of many targets", unit-cost moves.
 *
 * APPROACH 1 — Brute force   O(K * R * C) time, O(R * C) space   (K = number of chargers)
 * Run a BFS from every charger and keep the minimum distance per cell.
 *
 * APPROACH 2 — Optimal (multi-source BFS)   O(R * C) time, O(R * C) space
 * Put ALL chargers in the queue at distance 0, then run one BFS. BFS expands in rings of
 * equal distance, so the first time a cell is reached it is by its nearest charger.
 *
 * Dry run on the first example (queue starts with (0,0) and (2,2)):
 *   ring 0: (0,0), (2,2)
 *   ring 1: (0,1), (1,0) from (0,0); (2,1) from (2,2)
 *   ring 2: (1,1) from (0,1)  — already done when reached from (1,0) or (2,1)
 *   shelves and unreachable cells stay -1
 *
 * EDGE CASES
 * - no chargers -> every cell -1;  a charger walled in by shelves;  1x1 grid.
 */

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function bfsFrom(grid, sources) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  const queue = [];
  for (const [r, c] of sources) { dist[r][c] = 0; queue.push([r, c]); }
  let head = 0; // index pointer: shift() would make BFS O(n^2)
  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] === '#' || dist[nr][nc] !== -1) continue;
      dist[nr][nc] = dist[r][c] + 1; // mark when pushing, not when popping
      queue.push([nr, nc]);
    }
  }
  return dist;
}

function chargers(grid) {
  const out = [];
  for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[0].length; c++) if (grid[r][c] === 'C') out.push([r, c]);
  return out;
}

function bruteForce(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const best = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  for (const source of chargers(grid)) {
    const d = bfsFrom(grid, [source]);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (d[r][c] !== -1 && (best[r][c] === -1 || d[r][c] < best[r][c])) best[r][c] = d[r][c];
      }
    }
  }
  return best;
}

function optimal(grid) {
  return bfsFrom(grid, chargers(grid));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(['C.#', '..#', '#.C']), [[0, 1, -1], [1, 2, -1], [-1, 1, 0]]);
  assert.deepStrictEqual(solve(['..', '..']), [[-1, -1], [-1, -1]]);
  assert.deepStrictEqual(solve(['C']), [[0]]);
  assert.deepStrictEqual(solve(['C#.']), [[0, -1, -1]]);
  assert.deepStrictEqual(solve(['C...C']), [[0, 1, 2, 1, 0]]);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(6);
for (let t = 0; t < 200; t++) {
  const rows = 1 + Math.floor(rand() * 6);
  const cols = 1 + Math.floor(rand() * 6);
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => { const x = rand(); return x < 0.1 ? 'C' : x < 0.35 ? '#' : '.'; }).join(''));
  assert.deepStrictEqual(optimal(grid), bruteForce(grid));
}
console.log('✓ 06_nearest_charger passed');

module.exports = { optimal, bruteForce };
