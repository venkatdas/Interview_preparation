/**
 * 02. Valid Palindrome II   (LeetCode 680 — Easy)
 *
 * PROBLEM
 * Given a string s, return true if it can be a palindrome after deleting AT MOST one character.
 *
 * EXAMPLES
 * Input: "aba"    Output: true    Explanation: already a palindrome
 * Input: "abca"   Output: true    Explanation: delete 'c' -> "aba"
 * Input: "abc"    Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase only? (yes on LeetCode; the algorithm doesn't care)
 * - "At most one" includes zero deletions? (yes)
 * - Empty / single char? (true)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * Try deleting each index (plus deleting nothing) and check if the result is a palindrome.
 * n + 1 candidates, each O(n) to check.
 *
 * APPROACH 2 — Optimal (opposite ends with one allowed skip)   O(n) time, O(1) space
 * Walk left and right inward while characters match. At the FIRST mismatch we have exactly
 * two options: delete s[left] or delete s[right]. Check whether the remaining inner range
 * is a plain palindrome for either option. There is no third choice because any earlier
 * character already matched its partner and deleting it would break that match.
 *
 * Dry run on "abca":
 *   left=0 'a' right=3 'a' match -> left=1, right=2
 *   left=1 'b' right=2 'c' mismatch
 *     skip left: check s[2..2] = "c" -> palindrome -> true
 *
 * Dry run on "abc":
 *   left=0 'a' right=2 'c' mismatch
 *     skip left:  s[1..2] = "bc" -> no
 *     skip right: s[0..1] = "ab" -> no  -> false
 *
 * EDGE CASES
 * - Already a palindrome -> true (no deletion needed)
 * - Length <= 2 -> always true (delete one, one char remains)
 * - Mismatch where only the right-skip works: "cbbcc" -> skip last... see tests
 */

function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

function bruteForce(s) {
  if (isPalindrome(s)) return true;
  for (let skip = 0; skip < s.length; skip++) {
    if (isPalindrome(s.slice(0, skip) + s.slice(skip + 1))) return true;
  }
  return false;
}

function isPalindromeRange(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

function optimal(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) {
      // one mismatch allowed: try dropping either side, the rest must be a true palindrome
      return isPalindromeRange(s, left + 1, right) || isPalindromeRange(s, left, right - 1);
    }
    left++;
    right--;
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('aba'), true);
  assert.strictEqual(solve('abca'), true);
  assert.strictEqual(solve('abc'), false);
  assert.strictEqual(solve(''), true);
  assert.strictEqual(solve('a'), true);
  assert.strictEqual(solve('ab'), true);
  assert.strictEqual(solve('cbbcc'), true);   // delete the first 'c'
  assert.strictEqual(solve('abcdba'), true);    // delete 'c' -> "abdba"
  assert.strictEqual(solve('abcdeba'), false);  // one deletion is not enough
  assert.strictEqual(solve('deeee'), true);
}
console.log('✓ 02-valid-palindrome-ii passed');

module.exports = { optimal, bruteForce };
