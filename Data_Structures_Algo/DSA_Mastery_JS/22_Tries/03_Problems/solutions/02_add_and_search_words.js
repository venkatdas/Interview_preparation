/**
 * 02. Design Add and Search Words Data Structure   (LeetCode 211 — Medium)
 *
 * PROBLEM
 * Design a class WordDictionary with:
 *   addWord(word)
 *   search(word) - word may contain '.', which matches ANY single letter.
 *
 * EXAMPLES
 * addWord("bad"), addWord("dad"), addWord("mad")
 * search("pad") -> false
 * search("bad") -> true
 * search(".ad") -> true    Explanation: '.' matches b, d or m
 * search("b..") -> true
 * search("b.")  -> false   Explanation: lengths differ
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can addWord contain '.'? (no, only search does)
 * - Max word length? (LeetCode: 25 — so backtracking depth is tiny)
 * - How many dots per query? (at most 2 on LeetCode, but solution handles any)
 *
 * APPROACH 1 — Brute force (list + regex-like compare)   search O(n * L)
 * Store words in an array. For each stored word of the same length, compare
 * char by char treating '.' as a wildcard.
 *
 * APPROACH 2 — Optimal (Trie + DFS backtracking on '.')   O(L) normal, O(26^dots * L) worst
 * Build a normal trie. search is recursive:
 *   - if char is a letter, follow that one child
 *   - if char is '.', try EVERY child; succeed if any branch succeeds
 *   - at the end of the word, the node must be isEnd
 *
 * Dry run: search(".ad") on trie with bad, dad, mad
 *   root has children b, d, m. '.' -> try each:
 *     b -> 'a' exists -> 'd' exists, isEnd -> true (stop, found)
 *
 * Dry run: search("b.")
 *   root -b-> (b). '.' -> try child 'a' -> end of query, (a).isEnd = false -> false
 *   no more children -> false
 *
 * EDGE CASES
 * - "...." longer than all words -> false (path runs out)
 * - "." with only empty structure -> false
 * - query is exactly a prefix -> false
 */

// ---------- brute force ----------
class BruteForceDictionary {
  constructor() { this.words = []; }
  addWord(word) { this.words.push(word); }
  search(query) {
    return this.words.some((w) => {
      if (w.length !== query.length) return false;
      for (let i = 0; i < w.length; i++) {
        if (query[i] !== '.' && query[i] !== w[i]) return false;
      }
      return true;
    });
  }
}

// ---------- optimal ----------
class WordDictionary {
  constructor() { this.root = { children: new Map(), isEnd: false }; }

  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isEnd: false });
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  search(query) {
    const dfs = (node, index) => {
      if (index === query.length) return node.isEnd;
      const ch = query[index];
      if (ch === '.') {
        // wildcard: any child could be the match, try them all
        for (const child of node.children.values()) {
          if (dfs(child, index + 1)) return true;
        }
        return false;
      }
      const child = node.children.get(ch);
      return child ? dfs(child, index + 1) : false;
    };
    return dfs(this.root, 0);
  }
}

function optimal() { return new WordDictionary(); }
function bruteForce() { return new BruteForceDictionary(); }

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const d = make();
  d.addWord('bad'); d.addWord('dad'); d.addWord('mad');
  assert.strictEqual(d.search('pad'), false);
  assert.strictEqual(d.search('bad'), true);
  assert.strictEqual(d.search('.ad'), true);
  assert.strictEqual(d.search('b..'), true);
  assert.strictEqual(d.search('b.'), false);
  assert.strictEqual(d.search('....'), false);
  assert.strictEqual(d.search('...'), true);
  assert.strictEqual(d.search('ba'), false);
  const empty = make();
  assert.strictEqual(empty.search('.'), false);
}
console.log('✓ 02-add-and-search-words passed');

module.exports = { optimal, bruteForce, WordDictionary };
