/**
 * 04. Best Time to Buy and Sell Stock II   (LeetCode 122 — Medium)
 *
 * PROBLEM
 * prices[i] is the stock price on day i. You may buy and sell as many times as you like,
 * but you can hold at most one share at a time (sell before you buy again).
 * Return the maximum profit.
 *
 * EXAMPLES
 * Input: [7,1,5,3,6,4]   Output: 7   Explanation: buy 1 sell 5 (+4), buy 3 sell 6 (+3)
 * Input: [1,2,3,4,5]     Output: 4   Explanation: buy 1 sell 5, or collect every +1 step
 * Input: [7,6,4,3,1]     Output: 0   Explanation: prices only fall, never trade
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I buy and sell on the same day? (yes, it just gives 0 profit)
 * - Transaction fee or cooldown? (no - those variants need DP)
 *
 * APPROACH 1 — Brute force   O(2^n) time
 * On each day decide: if holding, sell or keep; if not holding, buy or wait. Recurse.
 *
 * APPROACH 2 — Optimal (collect every uphill step)   O(n) time, O(1) space
 * Whenever tomorrow's price is higher than today's, add the difference. Any uphill run
 * from a valley to a peak equals the sum of its daily rises, so collecting every positive
 * daily step is the same as buying at every valley and selling at every peak.
 *
 * WHY GREEDY WORKS
 * Profit of one trade (buy day i, sell day j) = sum of daily differences from i to j.
 * Dropping the negative differences and keeping the positive ones can only increase the sum.
 * Because unlimited trades are allowed, the best plan collects ALL positive differences and
 * none of the negative ones. No choice ever conflicts with a future choice.
 *
 * Dry run on [7,1,5,3,6,4]:
 *   7->1 : -6 skip
 *   1->5 : +4 total 4
 *   5->3 : -2 skip
 *   3->6 : +3 total 7
 *   6->4 : -2 skip  -> 7
 *
 * EDGE CASES
 * - fewer than 2 days -> 0
 * - all equal prices -> 0
 * - strictly decreasing -> 0
 */

function bruteForce(prices) {
  function go(day, holding) {
    if (day === prices.length) return 0;
    let best = go(day + 1, holding); // do nothing today
    if (holding) best = Math.max(best, prices[day] + go(day + 1, false));  // sell
    else best = Math.max(best, -prices[day] + go(day + 1, true));          // buy
    return best;
  }
  return go(0, false);
}

function optimal(prices) {
  let profit = 0;
  for (let day = 1; day < prices.length; day++) {
    const rise = prices[day] - prices[day - 1];
    if (rise > 0) profit += rise; // collect every uphill step
  }
  return profit;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([7, 1, 5, 3, 6, 4]), 7);
  assert.strictEqual(solve([1, 2, 3, 4, 5]), 4);
  assert.strictEqual(solve([7, 6, 4, 3, 1]), 0);
  assert.strictEqual(solve([5]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([3, 3, 3]), 0);
  assert.strictEqual(solve([2, 1, 2, 0, 1]), 2);
}
console.log('✓ 04-best-time-to-buy-and-sell-stock-ii passed');

module.exports = { optimal, bruteForce };
