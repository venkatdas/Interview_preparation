/**
 * 08. Delete Operation for Two Strings   (LeetCode 583 — Medium)
 *
 * PROBLEM
 * Given two strings word1 and word2, return the minimum number of single-character
 * deletions (from either string) needed to make the two strings equal.
 *
 * EXAMPLES
 * Input: "sea", "eat"       Output: 2   Explanation: "sea" -> "ea", "eat" -> "ea"
 * Input: "leetcode", "etco" Output: 4
 * Input: "abc", "abc"       Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Empty strings? (then we delete everything from the other -> its length)
 * - Only deletions allowed? (yes - no insert/replace, that is Edit Distance)
 *
 * APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space
 * If the current chars match, keep both and move on. Otherwise delete from word1
 * OR from word2 (cost 1 each) and take the smaller.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = min deletions to make word1[0..i) and word2[0..j) equal
 * RECURRENCE if word1[i-1] === word2[j-1]: dp[i][j] = dp[i-1][j-1]
 *            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])
 * BASE CASES dp[i][0] = i, dp[0][j] = j  (delete every char of the non-empty one)
 * ANSWER     dp[m][n]
 *
 * Table for "sea" vs "eat":
 *            ""  e  a  t
 *        ""   0  1  2  3
 *        s    1  2  3  4
 *        e    2  1  2  3
 *        a    3  2  1  2      answer 2
 *
 * SHORTCUT: answer = m + n - 2 * LCS. Everything outside the LCS must be deleted.
 * `optimized` uses this with a two-row LCS, O(min) space.
 *
 * EDGE CASES
 * - both empty -> 0
 * - one empty -> length of the other
 * - nothing in common -> m + n
 */

function bruteForce(word1, word2) {
  function minDelete(i, j) {
    if (i === word1.length) return word2.length - j; // delete the rest of word2
    if (j === word2.length) return word1.length - i;
    if (word1[i] === word2[j]) return minDelete(i + 1, j + 1);
    return 1 + Math.min(minDelete(i + 1, j), minDelete(i, j + 1));
  }
  return minDelete(0, 0);
}

function memo(word1, word2) {
  const cache = new Map();
  function minDelete(i, j) {
    if (i === word1.length) return word2.length - j;
    if (j === word2.length) return word1.length - i;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (word1[i] === word2[j]) result = minDelete(i + 1, j + 1);
    else result = 1 + Math.min(minDelete(i + 1, j), minDelete(i, j + 1));
    cache.set(key, result);
    return result;
  }
  return minDelete(0, 0);
}

function tabulation(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function optimized(word1, word2) {
  const n = word2.length;
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= word1.length; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) curr[j] = 1 + prev[j - 1];
      else curr[j] = Math.max(prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  const lcs = prev[n];
  return word1.length + word2.length - 2 * lcs;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('sea', 'eat'), 2);
  assert.strictEqual(solve('leetcode', 'etco'), 4);
  assert.strictEqual(solve('abc', 'abc'), 0);
  assert.strictEqual(solve('', ''), 0);
  assert.strictEqual(solve('', 'abc'), 3);
  assert.strictEqual(solve('abc', 'xyz'), 6);
  assert.strictEqual(solve('a', 'b'), 2);
}
console.log('✓ 08-delete-operation-for-two-strings passed');

module.exports = { bruteForce, memo, tabulation, optimized };
