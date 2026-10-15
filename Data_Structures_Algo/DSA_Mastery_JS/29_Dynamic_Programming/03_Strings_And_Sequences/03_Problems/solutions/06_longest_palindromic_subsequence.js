/**
 * 06. Longest Palindromic Subsequence   (LeetCode 516 — Medium)
 *
 * PROBLEM
 * Given a string s, return the length of the longest subsequence (may skip chars,
 * order kept) that is a palindrome.
 *
 * EXAMPLES
 * Input: "bbbab"   Output: 4   Explanation: "bbbb"
 * Input: "cbbd"    Output: 2   Explanation: "bb"
 * Input: "abcd"    Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Empty string? (0)
 * - Subsequence, not substring? (yes - we can skip characters)
 * - Length only? (yes)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Recursion on the interval [l, r]: if the ends match, keep both and shrink inside;
 * otherwise drop the left end OR the right end and take the better. Exponential
 * because (l, r) pairs repeat.
 *
 * APPROACH 2 — Interval DP (memo / tabulation)   O(n^2) time, O(n^2) space
 * STATE      dp[l][r] = longest palindromic subsequence length inside s[l..r]
 * RECURRENCE if s[l] === s[r]: dp[l][r] = 2 + dp[l+1][r-1]   (l < r)
 *            else:              dp[l][r] = max(dp[l+1][r], dp[l][r-1])
 * BASE CASES dp[i][i] = 1; empty interval (l > r) = 0
 * ORDER      l from n-1 down to 0, r from l+1 up to n-1 (so l+1 row is done)
 * ANSWER     dp[0][n-1]
 *
 * Table for "bbbab" (rows = l, cols = r):
 *          r: 0  1  2  3  4
 *   l=0 b     1  2  3  3  4     dp[0][4]: 'b'=='b' -> 2 + dp[1][3] = 2 + 2 = 4
 *   l=1 b        1  2  2  3
 *   l=2 b           1  1  3     dp[2][4]: 'b'=='b' -> 2 + dp[3][3] = 3
 *   l=3 a              1  1
 *   l=4 b                 1
 *
 * TRICK: LPS(s) === LCS(s, reverse(s)). Same answer, and a good thing to mention.
 *
 * APPROACH 3 — Space optimized   O(n^2) time, O(n) space
 * Row l only needs row l+1, so keep two rows.
 *
 * EDGE CASES
 * - "" -> 0
 * - single char -> 1
 * - whole string is a palindrome -> n
 * - all distinct -> 1
 */

function bruteForce(s) {
  function lps(left, right) {
    if (left > right) return 0;
    if (left === right) return 1;
    if (s[left] === s[right]) return 2 + lps(left + 1, right - 1);
    return Math.max(lps(left + 1, right), lps(left, right - 1));
  }
  return lps(0, s.length - 1);
}

function memo(s) {
  const cache = new Map();
  function lps(left, right) {
    if (left > right) return 0;
    if (left === right) return 1;
    const key = left + ',' + right;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (s[left] === s[right]) result = 2 + lps(left + 1, right - 1);
    else result = Math.max(lps(left + 1, right), lps(left, right - 1));
    cache.set(key, result);
    return result;
  }
  return lps(0, s.length - 1);
}

function tabulation(s) {
  const n = s.length;
  if (n === 0) return 0;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let left = n - 1; left >= 0; left--) {
    dp[left][left] = 1;
    for (let right = left + 1; right < n; right++) {
      if (s[left] === s[right]) dp[left][right] = 2 + dp[left + 1][right - 1];
      else dp[left][right] = Math.max(dp[left + 1][right], dp[left][right - 1]);
    }
  }
  return dp[0][n - 1];
}

function optimized(s) {
  const n = s.length;
  if (n === 0) return 0;
  let next = new Array(n).fill(0); // row left+1
  let curr = new Array(n).fill(0); // row left
  for (let left = n - 1; left >= 0; left--) {
    curr[left] = 1;
    for (let right = left + 1; right < n; right++) {
      if (s[left] === s[right]) curr[right] = 2 + next[right - 1];
      else curr[right] = Math.max(next[right], curr[right - 1]);
    }
    [next, curr] = [curr, next];
  }
  return next[n - 1]; // after the swap, `next` holds row 0
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('bbbab'), 4);
  assert.strictEqual(solve('cbbd'), 2);
  assert.strictEqual(solve('abcd'), 1);
  assert.strictEqual(solve(''), 0);
  assert.strictEqual(solve('a'), 1);
  assert.strictEqual(solve('racecar'), 7);
  assert.strictEqual(solve('agbdba'), 5);
}
console.log('✓ 06-longest-palindromic-subsequence passed');

module.exports = { bruteForce, memo, tabulation, optimized };
