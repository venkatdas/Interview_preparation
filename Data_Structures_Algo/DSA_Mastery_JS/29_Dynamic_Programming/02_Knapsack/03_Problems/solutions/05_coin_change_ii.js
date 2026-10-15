/**
 * 05. Coin Change II (count ways)   (LeetCode 518 — Medium)
 *
 * PROBLEM
 * Given coin denominations and an amount, return the NUMBER of combinations
 * that make up that amount. Unlimited coins. Order does not matter:
 * 2+1+2 and 1+2+2 are the same combination.
 *
 * EXAMPLES
 * Input: amount=5, coins=[1,2,5]   Output: 4
 *   Explanation: 5 | 2+2+1 | 2+1+1+1 | 1+1+1+1+1
 * Input: amount=3, coins=[2]       Output: 0
 * Input: amount=10, coins=[10]     Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Combinations (order ignored) or permutations (order matters)? (combinations here;
 *   for permutations see 06-combination-sum-iv)
 * - amount 0? (yes -> 1 way: use no coins)
 *
 * APPROACH 1 — Brute force   O(exponential) time, O(amount) space
 * Decide how many of coin[index] to use (0, 1, 2, ...), then move to the next
 * coin. Fixing the coin order is what stops us from counting 1+2 and 2+1 twice.
 *
 * APPROACH 2 — DP (unbounded knapsack, COUNT variant)   O(n * amount) time, O(amount) space
 * STATE      dp[a] = number of combinations making amount a using coins seen so far
 * RECURRENCE dp[a] += dp[a - coin]       (ways that use at least one more of this coin)
 * BASE CASES dp[0] = 1 (one way to make 0: take nothing) - count-variant init!
 * ANSWER     dp[amount]
 *
 * LOOP ORDER MATTERS: coins outer, amount inner. Each coin is "introduced" once,
 * so every combination is counted in exactly one order (the coin order).
 *
 * Dry run: coins=[1,2,5], amount=5
 *   start         dp = [1,0,0,0,0,0]
 *   coin 1        dp = [1,1,1,1,1,1]
 *   coin 2        dp = [1,1,2,2,3,3]   dp[4] = 1 + dp[2]=2 -> 3
 *   coin 5        dp = [1,1,2,2,3,4]
 *   answer 4
 *
 * EDGE CASES
 * - amount 0 -> 1
 * - no coins and amount > 0 -> 0
 * - answers can be large; LeetCode promises they fit in 32-bit ints
 */

function bruteForce(amount, coins) {
  function ways(index, remaining) {
    if (remaining === 0) return 1;
    if (index === coins.length || remaining < 0) return 0;
    // use this coin once more (stay on index) OR move on to the next coin
    return ways(index, remaining - coins[index]) + ways(index + 1, remaining);
  }
  return ways(0, amount);
}

function memo(amount, coins) {
  const cache = new Map();
  function ways(index, remaining) {
    if (remaining === 0) return 1;
    if (index === coins.length || remaining < 0) return 0;
    const key = index + ',' + remaining;
    if (cache.has(key)) return cache.get(key);
    const result = ways(index, remaining - coins[index]) + ways(index + 1, remaining);
    cache.set(key, result);
    return result;
  }
  return ways(0, amount);
}

function tabulation(amount, coins) {
  const n = coins.length;
  // dp[i][a] = combinations for amount a using the first i coins
  const dp = Array.from({ length: n + 1 }, () => new Array(amount + 1).fill(0));
  dp[0][0] = 1;
  for (let i = 1; i <= n; i++) {
    const coin = coins[i - 1];
    for (let a = 0; a <= amount; a++) {
      dp[i][a] = dp[i - 1][a];                       // don't use this coin
      if (a >= coin) dp[i][a] += dp[i][a - coin];    // use it (same row -> reuse allowed)
    }
  }
  return dp[n][amount];
}

function optimized(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const coin of coins) {            // coins OUTER -> combinations, not permutations
    for (let a = coin; a <= amount; a++) {
      dp[a] += dp[a - coin];
    }
  }
  return dp[amount];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(5, [1, 2, 5]), 4);
  assert.strictEqual(solve(3, [2]), 0);
  assert.strictEqual(solve(10, [10]), 1);
  assert.strictEqual(solve(0, [1, 2]), 1);
  assert.strictEqual(solve(4, []), 0);
  assert.strictEqual(solve(3, [1, 2]), 2); // 1+1+1, 1+2  (not 2+1 separately)
}
console.log('✓ 05-coin-change-ii passed');

module.exports = { bruteForce, memo, tabulation, optimized };
