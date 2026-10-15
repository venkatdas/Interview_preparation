/**
 * 01. Fibonacci Number   (LeetCode 509 — Easy)
 *
 * PROBLEM
 * F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2). Given n, return F(n).
 *
 * EXAMPLES
 * Input: n = 2   Output: 1   Explanation: F(1) + F(0) = 1 + 0
 * Input: n = 3   Output: 2   Explanation: F(2) + F(1) = 1 + 1
 * Input: n = 10  Output: 55
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is n always >= 0? (yes, 0 <= n <= 30 on LeetCode)
 * - Do we need to worry about overflow? (not for n <= 30; beyond ~78 use BigInt)
 *
 * DP DEFINITION
 * STATE:       dp[i] = the i-th Fibonacci number
 * RECURRENCE:  dp[i] = dp[i-1] + dp[i-2]
 * BASE CASES:  dp[0] = 0, dp[1] = 1
 * ANSWER:      dp[n]
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space (call stack)
 * Translate the definition directly. fib(5) calls fib(3) twice, fib(2) three
 * times... the same work is repeated exponentially many times.
 *
 * APPROACH 2 — Memoization (top-down)   O(n) time, O(n) space
 * Same recursion, but store each answer in a cache the first time we compute it.
 * Every fib(i) is now computed once.
 *
 * APPROACH 3 — Tabulation (bottom-up)   O(n) time, O(n) space
 * Fill an array from 0 to n. Each cell only looks at the two cells before it.
 *
 * Dry run, n = 6:
 *   i   : 0  1  2  3  4  5  6
 *   dp  : 0  1  1  2  3  5  8
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 * We only ever read dp[i-1] and dp[i-2], so keep two variables and slide them.
 *
 * EDGE CASES
 * - n = 0 -> 0
 * - n = 1 -> 1
 */

function bruteForce(n) {
  if (n < 2) return n;
  return bruteForce(n - 1) + bruteForce(n - 2);
}

function memo(n, cache = new Map()) {
  if (n < 2) return n;
  if (cache.has(n)) return cache.get(n); // already solved this subproblem
  const result = memo(n - 1, cache) + memo(n - 2, cache);
  cache.set(n, result);
  return result;
}

function tabulation(n) {
  if (n < 2) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

function optimized(n) {
  if (n < 2) return n;
  let twoBack = 0; // dp[i-2]
  let oneBack = 1; // dp[i-1]
  for (let i = 2; i <= n; i++) {
    const current = oneBack + twoBack;
    twoBack = oneBack; // slide the window forward
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
  assert.strictEqual(solve(3), 2);
  assert.strictEqual(solve(10), 55);
  assert.strictEqual(solve(20), 6765);
}
assert.strictEqual(optimized(50), 12586269025); // too slow for bruteForce
console.log('✓ 01-fibonacci-number passed');

module.exports = { bruteForce, memo, tabulation, optimized };
