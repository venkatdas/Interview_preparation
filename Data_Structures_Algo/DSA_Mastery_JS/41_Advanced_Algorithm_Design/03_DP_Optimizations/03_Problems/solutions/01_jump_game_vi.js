/**
 * 01. Jump Game VI   (LeetCode 1696 — Medium)
 *
 * PROBLEM
 * You stand on index 0 of an integer array nums. In one move you may jump forward by
 * 1..k positions (never past the end). Your score is the sum of nums[i] over every index
 * you land on, including the first and the last. Return the maximum score for reaching
 * index n - 1.
 *
 * EXAMPLES
 * nums = [1,-1,-2,4,-7,3], k = 2   -> 7    (0 -> 1 -> 3 -> 5 : 1 - 1 + 4 + 3)
 * nums = [10,-5,-2,4,0,3],  k = 3  -> 17   (0 -> 3 -> 5 : 10 + 4 + 3)
 * nums = [5], k = 1                -> 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n, k <= 1e5, values may be negative.
 * - Must I land on the last index? (yes - its value always counts)
 * - Can the answer overflow 2^53? (no: |sum| <= 1e5 * 1e4)
 *
 * APPROACH 1 — Brute force DP   O(n·k) time, O(n) space
 * dp[i] = nums[i] + max(dp[i-k .. i-1]). Scan the k previous states for every i.
 * With n = k = 1e5 that is 1e10 steps: too slow.
 *
 * APPROACH 2 — Optimal (monotonic deque over dp)   O(n) time, O(k) space
 * The transition is a MAX over a SLIDING WINDOW of earlier dp values, which is exactly the
 * sliding-window-maximum problem. Keep a deque of indices with decreasing dp values:
 *   - pop from the front indices that left the window (j < i - k)
 *   - front = best previous state -> dp[i] = nums[i] + dp[front]
 *   - pop from the back every j with dp[j] <= dp[i] (older AND not better: useless)
 *   - push i
 *
 * Dry run on nums = [1,-1,-2,4,-7,3], k = 2:
 *   i | window ok?      | front dp | dp[i] | deque after (idx:dp)
 *   0 | -               | -        | 1     | [0:1]
 *   1 | 0 in window     | 1        | 0     | [0:1, 1:0]
 *   2 | 0 in window     | 1        | -1    | [0:1, 1:0, 2:-1]
 *   3 | drop 0 (0 < 1)  | 0        | 4     | [3:4]  (popped 2 and 1)
 *   4 | 3 ok            | 4        | -3    | [3:4, 4:-3]
 *   5 | 3 ok            | 4        | 7     | [5:7]
 *   answer dp[5] = 7
 *
 * EDGE CASES
 * - n = 1 -> nums[0] (no jumps)
 * - k >= n -> may jump straight to the end, but still may collect positives on the way
 * - all negative -> take the fewest, least-negative stops
 */

function bruteForce(nums, k) {
  const n = nums.length;
  const dp = new Array(n);
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
  const dq = new Array(n); // indices; head/tail pointers avoid O(n) Array.shift
  let head = 0;
  let tail = 0;
  dp[0] = nums[0];
  dq[tail++] = 0;
  for (let i = 1; i < n; i++) {
    while (dq[head] < i - k) head++;                      // left the window
    dp[i] = nums[i] + dp[dq[head]];
    while (head < tail && dp[dq[tail - 1]] <= dp[i]) tail--; // dominated
    dq[tail++] = i;
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
  assert.strictEqual(solve([-1, -2, -3], 5), -4);          // jump straight to the end
  assert.strictEqual(solve([2, 2, 2, 2], 1), 8);           // k = 1 forces every stop
}

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1696);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 30);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 21) - 10);
  const k = 1 + Math.floor(rand() * 8);
  assert.strictEqual(optimal(nums, k), bruteForce(nums, k));
}
console.log('✓ 01_jump_game_vi passed');

module.exports = { optimal, bruteForce };
