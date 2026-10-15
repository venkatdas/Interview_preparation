// node --test 34_Range_Query_Data_Structures/01_Segment_Tree/tests/segment_tree.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { SegmentTree, IterativeSegmentTree, LazySegmentTree } = require('../02_Implementations/segment_tree');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3401);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const loop = (arr, l, r, merge, id) => { let acc = id; for (let i = l; i <= r; i++) acc = merge(acc, arr[i]); return acc; };

const OPS = [
  ['sum', (a, b) => a + b, 0],
  ['min', Math.min, Infinity],
  ['max', Math.max, -Infinity],
];

for (const Tree of [SegmentTree, IterativeSegmentTree]) {
  describe(Tree.name, () => {
    it('answers sum queries on a small example', () => {
      const t = new Tree([1, 3, 5, 7, 9, 11]);
      assert.equal(t.query(0, 5), 36);
      assert.equal(t.query(1, 3), 15);
      t.update(1, 10);
      assert.equal(t.query(1, 3), 22);
      assert.equal(t.query(4, 4), 9);
    });
    it('handles a single element and negatives', () => {
      const t = new Tree([-7]);
      assert.equal(t.query(0, 0), -7);
      t.update(0, 4);
      assert.equal(t.query(0, 0), 4);
      const m = new Tree([-3, -1, -4], Math.min, Infinity);
      assert.equal(m.query(0, 2), -4);
    });
    it('matches a plain loop on random arrays and operation sequences (sum / min / max)', () => {
      for (const [, merge, id] of OPS) {
        for (let t = 0; t < 60; t++) {
          const n = rint(1, 40);
          const arr = Array.from({ length: n }, () => rint(-50, 50));
          const tree = new Tree(arr, merge, id);
          for (let q = 0; q < 80; q++) {
            if (rand() < 0.4) {
              const i = rint(0, n - 1), v = rint(-50, 50);
              arr[i] = v; tree.update(i, v);
            } else {
              const l = rint(0, n - 1), r = rint(l, n - 1);
              assert.equal(tree.query(l, r), loop(arr, l, r, merge, id));
            }
          }
        }
      }
    });
  });
}

describe('SegmentTree with a non-commutative merge', () => {
  it('keeps left-to-right order (string concatenation)', () => {
    const letters = 'abcdefg'.split('');
    for (const Tree of [SegmentTree, IterativeSegmentTree]) {
      const t = new Tree(letters, (a, b) => a + b, '');
      assert.equal(t.query(1, 5), 'bcdef');
      t.update(3, 'X');
      assert.equal(t.query(0, 6), 'abcXefg');
    }
  });
  it('empty range returns identity', () => {
    assert.equal(new SegmentTree([1, 2, 3]).query(2, 1), 0);
  });
});

describe('LazySegmentTree (range add, range sum)', () => {
  it('small example', () => {
    const t = new LazySegmentTree([1, 2, 3, 4, 5]);
    t.rangeAdd(1, 3, 10);
    assert.equal(t.rangeSum(0, 4), 45);
    assert.equal(t.rangeSum(2, 2), 13);
  });
  it('matches a plain loop on random range-add / range-sum sequences', () => {
    for (let t = 0; t < 100; t++) {
      const n = rint(1, 50);
      const arr = Array.from({ length: n }, () => rint(-20, 20));
      const tree = new LazySegmentTree(arr);
      for (let q = 0; q < 100; q++) {
        const l = rint(0, n - 1), r = rint(l, n - 1);
        if (rand() < 0.5) {
          const d = rint(-10, 10);
          for (let i = l; i <= r; i++) arr[i] += d;
          tree.rangeAdd(l, r, d);
        } else {
          assert.equal(tree.rangeSum(l, r), loop(arr, l, r, (a, b) => a + b, 0));
        }
      }
    }
  });
});

describe('solution files', () => {
  const p01 = require('../03_Problems/solutions/01_range_sum_query_mutable');
  const p02 = require('../03_Problems/solutions/02_range_minimum_query');
  const p04 = require('../03_Problems/solutions/04_my_calendar_iii');
  const p05 = require('../03_Problems/solutions/05_number_of_longest_increasing_subsequence');
  const p06 = require('../03_Problems/solutions/06_count_of_range_sum');
  it('class-based problems: optimal matches brute force on random operation streams', () => {
    for (let t = 0; t < 50; t++) {
      const n = rint(1, 20);
      const nums = Array.from({ length: n }, () => rint(-30, 30));
      const a = new p01.optimal([...nums]), b = new p01.bruteForce([...nums]);
      const c = new p02.optimal([...nums]), d = new p02.bruteForce([...nums]);
      for (let q = 0; q < 40; q++) {
        const l = rint(0, n - 1), r = rint(l, n - 1);
        if (rand() < 0.4) { const i = rint(0, n - 1), v = rint(-30, 30); a.update(i, v); b.update(i, v); c.update(i, v); d.update(i, v); }
        else { assert.equal(a.sumRange(l, r), b.sumRange(l, r)); assert.equal(c.minRange(l, r), d.minRange(l, r)); }
      }
      const cal = new p04.optimal(), calB = new p04.bruteForce();
      for (let q = 0; q < 25; q++) {
        const s = rint(0, 60), e = rint(s + 1, 70);
        assert.equal(cal.book(s, e), calB.book(s, e));
      }
    }
  });
  it('function-based problems agree with brute force on random inputs and edge cases', () => {
    assert.equal(p05.optimal([2, 2, 2, 2, 2]), 5);
    assert.equal(p06.optimal([0], 0, 0), 1);
    for (let t = 0; t < 150; t++) {
      const nums = Array.from({ length: rint(1, 14) }, () => rint(-5, 5));
      assert.equal(p05.optimal([...nums]), p05.bruteForce([...nums]));
      const lo = rint(-6, 3), hi = rint(lo, 8);
      assert.equal(p06.optimal([...nums], lo, hi), p06.bruteForce([...nums], lo, hi));
    }
  });
});
