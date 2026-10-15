/**
 * 15. Word Search   (LeetCode 79 — Medium)
 *
 * PROBLEM
 * Given an m x n board of letters and a word, return true if the word can be formed by a
 * path of horizontally or vertically adjacent cells, using each cell at most once.
 *
 * EXAMPLES
 * board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
 * word = "ABCCED"   Output: true
 * word = "SEE"      Output: true
 * word = "ABCB"     Output: false   Explanation: B cannot be reused
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Diagonal moves? (no)
 * - Can I mark the board temporarily? (yes, as long as I restore it)
 * - Board up to 6x6, word up to 15 chars -> exponential backtracking is fine
 *
 * APPROACH 1 — Brute force (try every path with a visited Set, no board mutation)   O(m n * 3^L) time, O(L) space
 * From every cell, DFS matching the word letter by letter, tracking visited cells in a Set.
 * Same search as the optimal, just slower bookkeeping.
 *
 * APPROACH 2 — Optimal (backtracking with in-place marking)   O(m n * 3^L) time, O(L) recursion
 * Start a DFS from every cell whose letter matches word[0]. At each step, if the current cell
 * matches word[index], temporarily overwrite it with '#' (so it cannot be reused), try the
 * four neighbours for index + 1, then restore the letter. The 3^L bound: after the first
 * step each cell has at most 3 unvisited neighbours.
 * Pruning that interviewers like: bail early if the board does not contain enough of each
 * letter, or search from the rarer end of the word.
 *
 * Dry run for "SEE": start at (1,3)='S' -> (2,3)='E' -> (2,2)='E' -> index 3 == length -> true
 *
 * EDGE CASES
 * - word longer than the number of cells -> false
 * - single-letter word
 * - word requires revisiting a cell ("ABCB") -> false
 */

const DIRS4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function bruteForce(board, word) {
  const rows = board.length, cols = board[0].length;
  const visited = new Set();
  function dfs(r, c, index) {
    if (index === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    const key = r * cols + c;
    if (visited.has(key) || board[r][c] !== word[index]) return false;
    visited.add(key);
    const found = DIRS4.some(([dr, dc]) => dfs(r + dr, c + dc, index + 1));
    visited.delete(key);
    return found;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (dfs(r, c, 0)) return true;
  return false;
}

function optimal(board, word) {
  const rows = board.length, cols = board[0].length;
  if (word.length > rows * cols) return false;

  function dfs(r, c, index) {
    if (index === word.length) return true;                       // matched every letter
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r][c] !== word[index]) return false;                // '#' never matches, so visited cells are skipped

    const letter = board[r][c];
    board[r][c] = '#';                                            // mark as used on this path
    const found =
      dfs(r + 1, c, index + 1) || dfs(r - 1, c, index + 1) ||
      dfs(r, c + 1, index + 1) || dfs(r, c - 1, index + 1);
    board[r][c] = letter;                                         // backtrack: restore
    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === word[0] && dfs(r, c, 0)) return true;
    }
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
const board = () => [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(board(), 'ABCCED'), true);
  assert.strictEqual(solve(board(), 'SEE'), true);
  assert.strictEqual(solve(board(), 'ABCB'), false);
  assert.strictEqual(solve(board(), 'A'), true);
  assert.strictEqual(solve(board(), 'Z'), false);
  assert.strictEqual(solve(board(), 'ABCCEDAS'), true);   // winds through 8 of the 12 cells
  assert.strictEqual(solve(board(), 'ABCESEEEFS'), false); // only two E's are reachable in a row
  assert.strictEqual(solve([['a']], 'ab'), false);
  const b = board();
  solve(b, 'ABCCED');
  assert.deepStrictEqual(b, board());            // board restored after search
}
console.log('✓ 15-word-search passed');

module.exports = { optimal, bruteForce };
