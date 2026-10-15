/**
 * 07. Target Sum   (LeetCode 494 — Medium)
 *
 * PROBLEM
 * Given non-negative integers nums and a target, put a '+' or '-' in front of
 * every number. Return how many sign assignments make the expression equal target.
 *
 * EXAMPLES
 * Input: nums=[1,1,1,1,1], target=3   Output: 5
 *   Explanation: -1+1+1+1+1, +1-1+1+1+1, +1+1-1+1+1, +1+1+1-1+1, +1+1+1+1-1
 * Input: nums=[1], target=1            Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can nums contain 0? (yes; +0 and -0 are different assignments, so each 0 doubles the count)
 * - Can target be negative? (yes, handle it with the same formula)
 * - Every number must get a sign? (yes)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Two choices per number (+ or -). Recurse with the running sum and count how
 * many leaves hit the target.
 *
 * APPROACH 2 — DP (transform to subset sum, COUNT variant)   O(n * sum) time, O(sum) space
 * Let P = sum of the numbers that get '+', N = sum of those that get '-'.
 *   P - N = target        and        P + N = total
 *   => 2P = total + target  =>  P = (total + target) / 2
 * So the question becomes: how many subsets sum to P?  That is countSubsets.
 * If (total + target) is odd or negative there is no answer -> 0.
 *
 * STATE      dp[s] = number of subsets (of numbers seen so far) with sum s
 * RECURRENCE dp[s] += dp[s - num]   (s walks downward -> each number once)
 * BASE CASES dp[0] = 1
 * ANSWER     dp[P]
 *
 * Dry run: nums=[1,1,1,1,1], target=3 -> total 5, P = (5+3)/2 = 4
 *   start   dp = [1,0,0,0,0]
 *   each 1 shifts and adds: after 5 ones dp = [1,5,10,10,5]  (binomial numbers)
 *   dp[4] = 5 = C(5,4)  -> answer 5
 *
 * EDGE CASES
 * - |target| > total -> 0
 * - (total + target) odd -> 0
 * - zeros in nums: dp[0] starts at 1; each 0 runs dp[s] += dp[s - 0], doubling every entry
 */

function bruteForce(nums, target) {
  function count(index, runningSum) {
    if (index === nums.length) return runningSum === target ? 1 : 0;
    return count(index + 1, runningSum + nums[index]) + count(index + 1, runningSum - nums[index]);
  }
  return count(0, 0);
}

function memo(nums, target) {
  const cache = new Map(); // running sum can be negative, so use a string key
  function count(index, runningSum) {
    if (index === nums.length) return runningSum === target ? 1 : 0;
    const key = index + ',' + runningSum;
    if (cache.has(key)) return cache.get(key);
    const result = count(index + 1, runningSum + nums[index]) + count(index + 1, runningSum - nums[index]);
    cache.set(key, result);
    return result;
  }
  return count(0, 0);
}

function positiveSubsetTarget(nums, target) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > total || (total + target) % 2 !== 0) return -1;
  return (total + target) / 2;
}

function tabulation(nums, target) {
  const positive = positiveSubsetTarget(nums, target);
  if (positive < 0) return 0;
  const n = nums.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(positive + 1).fill(0));
  dp[0][0] = 1;
  for (let i = 1; i <= n; i++) {
    const num = nums[i - 1];
    for (let s = 0; s <= positive; s++) {
      dp[i][s] = dp[i - 1][s];
      if (s >= num) dp[i][s] += dp[i - 1][s - num];
    }
  }
  return dp[n][positive];
}

function optimized(nums, target) {
  const positive = positiveSubsetTarget(nums, target);
  if (positive < 0) return 0;
  const dp = new Array(positive + 1).fill(0);
  dp[0] = 1;
  for (const num of nums) {
    for (let s = positive; s >= num; s--) dp[s] += dp[s - num];
  }
  return dp[positive];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 1, 1, 1, 1], 3), 5);
  assert.strictEqual(solve([1], 1), 1);
  assert.strictEqual(solve([1], 2), 0);
  assert.strictEqual(solve([1, 2, 1], 0), 2);        // +1+1-2, -1-1+2
  assert.strictEqual(solve([0, 0, 1], 1), 4);        // zeros double the count
  assert.strictEqual(solve([1, 1, 1, 1, 1], -3), 5); // negative target is symmetric
  assert.strictEqual(solve([2, 3], 1), 1);           // -2+3
}
console.log('✓ 07-target-sum passed');

module.exports = { bruteForce, memo, tabulation, optimized };
