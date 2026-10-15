/**
 * 03. Kth Largest Element in a Stream   (LeetCode 703 — Easy)
 *
 * PROBLEM
 * Build a class from k and an initial array of numbers. Each add(val) inserts a number
 * and returns the k-th largest number seen so far (k-th in sorted order, duplicates count).
 *
 * EXAMPLES
 * k = 3, nums = [4,5,8,2]
 * add(3)  -> 4     all: 2 3 4 5 8 -> 3rd largest 4
 * add(5)  -> 5     2 3 4 5 5 8
 * add(10) -> 5     2 3 4 5 5 8 10
 * add(9)  -> 8
 * add(4)  -> 8
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Initial array may have fewer than k elements (guaranteed >= k after the first add).
 * - Values may be negative and repeated.
 *
 * APPROACH 1 — Brute force   O(n log n) per add, O(n) space
 * Keep all numbers; on each add sort descending and return index k-1.
 *
 * APPROACH 2 — Optimal (min-heap of size k)   O(log k) per add, O(k) space
 * Keep ONLY the k largest values in a min-heap. Its top is the smallest of the top-k, i.e.
 * the k-th largest overall. A new value smaller than the top can never be in the top-k,
 * so the heap never needs more than k items.
 *
 * Dry run, k = 3, start [4,5,8,2]:
 *   push 4,5,8 -> heap {4,5,8}; push 2 -> size 4 > 3, pop 2 -> {4,5,8}
 *   add(3):  push 3 -> {3,4,5,8}, pop 3 -> top 4        return 4
 *   add(5):  push 5 -> {4,5,5,8}, pop 4 -> top 5        return 5
 *   add(10): push -> pop 5 -> {5,8,10}                  return 5
 *   add(9):  push -> pop 5 -> {8,9,10}                  return 8
 *   add(4):  push -> pop 4 -> {8,9,10}                  return 8
 *
 * EDGE CASES
 * - k = 1 -> running maximum
 * - initial array empty
 * - duplicates of the k-th value
 */

const { MinHeap } = require('../../02_Implementations/streaming.js');

function bruteForce(k, nums) {
  const all = [...nums];
  return {
    add(val) {
      all.push(val);
      return [...all].sort((a, b) => b - a)[k - 1];
    },
  };
}

function optimal(k, nums) {
  const heap = new MinHeap();
  const add = (val) => {
    heap.push(val);
    if (heap.size() > k) heap.pop();     // drop the smallest: it is not in the top k
    return heap.peek();
  };
  for (const x of nums) add(x);
  return { add };
}

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const kl = make(3, [4, 5, 8, 2]);
  assert.deepStrictEqual([3, 5, 10, 9, 4].map(v => kl.add(v)), [4, 5, 5, 8, 8]);
  const one = make(1, []);
  assert.deepStrictEqual([-3, -2, -4, 0].map(v => one.add(v)), [-3, -2, -2, 0]);
  const short = make(2, [0]);
  assert.deepStrictEqual([-1, 1, -2, -4, 3].map(v => short.add(v)), [-1, 0, 0, 0, 1]);
  const dup = make(2, [5, 5, 5]);
  assert.strictEqual(dup.add(1), 5);
}
let s = 11;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 50; t++) {
  const k = 1 + Math.floor(rnd() * 5);
  const init = Array.from({ length: Math.max(0, k - 1 + Math.floor(rnd() * 4)) }, () => Math.floor(rnd() * 50));
  const a = bruteForce(k, init), b = optimal(k, init);
  for (let i = 0; i < 30; i++) {
    const v = Math.floor(rnd() * 100) - 50;
    assert.strictEqual(a.add(v), b.add(v));
  }
}
console.log('✓ 03_kth_largest_in_a_stream passed');

module.exports = { optimal, bruteForce };
