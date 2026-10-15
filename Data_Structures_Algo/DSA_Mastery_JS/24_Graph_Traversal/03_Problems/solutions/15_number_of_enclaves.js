/**
 * 15. Number of Enclaves   (LeetCode 1020 — Medium)
 *
 * PROBLEM
 * Grid of 0 (sea) and 1 (land). You can walk between 4-adjacent land cells and walk off
 * the grid from any border cell. Return the number of land cells from which you CANNOT
 * walk off the grid (they are enclosed by water).
 *
 * EXAMPLES
 * Input: [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]   Output: 3
 * Explanation: the (1,0) cell is on the border; the three cells (1,2),(2,1),(2,2) are enclosed.
 * Input: [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]   Output: 0  (all land touches the border)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Mutate the grid? (yes)
 * - Diagonals? (no)
 *
 * APPROACH 1 — Brute force (DFS each land region, check border)   O(m*n) with bookkeeping
 * Same as Surrounded Regions brute force: collect each region, if it never touches the
 * border add its size.
 *
 * APPROACH 2 — Optimal (reverse: sink everything reachable from the border)
 *   O(m*n) time, O(m*n) space
 *   1. DFS from every border land cell, turning the land into 0 (those cells can escape).
 *   2. Count the remaining 1s - they are the enclaves.
 *
 * Dry run on example 1:
 *   border land: (1,0). sink it (its neighbours are sea). Remaining 1s: (1,2),(2,1),(2,2) = 3.
 *
 * EDGE CASES
 * - all land -> 0 (every region touches the border)
 * - no land -> 0
 * - land only in the middle -> that count
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let enclaves = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1 || visited[r][c]) continue;
      let size = 0;
      let touchesBorder = false;
      const stack = [[r, c]];
      visited[r][c] = true;
      while (stack.length) {
        const [row, col] = stack.pop();
        size++;
        if (row === 0 || col === 0 || row === rows - 1 || col === cols - 1) touchesBorder = true;
        for (const [dr, dc] of DIRS) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (grid[nr][nc] !== 1 || visited[nr][nc]) continue;
          visited[nr][nc] = true;
          stack.push([nr, nc]);
        }
      }
      if (!touchesBorder) enclaves += size;
    }
  }
  return enclaves;
}

function optimal(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  function sink(row, col) {
    if (row < 0 || col < 0 || row >= rows || col >= cols || grid[row][col] !== 1) return;
    grid[row][col] = 0;
    for (const [dr, dc] of DIRS) sink(row + dr, col + dc);
  }

  for (let r = 0; r < rows; r++) { sink(r, 0); sink(r, cols - 1); }
  for (let c = 0; c < cols; c++) { sink(0, c); sink(rows - 1, c); }

  let count = 0;
  for (const row of grid) for (const cell of row) if (cell === 1) count++;
  return count;
}

// ---------- tests ----------
const assert = require('assert');
const clone = (g) => g.map((row) => [...row]);
const cases = [
  [[[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], 3],
  [[[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]], 0],
  [[[1, 1], [1, 1]], 0],
  [[[0, 0], [0, 0]], 0],
  [[[0, 0, 0], [0, 1, 0], [0, 0, 0]], 1],
  [[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]], 3],
];
for (const solve of [bruteForce, optimal]) {
  for (const [grid, expected] of cases) assert.strictEqual(solve(clone(grid)), expected);
}
console.log('✓ 15-number-of-enclaves passed');

module.exports = { optimal, bruteForce };
