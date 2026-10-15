/**
 * 04. Remove Element   (LeetCode 27 — Easy)
 *
 * PROBLEM
 * Given an array nums and a value val, remove all occurrences of val IN PLACE and return
 * the number k of remaining elements. The first k slots of nums must hold the kept
 * elements (order may change on LeetCode, but we preserve it anyway).
 *
 * EXAMPLES
 * Input: nums = [3, 2, 2, 3], val = 3            Output: 2, nums = [2, 2, _, _]
 * Input: nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2 Output: 5, nums = [0, 1, 3, 0, 4, _, _, _]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I use extra space? (no, that's the point)
 * - Does the order of kept elements matter? (not on LeetCode; read/write keeps it anyway)
 * - What goes in the slots after k? (anything)
 *
 * APPROACH 1 — Brute force (splice)   O(n^2) time, O(1) space
 * Walk the array; whenever nums[i] === val, splice it out. Each splice shifts the tail: O(n).
 *
 * APPROACH 2 — Optimal (read / write pointers)   O(n) time, O(1) space
 * `read` scans every element. `write` points at the next free slot of the output.
 * If nums[read] !== val, copy it to nums[write] and advance write.
 * Invariant: nums[0..write-1] holds every kept element seen so far, in order.
 * write <= read always, so we never overwrite an element we haven't read yet.
 *
 * Dry run on [3, 2, 2, 3], val = 3:
 *   read=0 3 skip                 write=0
 *   read=1 2 nums[0]=2            write=1   [2, 2, 2, 3]
 *   read=2 2 nums[1]=2            write=2   [2, 2, 2, 3]
 *   read=3 3 skip                 write=2
 *   return 2
 *
 * EDGE CASES
 * - val not present -> return n, array unchanged
 * - every element is val -> return 0
 * - empty array -> 0
 */

function bruteForce(nums, val) {
  let i = 0;
  while (i < nums.length) {
    if (nums[i] === val) nums.splice(i, 1); // O(n) shift each time
    else i++;
  }
  return nums.length;
}

function optimal(nums, val) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== val) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  let nums = [3, 2, 2, 3];
  let k = solve(nums, 3);
  assert.strictEqual(k, 2);
  assert.deepStrictEqual(nums.slice(0, k), [2, 2]);

  nums = [0, 1, 2, 2, 3, 0, 4, 2];
  k = solve(nums, 2);
  assert.strictEqual(k, 5);
  assert.deepStrictEqual(nums.slice(0, k), [0, 1, 3, 0, 4]);

  nums = [1, 1, 1];
  assert.strictEqual(solve(nums, 1), 0);

  nums = [1, 2, 3];
  k = solve(nums, 9);
  assert.strictEqual(k, 3);
  assert.deepStrictEqual(nums.slice(0, k), [1, 2, 3]);

  assert.strictEqual(solve([], 1), 0);
}
console.log('✓ 04-remove-element passed');

module.exports = { optimal, bruteForce };
