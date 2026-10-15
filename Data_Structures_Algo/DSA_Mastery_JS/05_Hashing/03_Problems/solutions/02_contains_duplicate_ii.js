/**
 * 02. Contains Duplicate II   (LeetCode 219 — Easy)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return true if there are two
 * distinct indices i and j such that nums[i] === nums[j] and |i - j| <= k.
 *
 * EXAMPLES
 * Input: nums = [1, 2, 3, 1], k = 3       Output: true    Explanation: 1 at index 0 and 3, distance 3
 * Input: nums = [1, 0, 1, 1], k = 1       Output: true    Explanation: 1 at index 2 and 3
 * Input: nums = [1, 2, 3, 1, 2, 3], k = 2 Output: false   Explanation: repeats are 3 apart
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can k be 0? (then the answer is always false, two distinct indices can't be 0 apart)
 * - Can k be larger than the array? (yes -> same as plain "contains duplicate")
 * - Negative numbers? (fine)
 *
 * APPROACH 1 — Brute force   O(n * k) time, O(1) space
 * For each index i, look at the next k elements and compare.
 *
 * APPROACH 2 — Optimal (index map)   O(n) time, O(n) space
 * Store value -> the LAST index where we saw it. When we see a value again, the
 * closest earlier copy is the last one, so only that distance matters.
 *   for each i:
 *     if lastIndex has nums[i] and i - lastIndex.get(nums[i]) <= k -> true
 *     lastIndex.set(nums[i], i)   (always overwrite with the newest index)
 *
 * Dry run on [1, 2, 3, 1], k = 3:
 *   i=0 1 -> not seen, map {1:0}
 *   i=1 2 -> not seen, map {1:0, 2:1}
 *   i=2 3 -> not seen, map {1:0, 2:1, 3:2}
 *   i=3 1 -> seen at 0, 3 - 0 = 3 <= 3 -> true
 *
 * Alternative: a sliding Set of the last k values (remove nums[i - k] as you go).
 * That keeps space at O(k) instead of O(n).
 *
 * EDGE CASES
 * - k = 0 -> false
 * - empty / single element -> false
 * - duplicates farther than k apart -> false
 */

function bruteForce(nums, k) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j <= i + k && j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}

function optimal(nums, k) {
  const lastIndex = new Map(); // value -> most recent index

  for (let i = 0; i < nums.length; i++) {
    const value = nums[i];
    if (lastIndex.has(value) && i - lastIndex.get(value) <= k) return true;
    lastIndex.set(value, i); // newest index is the only one that can be closest
  }
  return false;
}

// Bonus: O(min(n, k)) space version using a window Set.
function windowSet(nums, k) {
  const window = new Set();
  for (let i = 0; i < nums.length; i++) {
    if (window.has(nums[i])) return true;
    window.add(nums[i]);
    if (window.size > k) window.delete(nums[i - k]); // keep only the last k values
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, windowSet]) {
  assert.strictEqual(solve([1, 2, 3, 1], 3), true);
  assert.strictEqual(solve([1, 0, 1, 1], 1), true);
  assert.strictEqual(solve([1, 2, 3, 1, 2, 3], 2), false);
  assert.strictEqual(solve([1, 1], 0), false);
  assert.strictEqual(solve([], 5), false);
  assert.strictEqual(solve([7], 5), false);
  assert.strictEqual(solve([-1, 5, -1], 2), true);
}
console.log('✓ 02-contains-duplicate-ii passed');

module.exports = { optimal, bruteForce, windowSet };
