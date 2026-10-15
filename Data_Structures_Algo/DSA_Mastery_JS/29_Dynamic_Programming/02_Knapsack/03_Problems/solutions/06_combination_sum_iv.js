/**
 * 06. Combination Sum IV   (LeetCode 377 — Medium)
 *
 * PROBLEM
 * Given distinct positive integers nums and a target, return the number of
 * ORDERED sequences (permutations) of nums that add up to target. Numbers may
 * be reused.
 *
 * EXAMPLES
 * Input: nums=[1,2,3], target=4   Output: 7
 *   Explanation: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 1+3, 3+1, 2+2  (order matters!)
 * Input: nums=[9], target=3       Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Does order matter? (yes - despite the name, these are permutations;
 *   compare with Coin Change II where it does not)
 * - Reuse allowed? (yes, unbounded)
 * - Negative numbers? (no; with negatives the count could be infinite)
 *
 * APPROACH 1 — Brute force   O(nums^target) time, O(target) space
 * From the remaining target, try every number as the NEXT element and recurse.
 * Because we pick "the next element" freely, 1+2 and 2+1 are different paths.
 *
 * APPROACH 2 — DP (unbounded knapsack, count, order matters)   O(n * target) time, O(target) space
 * STATE      dp[t] = number of ordered sequences summing to t
 * RECURRENCE dp[t] = sum over num <= t of dp[t - num]   (last element is num)
 * BASE CASES dp[0] = 1 (empty sequence)
 * ANSWER     dp[target]
 *
 * LOOP ORDER: target OUTER, nums inner. For every total we consider every
 * possible LAST element, so each ordering is counted separately.
 * (Swap the loops and you get Coin Change II = combinations.)
 *
 * Dry run: nums=[1,2,3], target=4
 *   t:   0  1  2  3  4
 *   dp:  1  1  2  4  7      dp[3] = dp[2]+dp[1]+dp[0] = 2+1+1 = 4
 *                           dp[4] = dp[3]+dp[2]+dp[1] = 4+2+1 = 7
 *
 * EDGE CASES
 * - target 0 -> 1
 * - all nums > target -> 0
 * - results grow fast (fit 32-bit on LeetCode)
 */

function bruteForce(nums, target) {
  function ways(remaining) {
    if (remaining === 0) return 1;
    let count = 0;
    for (const num of nums) {
      if (num <= remaining) count += ways(remaining - num);
    }
    return count;
  }
  return ways(target);
}

function memo(nums, target) {
  const cache = new Array(target + 1).fill(-1);
  function ways(remaining) {
    if (remaining === 0) return 1;
    if (cache[remaining] !== -1) return cache[remaining];
    let count = 0;
    for (const num of nums) {
      if (num <= remaining) count += ways(remaining - num);
    }
    cache[remaining] = count;
    return count;
  }
  return ways(target);
}

function tabulation(nums, target) {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let t = 1; t <= target; t++) {   // target OUTER -> order matters
    for (const num of nums) {
      if (num <= t) dp[t] += dp[t - num];
    }
  }
  return dp[target];
}

// Already O(target) space; this version just skips numbers larger than target
// up front and sorts so the inner loop can break early.
function optimized(nums, target) {
  const sorted = [...nums].filter((num) => num <= target).sort((a, b) => a - b);
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let t = 1; t <= target; t++) {
    for (const num of sorted) {
      if (num > t) break;
      dp[t] += dp[t - num];
    }
  }
  return dp[target];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 2, 3], 4), 7);
  assert.strictEqual(solve([9], 3), 0);
  assert.strictEqual(solve([1, 2], 0), 1);
  assert.strictEqual(solve([1, 2], 3), 3); // 1+1+1, 1+2, 2+1
  assert.strictEqual(solve([2, 4], 7), 0);
  assert.strictEqual(solve([3, 1], 5), 4); // 11111, 113, 131, 311
}
console.log('✓ 06-combination-sum-iv passed');

module.exports = { bruteForce, memo, tabulation, optimized };
