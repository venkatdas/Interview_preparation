/**
 * 06. House Robber II   (LeetCode 213 — Medium)
 *
 * PROBLEM
 * Same as House Robber, but the houses form a CIRCLE: the first and last
 * house are adjacent. Return the max money without robbing adjacent houses.
 *
 * EXAMPLES
 * Input: [2,3,2]     Output: 3    Explanation: can't take both 2s (they're adjacent in the circle)
 * Input: [1,2,3,1]   Output: 4
 * Input: [1,2,3]     Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= nums.length <= 100
 * - One house: just take it (no neighbour to conflict with).
 *
 * KEY TRICK
 * House 0 and house n-1 can't both be chosen. So the answer is
 *   max( rob(houses 0..n-2),  rob(houses 1..n-1) )
 * Each half is the plain linear House Robber.
 *
 * DP DEFINITION (for one linear segment)
 * STATE:       dp[i] = max money from the first i houses of the segment
 * RECURRENCE:  dp[i] = max(dp[i-1], dp[i-2] + segment[i-1])
 * BASE CASES:  dp[0] = 0, dp[1] = segment[0]
 * ANSWER:      max(dp over segment A, dp over segment B)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Plain take/skip recursion over each of the two segments.
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, nums = [2, 3, 2]:
 *   segment [2, 3] -> dp: 0, 2, 3  -> 3
 *   segment [3, 2] -> dp: 0, 3, 3  -> 3
 *   answer = 3
 *
 * APPROACH 4 — Space optimized   O(n) time, O(1) space
 *
 * EDGE CASES
 * - [1] -> 1 (the segment trick would give two empty segments, handle separately)
 * - [1, 2] -> 2
 */

function bruteForce(nums) {
  if (nums.length === 1) return nums[0];
  function robFrom(segment, index) {
    if (index >= segment.length) return 0;
    return Math.max(robFrom(segment, index + 1), segment[index] + robFrom(segment, index + 2));
  }
  return Math.max(robFrom(nums.slice(0, -1), 0), robFrom(nums.slice(1), 0));
}

function memo(nums) {
  if (nums.length === 1) return nums[0];
  function robLinear(segment) {
    const cache = new Map();
    function robFrom(index) {
      if (index >= segment.length) return 0;
      if (cache.has(index)) return cache.get(index);
      const best = Math.max(robFrom(index + 1), segment[index] + robFrom(index + 2));
      cache.set(index, best);
      return best;
    }
    return robFrom(0);
  }
  return Math.max(robLinear(nums.slice(0, -1)), robLinear(nums.slice(1)));
}

function tabulation(nums) {
  if (nums.length === 1) return nums[0];
  function robLinear(segment) {
    const dp = new Array(segment.length + 1).fill(0);
    dp[1] = segment[0];
    for (let i = 2; i <= segment.length; i++) {
      dp[i] = Math.max(dp[i - 1], dp[i - 2] + segment[i - 1]);
    }
    return dp[segment.length];
  }
  return Math.max(robLinear(nums.slice(0, -1)), robLinear(nums.slice(1)));
}

function optimized(nums) {
  if (nums.length === 1) return nums[0];
  // rob houses in index range [start, end) without allocating a new array
  function robRange(start, end) {
    let twoBack = 0;
    let oneBack = 0;
    for (let i = start; i < end; i++) {
      const current = Math.max(oneBack, twoBack + nums[i]);
      twoBack = oneBack;
      oneBack = current;
    }
    return oneBack;
  }
  return Math.max(robRange(0, nums.length - 1), robRange(1, nums.length));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([2, 3, 2]), 3);
  assert.strictEqual(solve([1, 2, 3, 1]), 4);
  assert.strictEqual(solve([1, 2, 3]), 3);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([1, 2]), 2);
  assert.strictEqual(solve([200, 3, 140, 20, 10]), 340);
}
console.log('✓ 06-house-robber-ii passed');

module.exports = { bruteForce, memo, tabulation, optimized };
