/**
 * 06. Jump Game VI   (LeetCode 1696 — Medium)
 *
 * PROBLEM
 * You start at index 0 and must reach index n - 1. From index i you may jump to any index
 * in [i + 1, i + k]. Your score is the sum of nums at every index you visit (including
 * 0 and n - 1). Return the maximum score.
 *
 * EXAMPLES
 * Input: nums = [1,-1,-2,4,-7,3], k = 2   Output: 7    (1 -> -1 -> 4 -> 3)
 * Input: nums = [10,-5,-2,4,0,3], k = 3   Output: 17   (10 -> 4 -> 3)
 * Input: nums = [1,-5,-20,4,-1,3,-6,-3], k = 2   Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5, k up to n -> O(n * k) is too slow for large k
 * - Values can be negative; you must still reach the end
 *
 * APPROACH 1 — Brute force (DP with inner loop)   O(n * k) time, O(n) space
 * dp[i] = nums[i] + max(dp[i-k .. i-1]). Scan the k previous entries for each i.
 *
 * APPROACH 2 — Optimal (DP + monotonic deque = sliding window maximum)   O(n) time, O(k) space
 * "max of dp over the last k indices" is exactly a sliding window maximum. Keep a deque of
 * indices with DECREASING dp values; the front is the best previous position.
 *   for each i: drop front if it is < i - k; dp[i] = nums[i] + dp[front];
 *               pop back while dp[back] <= dp[i]; push i.
 *
 * Dry run: nums = [1,-1,-2,4,-7,3], k = 2
 *   i=0: dp[0] = 1                       deque [0]
 *   i=1: front 0 -> dp = -1 + 1 = 0      deque [0,1]      (dp: 1, 0)
 *   i=2: front 0 -> dp = -2 + 1 = -1     deque [0,1,2]    (1, 0, -1)
 *   i=3: drop 0 (< 3-2); front 1 -> dp = 4 + 0 = 4; pop 2, pop 1 (both <= 4)  deque [3]
 *   i=4: front 3 -> dp = -7 + 4 = -3     deque [3,4]
 *   i=5: front 3 (3 >= 5-2 ok) -> dp = 3 + 4 = 7; pop 4   deque [3,5]
 *   answer dp[5] = 7
 *
 * EDGE CASES
 * - n = 1 -> nums[0]
 * - k >= n -> can jump straight to the end: nums[0] + nums[n-1] if that is best (deque handles it)
 * - all negative -> still forced to the end
 */

function bruteForce(nums, k) {
  const n = nums.length;
  const dp = new Array(n).fill(-Infinity);
  dp[0] = nums[0];
  for (let i = 1; i < n; i++) {
    let best = -Infinity;
    for (let j = Math.max(0, i - k); j < i; j++) best = Math.max(best, dp[j]);
    dp[i] = nums[i] + best;
  }
  return dp[n - 1];
}

function optimal(nums, k) {
  const n = nums.length;
  const dp = new Array(n);
  dp[0] = nums[0];
  const deque = [0];   // indices with decreasing dp values
  let head = 0;
  for (let i = 1; i < n; i++) {
    if (deque[head] < i - k) head++;                  // front fell out of the window
    dp[i] = nums[i] + dp[deque[head]];
    while (deque.length > head && dp[deque[deque.length - 1]] <= dp[i]) deque.pop();
    deque.push(i);
  }
  return dp[n - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, -1, -2, 4, -7, 3], 2), 7);
  assert.strictEqual(solve([10, -5, -2, 4, 0, 3], 3), 17);
  assert.strictEqual(solve([1, -5, -20, 4, -1, 3, -6, -3], 2), 0);
  assert.strictEqual(solve([5], 1), 5);
  assert.strictEqual(solve([-1, -2, -3], 5), -4);
  assert.strictEqual(solve([1, 2, 3, 4], 1), 10);
}
for (let trial = 0; trial < 200; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const k = 1 + Math.floor(Math.random() * n);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 21) - 10);
  assert.strictEqual(optimal(nums, k), bruteForce(nums, k));
}
console.log('✓ 06-jump-game-vi passed');

module.exports = { optimal, bruteForce };
