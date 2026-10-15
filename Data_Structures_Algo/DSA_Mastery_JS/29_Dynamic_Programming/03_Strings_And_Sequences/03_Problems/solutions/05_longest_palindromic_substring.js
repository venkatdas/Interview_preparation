/**
 * 05. Longest Palindromic Substring   (LeetCode 5 — Medium)
 *
 * PROBLEM
 * Given a string s, return the longest contiguous substring that reads the same
 * forwards and backwards.
 *
 * EXAMPLES
 * Input: "babad"   Output: "bab"   Explanation: "aba" is also valid
 * Input: "cbbd"    Output: "bb"
 * Input: "a"       Output: "a"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - If several answers, which one? (any; we return the first found - tests check length
 *   and that the result is a palindrome inside s)
 * - Empty string? (return "")
 * - Case sensitive? (yes)
 *
 * APPROACH 1 — Brute force   O(n^3) time, O(n) space
 * Check every substring with a recursive isPalindrome(l, r): equal ends and the
 * inside is a palindrome. No caching, so the inside is rechecked many times.
 *
 * APPROACH 2 — Interval DP (memo / tabulation)   O(n^2) time, O(n^2) space
 * STATE      dp[l][r] = true if s[l..r] (inclusive) is a palindrome
 * RECURRENCE dp[l][r] = s[l] === s[r] && (r - l < 2 || dp[l+1][r-1])
 *            (a palindrome is "same ends + palindrome inside")
 * BASE CASES dp[i][i] = true (single char); dp[i][i+1] = s[i] === s[i+1]
 * ORDER      dp[l][r] needs dp[l+1][r-1], so fill by increasing length (or l from
 *            right to left). Track the best (l, r) while filling.
 *
 * Table for "babad" (T = palindrome, rows = l, cols = r, only r >= l shown):
 *          r: 0  1  2  3  4
 *   l=0 b     T  .  T  .  .      dp[0][2]: 'b'=='b' and dp[1][1] T -> T  "bab"
 *   l=1 a        T  .  T  .      dp[1][3]: 'a'=='a' and dp[2][2] T -> T  "aba"
 *   l=2 b           T  .  .
 *   l=3 a              T  .
 *   l=4 d                 T      longest = length 3 -> "bab"
 *
 * APPROACH 3 — Expand around center   O(n^2) time, O(1) space
 * Every palindrome has a center (a char, or the gap between two chars). For each of
 * the 2n-1 centers expand outwards while characters match. Same time, no table.
 * This is what interviewers usually expect; the DP table is the "learn the pattern"
 * version and is reused in Palindrome Partitioning and Count Palindromic Substrings.
 *
 * EDGE CASES
 * - "" -> ""
 * - all same chars "aaaa" -> whole string
 * - no palindrome longer than 1 "abc" -> "a"
 * - even-length palindrome "abba"
 */

function bruteForce(s) {
  function isPalindrome(left, right) {
    if (left >= right) return true;
    return s[left] === s[right] && isPalindrome(left + 1, right - 1);
  }
  let best = '';
  for (let left = 0; left < s.length; left++) {
    for (let right = left; right < s.length; right++) {
      if (right - left + 1 > best.length && isPalindrome(left, right)) {
        best = s.slice(left, right + 1);
      }
    }
  }
  return best;
}

function memo(s) {
  const cache = new Map();
  function isPalindrome(left, right) {
    if (left >= right) return true;
    const key = left + ',' + right;
    if (cache.has(key)) return cache.get(key);
    const result = s[left] === s[right] && isPalindrome(left + 1, right - 1);
    cache.set(key, result);
    return result;
  }
  let bestLeft = 0;
  let bestLength = 0;
  for (let left = 0; left < s.length; left++) {
    for (let right = left; right < s.length; right++) {
      if (right - left + 1 > bestLength && isPalindrome(left, right)) {
        bestLeft = left;
        bestLength = right - left + 1;
      }
    }
  }
  return s.slice(bestLeft, bestLeft + bestLength);
}

function tabulation(s) {
  const n = s.length;
  if (n === 0) return '';
  const dp = Array.from({ length: n }, () => new Array(n).fill(false));
  let bestLeft = 0;
  let bestLength = 1;
  // walk l from right to left so dp[l+1][...] is already known
  for (let left = n - 1; left >= 0; left--) {
    dp[left][left] = true;
    for (let right = left + 1; right < n; right++) {
      if (s[left] === s[right] && (right - left < 2 || dp[left + 1][right - 1])) {
        dp[left][right] = true;
        if (right - left + 1 > bestLength) {
          bestLeft = left;
          bestLength = right - left + 1;
        }
      }
    }
  }
  return s.slice(bestLeft, bestLeft + bestLength);
}

function optimized(s) {
  if (s.length === 0) return '';
  let bestLeft = 0;
  let bestLength = 1;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    // loop overshoots by one on each side, so the palindrome is (left+1 .. right-1)
    const length = right - left - 1;
    if (length > bestLength) {
      bestLength = length;
      bestLeft = left + 1;
    }
  }
  for (let center = 0; center < s.length; center++) {
    expand(center, center); // odd length, centered on a char
    expand(center, center + 1); // even length, centered on a gap
  }
  return s.slice(bestLeft, bestLeft + bestLength);
}

// ---------- tests ----------
const assert = require('assert');
function check(solve, input, expectedLength) {
  const result = solve(input);
  assert.strictEqual(result.length, expectedLength, `${solve.name}(${input}) -> ${result}`);
  assert.ok(input.includes(result));
  assert.strictEqual(result, result.split('').reverse().join(''));
}
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  check(solve, 'babad', 3);
  check(solve, 'cbbd', 2);
  check(solve, 'a', 1);
  check(solve, '', 0);
  check(solve, 'aaaa', 4);
  check(solve, 'abc', 1);
  check(solve, 'abba', 4);
  check(solve, 'forgeeksskeegfor', 10);
}
console.log('✓ 05-longest-palindromic-substring passed');

module.exports = { bruteForce, memo, tabulation, optimized };
