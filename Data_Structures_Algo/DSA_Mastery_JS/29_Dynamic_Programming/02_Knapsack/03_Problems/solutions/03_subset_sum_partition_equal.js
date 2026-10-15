/**
 * 03. Partition Equal Subset Sum   (LeetCode 416 — Medium)
 *
 * PROBLEM
 * Given an array of positive integers, return true if it can be split into two
 * subsets with equal sums.
 *
 * EXAMPLES
 * Input: [1,5,11,5]   Output: true    Explanation: [1,5,5] and [11]
 * Input: [1,2,3,5]    Output: false   Explanation: total 11 is odd
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - All numbers positive? (yes, on LeetCode 1..100, up to 200 numbers)
 * - Must both subsets be non-empty? (with positive numbers an empty subset has sum 0,
 *   so equal sums force both to be non-empty anyway)
 *
 * APPROACH 1 — Brute force (all subsets)   O(2^n) time, O(n) space
 * Total must be even. Then ask: does any subset sum to total/2? Try take/skip
 * for every number.
 *
 * APPROACH 2 — DP (subset sum = boolean 0/1 knapsack)   O(n * target) time, O(target) space
 * The "items" are the numbers, their weight is their value, and we only care
 * whether a capacity can be filled EXACTLY.
 * STATE      dp[s] = can some subset of the numbers seen so far sum to exactly s
 * RECURRENCE dp[s] = dp[s] (skip num)  OR  dp[s - num] (take num)
 * BASE CASES dp[0] = true (empty subset)
 * ANSWER     dp[total / 2]
 *
 * Dry run: [1,5,11,5], total 22, target 11
 *   start      dp[0]=T, rest F
 *   num 1  ->  reachable {0,1}
 *   num 5  ->  reachable {0,1,5,6}
 *   num 11 ->  reachable {0,1,5,6,11}  -> dp[11] = true, answer true
 *   (loop runs s downward so each number is used once)
 *
 * EDGE CASES
 * - odd total -> false immediately
 * - single element -> false
 * - [x, x] -> true
 * - a number larger than total/2 can never be used (loop just skips it)
 */

function bruteForce(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  function canMake(index, remaining) {
    if (remaining === 0) return true;
    if (index === nums.length || remaining < 0) return false;
    return canMake(index + 1, remaining - nums[index]) || canMake(index + 1, remaining);
  }
  return canMake(0, total / 2);
}

function memo(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const cache = new Map();
  function canMake(index, remaining) {
    if (remaining === 0) return true;
    if (index === nums.length || remaining < 0) return false;
    const key = index + ',' + remaining;
    if (cache.has(key)) return cache.get(key);
    const result = canMake(index + 1, remaining - nums[index]) || canMake(index + 1, remaining);
    cache.set(key, result);
    return result;
  }
  return canMake(0, total / 2);
}

function tabulation(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const n = nums.length;
  // dp[i][s] = can the first i numbers make sum s
  const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));
  for (let i = 0; i <= n; i++) dp[i][0] = true;
  for (let i = 1; i <= n; i++) {
    const num = nums[i - 1];
    for (let s = 1; s <= target; s++) {
      dp[i][s] = dp[i - 1][s] || (s >= num && dp[i - 1][s - num]);
    }
  }
  return dp[n][target];
}

function optimized(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums) {
    for (let s = target; s >= num; s--) { // downward: each num used once
      if (dp[s - num]) dp[s] = true;
    }
    if (dp[target]) return true; // early exit
  }
  return dp[target];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 5, 11, 5]), true);
  assert.strictEqual(solve([1, 2, 3, 5]), false);
  assert.strictEqual(solve([2, 2]), true);
  assert.strictEqual(solve([1]), false);
  assert.strictEqual(solve([1, 1, 1, 1, 2, 2]), true);
  assert.strictEqual(solve([100, 1, 1]), false);
  assert.strictEqual(solve([3, 3, 3, 4, 5]), true);
}
console.log('✓ 03-subset-sum-partition-equal passed');

module.exports = { bruteForce, memo, tabulation, optimized };
