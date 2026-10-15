/**
 * 15. Wildcard Matching   (LeetCode 44 — Hard)
 *
 * PROBLEM
 * Given a string s and a pattern p, implement matching with:
 *   '?' matches any single character
 *   '*' matches any sequence of characters (including the empty sequence)
 * The match must cover the ENTIRE string.
 *
 * EXAMPLES
 * Input: s = "aa", p = "a"      Output: false
 * Input: s = "aa", p = "*"      Output: true
 * Input: s = "cb", p = "?a"     Output: false   Explanation: '?' eats c, then a != b
 * Input: s = "adceb", p = "*a*b" Output: true   Explanation: first * = "", second * = "dce"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is '*' a single wildcard "any run" (yes, unlike regex where it modifies the
 *   previous char)?
 * - Empty s / empty p? ("" matches "" and "***"; "" never matches a non-empty s)
 *
 * APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space
 * Walk both. Normal char or '?': must match, advance both. '*': either it matches
 * nothing (advance j) or it eats one more char of s (advance i, stay on the '*').
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = does s[0..i) match p[0..j)
 * RECURRENCE p[j-1] is a letter or '?': dp[i][j] = dp[i-1][j-1] && (p[j-1]==='?' || p[j-1]===s[i-1])
 *            p[j-1] is '*':            dp[i][j] = dp[i][j-1]   ('*' matches empty)
 *                                              || dp[i-1][j]   ('*' eats s[i-1], stays)
 * BASE CASES dp[0][0] = true; dp[0][j] = true only while p[0..j) is all '*';
 *            dp[i][0] = false for i > 0
 * ANSWER     dp[m][n]
 *
 * Table for s = "adceb", p = "*a*b" (rows = i chars of s, cols = j chars of p):
 *            ""  *  a  *  b
 *        ""   T  T  F  F  F
 *        a    F  T  T  T  F      dp[1][2]: 'a'=='a' && dp[0][1] -> T
 *        d    F  T  F  T  F      dp[2][3]: '*' -> dp[2][2] F || dp[1][3] T -> T
 *        c    F  T  F  T  F
 *        e    F  T  F  T  F
 *        b    F  T  F  T  T      dp[5][4]: 'b'=='b' && dp[4][3] -> T   answer true
 *
 * APPROACH 3 — Space optimized   O(m*n) time, O(n) space
 * Two rows, same recurrence.
 * (There is also a greedy O(m*n) worst / O(m+n) typical two-pointer solution that
 * remembers the last '*' position; DP is the one to know first.)
 *
 * EDGE CASES
 * - p = "" and s = "" -> true; p = "" and s != "" -> false
 * - p = "*" -> always true
 * - consecutive stars "a**b" behave like one star
 */

function bruteForce(s, p) {
  function match(i, j) {
    if (j === p.length) return i === s.length; // pattern used up: s must be used up too
    if (p[j] === '*') {
      // match empty, or eat one char and try the same '*' again
      if (match(i, j + 1)) return true;
      return i < s.length && match(i + 1, j);
    }
    if (i === s.length) return false;
    if (p[j] === '?' || p[j] === s[i]) return match(i + 1, j + 1);
    return false;
  }
  return match(0, 0);
}

function memo(s, p) {
  const cache = new Map();
  function match(i, j) {
    if (j === p.length) return i === s.length;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (p[j] === '*') {
      result = match(i, j + 1) || (i < s.length && match(i + 1, j));
    } else if (i < s.length && (p[j] === '?' || p[j] === s[i])) {
      result = match(i + 1, j + 1);
    } else {
      result = false;
    }
    cache.set(key, result);
    return result;
  }
  return match(0, 0);
}

function tabulation(s, p) {
  const m = s.length;
  const n = p.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j - 1] && p[j - 1] === '*'; // only stars match ""
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j - 1] && (p[j - 1] === '?' || p[j - 1] === s[i - 1]);
      }
    }
  }
  return dp[m][n];
}

function optimized(s, p) {
  const n = p.length;
  let prev = new Array(n + 1).fill(false);
  let curr = new Array(n + 1).fill(false);
  prev[0] = true;
  for (let j = 1; j <= n; j++) prev[j] = prev[j - 1] && p[j - 1] === '*';
  for (let i = 1; i <= s.length; i++) {
    curr[0] = false; // non-empty s never matches empty pattern
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') curr[j] = curr[j - 1] || prev[j];
      else curr[j] = prev[j - 1] && (p[j - 1] === '?' || p[j - 1] === s[i - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('aa', 'a'), false);
  assert.strictEqual(solve('aa', '*'), true);
  assert.strictEqual(solve('cb', '?a'), false);
  assert.strictEqual(solve('adceb', '*a*b'), true);
  assert.strictEqual(solve('acdcb', 'a*c?b'), false);
  assert.strictEqual(solve('', ''), true);
  assert.strictEqual(solve('', '***'), true);
  assert.strictEqual(solve('abc', ''), false);
  assert.strictEqual(solve('abcabczzzde', '*abc???de*'), true);
}
console.log('✓ 15-wildcard-matching passed');

module.exports = { bruteForce, memo, tabulation, optimized };
