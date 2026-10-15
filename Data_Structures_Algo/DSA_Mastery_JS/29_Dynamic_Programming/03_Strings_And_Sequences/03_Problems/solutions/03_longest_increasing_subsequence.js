/**
 * 03. Longest Increasing Subsequence   (LeetCode 300 — Medium)
 *
 * PROBLEM
 * Given an integer array nums, return the length of the longest strictly
 * increasing subsequence (order kept, elements may be skipped).
 *
 * EXAMPLES
 * Input: [10,9,2,5,3,7,101,18]   Output: 4   Explanation: [2,3,7,101]
 * Input: [0,1,0,3,2,3]           Output: 4   Explanation: [0,1,2,3]
 * Input: [7,7,7,7]               Output: 1   Explanation: strictly increasing, so one 7
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strictly increasing or non-decreasing? (strictly: 7,7 does not count)
 * - Empty array? (return 0)
 * - Negative numbers? (fine, we only compare)
 * - Is O(n^2) acceptable, or do they want O(n log n)? (know both!)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * At each index decide: take it (only if bigger than the last taken) or skip it.
 * State is (index, previous index), explored without caching.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(n^2) time, O(n^2) memo / O(n) table
 * STATE      dp[i] = length of the longest increasing subsequence that ENDS at index i
 * RECURRENCE dp[i] = 1 + max(dp[j]) over all j < i with nums[j] < nums[i]
 *            (if no such j, dp[i] = 1 -> the element alone)
 * BASE CASES dp[i] = 1 for every i
 * ANSWER     max(dp)  -- the LIS can end anywhere
 *
 * Table for [10, 9, 2, 5, 3, 7, 101, 18]:
 *   i     : 0   1   2   3   4   5   6    7
 *   nums  : 10  9   2   5   3   7   101  18
 *   dp    : 1   1   1   2   2   3   4    4      max = 4
 *   dp[5] : 7 is bigger than 2 (dp 1), 5 (dp 2), 3 (dp 2) -> 1 + 2 = 3
 *   dp[7] : 18 is bigger than 2,5,3,7 -> 1 + dp[5] = 4
 *
 * APPROACH 3 — Patience sorting / "tails" array   O(n log n) time, O(n) space
 * tails[k] = the SMALLEST possible tail value of an increasing subsequence of length k+1.
 * tails is always sorted, so for each number binary-search the first tails[k] >= num
 * and overwrite it (we found an equally long subsequence with a better, smaller tail).
 * If num is bigger than every tail, append it (a longer subsequence exists now).
 * The length of tails is the answer. NOTE: tails is NOT an actual LIS, only its length
 * is right (values get overwritten in place).
 *
 * Dry run on [10, 9, 2, 5, 3, 7, 101, 18]:
 *   10  -> tails = [10]
 *   9   -> replaces 10        tails = [9]
 *   2   -> replaces 9         tails = [2]
 *   5   -> append             tails = [2, 5]
 *   3   -> replaces 5         tails = [2, 3]
 *   7   -> append             tails = [2, 3, 7]
 *   101 -> append             tails = [2, 3, 7, 101]
 *   18  -> replaces 101       tails = [2, 3, 7, 18]   length 4
 *
 * EDGE CASES
 * - [] -> 0
 * - single element -> 1
 * - all equal -> 1
 * - already sorted -> n
 * - strictly decreasing -> 1
 */

function bruteForce(nums) {
  // prevValue = value of the last element taken (-Infinity when nothing taken yet)
  function longest(index, prevValue) {
    if (index === nums.length) return 0;
    const skip = longest(index + 1, prevValue);
    let take = 0;
    if (nums[index] > prevValue) take = 1 + longest(index + 1, nums[index]);
    return Math.max(skip, take);
  }
  return longest(0, -Infinity);
}

function memo(nums) {
  // key on (index, prevIndex) because prevValue is not a small integer; -1 = none taken
  const cache = new Map();
  function longest(index, prevIndex) {
    if (index === nums.length) return 0;
    const key = index + ',' + prevIndex;
    if (cache.has(key)) return cache.get(key);
    const skip = longest(index + 1, prevIndex);
    let take = 0;
    if (prevIndex === -1 || nums[index] > nums[prevIndex]) {
      take = 1 + longest(index + 1, index);
    }
    const result = Math.max(skip, take);
    cache.set(key, result);
    return result;
  }
  return longest(0, -1);
}

function tabulation(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1); // every element alone is a LIS of length 1
  let best = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}

function optimized(nums) {
  const tails = []; // tails[k] = smallest tail of an increasing subsequence of length k+1
  for (const num of nums) {
    // binary search: first position whose tail is >= num (lower bound)
    let low = 0;
    let high = tails.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (tails[mid] < num) low = mid + 1;
      else high = mid;
    }
    tails[low] = num; // either overwrite (low < length) or append (low === length)
  }
  return tails.length;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([10, 9, 2, 5, 3, 7, 101, 18]), 4);
  assert.strictEqual(solve([0, 1, 0, 3, 2, 3]), 4);
  assert.strictEqual(solve([7, 7, 7, 7]), 1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([5]), 1);
  assert.strictEqual(solve([1, 2, 3, 4, 5]), 5);
  assert.strictEqual(solve([5, 4, 3, 2, 1]), 1);
  assert.strictEqual(solve([-2, -1, -3, 0]), 3);
}
console.log('✓ 03-longest-increasing-subsequence passed');

module.exports = { bruteForce, memo, tabulation, optimized };
