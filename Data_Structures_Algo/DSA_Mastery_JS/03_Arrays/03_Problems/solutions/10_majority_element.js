/**
 * 10. Majority Element   (LeetCode 169 — Easy)
 *
 * PROBLEM
 * Given an array of size n, return the majority element: the value that appears
 * MORE than n / 2 times. You may assume it always exists.
 *
 * EXAMPLES
 * Input: [3, 2, 3]               Output: 3
 * Input: [2, 2, 1, 1, 1, 2, 2]   Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is a majority guaranteed to exist? (yes; otherwise do a second pass to verify the count)
 * - "More than n/2" strictly? (yes; with n = 4 you need at least 3 copies)
 * - O(1) space follow-up? (yes, that is the Boyer-Moore part)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each element count how many times it appears; return the first with count > n/2.
 * (Middle ground: count with a Map in O(n) time, O(n) space; or sort and return nums[n/2].)
 *
 * APPROACH 2 — Optimal (Boyer-Moore voting)   O(n) time, O(1) space
 * Keep a `candidate` and a `count`. Walk the array:
 *   - count === 0 -> adopt the current value as candidate
 *   - value === candidate -> count++, else count--
 * Intuition: every non-majority element can "cancel" one majority element, but the
 * majority has more than half the votes, so it can never be fully cancelled out.
 * Whatever candidate survives at the end is the majority.
 *
 * Dry run on [2, 2, 1, 1, 1, 2, 2]:
 *   2: count 0 -> cand=2, count=1
 *   2: same    -> count=2
 *   1: diff    -> count=1
 *   1: diff    -> count=0
 *   1: count 0 -> cand=1, count=1
 *   2: diff    -> count=0
 *   2: count 0 -> cand=2, count=1   -> return 2
 *
 * EDGE CASES
 * - Single element -> itself
 * - Majority appears at the very end
 * - All identical values
 * - Negative numbers
 */

function bruteForce(nums) {
  const half = nums.length / 2;
  for (const candidate of nums) {
    let count = 0;
    for (const num of nums) {
      if (num === candidate) count++;
    }
    if (count > half) return candidate;
  }
  return undefined;
}

function optimal(nums) {
  let candidate = undefined;
  let count = 0;

  for (const num of nums) {
    if (count === 0) candidate = num;         // previous candidate was cancelled out, pick a new one
    count += num === candidate ? 1 : -1;      // vote for / against the candidate
  }
  return candidate;
  // If existence were NOT guaranteed: count occurrences of candidate in a 2nd pass and check > n/2.
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 2, 3]), 3);
  assert.strictEqual(solve([2, 2, 1, 1, 1, 2, 2]), 2);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([5, 5, 5, 5]), 5);
  assert.strictEqual(solve([1, 2, 3, 3, 3]), 3);
  assert.strictEqual(solve([-1, -1, 2]), -1);
  assert.strictEqual(solve([6, 5, 5]), 5);
}
console.log('✓ 10-majority-element passed');

module.exports = { optimal, bruteForce };
