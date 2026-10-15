/**
 * 15. Coin Change   (LeetCode 322 — Medium)
 *
 * PROBLEM
 * Given coin denominations and an amount, return the FEWEST coins needed to
 * make that amount, or -1 if impossible. You have unlimited coins of each kind.
 *
 * EXAMPLES
 * Input: coins = [1,2,5], amount = 11   Output: 3    Explanation: 5 + 5 + 1
 * Input: coins = [2], amount = 3        Output: -1
 * Input: coins = [1], amount = 0        Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= coins.length <= 12, 1 <= coins[i] <= 2^31-1, 0 <= amount <= 10^4
 * - Unlimited supply of each coin? (yes - this is the UNBOUNDED version)
 *
 * This file is the plain 1D "DP on amount" view. The same problem appears in
 * ../../29_Dynamic_Programming/02_Knapsack/ as an unbounded knapsack; both views give the same code.
 *
 * DP DEFINITION
 * STATE:       dp[a] = fewest coins to make amount a  (Infinity if impossible)
 * RECURRENCE:  dp[a] = 1 + min over coins c <= a of dp[a - c]
 * BASE CASES:  dp[0] = 0
 * ANSWER:      dp[amount] === Infinity ? -1 : dp[amount]
 *
 * APPROACH 1 — Brute force   O(coins^amount) time
 * Subtract every coin and recurse. Exponential branching.
 *
 * APPROACH 2 — Memoization   O(amount * coins) time, O(amount) space
 * APPROACH 3 — Tabulation   O(amount * coins) time, O(amount) space
 * Dry run, coins = [1, 2, 5], amount = 11:
 *   a   : 0  1  2  3  4  5  6  7  8  9  10 11
 *   dp  : 0  1  1  2  2  1  2  2  3  3  2  3
 *   dp[11] = 1 + min(dp[10], dp[9], dp[6]) = 1 + min(2, 3, 2) = 3
 *
 * EDGE CASES
 * - amount = 0 -> 0
 * - no combination works -> -1 (keep Infinity in the table, convert at the end)
 * - a coin larger than amount is simply skipped
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
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([1, 2, 5], 11), 3);
  assert.strictEqual(solve([2], 3), -1);
  assert.strictEqual(solve([1], 0), 0);
  assert.strictEqual(solve([1], 2), 2);
  assert.strictEqual(solve([3, 7], 13), 3);
  assert.strictEqual(solve([5, 10], 12), -1);
}
assert.strictEqual(tabulation([186, 419, 83, 408], 6249), 20);
console.log('✓ 15-coin-change passed');

module.exports = { bruteForce, memo, tabulation };
