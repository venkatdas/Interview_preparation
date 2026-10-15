/**
 * 02. Range Minimum Query with updates   (classic — Medium)
 *
 * PROBLEM
 * Given an integer array, answer two kinds of operations, many times, in any order:
 *   - update(index, value): nums[index] = value
 *   - minRange(left, right): the smallest value in nums[left..right] (inclusive)
 *
 * EXAMPLES
 * nums = [5, 2, 8, 6, 3]
 *   minRange(1, 3) -> 2
 *   update(1, 9)       nums = [5, 9, 8, 6, 3]
 *   minRange(1, 3) -> 6
 *   minRange(0, 4) -> 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the array static (no updates)? -> then a sparse table (../../34_Range_Query_Data_Structures/03_Sparse_Table/)
 *   gives O(1) queries. Updates are what force us into a segment tree.
 * - Do we need the index of the minimum or only the value? (value here; index is a small change)
 *
 * APPROACH 1 — Brute force   O(1) update, O(n) query
 * Loop from left to right and keep the smallest value seen.
 *
 * APPROACH 2 — Optimal (Segment tree with merge = Math.min)   O(log n) both, O(n) space
 * Exactly the sum tree, but a node stores the MIN of its range and the identity for
 * "nothing here" is +Infinity. This is why we write the tree with a generic merge.
 *
 * Dry run, nums = [5, 2, 8, 6, 3] (recursive tree, node covers [lo, hi]):
 *            [0,4] = 2
 *          /           \
 *     [0,2] = 2       [3,4] = 3
 *     /      \         /     \
 *  [0,1]=2  [2,2]=8  [3,3]=6 [4,4]=3
 *  /    \
 * [0]=5 [1]=2
 *   minRange(1, 3): root partially overlaps -> ask [0,2] and [3,4]
 *     [0,2] partial -> [0,1] partial -> [0,0] outside (Inf), [1,1] inside (2) -> 2; [2,2] inside (8) -> min 2
 *     [3,4] partial -> [3,3] inside (6), [4,4] outside (Inf) -> 6
 *     answer min(2, 6) = 2
 *   update(1, 9): leaf [1]=9, then [0,1]=min(5,9)=5, [0,2]=min(5,8)=5, root=min(5,3)=3
 *   minRange(1, 3) -> min(9, 8, 6) = 6
 *
 * EDGE CASES
 * - single-element array
 * - all equal values
 * - query covering the whole array
 * - negative values (Infinity identity still works)
 */

class RMQBrute {
  constructor(nums) {
    this.nums = nums.slice();
  }
  update(index, value) {
    this.nums[index] = value;
  }
  minRange(left, right) {
    let best = Infinity;
    for (let i = left; i <= right; i++) best = Math.min(best, this.nums[i]);
    return best;
  }
}

class RMQ {
  constructor(nums) {
    this.n = nums.length;
    this.tree = new Array(4 * this.n).fill(Infinity);
    this.build(0, 0, this.n - 1, nums);
  }

  build(node, lo, hi, nums) {
    if (lo === hi) {
      this.tree[node] = nums[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.build(2 * node + 1, lo, mid, nums);
    this.build(2 * node + 2, mid + 1, hi, nums);
    this.tree[node] = Math.min(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  update(index, value) {
    this.#update(0, 0, this.n - 1, index, value);
  }

  #update(node, lo, hi, index, value) {
    if (lo === hi) {
      this.tree[node] = value;
      return;
    }
    const mid = (lo + hi) >> 1;
    if (index <= mid) this.#update(2 * node + 1, lo, mid, index, value);
    else this.#update(2 * node + 2, mid + 1, hi, index, value);
    this.tree[node] = Math.min(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  minRange(left, right) {
    return this.#query(0, 0, this.n - 1, left, right);
  }

  #query(node, lo, hi, l, r) {
    if (r < lo || hi < l) return Infinity;          // disjoint: identity for min
    if (l <= lo && hi <= r) return this.tree[node]; // fully inside
    const mid = (lo + hi) >> 1;
    return Math.min(
      this.#query(2 * node + 1, lo, mid, l, r),
      this.#query(2 * node + 2, mid + 1, hi, l, r)
    );
  }
}

// ---------- tests ----------
const assert = require('assert');

for (const Cls of [RMQBrute, RMQ]) {
  const q = new Cls([5, 2, 8, 6, 3]);
  assert.strictEqual(q.minRange(1, 3), 2);
  q.update(1, 9);
  assert.strictEqual(q.minRange(1, 3), 6);
  assert.strictEqual(q.minRange(0, 4), 3);
  assert.strictEqual(new Cls([7]).minRange(0, 0), 7);
  assert.strictEqual(new Cls([4, 4, 4]).minRange(0, 2), 4);
  assert.strictEqual(new Cls([-1, -5, 0]).minRange(0, 2), -5);
}

for (let trial = 0; trial < 20; trial++) {
  const n = 1 + Math.floor(Math.random() * 30);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 100) - 50);
  const a = new RMQBrute(nums);
  const b = new RMQ(nums);
  for (let op = 0; op < 100; op++) {
    const i = Math.floor(Math.random() * n);
    if (Math.random() < 0.5) {
      const v = Math.floor(Math.random() * 100) - 50;
      a.update(i, v);
      b.update(i, v);
    } else {
      const j = i + Math.floor(Math.random() * (n - i));
      assert.strictEqual(b.minRange(i, j), a.minRange(i, j));
    }
  }
}
console.log('✓ 02-range-minimum-query passed');

module.exports = { RMQ, RMQBrute, optimal: RMQ, bruteForce: RMQBrute };
