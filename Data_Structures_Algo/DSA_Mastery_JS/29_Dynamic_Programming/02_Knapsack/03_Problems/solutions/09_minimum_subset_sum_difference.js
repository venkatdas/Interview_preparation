/**
 * 09. Minimum Subset Sum Difference   (classic / GfG — Medium)
 *
 * PROBLEM
 * Split an array of non-negative integers into two subsets (every element goes
 * to exactly one subset) so that the absolute difference of their sums is as
 * small as possible. Return that minimum difference.
 *
 * EXAMPLES
 * Input: [1,6,11,5]   Output: 1    Explanation: {1,5,6}=12 and {11}=11
 * Input: [1,2,3,9]    Output: 3    Explanation: {1,2,3}=6 and {9}=9
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can a subset be empty? (yes, e.g. a single element -> difference is that element)
 * - Negative numbers? (assume no; with negatives the sum range would need an offset)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Try every way to put each element in subset A or subset B, track |sumA - sumB|.
 *
 * APPROACH 2 — DP (subset sum, pick the sum closest to total/2)   O(n * total) time, O(total) space
 * If subset A has sum s, subset B has total - s, difference = |total - 2s|.
 * We want s as close to total/2 as possible, and s must be a reachable subset sum.
 * So build the reachable-sum table once, then scan s from total/2 downward.
 * (Last Stone Weight II is exactly this problem in a costume.)
 *
 * STATE      dp[s] = is sum s reachable by some subset of the elements seen so far
 * RECURRENCE dp[s] = dp[s] || dp[s - num]   (s downward)
 * BASE CASES dp[0] = true
 * ANSWER     min over reachable s <= total/2 of (total - 2s)
 *
 * Dry run: [1,6,11,5], total 23, half 11
 *   reachable sums: 0,1,5,6,7,11,12,16,17,18,22,23
 *   largest reachable <= 11 is 11 -> 23 - 22 = 1
 *
 * EDGE CASES
 * - empty -> 0
 * - single element -> that element
 * - all equal with even count -> 0
 */

function bruteForce(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  function smallest(index, sumA) {
    if (index === nums.length) return Math.abs(total - 2 * sumA);
    return Math.min(smallest(index + 1, sumA + nums[index]), smallest(index + 1, sumA));
  }
  return smallest(0, 0);
}

function memo(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  const cache = new Map();
  function smallest(index, sumA) {
    if (index === nums.length) return Math.abs(total - 2 * sumA);
    const key = index + ',' + sumA;
    if (cache.has(key)) return cache.get(key);
    const result = Math.min(smallest(index + 1, sumA + nums[index]), smallest(index + 1, sumA));
    cache.set(key, result);
    return result;
  }
  return smallest(0, 0);
}

function tabulation(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  const n = nums.length;
  // full-width table (0..total) to show the general shape
  const dp = Array.from({ length: n + 1 }, () => new Array(total + 1).fill(false));
  for (let i = 0; i <= n; i++) dp[i][0] = true;
  for (let i = 1; i <= n; i++) {
    const num = nums[i - 1];
    for (let s = 1; s <= total; s++) {
      dp[i][s] = dp[i - 1][s] || (s >= num && dp[i - 1][s - num]);
    }
  }
  let best = total;
  for (let s = 0; s <= Math.floor(total / 2); s++) {
    if (dp[n][s]) best = Math.min(best, total - 2 * s);
  }
  return best;
}

function optimized(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  const half = Math.floor(total / 2);
  const dp = new Array(half + 1).fill(false); // only sums up to half are needed
  dp[0] = true;
  for (const num of nums) {
    for (let s = half; s >= num; s--) {
      if (dp[s - num]) dp[s] = true;
    }
  }
  for (let s = half; s >= 0; s--) {
    if (dp[s]) return total - 2 * s;
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 6, 11, 5]), 1);
  assert.strictEqual(solve([1, 2, 3, 9]), 3);
  assert.strictEqual(solve([3, 1, 4, 2, 2, 1]), 1);
  assert.strictEqual(solve([7]), 7);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([4, 4, 4, 4]), 0);
  assert.strictEqual(solve([0, 0, 5]), 5);
}
console.log('✓ 09-minimum-subset-sum-difference passed');

module.exports = { bruteForce, memo, tabulation, optimized };
