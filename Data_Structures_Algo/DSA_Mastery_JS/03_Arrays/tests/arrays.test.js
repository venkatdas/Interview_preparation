const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { DynamicArray } = require('../02_Implementations/dynamic_array');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (n, lo = -20, hi = 20) => Array.from({ length: n }, () => randInt(lo, hi));
const fromList = (xs, cap) => { const d = new DynamicArray(cap); for (const x of xs) d.push(x); return d; };

describe('DynamicArray', () => {
  it('handles the normal push / get / set / pop flow', () => {
    const d = fromList([1, 2, 3]);
    assert.equal(d.length, 3);
    assert.equal(d.get(1), 2);
    d.set(1, 20);
    assert.deepEqual(d.toArray(), [1, 20, 3]);
    assert.equal(d.pop(), 3);
    assert.equal(d.length, 2);
  });
  it('handles an empty array', () => {
    const d = new DynamicArray();
    assert.equal(d.length, 0);
    assert.equal(d.pop(), undefined);
    assert.deepEqual(d.toArray(), []);
    assert.throws(() => d.get(0), RangeError);
    assert.throws(() => d.removeAt(0), RangeError);
  });
  it('rejects bad capacity and out-of-bounds indices', () => {
    assert.throws(() => new DynamicArray(0));
    const d = fromList([1]);
    assert.throws(() => d.get(-1), RangeError);
    assert.throws(() => d.get(1), RangeError);
    assert.throws(() => d.set(5, 0), RangeError);
    assert.throws(() => d.insertAt(3, 0), RangeError);
    assert.throws(() => d.insertAt(-1, 0), RangeError);
  });
  it('doubles capacity only when full (amortized O(1) push)', () => {
    const d = new DynamicArray(1);
    const seen = [];
    for (let i = 0; i < 9; i++) { d.push(i); seen.push(d.capacity); }
    assert.deepEqual(seen, [1, 2, 4, 4, 8, 8, 8, 8, 16]);
  });
  it('insertAt at front, middle and end; removeAt shifts left', () => {
    const d = fromList([2, 4], 2);
    d.insertAt(0, 1);
    d.insertAt(2, 3);
    d.insertAt(d.length, 5);
    assert.deepEqual(d.toArray(), [1, 2, 3, 4, 5]);
    assert.equal(d.removeAt(0), 1);
    assert.equal(d.removeAt(d.length - 1), 5);
    assert.deepEqual(d.toArray(), [2, 3, 4]);
  });
  it('stores duplicates, negatives and non-numbers', () => {
    const d = fromList([-1, -1, 'a', null, undefined]);
    assert.deepEqual(d.toArray(), [-1, -1, 'a', null, undefined]);
    assert.equal(d.length, 5);
  });
  it('matches a native array on random operation sequences', () => {
    for (let t = 0; t < 200; t++) {
      const d = new DynamicArray(randInt(1, 4));
      const ref = [];
      for (let step = 0; step < 60; step++) {
        const op = rand();
        if (op < 0.35) { const v = randInt(-9, 9); assert.equal(d.push(v), ref.push(v)); }
        else if (op < 0.5) assert.equal(d.pop(), ref.pop());
        else if (op < 0.7) { const i = randInt(0, ref.length); const v = randInt(-9, 9); d.insertAt(i, v); ref.splice(i, 0, v); }
        else if (op < 0.85 && ref.length) { const i = randInt(0, ref.length - 1); assert.equal(d.removeAt(i), ref.splice(i, 1)[0]); }
        else if (ref.length) { const i = randInt(0, ref.length - 1); const v = randInt(-9, 9); d.set(i, v); ref[i] = v; assert.equal(d.get(i), v); }
        assert.equal(d.length, ref.length);
        assert.ok(d.capacity >= d.length);
      }
      assert.deepEqual(d.toArray(), ref);
    }
  });
});

describe('solution files: extra edge cases', () => {
  const maxSub = require('../03_Problems/solutions/04_maximum_subarray');
  const colors = require('../03_Problems/solutions/13_sort_colors');
  const nextPerm = require('../03_Problems/solutions/15_next_permutation');
  const firstMissing = require('../03_Problems/solutions/16_first_missing_positive');
  const dup = require('../03_Problems/solutions/18_find_the_duplicate_number');

  it('Maximum Subarray: all negative, single element, random vs brute force', () => {
    assert.equal(maxSub.optimal([-3, -1, -2]), -1);
    assert.equal(maxSub.optimal([5]), 5);
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(1, 25));
      assert.equal(maxSub.optimal(a), maxSub.bruteForce(a));
    }
  });
  it('Sort Colors: empty, already sorted, reverse sorted, random', () => {
    assert.deepEqual(colors.optimal([]), []);
    assert.deepEqual(colors.optimal([0, 1, 2]), [0, 1, 2]);
    assert.deepEqual(colors.optimal([2, 2, 1, 0, 0]), [0, 0, 1, 2, 2]);
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(0, 20), 0, 2);
      assert.deepEqual(colors.optimal([...a]), [...a].sort((x, y) => x - y));
    }
  });
  it('Next Permutation: last permutation wraps, duplicates, single element', () => {
    assert.deepEqual(nextPerm.optimal([3, 2, 1]), [1, 2, 3]);
    assert.deepEqual(nextPerm.optimal([1, 1, 5]), [1, 5, 1]);
    assert.deepEqual(nextPerm.optimal([1, 5, 1]), [5, 1, 1]);
    assert.deepEqual(nextPerm.optimal([7]), [7]);
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(1, 6), 0, 3);
      assert.deepEqual(nextPerm.optimal([...a]), nextPerm.bruteForce([...a]));
    }
  });
  it('First Missing Positive: no positives, all 1..n present, duplicates, random', () => {
    assert.equal(firstMissing.optimal([-1, -2, 0]), 1);
    assert.equal(firstMissing.optimal([1, 2, 3]), 4);
    assert.equal(firstMissing.optimal([1, 1, 1]), 2);
    assert.equal(firstMissing.optimal([]), 1);
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(0, 15), -5, 15);
      assert.equal(firstMissing.optimal([...a]), firstMissing.bruteForce([...a]));
    }
  });
  it('Find the Duplicate Number: duplicate repeated many times, does not modify input', () => {
    const a = [2, 2, 2, 2, 2];
    assert.equal(dup.optimal(a), 2);
    assert.deepEqual(a, [2, 2, 2, 2, 2]);
    assert.equal(dup.optimal([1, 1]), 1);
    for (let t = 0; t < 200; t++) {
      const n = randInt(1, 15);
      const nums = Array.from({ length: n }, (_, i) => i + 1);
      nums.push(randInt(1, n));
      for (let i = nums.length - 1; i > 0; i--) { const j = randInt(0, i); [nums[i], nums[j]] = [nums[j], nums[i]]; }
      assert.equal(dup.optimal([...nums]), dup.bruteForce([...nums]));
    }
  });
});
