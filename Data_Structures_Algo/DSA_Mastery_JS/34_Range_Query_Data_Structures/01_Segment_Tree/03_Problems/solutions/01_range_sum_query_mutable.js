/**
 * 01. Range Sum Query - Mutable   (LeetCode 307 — Medium)
 *
 * PROBLEM
 * Design a class NumArray that holds an integer array and supports:
 *   - update(index, val): set nums[index] = val
 *   - sumRange(left, right): return the sum of nums[left..right] (inclusive)
 * Both operations are called many times, mixed together.
 *
 * EXAMPLES
 * nums = [1, 3, 5]
 *   sumRange(0, 2) -> 9
 *   update(1, 2)       nums becomes [1, 2, 5]
 *   sumRange(0, 2) -> 8
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - How many operations? (up to 3 * 10^4 of each -> O(n) per op is too slow in total)
 * - Are values negative? (yes, sums can be negative)
 * - Is the array ever empty? (assume n >= 1)
 *
 * APPROACH 1 — Brute force   O(1) update, O(n) sumRange, O(n) space
 * Keep the plain array. update is a direct write; sumRange loops from left to right.
 * A prefix-sum array (../../08_Prefix_Sums_And_Difference_Arrays/) flips this: O(1) query but O(n) update,
 * because every prefix after `index` changes. Neither is good when both ops are frequent.
 *
 * APPROACH 2 — Optimal (Segment tree)   O(log n) update, O(log n) sumRange, O(n) space
 * Build a tree where every node stores the sum of a range; the root covers the whole
 * array, leaves cover one element each. A point update rewrites one leaf and the
 * log n ancestors above it. A range query visits at most ~4 log n nodes: nodes fully
 * inside [left, right] return their stored sum immediately.
 *
 * Dry run, nums = [1, 3, 5], iterative tree of size 2n = 6 (leaves at index 3..5):
 *   tree = [_, 9, 4, 1, 3, 5]      tree[1] = root = tree[2] + tree[3], tree[2] = 3 + 5 ? no:
 *   building bottom-up: tree[2] = tree[4] + tree[5] = 3 + 5 = 8, tree[1] = tree[2] + tree[3] = 8 + 1 = 9
 *   -> tree = [_, 9, 8, 1, 3, 5]
 *   sumRange(0, 2): lo = 3, hi = 6
 *     lo odd  -> take tree[3] = 1, lo = 4;  hi even -> skip;  lo = 2, hi = 3
 *     lo even -> skip; hi odd -> take tree[2] = 8;  lo = 1, hi = 1 -> stop. answer 9
 *   update(1, 2): tree[4] = 2, then tree[2] = 2 + 5 = 7, tree[1] = 7 + 1 = 8
 *   sumRange(0, 2) -> 8
 *
 * EDGE CASES
 * - left === right (single element)
 * - update to the same value (harmless)
 * - n not a power of two (the iterative tree handles it without padding)
 * - negative numbers
 */

// Naive version: plain array, O(n) per sumRange
class NumArrayBrute {
  constructor(nums) {
    this.nums = nums.slice();
  }
  update(index, val) {
    this.nums[index] = val;
  }
  sumRange(left, right) {
    let sum = 0;
    for (let i = left; i <= right; i++) sum += this.nums[i];
    return sum;
  }
}

// Optimal version: iterative (bottom-up) segment tree
class NumArray {
  constructor(nums) {
    this.n = nums.length;
    this.tree = new Array(2 * this.n).fill(0);
    for (let i = 0; i < this.n; i++) this.tree[this.n + i] = nums[i]; // leaves
    for (let i = this.n - 1; i >= 1; i--) {                             // parents
      this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
    }
  }

  update(index, val) {
    let i = index + this.n;
    this.tree[i] = val;
    while (i > 1) {
      i >>= 1;
      this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
    }
  }

  sumRange(left, right) {
    let sum = 0;
    let lo = left + this.n;
    let hi = right + this.n + 1;     // half-open [lo, hi)
    while (lo < hi) {
      if (lo & 1) sum += this.tree[lo++];   // lo is a right child: its parent covers too much
      if (hi & 1) sum += this.tree[--hi];   // hi - 1 is a left child
      lo >>= 1;
      hi >>= 1;
    }
    return sum;
  }
}

// ---------- tests ----------
const assert = require('assert');

for (const Cls of [NumArrayBrute, NumArray]) {
  const na = new Cls([1, 3, 5]);
  assert.strictEqual(na.sumRange(0, 2), 9);
  na.update(1, 2);
  assert.strictEqual(na.sumRange(0, 2), 8);
  assert.strictEqual(na.sumRange(1, 1), 2);        // single element
  const neg = new Cls([-2, 0, 3, -5, 2, -1]);       // negatives, n not a power of two
  assert.strictEqual(neg.sumRange(0, 2), 1);
  assert.strictEqual(neg.sumRange(2, 5), -1);
  neg.update(0, 5);
  assert.strictEqual(neg.sumRange(0, 5), 4);
}

// random comparison brute vs optimal
for (let trial = 0; trial < 20; trial++) {
  const n = 1 + Math.floor(Math.random() * 30);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 41) - 20);
  const a = new NumArrayBrute(nums);
  const b = new NumArray(nums);
  for (let op = 0; op < 100; op++) {
    const i = Math.floor(Math.random() * n);
    if (Math.random() < 0.5) {
      const v = Math.floor(Math.random() * 41) - 20;
      a.update(i, v);
      b.update(i, v);
    } else {
      const j = i + Math.floor(Math.random() * (n - i));
      assert.strictEqual(b.sumRange(i, j), a.sumRange(i, j));
    }
  }
}
console.log('✓ 01-range-sum-query-mutable passed');

module.exports = { NumArray, NumArrayBrute, optimal: NumArray, bruteForce: NumArrayBrute };
