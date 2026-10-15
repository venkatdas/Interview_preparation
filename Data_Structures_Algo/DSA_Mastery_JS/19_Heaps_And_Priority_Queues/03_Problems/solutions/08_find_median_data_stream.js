/**
 * 08. Find Median from Data Stream   (LeetCode 295 — Hard)
 *
 * PROBLEM
 * Design a class MedianFinder with addNum(num) and findMedian(). The median is
 * the middle value of all numbers added so far (average of the two middles when
 * the count is even).
 *
 * EXAMPLES
 * addNum(1), addNum(2), findMedian() -> 1.5
 * addNum(3), findMedian()            -> 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 5 * 10^4 calls -> O(n) per findMedian is too slow if called often
 * - Values in a small range? (if 0..100, a counting array works - the follow-up)
 * - findMedian never called on an empty stream? (assume at least one number)
 *
 * APPROACH 1 — Brute force   O(n log n) per findMedian, O(n) space
 * Keep an array; sort it every time the median is requested.
 * (Or keep it sorted with binary-search insert: O(n) per add because of shifting.)
 *
 * APPROACH 2 — Optimal (two heaps)   O(log n) add, O(1) findMedian, O(n) space
 * Split the numbers into two halves:
 *   low  = MAX-heap of the smaller half  (top = largest of the small numbers)
 *   high = MIN-heap of the larger half   (top = smallest of the large numbers)
 * Invariants:
 *   1. every number in low <= every number in high
 *   2. low.size === high.size  or  low.size === high.size + 1
 * Then the median is low.top (odd count) or (low.top + high.top) / 2 (even).
 *
 * addNum(x): always push to low first, then move low's max to high (this
 * guarantees invariant 1 with no comparisons). If high is now bigger than
 * low, move high's min back to low (invariant 2). Two or three heap ops total.
 *
 * Dry run: add 1, 2, 3
 *   add 1: low={1} -> move 1 to high: low={}, high={1} -> high bigger -> move back: low={1}, high={}
 *   add 2: low={1,2} -> move 2 to high: low={1}, high={2}; sizes equal  -> median (1+2)/2 = 1.5
 *   add 3: low={1,3} -> move 3 to high: low={1}, high={2,3} -> high bigger -> move 2 back:
 *          low={1,2}, high={3}  -> median = low.top = 2
 *
 * EDGE CASES
 * - single number -> that number
 * - duplicates
 * - negative numbers
 * - descending input (the "always push to low first" trick keeps it correct)
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

class MedianFinderBrute {
  constructor() {
    this.nums = [];
  }
  addNum(num) {
    this.nums.push(num);
  }
  findMedian() {
    const sorted = [...this.nums].sort((a, b) => a - b);
    const mid = sorted.length >> 1;
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

class MedianFinder {
  constructor() {
    this.low = new MinHeap((a, b) => b - a); // max-heap: smaller half
    this.high = new MinHeap(); // min-heap: larger half
  }
  addNum(num) {
    this.low.push(num);
    this.high.push(this.low.pop()); // the largest of the small side crosses over
    if (this.high.size() > this.low.size()) {
      this.low.push(this.high.pop()); // rebalance so low has the extra element
    }
  }
  findMedian() {
    if (this.low.size() > this.high.size()) return this.low.peek();
    return (this.low.peek() + this.high.peek()) / 2;
  }
}

// helper: feed a sequence and record the median after each add
function bruteForce(nums) {
  const finder = new MedianFinderBrute();
  return nums.map((n) => (finder.addNum(n), finder.findMedian()));
}

function optimal(nums) {
  const finder = new MedianFinder();
  return nums.map((n) => (finder.addNum(n), finder.findMedian()));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3]), [1, 1.5, 2]);
  assert.deepStrictEqual(solve([5]), [5]);
  assert.deepStrictEqual(solve([5, 5, 5]), [5, 5, 5]);
  assert.deepStrictEqual(solve([-1, -2, -3, -4]), [-1, -1.5, -2, -2.5]);
  assert.deepStrictEqual(solve([6, 10, 2, 6, 5, 0]), [6, 8, 6, 6, 6, 5.5]);
}
// random cross-check
for (let round = 0; round < 30; round++) {
  const nums = Array.from({ length: 1 + Math.floor(Math.random() * 40) }, () => Math.floor(Math.random() * 50) - 25);
  assert.deepStrictEqual(optimal(nums), bruteForce(nums));
}
console.log('✓ 08-find-median-data-stream passed');

module.exports = { optimal, bruteForce, MedianFinder };
