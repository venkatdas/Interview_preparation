/**
 * 13. Palindromic Substrings   (LeetCode 647 — Medium)
 *
 * PROBLEM
 * Given a string s, count how many substrings of s are palindromes. Substrings at
 * different positions count separately even if they have the same text.
 *
 * EXAMPLES
 * Input: "abc"   Output: 3   Explanation: "a", "b", "c"
 * Input: "aaa"   Output: 6   Explanation: "a","a","a","aa","aa","aaa"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Count positions, not distinct strings? (positions)
 * - Only lowercase letters? (yes, but the solution does not depend on it)
 * - Empty string? (0)
 *
 * APPROACH 1 — Brute force   O(n^3) time, O(1) space
 * Every (start, end) pair, check palindrome with two pointers, count the hits.
 *
 * APPROACH 2 — Optimal (expand around center)   O(n^2) time, O(1) space
 * Same centers as Longest Palindromic Substring (problem 07): n odd centers and n-1 even
 * centers. From each one expand outward; EVERY successful expansion step is one more
 * palindrome, so count each step instead of tracking a maximum.
 * (A DP table dp[i][j] = "s[i..j] is palindrome" also works in O(n^2) time, O(n^2) space;
 * see 29_Dynamic_Programming.)
 *
 * Dry run on "aaa":
 *   center 0 odd:  "a"            +1
 *   center 0 even: "aa" (0,1)     +1
 *   center 1 odd:  "a", "aaa"     +2
 *   center 1 even: "aa" (1,2)     +1
 *   center 2 odd:  "a"            +1
 *   center 2 even: (2,3) out of range  +0
 *   total 6
 *
 * EDGE CASES
 * - ""       -> 0
 * - "a"      -> 1
 * - "ab"     -> 2
 * - "aaaa"   -> 10 (= n(n+1)/2, every substring is a palindrome)
 */

function isPalindromeRange(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

function bruteForce(s) {
  let count = 0;
  for (let start = 0; start < s.length; start++) {
    for (let end = start; end < s.length; end++) {
      if (isPalindromeRange(s, start, end)) count++;
    }
  }
  return count;
}

function optimal(s) {
  let count = 0;

  // counts palindromes centered at (left, right): each successful widening is one more
  function countFromCenter(left, right) {
    let found = 0;
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      found++;
      left--;
      right++;
    }
    return found;
  }

  for (let center = 0; center < s.length; center++) {
    count += countFromCenter(center, center);     // odd length
    count += countFromCenter(center, center + 1); // even length
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('abc'), 3);
  assert.strictEqual(solve('aaa'), 6);
  assert.strictEqual(solve(''), 0);
  assert.strictEqual(solve('a'), 1);
  assert.strictEqual(solve('ab'), 2);
  assert.strictEqual(solve('aaaa'), 10);
  assert.strictEqual(solve('abba'), 6);
}
console.log('✓ 13-palindromic-substrings passed');

module.exports = { optimal, bruteForce };
