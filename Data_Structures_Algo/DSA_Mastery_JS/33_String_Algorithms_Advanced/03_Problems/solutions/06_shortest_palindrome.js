/**
 * 06. Shortest Palindrome   (LeetCode 214 — Hard)
 *
 * PROBLEM
 * You may add characters only in FRONT of s. Return the shortest palindrome you can make.
 *
 * EXAMPLES
 * Input: "aacecaaa"   Output: "aaacecaaa"
 * Input: "abcd"       Output: "dcbabcd"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 5 * 10^4 -> O(n^2) is too slow in the worst case
 * - Only prepending allowed
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * Find the longest prefix of s that is a palindrome (try lengths n, n-1, ..., check each in
 * O(n)). The rest of the string, reversed, goes in front.
 *
 * APPROACH 2 — Optimal (KMP on s + '#' + reverse(s))   O(n) time, O(n) space
 * "Longest palindromic PREFIX of s" = "longest prefix of s that is a suffix of reverse(s)".
 * The KMP failure table measures exactly "longest prefix that is also a suffix", so build
 * lps for  combined = s + '#' + reverse(s)  (the '#' never matches, so the prefix cannot
 * spill past s). lps[last] = length L of the longest palindromic prefix.
 * Answer = reverse(s.slice(L)) + s.
 *
 * Dry run on "abcd": combined = "abcd#dcba"
 *   lps = [0,0,0,0,0,0,0,0,1]  -> L = 1 (just "a")
 *   prepend reverse("bcd") = "dcb" -> "dcbabcd"
 * "aacecaaa": combined = "aacecaaa#aaacecaa"; lps[last] = 7 ("aacecaa" is a palindrome)
 *   prepend reverse("a") -> "aaacecaaa"
 *
 * EDGE CASES
 * - empty string -> ""
 * - already a palindrome -> unchanged
 * - single character
 */

function isPalindrome(str) {
  for (let i = 0, j = str.length - 1; i < j; i++, j--) if (str[i] !== str[j]) return false;
  return true;
}

function bruteForce(s) {
  for (let len = s.length; len >= 1; len--) {
    if (isPalindrome(s.slice(0, len))) {
      return s.slice(len).split('').reverse().join('') + s;
    }
  }
  return s;
}

function optimal(s) {
  const reversed = s.split('').reverse().join('');
  const combined = s + '#' + reversed;
  const lps = new Array(combined.length).fill(0);
  let len = 0;
  for (let i = 1; i < combined.length; i++) {
    while (len > 0 && combined[i] !== combined[len]) len = lps[len - 1];
    if (combined[i] === combined[len]) len++;
    lps[i] = len;
  }
  const palindromicPrefixLength = lps[combined.length - 1];
  return reversed.slice(0, s.length - palindromicPrefixLength) + s;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('aacecaaa'), 'aaacecaaa');
  assert.strictEqual(solve('abcd'), 'dcbabcd');
  assert.strictEqual(solve(''), '');
  assert.strictEqual(solve('a'), 'a');
  assert.strictEqual(solve('aba'), 'aba');
  assert.strictEqual(solve('abb'), 'bbabb');
}
function randomString(len) {
  return Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const s = randomString(Math.floor(Math.random() * 16));
  assert.strictEqual(optimal(s), bruteForce(s));
}
console.log('✓ 06-shortest-palindrome passed');

module.exports = { optimal, bruteForce };
