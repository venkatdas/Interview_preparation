/**
 * 01. Longest Common Subsequence   (LeetCode 1143 — Medium)
 *
 * PROBLEM
 * Given two strings text1 and text2, return the length of their longest common
 * subsequence. A subsequence keeps the relative order of characters but may skip
 * some (so "ace" is a subsequence of "abcde"). Return 0 if there is none.
 *
 * EXAMPLES
 * Input: text1 = "abcde", text2 = "ace"   Output: 3   Explanation: "ace"
 * Input: text1 = "abc",   text2 = "abc"   Output: 3
 * Input: text1 = "abc",   text2 = "def"   Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can a string be empty? (yes -> answer 0)
 * - Only lowercase letters? (assume any characters, we just compare equality)
 * - Do we need the actual subsequence or only its length? (length; we also show how
 *   to rebuild it in `reconstruct`)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^(m+n)) time, O(m+n) space
 * Look at the first character of each string. If they match, take it and move both
 * pointers. If not, try skipping a char from text1 OR from text2 and keep the better.
 * The same (i, j) pair is recomputed an exponential number of times.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = LCS length of text1[0..i) and text2[0..j)  (first i and first j chars)
 * RECURRENCE if text1[i-1] === text2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
 *            else:                          dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 * BASE CASES dp[0][j] = dp[i][0] = 0   (an empty string shares nothing)
 * ANSWER     dp[m][n]
 *
 * Table for "abcde" vs "ace"  (rows = prefix of text1, cols = prefix of text2):
 *
 *            ""  a  c  e
 *        ""   0  0  0  0
 *        a    0  1  1  1
 *        b    0  1  1  1
 *        c    0  1  2  2
 *        d    0  1  2  2
 *        e    0  1  2  3   <- answer 3
 *
 * Dry run of row 'c': 'c' vs 'a' -> no match, max(up=1, left=0)=1; 'c' vs 'c' -> match,
 * 1 + diagonal(1) = 2; 'c' vs 'e' -> no match, max(up=1, left=2) = 2.
 *
 * APPROACH 3 — Space optimized   O(m*n) time, O(min(m,n)) space
 * Each row only looks at the previous row, so keep two rows and swap them.
 *
 * EDGE CASES
 * - one or both strings empty -> 0
 * - identical strings -> full length
 * - no common characters -> 0
 */

function bruteForce(text1, text2) {
  function lcs(i, j) {
    if (i === text1.length || j === text2.length) return 0; // base: ran out of one string
    if (text1[i] === text2[j]) return 1 + lcs(i + 1, j + 1);
    return Math.max(lcs(i + 1, j), lcs(i, j + 1)); // skip one char from either side
  }
  return lcs(0, 0);
}

function memo(text1, text2) {
  const cache = new Map(); // key "i,j" -> LCS of suffixes starting at i and j
  function lcs(i, j) {
    if (i === text1.length || j === text2.length) return 0;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (text1[i] === text2[j]) result = 1 + lcs(i + 1, j + 1);
    else result = Math.max(lcs(i + 1, j), lcs(i, j + 1));
    cache.set(key, result);
    return result;
  }
  return lcs(0, 0);
}

function tabulation(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  // (m+1) x (n+1) so that row 0 / col 0 represent the empty prefix (padding trick)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function optimized(text1, text2) {
  const n = text2.length;
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= text1.length; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) curr[j] = 1 + prev[j - 1];
      else curr[j] = Math.max(prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev]; // reuse the arrays instead of allocating
  }
  return prev[n];
}

// Rebuild the actual subsequence by walking the full table backwards from (m, n).
function reconstruct(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const chars = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      chars.push(text1[i - 1]); // this char was part of the match
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--; // the value came from above
    } else {
      j--; // the value came from the left
    }
  }
  return chars.reverse().join('');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('abcde', 'ace'), 3);
  assert.strictEqual(solve('abc', 'abc'), 3);
  assert.strictEqual(solve('abc', 'def'), 0);
  assert.strictEqual(solve('', 'abc'), 0);
  assert.strictEqual(solve('', ''), 0);
  assert.strictEqual(solve('bl', 'yby'), 1);
  assert.strictEqual(solve('abcba', 'abcbcba'), 5);
}
assert.strictEqual(reconstruct('abcde', 'ace'), 'ace');
assert.strictEqual(reconstruct('abc', 'def'), '');
console.log('✓ 01-longest-common-subsequence passed');

module.exports = { bruteForce, memo, tabulation, optimized, reconstruct };
