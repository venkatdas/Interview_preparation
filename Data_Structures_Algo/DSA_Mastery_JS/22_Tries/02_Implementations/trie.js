/**
 * Trie (prefix tree) in JavaScript.
 *
 * A trie stores strings character by character. Each node has:
 *   - children : Map<char, TrieNode>   (Map keeps it generic: any alphabet)
 *   - isEnd    : true if a word ends exactly at this node
 *   - count    : how many inserted words pass through this node
 *                (lets countWordsWithPrefix answer in O(prefix length))
 *
 * Every operation costs O(L) where L is the length of the word/prefix.
 * The size of the dictionary does NOT matter - that is the whole point.
 */

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
    this.count = 0; // words passing through this node (including ones ending here)
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Walk down one char at a time, creating nodes that do not exist yet.
  insert(word) {
    // Inserting a word that is already stored must not bump the prefix counts again,
    // otherwise countWordsWithPrefix would count the same word twice.
    if (this.search(word)) return this;
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
      node.count++;
    }
    node.isEnd = true;
    return this;
  }

  // Helper: follow the path for `str`. Returns the last node or null if the path breaks.
  #findNode(str) {
    let node = this.root;
    for (const ch of str) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  // Exact word match: path must exist AND end flag must be set.
  search(word) {
    const node = this.#findNode(word);
    return node !== null && node.isEnd;
  }

  // Prefix match: only the path needs to exist.
  startsWith(prefix) {
    return this.#findNode(prefix) !== null;
  }

  // How many inserted words start with `prefix`.
  countWordsWithPrefix(prefix) {
    const node = this.#findNode(prefix);
    return node ? node.count : 0;
  }

  // All words that start with `prefix`, in sorted-by-insertion-path order
  // (sorted alphabetically if you sort the Map keys - see search-suggestions problem).
  collectWordsWithPrefix(prefix) {
    const start = this.#findNode(prefix);
    const words = [];
    if (!start) return words;

    // DFS from the prefix node, building the word as we go.
    function dfs(node, path) {
      if (node.isEnd) words.push(path);
      for (const [ch, child] of node.children) dfs(child, path + ch);
    }
    dfs(start, prefix);
    return words;
  }

  // Delete a word. Returns true if it was present.
  // We walk down recursively, unset isEnd at the bottom, and on the way back up
  // remove child nodes that are now useless (no children, not end of a word).
  delete(word) {
    if (!this.search(word)) return false;

    const removeFrom = (node, depth) => {
      if (depth === word.length) {
        node.isEnd = false;
      } else {
        const ch = word[depth];
        const child = node.children.get(ch);
        child.count--;
        removeFrom(child, depth + 1);
        // prune: child has no words below it and is not a word itself
        if (child.children.size === 0 && !child.isEnd) node.children.delete(ch);
      }
    };
    removeFrom(this.root, 0);
    return true;
  }
}

// ---------- self-test ----------
// Only runs when executed directly (node trie.js), not when required by a problem file.
if (require.main === module) {
const assert = require('assert');

const trie = new Trie();
trie.insert('apple').insert('app').insert('apply').insert('bat');

assert.strictEqual(trie.search('apple'), true);
assert.strictEqual(trie.search('app'), true);
assert.strictEqual(trie.search('ap'), false);      // prefix only, not a word
assert.strictEqual(trie.search('banana'), false);
assert.strictEqual(trie.startsWith('ap'), true);
assert.strictEqual(trie.startsWith('ba'), true);
assert.strictEqual(trie.startsWith('c'), false);
assert.strictEqual(trie.startsWith(''), true);     // empty prefix matches everything

assert.strictEqual(trie.countWordsWithPrefix('app'), 3);
assert.strictEqual(trie.countWordsWithPrefix('appl'), 2);
assert.strictEqual(trie.countWordsWithPrefix('x'), 0);
assert.deepStrictEqual(trie.collectWordsWithPrefix('app').sort(), ['app', 'apple', 'apply']);
assert.deepStrictEqual(trie.collectWordsWithPrefix('zzz'), []);

// delete
assert.strictEqual(trie.delete('apple'), true);
assert.strictEqual(trie.search('apple'), false);
assert.strictEqual(trie.search('app'), true);       // shorter word survives
assert.strictEqual(trie.search('apply'), true);     // sibling branch survives
assert.strictEqual(trie.countWordsWithPrefix('app'), 2);
assert.strictEqual(trie.delete('apple'), false);    // already gone
assert.strictEqual(trie.delete('bat'), true);
assert.strictEqual(trie.startsWith('b'), false);    // whole branch pruned
assert.strictEqual(trie.root.children.has('b'), false);

console.log('✓ trie.js self-test passed');
}

module.exports = { Trie, TrieNode };
