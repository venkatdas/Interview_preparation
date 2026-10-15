/**
 * 16. Zigzag Conversion   (LeetCode 6 — Medium)
 *
 * PROBLEM
 * Write the string in a zigzag pattern over numRows rows (down the first column, then
 * diagonally up to the top, then down again...), then read the rows left to right, top
 * to bottom, and return that string.
 *
 * EXAMPLES
 * Input: s = "PAYPALISHIRING", numRows = 3   Output: "PAHNAPLSIIGYIR"
 *   P   A   H   N
 *   A P L S I I G
 *   Y   I   R
 * Input: s = "PAYPALISHIRING", numRows = 4   Output: "PINALSIGYAHRPI"
 *   P     I    N
 *   A   L S  I G
 *   Y A   H R
 *   P     I
 * Input: s = "A", numRows = 1   Output: "A"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - numRows = 1? (no zigzag, return s unchanged; also when numRows >= s.length)
 * - Do we need the actual grid? (no, only the row strings)
 *
 * APPROACH 1 — Brute force   O(n * numRows) time, O(n * numRows) space
 * Actually build a 2D grid of characters, walk it with (row, col) following the zigzag,
 * then read row by row skipping empty cells. Works, but wastes space on empty cells.
 *
 * APPROACH 2 — Optimal (row buckets with a bouncing direction)   O(n) time, O(n) space
 * We only need which ROW each character lands in, not the column. Keep one array per
 * row. Walk the string with a `row` index that moves down until it hits the bottom,
 * then up until it hits the top, flipping direction at the edges. Append each character
 * to its row. Finally join the rows.
 * (Math variant: characters in row 0 and row numRows-1 are every cycle = 2*(numRows-1)
 * apart; middle rows get two characters per cycle. Same complexity, trickier to get right.)
 *
 * Dry run on "PAYPALIS", numRows=3:
 *   P row0 (down)   A row1   Y row2 (hit bottom, flip)   P row1   A row0 (hit top, flip)
 *   L row1   I row2 (flip)   S row1
 *   rows: ["PA", "APLS", "YI"] -> "PAAPLSYI"
 *
 * EDGE CASES
 * - numRows = 1      -> s (would otherwise divide by zero in the math variant)
 * - numRows >= n     -> s (every char in its own row, read in order)
 * - ""               -> ""
 */

function bruteForce(s, numRows) {
  if (numRows === 1 || numRows >= s.length) return s;
  const grid = [];
  let row = 0;
  let col = 0;
  let goingDown = true;
  for (const ch of s) {
    if (!grid[row]) grid[row] = [];
    grid[row][col] = ch;
    if (goingDown) {
      if (row === numRows - 1) { goingDown = false; row--; col++; } // start diagonal
      else row++;
    } else {
      if (row === 0) { goingDown = true; row++; }                  // start next column
      else { row--; col++; }
    }
  }
  const out = [];
  for (let r = 0; r < numRows; r++) {
    for (const ch of grid[r] || []) if (ch !== undefined) out.push(ch);
  }
  return out.join('');
}

function optimal(s, numRows) {
  if (numRows === 1 || numRows >= s.length) return s;

  const rows = Array.from({ length: numRows }, () => []);
  let row = 0;
  let step = 1; // +1 moving down, -1 moving up

  for (const ch of s) {
    rows[row].push(ch);
    // bounce at the top and bottom rows
    if (row === 0) step = 1;
    else if (row === numRows - 1) step = -1;
    row += step;
  }
  return rows.map((chars) => chars.join('')).join('');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('PAYPALISHIRING', 3), 'PAHNAPLSIIGYIR');
  assert.strictEqual(solve('PAYPALISHIRING', 4), 'PINALSIGYAHRPI');
  assert.strictEqual(solve('A', 1), 'A');
  assert.strictEqual(solve('AB', 1), 'AB');
  assert.strictEqual(solve('ABC', 5), 'ABC');
  assert.strictEqual(solve('', 3), '');
  assert.strictEqual(solve('PAYPALIS', 3), 'PAAPLSYI');
  assert.strictEqual(solve('ABCD', 2), 'ACBD');
}
console.log('✓ 16-zigzag-conversion passed');

module.exports = { optimal, bruteForce };
