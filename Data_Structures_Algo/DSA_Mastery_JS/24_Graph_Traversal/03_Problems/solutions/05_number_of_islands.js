/**
 * 05. Number of Islands   (LeetCode 200 — Medium)
 *
 * PROBLEM
 * Given an m x n grid of '1' (land) and '0' (water), count the islands. An island is a
 * group of land cells connected horizontally or vertically, surrounded by water.
 * THE classic graph interview question.
 *
 * EXAMPLES
 * Input:
 *   1 1 0 0 0
 *   1 1 0 0 0
 *   0 0 1 0 0
 *   0 0 0 1 1
 * Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are diagonals connected? (no)
 * - May I modify the grid? (if not, use a visited matrix - shown in the BFS version)
 * - Values are characters '1'/'0' or numbers? (LeetCode: characters)
 *
 * APPROACH 1 — Brute force (BFS, no mutation, visited matrix)   O(m*n) time, O(m*n) space
 * Same complexity as the DFS version - there is no genuinely slower sensible approach -
 * but it uses a queue and a separate visited matrix, which is what you write when the
 * grid is read-only or very large (no recursion depth problem).
 *
 * APPROACH 2 — Optimal (DFS "sink the island")   O(m*n) time, O(m*n) space (recursion)
 *   1. Scan every cell.
 *   2. When you find a '1': count++ and DFS to turn that whole island into '0' ("sink" it),
 *      so it is never counted again.
 * Sinking is the visited mark; no extra memory besides the call stack.
 *
 * Dry run on
 *   1 1 0
 *   0 1 0
 *   0 0 1
 *   (0,0) is '1' -> count=1, sink: (0,0),(0,1),(1,1) become '0'
 *   scan on... (2,2) is '1' -> count=2, sink it
 *   answer 2
 *
 * EDGE CASES
 * - empty grid -> 0
 * - all water -> 0; all land -> 1
 * - single column / single row
 * - deep recursion on huge all-land grids -> prefer the BFS version
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(grid) {
  if (!grid.length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '1' || visited[r][c]) continue;
      count++;
      // BFS to mark this whole island visited
      const queue = [[r, c]];
      visited[r][c] = true;
      let head = 0;
      while (head < queue.length) {
        const [row, col] = queue[head++];
        for (const [dr, dc] of DIRS) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (grid[nr][nc] !== '1' || visited[nr][nc]) continue;
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return count;
}

function optimal(grid) {
  if (!grid.length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;

  function sink(row, col) {
    if (row < 0 || col < 0 || row >= rows || col >= cols) return;
    if (grid[row][col] !== '1') return;
    grid[row][col] = '0';                    // sink = visited
    for (const [dr, dc] of DIRS) sink(row + dr, col + dc);
  }

  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;                              // found a new island
        sink(r, c);                           // remove it so we never count it twice
      }
    }
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
const make = (rowsAsStrings) => rowsAsStrings.map((row) => row.split(''));
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(make(['11000', '11000', '00100', '00011'])), 3);
  assert.strictEqual(solve(make(['11110', '11010', '11000', '00000'])), 1);
  assert.strictEqual(solve(make(['110', '010', '001'])), 2);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve(make(['000', '000'])), 0);
  assert.strictEqual(solve(make(['111', '111'])), 1);
  assert.strictEqual(solve(make(['1', '0', '1'])), 2);
  assert.strictEqual(solve(make(['101', '010', '101'])), 5); // diagonals do not connect
}
console.log('✓ 05-number-of-islands passed');

module.exports = { optimal, bruteForce };
