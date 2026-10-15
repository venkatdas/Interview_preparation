/**
 * 16. Word Break II   (LeetCode 140 — Hard)
 *
 * PROBLEM
 * Given a string s and a dictionary of words, return ALL sentences made by inserting
 * spaces into s so that every word is in the dictionary. Words may be reused.
 *
 * EXAMPLES
 * Input: s = "catsanddog", dict = ["cat","cats","and","sand","dog"]
 * Output: ["cats and dog","cat sand dog"]
 * Input: s = "pineapplepenapple", dict = ["apple","pen","applepen","pine","pineapple"]
 * Output: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
 * Input: s = "catsandog", dict = ["cats","dog","sand","and","cat"]   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - s.length <= 20, dictionary <= 1000 words, each <= 10 chars
 * - Output can be exponential in theory ("aaaa..." with dict ["a","aa","aaa"])
 * - Order of sentences does not matter
 *
 * APPROACH 1 — Brute force (plain backtracking)   O(2^n * n) time
 * go(start, words): if start === n, record words.join(' '). Else for every end, if
 * s[start..end] is a word, take it and recurse from end + 1. Correct, but the same
 * suffix (e.g. "dog" after both "cats and" and "cat sand") is re-explored from scratch.
 *
 * APPROACH 2 — Optimal (Backtracking + memoization on the start index)
 *   O(n^2 + size of output) time, O(n * output) space
 * The sub-problem "all sentences for s[start..]" depends only on `start`. Cache it in
 * a Map: memo[start] = array of sentences. Each start is solved once; building the
 * answer for `start` is: for each word w at start, prefix w to each sentence of
 * memo[start + w.length]. This is the "memoization teaser" from the README applied to a
 * backtracking problem: it works because the RESULT of a suffix is reusable, not just
 * a yes/no.
 *
 * Dry run "catsanddog":
 *   solve(0): "cat" -> solve(3): "sand" -> solve(7): "dog" -> solve(10) = [""]
 *                                          -> ["dog"]       memo[7]
 *                       -> ["sand dog"]                      memo[3]
 *             "cats" -> solve(4): "and" -> solve(7) cached ["dog"] -> ["and dog"]   memo[4]
 *   -> ["cat sand dog", "cats and dog"]
 *
 * EDGE CASES
 * - No valid split -> []
 * - s is itself one dictionary word -> [s]
 * - Words reused: "aaa" with ["a","aa"] -> ["a a a","a aa","aa a"]
 */

function bruteForce(s, wordDict) {
  const words = new Set(wordDict);
  const results = [];
  function go(start, parts) {
    if (start === s.length) { results.push(parts.join(' ')); return; }
    for (let end = start + 1; end <= s.length; end++) {
      const piece = s.slice(start, end);
      if (!words.has(piece)) continue;
      parts.push(piece);
      go(end, parts);
      parts.pop();
    }
  }
  go(0, []);
  return results;
}

function optimal(s, wordDict) {
  const words = new Set(wordDict);
  const maxLen = Math.max(0, ...wordDict.map((w) => w.length)); // prune: no piece longer than this
  const memo = new Map();                                        // start -> sentences for s[start..]

  function solve(start) {
    if (memo.has(start)) return memo.get(start);
    const sentences = [];
    if (start === s.length) {
      sentences.push('');                       // one way to split the empty suffix: nothing
    } else {
      for (let end = start + 1; end <= Math.min(s.length, start + maxLen); end++) {
        const piece = s.slice(start, end);
        if (!words.has(piece)) continue;
        for (const rest of solve(end)) {        // trust: all sentences of the suffix
          sentences.push(rest === '' ? piece : piece + ' ' + rest);
        }
      }
    }
    memo.set(start, sentences);
    return sentences;
  }

  return solve(0);
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (list) => [...list].sort();

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sorted(solve('catsanddog', ['cat', 'cats', 'and', 'sand', 'dog'])),
    sorted(['cats and dog', 'cat sand dog']));
  assert.deepStrictEqual(sorted(solve('pineapplepenapple', ['apple', 'pen', 'applepen', 'pine', 'pineapple'])),
    sorted(['pine apple pen apple', 'pineapple pen apple', 'pine applepen apple']));
  assert.deepStrictEqual(solve('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']), []);
  assert.deepStrictEqual(solve('a', ['a']), ['a']);
  assert.deepStrictEqual(solve('a', ['b']), []);
  assert.deepStrictEqual(sorted(solve('aaa', ['a', 'aa'])), sorted(['a a a', 'a aa', 'aa a']));
  assert.deepStrictEqual(solve('', ['a']), ['']);           // empty string: one empty sentence
}
// memo makes an exponential-looking input with no answer fast
const unsplittable = 'a'.repeat(30) + 'b';
assert.deepStrictEqual(optimal(unsplittable, ['a', 'aa', 'aaa']), []);
console.log('✓ 16-word-break-ii passed');

module.exports = { optimal, bruteForce };
