/**
 * 06. Burst Balloons   (LeetCode 312 — Hard)
 *
 * PROBLEM
 * You have n balloons in a row with numbers on them. When you burst balloon i you get
 * nums[i-1] * nums[i] * nums[i+1] coins (treat an out-of-range neighbour as 1). After
 * bursting, balloons i-1 and i+1 become adjacent. Burst all balloons in the order that
 * gives the maximum coins.
 *
 * EXAMPLES
 * Input: [3, 1, 5, 8]   Output: 167
 *   Explanation: burst 1 -> 3*1*5 = 15, [3,5,8]; burst 5 -> 3*5*8 = 120, [3,8];
 *                burst 3 -> 1*3*8 = 24, [8]; burst 8 -> 1*8*1 = 8. Total 167.
 * Input: [1, 5]         Output: 10   (5 first: 1*5*1 = 5, then 1: 1*1*1 = 1 -> 6;
 *                                     1 first: 1*1*5 = 5, then 5: 1*5*1 = 5 -> 10)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 300, 0 <= nums[i] <= 100
 * - Zeros are allowed (bursting a zero gives 0 coins, but it still disappears).
 *
 * APPROACH 1 — Brute force (plain recursion)   O(n!) time, O(n) space
 * Try every balloon as the next one to burst, remove it from the array, recurse on the
 * smaller array. n choices, then n-1, ... -> n!. Only feasible for n <= 8.
 *
 * APPROACH 2 — Memo / Tabulation (Interval DP, "LAST operation" trick)   O(n^3) time, O(n^2) space
 * The hard part: choosing the FIRST balloon to burst does not split the problem, because
 * after it bursts the two sides become neighbours and keep affecting each other.
 *
 * The fix: pad the array with 1s -> padded = [1, ...nums, 1], and ask which balloon is
 * burst LAST in the open range (l, r). If balloon k is burst last, then at that moment
 * everything between l and r except k is already gone, so its neighbours are exactly
 * padded[l] and padded[r]. Before that, the ranges (l, k) and (k, r) were cleared
 * independently -- they never touched each other because k was a wall between them.
 *
 *   STATE      dp[l][r] = max coins from bursting ALL balloons strictly between l and r
 *                         (padded indices; balloons l and r themselves stay)
 *   RECURRENCE dp[l][r] = max over k in (l, r) of
 *                         dp[l][k] + dp[k][r] + padded[l] * padded[k] * padded[r]
 *   BASE CASES dp[l][r] = 0 when r - l <= 1   (nothing strictly between)
 *   ANSWER     dp[0][n+1]
 *
 * Dry run on [3, 1, 5]:  padded = [1, 3, 1, 5, 1]
 *   len 3 (one balloon inside):
 *     dp[0][2] = 1*3*1 = 3      dp[1][3] = 3*1*5 = 15     dp[2][4] = 1*5*1 = 5
 *   len 4:
 *     dp[0][3] = max(k=1: 0 + dp[1][3] + 1*3*5 = 15+15 = 30,
 *                    k=2: dp[0][2] + 0 + 1*1*5 = 3+5 = 8)  = 30
 *     dp[1][4] = max(k=2: 0 + dp[2][4] + 3*1*1 = 5+3 = 8,
 *                    k=3: dp[1][3] + 0 + 3*5*1 = 15+15 = 30) = 30
 *   len 5:
 *     dp[0][4] = max(k=1: 0 + dp[1][4] + 1*3*1 = 30+3 = 33,
 *                    k=2: dp[0][2] + dp[2][4] + 1*1*1 = 3+5+1 = 9,
 *                    k=3: dp[0][3] + 0 + 1*5*1 = 30+5 = 35) = 35
 *   answer 35  (burst 1, then 3, then 5: 15 + 15 + 5)
 *
 * EDGE CASES
 * - Single balloon -> nums[0]
 * - Contains zeros -> still must be burst, contributes 0 when it is the middle
 * - Empty array -> 0
 */

function bruteForce(nums) {
  function best(remaining) {
    if (remaining.length === 0) return 0;
    let max = 0;
    for (let i = 0; i < remaining.length; i++) {
      const left = i === 0 ? 1 : remaining[i - 1];
      const right = i === remaining.length - 1 ? 1 : remaining[i + 1];
      const rest = remaining.slice(0, i).concat(remaining.slice(i + 1));
      max = Math.max(max, left * remaining[i] * right + best(rest));
    }
    return max;
  }
  return best(nums);
}

function memo(nums) {
  const padded = [1, ...nums, 1];
  const m = padded.length;
  const cache = Array.from({ length: m }, () => new Array(m).fill(-1));

  function coins(left, right) {
    if (right - left <= 1) return 0;
    if (cache[left][right] !== -1) return cache[left][right];
    let max = 0;
    for (let k = left + 1; k < right; k++) {
      // k is the LAST balloon burst in (left, right): its neighbours are left and right
      max = Math.max(max, coins(left, k) + coins(k, right) + padded[left] * padded[k] * padded[right]);
    }
    cache[left][right] = max;
    return max;
  }
  return coins(0, m - 1);
}

function tabulation(nums) {
  const padded = [1, ...nums, 1];
  const m = padded.length;
  const dp = Array.from({ length: m }, () => new Array(m).fill(0));

  for (let len = 3; len <= m; len++) {           // need at least one balloon inside
    for (let left = 0; left + len - 1 < m; left++) {
      const right = left + len - 1;
      for (let k = left + 1; k < right; k++) {
        const gain = padded[left] * padded[k] * padded[right];
        dp[left][right] = Math.max(dp[left][right], dp[left][k] + dp[k][right] + gain);
      }
    }
  }
  return dp[0][m - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([3, 1, 5, 8]), 167);
  assert.strictEqual(solve([3, 1, 5]), 35);
  assert.strictEqual(solve([1, 5]), 10);
  assert.strictEqual(solve([7]), 7);              // single balloon
  assert.strictEqual(solve([]), 0);               // nothing to burst
  assert.strictEqual(solve([0, 0, 0]), 0);        // zeros
  assert.strictEqual(solve([2, 0, 3]), 9);        // burst 0 first (0), then 2*3=6, then 3
  assert.strictEqual(solve([9, 76, 64, 21]), 116718);
}
console.log('✓ 06-burst-balloons passed');

module.exports = { bruteForce, memo, tabulation };
