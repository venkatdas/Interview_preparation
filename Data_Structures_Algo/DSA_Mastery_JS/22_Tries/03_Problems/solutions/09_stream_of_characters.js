/**
 * 09. Stream of Characters   (LeetCode 1032 — Hard)
 *
 * PROBLEM
 * Design a class StreamChecker built from a list of words. Characters arrive
 * one at a time through query(letter). After each letter, return true if some
 * SUFFIX of everything received so far is one of the words.
 *
 * EXAMPLES
 * words = ["cd","f","kl"]
 * query('a') -> false, query('b') -> false, query('c') -> false,
 * query('d') -> true  ("cd" is a suffix of "abcd")
 * query('e') -> false, query('f') -> true ("f"), ...
 * query('k') -> false, query('l') -> true ("kl")
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase only? (yes)
 * - Max word length? (LeetCode: 200 -> we only need to keep the last 200 letters)
 * - Up to 40,000 queries -> each query must be fast.
 *
 * APPROACH 1 — Brute force   O(n * L) per query
 * Keep the whole stream in a string. After each letter, for every word check
 * stream.endsWith(word).
 *
 * APPROACH 2 — Optimal (Trie of REVERSED words + walk backwards)   O(maxLen) per query
 * The question is "does some suffix match a word". A suffix read backwards is a
 * prefix of the reversed stream. So:
 *   - insert every word REVERSED into a trie
 *   - keep the last maxLen letters of the stream (older ones can never matter)
 *   - on query, walk from the newest letter backwards through the trie; if we
 *     ever hit an isEnd node -> true; if the path breaks -> false
 *
 * Dry run: words cd, f, kl -> trie contains "dc", "f", "lk".
 *   stream "abcd": walk d -> c (isEnd!) -> true
 *   stream "abcde": 'e' not a root child -> false
 *
 * EDGE CASES
 * - single-letter word -> true the moment that letter arrives
 * - same letter repeated with word "aa" -> true from the 2nd 'a' on
 * - stream longer than maxLen -> we trim, answers still correct
 */

class BruteForceChecker {
  constructor(words) { this.words = words; this.stream = ''; }
  query(letter) {
    this.stream += letter;
    return this.words.some((w) => this.stream.endsWith(w));
  }
}

class StreamChecker {
  constructor(words) {
    this.root = { children: new Map(), isEnd: false };
    this.maxLen = 0;
    for (const word of words) {
      this.maxLen = Math.max(this.maxLen, word.length);
      let node = this.root;
      for (let i = word.length - 1; i >= 0; i--) { // insert reversed
        const ch = word[i];
        if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isEnd: false });
        node = node.children.get(ch);
      }
      node.isEnd = true;
    }
    this.recent = []; // last maxLen letters, newest at the end
  }

  query(letter) {
    this.recent.push(letter);
    if (this.recent.length > this.maxLen) this.recent.shift(); // keep it bounded

    let node = this.root;
    for (let i = this.recent.length - 1; i >= 0; i--) { // newest -> oldest
      node = node.children.get(this.recent[i]);
      if (!node) return false;
      if (node.isEnd) return true;
    }
    return false;
  }
}

function optimal(words) { return new StreamChecker(words); }
function bruteForce(words) { return new BruteForceChecker(words); }

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const c = make(['cd', 'f', 'kl']);
  const answers = [...'abcdefghijkl'].map((ch) => c.query(ch));
  assert.deepStrictEqual(answers, [false, false, false, true, false, true, false, false, false, false, false, true]);

  const single = make(['a']);
  assert.deepStrictEqual([single.query('b'), single.query('a'), single.query('a')], [false, true, true]);

  const repeat = make(['aa']);
  assert.deepStrictEqual([repeat.query('a'), repeat.query('a'), repeat.query('a')], [false, true, true]);

  const long = make(['ab', 'ba']);
  const seq = 'abababab';
  assert.deepStrictEqual([...seq].map((ch) => long.query(ch)), [false, true, true, true, true, true, true, true]);
}
console.log('✓ 09-stream-of-characters passed');

module.exports = { optimal, bruteForce, StreamChecker };
