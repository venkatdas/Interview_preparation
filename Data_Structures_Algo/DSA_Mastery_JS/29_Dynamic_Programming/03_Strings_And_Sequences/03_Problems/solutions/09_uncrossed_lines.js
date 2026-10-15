/**
 * 09. Uncrossed Lines   (LeetCode 1035 — Medium)
 *
 * PROBLEM
 * Two integer arrays nums1 and nums2 are written on two parallel lines. You may
 * draw a straight line between nums1[i] and nums2[j] only if they are equal, and
 * lines must not cross (each number is used at most once). Return the maximum
 * number of lines you can draw.
 *
 * EXAMPLES
 * Input: nums1 = [1,4,2], nums2 = [1,2,4]       Output: 2
 *   Explanation: connect 1-1 and 4-4 (or 2-2); you cannot do both 4-4 and 2-2 because
 *   they would cross.
 * Input: nums1 = [2,5,1,2,5], nums2 = [10,5,2,1,5,2]   Output: 3
 * Input: nums1 = [1,3,7,1,7,5], nums2 = [1,9,2,5,1]    Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can arrays be empty? (then 0)
 * - Duplicates? (yes, that is what makes it interesting)
 *
 * APPROACH 1 — Brute force   O(2^(m+n)) time, O(m+n) space
 * "Lines that don't cross" = the connected pairs keep their relative order on both
 * sides = a common subsequence. So this IS Longest Common Subsequence in disguise.
 * Recurse: match and advance both, or skip one from either side.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space
 * STATE      dp[i][j] = max lines using nums1[0..i) and nums2[0..j)
 * RECURRENCE if nums1[i-1] === nums2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
 *            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 * BASE CASES dp[0][j] = dp[i][0] = 0
 * ANSWER     dp[m][n]
 *
 * Table for [1,4,2] vs [1,2,4]:
 *            ""  1  2  4
 *        ""   0  0  0  0
 *        1    0  1  1  1
 *        4    0  1  1  2
 *        2    0  1  2  2     answer 2
 *
 * APPROACH 3 — Space optimized   O(m*n) time, O(n) space
 * Two rows.
 *
 * EDGE CASES
 * - empty array -> 0
 * - identical arrays -> length
 * - no equal values -> 0
 */

function bruteForce(nums1, nums2) {
  function lines(i, j) {
    if (i === nums1.length || j === nums2.length) return 0;
    if (nums1[i] === nums2[j]) return 1 + lines(i + 1, j + 1);
    return Math.max(lines(i + 1, j), lines(i, j + 1));
  }
  return lines(0, 0);
}

function memo(nums1, nums2) {
  const cache = new Map();
  function lines(i, j) {
    if (i === nums1.length || j === nums2.length) return 0;
    const key = i + ',' + j;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (nums1[i] === nums2[j]) result = 1 + lines(i + 1, j + 1);
    else result = Math.max(lines(i + 1, j), lines(i, j + 1));
    cache.set(key, result);
    return result;
  }
  return lines(0, 0);
}

function tabulation(nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function optimized(nums1, nums2) {
  const n = nums2.length;
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= nums1.length; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) curr[j] = 1 + prev[j - 1];
      else curr[j] = Math.max(prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 4, 2], [1, 2, 4]), 2);
  assert.strictEqual(solve([2, 5, 1, 2, 5], [10, 5, 2, 1, 5, 2]), 3);
  assert.strictEqual(solve([1, 3, 7, 1, 7, 5], [1, 9, 2, 5, 1]), 2);
  assert.strictEqual(solve([], [1, 2]), 0);
  assert.strictEqual(solve([1, 2, 3], [1, 2, 3]), 3);
  assert.strictEqual(solve([1, 1], [2, 2]), 0);
}
console.log('✓ 09-uncrossed-lines passed');

module.exports = { bruteForce, memo, tabulation, optimized };
