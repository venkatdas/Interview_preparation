/**
 * 02. Valid Palindrome   (LeetCode 125 — Easy)
 *
 * PROBLEM
 * A phrase is a palindrome if, after converting all uppercase letters to lowercase and
 * removing every character that is not a letter or digit, it reads the same forwards and
 * backwards. Return true if the given string is a palindrome.
 *
 * EXAMPLES
 * Input: "A man, a plan, a canal: Panama"   Output: true   Explanation: "amanaplanacanalpanama"
 * Input: "race a car"                        Output: false  Explanation: "raceacar" is not a palindrome
 * Input: " "                                 Output: true   Explanation: nothing left -> empty string is a palindrome
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Which characters count? (letters and digits only, case-insensitive)
 * - Is an empty string a palindrome? (yes)
 * - ASCII only? (assume yes; makes the "is alphanumeric" check a simple code range test)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Build a cleaned string (lowercase, alphanumeric only), reverse it, compare with ===.
 * Simple and fine in practice; the "waste" is the two extra strings.
 *
 * APPROACH 2 — Optimal (two pointers)   O(n) time, O(1) space
 * left starts at 0, right at n-1. Skip non-alphanumeric characters on each side, then
 * compare the lowercased characters. Mismatch -> false. Pointers cross -> true.
 *
 * Dry run on "A man, a plan":   (shortened to show the skipping)
 *   left='A' right='n'  compare a vs n -> false
 * Dry run on "a.b,a":
 *   left=0 'a'   right=4 'a'   equal, move in
 *   left=1 '.'   skip -> left=2 'b'
 *   right=3 ','  skip -> right=2
 *   left is not < right -> true
 *
 * EDGE CASES
 * - ""  or only punctuation  -> true
 * - single character          -> true
 * - digits mixed in: "0P"     -> false ('0' !== 'p'), do not lowercase-compare digits wrongly
 * - uppercase vs lowercase    -> must compare case-insensitively
 */

function isAlphanumeric(ch) {
  const code = ch.charCodeAt(0);
  return (code >= 48 && code <= 57)    // '0'-'9'
      || (code >= 65 && code <= 90)    // 'A'-'Z'
      || (code >= 97 && code <= 122);  // 'a'-'z'
}

function bruteForce(s) {
  const cleaned = [];
  for (const ch of s.toLowerCase()) {
    if (isAlphanumeric(ch)) cleaned.push(ch);
  }
  return cleaned.join('') === cleaned.reverse().join('');
}

function optimal(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    // move each pointer inward until it sits on a character that counts
    if (!isAlphanumeric(s[left])) { left++; continue; }
    if (!isAlphanumeric(s[right])) { right--; continue; }

    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('A man, a plan, a canal: Panama'), true);
  assert.strictEqual(solve('race a car'), false);
  assert.strictEqual(solve(' '), true);
  assert.strictEqual(solve(''), true);
  assert.strictEqual(solve('a'), true);
  assert.strictEqual(solve('0P'), false);
  assert.strictEqual(solve('Was it a car or a cat I saw?'), true);
  assert.strictEqual(solve('ab@a'), true);
}
console.log('✓ 02-valid-palindrome passed');

module.exports = { optimal, bruteForce };
