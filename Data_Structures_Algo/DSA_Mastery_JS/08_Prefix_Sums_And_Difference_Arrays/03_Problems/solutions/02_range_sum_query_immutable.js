/**
 * 02. Range Sum Query - Immutable   (LeetCode 303 — Easy)
 *
 * PROBLEM
 * Given an integer array nums, implement a class NumArray with
 * sumRange(left, right) returning the sum of nums[left..right] inclusive.
 * The array never changes; sumRange is called many times.
 *
 * EXAMPLES
 * nums = [-2, 0, 3, -5, 2, -1]
 * sumRange(0, 2) -> 1     sumRange(2, 5) -> -1     sumRange(0, 5) -> -3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Immutable? (yes; if updates were allowed we'd need a Fenwick/segment tree)
 * - How many queries? (up to 10^4 -> O(n) per query would be 10^9 total in the worst case)
 * - Inclusive bounds? (yes)
 *
 * APPROACH 1 — Brute force   O(n) per query, O(1) extra space
 * Loop from left to right and add. Fine for one query, slow for thousands.
 *
 * APPROACH 2 — Optimal (prefix sums)   O(n) build, O(1) per query, O(n) space
 * prefix[i] = sum of nums[0..i-1], with prefix[0] = 0.
 * sumRange(l, r) = prefix[r + 1] - prefix[l]: total up to r, minus everything before l.
 *
 * Dry run on [-2, 0, 3, -5, 2, -1]:
 *   prefix = [0, -2, -2, 1, -4, -2, -3]
 *   sumRange(2, 5) = prefix[6] - prefix[2] = -3 - (-2) = -1   (3 - 5 + 2 - 1 = -1)
 *   sumRange(0, 2) = prefix[3] - prefix[0] = 1
 *
 * EDGE CASES
 * - left === right -> single element
 * - left = 0 (the leading 0 handles it)
 * - whole array
 * - all negative
 */

class BruteForceNumArray {
  #nums;
  constructor(nums) { this.#nums = nums; }
  sumRange(left, right) {
    let sum = 0;
    for (let i = left; i <= right; i++) sum += this.#nums[i];
    return sum;
  }
}

class NumArray {
  #prefix;

  constructor(nums) {
    this.#prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) this.#prefix[i + 1] = this.#prefix[i] + nums[i];
  }

  sumRange(left, right) {
    return this.#prefix[right + 1] - this.#prefix[left];
  }
}

const bruteForce = BruteForceNumArray;
const optimal = NumArray;

// ---------- tests ----------
const assert = require('assert');
for (const Impl of [bruteForce, optimal]) {
  const arr = new Impl([-2, 0, 3, -5, 2, -1]);
  assert.strictEqual(arr.sumRange(0, 2), 1);
  assert.strictEqual(arr.sumRange(2, 5), -1);
  assert.strictEqual(arr.sumRange(0, 5), -3);
  assert.strictEqual(arr.sumRange(3, 3), -5);
  assert.strictEqual(arr.sumRange(1, 1), 0);

  const single = new Impl([42]);
  assert.strictEqual(single.sumRange(0, 0), 42);
}
console.log('✓ 02-range-sum-query-immutable passed');

module.exports = { optimal, bruteForce, NumArray };
