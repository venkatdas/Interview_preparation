/**
 * 13. Surrounded Regions   (LeetCode 130 — Medium)
 *
 * PROBLEM
 * Board of 'X' and 'O'. Capture (flip to 'X') every region of 'O's that is completely
 * surrounded by 'X' - i.e. does NOT touch the border of the board. Modify in place.
 *
 * EXAMPLES
 * Input:            Output:
 *   X X X X           X X X X
 *   X O O X           X X X X
 *   X X O X           X X X X
 *   X O X X           X O X X     (the bottom O touches the border, it survives)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Does "touching the border" mean the O is ON the border cell? (yes)
 * - Diagonals? (no)
 *
 * APPROACH 1 — Brute force (DFS every region, check if it touches the border)
 *   O(m*n) time but with visited bookkeeping and a 2-step process per region.
 * For every unvisited 'O', DFS to collect the whole region and note whether any cell is
 * on the border. If none is, flip the collected cells.
 *
 * APPROACH 2 — Optimal (reverse thinking: DFS from the border)   O(m*n) time, O(m*n)
 * The Os that SURVIVE are exactly the ones connected to a border O. So:
 *   1. For every border cell that is 'O', DFS and mark its region as 'S' (safe).
 *   2. Scan the board: 'O' -> 'X' (captured), 'S' -> 'O' (restore).
 * No per-region bookkeeping, one simple flood fill from the edges.
 *
 * Dry run on the example:
 *   border Os: (3,1). DFS from it marks (3,1) = S (its neighbours are X).
 *   final scan: (1,1),(1,2),(2,2) are O -> X; (3,1) S -> O.
 *
 * EDGE CASES
 * - everything O -> nothing changes (all touch the border)
 * - 1 x n or n x 1 boards -> everything is on the border
 * - empty board
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(board) {
  const rows = board.length;
  if (!rows) return board;
  const cols = board[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== 'O' || visited[r][c]) continue;
      const region = [];
      let touchesBorder = false;
      const stack = [[r, c]];
      visited[r][c] = true;
      while (stack.length) {
        const [row, col] = stack.pop();
        region.push([row, col]);
        if (row === 0 || col === 0 || row === rows - 1 || col === cols - 1) touchesBorder = true;
        for (const [dr, dc] of DIRS) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (board[nr][nc] !== 'O' || visited[nr][nc]) continue;
          visited[nr][nc] = true;
          stack.push([nr, nc]);
        }
      }
      if (!touchesBorder) for (const [row, col] of region) board[row][col] = 'X';
    }
  }
  return board;
}

function optimal(board) {
  const rows = board.length;
  if (!rows) return board;
  const cols = board[0].length;

  function markSafe(row, col) {
    if (row < 0 || col < 0 || row >= rows || col >= cols || board[row][col] !== 'O') return;
    board[row][col] = 'S';
    for (const [dr, dc] of DIRS) markSafe(row + dr, col + dc);
  }

  // 1. start from every border cell
  for (let r = 0; r < rows; r++) { markSafe(r, 0); markSafe(r, cols - 1); }
  for (let c = 0; c < cols; c++) { markSafe(0, c); markSafe(rows - 1, c); }

  // 2. capture the rest, restore the safe ones
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'O') board[r][c] = 'X';
      else if (board[r][c] === 'S') board[r][c] = 'O';
    }
  }
  return board;
}

// ---------- tests ----------
const assert = require('assert');
const make = (rows) => rows.map((row) => row.split(''));
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    solve(make(['XXXX', 'XOOX', 'XXOX', 'XOXX'])),
    make(['XXXX', 'XXXX', 'XXXX', 'XOXX']),
  );
  assert.deepStrictEqual(solve(make(['X'])), make(['X']));
  assert.deepStrictEqual(solve(make(['OOO', 'OOO'])), make(['OOO', 'OOO']));
  assert.deepStrictEqual(solve(make(['XXX', 'XOX', 'XXX'])), make(['XXX', 'XXX', 'XXX']));
  assert.deepStrictEqual(solve(make(['OXO', 'XOX', 'OXO'])), make(['OXO', 'XXX', 'OXO']));
  assert.deepStrictEqual(solve([]), []);
}
console.log('✓ 13-surrounded-regions passed');

module.exports = { optimal, bruteForce };
