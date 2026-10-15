/**
 * 12. Valid Sudoku   (LeetCode 36 — Medium)
 *
 * PROBLEM
 * A 9x9 board holds digits '1'-'9' or '.' for empty. Return true if the FILLED cells are
 * valid: no digit repeats in any row, any column, or any of the nine 3x3 boxes.
 * (The board does not have to be solvable.)
 *
 * EXAMPLES
 * Input: the classic LeetCode board   Output: true
 * Same board with board[0][0] = '8'   Output: false   Explanation: two 8s in the top-left box
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Always 9x9? (yes)
 * - Only '.' and '1'-'9'? (yes)
 *
 * APPROACH 1 — Brute force   O(81 * 9) time, O(9) space
 * Check each of the 9 rows, 9 columns, and 9 boxes separately with a fresh Set each time.
 * Three separate loops; 27 scans of 9 cells.
 *
 * APPROACH 2 — Optimal (one pass, three arrays of Sets)   O(81) time, O(81) space
 * Walk every cell once. Keep rows[9], cols[9], boxes[9] as Sets. The box index for cell
 * (r, c) is Math.floor(r / 3) * 3 + Math.floor(c / 3):
 *   boxes:  0 1 2
 *           3 4 5
 *           6 7 8
 * If a digit is already in its row, column, or box set -> false. Else add it to all three.
 * (A bitmask per row/col/box - 9 bits each - replaces the Sets; see 14_Bit_Manipulation/.)
 *
 * Dry run (first few cells of row 0: '5','3','.','.','7'):
 *   (0,0)='5': rows[0]={5} cols[0]={5} boxes[0]={5}
 *   (0,1)='3': rows[0]={5,3} cols[1]={3} boxes[0]={5,3}
 *   (0,4)='7': rows[0]={5,3,7} cols[4]={7} boxes[1]={7}   ... continue
 *
 * EDGE CASES
 * - completely empty board -> true
 * - duplicate only within a box (different rows and columns) -> false (easy to miss)
 */

const VALID_BOARD = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];

function bruteForce(board) {
  function noDuplicates(cells) {
    const seen = new Set();
    for (const value of cells) {
      if (value === '.') continue;
      if (seen.has(value)) return false;
      seen.add(value);
    }
    return true;
  }
  for (let i = 0; i < 9; i++) {
    const row = board[i];
    const col = board.map((r) => r[i]);
    const box = [];
    const r0 = Math.floor(i / 3) * 3, c0 = (i % 3) * 3;
    for (let r = r0; r < r0 + 3; r++) for (let c = c0; c < c0 + 3; c++) box.push(board[r][c]);
    if (!noDuplicates(row) || !noDuplicates(col) || !noDuplicates(box)) return false;
  }
  return true;
}

function optimal(board) {
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = board[r][c];
      if (value === '.') continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3); // which 3x3 box
      if (rows[r].has(value) || cols[c].has(value) || boxes[b].has(value)) return false;
      rows[r].add(value);
      cols[c].add(value);
      boxes[b].add(value);
    }
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
const cloneBoard = (b) => b.map((row) => row.slice());
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(VALID_BOARD), true);

  const rowDup = cloneBoard(VALID_BOARD); rowDup[0][2] = '5';          // two 5s in row 0
  assert.strictEqual(solve(rowDup), false);

  const colDup = cloneBoard(VALID_BOARD); colDup[8][0] = '8';          // two 8s in column 0
  assert.strictEqual(solve(colDup), false);

  const boxDup = cloneBoard(VALID_BOARD); boxDup[0][0] = '8';          // two 8s in box 0
  assert.strictEqual(solve(boxDup), false);

  const empty = Array.from({ length: 9 }, () => new Array(9).fill('.'));
  assert.strictEqual(solve(empty), true);

  // a box-only duplicate: different row and column, same box
  const boxOnly = cloneBoard(empty); boxOnly[0][0] = '1'; boxOnly[1][1] = '1';
  assert.strictEqual(solve(boxOnly), false);
}
console.log('✓ 12-valid-sudoku passed');

module.exports = { optimal, bruteForce };
