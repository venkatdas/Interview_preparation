/**
 * 05. Top K Frequent Elements   (LeetCode 347 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return the k most frequent
 * elements. Any order is accepted.
 *
 * EXAMPLES
 * Input: nums = [1,1,1,2,2,3], k = 2   Output: [1,2]   Explanation: 1 appears 3x, 2 appears 2x
 * Input: nums = [1], k = 1             Output: [1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the answer unique? (yes, guaranteed)
 * - k <= number of distinct elements? (yes)
 * - Must be better than O(n log n)? (the follow-up asks for it)
 *
 * APPROACH 1 — Brute force (count + sort)   O(n log n) time, O(n) space
 * Count with a Map, turn into [value, count] pairs, sort by count descending,
 * take k. Sorting ALL distinct values is more than we need.
 *
 * APPROACH 2 — Optimal (count + min-heap of size k)   O(n log k) time, O(n) space
 * Count frequencies in a Map (O(n)). Then push each [value, count] into a
 * MIN-heap ordered by count, popping whenever size > k. The heap keeps the k
 * most frequent; the least frequent of those sits on top and gets evicted first.
 *
 * Dry run on [1,1,1,2,2,3], k = 2:
 *   counts: {1:3, 2:2, 3:1}
 *   push [1,3]          heap = {[1,3]}
 *   push [2,2]          heap = {[2,2],[1,3]}   (top = count 2)
 *   push [3,1] -> size 3 -> pop [3,1]  heap = {[2,2],[1,3]}
 *   answer = [2,1] (any order)
 *
 * Bucket sort gives true O(n): see 05_Hashing for that version. The heap
 * version is the one most interviewers expect you to code first.
 *
 * EDGE CASES
 * - k equals number of distinct values -> return all
 * - all same element
 * - negative numbers
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function countFrequencies(nums) {
  const counts = new Map();
  for (const num of nums) counts.set(num, (counts.get(num) || 0) + 1);
  return counts;
}

function bruteForce(nums, k) {
  const counts = countFrequencies(nums);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([value]) => value);
}

function optimal(nums, k) {
  const counts = countFrequencies(nums);
  const heap = new MinHeap((a, b) => a[1] - b[1]); // [value, count], smallest count on top
  for (const entry of counts) {
    heap.push(entry);
    if (heap.size() > k) heap.pop(); // evict the least frequent candidate
  }
  return heap.toArray().map(([value]) => value);
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (arr) => [...arr].sort((a, b) => a - b);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sorted(solve([1, 1, 1, 2, 2, 3], 2)), [1, 2]);
  assert.deepStrictEqual(sorted(solve([1], 1)), [1]);
  assert.deepStrictEqual(sorted(solve([4, 4, 4, 4], 1)), [4]);
  assert.deepStrictEqual(sorted(solve([-1, -1, 2, 2, 3], 2)), [-1, 2]);
  assert.deepStrictEqual(sorted(solve([5, 6, 7], 3)), [5, 6, 7]);
  assert.deepStrictEqual(sorted(solve([1, 2, 2, 3, 3, 3], 1)), [3]);
}
console.log('✓ 05-top-k-frequent-elements passed');

module.exports = { optimal, bruteForce };
