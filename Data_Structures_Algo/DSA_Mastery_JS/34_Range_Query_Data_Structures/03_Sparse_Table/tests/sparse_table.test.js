// node --test 34_Range_Query_Data_Structures/03_Sparse_Table/tests/sparse_table.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { SparseTable } = require('../02_Implementations/sparse_table');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3403);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const loop = (arr, l, r, op) => { let acc = arr[l]; for (let i = l + 1; i <= r; i++) acc = op(acc, arr[i]); return acc; };

describe('SparseTable', () => {
  it('min / max on a small example', () => {
    const a = [5, 2, 8, 6, 3, 1, 7];
    const mn = new SparseTable(a), mx = new SparseTable(a, Math.max);
    assert.equal(mn.query(0, 6), 1);
    assert.equal(mn.query(2, 4), 3);
    assert.equal(mx.query(1, 3), 8);
    assert.equal(mn.query(3, 3), 6);
  });
  it('single element, duplicates, negatives', () => {
    assert.equal(new SparseTable([42]).query(0, 0), 42);
    assert.equal(new SparseTable([4, 4, 4, 4]).query(0, 3), 4);
    assert.equal(new SparseTable([-1, -9, 3]).query(0, 2), -9);
  });
  it('throws on an empty range', () => {
    assert.throws(() => new SparseTable([1, 2]).query(1, 0));
  });
  it('matches plain loops for min, max and gcd on random arrays (every range)', () => {
    for (const op of [Math.min, Math.max, gcd]) {
      for (let t = 0; t < 40; t++) {
        const n = rint(1, 40);
        const arr = Array.from({ length: n }, () => (op === gcd ? rint(1, 60) : rint(-100, 100)));
        const st = new SparseTable(arr, op);
        for (let l = 0; l < n; l++) for (let r = l; r < n; r++) assert.equal(st.query(l, r), loop(arr, l, r, op));
      }
    }
  });
  it('queryDisjoint works for a non-idempotent op (sum)', () => {
    for (let t = 0; t < 40; t++) {
      const n = rint(1, 40);
      const arr = Array.from({ length: n }, () => rint(-50, 50));
      const st = new SparseTable(arr, (a, b) => a + b);
      for (let q = 0; q < 50; q++) {
        const l = rint(0, n - 1), r = rint(l, n - 1);
        assert.equal(st.queryDisjoint(l, r, 0), loop(arr, l, r, (a, b) => a + b));
      }
    }
  });
});

describe('solution files', () => {
  const p01 = require('../03_Problems/solutions/01_range_min_queries_offline');
  const p02 = require('../03_Problems/solutions/02_sliding_window_maximum_sparse_table');
  const p03 = require('../03_Problems/solutions/03_longest_common_prefix_of_ranges');
  it('edge cases', () => {
    assert.deepEqual(p02.optimal([7], 1), [7]);
    assert.deepEqual(p02.optimal([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
    assert.deepEqual(p03.optimal('banana', [[1, 3], [0, 2], [2, 4], [5, 5]]), [3, 0, 2, 1]);
  });
  it('optimal agrees with bruteForce on random inputs', () => {
    for (let t = 0; t < 150; t++) {
      const n = rint(1, 30);
      const nums = Array.from({ length: n }, () => rint(-20, 20));
      const qs = Array.from({ length: 20 }, () => { const l = rint(0, n - 1); return [l, rint(l, n - 1)]; });
      assert.deepEqual(p01.optimal(nums, qs), p01.bruteForce(nums, qs));
      const k = rint(1, n);
      assert.deepEqual(p02.optimal(nums, k), p02.bruteForce(nums, k));
      const s = Array.from({ length: n }, () => 'ab'[rint(0, 1)]).join('');
      const pq = Array.from({ length: 20 }, () => [rint(0, n - 1), rint(0, n - 1)]);
      assert.deepEqual(p03.optimal(s, pq), p03.bruteForce(s, pq));
    }
  });
});
