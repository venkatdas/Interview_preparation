/**
 * 05. Move Zeroes   (LeetCode 283 — Easy)
 *
 * PROBLEM
 * Given an integer array, move all 0s to the end while keeping the relative order of
 * the non-zero elements. Do it in place (no copy of the array).
 *
 * EXAMPLES
 * Input: [0, 1, 0, 3, 12]   Output: [1, 3, 12, 0, 0]
 * Input: [0]                Output: [0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - In place, O(1) extra space? (yes)
 * - Must the order of non-zero elements stay the same? (yes - that rules out a simple swap-with-end)
 * - Should I return the array or nothing? (LeetCode: nothing; we return it for easy testing)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Copy all non-zero elements into a new array, then append zeros until the length
 * matches, then copy back. Correct but uses extra memory.
 *
 * APPROACH 2 — Optimal (write pointer / in-place swap)   O(n) time, O(1) space
 * Keep `writeIndex` = the next slot that should hold a non-zero value. Scan with
 * `readIndex`. Whenever you see a non-zero, swap it into `writeIndex` and advance
 * `writeIndex`. Everything before writeIndex is finished; zeros naturally drift right.
 *
 * Dry run on [0, 1, 0, 3, 12]:
 *   read 0: value 0   skip                       write=0
 *   read 1: value 1   swap(0,1) -> [1,0,0,3,12]  write=1
 *   read 2: value 0   skip
 *   read 3: value 3   swap(1,3) -> [1,3,0,0,12]  write=2
 *   read 4: value 12  swap(2,4) -> [1,3,12,0,0]  write=3   done
 *
 * EDGE CASES
 * - No zeros -> every element swaps with itself, array unchanged
 * - All zeros
 * - Zeros already at the end
 * - Empty array
 */

function bruteForce(nums) {
  const nonZeros = nums.filter((num) => num !== 0);
  const zeroCount = nums.length - nonZeros.length;
  const result = nonZeros.concat(new Array(zeroCount).fill(0));
  for (let i = 0; i < nums.length; i++) nums[i] = result[i]; // copy back to honour "in place"
  return nums;
}

function optimal(nums) {
  let writeIndex = 0; // next position for a non-zero element

  for (let readIndex = 0; readIndex < nums.length; readIndex++) {
    if (nums[readIndex] !== 0) {
      // swap keeps the zero (if any) at readIndex, so we never lose values
      [nums[writeIndex], nums[readIndex]] = [nums[readIndex], nums[writeIndex]];
      writeIndex++;
    }
  }
  return nums;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([0, 1, 0, 3, 12]), [1, 3, 12, 0, 0]);
  assert.deepStrictEqual(solve([0]), [0]);
  assert.deepStrictEqual(solve([1, 2, 3]), [1, 2, 3]);
  assert.deepStrictEqual(solve([0, 0, 0]), [0, 0, 0]);
  assert.deepStrictEqual(solve([1, 0, 0]), [1, 0, 0]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([0, 0, 1]), [1, 0, 0]);
}
console.log('✓ 05-move-zeroes passed');

module.exports = { optimal, bruteForce };
