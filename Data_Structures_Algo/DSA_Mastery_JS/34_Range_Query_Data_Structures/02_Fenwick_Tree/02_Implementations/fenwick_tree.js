/**
 * Fenwick Tree (Binary Indexed Tree, BIT) implementations in JavaScript.
 *
 * 1. FenwickTree   - prefix sums with point updates, O(log n) each, O(n) space
 *                    + static build in O(n), rangeSum, findKth (binary lifting)
 * 2. FenwickTree2D - the same idea on a grid: point update + rectangle-sum query
 *
 * The internal array is 1-INDEXED. tree[i] stores the sum of the lowbit(i) elements
 * ending at i, where lowbit(i) = i & -i = the value of i's lowest set bit.
 *
 *   i (binary)  lowbit  covers (1-indexed positions)
 *   1   0001      1     [1]
 *   2   0010      2     [1..2]
 *   3   0011      1     [3]
 *   4   0100      4     [1..4]
 *   5   0101      1     [5]
 *   6   0110      2     [5..6]
 *   7   0111      1     [7]
 *   8   1000      8     [1..8]
 *
 * prefixSum(i): add tree[i], then drop the lowest bit (i -= lowbit(i)) until i = 0.
 * update(i):    add to tree[i], then go to the next node that covers i (i += lowbit(i)).
 */

// ---------- 1. One-dimensional Fenwick tree ----------
class FenwickTree {
  // Accepts a size (all zeros) or an array of initial values (0-indexed input).
  constructor(sizeOrValues) {
    if (typeof sizeOrValues === 'number') {
      this.n = sizeOrValues;
      this.tree = new Array(this.n + 1).fill(0);
    } else {
      const values = sizeOrValues;
      this.n = values.length;
      this.tree = new Array(this.n + 1).fill(0);
      // O(n) build: put each value at its slot, then push each slot's total to its parent
      for (let i = 1; i <= this.n; i++) this.tree[i] += values[i - 1];
      for (let i = 1; i <= this.n; i++) {
        const parent = i + (i & -i);
        if (parent <= this.n) this.tree[parent] += this.tree[i];
      }
    }
  }

  // nums[index] += delta   (index is 0-indexed from the outside)
  update(index, delta) {
    for (let i = index + 1; i <= this.n; i += i & -i) this.tree[i] += delta;
  }

  // sum of nums[0..index] inclusive (0-indexed); index = -1 gives 0
  prefixSum(index) {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += this.tree[i];
    return sum;
  }

  // sum of nums[left..right] inclusive
  rangeSum(left, right) {
    if (left > right) return 0;
    return this.prefixSum(right) - this.prefixSum(left - 1);
  }

  // For a tree of NON-NEGATIVE counts: smallest 0-indexed position p such that
  // prefixSum(p) >= k (the k-th element in sorted order, 1-based k). O(log n).
  // Works by "binary lifting": try to jump by the largest power of two first.
  findKth(k) {
    let pos = 0;
    let remaining = k;
    let step = 1;
    while (step * 2 <= this.n) step *= 2;         // highest power of two <= n
    for (; step > 0; step >>= 1) {
      const next = pos + step;
      // jump only if the whole block up to `next` still has fewer than `remaining` items
      if (next <= this.n && this.tree[next] < remaining) {
        pos = next;
        remaining -= this.tree[next];
      }
    }
    return pos;      // pos is 1-indexed "last position that is too small"; +1 -1 = 0-indexed answer
  }
}

