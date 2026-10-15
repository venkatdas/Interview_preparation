// node --test 35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/tests/skip_list_bloom_filter_sorted_list.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { SkipList } = require('../02_Implementations/skip_list');
const { SortedList } = require('../02_Implementations/sorted_list');
const { BloomFilter } = require('../02_Implementations/bloom_filter');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3502);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

// Reference: a plain array kept sorted with sort() after every change.
class ArraySet {
  constructor() { this.a = []; }
  add(x) { this.a.push(x); this.a.sort((p, q) => p - q); }
  remove(x) { const i = this.a.indexOf(x); if (i === -1) return false; this.a.splice(i, 1); return true; }
  has(x) { return this.a.includes(x); }
}

describe('SkipList', () => {
  it('insert, search, delete on a small example (duplicates allowed)', () => {
    const s = new SkipList();
    for (const v of [5, 1, 9, 5, 3]) s.insert(v);
    assert.deepEqual(s.toArray(), [1, 3, 5, 5, 9]);
    assert.equal(s.search(5), true);
    assert.equal(s.search(4), false);
    assert.equal(s.delete(5), true);
    assert.deepEqual(s.toArray(), [1, 3, 5, 9]);
    assert.equal(s.delete(42), false);
    assert.equal(s.size, 4);
  });
  it('empty list', () => {
    const s = new SkipList();
    assert.equal(s.search(1), false);
    assert.equal(s.delete(1), false);
    assert.deepEqual(s.toArray(), []);
  });
  it('matches a sorted array on random operation sequences', () => {
    for (let t = 0; t < 80; t++) {
      const s = new SkipList({ maxLevel: rint(1, 8) }), ref = new ArraySet();
      for (let q = 0; q < 150; q++) {
        const x = rint(-15, 15), r = rand();
        if (r < 0.45) { s.insert(x); ref.add(x); }
        else if (r < 0.75) assert.equal(s.delete(x), ref.remove(x));
        else assert.equal(s.search(x), ref.has(x));
      }
      assert.deepEqual(s.toArray(), ref.a);
      assert.equal(s.size, ref.a.length);
    }
  });
});

describe('SortedList', () => {
  it('neighbour queries on a small example', () => {
    const s = new SortedList([5, 1, 3, 3, 9]);
    assert.deepEqual(s.toArray(), [1, 3, 3, 5, 9]);
    assert.equal(s.floor(4), 3);
    assert.equal(s.ceiling(4), 5);
    assert.equal(s.lower(3), 1);
    assert.equal(s.higher(3), 5);
    assert.equal(s.countBetween(2, 5), 3);
    assert.equal(s.floor(0), undefined);
    assert.equal(s.higher(9), undefined);
    assert.equal(s.at(-1), 9);
  });
  it('custom comparator (descending)', () => {
    const s = new SortedList([1, 4, 2], (a, b) => b - a);
    s.add(3);
    assert.deepEqual(s.toArray(), [4, 3, 2, 1]);
  });
  it('matches a sorted array (with linear-scan neighbour queries) on random sequences', () => {
    for (let t = 0; t < 100; t++) {
      const s = new SortedList(), ref = new ArraySet();
      for (let q = 0; q < 120; q++) {
        const x = rint(-10, 10), r = rand();
        if (r < 0.45) { s.add(x); ref.add(x); }
        else if (r < 0.7) assert.equal(s.remove(x), ref.remove(x));
        else {
          const a = ref.a;
          assert.equal(s.has(x), ref.has(x));
          assert.equal(s.floor(x), [...a].reverse().find((v) => v <= x));
          assert.equal(s.ceiling(x), a.find((v) => v >= x));
          assert.equal(s.lower(x), [...a].reverse().find((v) => v < x));
          assert.equal(s.higher(x), a.find((v) => v > x));
          const y = rint(x, 12);
          assert.equal(s.countBetween(x, y), a.filter((v) => v >= x && v <= y).length);
        }
      }
      assert.deepEqual(s.toArray(), ref.a);
      assert.equal(s.length, ref.a.length);
    }
  });
});

describe('BloomFilter', () => {
  const words = (n, tag) => Array.from({ length: n }, (_, i) => tag + i + '_' + rint(0, 1e9));
  it('never gives a false negative', () => {
    const bf = BloomFilter.forCapacity(1000, 0.01);
    const added = words(1000, 'in');
    added.forEach((w) => bf.add(w));
    for (const w of added) assert.equal(bf.mightContain(w), true);
  });
  it('false positive rate stays near the target', () => {
    const bf = BloomFilter.forCapacity(2000, 0.01);
    words(2000, 'in').forEach((w) => bf.add(w));
    const probes = words(20000, 'out');
    const fp = probes.filter((w) => bf.mightContain(w)).length / probes.length;
    assert.ok(fp < 0.03, 'observed FP rate ' + fp);
    assert.ok(Math.abs(bf.estimatedFalsePositiveRate() - 0.01) < 0.01);
  });
  it('empty filter contains nothing; numbers are stringified', () => {
    const bf = new BloomFilter(64, 3);
    assert.equal(bf.mightContain('x'), false);
    bf.add(42);
    assert.equal(bf.mightContain('42'), true);
  });
});

describe('solution files: optimal vs bruteForce', () => {
  const p01 = require('../03_Problems/solutions/01_my_calendar_i');
  const p02 = require('../03_Problems/solutions/02_contains_duplicate_iii');
  const p03 = require('../03_Problems/solutions/03_exam_room');
  const p04 = require('../03_Problems/solutions/04_design_skiplist');
  const p05 = require('../03_Problems/solutions/05_count_of_range_sum_sorted_list');
  it('My Calendar I and Design Skiplist on random sequences', () => {
    for (let t = 0; t < 100; t++) {
      const a = new p01.optimal(), b = new p01.bruteForce();
      for (let q = 0; q < 30; q++) { const s = rint(0, 50), e = rint(s + 1, 60); assert.equal(a.book(s, e), b.book(s, e)); }
      const x = new p04.optimal(), y = new p04.bruteForce();
      for (let q = 0; q < 60; q++) {
        const v = rint(0, 10), r = rand();
        if (r < 0.4) { x.add(v); y.add(v); }
        else if (r < 0.7) assert.equal(x.erase(v), y.erase(v));
        else assert.equal(x.search(v), y.search(v));
      }
    }
  });
  it('Exam Room on random seat/leave sequences', () => {
    for (let t = 0; t < 100; t++) {
      const n = rint(1, 12);
      const a = new p03.optimal(n), b = new p03.bruteForce(n);
      const taken = [];
      for (let q = 0; q < 30; q++) {
        if (taken.length < n && (taken.length === 0 || rand() < 0.6)) {
          const s = a.seat(); assert.equal(s, b.seat()); taken.push(s);
        } else {
          const p = taken.splice(rint(0, taken.length - 1), 1)[0]; a.leave(p); b.leave(p);
        }
      }
    }
  });
  it('Contains Duplicate III and Count of Range Sum on random arrays', () => {
    assert.equal(p02.optimal([1], 1, 0), false);
    for (let t = 0; t < 200; t++) {
      const nums = Array.from({ length: rint(1, 15) }, () => rint(-10, 10));
      const k = rint(1, 5), d = rint(0, 3);
      assert.equal(p02.optimal(nums, k, d), p02.bruteForce(nums, k, d));
      const lo = rint(-8, 3), hi = rint(lo, 8);
      assert.equal(p05.optimal(nums, lo, hi), p05.bruteForce(nums, lo, hi));
    }
  });
});
