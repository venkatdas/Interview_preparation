/**
 * 02. Unbounded Knapsack (basic)   (classic — Medium)
 *
 * PROBLEM
 * Same as 0/1 knapsack, but you have an UNLIMITED supply of every item: you may
 * take item i zero, one, two, ... times. Return the maximum value that fits in
 * `capacity`.
 *
 * EXAMPLES
 * Input: weights=[2,3], values=[3,5], capacity=7   Output: 11
 *   Explanation: 2+2+3 = 7 -> 3+3+5 = 11
 * Input: weights=[5], values=[10], capacity=4      Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Truly unlimited copies? (yes; a per-item limit would be "bounded knapsack")
 * - Integer weights? (yes)
 *
 * APPROACH 1 — Brute force   O(exponential) time, O(capacity) recursion space
 * At each step pick ANY item that still fits and recurse with the smaller room.
 * Massive repeated work (room 3 is reached in many different ways).
 *
 * APPROACH 2 — DP (unbounded knapsack)   O(n * capacity) time, O(capacity) space
 * STATE      dp[c] = max value that fits into capacity c
 * RECURRENCE dp[c] = max over items i with weights[i] <= c of ( values[i] + dp[c - weights[i]] )
 * BASE CASES dp[0] = 0
 * ANSWER     dp[capacity]
 *
 * The 1D loop is the 0/1 loop with the capacity walking UP instead of down.
 * Going up means dp[c - w] may already include item i, so item i can be reused.
 *
 * Dry run: weights=[2,3], values=[3,5], capacity=7
 *   start           dp = [0,0,0,0,0,0,0,0]
 *   item w2 v3 (c up) dp = [0,0,3,3,6,6,9,9]
 *   item w3 v5 (c up) c=3: max(3, 5+dp[0])=5   c=4: max(6, 5+dp[1])=6
 *                     c=5: max(6, 5+dp[2]=8)=8  c=6: max(9, 5+dp[3]=10)=10
 *                     c=7: max(9, 5+dp[4]=11)=11
 *   answer 11
 *
 * EDGE CASES
 * - capacity 0 -> 0
 * - no item fits -> 0
 * - a single item: floor(capacity / weight) * value
 */

function bruteForce(weights, values, capacity) {
  function best(room) {
    let result = 0;
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= room) result = Math.max(result, values[i] + best(room - weights[i]));
    }
    return result;
  }
  return best(capacity);
}

function memo(weights, values, capacity) {
  const cache = new Array(capacity + 1).fill(-1); // state is just the room left
  function best(room) {
    if (cache[room] !== -1) return cache[room];
    let result = 0;
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= room) result = Math.max(result, values[i] + best(room - weights[i]));
    }
    cache[room] = result;
    return result;
  }
  return best(capacity);
}

// "capacity-outer" tabulation: fill dp[c] by looking at every item.
function tabulation(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let c = 1; c <= capacity; c++) {
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= c) dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
    }
  }
  return dp[capacity];
}

// "item-outer" version with the forward loop - the shape that mirrors 0/1 knapsack.
function optimized(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let c = weights[i]; c <= capacity; c++) { // forward: reuse allowed
      dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
    }
  }
  return dp[capacity];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([2, 3], [3, 5], 7), 11);
  assert.strictEqual(solve([5], [10], 4), 0);
  assert.strictEqual(solve([5], [10], 12), 20);
  assert.strictEqual(solve([1, 3, 4, 5], [1, 4, 5, 7], 7), 9);
  assert.strictEqual(solve([1, 50], [1, 30], 10), 10);
  assert.strictEqual(solve([], [], 5), 0);
  assert.strictEqual(solve([2, 3], [3, 5], 0), 0);
}
console.log('✓ 02-unbounded-knapsack-basic passed');

module.exports = { bruteForce, memo, tabulation, optimized };
