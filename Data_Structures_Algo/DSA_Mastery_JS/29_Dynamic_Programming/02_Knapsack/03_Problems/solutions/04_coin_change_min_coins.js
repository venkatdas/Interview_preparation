/**
 * 04. Coin Change (min coins)   (LeetCode 322 — Medium)
 *
 * PROBLEM
 * Given coin denominations and an amount, return the FEWEST coins needed to make
 * exactly that amount. Unlimited coins of each kind. Return -1 if impossible.
 *
 * EXAMPLES
 * Input: coins=[1,2,5], amount=11   Output: 3    Explanation: 5 + 5 + 1
 * Input: coins=[2], amount=3        Output: -1
 * Input: coins=[1], amount=0        Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Unlimited supply of each coin? (yes -> unbounded knapsack, "min" variant)
 * - amount can be 0? (yes -> 0 coins)
 * - Greedy (largest coin first) works? (NO: coins=[1,3,4], amount 6 -> greedy 4+1+1=3, best 3+3=2)
 *
 * APPROACH 1 — Brute force   O(coins^amount) time, O(amount) space
 * For the remaining amount try every coin, recurse, take the min. Same remaining
 * amount is recomputed countless times.
 *
 * APPROACH 2 — DP (unbounded knapsack, MIN variant)   O(n * amount) time, O(amount) space
 * STATE      dp[a] = fewest coins to make amount a
 * RECURRENCE dp[a] = 1 + min over coins c <= a of dp[a - c]
 * BASE CASES dp[0] = 0; "impossible" states start as Infinity (min-variant init!)
 * ANSWER     dp[amount], or -1 if still Infinity
 *
 * Dry run: coins=[1,2,5], amount=6
 *   a:     0  1  2  3  4  5  6
 *   dp:    0  1  1  2  2  1  2      dp[6] = 1 + min(dp[5]=1, dp[4]=2, dp[1]=1) = 2  (5+1)
 *
 * EDGE CASES
 * - amount 0 -> 0
 * - no coin divides the amount -> -1
 * - coin larger than amount -> skipped
 */

function bruteForce(coins, amount) {
  function fewest(remaining) {
    if (remaining === 0) return 0;
    let best = Infinity;
    for (const coin of coins) {
      if (coin <= remaining) best = Math.min(best, 1 + fewest(remaining - coin));
    }
    return best;
  }
  const result = fewest(amount);
  return result === Infinity ? -1 : result;
}

function memo(coins, amount) {
  const cache = new Map();
  function fewest(remaining) {
    if (remaining === 0) return 0;
    if (cache.has(remaining)) return cache.get(remaining);
    let best = Infinity;
    for (const coin of coins) {
      if (coin <= remaining) best = Math.min(best, 1 + fewest(remaining - coin));
    }
    cache.set(remaining, best);
    return best;
  }
  const result = fewest(amount);
  return result === Infinity ? -1 : result;
}

function tabulation(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity); // min variant -> start at "impossible"
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] + 1 < dp[a]) dp[a] = dp[a - coin] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// coin-outer / forward loop (unbounded) - same table, different loop order.
function optimized(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 2, 5], 11), 3);
  assert.strictEqual(solve([2], 3), -1);
  assert.strictEqual(solve([1], 0), 0);
  assert.strictEqual(solve([1, 3, 4], 6), 2); // greedy would give 3
  assert.strictEqual(solve([2, 5, 10, 1], 27), 4);
  assert.strictEqual(solve([7], 5), -1);
}
console.log('✓ 04-coin-change-min-coins passed');

module.exports = { bruteForce, memo, tabulation, optimized };
