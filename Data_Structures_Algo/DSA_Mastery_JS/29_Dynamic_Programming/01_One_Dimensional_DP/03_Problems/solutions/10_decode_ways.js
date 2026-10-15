/**
 * 10. Decode Ways   (LeetCode 91 — Medium)
 *
 * PROBLEM
 * 'A' -> "1", 'B' -> "2", ..., 'Z' -> "26". Given a string of digits,
 * count how many ways it can be decoded into letters.
 *
 * EXAMPLES
 * Input: "12"    Output: 2   Explanation: "AB" (1 2) or "L" (12)
 * Input: "226"   Output: 3   Explanation: "BZ" (2 26), "VF" (22 6), "BBF" (2 2 6)
 * Input: "06"    Output: 0   Explanation: "06" is not valid (leading zero)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= s.length <= 100, only digits
 * - Is "0" alone decodable? (no) Is "10" decodable? (yes, as "J")
 *
 * DP DEFINITION
 * STATE:       dp[i] = number of ways to decode the first i characters s[0..i-1]
 * RECURRENCE:  dp[i] = (s[i-1] != '0' ? dp[i-1] : 0)                // one digit
 *                    + (10 <= s[i-2..i-1] <= 26 ? dp[i-2] : 0)       // two digits
 * BASE CASES:  dp[0] = 1 (empty string: one way, decode nothing), dp[1] = s[0] != '0' ? 1 : 0
 * ANSWER:      dp[n]
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * At each position, try taking 1 digit (if not '0') and 2 digits (if 10..26).
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, s = "226":
 *   i    : 0   1    2     3
 *   dp   : 1   1    2     3
 *   dp[2]: '2' ok -> dp[1]=1 ; "22" ok -> dp[0]=1 ; total 2
 *   dp[3]: '6' ok -> dp[2]=2 ; "26" ok -> dp[1]=1 ; total 3
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 *
 * EDGE CASES
 * - "0"   -> 0
 * - "10"  -> 1
 * - "100" -> 0 (the second 0 has nothing valid to pair with)
 * - "27"  -> 1 (27 > 26, only "2","7")
 */

function isValidPair(twoDigits) {
  return twoDigits >= 10 && twoDigits <= 26;
}

function bruteForce(s) {
  function waysFrom(index) {
    if (index === s.length) return 1; // consumed everything: one valid decoding
    if (s[index] === '0') return 0; // a '0' can never start a letter
    let ways = waysFrom(index + 1);
    if (index + 1 < s.length && isValidPair(Number(s.slice(index, index + 2)))) {
      ways += waysFrom(index + 2);
    }
    return ways;
  }
  return waysFrom(0);
}

function memo(s) {
  const cache = new Map();
  function waysFrom(index) {
    if (index === s.length) return 1;
    if (s[index] === '0') return 0;
    if (cache.has(index)) return cache.get(index);
    let ways = waysFrom(index + 1);
    if (index + 1 < s.length && isValidPair(Number(s.slice(index, index + 2)))) {
      ways += waysFrom(index + 2);
    }
    cache.set(index, ways);
    return ways;
  }
  return waysFrom(0);
}

function tabulation(s) {
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] === '0' ? 0 : 1;
  for (let i = 2; i <= n; i++) {
    if (s[i - 1] !== '0') dp[i] += dp[i - 1];
    if (isValidPair(Number(s.slice(i - 2, i)))) dp[i] += dp[i - 2];
  }
  return dp[n];
}

function optimized(s) {
  let twoBack = 1; // dp[i-2]
  let oneBack = s[0] === '0' ? 0 : 1; // dp[i-1]
  for (let i = 2; i <= s.length; i++) {
    let current = 0;
    if (s[i - 1] !== '0') current += oneBack;
    if (isValidPair(Number(s.slice(i - 2, i)))) current += twoBack;
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve('12'), 2);
  assert.strictEqual(solve('226'), 3);
  assert.strictEqual(solve('06'), 0);
  assert.strictEqual(solve('0'), 0);
  assert.strictEqual(solve('10'), 1);
  assert.strictEqual(solve('100'), 0);
  assert.strictEqual(solve('27'), 1);
  assert.strictEqual(solve('11111111111111111111'), 10946);
}
console.log('✓ 10-decode-ways passed');

module.exports = { bruteForce, memo, tabulation, optimized };
