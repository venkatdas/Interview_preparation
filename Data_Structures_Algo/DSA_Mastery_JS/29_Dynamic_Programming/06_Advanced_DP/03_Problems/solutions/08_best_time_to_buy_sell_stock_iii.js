/**
 * 08. Best Time to Buy and Sell Stock III   (LeetCode 123 — Hard)
 *
 * PROBLEM
 * Given daily prices, you may complete AT MOST TWO transactions (buy then sell, and you
 * must sell before buying again). Return the maximum profit.
 *
 * EXAMPLES
 * Input: [3,3,5,0,0,3,1,4]   Output: 6   Explanation: buy 0 sell 3 (+3), buy 1 sell 4 (+3)
 * Input: [1,2,3,4,5]         Output: 4   Explanation: one transaction 1 -> 5 is enough
 * Input: [7,6,4,3,1]         Output: 0   Explanation: never buy
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 10^5, prices >= 0.
 * - "At most" two: doing zero or one transaction is allowed.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space
 * profit(day, holding, transactionsLeft): each day either skip, or buy (if not holding
 * and transactions left), or sell (if holding). Exponential.
 *
 * APPROACH 2 — State machine DP   O(n * 2 * 3) = O(n) time, O(n) or O(1) space
 * STATE      dp[day][t][holding] = best cash so far at end of `day`, having STARTED t
 *            transactions (t in 0..2), holding = 1 if we own a share.
 *            A transaction is "counted" when we buy.
 * RECURRENCE dp[day][t][0] = max(dp[day-1][t][0],              // rest
 *                                dp[day-1][t][1] + price)      // sell
 *            dp[day][t][1] = max(dp[day-1][t][1],              // rest
 *                                dp[day-1][t-1][0] - price)    // buy (uses a transaction)
 * BASE CASES before day 0: dp[.][0][0] = 0, every "holding" state = -Infinity
 *            (impossible to hold without buying).
 * ANSWER     max over t of dp[n-1][t][0].
 *
 * The state machine (per transaction t):
 *     rest            rest
 *    +---+           +---+
 *    |   v   buy     |   v   sell
 *   [t-1, 0] -----> [t, 1] -----> [t, 0]
 *
 * Dry run [3,3,5,0,0,3,1,4] using the 4-variable version (buy1, sell1, buy2, sell2):
 *   price | buy1 (max -p) | sell1 (buy1+p) | buy2 (sell1-p) | sell2 (buy2+p)
 *     3   |     -3        |      0         |     -3         |      0
 *     3   |     -3        |      0         |     -3         |      0
 *     5   |     -3        |      2         |     -3         |      2
 *     0   |      0        |      2         |      2         |      2
 *     0   |      0        |      2         |      2         |      2
 *     3   |      0        |      3         |      2         |      5
 *     1   |      0        |      3         |      2         |      5
 *     4   |      0        |      4         |      2         |      6   <- answer
 *
 * EDGE CASES
 * - n = 1 -> 0
 * - strictly decreasing -> 0
 */

const MAX_TRANSACTIONS = 2;

function bruteForce(prices) {
  const n = prices.length;
  function profit(day, holding, transactionsLeft) {
    if (day === n) return holding ? -Infinity : 0;
    let best = profit(day + 1, holding, transactionsLeft);              // rest
    if (holding) {
      best = Math.max(best, prices[day] + profit(day + 1, false, transactionsLeft)); // sell
    } else if (transactionsLeft > 0) {
      best = Math.max(best, -prices[day] + profit(day + 1, true, transactionsLeft - 1)); // buy
    }
    return best;
  }
  return profit(0, false, MAX_TRANSACTIONS);
}

function memo(prices) {
  const n = prices.length;
  // key encoded as a single integer: (day * 2 + holding) * 3 + transactionsLeft
  const cache = new Map();
  function profit(day, holding, transactionsLeft) {
    if (day === n) return holding ? -Infinity : 0;
    const key = (day * 2 + (holding ? 1 : 0)) * (MAX_TRANSACTIONS + 1) + transactionsLeft;
    if (cache.has(key)) return cache.get(key);
    let best = profit(day + 1, holding, transactionsLeft);
    if (holding) {
      best = Math.max(best, prices[day] + profit(day + 1, false, transactionsLeft));
    } else if (transactionsLeft > 0) {
      best = Math.max(best, -prices[day] + profit(day + 1, true, transactionsLeft - 1));
    }
    cache.set(key, best);
    return best;
  }
  return profit(0, false, MAX_TRANSACTIONS);
}

function tabulation(prices) {
  const n = prices.length;
  const T = MAX_TRANSACTIONS;
  // dp[day][t][holding]
  const dp = Array.from({ length: n }, () =>
    Array.from({ length: T + 1 }, () => [-Infinity, -Infinity]),
  );
  for (let t = 0; t <= T; t++) {
    dp[0][t][0] = 0;                              // no stock, no money moved
    if (t >= 1) dp[0][t][1] = -prices[0];         // bought on day 0 (transaction t)
  }
  for (let day = 1; day < n; day++) {
    for (let t = 0; t <= T; t++) {
      dp[day][t][0] = Math.max(dp[day - 1][t][0], dp[day - 1][t][1] + prices[day]);
      dp[day][t][1] = t === 0
        ? -Infinity
        : Math.max(dp[day - 1][t][1], dp[day - 1][t - 1][0] - prices[day]);
    }
  }
  let best = 0;
  for (let t = 0; t <= T; t++) best = Math.max(best, dp[n - 1][t][0]);
  return best;
}

function optimized(prices) {
  // Four running states: best cash after 1st buy, 1st sell, 2nd buy, 2nd sell.
  let buy1 = -Infinity, sell1 = 0, buy2 = -Infinity, sell2 = 0;
  for (const price of prices) {
    buy1 = Math.max(buy1, -price);          // first buy: spend price
    sell1 = Math.max(sell1, buy1 + price);  // first sell
    buy2 = Math.max(buy2, sell1 - price);   // second buy funded by first profit
    sell2 = Math.max(sell2, buy2 + price);  // second sell
  }
  return sell2;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([3, 3, 5, 0, 0, 3, 1, 4]), 6);
  assert.strictEqual(solve([1, 2, 3, 4, 5]), 4);
  assert.strictEqual(solve([7, 6, 4, 3, 1]), 0);
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([1, 2, 4, 2, 5, 7, 2, 4, 9, 0]), 13);
  assert.strictEqual(solve([2, 1, 2, 0, 1]), 2);
}
console.log('✓ 08-best-time-to-buy-sell-stock-iii passed');

module.exports = { bruteForce, memo, tabulation, optimized };
