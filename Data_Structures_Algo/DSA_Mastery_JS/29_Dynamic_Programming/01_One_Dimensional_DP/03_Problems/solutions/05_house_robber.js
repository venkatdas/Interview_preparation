/**
 * 05. House Robber   (LeetCode 198 — Medium)
 *
 * PROBLEM
 * nums[i] is the money in house i. You cannot rob two adjacent houses.
 * Return the maximum money you can rob.
 *
 * EXAMPLES
 * Input: [1,2,3,1]     Output: 4    Explanation: rob house 0 and 2 (1 + 3)
 * Input: [2,7,9,3,1]   Output: 12   Explanation: rob 0, 2, 4 (2 + 9 + 1)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= nums.length <= 100, 0 <= nums[i] <= 400
 * - Can the array be empty? (return 0 to be safe)
 *
 * DP DEFINITION
 * STATE:       dp[i] = max money using only houses 0..i-1 (first i houses)
 * RECURRENCE:  dp[i] = max( dp[i-1],                 // SKIP house i-1
 *                           dp[i-2] + nums[i-1] )    // TAKE house i-1
 * BASE CASES:  dp[0] = 0 (no houses), dp[1] = nums[0]
 * ANSWER:      dp[n]
 *
 * This is THE "take or skip" pattern. At every house you make one decision.
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * rob(i) = max(rob(i+1), nums[i] + rob(i+2)). Two branches per house.
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, nums = [2, 7, 9, 3, 1]:
 *   i (houses used) : 0   1   2   3    4    5
 *   dp              : 0   2   7   11   11   12
 *   dp[2] = max(dp[1]=2, dp[0]+7=7) = 7
 *   dp[3] = max(dp[2]=7, dp[1]+9=11) = 11
 *   dp[4] = max(dp[3]=11, dp[2]+3=10) = 11
 *   dp[5] = max(dp[4]=11, dp[3]+1=12) = 12
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 * Two variables: best with previous house available, best two houses back.
 *
 * EDGE CASES
 * - [] -> 0
 * - [5] -> 5
 * - [2, 1] -> 2
 */

function bruteForce(nums) {
  function robFrom(index) {
    if (index >= nums.length) return 0;
    const skip = robFrom(index + 1);
    const take = nums[index] + robFrom(index + 2);
    return Math.max(skip, take);
  }
  return robFrom(0);
}

function memo(nums) {
  const cache = new Map();
  function robFrom(index) {
    if (index >= nums.length) return 0;
    if (cache.has(index)) return cache.get(index);
    const best = Math.max(robFrom(index + 1), nums[index] + robFrom(index + 2));
    cache.set(index, best);
    return best;
  }
  return robFrom(0);
}

function tabulation(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const dp = new Array(n + 1).fill(0);
  dp[1] = nums[0];
  for (let i = 2; i <= n; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
  }
  return dp[n];
}

function optimized(nums) {
  let twoBack = 0; // best up to house i-2
  let oneBack = 0; // best up to house i-1
  for (const money of nums) {
    const current = Math.max(oneBack, twoBack + money);
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 2, 3, 1]), 4);
  assert.strictEqual(solve([2, 7, 9, 3, 1]), 12);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([5]), 5);
  assert.strictEqual(solve([2, 1]), 2);
  assert.strictEqual(solve([2, 1, 1, 2]), 4);
  assert.strictEqual(solve([0, 0, 0]), 0);
}
console.log('✓ 05-house-robber passed');

module.exports = { bruteForce, memo, tabulation, optimized };
