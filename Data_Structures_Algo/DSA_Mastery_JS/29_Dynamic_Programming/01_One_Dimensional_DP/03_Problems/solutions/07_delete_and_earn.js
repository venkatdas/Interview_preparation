/**
 * 07. Delete and Earn   (LeetCode 740 — Medium)
 *
 * PROBLEM
 * Pick any nums[i], earn nums[i] points, and then EVERY element equal to
 * nums[i]-1 and nums[i]+1 is deleted. Repeat. Return the max points.
 *
 * EXAMPLES
 * Input: [3,4,2]       Output: 6   Explanation: take 4 (deletes 3), take 2 -> 6
 * Input: [2,2,3,3,3,4] Output: 9   Explanation: take all three 3s (deletes 2s and 4) -> 9
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= nums.length <= 2*10^4, 1 <= nums[i] <= 10^4
 *
 * KEY TRICK — it's House Robber in disguise
 * If you take value v once, you may as well take EVERY copy of v (taking v
 * only deletes v-1 and v+1, never other v's). So build
 *   points[v] = v * count(v)
 * Now "take value v" forbids "take value v-1 and v+1" -> adjacent "houses".
 *
 * DP DEFINITION
 * STATE:       dp[v] = max points using values 0..v
 * RECURRENCE:  dp[v] = max(dp[v-1], dp[v-2] + points[v])
 * BASE CASES:  dp[0] = 0, dp[1] = points[1]
 * ANSWER:      dp[maxValue]
 *
 * APPROACH 1 — Brute force   O(2^maxValue) time
 * Take/skip recursion over the value axis.
 *
 * APPROACH 2 — Memoization   O(maxValue) time, O(maxValue) space
 * APPROACH 3 — Tabulation   O(n + maxValue) time, O(maxValue) space
 * Dry run, nums = [2,2,3,3,3,4]:
 *   points: v=0:0  1:0  2:4  3:9  4:4
 *   dp    :   0    0    4    9    9
 *   dp[3] = max(dp[2]=4, dp[1]+9=9) = 9
 *   dp[4] = max(dp[3]=9, dp[2]+4=8) = 9
 *
 * APPROACH 4 — Space optimized   O(n + maxValue) time, O(maxValue) space for points
 *
 * EDGE CASES
 * - Single element -> that element
 * - All the same value -> value * count
 */

function buildPoints(nums) {
  const maxValue = Math.max(...nums);
  const points = new Array(maxValue + 1).fill(0);
  for (const value of nums) points[value] += value; // every copy adds its value
  return points;
}

function bruteForce(nums) {
  const points = buildPoints(nums);
  function best(value) {
    if (value < 0) return 0;
    return Math.max(best(value - 1), points[value] + best(value - 2));
  }
  return best(points.length - 1);
}

function memo(nums) {
  const points = buildPoints(nums);
  const cache = new Map();
  function best(value) {
    if (value < 0) return 0;
    if (cache.has(value)) return cache.get(value);
    const result = Math.max(best(value - 1), points[value] + best(value - 2));
    cache.set(value, result);
    return result;
  }
  return best(points.length - 1);
}

function tabulation(nums) {
  const points = buildPoints(nums);
  const dp = new Array(points.length).fill(0);
  dp[0] = points[0];
  if (points.length > 1) dp[1] = Math.max(points[0], points[1]);
  for (let value = 2; value < points.length; value++) {
    dp[value] = Math.max(dp[value - 1], dp[value - 2] + points[value]);
  }
  return dp[points.length - 1];
}

function optimized(nums) {
  const points = buildPoints(nums);
  let twoBack = 0;
  let oneBack = 0;
  for (const gain of points) {
    const current = Math.max(oneBack, twoBack + gain);
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([3, 4, 2]), 6);
  assert.strictEqual(solve([2, 2, 3, 3, 3, 4]), 9);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([5, 5, 5]), 15);
  assert.strictEqual(solve([1, 1, 1, 2, 4, 5, 5, 5, 6]), 18);
  assert.strictEqual(solve([10, 1]), 11);
}
console.log('✓ 07-delete-and-earn passed');

module.exports = { bruteForce, memo, tabulation, optimized };
