/**
 * 01. Range Sum Query - Mutable, Fenwick version   (LeetCode 307 — Medium)
 *
 * PROBLEM
 * Design NumArray with update(index, val) that sets nums[index] = val and
 * sumRange(left, right) that returns the sum of nums[left..right] inclusive.
 * Both are called many times in any order.
 *
 * EXAMPLES
 * nums = [1, 3, 5]
 *   sumRange(0, 2) -> 9
 *   update(1, 2)       nums = [1, 2, 5]
 *   sumRange(0, 2) -> 8
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 3 * 10^4 calls of each kind -> O(n) per call is too slow overall
 * - Values can be negative (deltas can be negative, which a BIT handles fine)
 * - update sets a VALUE; a BIT adds a DELTA, so we must remember current values
 *
 * APPROACH 1 — Brute force   O(1) update, O(n) sumRange
 * Keep the plain array and loop for every sumRange.
 *
 * APPROACH 2 — Optimal (Fenwick tree)   O(log n) update, O(log n) sumRange, O(n) space
 * A Fenwick tree stores partial sums so that prefixSum(i) = sum(nums[0..i]) is the sum of
 * O(log n) stored blocks, and a point update touches O(log n) blocks.
 *   sumRange(l, r) = prefixSum(r) - prefixSum(l - 1)
 *   update(i, val): delta = val - nums[i]; nums[i] = val; bit.add(i, delta)
 *
 * Dry run, nums = [1, 3, 5], 1-indexed tree slots:
 *   tree[1] = nums[1..1] = 1, tree[2] = nums[1..2] = 4, tree[3] = nums[3..3] = 5
 *   sumRange(0, 2) = prefixSum(2) (0-indexed) -> i = 3: +tree[3] = 5, i = 3 - 1 = 2: +tree[2] = 4,
 *                    i = 2 - 2 = 0 stop -> 9
 *   update(1, 2): delta = 2 - 3 = -1; i = 2: tree[2] = 3; i = 2 + 2 = 4 > n stop
 *   sumRange(0, 2) = tree[3] + tree[2] = 5 + 3 = 8
 *
 * EDGE CASES
 * - left === right
 * - updating to the same value (delta 0)
 * - n = 1
 * - negative values
 */

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

class NumArray {
  constructor(nums) {
    this.n = nums.length;
    this.nums = nums.slice();                    // current values, needed to compute deltas
    this.tree = new Array(this.n + 1).fill(0);   // 1-indexed
    for (let i = 0; i < this.n; i++) this.#add(i, nums[i]);
  }

  #add(index, delta) {
    for (let i = index + 1; i <= this.n; i += i & -i) this.tree[i] += delta;
  }

  #prefixSum(index) {                            // sum of nums[0..index]
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += this.tree[i];
    return sum;
  }

  update(index, val) {
    const delta = val - this.nums[index];
    this.nums[index] = val;
    this.#add(index, delta);
  }

  sumRange(left, right) {
    return this.#prefixSum(right) - this.#prefixSum(left - 1);
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [NumArrayBrute, NumArray]) {
  const na = new Cls([1, 3, 5]);
  assert.strictEqual(na.sumRange(0, 2), 9);
  na.update(1, 2);
  assert.strictEqual(na.sumRange(0, 2), 8);
  assert.strictEqual(na.sumRange(2, 2), 5);
  const one = new Cls([-4]);
  assert.strictEqual(one.sumRange(0, 0), -4);
  one.update(0, -4);
  assert.strictEqual(one.sumRange(0, 0), -4);
  const neg = new Cls([-2, 0, 3, -5, 2, -1]);
  assert.strictEqual(neg.sumRange(1, 4), 0);
}
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
console.log('✓ 01-range-sum-query-mutable-bit passed');

module.exports = { NumArray, NumArrayBrute, optimal: NumArray, bruteForce: NumArrayBrute };
