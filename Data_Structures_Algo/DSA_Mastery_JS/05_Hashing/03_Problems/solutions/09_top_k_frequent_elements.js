/**
 * 09. Top K Frequent Elements   (LeetCode 347 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return the k most frequent elements.
 * The answer is guaranteed to be unique. Return in any order.
 *
 * EXAMPLES
 * Input: nums = [1, 1, 1, 2, 2, 3], k = 2   Output: [1, 2]
 * Input: nums = [1], k = 1                  Output: [1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is k always valid (1 <= k <= number of distinct elements)? (yes)
 * - Ties? ("answer is unique" means no ambiguous ties for the k-th spot)
 * - Follow-up they always ask: can you do better than O(n log n)? (yes: bucket sort)
 *
 * APPROACH 1 — Brute force (count + sort)   O(n log n) time, O(n) space
 * Count with a Map, turn into [value, count] pairs, sort by count descending, take k.
 *
 * APPROACH 2 — Optimal (count + bucket sort)   O(n) time, O(n) space
 * Key insight: a count can never exceed n. So make an array `buckets` of size n + 1
 * where buckets[c] holds every value that appears exactly c times.
 * Then walk buckets from the END (highest count) and collect values until we have k.
 *
 * Dry run on [1, 1, 1, 2, 2, 3], k = 2:
 *   counts = {1:3, 2:2, 3:1}
 *   buckets: index 1 -> [3], index 2 -> [2], index 3 -> [1]
 *   walk from index 6 down: idx 3 -> take 1 (have 1); idx 2 -> take 2 (have 2) -> stop
 *   result [1, 2]
 *
 * (A min-heap of size k gives O(n log k); see 19_Heaps_And_Priority_Queues. Bucket sort is
 * the one that beats O(n log n) outright.)
 *
 * EDGE CASES
 * - k equals the number of distinct values -> return all of them
 * - Single element
 * - All elements the same
 * - Negative numbers (keys in a Map, no problem)
 */

function countFrequency(nums) {
  const counts = new Map();
  for (const num of nums) counts.set(num, (counts.get(num) ?? 0) + 1);
  return counts;
}

function bruteForce(nums, k) {
  const counts = countFrequency(nums);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1]) // highest count first
    .slice(0, k)
    .map(([value]) => value);
}

function optimal(nums, k) {
  const counts = countFrequency(nums);

  // buckets[c] = all values that appear c times. Max possible count is nums.length.
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, count] of counts) buckets[count].push(value);

  const result = [];
  for (let count = buckets.length - 1; count >= 0 && result.length < k; count--) {
    for (const value of buckets[count]) {
      result.push(value);
      if (result.length === k) break;
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (arr) => [...arr].sort((a, b) => a - b);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sorted(solve([1, 1, 1, 2, 2, 3], 2)), [1, 2]);
  assert.deepStrictEqual(solve([1], 1), [1]);
  assert.deepStrictEqual(sorted(solve([4, 4, 4, 5, 5, 6], 3)), [4, 5, 6]);
  assert.deepStrictEqual(solve([7, 7, 7, 7], 1), [7]);
  assert.deepStrictEqual(sorted(solve([-1, -1, 2, 3, 3, 3], 2)), [-1, 3]);
  assert.deepStrictEqual(solve([5, 1, 5, 1, 5], 1), [5]);
}
console.log('✓ 09-top-k-frequent-elements passed');

module.exports = { optimal, bruteForce };
