/**
 * 12. Sliding Window Maximum   (LeetCode 239 — Hard)
 *
 * PROBLEM
 * Given an integer array nums and a window size k, return an array with the maximum of
 * every window of size k as it slides from left to right.
 *
 * EXAMPLES
 * Input: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3   Output: [3, 3, 5, 5, 6, 7]
 * Input: nums = [1], k = 1                          Output: [1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n? (yes)
 * - Negative numbers? (yes; doesn't matter)
 * - Need O(n)? (the follow-up; a heap gives O(n log k))
 *
 * APPROACH 1 — Brute force   O(n * k) time, O(1) space
 * For each window, scan its k elements for the max.
 *
 * APPROACH 2 — Optimal (monotonic deque of indices)   O(n) time, O(k) space
 * Keep a deque of INDICES whose values are strictly decreasing from front to back.
 * The front is always the max of the current window.
 * For each right:
 *   1. If the front index fell out of the window (front <= right - k), pop it from the front.
 *   2. While the back value <= nums[right], pop from the back. Those elements are smaller
 *      AND older than nums[right], so they can never be a window max again.
 *   3. Push right.
 *   4. If right >= k - 1, record nums[front].
 * Each index is pushed once and popped at most once -> O(n) total.
 *
 * Dry run on [1, 3, -1, -3, 5, 3, 6, 7], k = 3 (deque shows values for readability):
 *   r=0 (1):  deque [1]
 *   r=1 (3):  pop 1 (<= 3)      deque [3]
 *   r=2 (-1): deque [3, -1]                  record 3
 *   r=3 (-3): deque [3, -1, -3]              record 3
 *   r=4 (5):  front idx 1 > 4-3=1? no, 1 <= 1 -> pop front; pop -3, -1 (<= 5)  deque [5]  record 5
 *   r=5 (3):  deque [5, 3]                   record 5
 *   r=6 (6):  pop 3, 5          deque [6]    record 6
 *   r=7 (7):  pop 6             deque [7]    record 7
 *   [3, 3, 5, 5, 6, 7]
 *
 * Implementation note: JS arrays have O(n) shift(). We use a head index into an array
 * so both ends are O(1) (a classic trick; see 17_Queues_And_Deques for a real Deque class).
 *
 * EDGE CASES
 * - k = 1 -> the array itself
 * - k = n -> single max
 * - Strictly decreasing input -> each window's max is its first element
 * - Duplicates: use <= when popping so equal older values are dropped
 */

function bruteForce(nums, k) {
  const result = [];
  for (let start = 0; start + k <= nums.length; start++) {
    let max = -Infinity;
    for (let i = start; i < start + k; i++) max = Math.max(max, nums[i]);
    result.push(max);
  }
  return result;
}

function optimal(nums, k) {
  const result = [];
  const deque = []; // indices; values decreasing from head to tail
  let head = 0;     // deque[head] is the front; items before head are "popped"

  for (let right = 0; right < nums.length; right++) {
    // 1. evict the front if it slid out of the window
    if (head < deque.length && deque[head] <= right - k) head++;

    // 2. evict smaller-or-equal values from the back
    while (deque.length > head && nums[deque[deque.length - 1]] <= nums[right]) deque.pop();

    // 3. add the new index
    deque.push(right);

    // 4. window is full: front is the max
    if (right >= k - 1) result.push(nums[deque[head]]);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
  assert.deepStrictEqual(solve([1], 1), [1]);
  assert.deepStrictEqual(solve([4, 3, 2, 1], 2), [4, 3, 2]);
  assert.deepStrictEqual(solve([1, 2, 3, 4], 4), [4]);
  assert.deepStrictEqual(solve([5, 5, 5], 2), [5, 5]);
  assert.deepStrictEqual(solve([-7, -8, 7, 5, 7, 1, 6, 0], 4), [7, 7, 7, 7, 7]);
  assert.deepStrictEqual(solve([9, 8, 7, 6], 1), [9, 8, 7, 6]);
}
console.log('✓ 12-sliding-window-maximum passed');

module.exports = { optimal, bruteForce };
