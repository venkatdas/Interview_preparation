/**
 * 11. Distinct Subsequences   (LeetCode 115 — Hard)
 *
 * PROBLEM
 * Given strings s and t, return the number of distinct subsequences of s that
 * equal t. (Count the different ways to pick positions in s that spell t.)
 *
 * EXAMPLES
 * Input: s = "rabbbit", t = "rabbit"   Output: 3
 *   Explanation: drop the 1st, 2nd or 3rd 'b' of "bbb" -> three different index sets
 * Input: s = "babgbag", t = "bag"      Output: 5
 * Input: s = "abc", t = ""             Output: 1   Explanation: pick nothing
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Count ways by index positions, not by resulting string? (yes - that is why
 *   "rabbbit" gives 3, the three results look the same)
 * - t empty? (1 way) s empty and t non-empty? (0 ways)
 * - Answer size? (fits in 32-bit int on LeetCode)
 *
 * APPROACH 1 — Brute force   O(2^m) time, O(m) space
 * At each char of s: skip it, or (if it matches t[j]) use it to match t[j].
 * Count paths that consume all of t.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = number of ways s[0..i) can produce t[0..j)
 * RECURRENCE dp[i][j] = dp[i-1][j]                               (skip s[i-1])
 *                     + (s[i-1] === t[j-1] ? dp[i-1][j-1] : 0)   (use s[i-1] for t[j-1])
 * BASE CASES dp[i][0] = 1 (empty t: one way, choose nothing); dp[0][j>0] = 0
 * ANSWER     dp[m][n]
 *
 * Table for s = "babgbag", t = "bag" (rows = prefix of s, cols = prefix of t):
 *            ""  b  a  g
 *        ""   1  0  0  0
 *        b    1  1  0  0
 *        a    1  1  1  0
 *        b    1  2  1  0     dp[3][1]: skip (1) + match b (dp[2][0]=1) = 2
 *        g    1  2  1  1
 *        b    1  3  1  1
 *        a    1  3  4  1     dp[6][2]: skip (1) + match a (dp[5][1]=3) = 4
 *        g    1  3  4  5     answer 5
 *
 * APPROACH 3 — Space optimized   O(m*n) time, O(n) space
 * One row, iterate j from RIGHT to LEFT so dp[j-1] is still the previous row's value
 * when we read it (same trick as 0/1 knapsack).
 *
 * EDGE CASES
 * - t longer than s -> 0
 * - t === "" -> 1
 * - s === "" and t non-empty -> 0
 */

function bruteForce(s, t) {
  function count(i, j) {
    if (j === t.length) return 1; // matched all of t
    if (i === s.length) return 0; // ran out of s first
    let ways = count(i + 1, j); // skip s[i]
    if (s[i] === t[j]) ways += count(i + 1, j + 1); // use s[i]
    return ways;
  }
  return count(0, 0);
}

function memo(s, t) {
  const cache = new Map();
  function count(i, j) {
    if (j === t.length) return 1;
    if (i === s.length) return 0;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    let ways = count(i + 1, j);
    if (s[i] === t[j]) ways += count(i + 1, j + 1);
    cache.set(key, ways);
    return ways;
  }
  return count(0, 0);
}

function tabulation(s, t) {
  const m = s.length;
  const n = t.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = 1; // empty t can always be formed once
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = dp[i - 1][j];
      if (s[i - 1] === t[j - 1]) dp[i][j] += dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}

function optimized(s, t) {
  const n = t.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= s.length; i++) {
    // right to left: dp[j-1] must still hold the value from the previous row
    for (let j = n; j >= 1; j--) {
      if (s[i - 1] === t[j - 1]) dp[j] += dp[j - 1];
    }
  }
  return dp[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('rabbbit', 'rabbit'), 3);
  assert.strictEqual(solve('babgbag', 'bag'), 5);
  assert.strictEqual(solve('abc', ''), 1);
  assert.strictEqual(solve('', 'a'), 0);
  assert.strictEqual(solve('ab', 'abc'), 0);
  assert.strictEqual(solve('aaa', 'a'), 3);
  assert.strictEqual(solve('aaa', 'aa'), 3);
}
console.log('✓ 11-distinct-subsequences passed');

module.exports = { bruteForce, memo, tabulation, optimized };
