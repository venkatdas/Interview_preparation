/**
 * 12. Interleaving String   (LeetCode 97 — Medium)
 *
 * PROBLEM
 * Given strings s1, s2 and s3, return true if s3 can be formed by interleaving
 * s1 and s2: all characters of both are used, each keeps its own order, and the
 * two sequences can be mixed in any way.
 *
 * EXAMPLES
 * Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"   Output: true
 *   Explanation: aa + dbb + c + bc + a + c   (s1 parts: aa,c,c  s2 parts: dbb,bc,a)
 * Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"   Output: false
 * Input: s1 = "", s2 = "", s3 = ""                        Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Must all characters be used? (yes: if s1.length + s2.length !== s3.length -> false)
 * - Empty strings allowed? (yes)
 *
 * APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space
 * Walk s3. The next char of s3 must come from the front of s1 OR the front of s2.
 * Try both when both match. Note k = i + j always, so the state is just (i, j).
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = can s1[0..i) and s2[0..j) interleave into s3[0..i+j)
 * RECURRENCE dp[i][j] = (s1[i-1] === s3[i+j-1] && dp[i-1][j])
 *                    || (s2[j-1] === s3[i+j-1] && dp[i][j-1])
 * BASE CASES dp[0][0] = true; dp[i][0] = s1[0..i) === s3[0..i); dp[0][j] likewise
 * ANSWER     dp[m][n]
 *
 * Table for s1 = "ab", s2 = "ac", s3 = "aabc" (rows = i chars of s1, cols = j of s2):
 *            j=0  j=1(a)  j=2(ac)
 *   i=0       T     T       F        row 0: s3 prefix must equal s2 prefix: "a" ok, "aa"!="ac"
 *   i=1(a)    T     T       F        dp[1][1]: s3[1]='a' from s1 -> dp[0][1]=T
 *   i=2(ab)   F     T       T        dp[2][2]: s3[3]='c' from s2 -> dp[2][1]=T  -> true
 *
 * APPROACH 3 — Space optimized   O(m*n) time, O(n) space
 * One row: dp[j] (same row, previous column) and old dp[j] (previous row) are both
 * reachable if we iterate j left to right.
 *
 * EDGE CASES
 * - length mismatch -> false immediately
 * - one of s1 / s2 empty -> s3 must equal the other
 * - all same chars "aa" + "aa" -> "aaaa" true
 */

function bruteForce(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  function can(i, j) {
    const k = i + j;
    if (k === s3.length) return true;
    if (i < s1.length && s1[i] === s3[k] && can(i + 1, j)) return true;
    if (j < s2.length && s2[j] === s3[k] && can(i, j + 1)) return true;
    return false;
  }
  return can(0, 0);
}

function memo(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  const cache = new Map();
  function can(i, j) {
    const k = i + j;
    if (k === s3.length) return true;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    let result = false;
    if (i < s1.length && s1[i] === s3[k] && can(i + 1, j)) result = true;
    else if (j < s2.length && s2[j] === s3[k] && can(i, j + 1)) result = true;
    cache.set(key, result);
    return result;
  }
  return can(0, 0);
}

function tabulation(s1, s2, s3) {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) return false;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let i = 1; i <= m; i++) dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const ch = s3[i + j - 1];
      dp[i][j] = (s1[i - 1] === ch && dp[i - 1][j]) || (s2[j - 1] === ch && dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function optimized(s1, s2, s3) {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) return false;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let j = 1; j <= n; j++) dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];
  for (let i = 1; i <= m; i++) {
    dp[0] = dp[0] && s1[i - 1] === s3[i - 1]; // column 0 of this row
    for (let j = 1; j <= n; j++) {
      const ch = s3[i + j - 1];
      // dp[j] still holds the previous row (take from s1); dp[j-1] is this row (take from s2)
      dp[j] = (s1[i - 1] === ch && dp[j]) || (s2[j - 1] === ch && dp[j - 1]);
    }
  }
  return dp[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('aabcc', 'dbbca', 'aadbbcbcac'), true);
  assert.strictEqual(solve('aabcc', 'dbbca', 'aadbbbaccc'), false);
  assert.strictEqual(solve('', '', ''), true);
  assert.strictEqual(solve('', 'abc', 'abc'), true);
  assert.strictEqual(solve('ab', 'ac', 'aabc'), true);
  assert.strictEqual(solve('a', 'b', 'abc'), false);
  assert.strictEqual(solve('aa', 'aa', 'aaaa'), true);
  assert.strictEqual(solve('abc', 'def', 'adbecf'), true);
}
console.log('✓ 12-interleaving-string passed');

module.exports = { bruteForce, memo, tabulation, optimized };
