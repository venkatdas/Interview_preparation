/**
 * 09. Best Time to Buy and Sell Stock IV   (LeetCode 188 — Hard)
 *
 * PROBLEM
 * Same as Stock III but with AT MOST k transactions.
 *
 * EXAMPLES
 * Input: k = 2, prices = [2,4,1]       Output: 2   Explanation: buy 2 sell 4
 * Input: k = 2, prices = [3,2,6,5,0,3] Output: 7   Explanation: 2->6 (+4), 0->3 (+3)
 * Input: k = 0, prices = [1,3]         Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= k <= 100, 1 <= n <= 1000.
 * - A transaction needs 2 days, so if k >= n / 2 we are effectively unlimited: just sum
 *   every positive day-to-day rise (greedy). Nice speedup, optional.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space
 * profit(day, holding, transactionsLeft) exactly like Stock III.
 *
 * APPROACH 2 — State machine DP   O(n * k) time, O(n * k) or O(k) space
 * STATE      dp[t][holding] after processing some days = best cash having started t
 *            transactions, holding or not.
 * RECURRENCE for each price, for t = k down to 1 (or any order with a copy):
 *              hold[t]  = max(hold[t],  free[t-1] - price)   // buy, opens transaction t
 *              free[t]  = max(free[t],  hold[t]  + price)    // sell
 * BASE CASES free[0] = 0, hold[.] = -Infinity before any day.
 * ANSWER     max over t of free[t]  (= free[k] since more transactions never hurt).
 *
 * Dry run k = 2, prices = [3,2,6,5,0,3]:
 *   price | hold1 | free1 | hold2 | free2
 *     3   |  -3   |   0   |  -3   |   0
 *     2   |  -2   |   0   |  -2   |   0
 *     6   |  -2   |   4   |  -2   |   4
 *     5   |  -2   |   4   |  -1   |   4
 *     0   |   0   |   4   |   4   |   4
 *     3   |   0   |   4   |   4   |   7   <- answer
 *
 * EDGE CASES
 * - k = 0 or n < 2 -> 0
 * - k large -> greedy (sum of positive diffs) gives the same answer, faster
 */

function bruteForce(k, prices) {
  const n = prices.length;
  function profit(day, holding, transactionsLeft) {
    if (day === n) return holding ? -Infinity : 0;
    let best = profit(day + 1, holding, transactionsLeft);
    if (holding) best = Math.max(best, prices[day] + profit(day + 1, false, transactionsLeft));
    else if (transactionsLeft > 0) {
      best = Math.max(best, -prices[day] + profit(day + 1, true, transactionsLeft - 1));
    }
    return best;
  }
  return profit(0, false, k);
}

function memo(k, prices) {
  const n = prices.length;
  // 3D cache as nested arrays: cache[day][holding][transactionsLeft]
  const cache = Array.from({ length: n }, () => [new Array(k + 1).fill(null), new Array(k + 1).fill(null)]);
  function profit(day, holding, transactionsLeft) {
    if (day === n) return holding ? -Infinity : 0;
    const h = holding ? 1 : 0;
    if (cache[day][h][transactionsLeft] !== null) return cache[day][h][transactionsLeft];
    let best = profit(day + 1, holding, transactionsLeft);
    if (holding) best = Math.max(best, prices[day] + profit(day + 1, false, transactionsLeft));
    else if (transactionsLeft > 0) {
      best = Math.max(best, -prices[day] + profit(day + 1, true, transactionsLeft - 1));
    }
    cache[day][h][transactionsLeft] = best;
    return best;
  }
  return profit(0, false, k);
}

function tabulation(k, prices) {
  const n = prices.length;
  if (n < 2 || k === 0) return 0;
  // dp[day][t] = { free, hold }
  const dp = Array.from({ length: n }, () =>
    Array.from({ length: k + 1 }, () => ({ free: -Infinity, hold: -Infinity })),
  );
  for (let t = 0; t <= k; t++) {
    dp[0][t].free = 0;
    if (t >= 1) dp[0][t].hold = -prices[0];
  }
  for (let day = 1; day < n; day++) {
    dp[day][0].free = 0;
    for (let t = 1; t <= k; t++) {
      dp[day][t].free = Math.max(dp[day - 1][t].free, dp[day - 1][t].hold + prices[day]);
      dp[day][t].hold = Math.max(dp[day - 1][t].hold, dp[day - 1][t - 1].free - prices[day]);
    }
  }
  return dp[n - 1][k].free;
}

function optimized(k, prices) {
  const n = prices.length;
  if (n < 2 || k === 0) return 0;
  if (k >= Math.floor(n / 2)) {
    // unlimited transactions: grab every rise (greedy)
    let total = 0;
    for (let day = 1; day < n; day++) total += Math.max(0, prices[day] - prices[day - 1]);
    return total;
  }
  const hold = new Array(k + 1).fill(-Infinity);
  const free = new Array(k + 1).fill(0);
  for (const price of prices) {
    // iterate t downward so free[t-1] is still "yesterday's" value when we read it
    for (let t = k; t >= 1; t--) {
      free[t] = Math.max(free[t], hold[t] + price);
      hold[t] = Math.max(hold[t], free[t - 1] - price);
    }
  }
  return free[k];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(2, [2, 4, 1]), 2);
  assert.strictEqual(solve(2, [3, 2, 6, 5, 0, 3]), 7);
  assert.strictEqual(solve(0, [1, 3]), 0);
  assert.strictEqual(solve(3, [5]), 0);
  assert.strictEqual(solve(1, [7, 6, 4, 3, 1]), 0);
  assert.strictEqual(solve(3, [1, 2, 4, 2, 5, 7, 2, 4, 9, 0]), 15);
  assert.strictEqual(solve(5, [1, 2, 3, 4, 5]), 4);
}
console.log('✓ 09-best-time-to-buy-sell-stock-iv passed');

module.exports = { bruteForce, memo, tabulation, optimized };
