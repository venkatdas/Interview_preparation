/**
 * 06. Remove Duplicates from Sorted Array II   (LeetCode 80 — Medium)
 *
 * PROBLEM
 * Given a sorted array, remove duplicates in place so that each value appears AT MOST
 * TWICE. Keep the relative order. Return the new length k.
 *
 * EXAMPLES
 * Input: [1, 1, 1, 2, 2, 3]            Output: 5, nums = [1, 1, 2, 2, 3, _]
 * Input: [0, 0, 1, 1, 1, 1, 2, 3, 3]   Output: 7, nums = [0, 0, 1, 1, 2, 3, 3, _, _]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Sorted? (yes -> all copies of a value are adjacent, which is what makes this O(n))
 * - At most 2, or at most k in general? (solve for general k, it's the same code)
 * - In place, O(1) extra space? (yes)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Walk the array keeping a count of the current value; push to a new array while the
 * count <= 2. Then copy back.
 *
 * APPROACH 2 — Optimal (read / write, look back k)   O(n) time, O(1) space
 * The first k elements are always kept. After that, nums[read] is allowed into the
 * output only if it differs from nums[write - k]: if it's equal, then the output already
 * ends with k copies of that value (the array is sorted, so everything between write - k
 * and write - 1 is that same value too).
 *
 * Dry run on [1, 1, 1, 2, 2, 3], k = 2:
 *   write=2 (first two kept)           [1, 1, 1, 2, 2, 3]
 *   read=2 1  nums[write-2]=1 == 1 skip
 *   read=3 2  nums[0]=1 != 2  nums[2]=2 write=3   [1, 1, 2, 2, 2, 3]
 *   read=4 2  nums[1]=1 != 2  nums[3]=2 write=4   [1, 1, 2, 2, 2, 3]
 *   read=5 3  nums[2]=2 != 3  nums[4]=3 write=5   [1, 1, 2, 2, 3, 3]
 *   return 5
 *
 * EDGE CASES
 * - length <= k -> nothing to remove
 * - all elements identical -> k
 * - no duplicates -> n unchanged
 * - negative values (sorted order still holds)
 */

function bruteForce(nums, maxCopies = 2) {
  const kept = [];
  let runCount = 0;
  for (let i = 0; i < nums.length; i++) {
    runCount = i > 0 && nums[i] === nums[i - 1] ? runCount + 1 : 1;
    if (runCount <= maxCopies) kept.push(nums[i]);
  }
  for (let i = 0; i < kept.length; i++) nums[i] = kept[i];
  return kept.length;
}

function optimal(nums, maxCopies = 2) {
  if (nums.length <= maxCopies) return nums.length;

  let write = maxCopies; // the first maxCopies elements are always allowed
  for (let read = maxCopies; read < nums.length; read++) {
    // compare against the element maxCopies slots back in the OUTPUT region
    if (nums[read] !== nums[write - maxCopies]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  let nums = [1, 1, 1, 2, 2, 3];
  let k = solve(nums);
  assert.strictEqual(k, 5);
  assert.deepStrictEqual(nums.slice(0, k), [1, 1, 2, 2, 3]);

  nums = [0, 0, 1, 1, 1, 1, 2, 3, 3];
  k = solve(nums);
  assert.strictEqual(k, 7);
  assert.deepStrictEqual(nums.slice(0, k), [0, 0, 1, 1, 2, 3, 3]);

  nums = [1, 1, 1, 1];
  k = solve(nums);
  assert.deepStrictEqual(nums.slice(0, k), [1, 1]);

  nums = [1, 2, 3];
  assert.strictEqual(solve(nums), 3);

  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([5]), 1);

  nums = [-3, -3, -3, -1];
  k = solve(nums, 1); // "at most once" variant (LeetCode 26)
  assert.deepStrictEqual(nums.slice(0, k), [-3, -1]);
}
console.log('✓ 06-remove-duplicates-sorted-array-ii passed');

module.exports = { optimal, bruteForce };
