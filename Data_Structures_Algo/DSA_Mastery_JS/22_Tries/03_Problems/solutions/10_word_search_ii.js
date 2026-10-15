/**
 * 10. Word Search II   (LeetCode 212 — Hard)
 *
 * PROBLEM
 * Given an m x n board of letters and a list of words, return all words that
 * can be formed by a path of adjacent cells (up/down/left/right), using each
 * cell at most once per word.
 *
 * EXAMPLES
 * board = [["o","a","a","n"],
 *          ["e","t","a","e"],
 *          ["i","h","k","r"],
 *          ["i","f","l","v"]]
 * words = ["oath","pea","eat","rain"]   Output: ["oath","eat"]
 *
 * board = [["a","b"],["c","d"]], words = ["abcb"]   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Return order? (any order; we sort in tests)
 * - Can a word appear twice in the result? (no, each found once)
 * - Board up to 12x12, up to 30,000 words of length <= 10.
 *
 * APPROACH 1 — Brute force (DFS per word, like Word Search I)   O(W * m * n * 4^L)
 * For each word, run a backtracking search from every cell. 30,000 words times
 * a full board search is far too slow, but it is the natural starting point.
 *
 * APPROACH 2 — Optimal (Trie + ONE backtracking pass)   O(m * n * 4^L) time, O(total chars) space
 * Put all words in a trie. DFS from every cell, but move through the TRIE at
 * the same time as the board: only step onto a neighbour if the trie has that
 * letter as a child. When we reach a node with a stored word, add it to the
 * result and clear it (so it is not added twice). Mark visited cells by
 * temporarily writing '#' on the board, restore on the way back.
 * Pruning: after finishing a child with no children left, delete it from its
 * parent so later searches don't walk dead branches.
 *
 * Dry run (board above, word "eat"):
 *   start at (1,0) 'e': trie root has 'e' -> go. mark '#'.
 *     neighbour (1,1) 't'? node(e) has no 't'. neighbour (0,0) 'o'? no.
 *     neighbour (2,0) 'i'? no. Actually 'e' -> 'a' needed: (1,1) is 't'... try
 *     from (1,3) 'e': neighbour (0,3) 'n' no, (2,3) 'r' no, (1,2) 'a' yes!
 *       from 'a': neighbour (1,1) 't' yes -> node has word "eat" -> found.
 *
 * EDGE CASES
 * - word longer than number of cells -> never found
 * - a word that is a prefix of another ("oat","oath") -> both found
 * - single-cell board
 */

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function bruteForce(board, words) {
  const rows = board.length, cols = board[0].length;

  function exists(word) {
    function dfs(r, c, index) {
      if (index === word.length) return true;
      if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== word[index]) return false;
      const saved = board[r][c];
      board[r][c] = '#';
      const found = DIRS.some(([dr, dc]) => dfs(r + dr, c + dc, index + 1));
      board[r][c] = saved;
      return found;
    }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (dfs(r, c, 0)) return true;
    return false;
  }

  return words.filter(exists);
}

function optimal(board, words) {
  const root = { children: new Map(), word: null };
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), word: null });
      node = node.children.get(ch);
    }
    node.word = word; // store the full word at the end node (saves rebuilding it)
  }

  const rows = board.length, cols = board[0].length;
  const result = [];

  function dfs(r, c, parent) {
    const ch = board[r][c];
    const node = parent.children.get(ch);
    if (!node) return;

    if (node.word !== null) {
      result.push(node.word);
      node.word = null; // de-duplicate
    }

    board[r][c] = '#'; // visited marker
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && board[nr][nc] !== '#') dfs(nr, nc, node);
    }
    board[r][c] = ch; // restore

    // prune dead branch: nothing below and no word here anymore
    if (node.children.size === 0 && node.word === null) parent.children.delete(ch);
  }

  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) dfs(r, c, root);
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const board1 = () => [
  ['o', 'a', 'a', 'n'],
  ['e', 't', 'a', 'e'],
  ['i', 'h', 'k', 'r'],
  ['i', 'f', 'l', 'v'],
];
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(board1(), ['oath', 'pea', 'eat', 'rain']).sort(), ['eat', 'oath']);
  assert.deepStrictEqual(solve([['a', 'b'], ['c', 'd']], ['abcb']), []);
  assert.deepStrictEqual(solve([['a']], ['a', 'aa']), ['a']);
  assert.deepStrictEqual(solve(board1(), ['oat', 'oath']).sort(), ['oat', 'oath']);
  assert.deepStrictEqual(solve([['a', 'a']], ['aaa']), []);
  assert.deepStrictEqual(solve([['a', 'b'], ['c', 'd']], ['ab', 'cd', 'ac', 'bd', 'ad']).sort(), ['ab', 'ac', 'bd', 'cd']);
}
console.log('✓ 10-word-search-ii passed');

module.exports = { optimal, bruteForce };
