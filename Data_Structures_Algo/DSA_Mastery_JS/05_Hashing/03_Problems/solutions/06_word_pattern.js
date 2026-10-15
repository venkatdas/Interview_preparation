/**
 * 06. Word Pattern   (LeetCode 290 — Easy)
 *
 * PROBLEM
 * Given a pattern (a string of letters) and a sentence s (words separated by single
 * spaces), return true if s follows the pattern: there is a one-to-one mapping between
 * letters in pattern and words in s.
 *
 * EXAMPLES
 * Input: pattern = "abba", s = "dog cat cat dog"    Output: true    Explanation: a->dog, b->cat
 * Input: pattern = "abba", s = "dog cat cat fish"   Output: false   Explanation: a->dog then a->fish
 * Input: pattern = "aaaa", s = "dog cat cat dog"    Output: false
 * Input: pattern = "abba", s = "dog dog dog dog"    Output: false   Explanation: a and b both map to dog
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Words separated by exactly one space? (yes)
 * - Different number of words than letters? (then false)
 * - Case sensitive? (yes)
 *
 * APPROACH 1 — Brute force (shape fingerprint)   O(n^2) time, O(n) space
 * Build the "first occurrence index" shape of the pattern letters and of the word list
 * and compare them. Same idea as Isomorphic Strings, but over words.
 *
 * APPROACH 2 — Optimal (two maps)   O(n) time, O(n) space
 * This is Isomorphic Strings where one side is words instead of characters.
 * Split s into words. If counts differ -> false. Then walk both lists with
 * letterToWord and wordToLetter maps, rejecting any conflict in either direction.
 *
 * Dry run on "abba" / "dog cat cat dog":
 *   a/dog: new both ways
 *   b/cat: new both ways
 *   b/cat: letterToWord[b] = cat ok, wordToLetter[cat] = b ok
 *   a/dog: ok, ok -> true
 *
 * EDGE CASES
 * - Word count != pattern length -> false ("aaa" vs "dog dog")
 * - Single letter / single word -> true
 * - Two letters mapping to the same word -> false (needs the reverse map)
 */

function bruteForce(pattern, s) {
  const words = s.split(' ');
  if (words.length !== pattern.length) return false;
  const shape = (list) => list.map((item) => list.indexOf(item)).join(',');
  return shape([...pattern]) === shape(words);
}

function optimal(pattern, s) {
  const words = s.split(' ');
  if (words.length !== pattern.length) return false;

  const letterToWord = new Map();
  const wordToLetter = new Map();

  for (let i = 0; i < pattern.length; i++) {
    const letter = pattern[i];
    const word = words[i];

    if (letterToWord.has(letter) && letterToWord.get(letter) !== word) return false;
    if (wordToLetter.has(word) && wordToLetter.get(word) !== letter) return false;

    letterToWord.set(letter, word);
    wordToLetter.set(word, letter);
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('abba', 'dog cat cat dog'), true);
  assert.strictEqual(solve('abba', 'dog cat cat fish'), false);
  assert.strictEqual(solve('aaaa', 'dog cat cat dog'), false);
  assert.strictEqual(solve('abba', 'dog dog dog dog'), false);
  assert.strictEqual(solve('aaa', 'dog dog'), false);
  assert.strictEqual(solve('a', 'dog'), true);
  assert.strictEqual(solve('ab', 'dog dog'), false);
}
console.log('✓ 06-word-pattern passed');

module.exports = { optimal, bruteForce };
