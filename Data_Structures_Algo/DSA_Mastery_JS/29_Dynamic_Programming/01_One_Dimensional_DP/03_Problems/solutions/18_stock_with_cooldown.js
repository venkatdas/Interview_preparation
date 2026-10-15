/**
 * 18. Best Time to Buy and Sell Stock with Cooldown   (LeetCode 309 — Medium)
 *
 * PROBLEM
 * prices[i] is the stock price on day i. You can do as many buy/sell
 * transactions as you like (one share at a time), BUT after you sell you must
 * wait one day (cooldown) before buying again. Return the max profit.
 *
 * EXAMPLES
 * Input: [1,2,3,0,2]   Output: 3   Explanation: buy(1) sell(2) cooldown buy(0) sell(2)
 * Input: [1]           Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= prices.length <= 5000
 * - Can I hold more than one share at once? (no)
 * - Does the cooldown apply after a buy? (no, only after a sell)
 *
 * STATE MACHINE
 * Three states describe "what am I allowed to do today":
 *
 *    HOLDING  --sell-->  COOLDOWN  --wait-->  FREE  --buy-->  HOLDING
 *    (keep holding)                           (keep waiting)
 *
 * DP DEFINITION
 * STATE:       holding[i]  = max profit at end of day i while holding a share
 *              cooldown[i] = max profit at end of day i, just sold today
 *              free[i]     = max profit at end of day i, no share, free to buy
 * RECURRENCE:  holding[i]  = max(holding[i-1], free[i-1] - prices[i])
 *              cooldown[i] = holding[i-1] + prices[i]
 *              free[i]     = max(free[i-1], cooldown[i-1])
 * BASE CASES:  holding[0] = -prices[0], cooldown[0] = 0, free[0] = 0
 * ANSWER:      max(cooldown[n-1], free[n-1])   (ending while holding is never best)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Recursion on (day, holding?) that tries every buy/sell/wait decision.
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * Cache on (day, holding).
 *
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, prices = [1, 2, 3, 0, 2]:
 *   day      :  0   1   2   3   4
 *   price    :  1   2   3   0   2
 *   holding  : -1  -1  -1   1   1
 *   cooldown :  0   1   2   2   3
 *   free     :  0   0   1   2   2
 *   answer = max(3, 2) = 3
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 * Three variables instead of three arrays.
 *
 * EDGE CASES
 * - One day -> 0
 * - Strictly decreasing prices -> 0 (never buy)
 */

function bruteForce(prices) {
  function bestFrom(day, holding) {
    if (day >= prices.length) return 0;
    const wait = bestFrom(day + 1, holding);
    if (holding) {
      const sell = prices[day] + bestFrom(day + 2, false); // +2 skips the cooldown day
      return Math.max(wait, sell);
    }
    const buy = -prices[day] + bestFrom(day + 1, true);
    return Math.max(wait, buy);
  }
  return bestFrom(0, false);
}

function memo(prices) {
  const cache = new Map();
  function bestFrom(day, holding) {
    if (day >= prices.length) return 0;
    const key = day * 2 + (holding ? 1 : 0);
    if (cache.has(key)) return cache.get(key);
    const wait = bestFrom(day + 1, holding);
    let result;
    if (holding) {
      result = Math.max(wait, prices[day] + bestFrom(day + 2, false));
    } else {
      result = Math.max(wait, -prices[day] + bestFrom(day + 1, true));
    }
    cache.set(key, result);
    return result;
  }
  return bestFrom(0, false);
}

function tabulation(prices) {
  const n = prices.length;
  if (n === 0) return 0;
  const holding = new Array(n).fill(0);
  const cooldown = new Array(n).fill(0);
  const free = new Array(n).fill(0);
  holding[0] = -prices[0];
  for (let day = 1; day < n; day++) {
    holding[day] = Math.max(holding[day - 1], free[day - 1] - prices[day]);
    cooldown[day] = holding[day - 1] + prices[day];
    free[day] = Math.max(free[day - 1], cooldown[day - 1]);
  }
  return Math.max(cooldown[n - 1], free[n - 1]);
}

function optimized(prices) {
  if (prices.length === 0) return 0;
  let holding = -prices[0];
  let cooldown = 0;
  let free = 0;
  for (let day = 1; day < prices.length; day++) {
    const newHolding = Math.max(holding, free - prices[day]);
    const newCooldown = holding + prices[day];
    const newFree = Math.max(free, cooldown);
    holding = newHolding;
    cooldown = newCooldown;
    free = newFree;
  }
  return Math.max(cooldown, free);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 2, 3, 0, 2]), 3);
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([5, 4, 3, 2, 1]), 0);
  assert.strictEqual(solve([1, 2]), 1);
  assert.strictEqual(solve([2, 1, 4]), 3);
  assert.strictEqual(solve([1, 2, 4, 2, 5, 7, 2, 4, 9, 0]), 11);
}
console.log('✓ 18-stock-with-cooldown passed');

module.exports = { bruteForce, memo, tabulation, optimized };
