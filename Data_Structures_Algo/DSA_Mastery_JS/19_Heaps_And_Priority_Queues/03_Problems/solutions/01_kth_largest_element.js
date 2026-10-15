/**
 * 01. Kth Largest Element in an Array   (LeetCode 215 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return the k-th largest element
 * (in sorted order, not the k-th distinct element).
 *
 * EXAMPLES
 * Input: nums = [3,2,1,5,6,4], k = 2        Output: 5   Explanation: sorted desc 6,5,... -> 2nd is 5
 * Input: nums = [3,2,3,1,2,4,5,5,6], k = 4  Output: 4   Explanation: 6,5,5,4 -> 4th is 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is k always valid (1 <= k <= n)? (yes)
 * - Duplicates count separately? (yes: "k-th largest in sorted order")
 * - Can I sort? (allowed, but the interviewer wants better than O(n log n))
 *
 * APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space
 * Sort descending and take index k-1. Simple, but sorts everything even though
 * we only care about the top k.
 *
 * APPROACH 2 — Optimal (min-heap of size k)   O(n log k) time, O(k) space
 * Keep a MIN-heap that holds the k largest elements seen so far. Its top is the
 * SMALLEST of those k, which is exactly the k-th largest overall.
 * For each number: push it; if the heap grows past k, pop the smallest (it can
 * never be the answer because k bigger numbers exist).
 *
 * Dry run on nums = [3,2,1,5,6,4], k = 2:
 *   push 3           heap = [3]
 *   push 2           heap = [2,3]
 *   push 1 -> size 3, pop 1   heap = [2,3]
 *   push 5 -> pop 2           heap = [3,5]
 *   push 6 -> pop 3           heap = [5,6]
 *   push 4 -> pop 4           heap = [5,6]
 *   answer = heap.peek() = 5
 *
 * (Quickselect gives O(n) average and is also worth mentioning; see 11_Sorting.)
 *
 * EDGE CASES
 * - k = 1 -> maximum
 * - k = n -> minimum
 * - all duplicates -> that value
 * - negative numbers
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function bruteForce(nums, k) {
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted[k - 1];
}

function optimal(nums, k) {
  const heap = new MinHeap(); // holds the k largest so far; top = smallest of them
  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) heap.pop(); // drop the smallest, it is not in the top k
  }
  return heap.peek();
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 2, 1, 5, 6, 4], 2), 5);
  assert.strictEqual(solve([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4);
  assert.strictEqual(solve([1], 1), 1);
  assert.strictEqual(solve([7, 7, 7], 2), 7);
  assert.strictEqual(solve([-1, -5, -3], 1), -1);
  assert.strictEqual(solve([-1, -5, -3], 3), -5);
  assert.strictEqual(solve([2, 1], 2), 1);
}
console.log('✓ 01-kth-largest-element passed');

module.exports = { optimal, bruteForce };
