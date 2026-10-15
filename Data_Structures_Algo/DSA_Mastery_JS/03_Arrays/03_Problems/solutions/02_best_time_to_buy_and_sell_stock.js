/**
 * 02. Best Time to Buy and Sell Stock   (LeetCode 121 — Easy)
 *
 * PROBLEM
 * `prices[i]` is the price of a stock on day i. Pick one day to buy and a LATER day
 * to sell. Return the maximum profit. If no profit is possible, return 0.
 *
 * EXAMPLES
 * Input: [7, 1, 5, 3, 6, 4]   Output: 5   Explanation: buy on day 1 (price 1), sell on day 4 (price 6)
 * Input: [7, 6, 4, 3, 1]      Output: 0   Explanation: prices only fall, never buy
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only one transaction? (yes, one buy + one sell)
 * - Must sell after buying? (yes, same day is not allowed)
 * - Can prices be empty or a single day? (then profit is 0)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every buy day i, try every sell day j > i and track the best prices[j] - prices[i].
 *
 * APPROACH 2 — Optimal (running minimum)   O(n) time, O(1) space
 * Walk left to right remembering the CHEAPEST price seen so far. On each day the best
 * you can do if you sell today is price - minSoFar. Keep the max of those.
 * Why it works: the best sell day's partner is always the minimum before it.
 *
 * Dry run on [7, 1, 5, 3, 6, 4]:
 *   price 7: min=7  profit 0   best 0
 *   price 1: min=1  profit 0   best 0
 *   price 5: min=1  profit 4   best 4
 *   price 3: min=1  profit 2   best 4
 *   price 6: min=1  profit 5   best 5
 *   price 4: min=1  profit 3   best 5   -> 5
 *
 * EDGE CASES
 * - Strictly decreasing prices -> 0
 * - All equal prices -> 0
 * - One day or empty -> 0
 * - Minimum at the very end (cannot be used to buy)
 */

function bruteForce(prices) {
  let best = 0;
  for (let buyDay = 0; buyDay < prices.length; buyDay++) {
    for (let sellDay = buyDay + 1; sellDay < prices.length; sellDay++) {
      best = Math.max(best, prices[sellDay] - prices[buyDay]);
    }
  }
  return best;
}

function optimal(prices) {
  let minPrice = Infinity; // cheapest price seen so far (sentinel so the first price always wins)
  let bestProfit = 0;

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;                                   // a new best day to buy
    } else {
      bestProfit = Math.max(bestProfit, price - minPrice); // sell today against the cheapest buy
    }
  }
  return bestProfit;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([7, 1, 5, 3, 6, 4]), 5);
  assert.strictEqual(solve([7, 6, 4, 3, 1]), 0);
  assert.strictEqual(solve([2, 4, 1]), 2);
  assert.strictEqual(solve([3, 3, 3]), 0);
  assert.strictEqual(solve([5]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([1, 2, 3, 4, 5]), 4);
}
console.log('✓ 02-best-time-to-buy-and-sell-stock passed');

module.exports = { optimal, bruteForce };
