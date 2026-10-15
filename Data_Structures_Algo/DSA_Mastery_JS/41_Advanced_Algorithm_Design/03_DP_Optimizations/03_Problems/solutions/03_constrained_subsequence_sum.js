/**
 * 03. Constrained Subsequence Sum   (LeetCode 1425 — Hard)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, choose a NON-EMPTY subsequence such that
 * for every two neighbouring chosen indices i < j we have j - i <= k. Return the largest
 * possible sum of the chosen elements.
 *
 * EXAMPLES
 * nums = [10,2,-10,5,20], k = 2     -> 37   (10, 2, 5, 20)
 * nums = [-1,-2,-3], k = 1          -> -1   (non-empty: best single element)
 * nums = [10,-2,-10,-5,20], k = 2   -> 23   (10, -2, -5, 20)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n <= 1e5, -1e4 <= nums[i] <= 1e4.
 * - Must the subsequence be non-empty? (yes -> all-negative input returns the max element)
 * - Is k the maximum GAP of indices (j - i <= k)? (yes)
 *
 * APPROACH 1 — Brute force DP   O(n·k) time, O(n) space
 * dp[i] = best sum of a valid subsequence that ENDS at i
 *       = nums[i] + max(0, dp[i-k], ..., dp[i-1])
 * The max(0, ...) means "or start a fresh subsequence at i" (never extend a negative chain).
 * Answer = max over all dp[i].
 *
 * APPROACH 2 — Optimal (monotonic deque)   O(n) time, O(k) space
 * Same recurrence; the inner max over the last k dp values is a sliding window maximum.
 * Deque of indices with decreasing dp. Small extra trick: only push dp[i] if it is
 * positive is NOT needed - pushing always is simpler and still correct because we clamp
 * with max(0, ...).
 *
 * Dry run on nums = [10,2,-10,5,20], k = 2:
 *   i | window best | dp[i]            | deque (idx:dp)
 *   0 | none -> 0   | 10               | [0:10]
 *   1 | 10          | 12               | [1:12]
 *   2 | 12          | 2                | [1:12, 2:2]
 *   3 | 12          | 17               | [3:17]
 *   4 | 17          | 37               | [4:37]
 *   answer max(dp) = 37
 *
 * EDGE CASES
 * - all negative -> the largest single element
 * - k >= n -> the window is the whole prefix
 * - n = 1 -> nums[0]
 */

function bruteForce(nums, k) {
  const dp = new Array(nums.length);
  let ans = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let best = 0;
    for (let j = Math.max(0, i - k); j < i; j++) best = Math.max(best, dp[j]);
    dp[i] = nums[i] + best;
    ans = Math.max(ans, dp[i]);
  }
  return ans;
}

function optimal(nums, k) {
  const n = nums.length;
  const dp = new Array(n);
  const dq = new Array(n);
  let head = 0;
  let tail = 0;
  let ans = -Infinity;
  for (let i = 0; i < n; i++) {
    while (head < tail && dq[head] < i - k) head++;
    dp[i] = nums[i] + Math.max(0, head < tail ? dp[dq[head]] : 0);
    ans = Math.max(ans, dp[i]);
    while (head < tail && dp[dq[tail - 1]] <= dp[i]) tail--;
    dq[tail++] = i;
  }
  return ans;
}

// Exhaustive check over every subsequence (tiny n only) - validates the DP itself.
function exhaustive(nums, k) {
  const n = nums.length;
  let best = -Infinity;
  for (let mask = 1; mask < 1 << n; mask++) {
    let sum = 0;
    let last = -1;
    let ok = true;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        if (last !== -1 && i - last > k) { ok = false; break; }
        sum += nums[i];
        last = i;
      }
    }
    if (ok) best = Math.max(best, sum);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([10, 2, -10, 5, 20], 2), 37);
  assert.strictEqual(solve([-1, -2, -3], 1), -1);
  assert.strictEqual(solve([10, -2, -10, -5, 20], 2), 23);
  assert.strictEqual(solve([7], 1), 7);
  assert.strictEqual(solve([-5, -1, -8], 3), -1);
  assert.strictEqual(solve([1, -100, -100, 1], 3), 2);
}

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1425);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 12);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 21) - 10);
  const k = 1 + Math.floor(rand() * n);
  const want = exhaustive(nums, k);
  assert.strictEqual(bruteForce(nums, k), want);
  assert.strictEqual(optimal(nums, k), want);
}
console.log('✓ 03_constrained_subsequence_sum passed');

module.exports = { optimal, bruteForce };