// ---------- 2. Two-dimensional Fenwick tree ----------
// tree[i][j] covers rows (i - lowbit(i), i] and columns (j - lowbit(j), j].
// Everything is the 1D logic applied to both coordinates: O(log R * log C) per op.
class FenwickTree2D {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.tree = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  }

  update(row, col, delta) {           // 0-indexed
    for (let i = row + 1; i <= this.rows; i += i & -i) {
      for (let j = col + 1; j <= this.cols; j += j & -j) this.tree[i][j] += delta;
    }
  }

  // sum of the rectangle (0,0)..(row,col) inclusive
  prefixSum(row, col) {
    let sum = 0;
    for (let i = row + 1; i > 0; i -= i & -i) {
      for (let j = col + 1; j > 0; j -= j & -j) sum += this.tree[i][j];
    }
    return sum;
  }

  // sum of the rectangle (r1,c1)..(r2,c2) inclusive, by inclusion-exclusion
  rangeSum(r1, c1, r2, c2) {
    return this.prefixSum(r2, c2) - this.prefixSum(r1 - 1, c2)
         - this.prefixSum(r2, c1 - 1) + this.prefixSum(r1 - 1, c1 - 1);
  }
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

// 1D: random updates and range sums vs a plain loop
for (let trial = 0; trial < 50; trial++) {
  const n = randomInt(1, 40);
  const arr = Array.from({ length: n }, () => randomInt(-30, 30));
  const bit = new FenwickTree(arr);                         // O(n) build
  const bit2 = new FenwickTree(n);                          // incremental build
  arr.forEach((v, i) => bit2.update(i, v));
  for (let op = 0; op < 100; op++) {
    if (Math.random() < 0.4) {
      const i = randomInt(0, n - 1);
      const delta = randomInt(-10, 10);
      arr[i] += delta;
      bit.update(i, delta);
      bit2.update(i, delta);
    } else {
      const l = randomInt(0, n - 1);
      const r = randomInt(l, n - 1);
      let expected = 0;
      for (let i = l; i <= r; i++) expected += arr[i];
      assert.strictEqual(bit.rangeSum(l, r), expected);
      assert.strictEqual(bit2.rangeSum(l, r), expected);
    }
  }
}

// fixed checks
const ft = new FenwickTree([3, 2, -1, 6, 5, 4, -3, 3]);
assert.strictEqual(ft.prefixSum(-1), 0);
assert.strictEqual(ft.prefixSum(0), 3);
assert.strictEqual(ft.prefixSum(7), 19);
assert.strictEqual(ft.rangeSum(2, 4), 10);
ft.update(2, 4);              // -1 -> 3
assert.strictEqual(ft.rangeSum(2, 4), 14);

// findKth on a counting tree: counts = [0, 2, 0, 1, 3] -> sorted multiset 1,1,3,4,4,4
const counts = new FenwickTree([0, 2, 0, 1, 3]);
assert.deepStrictEqual([1, 2, 3, 4, 5, 6].map((k) => counts.findKth(k)), [1, 1, 3, 4, 4, 4]);
for (let trial = 0; trial < 30; trial++) {
  const n = randomInt(1, 20);
  const cnt = Array.from({ length: n }, () => randomInt(0, 3));
  const total = cnt.reduce((a, b) => a + b, 0);
  const tree = new FenwickTree(cnt);
  const expanded = [];
  cnt.forEach((c, i) => { for (let j = 0; j < c; j++) expanded.push(i); });
  for (let k = 1; k <= total; k++) assert.strictEqual(tree.findKth(k), expanded[k - 1]);
}

// 2D: random point updates and rectangle sums vs a loop
for (let trial = 0; trial < 20; trial++) {
  const rows = randomInt(1, 8);
  const cols = randomInt(1, 8);
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
  const bit = new FenwickTree2D(rows, cols);
  for (let op = 0; op < 60; op++) {
    if (Math.random() < 0.5) {
      const r = randomInt(0, rows - 1);
      const c = randomInt(0, cols - 1);
      const delta = randomInt(-5, 5);
      grid[r][c] += delta;
      bit.update(r, c, delta);
    } else {
      const r1 = randomInt(0, rows - 1), r2 = randomInt(r1, rows - 1);
      const c1 = randomInt(0, cols - 1), c2 = randomInt(c1, cols - 1);
      let expected = 0;
      for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) expected += grid[r][c];
      assert.strictEqual(bit.rangeSum(r1, c1, r2, c2), expected);
    }
  }
}

console.log('✓ fenwick-tree.js self-test passed');

module.exports = { FenwickTree, FenwickTree2D };
