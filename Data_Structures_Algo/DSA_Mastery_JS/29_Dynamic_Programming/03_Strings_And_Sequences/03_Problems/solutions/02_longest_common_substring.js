/**
 * 02. Longest Common Substring   (classic — Medium; LeetCode 718 is the array version
 *     "Maximum Length of Repeated Subarray")
 *
 * PROBLEM
 * Given two strings, return the length of the longest string that appears as a
 * CONTIGUOUS block in both. (Contrast with subsequence, which may skip characters.)
 *
 * EXAMPLES
 * Input: "abcdxyz", "xyzabcd"   Output: 4   Explanation: "abcd"
 * Input: "abcde",   "ace"       Output: 1   Explanation: "a", "c" or "e" (not "ace")
 * Input: "abc",     "def"       Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Empty strings allowed? (yes -> 0)
 * - Case sensitive? (assume yes)
 * - Length only, or the substring itself? (length; the end index of the max cell
 *   lets you slice it out if needed)
 *
 * APPROACH 1 — Brute force   O(m*n*min(m,n)) time, O(1) space
 * For every pair of start positions (i, j) extend while characters match and
 * record the longest run. (Written recursively below so it is a true "plain
 * recursion": common(i, j) = 1 + common(i+1, j+1) if chars match, else 0, and we
 * take the max over all starting pairs.)
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = length of the longest common SUFFIX of s1[0..i) and s2[0..j)
 *            i.e. the match must END at s1[i-1] and s2[j-1]
 * RECURRENCE if s1[i-1] === s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
 *            else:                    dp[i][j] = 0        <- the big difference from LCS
 * BASE CASES dp[0][j] = dp[i][0] = 0
 * ANSWER     max over ALL cells (not the bottom-right one, because the best block can
 *            end anywhere)
 *
 * Table for "abcde" vs "ace":
 *
 *            ""  a  c  e
 *        ""   0  0  0  0
 *        a    0  1  0  0
 *        b    0  0  0  0
 *        c    0  0  1  0
 *        d    0  0  0  0
 *        e    0  0  0  1      max = 1
 *
 * Table for "abcd" vs "xabcd" (the diagonal run shows the block "abcd"):
 *            ""  x  a  b  c  d
 *        a    0  0  1  0  0  0
 *        b    0  0  0  2  0  0
 *        c    0  0  0  0  3  0
 *        d    0  0  0  0  0  4   max = 4
 *
 * APPROACH 3 — Space optimized   O(m*n) time, O(n) space
 * Only the diagonal from the previous row is needed, so keep two rows.
 *
 * EDGE CASES
 * - empty input -> 0
 * - identical strings -> full length
 * - repeated characters like "aaa" vs "aa" -> 2
 */

function bruteForce(s1, s2) {
  // length of the common block that STARTS at (i, j)
  function common(i, j) {
    if (i === s1.length || j === s2.length || s1[i] !== s2[j]) return 0;
    return 1 + common(i + 1, j + 1);
  }
  let best = 0;
  for (let i = 0; i < s1.length; i++) {
    for (let j = 0; j < s2.length; j++) {
      best = Math.max(best, common(i, j));
    }
  }
  return best;
}

function memo(s1, s2) {
  const cache = new Map();
  function common(i, j) {
    if (i === s1.length || j === s2.length || s1[i] !== s2[j]) return 0;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    const result = 1 + common(i + 1, j + 1);
    cache.set(key, result);
    return result;
  }
  let best = 0;
  for (let i = 0; i < s1.length; i++) {
    for (let j = 0; j < s2.length; j++) {
      best = Math.max(best, common(i, j));
    }
  }
  return best;
}

function tabulation(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  let best = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        best = Math.max(best, dp[i][j]);
      }
      // else stays 0: a mismatch breaks the contiguous block
    }
  }
  return best;
}

function optimized(s1, s2) {
  const n = s2.length;
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);
  let best = 0;
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= n; j++) {
      curr[j] = s1[i - 1] === s2[j - 1] ? 1 + prev[j - 1] : 0;
      best = Math.max(best, curr[j]);
    }
    [prev, curr] = [curr, prev];
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('abcdxyz', 'xyzabcd'), 4);
  assert.strictEqual(solve('abcde', 'ace'), 1);
  assert.strictEqual(solve('abc', 'def'), 0);
  assert.strictEqual(solve('', 'abc'), 0);
  assert.strictEqual(solve('abc', 'abc'), 3);
  assert.strictEqual(solve('aaa', 'aa'), 2);
  assert.strictEqual(solve('abcd', 'xabcd'), 4);
}
console.log('✓ 02-longest-common-substring passed');

module.exports = { bruteForce, memo, tabulation, optimized };
