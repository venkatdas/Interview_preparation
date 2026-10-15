/**
 * 06. Range Sum with Sqrt Decomposition   (classic; LeetCode 307 flavour — Medium)
 *
 * PROBLEM
 * Support update(index, value) and sumRange(left, right) on an integer array, both called
 * many times, with a structure simpler than a segment tree.
 *
 * EXAMPLES
 * nums = [1, 3, 5, 7, 9, 11]
 *   sumRange(1, 4) -> 24
 *   update(2, 10)      nums = [1, 3, 10, 7, 9, 11]
 *   sumRange(1, 4) -> 29
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n and the number of operations both around 10^4..10^5 -> O(sqrt n) per op is fine
 * - Values can be negative
 *
 * APPROACH 1 — Brute force   O(1) update, O(n) query
 * Plain array with a loop.
 *
 * APPROACH 2 — Optimal (Sqrt decomposition)   O(1) update, O(sqrt n) query, O(sqrt n) extra space
 * Cut the array into blocks of size B = floor(sqrt n) and store each block's sum.
 *   update: change the element and add the delta to its block sum.
 *   query [l, r]: walk i from l; if i is at a block start and the whole block fits in the
 *   range, add the block sum and jump B; otherwise add the single element.
 * At most 2 partial blocks (2B elements) and n/B whole blocks -> O(sqrt n).
 * Compared to a Fenwick tree (O(log n) both) it is slower but the easiest "better than O(n)"
 * structure to explain, and it also handles non-invertible ops (min/max) with O(sqrt n) update.
 *
 * Dry run: nums = [1,3,5,7,9,11], B = 2, blocks = [4, 12, 20]
 *   sumRange(1, 4): i=1 partial -> 3; i=2 block start, block [2,3] fits -> +12, i=4;
 *                   i=4 block start but [4,5] does not fit (r=4) -> +9 -> 24
 *   update(2, 10): delta 5 -> blocks = [4, 17, 20]
 *   sumRange(1, 4): 3 + 17 + 9 = 29
 *
 * EDGE CASES
 * - n = 1 (block size 1)
 * - n not a multiple of the block size (last block is short)
 * - query inside one block
 */

class NumArrayBrute {
  constructor(nums) {
    this.nums = nums.slice();
  }
  update(index, value) {
    this.nums[index] = value;
  }
  sumRange(left, right) {
    let sum = 0;
    for (let i = left; i <= right; i++) sum += this.nums[i];
    return sum;
  }
}

class NumArray {
  constructor(nums) {
    this.nums = nums.slice();
    this.blockSize = Math.max(1, Math.floor(Math.sqrt(nums.length)));
    this.blocks = new Array(Math.ceil(nums.length / this.blockSize) || 1).fill(0);
    for (let i = 0; i < nums.length; i++) this.blocks[Math.floor(i / this.blockSize)] += nums[i];
  }
  update(index, value) {
    this.blocks[Math.floor(index / this.blockSize)] += value - this.nums[index];
    this.nums[index] = value;
  }
  sumRange(left, right) {
    let sum = 0;
    let i = left;
    while (i <= right) {
      if (i % this.blockSize === 0 && i + this.blockSize - 1 <= right) {
        sum += this.blocks[i / this.blockSize];      // whole block in one step
        i += this.blockSize;
      } else {
        sum += this.nums[i];
        i++;
      }
    }
    return sum;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [NumArrayBrute, NumArray]) {
  const na = new Cls([1, 3, 5, 7, 9, 11]);
  assert.strictEqual(na.sumRange(1, 4), 24);
  na.update(2, 10);
  assert.strictEqual(na.sumRange(1, 4), 29);
  assert.strictEqual(na.sumRange(0, 5), 41);
  assert.strictEqual(na.sumRange(3, 3), 7);
  const one = new Cls([-4]);
  assert.strictEqual(one.sumRange(0, 0), -4);
  const seven = new Cls([1, 1, 1, 1, 1, 1, 1]);   // n not a multiple of block size
  assert.strictEqual(seven.sumRange(0, 6), 7);
}
for (let trial = 0; trial < 50; trial++) {
  const n = 1 + Math.floor(Math.random() * 40);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 41) - 20);
  const a = new NumArrayBrute(nums);
  const b = new NumArray(nums);
  for (let op = 0; op < 100; op++) {
    const i = Math.floor(Math.random() * n);
    if (Math.random() < 0.4) {
      const v = Math.floor(Math.random() * 41) - 20;
      a.update(i, v);
      b.update(i, v);
    } else {
      const j = i + Math.floor(Math.random() * (n - i));
      assert.strictEqual(b.sumRange(i, j), a.sumRange(i, j));
    }
  }
}
console.log('✓ 06-range-sum-sqrt-decomposition passed');

module.exports = { NumArray, NumArrayBrute, optimal: NumArray, bruteForce: NumArrayBrute };
