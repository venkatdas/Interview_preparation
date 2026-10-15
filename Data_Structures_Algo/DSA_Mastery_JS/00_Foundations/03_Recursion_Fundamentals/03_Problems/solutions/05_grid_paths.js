/**
 * 05. Count Paths in a Small Grid   (Original — Medium)
 *
 * PROBLEM
 * A robot starts at the top-left cell (0, 0) of a grid and wants to reach the
 * bottom-right cell. It may only move RIGHT or DOWN. Some cells are blocked
 * (value 1); open cells are 0. Count the number of distinct paths. Also report how
 * many recursive calls were made, to see the recursion tree shrink with memoization.
 *
 * EXAMPLES
 * Input: [[0,0,0],
 *         [0,0,0]]          Output: 3   (RRD, RDR, DRR)
 * Input: [[0,0,0],
 *         [0,1,0],
 *         [0,0,0]]          Output: 2   (around the block either way)
 * Input: [[1]]              Output: 0   (start blocked)
 * Input: [[0]]              Output: 1   (already there)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Grid up to 15 x 15 -> naive recursion makes millions of calls; memo makes 225.
 * - Can start or end be blocked? (yes -> 0)
 * - Answer fits in a Number? (yes for 15 x 15: C(28,14) = 40,116,600)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^(r+c)) time, O(r+c) stack
 * paths(r, c) = number of ways from (r, c) to the end.
 *   out of grid or blocked -> 0
 *   at the end             -> 1
 *   otherwise              -> paths(r, c + 1) + paths(r + 1, c)
 * The recursion tree branches twice per level and has depth r + c.
 *
 * APPROACH 2 — Optimal (same recursion + memo)   O(r * c) time, O(r * c) space
 * Cell (r, c) is reached by MANY different call paths but its answer never changes,
 * so cache it in a Map keyed by "r,c" (or a 2D array). Each cell is computed once.
 *
 * Dry run 2 x 3 open grid (end = (1,2)):
 *   paths(1,2) = 1 (end)
 *   paths(1,1) = paths(1,2) + paths(2,1)=0 -> 1
 *   paths(1,0) = 1;  paths(0,2) = paths(0,3)=0 + paths(1,2) = 1
 *   paths(0,1) = paths(0,2) + paths(1,1) = 1 + 1 = 2
 *   paths(0,0) = paths(0,1) + paths(1,0) = 2 + 1 = 3
 *
 * EDGE CASES
 * - start blocked / end blocked -> 0
 * - 1 x 1 open grid -> 1
 * - a full blocked row -> 0
 * - empty grid [] -> 0
 *
 * COMMON MISTAKES
 * - Checking "at the end" before "blocked" (a blocked end would count as 1).
 * - Memo key collisions like r * 10 + c on grids wider than 10.
 * - Sharing a memo across different grids.
 */

function bruteForce(grid) {
  let calls = 0;
  const R = grid.length, C = R ? grid[0].length : 0;
  function paths(r, c) {
    calls++;
    if (r >= R || c >= C || grid[r][c] === 1) return 0;
    if (r === R - 1 && c === C - 1) return 1;
    return paths(r, c + 1) + paths(r + 1, c);
  }
  return { count: R ? paths(0, 0) : 0, calls };
}

function optimal(grid) {
  let calls = 0;
  const R = grid.length, C = R ? grid[0].length : 0;
  const memo = new Map();
  function paths(r, c) {
    calls++;
    if (r >= R || c >= C || grid[r][c] === 1) return 0;
    if (r === R - 1 && c === C - 1) return 1;
    const key = r * C + c; // unique because c < C
    if (memo.has(key)) return memo.get(key);
    const v = paths(r, c + 1) + paths(r + 1, c);
    memo.set(key, v);
    return v;
  }
  return { count: R ? paths(0, 0) : 0, calls };
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 0, 0], [0, 0, 0]]).count, 3);
  assert.strictEqual(solve([[0, 0, 0], [0, 1, 0], [0, 0, 0]]).count, 2);
  assert.strictEqual(solve([[1]]).count, 0);
  assert.strictEqual(solve([[0]]).count, 1);
  assert.strictEqual(solve([[0, 0], [0, 1]]).count, 0);
  assert.strictEqual(solve([]).count, 0);
}
const open = n => Array.from({ length: n }, () => new Array(n).fill(0));
const b = bruteForce(open(10)), o = optimal(open(10));
assert.strictEqual(b.count, 48620);           // C(18, 9)
assert.strictEqual(o.count, 48620);
assert.ok(b.calls > 100000 && o.calls < 300, 'memo collapses the recursion tree');
assert.strictEqual(optimal(open(15)).count, 40116600);
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(25);
for (let t = 0; t < 300; t++) {
  const R = 1 + Math.floor(rand() * 6), C = 1 + Math.floor(rand() * 6);
  const g = Array.from({ length: R }, () => Array.from({ length: C }, () => (rand() < 0.2 ? 1 : 0)));
  assert.strictEqual(optimal(g).count, bruteForce(g).count);
}
console.log('✓ 05_grid_paths passed');

module.exports = { optimal, bruteForce };
