// node --test 18_Monotonic_Stacks_And_Queues/tests/monotonic_stacks_and_queues.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../02_Implementations/monotonic');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// O(n^2) reference: nearest index to one side whose value passes `test(value, current)`.
function brute(nums, fromLeft, test) {
  const n = nums.length;
  return nums.map((cur, i) => {
    if (fromLeft) { for (let j = i - 1; j >= 0; j--) if (test(nums[j], cur)) return j; return -1; }
    for (let j = i + 1; j < n; j++) if (test(nums[j], cur)) return j;
    return n;
  });
}
const cases = [
  ['previousSmaller', true, (v, c) => v < c, (v, c) => v <= c],
  ['nextSmaller', false, (v, c) => v < c, (v, c) => v <= c],
  ['previousGreater', true, (v, c) => v > c, (v, c) => v >= c],
  ['nextGreater', false, (v, c) => v > c, (v, c) => v >= c],
];
const randArr = (rnd, n, lo, hi) => Array.from({ length: n }, () => lo + Math.floor(rnd() * (hi - lo + 1)));

describe('nearest smaller / greater helpers', () => {
  it('empty and single-element arrays', () => {
    for (const [name] of cases) {
      assert.deepEqual(M[name]([]), []);
      assert.equal(M[name]([5]).length, 1);
    }
    assert.deepEqual(M.nextGreater([5]), [1]);
    assert.deepEqual(M.previousGreater([5]), [-1]);
  });
  it('sorted and reverse-sorted inputs', () => {
    assert.deepEqual(M.nextGreater([1, 2, 3]), [1, 2, 3]);
    assert.deepEqual(M.nextGreater([3, 2, 1]), [3, 3, 3]);
    assert.deepEqual(M.previousSmaller([1, 2, 3]), [-1, 0, 1]);
    assert.deepEqual(M.previousSmaller([3, 2, 1]), [-1, -1, -1]);
  });
  it('strict vs non-strict differ only on duplicates', () => {
    assert.deepEqual(M.previousSmaller([2, 2, 1]), [-1, -1, -1]);
    assert.deepEqual(M.previousSmaller([2, 2, 1], false), [-1, 0, -1]);
    assert.deepEqual(M.nextGreater([4, 4]), [2, 2]);
    assert.deepEqual(M.nextGreater([4, 4], false), [1, 2]);
  });
  it('all four helpers match O(n^2) brute force (strict and non-strict, negatives, duplicates)', () => {
    const rnd = mulberry32(18);
    for (let t = 0; t < 300; t++) {
      const nums = randArr(rnd, Math.floor(rnd() * 25), -5, 5);
      for (const [name, left, strictTest, looseTest] of cases) {
        assert.deepEqual(M[name](nums, true), brute(nums, left, strictTest), `${name} strict ${nums}`);
        assert.deepEqual(M[name](nums, false), brute(nums, left, looseTest), `${name} loose ${nums}`);
      }
    }
  });
});

describe('sliding window max / min', () => {
  const bruteWin = (nums, k, pick) => {
    const out = [];
    for (let i = 0; i + k <= nums.length; i++) out.push(pick(...nums.slice(i, i + k)));
    return out;
  };
  it('k = 1 returns the input; k = n returns one value; empty input', () => {
    assert.deepEqual(M.slidingWindowMax([3, 1, 2], 1), [3, 1, 2]);
    assert.deepEqual(M.slidingWindowMin([3, 1, 2], 3), [1]);
    assert.deepEqual(M.slidingWindowMax([], 1), []);
  });
  it('matches brute force on random input', () => {
    const rnd = mulberry32(239);
    for (let t = 0; t < 300; t++) {
      const n = 1 + Math.floor(rnd() * 30), k = 1 + Math.floor(rnd() * n);
      const nums = randArr(rnd, n, -10, 10);
      assert.deepEqual(M.slidingWindowMax(nums, k), bruteWin(nums, k, Math.max));
      assert.deepEqual(M.slidingWindowMin(nums, k), bruteWin(nums, k, Math.min));
    }
  });
});

