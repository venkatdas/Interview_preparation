const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const S = require('../02_Implementations/sorting_algorithms');
const Q = require('../02_Implementations/quickselect');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(43);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (n, lo = -50, hi = 50) => Array.from({ length: n }, () => randInt(lo, hi));
const asc = (a, b) => a - b;

// Some sorts work in place and return the array, others return a new one. Accept both.
function run(sortFn, input) {
  const copy = [...input];
  const out = sortFn(copy);
  return Array.isArray(out) ? out : copy;
}

const INTEGER_SORTS = ['bubbleSort', 'selectionSort', 'insertionSort', 'shellSort', 'mergeSort', 'quickSortLomuto', 'quickSortHoare', 'heapSort', 'countingSort', 'radixSort', 'bucketSort'];

describe('every sorting algorithm', () => {
  for (const name of INTEGER_SORTS) {
    describe(name, () => {
      const f = S[name];
      it('handles empty and single-element arrays', () => {
        assert.deepEqual(run(f, []), []);
        assert.deepEqual(run(f, [42]), [42]);
      });
      it('handles sorted, reverse-sorted and all-equal input', () => {
        assert.deepEqual(run(f, [1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
        assert.deepEqual(run(f, [5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
        assert.deepEqual(run(f, [7, 7, 7, 7]), [7, 7, 7, 7]);
      });
      it('handles duplicates and negatives', () => {
        assert.deepEqual(run(f, [3, -1, 3, 0, -1, -10]), [-10, -1, -1, 0, 3, 3]);
      });
      it('matches the built-in sort on random input', () => {
        for (let t = 0; t < 100; t++) {
          const a = randArray(randInt(0, 40));
          assert.deepEqual(run(f, a), [...a].sort(asc));
        }
      });
    });
  }
  it('mergeSort does not mutate its input', () => {
    const a = [3, 1, 2];
    S.mergeSort(a);
    assert.deepEqual(a, [3, 1, 2]);
  });
  it('merge combines two sorted arrays, taking the left one on ties', () => {
    assert.deepEqual(S.merge([], []), []);
    assert.deepEqual(S.merge([1, 4], [2, 3, 5]), [1, 2, 3, 4, 5]);
    for (let t = 0; t < 100; t++) {
      const a = randArray(randInt(0, 10)).sort(asc), b = randArray(randInt(0, 10)).sort(asc);
      assert.deepEqual(S.merge(a, b), [...a, ...b].sort(asc));
    }
  });
  it('bucketSort sorts floats', () => {
    const floats = Array.from({ length: 50 }, () => rand() * 10 - 5);
    assert.deepEqual(run(S.bucketSort, floats), [...floats].sort(asc));
  });
  it('partitionLomuto places the pivot at its final index', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(1, 20), -5, 5);
      const p = S.partitionLomuto(a, 0, a.length - 1);
      for (let i = 0; i < p; i++) assert.ok(a[i] <= a[p]);
      for (let i = p + 1; i < a.length; i++) assert.ok(a[i] >= a[p]);
    }
  });
});

describe('quickselect', () => {
  it('k at both ends, single element, all equal, negatives', () => {
    assert.equal(Q.quickselect([9, 1, 5], 0), 1);
    assert.equal(Q.quickselect([9, 1, 5], 2), 9);
    assert.equal(Q.quickselect([4], 0), 4);
    assert.equal(Q.quickselect([2, 2, 2], 1), 2);
    assert.equal(Q.quickselect([-1, -7, -3], 1), -3);
  });
  it('rejects k out of range', () => {
    assert.throws(() => Q.quickselect([], 0), RangeError);
    assert.throws(() => Q.quickselectThreeWay([1], 1), RangeError);
    assert.throws(() => Q.quickselect([1], -1), RangeError);
  });
  it('quickselect, quickselectThreeWay and kthLargest match sorting on random input', () => {
    for (let t = 0; t < 300; t++) {
      const a = randArray(randInt(1, 30), -10, 10);
      const sorted = [...a].sort(asc);
      const k = randInt(0, a.length - 1);
      assert.equal(Q.quickselect([...a], k), sorted[k]);
      assert.equal(Q.quickselectThreeWay([...a], k), sorted[k]);
      assert.equal(Q.kthLargest([...a], k + 1), sorted[a.length - 1 - k]);
    }
  });
  it('sorted and reverse-sorted input of 20000 elements stays fast (random pivot)', () => {
    const big = Array.from({ length: 20000 }, (_, i) => i);
    assert.equal(Q.quickselect([...big], 10000), 10000);
    assert.equal(Q.quickselect([...big].reverse(), 0), 0);
  });
});

describe('solution files: extra edge cases', () => {
  const merge = require('../03_Problems/solutions/03_merge_intervals');
  const largest = require('../03_Problems/solutions/05_largest_number');
  const rooms = require('../03_Problems/solutions/06_meeting_rooms_ii');
  const smaller = require('../03_Problems/solutions/13_count_smaller_after_self');
  const pairs = require('../03_Problems/solutions/14_reverse_pairs');

  it('Merge Intervals: touching, contained, unsorted input', () => {
    assert.deepEqual(merge.optimal([[1, 4], [4, 5]]), [[1, 5]]);
    assert.deepEqual(merge.optimal([[1, 10], [2, 3]]), [[1, 10]]);
    assert.deepEqual(merge.optimal([[5, 6], [1, 2]]), [[1, 2], [5, 6]]);
    for (let t = 0; t < 200; t++) {
      const iv = Array.from({ length: randInt(1, 8) }, () => { const s = randInt(0, 20); return [s, s + randInt(0, 5)]; });
      assert.deepEqual(merge.optimal(iv.map((x) => [...x])), merge.bruteForce(iv.map((x) => [...x])));
    }
  });
  it('Largest Number: all zeros and prefix-sharing numbers', () => {
    assert.equal(largest.optimal([0, 0]), '0');
    assert.equal(largest.optimal([3, 30, 34, 5, 9]), '9534330');
    assert.equal(largest.optimal([121, 12]), '12121');
  });
  it('Meeting Rooms II: back-to-back meetings share a room', () => {
    assert.equal(rooms.optimal([[1, 5], [5, 10]]), 1);
    assert.equal(rooms.optimal([[0, 30], [5, 10], [15, 20]]), 2);
    for (let t = 0; t < 200; t++) {
      const iv = Array.from({ length: randInt(1, 8) }, () => { const s = randInt(0, 20); return [s, s + randInt(1, 6)]; });
      assert.equal(rooms.optimal(iv.map((x) => [...x])), rooms.bruteForce(iv.map((x) => [...x])));
    }
  });
  it('Count of Smaller Numbers After Self: duplicates and negatives vs brute force', () => {
    assert.deepEqual(smaller.optimal([-1, -1]), [0, 0]);
    for (let t = 0; t < 200; t++) { const a = randArray(randInt(0, 15), -5, 5); assert.deepEqual(smaller.optimal([...a]), smaller.bruteForce([...a])); }
  });
  it('Reverse Pairs: strict inequality and large values', () => {
    assert.equal(pairs.optimal([2, 1]), 0);
    assert.equal(pairs.optimal([2 ** 31 - 1, 2 ** 31 - 1, 2 ** 31 - 1]), 0);
    assert.equal(pairs.optimal([-5, -5]), 1);
    for (let t = 0; t < 200; t++) { const a = randArray(randInt(0, 15), -10, 10); assert.equal(pairs.optimal([...a]), pairs.bruteForce([...a])); }
  });
});
