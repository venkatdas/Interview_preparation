/**
 * 01. 0/1 Knapsack (basic)   (classic — Medium)
 *
 * PROBLEM
 * You have n items. Item i has weight weights[i] and value values[i]. Your bag
 * holds at most `capacity` weight. Each item can be taken at most ONCE (0 or 1
 * times). Return the maximum total value you can carry.
 *
 * EXAMPLES
 * Input: weights=[1,3,4,5], values=[1,4,5,7], capacity=7   Output: 9
 *   Explanation: take items with weight 3 and 4 (3+4=7) -> value 4+5 = 9
 * Input: weights=[2,3], values=[3,4], capacity=1            Output: 0   (nothing fits)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can an item be taken more than once? (no -> that's unbounded knapsack, file 02)
 * - Are weights/capacity integers? (yes, DP needs integer capacities as indexes)
 * - Must the bag be exactly full? (no, "at most" capacity)
 *
 * APPROACH 1 — Brute force (try every subset)   O(2^n) time, O(n) recursion space
 * For each item decide: skip it, or take it if it fits. Two branches per item,
 * n items -> 2^n leaves.
 *
 * APPROACH 2 — DP (0/1 knapsack)   O(n * capacity) time, O(n * capacity) -> O(capacity) space
 * STATE      dp[i][c] = max value using only the first i items with capacity c
 * RECURRENCE dp[i][c] = max( dp[i-1][c],                         // skip item i
 *                            values[i-1] + dp[i-1][c - weights[i-1]] )   // take it (if it fits)
 * BASE CASES dp[0][c] = 0 (no items -> no value), dp[i][0] = 0 (no room)
 * ANSWER     dp[n][capacity]
 *
 * Dry run: weights=[1,3,4], values=[1,4,5], capacity=5
 *            c=0  1  2  3  4  5
 *   i=0       0   0  0  0  0  0     (no items)
 *   i=1 (w1)  0   1  1  1  1  1
 *   i=2 (w3)  0   1  1  4  5  5     c=4: max(1, 4 + dp[1][1]=1) = 5
 *   i=3 (w4)  0   1  1  4  5  6     c=5: max(5, 5 + dp[2][1]=1) = 6
 *   answer dp[3][5] = 6 (items w1 + w4)
 *
 * Space optimisation: row i only needs row i-1, so keep one row and walk c from
 * capacity DOWN to weight. Going down guarantees dp[c - w] is still the old row
 * value, so the current item is never counted twice.
 *
 * EDGE CASES
 * - capacity 0 or empty items -> 0
 * - every item heavier than capacity -> 0
 * - one item exactly equal to capacity -> its value
 */

function bruteForce(weights, values, capacity) {
  function best(index, room) {
    if (index === weights.length) return 0;
    const skip = best(index + 1, room);
    if (weights[index] > room) return skip;
    const take = values[index] + best(index + 1, room - weights[index]);
    return Math.max(skip, take);
  }
  return best(0, capacity);
}

function memo(weights, values, capacity) {
  const cache = new Map(); // key "index,room" -> best value
  function best(index, room) {
    if (index === weights.length) return 0;
    const key = index + ',' + room;
    if (cache.has(key)) return cache.get(key);
    let result = best(index + 1, room);
    if (weights[index] <= room) {
      result = Math.max(result, values[index] + best(index + 1, room - weights[index]));
    }
    cache.set(key, result);
    return result;
  }
  return best(0, capacity);
}

function tabulation(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const weight = weights[i - 1];
    const value = values[i - 1];
    for (let c = 0; c <= capacity; c++) {
      dp[i][c] = dp[i - 1][c]; // skip
      if (weight <= c) dp[i][c] = Math.max(dp[i][c], value + dp[i - 1][c - weight]); // take
    }
  }
  return dp[n][capacity];
}

function optimized(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    // reversed loop: dp[c - weights[i]] has not been touched for item i yet
    for (let c = capacity; c >= weights[i]; c--) {
      dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
    }
  }
  return dp[capacity];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 3, 4, 5], [1, 4, 5, 7], 7), 9);
  assert.strictEqual(solve([1, 3, 4], [1, 4, 5], 5), 6);
  assert.strictEqual(solve([2, 3], [3, 4], 1), 0);
  assert.strictEqual(solve([], [], 10), 0);
  assert.strictEqual(solve([5], [10], 5), 10);
  assert.strictEqual(solve([1, 2, 3], [6, 10, 12], 5), 22);
  assert.strictEqual(solve([4, 5, 1], [1, 2, 3], 4), 3);
}
console.log('✓ 01-knapsack-01-basic passed');

module.exports = { bruteForce, memo, tabulation, optimized };
