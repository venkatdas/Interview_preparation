/**
 * 13. Sudoku Solver   (LeetCode 37 — Hard)
 *
 * PROBLEM
 * Fill a 9x9 board (array of arrays of single-character strings, '.' = empty) so that
 * every row, every column and every 3x3 box contains the digits 1-9 exactly once.
 * Modify the board in place. The puzzle is guaranteed to have exactly one solution.
 *
 * EXAMPLES
 * Input: a standard puzzle with ~30 givens   Output: the completed grid (see tests)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly one solution? (yes) Should I return it or fill in place? (in place)
 * - Is the given board valid? (yes)
 *
 * APPROACH 1 — Brute force   O(9^(empty cells)) with slow O(27) validity checks
 * Find the first empty cell, try digits 1-9, check row/col/box by scanning them,
 * recurse. Same search tree as optimal but each check costs 27 lookups.
 *
 * APPROACH 2 — Optimal (Backtracking with "find one" early return + O(1) checks)
 *   O(9^(empty cells)) worst, far less in practice; O(81) stack
 * Keep three arrays of Sets: rowsUsed[r], colsUsed[c], boxesUsed[b] with b = 3*floor(r/3) + floor(c/3).
 * Pre-fill them from the givens. solve(cellIndex):
 *   - cellIndex === 81 -> all filled -> return true
 *   - cell not empty  -> solve(cellIndex + 1)
 *   - for d in 1..9: if d is free in row, col and box: place it (choose), if solve(next)
 *     returns true -> return true immediately (do NOT undo, we want to keep it),
 *     else remove it (un-choose).
 *   - no digit worked -> return false (makes the caller try its next digit)
 *
 * Dry run (tiny): row 0 = "53..7...." -> cell (0,2) is empty; 1 free? yes -> place 1 and go on.
 * Deep inside, if some cell has no legal digit, we return false up the chain until a
 * previous cell tries its next digit. Eventually (0,2) ends up as 4 in the solution.
 *
 * EDGE CASES
 * - Already-complete board -> returns true without changes
 * - A board with no solution -> returns false (board restored)
 */

function boxIndex(row, col) {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function bruteForce(board) {
  function canPlace(row, col, digit) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === digit) return false;
      if (board[i][col] === digit) return false;
      const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
      const boxCol = Math.floor(col / 3) * 3 + (i % 3);
      if (board[boxRow][boxCol] === digit) return false;
    }
    return true;
  }
  function solve() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== '.') continue;
        for (let d = 1; d <= 9; d++) {
          const digit = String(d);
          if (!canPlace(row, col, digit)) continue;
          board[row][col] = digit;
          if (solve()) return true;
          board[row][col] = '.';
        }
        return false;              // this empty cell has no legal digit
      }
    }
    return true;                   // no empty cell left
  }
  return solve();
}

function optimal(board) {
  const rowsUsed = Array.from({ length: 9 }, () => new Set());
  const colsUsed = Array.from({ length: 9 }, () => new Set());
  const boxesUsed = Array.from({ length: 9 }, () => new Set());

  // seed the sets with the givens
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const ch = board[r][c];
      if (ch === '.') continue;
      rowsUsed[r].add(ch); colsUsed[c].add(ch); boxesUsed[boxIndex(r, c)].add(ch);
    }
  }

  function solve(cell) {
    if (cell === 81) return true;                      // every cell filled
    const row = Math.floor(cell / 9), col = cell % 9;
    if (board[row][col] !== '.') return solve(cell + 1); // given: skip
    const box = boxIndex(row, col);
    for (let d = 1; d <= 9; d++) {
      const digit = String(d);
      if (rowsUsed[row].has(digit) || colsUsed[col].has(digit) || boxesUsed[box].has(digit)) continue;
      board[row][col] = digit;                          // choose
      rowsUsed[row].add(digit); colsUsed[col].add(digit); boxesUsed[box].add(digit);
      if (solve(cell + 1)) return true;                 // found: stop, keep the digit
      board[row][col] = '.';                            // un-choose
      rowsUsed[row].delete(digit); colsUsed[col].delete(digit); boxesUsed[box].delete(digit);
    }
    return false;                                       // dead end
  }

  return solve(0);
}

// ---------- tests ----------
const assert = require('assert');
const puzzle = [
  '53..7....', '6..195...', '.98....6.',
  '8...6...3', '4..8.3..1', '7...2...6',
  '.6....28.', '...419..5', '....8..79',
];
const solution = [
  '534678912', '672195348', '198342567',
  '859761423', '426853791', '713924856',
  '961537284', '287419635', '345286179',
];
const toGrid = (rows) => rows.map((r) => r.split(''));

for (const solve of [bruteForce, optimal]) {
  const board = toGrid(puzzle);
  assert.strictEqual(solve(board), true);
  assert.deepStrictEqual(board.map((r) => r.join('')), solution);

  const done = toGrid(solution);
  assert.strictEqual(solve(done), true);                 // already solved stays solved
  assert.deepStrictEqual(done.map((r) => r.join('')), solution);

  const impossible = toGrid(puzzle);
  impossible[0][2] = '5';                                 // two 5s in row 0 -> unsolvable
  assert.strictEqual(solve(impossible), false);
}
console.log('✓ 13-sudoku-solver passed');

module.exports = { optimal, bruteForce };
