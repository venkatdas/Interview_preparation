/**
 * 04. Replace Words   (LeetCode 648 — Medium)
 *
 * PROBLEM
 * You get a dictionary of "roots" and a sentence. Replace every word in the
 * sentence that starts with a root by that root. If several roots match, use
 * the SHORTEST one. Return the new sentence.
 *
 * EXAMPLES
 * dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
 * Output: "the cat was rat by the bat"
 * dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"
 * Output: "a a b c"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Words separated by single spaces? (yes)
 * - Lowercase only? (yes)
 * - If no root matches, keep the word unchanged.
 *
 * APPROACH 1 — Brute force   O(words * roots * L) time
 * For each sentence word, try every root with startsWith, keep the shortest match.
 *
 * APPROACH 2 — Optimal (Trie, stop at first isEnd)   O(total dictionary chars + total sentence chars)
 * Insert all roots in a trie. For each word, walk the trie char by char:
 *   - if we hit a node with isEnd -> the chars so far are the shortest root, return it
 *   - if the path breaks -> no root, return the original word
 * Because we stop at the FIRST isEnd, we automatically pick the shortest root.
 *
 * Dry run: roots cat, bat, rat; word "cattle"
 *   c -> a -> t (isEnd!) -> return "cat"
 * word "was": w not in root.children -> return "was"
 *
 * EDGE CASES
 * - root equals the whole word -> replaced by itself
 * - roots that are prefixes of other roots ("a", "ab") -> "a" wins
 * - empty dictionary -> sentence unchanged
 */

function bruteForce(dictionary, sentence) {
  return sentence.split(' ').map((word) => {
    let best = word;
    for (const root of dictionary) {
      if (word.startsWith(root) && root.length < best.length) best = root;
    }
    return best;
  }).join(' ');
}

function optimal(dictionary, sentence) {
  const root = { children: new Map(), isEnd: false };
  for (const r of dictionary) {
    let node = root;
    for (const ch of r) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isEnd: false });
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  function shortestRoot(word) {
    let node = root;
    for (let i = 0; i < word.length; i++) {
      node = node.children.get(word[i]);
      if (!node) return word;                    // no root is a prefix
      if (node.isEnd) return word.slice(0, i + 1); // first root found = shortest
    }
    return word;
  }

  return sentence.split(' ').map(shortestRoot).join(' ');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(
    solve(['cat', 'bat', 'rat'], 'the cattle was rattled by the battery'),
    'the cat was rat by the bat'
  );
  assert.strictEqual(solve(['a', 'b', 'c'], 'aadsfasf absbs bbab cadsfafs'), 'a a b c');
  assert.strictEqual(solve(['a', 'ab'], 'abc'), 'a');
  assert.strictEqual(solve(['abc'], 'abc'), 'abc');
  assert.strictEqual(solve([], 'hello world'), 'hello world');
  assert.strictEqual(solve(['xyz'], 'hello world'), 'hello world');
}
console.log('✓ 04-replace-words passed');

module.exports = { optimal, bruteForce };
