// node --test 34_Range_Query_Data_Structures/02_Fenwick_Tree/tests/fenwick_tree.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { FenwickTree, FenwickTree2D } = require('../02_Implementations/fenwick_tree');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3402);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const sum = (arr, l, r) => { let s = 0; for (let i = l; i <= r; i++) s += arr[i]; return s; };

describe('FenwickTree', () => {
  it('builds from values and answers prefix / range sums', () => {
    const f = new FenwickTree([3, 2, -1, 6, 5, 4, -3, 3]);
    assert.equal(f.prefixSum(7), 19);
    assert.equal(f.prefixSum(-1), 0);
    assert.equal(f.rangeSum(2, 4), 10);
    assert.equal(f.rangeSum(4, 2), 0);
    f.update(3, 5);
    assert.equal(f.rangeSum(2, 4), 15);
  });
  it('size constructor starts at zero; single element', () => {
    const f = new FenwickTree(1);
    assert.equal(f.prefixSum(0), 0);
    f.update(0, 7);
    assert.equal(f.rangeSum(0, 0), 7);
  });
  it('O(n) build equals n point updates', () => {
    for (let t = 0; t < 50; t++) {
      const arr = Array.from({ length: rint(1, 64) }, () => rint(-9, 9));
      const a = new FenwickTree(arr), b = new FenwickTree(arr.length);
      arr.forEach((v, i) => b.update(i, v));
      assert.deepEqual(a.tree, b.tree);
    }
  });
  it('matches plain loops on random update / query sequences', () => {
    for (let t = 0; t < 100; t++) {
      const n = rint(1, 50);
      const arr = Array.from({ length: n }, () => rint(-100, 100));
      const f = new FenwickTree(arr);
      for (let q = 0; q < 100; q++) {
        if (rand() < 0.4) { const i = rint(0, n - 1), d = rint(-50, 50); arr[i] += d; f.update(i, d); }
        else { const l = rint(0, n - 1), r = rint(l, n - 1); assert.equal(f.rangeSum(l, r), sum(arr, l, r)); assert.equal(f.prefixSum(r), sum(arr, 0, r)); }
      }
    }
  });
  it('findKth matches a linear scan over non-negative counts', () => {
    for (let t = 0; t < 100; t++) {
      const n = rint(1, 40);
      const counts = Array.from({ length: n }, () => rint(0, 3));
      const f = new FenwickTree(counts);
      const total = counts.reduce((a, b) => a + b, 0);
      for (let k = 1; k <= total; k++) {
        let p = 0, acc = counts[0];
        while (acc < k) acc += counts[++p];
        assert.equal(f.findKth(k), p);
      }
    }
  });
});

describe('FenwickTree2D', () => {
  it('matches a nested loop on random grids', () => {
    for (let t = 0; t < 40; t++) {
      const R = rint(1, 8), C = rint(1, 8);
      const g = Array.from({ length: R }, () => new Array(C).fill(0));
      const f = new FenwickTree2D(R, C);
      for (let q = 0; q < 60; q++) {
        if (rand() < 0.5) { const r = rint(0, R - 1), c = rint(0, C - 1), d = rint(-9, 9); g[r][c] += d; f.update(r, c, d); }
        else {
          const r1 = rint(0, R - 1), r2 = rint(r1, R - 1), c1 = rint(0, C - 1), c2 = rint(c1, C - 1);
          let s = 0; for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) s += g[r][c];
          assert.equal(f.rangeSum(r1, c1, r2, c2), s);
        }
      }
    }
  });
});

describe('solution files', () => {
  const p01 = require('../03_Problems/solutions/01_range_sum_query_mutable_bit');
  const p02 = require('../03_Problems/solutions/02_count_of_smaller_numbers_after_self');
  const p03 = require('../03_Problems/solutions/03_reverse_pairs');
  const p04 = require('../03_Problems/solutions/04_create_sorted_array_through_instructions');
  const p05 = require('../03_Problems/solutions/05_count_good_triplets_in_an_array');
  it('edge cases', () => {
    assert.deepEqual(p02.optimal([-1]), [0]);
    assert.deepEqual(p02.optimal([2, 2, 2]), [0, 0, 0]);
    assert.equal(p03.optimal([2147483647, 2147483647, 2147483647]), 0);
    assert.equal(p04.optimal([1]), 0);
  });
  it('optimal agrees with bruteForce on random inputs', () => {
    for (let t = 0; t < 150; t++) {
      const nums = Array.from({ length: rint(1, 25) }, () => rint(-10, 10));
      assert.deepEqual(p02.optimal([...nums]), p02.bruteForce([...nums]));
      assert.equal(p03.optimal([...nums]), p03.bruteForce([...nums]));
      const ins = nums.map((x) => Math.abs(x) + 1);
      assert.equal(p04.optimal(ins), p04.bruteForce(ins));
      const n = rint(3, 9);
      const perm = () => { const a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = rint(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      const a = perm(), b = perm();
      assert.equal(p05.optimal(a, b), p05.bruteForce(a, b));
      const s = new p01.optimal([...nums]), sb = new p01.bruteForce([...nums]);
      for (let q = 0; q < 10; q++) {
        const i = rint(0, nums.length - 1), v = rint(-9, 9); s.update(i, v); sb.update(i, v);
        const l = rint(0, nums.length - 1), r = rint(l, nums.length - 1);
        assert.equal(s.sumRange(l, r), sb.sumRange(l, r));
      }
    }
  });
});
