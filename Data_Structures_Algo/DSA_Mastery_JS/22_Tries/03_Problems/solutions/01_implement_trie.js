/**
 * 01. Implement Trie (Prefix Tree)   (LeetCode 208 — Medium)
 *
 * PROBLEM
 * Design a class Trie with three methods:
 *   insert(word)       - add a word
 *   search(word)       - true if exactly this word was inserted
 *   startsWith(prefix) - true if some inserted word starts with prefix
 *
 * EXAMPLES
 * insert("apple"); search("apple") -> true; search("app") -> false;
 * startsWith("app") -> true; insert("app"); search("app") -> true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only lowercase a-z? (yes on LeetCode; a Map handles any alphabet anyway)
 * - Can the same word be inserted twice? (yes, it is a no-op)
 * - Empty string? (startsWith("") is true; search("") is false unless inserted)
 *
 * APPROACH 1 — Brute force (array of words)   insert O(1), search O(n), startsWith O(n*L)
 * Keep all words in an array. search = includes, startsWith = loop and check
 * each word's prefix. Works, but every query scans the whole dictionary.
 *
 * APPROACH 2 — Optimal (Trie)   O(L) per operation, O(total characters) space
 * Each node has a Map of children and an isEnd flag.
 *   insert: walk char by char, create missing nodes, mark the last node isEnd.
 *   search: walk; if a char is missing -> false; at the end return isEnd.
 *   startsWith: walk; return true if we never fell off the path.
 *
 * Dry run: insert("app"), insert("apple")
 *   root -a-> (a) -p-> (p) -p-> (p, isEnd)
 *                                  -l-> (l) -e-> (e, isEnd)
 *   search("app")   : a,p,p exist, node.isEnd = true  -> true
 *   search("ap")    : a,p exist, node.isEnd = false    -> false
 *   startsWith("ap"): a,p exist                        -> true
 *   search("apx")   : 'x' missing under (p)            -> false
 *
 * EDGE CASES
 * - search a prefix of an inserted word -> false (isEnd flag matters)
 * - search a longer word than any inserted -> false (path breaks)
 * - insert same word twice -> still works
 */

// ---------- brute force: plain array ----------
class BruteForceTrie {
  constructor() { this.words = []; }
  insert(word) { if (!this.words.includes(word)) this.words.push(word); }
  search(word) { return this.words.includes(word); }
  startsWith(prefix) { return this.words.some((w) => w.startsWith(prefix)); }
}

// ---------- optimal: real trie ----------
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  // shared walker: returns the node where `str` ends, or null if the path breaks
  findNode(str) {
    let node = this.root;
    for (const ch of str) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix) {
    return this.findNode(prefix) !== null;
  }
}

function optimal() { return new Trie(); }
function bruteForce() { return new BruteForceTrie(); }

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const t = make();
  t.insert('apple');
  assert.strictEqual(t.search('apple'), true);
  assert.strictEqual(t.search('app'), false);
  assert.strictEqual(t.startsWith('app'), true);
  t.insert('app');
  assert.strictEqual(t.search('app'), true);
  assert.strictEqual(t.search('apx'), false);
  assert.strictEqual(t.search('applepie'), false);
  assert.strictEqual(t.startsWith(''), true);
  assert.strictEqual(t.search(''), false);
  t.insert('apple'); // duplicate insert
  assert.strictEqual(t.search('apple'), true);
}
console.log('✓ 01-implement-trie passed');

module.exports = { optimal, bruteForce, Trie, TrieNode };
