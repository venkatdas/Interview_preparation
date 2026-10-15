/**
 * 06. Implement Magic Dictionary   (LeetCode 676 — Medium)
 *
 * PROBLEM
 * Design a class MagicDictionary:
 *   buildDict(words)    - store a list of distinct words
 *   search(searchWord)  - true if you can change EXACTLY ONE letter of
 *                         searchWord to get a word in the dictionary.
 *
 * EXAMPLES
 * buildDict(["hello","leetcode"])
 * search("hello")   -> false  Explanation: must change exactly one letter
 * search("hhllo")   -> true   Explanation: hhllo -> hello
 * search("hell")    -> false  Explanation: lengths differ
 * search("leetcoded") -> false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly one change, not zero and not two? (exactly one)
 * - Lowercase only? (yes)
 * - Is the dictionary built once? (yes, then many searches)
 *
 * APPROACH 1 — Brute force   O(n * L) per search
 * For every dictionary word with the same length, count differing positions;
 * true if some word differs in exactly 1 position.
 *
 * APPROACH 2 — Optimal (Trie + DFS with a "changes left" budget)   O(26 * L) worst per search
 * Build a trie. DFS(node, index, changesLeft):
 *   - at the end: return node.isEnd && changesLeft === 0
 *   - take the exact child (no change used)
 *   - OR, if changesLeft is 1, take any OTHER child and set changesLeft to 0
 * The budget means we branch at most once, so cost is about 26 * L, not 26^L.
 *
 * Dry run: search("hhllo") with "hello":
 *   h: exact child 'h' -> index 1
 *   h: no child 'h' under (h)... other child 'e' exists -> use change, budget 0
 *   l, l, o: exact children exist -> end, isEnd and budget 0 -> true
 *
 * EDGE CASES
 * - word exactly in dictionary -> false (zero changes)
 * - different length -> false
 * - empty dictionary -> false
 */

class BruteForceMagic {
  buildDict(words) { this.words = words; }
  search(target) {
    return this.words.some((w) => {
      if (w.length !== target.length) return false;
      let diff = 0;
      for (let i = 0; i < w.length; i++) if (w[i] !== target[i]) diff++;
      return diff === 1;
    });
  }
}

class MagicDictionary {
  buildDict(words) {
    this.root = { children: new Map(), isEnd: false };
    for (const word of words) {
      let node = this.root;
      for (const ch of word) {
        if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isEnd: false });
        node = node.children.get(ch);
      }
      node.isEnd = true;
    }
  }

  search(target) {
    const dfs = (node, index, changesLeft) => {
      if (index === target.length) return node.isEnd && changesLeft === 0;
      const ch = target[index];
      for (const [childCh, child] of node.children) {
        if (childCh === ch) {
          if (dfs(child, index + 1, changesLeft)) return true;
        } else if (changesLeft === 1) {
          if (dfs(child, index + 1, 0)) return true; // spend the one change here
        }
      }
      return false;
    };
    return dfs(this.root, 0, 1);
  }
}

function optimal() { return new MagicDictionary(); }
function bruteForce() { return new BruteForceMagic(); }

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const d = make();
  d.buildDict(['hello', 'leetcode']);
  assert.strictEqual(d.search('hello'), false);
  assert.strictEqual(d.search('hhllo'), true);
  assert.strictEqual(d.search('hell'), false);
  assert.strictEqual(d.search('leetcoded'), false);
  assert.strictEqual(d.search('leetcodf'), true);
  assert.strictEqual(d.search('hxllo'), true);
  assert.strictEqual(d.search('hxlxo'), false); // two changes
  const e = make();
  e.buildDict([]);
  assert.strictEqual(e.search('a'), false);
}
console.log('✓ 06-implement-magic-dictionary passed');

module.exports = { optimal, bruteForce, MagicDictionary };
