/**
 * 12. N-Queens   (LeetCode 51 — Hard)
 *
 * PROBLEM
 * Place n queens on an n x n chessboard so that no two queens attack each other
 * (same row, column, or diagonal). Return all distinct board configurations, each
 * as an array of strings where 'Q' is a queen and '.' is empty.
 *
 * EXAMPLES
 * Input: n = 4   Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
 * Input: n = 1   Output: [["Q"]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 9
 * - n = 2 and n = 3 have NO solutions -> return []
 * - Do they want all solutions, or just the count (N-Queens II)?
 *
 * APPROACH 1 — Brute force   O(n^n * n^2)
 * Every queen sits in its own row, so choose a column for each row: n^n boards.
 * For each full board, check every pair of queens for attacks. n=8: 16.7M boards.
 *
 * APPROACH 2 — Optimal (Backtracking row by row with attacked sets)   O(n!) time, O(n) space
 * Place queens one ROW at a time (so rows never clash). For row r, try every column c
 * and reject it in O(1) if:
 *   - column c already has a queen                      -> Set cols
 *   - diagonal (r - c) already has a queen              -> Set diag1  (same r - c = same "\" diagonal)
 *   - anti-diagonal (r + c) already has a queen         -> Set diag2  (same r + c = same "/" diagonal)
 * Choose: add to the three sets + record column. Explore row r + 1. Un-choose: remove.
 *
 * Why r - c and r + c? Walking down-right adds 1 to both r and c, so r - c stays constant.
 * Walking down-left adds 1 to r and subtracts 1 from c, so r + c stays constant.
 *
 * Dry run n=4 (queens[] = column chosen per row):
 *   row0 c=0 -> row1 c=0 col clash, c=1 diag clash, c=2 ok -> row2: c=0 diag(2-0=2 vs 0-0=0? no)
 *     ... all of row2 clashes -> back up; row1 c=3 ok -> row2 c=1 ok -> row3 all clash -> back up
 *   row0 c=1 -> row1 c=3 -> row2 c=0 -> row3 c=2 -> record ".Q..","...Q","Q...","..Q."
 *   row0 c=2 -> row1 c=0 -> row2 c=3 -> row3 c=1 -> record
 *   row0 c=3 -> no solution
 *
 * EDGE CASES
 * - n = 1 -> [["Q"]]
 * - n = 2, 3 -> []
 * - counts: n=4:2, 5:10, 6:4, 7:40, 8:92, 9:352
 */

function buildBoard(queens) {
  const n = queens.length;
  return queens.map((col) => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1));
}

function bruteForce(n) {
  const results = [];
  const queens = [];
  function isSafeBoard() {
    for (let i = 0; i < queens.length; i++) {
      for (let j = i + 1; j < queens.length; j++) {
        if (queens[i] === queens[j]) return false;                 // same column
        if (Math.abs(queens[i] - queens[j]) === j - i) return false; // same diagonal
      }
    }
    return true;
  }
  function go(row) {
    if (row === n) { if (isSafeBoard()) results.push(buildBoard(queens)); return; }
    for (let col = 0; col < n; col++) {
      queens.push(col);
      go(row + 1);
      queens.pop();
    }
  }
  go(0);
  return results;
}

function optimal(n) {
  const results = [];
  const queens = [];                 // queens[row] = column
  const cols = new Set();
  const diag1 = new Set();           // row - col
  const diag2 = new Set();           // row + col

  function go(row) {
    if (row === n) { results.push(buildBoard(queens)); return; }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue; // attacked
      cols.add(col); diag1.add(row - col); diag2.add(row + col); queens.push(col); // choose
      go(row + 1);                                                                 // explore
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col); queens.pop(); // un-choose
    }
  }

  go(0);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (list) => [...list].sort((a, b) => a.join('').localeCompare(b.join('')));

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve(4)),
    normalize([['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']]));
  assert.deepStrictEqual(solve(1), [['Q']]);
  assert.deepStrictEqual(solve(2), []);
  assert.deepStrictEqual(solve(3), []);
  assert.strictEqual(solve(5).length, 10);
  assert.strictEqual(solve(6).length, 4);
}
assert.strictEqual(optimal(8).length, 92);
assert.strictEqual(optimal(9).length, 352);
assert.deepStrictEqual(normalize(optimal(7)), normalize(bruteForce(7)));
console.log('✓ 12-n-queens passed');

module.exports = { optimal, bruteForce };
