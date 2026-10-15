/**
 * 16. First Missing Positive   (LeetCode 41 — Hard)
 *
 * PROBLEM
 * Given an unsorted integer array (may contain negatives, zeros, duplicates and huge
 * values), return the smallest positive integer that is NOT present.
 * Required: O(n) time and O(1) extra space.
 *
 * EXAMPLES
 * Input: [1, 2, 0]          Output: 3
 * Input: [3, 4, -1, 1]      Output: 2
 * Input: [7, 8, 9, 11, 12]  Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I modify the input? (yes, otherwise O(1) space is impossible)
 * - Range of values? (any 32-bit int; only 1..n matter)
 * - Empty array -> 1
 *
 * KEY INSIGHT: with n elements the answer is always in 1..n+1. If 1..n are all present
 * the answer is n+1; otherwise some value in 1..n is missing. So values <= 0 or > n are
 * noise and can be ignored.
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Put everything in a Set, then check 1, 2, 3, ... until one is missing.
 * (Sorting first would be O(n log n) time, O(1) space.)
 *
 * APPROACH 2 — Optimal (cyclic sort)   O(n) time, O(1) extra space
 * Try to put each value v at index v - 1 ("its home"). Walk with index i:
 *   - if nums[i] is in 1..n AND it is not already at home AND its home slot does not
 *     already hold the same value (duplicate) -> swap it home and look at the value that
 *     arrived at i (do not advance i)
 *   - otherwise advance i
 * Each swap puts one value in its final place, so there are at most n swaps -> O(n).
 * Then scan: the first index i with nums[i] !== i + 1 gives the answer i + 1. If all
 * match, answer n + 1.
 *
 * Dry run on [3, 4, -1, 1]:
 *   i=0: 3 -> home idx 2, swap -> [-1, 4, 3, 1]
 *   i=0: -1 out of range -> i=1
 *   i=1: 4 -> home idx 3, swap -> [-1, 1, 3, 4]
 *   i=1: 1 -> home idx 0, swap -> [1, -1, 3, 4]
 *   i=1: -1 -> i=2
 *   i=2: 3 at home -> i=3
 *   i=3: 4 at home -> done
 *   scan: idx 0 ok (1), idx 1 holds -1 !== 2 -> answer 2
 *
 * EDGE CASES
 * - [1] -> 2;  [2] -> 1;  [] -> 1
 * - Duplicates [1, 1] -> 2 (the duplicate check prevents an infinite swap loop)
 * - All values out of range -> 1
 * - Complete 1..n -> n + 1
 */

function bruteForce(nums) {
  const present = new Set(nums);
  let candidate = 1;
  while (present.has(candidate)) candidate++;
  return candidate;
}

function optimal(nums) {
  const n = nums.length;

  // phase 1: cyclic sort - send every in-range value to index value - 1
  let i = 0;
  while (i < n) {
    const value = nums[i];
    const home = value - 1;
    const inRange = value >= 1 && value <= n;
    if (inRange && nums[home] !== value) {
      // nums[home] !== value also guards against duplicates: if home already holds
      // this value, swapping would loop forever
      [nums[i], nums[home]] = [nums[home], nums[i]];
      // do not advance: the value that just arrived at i still needs to be placed
    } else {
      i++;
    }
  }

  // phase 2: first slot whose occupant is not its owner
  for (let index = 0; index < n; index++) {
    if (nums[index] !== index + 1) return index + 1;
  }
  return n + 1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 0]), 3);
  assert.strictEqual(solve([3, 4, -1, 1]), 2);
  assert.strictEqual(solve([7, 8, 9, 11, 12]), 1);
  assert.strictEqual(solve([1]), 2);
  assert.strictEqual(solve([2]), 1);
  assert.strictEqual(solve([]), 1);
  assert.strictEqual(solve([1, 1]), 2);
  assert.strictEqual(solve([1, 2, 3, 4]), 5);
}
console.log('✓ 16-first-missing-positive passed');

module.exports = { optimal, bruteForce };
