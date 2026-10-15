/**
 * 10. Reverse Words in a String   (LeetCode 151 — Medium)
 *
 * PROBLEM
 * Given a string of words separated by spaces, return the words in reverse order,
 * joined by a single space. Leading/trailing spaces are removed and multiple spaces
 * between words collapse to one.
 *
 * EXAMPLES
 * Input: "the sky is blue"       Output: "blue is sky the"
 * Input: "  hello world  "       Output: "world hello"   Explanation: outer spaces dropped
 * Input: "a good   example"      Output: "example good a"   Explanation: inner spaces collapsed
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only ' ' as whitespace, or tabs too? (assume ' ')
 * - Can I use split/join? (usually yes; the follow-up is "do it in place on a char array")
 * - Is the string guaranteed to have at least one word? (yes on LeetCode; handle "" anyway)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * s.trim().split(/\s+/).reverse().join(' '). One line, and honestly fine in JS.
 * The interviewer will then ask how you would do it without the built-ins.
 *
 * APPROACH 2 — Optimal (two-pointer word scan, build from the end)   O(n) time, O(n) space
 * Walk from the END of the string. Skip spaces to find the end of a word, then walk
 * left to find its start. Push that word into an output array. Repeat. The output
 * naturally comes out in reversed word order. (True O(1) extra space is only possible
 * on a mutable char array: reverse the whole array, then reverse each word.)
 *
 * Dry run on "  hello world  " (walking from the right):
 *   right=14 ' ' skip, 13 ' ' skip, 12 'd' -> wordEnd=12
 *   move left while not space: left stops at 6 (' ') -> word = s.slice(7, 13) = "world"
 *   continue: right=6 ' ' skip, 5 'o' -> wordEnd=5, left stops at 1 -> "hello"
 *   right=1 ' ', 0 ' ', done -> ["world","hello"].join(' ')
 *
 * EDGE CASES
 * - ""  or "   "       -> ""
 * - "hello"            -> "hello" (single word)
 * - tabs / other whitespace if the interviewer allows them (use /\s/ test)
 */

function bruteForce(s) {
  return s.trim().split(/\s+/).filter(Boolean).reverse().join(' ');
}

function optimal(s) {
  const words = [];
  let right = s.length - 1;

  while (right >= 0) {
    // skip spaces to find the last character of the next word
    while (right >= 0 && s[right] === ' ') right--;
    if (right < 0) break;

    // walk left to the first character of this word
    let left = right;
    while (left >= 0 && s[left] !== ' ') left--;

    words.push(s.slice(left + 1, right + 1));
    right = left; // continue from just before this word
  }
  return words.join(' ');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('the sky is blue'), 'blue is sky the');
  assert.strictEqual(solve('  hello world  '), 'world hello');
  assert.strictEqual(solve('a good   example'), 'example good a');
  assert.strictEqual(solve(''), '');
  assert.strictEqual(solve('   '), '');
  assert.strictEqual(solve('hello'), 'hello');
  assert.strictEqual(solve('  a  '), 'a');
}
console.log('✓ 10-reverse-words-in-a-string passed');

module.exports = { optimal, bruteForce };
