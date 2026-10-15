/**
 * 07. Sliding Window Maximum   (LeetCode 239 — Hard)
 *
 * PROBLEM
 * Given an array nums and a window size k, return the maximum of every
 * contiguous window of size k as the window slides from left to right.
 *
 * EXAMPLES
 * Input: nums = [1,3,-1,-3,5,3,6,7], k = 3   Output: [3,3,5,5,6,7]
 *   [1 3 -1] -3 5 3 6 7  -> 3
 *   1 [3 -1 -3] 5 3 6 7  -> 3
 *   1 3 [-1 -3 5] 3 6 7  -> 5 ...
 * Input: nums = [1], k = 1                   Output: [1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= nums.length? (yes)
 * - Negatives allowed? (yes)
 * - Need O(n)? (yes - the O(n*k) brute force is too slow for 10^5)
 *
 * APPROACH 1 — Brute force   O(n*k) time, O(1) extra space
 * For every window start, scan the k elements for the max.
 *
 * APPROACH 2 — Optimal (monotonic decreasing deque of indices)   O(n) time, O(k) space
 * Keep a deque of INDICES whose values are decreasing from front to back.
 * Invariant: the front is the index of the current window's maximum.
 * For each index i:
 *   1. pop from the BACK while nums[back] <= nums[i]
 *      (a smaller element that is also OLDER can never be the max again)
 *   2. push i at the back
 *   3. pop from the FRONT if it has left the window (front <= i - k)
 *   4. once i >= k - 1, record nums[front]
 * Every index is pushed once and popped at most once -> O(n).
 *
 * Dry run on [1,3,-1,-3,5,3,6,7], k=3 (deque shows values for readability):
 *   i=0 (1)   deque [1]
 *   i=1 (3)   3>=1 pop -> [3]
 *   i=2 (-1)  deque [3,-1]                 record 3
 *   i=3 (-3)  deque [3,-1,-3] ; front(idx 1) still in window   record 3
 *   i=4 (5)   pops -3,-1,3 -> [5]          record 5
 *   i=5 (3)   deque [5,3]                  record 5
 *   i=6 (6)   pops 3,5 -> [6]              record 6
 *   i=7 (7)   pops 6 -> [7]                record 7
 *
 * EDGE CASES
 * - k = 1 -> the array itself
 * - k = n -> single max
 * - all equal values (use <= when popping so duplicates don't pile up)
 * - decreasing array (deque fills, front expires each step)
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
  const deque = []; // indices; nums values decreasing front -> back
  let front = 0;    // index into `deque` acting as its front (avoids O(n) shift)

  for (let i = 0; i < nums.length; i++) {
    // 1. remove smaller-or-equal elements from the back
    while (deque.length > front && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    // 2. add the current index
    deque.push(i);
    // 3. expire the front if it fell out of the window
    if (deque[front] <= i - k) front++;
    // 4. record the max once the first window is complete
    if (i >= k - 1) result.push(nums[deque[front]]);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
  assert.deepStrictEqual(solve([1], 1), [1]);
  assert.deepStrictEqual(solve([1, -1], 1), [1, -1]);
  assert.deepStrictEqual(solve([9, 8, 7, 6, 5], 2), [9, 8, 7, 6]);
  assert.deepStrictEqual(solve([4, 4, 4, 4], 2), [4, 4, 4]);
  assert.deepStrictEqual(solve([1, 2, 3, 4], 4), [4]);
  assert.deepStrictEqual(solve([-7, -8, 7, 5, 7, 1, 6, 0], 4), [7, 7, 7, 7, 7]);
}
console.log('✓ 07-sliding-window-maximum passed');

module.exports = { optimal, bruteForce };
