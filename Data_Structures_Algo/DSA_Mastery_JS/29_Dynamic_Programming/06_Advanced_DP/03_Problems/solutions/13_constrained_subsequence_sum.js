/**
 * 13. Constrained Subsequence Sum   (LeetCode 1425 — Hard)
 *
 * PROBLEM
 * Pick a non-empty subsequence of nums such that any two consecutive picked indices
 * are at most k apart (j - i <= k). Return the maximum possible sum.
 *
 * EXAMPLES
 * Input: nums = [10,2,-10,5,20], k = 2   Output: 37   Explanation: 10 + 2 + 5 + 20
 * Input: nums = [-1,-2,-3], k = 1        Output: -1   Explanation: must pick something
 * Input: nums = [10,-2,-10,-5,20], k = 2 Output: 23   Explanation: 10 + (-2) + (-5) + 20
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n, k <= 10^5 -> O(n * k) is too slow, we need O(n) or O(n log n).
 * - Values may be negative; the subsequence must be non-empty.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(k^n) time, O(n) space
 * best(i) = nums[i] + max(0, best(i-1..i-k)), recomputed every time.
 *
 * APPROACH 2 — 1D DP (Kadane with a window)   O(n * k) time, O(n) space
 * STATE      dp[i] = max sum of a valid subsequence that ENDS at index i.
 * RECURRENCE dp[i] = nums[i] + max(0, max(dp[i-k .. i-1]))
 *            ("start fresh" if every reachable previous dp is negative - that is Kadane)
 * BASE CASES dp[0] = nums[0].
 * ANSWER     max of all dp[i].
 * The inner max over a window of size k is the O(k) part we want to kill.
 *
 * APPROACH 3 — DP + monotonic deque   O(n) time, O(k) extra space
 * "max over the last k dp values" is exactly Sliding Window Maximum. Keep a deque of
 * indices whose dp values are DECREASING from front to back:
 *   - front = index with the largest dp in the window
 *   - before using it, pop the front if it is older than i - k
 *   - after computing dp[i], pop from the back every index with dp <= dp[i] (they can
 *     never be the max again while i is around), then push i.
 * Each index enters and leaves the deque once -> O(n) total.
 *
 * Dry run nums = [10,2,-10,5,20], k = 2:
 *   i | window max | dp[i]            | deque (indices, front first)
 *   0 |  (none)    | 10               | [0]
 *   1 |  10        | 2 + 10 = 12      | [1]            (10 <= 12 popped)
 *   2 |  12        | -10 + 12 = 2     | [1, 2]
 *   3 |  12 (i-k=1 still valid) | 5 + 12 = 17 | [3]   (2 and 12 popped)
 *   4 |  17        | 20 + 17 = 37     | [4]
 *   answer = 37
 *
 * EDGE CASES
 * - all negative -> the single largest element
 * - k >= n -> plain "sum of positives, or max element if none positive"
 */

function bruteForce(nums, k) {
  function best(i) { // max sum of a valid subsequence ending at i
    let previous = 0;
    for (let j = Math.max(0, i - k); j < i; j++) previous = Math.max(previous, best(j));
    return nums[i] + previous;
  }
  let answer = -Infinity;
  for (let i = 0; i < nums.length; i++) answer = Math.max(answer, best(i));
  return answer;
}

function memo(nums, k) {
  const cache = new Array(nums.length).fill(null);
  function best(i) {
    if (cache[i] !== null) return cache[i];
    let previous = 0;
    for (let j = Math.max(0, i - k); j < i; j++) previous = Math.max(previous, best(j));
    cache[i] = nums[i] + previous;
    return cache[i];
  }
  let answer = -Infinity;
  for (let i = 0; i < nums.length; i++) answer = Math.max(answer, best(i));
  return answer;
}

function tabulation(nums, k) {
  const n = nums.length;
  const dp = new Array(n);
  let answer = -Infinity;
  for (let i = 0; i < n; i++) {
    let previous = 0;
    for (let j = Math.max(0, i - k); j < i; j++) previous = Math.max(previous, dp[j]);
    dp[i] = nums[i] + previous;
    answer = Math.max(answer, dp[i]);
  }
  return answer;
}

function optimized(nums, k) {
  const n = nums.length;
  const dp = new Array(n);
  const deque = [];  // indices; dp values decreasing from head to tail
  let head = 0;      // "pop front" = head++, avoids O(n) shift()
  let answer = -Infinity;
  for (let i = 0; i < n; i++) {
    while (head < deque.length && deque[head] < i - k) head++;       // drop indices out of window
    const previous = head < deque.length ? Math.max(0, dp[deque[head]]) : 0;
    dp[i] = nums[i] + previous;
    answer = Math.max(answer, dp[i]);
    while (deque.length > head && dp[deque[deque.length - 1]] <= dp[i]) deque.pop();
    deque.push(i);
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([10, 2, -10, 5, 20], 2), 37);
  assert.strictEqual(solve([-1, -2, -3], 1), -1);
  assert.strictEqual(solve([10, -2, -10, -5, 20], 2), 23);
  assert.strictEqual(solve([5], 3), 5);
  assert.strictEqual(solve([-5, -1, -8], 2), -1);
  assert.strictEqual(solve([1, -1, -2, 4, -7, 3], 2), 7);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 10), 15);
}
console.log('✓ 13-constrained-subsequence-sum passed');

module.exports = { bruteForce, memo, tabulation, optimized };
