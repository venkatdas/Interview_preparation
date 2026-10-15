/**
 * 06. Remove Duplicates from Sorted Array   (LeetCode 26 — Easy)
 *
 * PROBLEM
 * Given a SORTED integer array, remove the duplicates in place so that each value
 * appears once. Return k, the number of unique elements. The first k slots of the
 * array must hold the unique values in order; what comes after does not matter.
 *
 * EXAMPLES
 * Input: [1, 1, 2]                   Output: 2, nums = [1, 2, _]
 * Input: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]   Output: 5, nums = [0, 1, 2, 3, 4, _, _, _, _, _]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the array guaranteed sorted? (yes - duplicates are always adjacent, that is the key)
 * - O(1) extra space? (yes)
 * - What should be after index k? (anything)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Build a Set (or a new array skipping equal neighbours), copy it back, return its size.
 * Works but ignores the "in place" requirement.
 *
 * APPROACH 2 — Optimal (write pointer)   O(n) time, O(1) space
 * `writeIndex` points to the last unique value kept. Scan with `readIndex` from 1.
 * If nums[readIndex] differs from nums[writeIndex], it is a new unique value:
 * advance writeIndex and copy it there. Because the array is sorted, "differs from
 * the last kept" is the same as "never seen before".
 *
 * Dry run on [0, 0, 1, 1, 2]:
 *   write=0
 *   read 1: 0 === nums[0]=0   skip
 *   read 2: 1 !== 0 -> write=1, nums[1]=1  -> [0,1,1,1,2]
 *   read 3: 1 === nums[1]=1   skip
 *   read 4: 2 !== 1 -> write=2, nums[2]=2  -> [0,1,2,1,2]
 *   return write + 1 = 3
 *
 * EDGE CASES
 * - Empty array -> 0
 * - Single element -> 1
 * - All identical -> 1
 * - No duplicates -> n
 * - Negative numbers (sorted order still holds)
 */

function bruteForce(nums) {
  const unique = [...new Set(nums)]; // Set keeps insertion order, and input is sorted
  for (let i = 0; i < unique.length; i++) nums[i] = unique[i];
  return unique.length;
}

function optimal(nums) {
  if (nums.length === 0) return 0;
  let writeIndex = 0; // index of the last unique value kept

  for (let readIndex = 1; readIndex < nums.length; readIndex++) {
    if (nums[readIndex] !== nums[writeIndex]) {
      writeIndex++;
      nums[writeIndex] = nums[readIndex]; // overwrite the duplicate slot with the new value
    }
  }
  return writeIndex + 1;
}

// ---------- tests ----------
const assert = require('assert');
function check(solve, input, expectedK, expectedPrefix) {
  const nums = [...input];            // copy: both solutions mutate
  const k = solve(nums);
  assert.strictEqual(k, expectedK);
  assert.deepStrictEqual(nums.slice(0, k), expectedPrefix);
}
for (const solve of [bruteForce, optimal]) {
  check(solve, [1, 1, 2], 2, [1, 2]);
  check(solve, [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], 5, [0, 1, 2, 3, 4]);
  check(solve, [], 0, []);
  check(solve, [7], 1, [7]);
  check(solve, [3, 3, 3, 3], 1, [3]);
  check(solve, [1, 2, 3], 3, [1, 2, 3]);
  check(solve, [-2, -2, -1, 0, 0], 3, [-2, -1, 0]);
}
console.log('✓ 06-remove-duplicates-from-sorted-array passed');

module.exports = { optimal, bruteForce };