describe('largestRectangleArea', () => {
  const bruteHist = (h) => {
    let best = 0;
    for (let i = 0; i < h.length; i++) { let m = Infinity; for (let j = i; j < h.length; j++) { m = Math.min(m, h[j]); best = Math.max(best, m * (j - i + 1)); } }
    return best;
  };
  it('edge cases: empty, zeros, equal bars, sorted, reverse-sorted', () => {
    assert.equal(M.largestRectangleArea([]), 0);
    assert.equal(M.largestRectangleArea([0, 0]), 0);
    assert.equal(M.largestRectangleArea([3, 3, 3]), 9);
    assert.equal(M.largestRectangleArea([1, 2, 3, 4, 5]), 9);
    assert.equal(M.largestRectangleArea([5, 4, 3, 2, 1]), 9);
    assert.equal(M.largestRectangleArea([2, 1, 5, 6, 2, 3]), 10);
  });
  it('matches brute force on random histograms', () => {
    const rnd = mulberry32(84);
    for (let t = 0; t < 300; t++) {
      const h = randArr(rnd, Math.floor(rnd() * 25), 0, 9);
      assert.equal(M.largestRectangleArea(h), bruteHist(h));
    }
  });
});

describe('selected solutions on extra edge cases', () => {
  const span = require('../03_Problems/solutions/01_online_stock_span');
  const unsorted = require('../03_Problems/solutions/02_shortest_unsorted_continuous_subarray');
  const summin = require('../03_Problems/solutions/03_sum_of_subarray_minimums');
  const maxrect = require('../03_Problems/solutions/05_maximal_rectangle');
  const jump = require('../03_Problems/solutions/06_jump_game_vi');
  it('stock span: equal prices extend the span', () => {
    const s = new span.StockSpanner();
    assert.deepEqual([5, 5, 5, 4, 6].map((p) => s.next(p)), [1, 2, 3, 1, 5]);
  });
  it('shortest unsorted subarray: sorted, reversed, duplicates, all variants agree', () => {
    assert.equal(unsorted.optimal([1, 2, 3]), 0);
    assert.equal(unsorted.optimal([3, 2, 1]), 3);
    assert.equal(unsorted.optimal([1, 3, 2, 2, 2]), 4);
    const rnd = mulberry32(581);
    for (let t = 0; t < 200; t++) {
      const a = randArr(rnd, Math.floor(rnd() * 12), 0, 5);
      assert.equal(unsorted.optimal(a), unsorted.bruteForce(a));
      assert.equal(unsorted.withStack(a), unsorted.bruteForce(a));
    }
  });
  it('sum of subarray minimums handles duplicates (no double counting)', () => {
    assert.equal(summin.optimal([2, 2]), 6);
    const rnd = mulberry32(907);
    for (let t = 0; t < 200; t++) {
      const a = randArr(rnd, 1 + Math.floor(rnd() * 15), 1, 5);
      assert.equal(summin.optimal(a), summin.bruteForce(a));
    }
  });
  it('maximal rectangle: empty matrix, all zeros, all ones', () => {
    assert.equal(maxrect.optimal([]), 0);
    assert.equal(maxrect.optimal([['0', '0']]), 0);
    assert.equal(maxrect.optimal([['1', '1'], ['1', '1']]), 4);
  });
  it('jump game VI: single element, all negative middle values', () => {
    assert.equal(jump.optimal([7], 3), 7);
    assert.equal(jump.optimal([1, -5, -5, 2], 3), 3);
    const rnd = mulberry32(1696);
    for (let t = 0; t < 200; t++) {
      const a = randArr(rnd, 1 + Math.floor(rnd() * 12), -10, 10), k = 1 + Math.floor(rnd() * 4);
      assert.equal(jump.optimal(a, k), jump.bruteForce(a, k));
    }
  });
});
