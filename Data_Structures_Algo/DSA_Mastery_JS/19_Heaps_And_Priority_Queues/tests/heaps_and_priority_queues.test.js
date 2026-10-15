// node --test 19_Heaps_And_Priority_Queues/tests/heaps_and_priority_queues.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { MinHeap } = require('../02_Implementations/min_heap');
const { heapSort, buildMaxHeap, siftDown } = require('../02_Implementations/heap_sort');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randArr = (rnd, n, lo, hi) => Array.from({ length: n }, () => lo + Math.floor(rnd() * (hi - lo + 1)));
const drain = (h) => { const out = []; while (!h.isEmpty()) out.push(h.pop()); return out; };
// Checks the heap property on the internal array: parent <= child under `cmp`.
function isHeap(arr, cmp = (a, b) => a - b) {
  for (let i = 1; i < arr.length; i++) if (cmp(arr[(i - 1) >> 1], arr[i]) > 0) return false;
  return true;
}

describe('MinHeap', () => {
  it('empty heap: peek and pop return undefined, size 0', () => {
    const h = new MinHeap();
    assert.equal(h.peek(), undefined);
    assert.equal(h.pop(), undefined);
    assert.equal(h.size(), 0);
    assert.equal(h.isEmpty(), true);
  });
  it('single element and duplicates', () => {
    const h = new MinHeap();
    h.push(5).push(5).push(5);
    assert.equal(h.size(), 3);
    assert.deepEqual(drain(h), [5, 5, 5]);
  });
  it('pops in sorted order on sorted, reverse-sorted and negative input', () => {
    for (const arr of [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1], [-3, 0, -10, 7, -3]]) {
      const h = new MinHeap();
      arr.forEach((x) => h.push(x));
      assert.deepEqual(drain(h), [...arr].sort((a, b) => a - b));
    }
  });
  it('custom comparator makes a max-heap and supports objects', () => {
    const max = new MinHeap((a, b) => b - a);
    [3, 9, 1].forEach((x) => max.push(x));
    assert.equal(max.peek(), 9);
    const byDist = new MinHeap((a, b) => a.d - b.d);
    byDist.push({ id: 'a', d: 5 }).push({ id: 'b', d: 1 });
    assert.equal(byDist.pop().id, 'b');
  });
  it('MinHeap.from builds a valid heap in O(n) and toArray is a copy', () => {
    const h = MinHeap.from([9, 4, 7, 1, 8, 2]);
    const arr = h.toArray();
    assert.ok(isHeap(arr));
    arr.length = 0;
    assert.equal(h.size(), 6);
    assert.equal(MinHeap.from([]).size(), 0);
  });
  it('random push/pop sequence matches a sorted-array reference', () => {
    const rnd = mulberry32(19);
    const h = new MinHeap(), model = [];
    for (let i = 0; i < 3000; i++) {
      if (rnd() < 0.6) { const v = Math.floor(rnd() * 101) - 50; h.push(v); model.push(v); model.sort((a, b) => a - b); }
      else assert.equal(h.pop(), model.shift());
      assert.equal(h.size(), model.length);
      assert.equal(h.peek(), model[0]);
      assert.ok(isHeap(h.toArray()));
    }
  });
  it('heap of random arrays drains equal to Array sort', () => {
    const rnd = mulberry32(7);
    for (let t = 0; t < 200; t++) {
      const arr = randArr(rnd, Math.floor(rnd() * 50), -100, 100);
      assert.deepEqual(drain(MinHeap.from(arr)), [...arr].sort((a, b) => a - b));
    }
  });
});

describe('heap_sort', () => {
  it('handles empty, single, duplicates, sorted, reverse-sorted', () => {
    assert.deepEqual(heapSort([]), []);
    assert.deepEqual(heapSort([1]), [1]);
    assert.deepEqual(heapSort([2, 2, 1, 1]), [1, 1, 2, 2]);
    assert.deepEqual(heapSort([1, 2, 3, 4]), [1, 2, 3, 4]);
    assert.deepEqual(heapSort([4, 3, 2, 1]), [1, 2, 3, 4]);
  });
  it('sorts in place (returns the same array)', () => {
    const a = [3, 1, 2];
    assert.equal(heapSort(a), a);
    assert.deepEqual(a, [1, 2, 3]);
  });
  it('buildMaxHeap produces a max-heap; siftDown respects size bound', () => {
    const rnd = mulberry32(3);
    for (let t = 0; t < 100; t++) {
      const a = randArr(rnd, Math.floor(rnd() * 40), -20, 20);
      buildMaxHeap(a);
      assert.ok(isHeap(a, (x, y) => y - x));
    }
    const b = [1, 5, 9];
    siftDown(b, 0, 1); // heap region of size 1: nothing moves
    assert.deepEqual(b, [1, 5, 9]);
  });
  it('matches Array sort on random input', () => {
    const rnd = mulberry32(11);
    for (let t = 0; t < 300; t++) {
      const a = randArr(rnd, Math.floor(rnd() * 60), -1000, 1000);
      assert.deepEqual(heapSort([...a]), [...a].sort((x, y) => x - y));
    }
  });
});

describe('selected solutions on extra edge cases', () => {
  const kth = require('../03_Problems/solutions/01_kth_largest_element');
  const med = require('../03_Problems/solutions/08_find_median_data_stream');
  const sticks = require('../03_Problems/solutions/12_min_cost_connect_sticks');
  const swm = require('../03_Problems/solutions/16_sliding_window_median');
  const rooms = require('../03_Problems/solutions/11_meeting_rooms_ii');
  it('kth largest: k = 1, k = n, duplicates, random vs brute', () => {
    assert.equal(kth.optimal([3, 3, 3], 2), 3);
    assert.equal(kth.optimal([5, -1, 2], 3), -1);
    const rnd = mulberry32(215);
    for (let t = 0; t < 200; t++) {
      const a = randArr(rnd, 1 + Math.floor(rnd() * 30), -20, 20), k = 1 + Math.floor(rnd() * a.length);
      assert.equal(kth.optimal([...a], k), kth.bruteForce([...a], k));
    }
  });
  it('median finder: single value, even count, negatives', () => {
    const f = new med.MedianFinder();
    f.addNum(-5);
    assert.equal(f.findMedian(), -5);
    f.addNum(5);
    assert.equal(f.findMedian(), 0);
    const rnd = mulberry32(295);
    for (let t = 0; t < 100; t++) {
      const a = randArr(rnd, 1 + Math.floor(rnd() * 25), -10, 10);
      assert.deepEqual(med.optimal(a), med.bruteForce(a));
    }
  });
  it('connect sticks: zero or one stick costs nothing', () => {
    assert.equal(sticks.optimal([5]), 0);
    assert.equal(sticks.optimal([1, 8, 3, 5]), 30);
  });
  it('sliding window median matches brute force (k odd and even)', () => {
    const rnd = mulberry32(480);
    for (let t = 0; t < 100; t++) {
      const a = randArr(rnd, 1 + Math.floor(rnd() * 20), -5, 5), k = 1 + Math.floor(rnd() * a.length);
      assert.deepEqual(swm.optimal(a, k), swm.bruteForce(a, k));
    }
  });
  it('meeting rooms II: back-to-back meetings share a room', () => {
    assert.equal(rooms.optimal([]), 0);
    assert.equal(rooms.optimal([[1, 5], [5, 10]]), 1);
    assert.equal(rooms.optimal([[0, 30], [5, 10], [15, 20]]), 2);
  });
});
