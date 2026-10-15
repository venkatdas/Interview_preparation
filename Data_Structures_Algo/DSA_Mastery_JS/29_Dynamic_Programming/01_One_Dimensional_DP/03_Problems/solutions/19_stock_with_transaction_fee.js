/**
 * 19. Best Time to Buy and Sell Stock with Transaction Fee   (LeetCode 714 — Medium)
 *
 * PROBLEM
 * prices[i] is the stock price on day i. Unlimited transactions, one share at
 * a time, and every completed transaction (buy + sell) costs `fee`.
 * Return the max profit.
 *
 * EXAMPLES
 * Input: prices = [1,3,2,8,4,9], fee = 2   Output: 8
 *   Explanation: buy 1, sell 8 (-2 fee) = 5 ; buy 4, sell 9 (-2 fee) = 3 ; total 8
 * Input: prices = [1,3,7,5,10,3], fee = 3  Output: 6
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= prices.length <= 5*10^4, 0 <= fee < 5*10^4
 * - When is the fee charged? (once per transaction; we charge it on sell)
 *
 * STATE MACHINE (two states, no cooldown)
 *    FREE  --buy-->  HOLDING  --sell (pay fee)-->  FREE
 *
 * DP DEFINITION
 * STATE:       holding[i] = max profit at end of day i while holding a share
 *              free[i]    = max profit at end of day i with no share
 * RECURRENCE:  holding[i] = max(holding[i-1], free[i-1] - prices[i])
 *              free[i]    = max(free[i-1], holding[i-1] + prices[i] - fee)
 * BASE CASES:  holding[0] = -prices[0], free[0] = 0
 * ANSWER:      free[n-1]
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Recursion on (day, holding?) trying buy / sell / wait.
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, prices = [1, 3, 2, 8, 4, 9], fee = 2:
 *   day     :  0   1   2   3   4   5
 *   price   :  1   3   2   8   4   9
 *   holding : -1  -1  -1  -1   1   1
 *   free    :  0   0   0   5   5   8
 *   free[3] = max(0, -1 + 8 - 2) = 5 ; holding[4] = max(-1, 5 - 4) = 1 ; free[5] = max(5, 1 + 9 - 2) = 8
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 *
 * EDGE CASES
 * - fee larger than any possible gain -> 0
 * - single day -> 0
 */

function bruteForce(prices, fee) {
  function bestFrom(day, holding) {
    if (day === prices.length) return 0;
    const wait = bestFrom(day + 1, holding);
    if (holding) return Math.max(wait, prices[day] - fee + bestFrom(day + 1, false));
    return Math.max(wait, -prices[day] + bestFrom(day + 1, true));
  }
  return bestFrom(0, false);
}

function memo(prices, fee) {
  const cache = new Map();
  function bestFrom(day, holding) {
    if (day === prices.length) return 0;
    const key = day * 2 + (holding ? 1 : 0);
    if (cache.has(key)) return cache.get(key);
    const wait = bestFrom(day + 1, holding);
    const result = holding
      ? Math.max(wait, prices[day] - fee + bestFrom(day + 1, false))
      : Math.max(wait, -prices[day] + bestFrom(day + 1, true));
    cache.set(key, result);
    return result;
  }
  return bestFrom(0, false);
}

function tabulation(prices, fee) {
  const n = prices.length;
  const holding = new Array(n).fill(0);
  const free = new Array(n).fill(0);
  holding[0] = -prices[0];
  for (let day = 1; day < n; day++) {
    holding[day] = Math.max(holding[day - 1], free[day - 1] - prices[day]);
    free[day] = Math.max(free[day - 1], holding[day - 1] + prices[day] - fee);
  }
  return free[n - 1];
}

function optimized(prices, fee) {
  let holding = -prices[0];
  let free = 0;
  for (let day = 1; day < prices.length; day++) {
    // compute from the previous values; order matters so use temps
    const newHolding = Math.max(holding, free - prices[day]);
    const newFree = Math.max(free, holding + prices[day] - fee);
    holding = newHolding;
    free = newFree;
  }
  return free;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 3, 2, 8, 4, 9], 2), 8);
  assert.strictEqual(solve([1, 3, 7, 5, 10, 3], 3), 6);
  assert.strictEqual(solve([1], 1), 0);
  assert.strictEqual(solve([1, 2], 5), 0);
  assert.strictEqual(solve([5, 4, 3, 2, 1], 0), 0);
  assert.strictEqual(solve([1, 4, 6, 2, 8, 3, 10, 14], 3), 13);
}
console.log('✓ 19-stock-with-transaction-fee passed');

module.exports = { bruteForce, memo, tabulation, optimized };
