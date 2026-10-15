/**
 * 03. Wildcard Dictionary Count   (Original — Medium)
 *
 * PROBLEM
 * A crossword helper has a dictionary `words` (lowercase, may contain duplicates — each
 * copy counts). For each pattern in `patterns`, count how many dictionary words match it.
 * A pattern has lowercase letters and '?' characters; '?' matches exactly one letter.
 * A word matches only if it has the same length as the pattern.
 *
 * EXAMPLES
 * Input: words = ["cat", "car", "cut", "cart"], patterns = ["c?t", "ca?", "????", "?"]
 * Output: [2, 2, 1, 0]
 * Input: words = [], patterns = ["a"]   Output: [0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^4 words of length <= 20, up to 10^4 patterns; few '?' per pattern usually.
 * - Duplicates in the dictionary count separately? (yes)
 *
 * APPROACH 1 — Brute force   O(P * W * L) time, O(1) extra space
 * For each pattern compare against every word character by character.
 *
 * APPROACH 2 — Optimal (trie with end-counts + DFS that branches on '?')   build O(W * L), query O(L) without '?' and O(26^q * L) worst case with q wildcards
 * Insert every word into a trie; each node stores how many words END there. To answer a
 * pattern, DFS from the root: a letter follows one child; '?' follows every child. When the
 * pattern is used up, add that node's end-count. Shared prefixes are walked once instead of
 * once per word, and branches that do not exist are never explored.
 *
 * Dry run on pattern "c?t" with words cat, car, cut, cart:
 *   root -c-> node(c)
 *   '?' -> children a, u
 *     a -> 't'? child t exists, end-count 1  (cat)
 *     u -> 't'? child t exists, end-count 1  (cut)
 *   total 2
 *
 * EDGE CASES
 * - empty pattern -> counts empty words in the dictionary
 * - pattern longer than every word -> 0 (DFS dies quickly)
 * - all '?' -> number of words with exactly that length
 *
 * COMMON MISTAKES
 * - Storing a boolean isEnd instead of a count: duplicates get lost.
 * - Counting words that merely START with the pattern (check the end-count, not "node exists").
 */

function bruteForce(words, patterns) {
  return patterns.map((p) => words.filter((w) => {
    if (w.length !== p.length) return false;
    for (let i = 0; i < w.length; i++) if (p[i] !== '?' && p[i] !== w[i]) return false;
    return true;
  }).length);
}

function optimal(words, patterns) {
  const root = { kids: new Map(), end: 0 };
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node.kids.has(ch)) node.kids.set(ch, { kids: new Map(), end: 0 });
      node = node.kids.get(ch);
    }
    node.end++;
  }
  function count(node, p, i) {
    if (i === p.length) return node.end;
    if (p[i] === '?') {
      let total = 0;
      for (const child of node.kids.values()) total += count(child, p, i + 1);
      return total;
    }
    const child = node.kids.get(p[i]);
    return child ? count(child, p, i + 1) : 0;
  }
  return patterns.map((p) => count(root, p, 0));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(['cat', 'car', 'cut', 'cart'], ['c?t', 'ca?', '????', '?']), [2, 2, 1, 0]);
  assert.deepStrictEqual(solve([], ['a']), [0]);
  assert.deepStrictEqual(solve(['ab', 'ab'], ['ab', '??', 'a']), [2, 2, 0]);
  assert.deepStrictEqual(solve(['', 'a'], ['']), [1]);
  assert.deepStrictEqual(solve(['abc'], []), []);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(403);
const rw = (alpha) => { let s = ''; const n = Math.floor(rand() * 4); for (let i = 0; i < n; i++) s += alpha[Math.floor(rand() * alpha.length)]; return s; };
for (let t = 0; t < 300; t++) {
  const words = Array.from({ length: Math.floor(rand() * 10) }, () => rw('ab'));
  const patterns = Array.from({ length: Math.floor(rand() * 5) }, () => rw('ab?'));
  assert.deepStrictEqual(optimal(words, patterns), bruteForce(words, patterns));
}
console.log('✓ set_04/03_wildcard_dictionary_count passed');
module.exports = { optimal, bruteForce };
