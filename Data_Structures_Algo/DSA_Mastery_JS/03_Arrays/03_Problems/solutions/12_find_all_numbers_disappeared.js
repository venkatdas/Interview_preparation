/**
 * 12. Find All Numbers Disappeared in an Array   (LeetCode 448 — Easy)
 *
 * PROBLEM
 * Given an array of n integers where every value is in the range [1, n], return all
 * numbers in [1, n] that do NOT appear in the array. Follow-up: O(n) time and no extra
 * space (the returned list does not count).
 *
 * EXAMPLES
 * Input: [4, 3, 2, 7, 8, 2, 3, 1]   Output: [5, 6]
 * Input: [1, 1]                     Output: [2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are all values guaranteed in 1..n? (yes - that is what makes the index trick possible)
 * - Can I modify the input? (yes for the O(1) space version; restore it afterwards if asked)
 * - Output order? (ascending is natural with the index trick)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Put the values in a Set, then loop 1..n and collect everything not in the Set.
 * (The true brute force, `includes` for each candidate, is O(n^2).)
 *
 * APPROACH 2 — Optimal (index as hash, negate to mark)   O(n) time, O(1) extra space
 * Value v "belongs" to index v - 1. Pass 1: for each value, negate the number sitting
 * at index |v| - 1 to mark "v was seen" (use abs because it may already be negated).
 * Pass 2: any index still holding a POSITIVE number was never marked, so index + 1 is
 * missing. We use the sign bit as a free boolean flag.
 *
 * Dry run on [4, 3, 2, 7, 8, 2, 3, 1]:
 *   v=4 -> negate idx 3: [4, 3, 2,-7, 8, 2, 3, 1]
 *   v=3 -> negate idx 2: [4, 3,-2,-7, 8, 2, 3, 1]
 *   v=2 -> negate idx 1: [4,-3,-2,-7, 8, 2, 3, 1]
 *   v=7 -> negate idx 6: [4,-3,-2,-7, 8, 2,-3, 1]
 *   v=8 -> negate idx 7: [4,-3,-2,-7, 8, 2,-3,-1]
 *   v=2 -> idx 1 already negative, leave it
 *   v=3 -> idx 2 already negative, leave it
 *   v=1 -> negate idx 0: [-4,-3,-2,-7, 8, 2,-3,-1]
 *   positives at idx 4, 5 -> missing [5, 6]
 *
 * EDGE CASES
 * - Nothing missing: [1, 2, 3] -> []
 * - Everything the same: [1, 1, 1] -> [2, 3]
 * - Single element [1] -> []
 * - Empty array -> []
 */

function bruteForce(nums) {
  const present = new Set(nums);
  const missing = [];
  for (let value = 1; value <= nums.length; value++) {
    if (!present.has(value)) missing.push(value);
  }
  return missing;
}

function optimal(nums) {
  // pass 1: mark seen values by negating the slot they "own"
  for (const num of nums) {
    const index = Math.abs(num) - 1;           // abs: this value may already be flipped negative
    if (nums[index] > 0) nums[index] = -nums[index];
  }

  // pass 2: slots that stayed positive were never claimed
  const missing = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) missing.push(i + 1);
    else nums[i] = -nums[i];                   // optional: restore the input
  }
  return missing;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([4, 3, 2, 7, 8, 2, 3, 1]), [5, 6]);
  assert.deepStrictEqual(solve([1, 1]), [2]);
  assert.deepStrictEqual(solve([1, 2, 3]), []);
  assert.deepStrictEqual(solve([1, 1, 1]), [2, 3]);
  assert.deepStrictEqual(solve([1]), []);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([2, 2]), [1]);
}
const input = [3, 3, 1];
optimal(input);
assert.deepStrictEqual(input, [3, 3, 1]); // input restored
console.log('✓ 12-find-all-numbers-disappeared passed');

module.exports = { optimal, bruteForce };
