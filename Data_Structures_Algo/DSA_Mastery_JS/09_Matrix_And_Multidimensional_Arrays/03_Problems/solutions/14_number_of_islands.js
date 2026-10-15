/**
 * 14. Number of Islands   (LeetCode 200 — Medium)
 *
 * PROBLEM
 * A grid of '1' (land) and '0' (water). An island is a group of '1's connected
 * horizontally or vertically (not diagonally). Count the islands.
 *
 * EXAMPLES
 * Input: [["1","1","0","0","0"],
 *         ["1","1","0","0","0"],
 *         ["0","0","1","0","0"],
 *         ["0","0","0","1","1"]]   Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 4-directional connectivity only? (yes)
 * - May I modify the grid? (usually yes; otherwise keep a visited set)
 * - Grid size up to 300x300 -> recursion depth up to 90k could overflow: use an explicit stack
 *
 * APPROACH 1 — Brute force (BFS with a visited set, grid untouched)   O(m n) time, O(m n) space
 * For every unvisited land cell, BFS to mark its whole island visited and count 1.
 * Same complexity as the optimal one; it just avoids mutating the input.
 *
 * APPROACH 2 — Optimal (DFS flood fill, sink the island)   O(m n) time, O(m n) worst-case stack
 * For every cell that is '1': count++, then DFS to turn every connected '1' into '0'
 * ("sink it") so it is never counted again. Each cell is visited at most a constant number
 * of times. Implemented iteratively with a stack to be safe on big grids.
 * This is "connected components" on the implicit grid graph - see 23_Graphs/.
 *
 * Dry run on the example:
 *   (0,0)='1' -> count 1, sink (0,0),(0,1),(1,0),(1,1)
 *   (2,2)='1' -> count 2, sink it
 *   (3,3)='1' -> count 3, sink (3,3),(3,4)   -> 3
 *
 * EDGE CASES
 * - all water -> 0
 * - all land -> 1
 * - diagonal-only touching -> separate islands
 * - empty grid -> 0
 */

const DIRS4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function bruteForce(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;
  const visited = new Set();
  const key = (r, c) => r * cols + c;
  let islands = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '1' || visited.has(key(r, c))) continue;
      islands++;
      const queue = [[r, c]];
      visited.add(key(r, c));
      for (let head = 0; head < queue.length; head++) {       // BFS (array as queue, head index)
        const [cr, cc] = queue[head];
        for (const [dr, dc] of DIRS4) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (grid[nr][nc] !== '1' || visited.has(key(nr, nc))) continue;
          visited.add(key(nr, nc));
          queue.push([nr, nc]);
        }
      }
    }
  }
  return islands;
}

function optimal(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;
  let islands = 0;

  function sink(startR, startC) {
    const stack = [[startR, startC]];
    grid[startR][startC] = '0';                       // mark on push, never on pop
    while (stack.length) {
      const [r, c] = stack.pop();
      for (const [dr, dc] of DIRS4) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
          grid[nr][nc] = '0';
          stack.push([nr, nc]);
        }
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islands++;
        sink(r, c);
      }
    }
  }
  return islands;
}

// ---------- tests ----------
const assert = require('assert');
const make = (strs) => strs.map((s) => s.split(''));
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(make(['11000', '11000', '00100', '00011'])), 3);
  assert.strictEqual(solve(make(['11110', '11010', '11000', '00000'])), 1);
  assert.strictEqual(solve(make(['000', '000'])), 0);
  assert.strictEqual(solve(make(['111', '111'])), 1);
  assert.strictEqual(solve(make(['10', '01'])), 2);     // diagonal does not connect
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve(make(['1'])), 1);
  assert.strictEqual(solve(make(['101', '010', '101'])), 5);
}
console.log('✓ 14-number-of-islands passed');

module.exports = { optimal, bruteForce };
