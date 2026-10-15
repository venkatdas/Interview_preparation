/**
 * 08. Find Median from Data Stream   (LeetCode 295 — Hard)
 *
 * PROBLEM
 * Build a MedianFinder with addNum(num) and findMedian(). findMedian returns the middle value
 * of all numbers added so far; with an even count it returns the mean of the two middle values.
 *
 * EXAMPLES
 * addNum(1) addNum(2) findMedian() -> 1.5
 * addNum(3)           findMedian() -> 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - findMedian is only called after at least one add.
 * - Up to 5 * 10^4 calls; values may be negative.
 * - Follow-ups: all values in 0..100? (counting array, O(100) per query) ; 99% in 0..100?
 *   (counting array + two overflow counters/heaps).
 *
 * APPROACH 1 — Brute force (keep a sorted array)   O(n) add, O(1) median, O(n) space
 * Binary-search the insert position and splice. The splice shifts up to n elements.
 *
 * APPROACH 2 — Optimal (two heaps)   O(log n) add, O(1) median, O(n) space
 * low  = MAX-heap of the smaller half, high = MIN-heap of the larger half.
 * Keep |low| = |high| or |low| = |high| + 1. Median = top of low, or the mean of both tops.
 * add(x): push to low, move low's max to high (keeps "every low <= every high"),
 *         if high became bigger, move high's min back to low.
 *
 * Dry run, adds 5, 15, 1, 3:
 *   add  low(max)   high(min)   median
 *   5    [5]        []          5
 *   15   [5]        [15]        10
 *   1    [5,1]      [15]        5
 *   3    [3,1]      [5,15]      4      (3 into low, 5 moved up to high, sizes 2/2)
 *
 * EDGE CASES
 * - one element -> that element
 * - duplicates and negatives
 * - even count -> average, may be fractional
 */

const { StreamingMedian } = require('../../02_Implementations/streaming.js');

function bruteForce() {
  const sorted = [];
  return {
    addNum(num) {
      let lo = 0, hi = sorted.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] < num) lo = mid + 1; else hi = mid; }
      sorted.splice(lo, 0, num);
    },
    findMedian() {
      const n = sorted.length;
      return n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    },
  };
}

function optimal() {
  const sm = new StreamingMedian();
  return {
    addNum(num) { sm.add(num); },
    findMedian() { return sm.median(); },
  };
}

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const m = make();
  m.addNum(1); m.addNum(2);
  assert.strictEqual(m.findMedian(), 1.5);
  m.addNum(3);
  assert.strictEqual(m.findMedian(), 2);
  const d = make();
  [5, 15, 1, 3].forEach(x => d.addNum(x));
  assert.strictEqual(d.findMedian(), 4);
  const one = make(); one.addNum(-7);
  assert.strictEqual(one.findMedian(), -7);
  const dup = make(); [2, 2, 2, 2].forEach(x => dup.addNum(x));
  assert.strictEqual(dup.findMedian(), 2);
  const neg = make(); [-1, -2].forEach(x => neg.addNum(x));
  assert.strictEqual(neg.findMedian(), -1.5);
}
let s = 33;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 50; t++) {
  const a = bruteForce(), b = optimal();
  for (let i = 0; i < 80; i++) {
    const x = Math.floor(rnd() * 100) - 50;
    a.addNum(x); b.addNum(x);
    assert.strictEqual(a.findMedian(), b.findMedian());
  }
}
console.log('✓ 08_find_median_from_data_stream passed');

module.exports = { optimal, bruteForce };
