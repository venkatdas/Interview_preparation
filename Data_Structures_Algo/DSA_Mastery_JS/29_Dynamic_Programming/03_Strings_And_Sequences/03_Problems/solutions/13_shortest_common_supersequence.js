/**
 * 13. Shortest Common Supersequence   (LeetCode 1092 — Hard)
 *
 * PROBLEM
 * Given strings str1 and str2, return the SHORTEST string that has both of them
 * as subsequences. If several exist, any is fine.
 *
 * EXAMPLES
 * Input: str1 = "abac", str2 = "cab"   Output: "cabac"
 *   Explanation: "cabac" contains "abac" (positions 1-4) and "cab" (positions 0-2);
 *   nothing shorter works.
 * Input: str1 = "aaaaaaaa", str2 = "aaaaaaaa"   Output: "aaaaaaaa"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Return the string or its length? (the string; the length is m + n - LCS)
 * - Empty inputs? (return the other string)
 *
 * APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space
 * Build the answer left to right. If the current chars are equal, emit it once and
 * advance both. Otherwise emit str1[i] and advance i, OR emit str2[j] and advance j;
 * keep the shorter result. Exponential because (i, j) repeats.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = length of the shortest supersequence of str1[0..i) and str2[0..j)
 * RECURRENCE if str1[i-1] === str2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
 *            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])
 * BASE CASES dp[i][0] = i, dp[0][j] = j  (supersequence of X and "" is X)
 * ANSWER     dp[m][n] is the length; walk the table backwards to build the string:
 *            - chars equal -> emit once, go diagonal
 *            - else go to the smaller neighbour and emit the char we "consumed"
 *            - when one string is exhausted, emit the rest of the other
 *
 * Table for "abac" vs "cab":
 *            ""  c  a  b
 *        ""   0  1  2  3
 *        a    1  2  2  3
 *        b    2  3  3  3
 *        a    3  4  4  4
 *        c    4  4  5  5      length 5
 *
 * Walking back from (4,3): c!=b, dp[3][3]=4 < dp[4][2]=5 -> go up, emit 'c'.
 * (3,3): a!=b, up=3 vs left=4 -> go up, emit 'a'. (2,3): b==b -> emit 'b', diagonal.
 * (1,2): a==a -> emit 'a', diagonal. (0,1): str1 exhausted, emit remaining "c".
 * Emitted in reverse: c a b a c -> reversed = "cabac".
 *
 * The `tabulation` version builds the string this way. The `memo` version stores
 * strings in the cache (simpler, more memory) to show the alternative.
 *
 * EDGE CASES
 * - one string empty -> return the other
 * - identical strings -> that string
 * - no common chars -> any concatenation of length m + n (we produce str1 + str2)
 */

function bruteForce(str1, str2) {
  function shortest(i, j) {
    if (i === str1.length) return str2.slice(j);
    if (j === str2.length) return str1.slice(i);
    if (str1[i] === str2[j]) return str1[i] + shortest(i + 1, j + 1);
    const useFirst = str1[i] + shortest(i + 1, j);
    const useSecond = str2[j] + shortest(i, j + 1);
    return useFirst.length <= useSecond.length ? useFirst : useSecond;
  }
  return shortest(0, 0);
}

function memo(str1, str2) {
  const cache = new Map();
  function shortest(i, j) {
    if (i === str1.length) return str2.slice(j);
    if (j === str2.length) return str1.slice(i);
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (str1[i] === str2[j]) {
      result = str1[i] + shortest(i + 1, j + 1);
    } else {
      const useFirst = str1[i] + shortest(i + 1, j);
      const useSecond = str2[j] + shortest(i, j + 1);
      result = useFirst.length <= useSecond.length ? useFirst : useSecond;
    }
    cache.set(key, result);
    return result;
  }
  return shortest(0, 0);
}

function tabulation(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // reconstruct by walking backwards
  const chars = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      chars.push(str1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] <= dp[i][j - 1]) {
      chars.push(str1[i - 1]); // came from above: we consumed a char of str1
      i--;
    } else {
      chars.push(str2[j - 1]); // came from the left: consumed a char of str2
      j--;
    }
  }
  while (i > 0) chars.push(str1[--i]);
  while (j > 0) chars.push(str2[--j]);
  return chars.reverse().join('');
}

// ---------- tests ----------
const assert = require('assert');
function isSubsequence(small, big) {
  let k = 0;
  for (const ch of big) if (k < small.length && small[k] === ch) k++;
  return k === small.length;
}
function check(solve, str1, str2, expectedLength) {
  const result = solve(str1, str2);
  assert.strictEqual(result.length, expectedLength, `${solve.name}(${str1},${str2}) -> ${result}`);
  assert.ok(isSubsequence(str1, result));
  assert.ok(isSubsequence(str2, result));
}
for (const solve of [bruteForce, memo, tabulation]) {
  check(solve, 'abac', 'cab', 5);
  check(solve, 'aaaaaaaa', 'aaaaaaaa', 8);
  check(solve, '', 'abc', 3);
  check(solve, 'abc', '', 3);
  check(solve, 'abc', 'xyz', 6);
  check(solve, 'geek', 'eke', 5);
  check(solve, 'abcde', 'ace', 5);
}
console.log('✓ 13-shortest-common-supersequence passed');

module.exports = { bruteForce, memo, tabulation };
