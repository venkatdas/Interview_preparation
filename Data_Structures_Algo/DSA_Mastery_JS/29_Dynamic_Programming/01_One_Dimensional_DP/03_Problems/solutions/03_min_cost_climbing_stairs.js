/**
 * 03. Min Cost Climbing Stairs   (LeetCode 746 — Easy)
 *
 * PROBLEM
 * cost[i] is the price to step ON stair i. Once you pay it you can climb 1 or
 * 2 stairs. You may start at stair 0 or stair 1. Return the minimum cost to
 * reach the top (one past the last stair).
 *
 * EXAMPLES
 * Input: cost = [10,15,20]            Output: 15   Explanation: start at 1, pay 15, jump 2 to top
 * Input: cost = [1,100,1,1,1,100,1,1,100,1]  Output: 6
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 2 <= cost.length <= 1000, 0 <= cost[i] <= 999
 * - Is the "top" index n (one past the array)? (yes)
 *
 * DP DEFINITION
 * STATE:       dp[i] = min cost to reach stair i (before paying cost[i])
 * RECURRENCE:  dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
 * BASE CASES:  dp[0] = 0, dp[1] = 0 (free to start on either)
 * ANSWER:      dp[n]
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * From the top, ask: did I come from stair n-1 or n-2? Take the cheaper.
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, cost = [10, 15, 20]:
 *   i    : 0   1   2    3(top)
 *   dp   : 0   0   10   15      dp[2] = min(0+15, 0+10) = 10
 *                               dp[3] = min(10+20, 0+15) = 15
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 *
 * EDGE CASES
 * - Two stairs: answer is min(cost[0], cost[1])
 * - All zeros -> 0
 */

function bruteForce(cost) {
  function minCostToReach(stair) {
    if (stair <= 1) return 0; // starting positions are free
    return Math.min(
      minCostToReach(stair - 1) + cost[stair - 1],
      minCostToReach(stair - 2) + cost[stair - 2]
    );
  }
  return minCostToReach(cost.length);
}

function memo(cost) {
  const cache = new Map();
  function minCostToReach(stair) {
    if (stair <= 1) return 0;
    if (cache.has(stair)) return cache.get(stair);
    const result = Math.min(
      minCostToReach(stair - 1) + cost[stair - 1],
      minCostToReach(stair - 2) + cost[stair - 2]
    );
    cache.set(stair, result);
    return result;
  }
  return minCostToReach(cost.length);
}

function tabulation(cost) {
  const n = cost.length;
  const dp = new Array(n + 1).fill(0);
  for (let stair = 2; stair <= n; stair++) {
    dp[stair] = Math.min(dp[stair - 1] + cost[stair - 1], dp[stair - 2] + cost[stair - 2]);
  }
  return dp[n];
}

function optimized(cost) {
  let twoBack = 0;
  let oneBack = 0;
  for (let stair = 2; stair <= cost.length; stair++) {
    const current = Math.min(oneBack + cost[stair - 1], twoBack + cost[stair - 2]);
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([10, 15, 20]), 15);
  assert.strictEqual(solve([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]), 6);
  assert.strictEqual(solve([0, 0]), 0);
  assert.strictEqual(solve([5, 3]), 3);
  assert.strictEqual(solve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), 56);
}
console.log('✓ 03-min-cost-climbing-stairs passed');

module.exports = { bruteForce, memo, tabulation, optimized };
