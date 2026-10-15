/**
 * Knapsack family - core implementations in JavaScript.
 *
 * 1. knapsack01          - each item used at most once (2D table + 1D reversed loop)
 * 2. knapsackUnbounded   - each item used any number of times (1D forward loop)
 * 3. subsetSum           - can some subset of nums add up to target? (boolean knapsack)
 * 4. countSubsets        - how many subsets of nums add up to target? (counting knapsack)
 *
 * All of them share ONE idea:
 *   state     = (items considered so far, capacity / sum still available)
 *   decision  = skip this item, or take it (if it fits)
 *
 * Time: O(n * capacity) for all four.  Space: O(n * capacity) for 2D, O(capacity) for 1D.
 */

// ---------- 1. 0/1 knapsack ----------

// 2D version - the one you draw on the whiteboard.
// dp[i][c] = best value using only the first i items with capacity c.
function knapsack01Table(weights, values, capacity) {
  const n = weights.length;
  // (n + 1) rows so that row 0 means "no items" and we never need a special case.
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const weight = weights[i - 1];
    const value = values[i - 1];
    for (let c = 0; c <= capacity; c++) {
      dp[i][c] = dp[i - 1][c]; // skip item i
      if (weight <= c) {
        // take item i: its value + the best we could do with the remaining room
        // using ONLY the previous items (row i - 1 -> each item is used once).
        dp[i][c] = Math.max(dp[i][c], value + dp[i - 1][c - weight]);
      }
    }
  }
  return dp[n][capacity];
}

// 1D version - same answer, one row.
// Walking capacity DOWNWARDS means dp[c - weight] is still the value from the
// previous row (not yet updated for this item), so an item cannot be taken twice.
function knapsack01(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let c = capacity; c >= weights[i]; c--) {
      dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
    }
  }
  return dp[capacity];
}

// ---------- 2. Unbounded knapsack ----------
// Walking capacity UPWARDS means dp[c - weight] may already include this item,
// which is exactly what we want: the item can be reused.
function knapsackUnbounded(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let c = weights[i]; c <= capacity; c++) {
      dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
    }
  }
  return dp[capacity];
}

// ---------- 3. Subset sum (boolean 0/1 knapsack) ----------
// dp[s] = can we build sum s from the numbers seen so far?
function subsetSum(nums, target) {
  if (target < 0) return false;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true; // the empty subset always builds sum 0
  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      // either s was already reachable, or (s - num) was and we add num
      if (dp[s - num]) dp[s] = true;
    }
  }
  return dp[target];
}

// ---------- 4. Count subsets (counting 0/1 knapsack) ----------
// dp[s] = number of subsets of the numbers seen so far whose sum is s.
function countSubsets(nums, target) {
  if (target < 0) return 0;
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1; // exactly one way to make 0: pick nothing
  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      dp[s] += dp[s - num]; // ways without num + ways that end by adding num
    }
  }
  return dp[target];
}

// ---------- self-test ----------
const assert = require('assert');

// classic example: weights/values, capacity 7 -> take items (3,4) + (4,5) = 9
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
assert.strictEqual(knapsack01Table(weights, values, 7), 9);
assert.strictEqual(knapsack01(weights, values, 7), 9);
assert.strictEqual(knapsack01(weights, values, 0), 0);
assert.strictEqual(knapsack01([], [], 10), 0);
assert.strictEqual(knapsack01([10], [100], 5), 0); // nothing fits

// unbounded: weight 1 value 1 can be repeated 7 times, but weight 3 value 4 is better per unit
// capacity 7: 3+3+1 -> 4+4+1 = 9, or 4+3 -> 5+4 = 9, or 5+1+1 -> 7+1+1 = 9 ... and 3+4 = 9
assert.strictEqual(knapsackUnbounded(weights, values, 7), 9);
assert.strictEqual(knapsackUnbounded([2, 3], [3, 5], 7), 11); // 2+2+3 -> 3+3+5
assert.strictEqual(knapsackUnbounded([5], [10], 4), 0);

assert.strictEqual(subsetSum([3, 34, 4, 12, 5, 2], 9), true); // 4 + 5
assert.strictEqual(subsetSum([3, 34, 4, 12, 5, 2], 30), false);
assert.strictEqual(subsetSum([], 0), true);
assert.strictEqual(subsetSum([1], 2), false);

assert.strictEqual(countSubsets([1, 1, 2, 3], 4), 3); // {1,3} {1,3} {1,1,2}
assert.strictEqual(countSubsets([2, 4, 6], 5), 0);
assert.strictEqual(countSubsets([0, 0, 1], 1), 4); // zeros double the count

console.log('✓ knapsack.js self-test passed');

module.exports = { knapsack01, knapsack01Table, knapsackUnbounded, subsetSum, countSubsets };
