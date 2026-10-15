/**
 * 02. Climbing Stairs   (LeetCode 70 — Easy)
 *
 * PROBLEM
 * You are climbing a staircase with n steps. Each move you can climb 1 or 2
 * steps. How many distinct ways can you reach the top?
 *
 * EXAMPLES
 * Input: n = 2   Output: 2   Explanation: 1+1, 2
 * Input: n = 3   Output: 3   Explanation: 1+1+1, 1+2, 2+1
 * Input: n = 5   Output: 8
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 45 (answer fits in a normal number)
 * - Does order matter? (yes: 1+2 and 2+1 are different ways)
 *
 * DP DEFINITION
 * STATE:       dp[i] = number of ways to reach step i
 * RECURRENCE:  dp[i] = dp[i-1] + dp[i-2]
 *              (last move was either a 1-step from i-1 or a 2-step from i-2)
 * BASE CASES:  dp[0] = 1 (one way to stand at the bottom), dp[1] = 1
 * ANSWER:      dp[n]
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Try both moves from every step. ways(n) = ways(n-1) + ways(n-2).
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * Cache ways(i) so each step is solved once.
 *
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, n = 5:
 *   step : 0  1  2  3  4  5
 *   dp   : 1  1  2  3  5  8
 * It is Fibonacci shifted by one.
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 * Keep only the last two values.
 *
 * EDGE CASES
 * - n = 1 -> 1
 * - n = 2 -> 2
 */

function bruteForce(n) {
  if (n <= 1) return 1; // reached the top exactly (or standing at bottom)
  return bruteForce(n - 1) + bruteForce(n - 2);
}

function memo(n, cache = new Map()) {
  if (n <= 1) return 1;
  if (cache.has(n)) return cache.get(n);
  const ways = memo(n - 1, cache) + memo(n - 2, cache);
  cache.set(n, ways);
  return ways;
}

function tabulation(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  for (let step = 2; step <= n; step++) {
    dp[step] = dp[step - 1] + dp[step - 2];
  }
  return dp[n];
}

function optimized(n) {
  let twoBack = 1; // ways to reach step i-2
  let oneBack = 1; // ways to reach step i-1
  for (let step = 2; step <= n; step++) {
    const current = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(1), 1);
  assert.strictEqual(solve(2), 2);
  assert.strictEqual(solve(3), 3);
  assert.strictEqual(solve(5), 8);
  assert.strictEqual(solve(10), 89);
  assert.strictEqual(solve(20), 10946);
}
assert.strictEqual(optimized(45), 1836311903);
console.log('✓ 02-climbing-stairs passed');

module.exports = { bruteForce, memo, tabulation, optimized };
