/**
 * 07. Minimum Insertion Steps to Make a String Palindrome   (LeetCode 1312 — Hard)
 *
 * PROBLEM
 * Given a string s, in one step you can insert any character at any position.
 * Return the minimum number of insertions needed to make s a palindrome.
 *
 * EXAMPLES
 * Input: "zzazz"   Output: 0   Explanation: already a palindrome
 * Input: "mbadm"   Output: 2   Explanation: "mbdadbm" or "mdbabdm"
 * Input: "leetcode" Output: 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Empty string? (0)
 * - Only insertions, or deletions too? (insertions; note that deletions give the
 *   same answer, since deleting a char mirrors inserting its twin)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Look at the two ends of the interval. If they match, nothing to insert, shrink
 * both. If not, either insert a copy of s[r] on the left (then solve [l, r-1]) or
 * a copy of s[l] on the right (then solve [l+1, r]). 1 + min of the two.
 *
 * APPROACH 2 — Interval DP (memo / tabulation)   O(n^2) time, O(n^2) space
 * STATE      dp[l][r] = min insertions to make s[l..r] a palindrome
 * RECURRENCE if s[l] === s[r]: dp[l][r] = dp[l+1][r-1]
 *            else:              dp[l][r] = 1 + min(dp[l+1][r], dp[l][r-1])
 * BASE CASES dp[i][i] = 0, and l > r -> 0
 * ANSWER     dp[0][n-1]
 *
 * Table for "mbadm" (rows = l, cols = r):
 *          r: 0  1  2  3  4
 *   l=0 m     0  1  2  3  2     dp[0][4]: 'm'=='m' -> dp[1][3] = 2
 *   l=1 b        0  1  2  2     dp[1][3]: 'b'!='m' -> 1 + min(dp[2][3]=1, dp[1][2]=1) = 2
 *   l=2 a           0  1  2
 *   l=3 d              0  1
 *   l=4 m                 0
 *
 * SHORTCUT: answer = n - LPS(s). The characters already in the longest palindromic
 * subsequence stay; every other character needs one mirror inserted. The
 * `optimized` version uses this with the two-row LPS.
 *
 * EDGE CASES
 * - "" -> 0, single char -> 0
 * - all distinct "abc" -> n - 1
 */

function bruteForce(s) {
  function minInsert(left, right) {
    if (left >= right) return 0;
    if (s[left] === s[right]) return minInsert(left + 1, right - 1);
    return 1 + Math.min(minInsert(left + 1, right), minInsert(left, right - 1));
  }
  return minInsert(0, s.length - 1);
}

function memo(s) {
  const cache = new Map();
  function minInsert(left, right) {
    if (left >= right) return 0;
    const key = left + ',' + right;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (s[left] === s[right]) result = minInsert(left + 1, right - 1);
    else result = 1 + Math.min(minInsert(left + 1, right), minInsert(left, right - 1));
    cache.set(key, result);
    return result;
  }
  return minInsert(0, s.length - 1);
}

function tabulation(s) {
  const n = s.length;
  if (n === 0) return 0;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let left = n - 1; left >= 0; left--) {
    for (let right = left + 1; right < n; right++) {
      if (s[left] === s[right]) dp[left][right] = dp[left + 1][right - 1];
      else dp[left][right] = 1 + Math.min(dp[left + 1][right], dp[left][right - 1]);
    }
  }
  return dp[0][n - 1];
}

function optimized(s) {
  // n - longest palindromic subsequence, computed with two rows
  const n = s.length;
  if (n === 0) return 0;
  let next = new Array(n).fill(0);
  let curr = new Array(n).fill(0);
  for (let left = n - 1; left >= 0; left--) {
    curr[left] = 1;
    for (let right = left + 1; right < n; right++) {
      if (s[left] === s[right]) curr[right] = 2 + next[right - 1];
      else curr[right] = Math.max(next[right], curr[right - 1]);
    }
    [next, curr] = [curr, next];
  }
  return n - next[n - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('zzazz'), 0);
  assert.strictEqual(solve('mbadm'), 2);
  assert.strictEqual(solve('leetcode'), 5);
  assert.strictEqual(solve(''), 0);
  assert.strictEqual(solve('a'), 0);
  assert.strictEqual(solve('abc'), 2);
  assert.strictEqual(solve('ab'), 1);
}
console.log('✓ 07-minimum-insertions-to-make-palindrome passed');

module.exports = { bruteForce, memo, tabulation, optimized };
