/**
 * 16. Regular Expression Matching   (LeetCode 10 — Hard)
 *
 * PROBLEM
 * Given a string s and a pattern p, implement matching with:
 *   '.'  matches any single character
 *   '*'  matches ZERO OR MORE of the element right before it ("a*" = "", "a", "aa", ...)
 * The match must cover the ENTIRE string.
 *
 * EXAMPLES
 * Input: s = "aa",  p = "a"     Output: false
 * Input: s = "aa",  p = "a*"    Output: true    Explanation: a* = "aa"
 * Input: s = "ab",  p = ".*"    Output: true    Explanation: .* = any string
 * Input: s = "aab", p = "c*a*b" Output: true    Explanation: c* = "", a* = "aa", then b
 * Input: s = "mississippi", p = "mis*is*p*."   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is '*' always preceded by a valid char (never first)? (yes, pattern is valid)
 * - Difference from wildcard matching: here '*' modifies the PREVIOUS char.
 * - Empty s / empty p? ("" matches "" and "a*b*"; non-empty s never matches "")
 *
 * APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space
 * Look at p[j] and whether p[j+1] is '*'.
 *   - If p[j+1] is '*': the pair "x*" can match ZERO chars (jump to j+2), or, if
 *     p[j] matches s[i], match ONE char and stay on the same pair (i+1, j).
 *   - Otherwise p[j] must match s[i] and we advance both.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = does s[0..i) match p[0..j)
 * RECURRENCE if p[j-1] !== '*':
 *                dp[i][j] = dp[i-1][j-1] && firstMatch(s[i-1], p[j-1])
 *            if p[j-1] === '*'  (pair is p[j-2] p[j-1]):
 *                dp[i][j] = dp[i][j-2]                                  (zero copies)
 *                        || (firstMatch(s[i-1], p[j-2]) && dp[i-1][j])  (one more copy)
 *            where firstMatch(a, b) = b === '.' || a === b
 * BASE CASES dp[0][0] = true; dp[0][j] = dp[0][j-2] when p[j-1] === '*' (x* can vanish)
 * ANSWER     dp[m][n]
 *
 * Table for s = "aab", p = "c*a*b" (rows = i chars of s, cols = j chars of p):
 *            ""  c  c*  a  a*  b
 *        ""   T  F  T   F  T   F     dp[0][2] = dp[0][0]; dp[0][4] = dp[0][2]
 *        a    F  F  F   T  T   F     dp[1][4]: zero copies dp[1][2]=F, or a matches && dp[0][4]=T
 *        a    F  F  F   F  T   F     dp[2][4]: a matches && dp[1][4]=T
 *        b    F  F  F   F  F   T     dp[3][5]: 'b'=='b' && dp[2][4]=T  -> true
 *
 * APPROACH 3 — Space optimized   O(m*n) time, O(n) space
 * Two rows (dp[i][j-2] is in the current row, dp[i-1][j] and dp[i-1][j-1] in prev).
 *
 * EDGE CASES
 * - s = "", p = "a*b*" -> true
 * - s = "a", p = "" -> false
 * - "ab" vs ".*c" -> false (whole string must match)
 */

function firstMatch(sChar, pChar) {
  return pChar === '.' || sChar === pChar;
}

function bruteForce(s, p) {
  function match(i, j) {
    if (j === p.length) return i === s.length;
    const headMatches = i < s.length && firstMatch(s[i], p[j]);
    if (j + 1 < p.length && p[j + 1] === '*') {
      // zero copies of p[j], or one more copy (only if the head matches)
      return match(i, j + 2) || (headMatches && match(i + 1, j));
    }
    return headMatches && match(i + 1, j + 1);
  }
  return match(0, 0);
}

function memo(s, p) {
  const cache = new Map();
  function match(i, j) {
    if (j === p.length) return i === s.length;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    const headMatches = i < s.length && firstMatch(s[i], p[j]);
    let result;
    if (j + 1 < p.length && p[j + 1] === '*') {
      result = match(i, j + 2) || (headMatches && match(i + 1, j));
    } else {
      result = headMatches && match(i + 1, j + 1);
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
  // empty s: "x*" pairs can disappear
  for (let j = 2; j <= n; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        const zeroCopies = dp[i][j - 2];
        const oneMore = firstMatch(s[i - 1], p[j - 2]) && dp[i - 1][j];
        dp[i][j] = zeroCopies || oneMore;
      } else {
        dp[i][j] = dp[i - 1][j - 1] && firstMatch(s[i - 1], p[j - 1]);
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
  for (let j = 2; j <= n; j++) if (p[j - 1] === '*') prev[j] = prev[j - 2];
  for (let i = 1; i <= s.length; i++) {
    curr[0] = false;
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        curr[j] = curr[j - 2] || (firstMatch(s[i - 1], p[j - 2]) && prev[j]);
      } else {
        curr[j] = prev[j - 1] && firstMatch(s[i - 1], p[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('aa', 'a'), false);
  assert.strictEqual(solve('aa', 'a*'), true);
  assert.strictEqual(solve('ab', '.*'), true);
  assert.strictEqual(solve('aab', 'c*a*b'), true);
  assert.strictEqual(solve('mississippi', 'mis*is*p*.'), false);
  assert.strictEqual(solve('', 'a*b*'), true);
  assert.strictEqual(solve('a', ''), false);
  assert.strictEqual(solve('', ''), true);
  assert.strictEqual(solve('ab', '.*c'), false);
}
console.log('✓ 16-regular-expression-matching passed');

module.exports = { bruteForce, memo, tabulation, optimized };
