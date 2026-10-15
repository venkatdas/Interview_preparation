/**
 * 04. N-th Tribonacci Number   (LeetCode 1137 — Easy)
 *
 * PROBLEM
 * T(0) = 0, T(1) = 1, T(2) = 1, T(n) = T(n-1) + T(n-2) + T(n-3). Return T(n).
 *
 * EXAMPLES
 * Input: n = 4    Output: 4    Explanation: T3 = 0+1+1 = 2, T4 = 1+1+2 = 4
 * Input: n = 25   Output: 1389537
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 37 (fits in a normal number)
 *
 * DP DEFINITION
 * STATE:       dp[i] = T(i)
 * RECURRENCE:  dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
 * BASE CASES:  dp[0] = 0, dp[1] = 1, dp[2] = 1
 * ANSWER:      dp[n]
 *
 * APPROACH 1 — Brute force   O(3^n) time, O(n) space
 * Three recursive calls per level. Even worse than Fibonacci.
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, n = 6:
 *   i   : 0  1  2  3  4  5   6
 *   dp  : 0  1  1  2  4  7  13
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 * Three rolling variables instead of two.
 *
 * EDGE CASES
 * - n = 0 -> 0, n = 1 -> 1, n = 2 -> 1
 */

function bruteForce(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  return bruteForce(n - 1) + bruteForce(n - 2) + bruteForce(n - 3);
}

function memo(n, cache = new Map()) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  if (cache.has(n)) return cache.get(n);
  const result = memo(n - 1, cache) + memo(n - 2, cache) + memo(n - 3, cache);
  cache.set(n, result);
  return result;
}

function tabulation(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 1;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3];
  }
  return dp[n];
}

function optimized(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  let threeBack = 0;
  let twoBack = 1;
  let oneBack = 1;
  for (let i = 3; i <= n; i++) {
    const current = oneBack + twoBack + threeBack;
    threeBack = twoBack;
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(1), 1);
  assert.strictEqual(solve(2), 1);
  assert.strictEqual(solve(4), 4);
  assert.strictEqual(solve(6), 13);
  assert.strictEqual(solve(15), 3136);
}
assert.strictEqual(optimized(25), 1389537);
console.log('✓ 04-nth-tribonacci passed');

module.exports = { bruteForce, memo, tabulation, optimized };
