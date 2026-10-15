/**
 * 03. Longest Word in Dictionary   (LeetCode 720 — Medium)
 *
 * PROBLEM
 * Given an array of words, return the longest word that can be built one
 * character at a time by other words in the array (every prefix must also be a
 * word). If there is a tie, return the lexicographically smallest. If none, "".
 *
 * EXAMPLES
 * Input: ["w","wo","wor","worl","world"]  Output: "world"
 * Input: ["a","banana","app","appl","ap","apply","apple"]  Output: "apple"
 *   Explanation: "apple" and "apply" both buildable; "apple" is smaller.
 * Input: ["b","br","bre","brea"]  Output: "brea"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase only? (yes)
 * - Must the single-letter word itself be in the list? (yes: every prefix including length 1)
 * - Duplicates in input? (possible; harmless)
 *
 * APPROACH 1 — Brute force (set + check all prefixes)   O(n * L^2) time, O(n*L) space
 * Put all words in a Set. For each word, check every prefix is in the set.
 * Keep the best (longer, or equal length and smaller). Each prefix check builds
 * a substring, hence L^2 per word.
 *
 * APPROACH 2 — Optimal (Trie + DFS through isEnd nodes only)   O(total chars) time & space
 * Insert every word. Then DFS from the root but ONLY step into children that are
 * isEnd (a node that is not a word breaks the chain). Visit children in sorted
 * order so the first word of max length we see is the lexicographically smallest.
 *
 * Dry run on ["a","ap","app","apple","b"]:
 *   root -> 'a'(end) ok, depth 1, best="a"
 *     -> 'p'(end) ok, best="ap"
 *       -> 'p'(end) ok, best="app"
 *         -> 'l'(NOT end) -> stop, never reach "apple"
 *   root -> 'b'(end), length 1 < 3, ignore
 *   answer "app"
 *
 * EDGE CASES
 * - no single-letter word at all -> ""
 * - all words same length 1 -> smallest letter
 * - empty input -> ""
 */

function bruteForce(words) {
  const set = new Set(words);
  let best = '';
  for (const word of words) {
    let buildable = true;
    for (let len = 1; len < word.length; len++) {
      if (!set.has(word.slice(0, len))) { buildable = false; break; }
    }
    if (!buildable) continue;
    if (word.length > best.length || (word.length === best.length && word < best)) best = word;
  }
  return best;
}

function optimal(words) {
  const root = { children: new Map(), isEnd: false };
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isEnd: false });
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  let best = '';
  function dfs(node, path) {
    if (path.length > best.length) best = path; // first-seen at this length is smallest (sorted order)
    const letters = [...node.children.keys()].sort();
    for (const ch of letters) {
      const child = node.children.get(ch);
      if (child.isEnd) dfs(child, path + ch); // only continue through complete words
    }
  }
  dfs(root, '');
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(['w', 'wo', 'wor', 'worl', 'world']), 'world');
  assert.strictEqual(solve(['a', 'banana', 'app', 'appl', 'ap', 'apply', 'apple']), 'apple');
  assert.strictEqual(solve(['b', 'br', 'bre', 'brea']), 'brea');
  assert.strictEqual(solve(['abc', 'bcd']), '');
  assert.strictEqual(solve(['c', 'b', 'a']), 'a');
  assert.strictEqual(solve([]), '');
  assert.strictEqual(solve(['a', 'ap', 'app', 'apple', 'b']), 'app');
}
console.log('✓ 03-longest-word-in-dictionary passed');

module.exports = { optimal, bruteForce };
