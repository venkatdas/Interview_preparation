/**
 * 07. Rotate Array   (LeetCode 189 — Medium)
 *
 * PROBLEM
 * Rotate an integer array to the RIGHT by k steps, in place. k is non-negative.
 *
 * EXAMPLES
 * Input: [1, 2, 3, 4, 5, 6, 7], k = 3   Output: [5, 6, 7, 1, 2, 3, 4]
 * Input: [-1, -100, 3, 99], k = 2       Output: [3, 99, -1, -100]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can k be larger than the array length? (yes -> use k % n)
 * - Right or left rotation? (right; left by k is right by n - k)
 * - In place with O(1) extra space? (that is the follow-up; a copy-based O(n) space answer is a fine first step)
 *
 * APPROACH 1 — Brute force   O(n * k) time, O(1) space
 * Rotate by one step k times: save the last element, shift everything right by one,
 * put the saved element at index 0. Each step is O(n).
 * (Alternative: build a new array with result[(i + k) % n] = nums[i], O(n) time, O(n) space.)
 *
 * APPROACH 2 — Optimal (three reversals)   O(n) time, O(1) space
 * Rotating right by k means the last k elements move to the front.
 *   1. reverse the whole array      -> last k are now first, but backwards
 *   2. reverse the first k elements -> fix their order
 *   3. reverse the remaining n - k  -> fix their order
 *
 * Dry run on [1, 2, 3, 4, 5, 6, 7], k = 3:
 *   reverse all      -> [7, 6, 5, 4, 3, 2, 1]
 *   reverse [0..2]   -> [5, 6, 7, 4, 3, 2, 1]
 *   reverse [3..6]   -> [5, 6, 7, 1, 2, 3, 4]
 *
 * EDGE CASES
 * - k === 0 or k === n -> unchanged
 * - k > n -> k % n
 * - Single element / empty array
 * - Two elements with k = 1 -> swapped
 */

function bruteForce(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k %= n;
  for (let step = 0; step < k; step++) {
    const last = nums[n - 1];
    for (let i = n - 1; i > 0; i--) nums[i] = nums[i - 1]; // shift right by one
    nums[0] = last;
  }
  return nums;
}

function reverseRange(arr, left, right) {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

function optimal(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  k %= n;                               // rotating by n is a no-op
  reverseRange(nums, 0, n - 1);         // whole array
  reverseRange(nums, 0, k - 1);         // first k (the elements that wrapped around)
  reverseRange(nums, k, n - 1);         // the rest
  return nums;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5, 6, 7], 3), [5, 6, 7, 1, 2, 3, 4]);
  assert.deepStrictEqual(solve([-1, -100, 3, 99], 2), [3, 99, -1, -100]);
  assert.deepStrictEqual(solve([1, 2, 3], 0), [1, 2, 3]);
  assert.deepStrictEqual(solve([1, 2, 3], 3), [1, 2, 3]);
  assert.deepStrictEqual(solve([1, 2, 3], 4), [3, 1, 2]);   // k > n
  assert.deepStrictEqual(solve([1], 5), [1]);
  assert.deepStrictEqual(solve([], 2), []);
  assert.deepStrictEqual(solve([1, 2], 1), [2, 1]);
}
console.log('✓ 07-rotate-array passed');

module.exports = { optimal, bruteForce };
