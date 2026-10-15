/**
 * 03. Contains Duplicate   (LeetCode 217 — Easy)
 *
 * PROBLEM
 * Given an integer array, return true if any value appears at least twice,
 * and false if every element is distinct.
 *
 * EXAMPLES
 * Input: [1, 2, 3, 1]              Output: true
 * Input: [1, 2, 3, 4]              Output: false
 * Input: [1, 1, 1, 3, 3, 4, 3, 2]  Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the array be empty? (yes -> false)
 * - Are the values integers only? (yes; with floats/NaN a Set still works except NaN === NaN is handled by Set)
 * - Can I sort the input (modify it)? (ask; sorting gives O(n log n) time, O(1) extra space)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Compare every pair. Return true the moment two equal values are found.
 *
 * APPROACH 2 — Optimal (Set)   O(n) time, O(n) space
 * Walk the array once. Keep a Set of values seen so far. If the current value is
 * already in the Set, we found a duplicate. Set.has and Set.add are O(1) average.
 * (Alternative: sort, then check neighbours - O(n log n) time, O(1) extra space.)
 *
 * Dry run on [1, 2, 3, 1]:
 *   1 -> not seen, add    {1}
 *   2 -> not seen, add    {1, 2}
 *   3 -> not seen, add    {1, 2, 3}
 *   1 -> seen!            return true
 *
 * EDGE CASES
 * - Empty array -> false
 * - Single element -> false
 * - Duplicate at the two ends
 * - Negative numbers
 */

function bruteForce(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}

function optimal(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true; // early exit, no need to scan the rest
    seen.add(num);
  }
  return false;
  // One-liner version: return new Set(nums).size !== nums.length;  (no early exit)
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 1]), true);
  assert.strictEqual(solve([1, 2, 3, 4]), false);
  assert.strictEqual(solve([1, 1, 1, 3, 3, 4, 3, 2]), true);
  assert.strictEqual(solve([]), false);
  assert.strictEqual(solve([7]), false);
  assert.strictEqual(solve([-1, 0, -1]), true);
  assert.strictEqual(solve([5, 4, 3, 2, 1, 5]), true);
}
console.log('✓ 03-contains-duplicate passed');

module.exports = { optimal, bruteForce };
