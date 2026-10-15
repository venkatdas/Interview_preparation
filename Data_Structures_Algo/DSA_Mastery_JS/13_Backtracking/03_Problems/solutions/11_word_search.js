/**
 * 11. Word Search   (LeetCode 79 — Medium)
 *
 * PROBLEM
 * Given an m x n grid of letters and a word, return true if the word can be formed
 * by walking through adjacent cells (up/down/left/right). Each cell may be used once
 * per word.
 *
 * EXAMPLES
 * board = [["A","B","C","E"],
 *          ["S","F","C","S"],
 *          ["A","D","E","E"]]
 * Input: word = "ABCCED"   Output: true    (A->B->C->C->E->D snaking through the grid)
 * Input: word = "SEE"      Output: true
 * Input: word = "ABCB"     Output: false   (would need to reuse the B)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Diagonal moves? (no)
 * - Can I modify the board temporarily? (usually yes; otherwise keep a visited set)
 * - m, n <= 6, word length <= 15
 *
 * APPROACH 1 — Brute force   O(m*n * 4^L)
 * From every cell, DFS in all 4 directions without marking visited, carrying a
 * Set of visited "r,c" strings and copying it at each step. Works but copies the
 * set O(L) times per call.
 *
 * APPROACH 2 — Optimal (Grid DFS with mark/unmark)   O(m*n * 3^L) time, O(L) stack
 * For every cell that matches word[0], run dfs(row, col, index):
 *   - index === word.length -> found
 *   - out of bounds or letter mismatch -> false
 *   - mark the cell (board[r][c] = '#'), try the 4 neighbours with index + 1,
 *     restore the cell, return whether any neighbour succeeded.
 * The mark prevents reusing a cell; the restore is the "un-choose".
 * Branching is 3 (not 4) after the first step because we never go back where we came from.
 *
 * Dry run word="SEE" on the board above:
 *   start (1,0)='S': neighbours A,F,A -> no 'E' -> false
 *   start (1,3)='S': mark; down (2,3)='E' ok, index 1; mark; left (2,2)='E' ok, index 2
 *                    -> index === 3 -> true. Unmark on the way back up.
 *
 * EDGE CASES
 * - word longer than m*n -> false immediately
 * - single cell board, single letter word
 * - word with repeated letters needing different cells ("AAB" on a grid with one A)
 */

function bruteForce(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(row, col, index, visited) {
    if (index === word.length) return true;
    if (row < 0 || col < 0 || row >= rows || col >= cols) return false;
    if (visited.has(`${row},${col}`) || board[row][col] !== word[index]) return false;
    const nextVisited = new Set(visited);
    nextVisited.add(`${row},${col}`);
    return dfs(row + 1, col, index + 1, nextVisited) || dfs(row - 1, col, index + 1, nextVisited) ||
           dfs(row, col + 1, index + 1, nextVisited) || dfs(row, col - 1, index + 1, nextVisited);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0, new Set())) return true;
    }
  }
  return false;
}

function optimal(board, word) {
  const rows = board.length, cols = board[0].length;
  if (word.length > rows * cols) return false;

  function dfs(row, col, index) {
    if (index === word.length) return true;                       // every letter matched
    if (row < 0 || col < 0 || row >= rows || col >= cols) return false;
    if (board[row][col] !== word[index]) return false;            // '#' never matches: visited

    const saved = board[row][col];
    board[row][col] = '#';                                        // choose (mark visited)
    const found =
      dfs(row + 1, col, index + 1) || dfs(row - 1, col, index + 1) ||
      dfs(row, col + 1, index + 1) || dfs(row, col - 1, index + 1);
    board[row][col] = saved;                                      // un-choose (restore)
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
const makeBoard = () => [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']];

for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(makeBoard(), 'ABCCED'), true);
  assert.strictEqual(solve(makeBoard(), 'SEE'), true);
  assert.strictEqual(solve(makeBoard(), 'ABCB'), false);
  assert.strictEqual(solve([['a']], 'a'), true);
  assert.strictEqual(solve([['a']], 'b'), false);
  assert.strictEqual(solve([['a', 'b']], 'abc'), false);           // longer than the grid
  assert.strictEqual(solve([['a', 'a']], 'aaa'), false);           // would reuse a cell
  assert.strictEqual(solve([['C', 'A', 'A'], ['A', 'A', 'A'], ['B', 'C', 'D']], 'AAB'), true);
}
const board = makeBoard();
optimal(board, 'ABCCED');
assert.deepStrictEqual(board, makeBoard());                        // board restored after search
console.log('✓ 11-word-search passed');

module.exports = { optimal, bruteForce };
