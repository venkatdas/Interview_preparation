/**
 * 14. Split Array Largest Sum   (LeetCode 410 — Hard)
 *
 * PROBLEM
 * Split an array of non-negative integers into k non-empty CONTIGUOUS subarrays so
 * that the largest subarray sum is as small as possible. Return that minimised
 * largest sum.
 *
 * EXAMPLES
 * Input: nums = [7,2,5,10,8], k = 2   Output: 18   ([7,2,5] and [10,8])
 * Input: nums = [1,2,3,4,5], k = 2    Output: 9    ([1,2,3] and [4,5])
 * Input: nums = [1,4,4], k = 3        Output: 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n <= 1000, values up to 10^6
 * - Contiguous (this is what makes it identical in shape to "ship packages")
 * - "Minimise the maximum" is the classic signal for binary search on the answer
 *
 * APPROACH 1 — Brute force (DP)   O(k * n^2)
 * dp[i][j] = best answer for the first i elements split into j parts:
 *   dp[i][j] = min over p < i of max(dp[p][j-1], sum(p..i-1)).
 * Correct and a fine interview answer, but slower than the search.
 *
 * APPROACH 2 — Optimal (binary search on the answer)   O(n log sum) time, O(1) space
 * Guess an upper limit L for a subarray sum. Greedily cut: walk the array, start a
 * new piece whenever adding the next number would exceed L. If the number of pieces
 * <= k, L is feasible (we can always split pieces further to reach exactly k since
 * values are non-negative). Feasibility is monotonic in L -> binary search the smallest
 * feasible L in [max(nums), sum(nums)].
 *
 * Dry run [7,2,5,10,8], k=2: lo=10 hi=32
 *   mid=21: [7,2,5]=14 +10=24 no -> [10,8]=18 -> 2 pieces <= 2 -> hi=21
 *   mid=15: [7,2,5]=14 | [10] +8=18 no -> [8] -> 3 > 2 -> lo=16
 *   mid=18: [7,2,5]=14 | [10,8]=18 -> 2 -> hi=18
 *   mid=17: [7,2,5] | [10] | [8] -> 3 -> lo=18
 *   lo === hi === 18
 *
 * EDGE CASES
 * - k === 1 -> sum; k === n -> max
 * - zeros in the array (pieces can be empty-sum but not empty)
 * - single element
 */

function bruteForce(nums, k) {
  const n = nums.length;
  const prefix = [0];
  for (const v of nums) prefix.push(prefix[prefix.length - 1] + v);
  // dp[j][i]: first i elements into j parts
  let prev = new Array(n + 1).fill(Infinity);
  prev[0] = 0;
  for (let parts = 1; parts <= k; parts++) {
    const cur = new Array(n + 1).fill(Infinity);
    for (let i = parts; i <= n; i++) {
      for (let p = parts - 1; p < i; p++) {
        const candidate = Math.max(prev[p], prefix[i] - prefix[p]);
        if (candidate < cur[i]) cur[i] = candidate;
      }
    }
    prev = cur;
  }
  return prev[n];
}

function piecesNeeded(nums, limit) {
  let pieces = 1, sum = 0;
  for (const v of nums) {
    if (sum + v > limit) { pieces++; sum = 0; }
    sum += v;
  }
  return pieces;
}

function optimal(nums, k) {
  let lo = Math.max(...nums);
  let hi = nums.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (piecesNeeded(nums, mid) <= k) hi = mid;   // limit mid is achievable: try smaller
    else lo = mid + 1;
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([7, 2, 5, 10, 8], 2), 18);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 2), 9);
  assert.strictEqual(solve([1, 4, 4], 3), 4);
  assert.strictEqual(solve([5], 1), 5);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 1), 15);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 5), 5);
  assert.strictEqual(solve([0, 0, 0, 10], 2), 10);
  assert.strictEqual(solve([2, 3, 1, 2, 4, 3], 5), 4);
}
for (let trial = 0; trial < 100; trial++) {
  const nums = Array.from({ length: 1 + Math.floor(Math.random() * 8) }, () => Math.floor(Math.random() * 20));
  const k = 1 + Math.floor(Math.random() * nums.length);
  assert.strictEqual(optimal(nums, k), bruteForce(nums, k), JSON.stringify([nums, k]));
}
console.log('✓ 14-split-array-largest-sum passed');

module.exports = { optimal, bruteForce };
