/**
 * 02. Sliding Window Maximum, sparse table version   (LeetCode 239 — Hard)
 *
 * PROBLEM
 * Given nums and a window size k, return the maximum of every contiguous window of size k,
 * from left to right.
 *
 * EXAMPLES
 * Input: nums = [1,3,-1,-3,5,3,6,7], k = 3   Output: [3,3,5,5,6,7]
 * Input: nums = [1], k = 1                   Output: [1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n
 * - n up to 10^5 -> O(n * k) is too slow for big k
 * - The usual interview answer is a monotonic deque (O(n), see
 *   ../../18_Monotonic_Stacks_And_Queues/). The sparse table is an alternative that is easy to
 *   get right and also answers ARBITRARY range-max queries, not only fixed-size windows.
 *
 * APPROACH 1 — Brute force   O(n * k) time
 * For every window start, scan k elements.
 *
 * APPROACH 2 — Optimal (Sparse table for range max)   O(n log n) build, O(1) per window
 * Every window [i, i + k - 1] is a range-max query. All windows have the same length, so
 * the level is the same for every query: level = floor(log2 k).
 * answer[i] = max(table[level][i], table[level][i + k - 2^level]).
 *
 * Dry run: nums = [1,3,-1,-3,5,3,6,7], k = 3 -> level = 1 (blocks of 2)
 *   table[1] = [3, 3, -1, 5, 5, 6, 7]
 *   window 0 [0..2]: max(table[1][0], table[1][1]) = max(3, 3) = 3
 *   window 1 [1..3]: max(3, -1) = 3
 *   window 2 [2..4]: max(-1, 5) = 5
 *   window 3 [3..5]: max(5, 5) = 5
 *   window 4 [4..6]: max(5, 6) = 6
 *   window 5 [5..7]: max(6, 7) = 7
 *
 * EDGE CASES
 * - k = 1 -> the array itself
 * - k = n -> single answer
 * - negative numbers, duplicates
 */

function bruteForce(nums, k) {
  const result = [];
  for (let start = 0; start + k <= nums.length; start++) {
    let best = -Infinity;
    for (let i = start; i < start + k; i++) best = Math.max(best, nums[i]);
    result.push(best);
  }
  return result;
}

function optimal(nums, k) {
  const n = nums.length;
  // build the max sparse table up to the level we need
  const table = [nums.slice()];
  for (let lvl = 1; (1 << lvl) <= k; lvl++) {
    const prev = table[lvl - 1];
    const half = 1 << (lvl - 1);
    const row = [];
    for (let i = 0; i + (1 << lvl) <= n; i++) row.push(Math.max(prev[i], prev[i + half]));
    table.push(row);
  }
  const level = table.length - 1;             // floor(log2 k)
  const blockLen = 1 << level;
  const result = [];
  for (let i = 0; i + k <= n; i++) {
    result.push(Math.max(table[level][i], table[level][i + k - blockLen]));
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
  assert.deepStrictEqual(solve([1], 1), [1]);
  assert.deepStrictEqual(solve([4, 2, 9], 3), [9]);
  assert.deepStrictEqual(solve([5, 5, 5], 2), [5, 5]);
  assert.deepStrictEqual(solve([-7, -3, -9, -1], 2), [-3, -3, -1]);
  assert.deepStrictEqual(solve([9, 8, 7, 6], 1), [9, 8, 7, 6]);
}
for (let trial = 0; trial < 100; trial++) {
  const n = 1 + Math.floor(Math.random() * 30);
  const k = 1 + Math.floor(Math.random() * n);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 40) - 20);
  assert.deepStrictEqual(optimal(nums, k), bruteForce(nums, k));
}
console.log('✓ 02-sliding-window-maximum-sparse-table passed');

module.exports = { optimal, bruteForce };
