/**
 * 03. Last Stone Weight   (LeetCode 1046 — Easy)
 *
 * PROBLEM
 * You have stones with positive weights. Each turn, take the two HEAVIEST
 * stones x <= y and smash them: if x === y both are destroyed, otherwise the
 * stone of weight y - x remains. Return the weight of the last stone, or 0 if
 * none remain.
 *
 * EXAMPLES
 * Input: [2,7,4,1,8,1]  Output: 1
 *   Explanation: 8&7 -> 1, [2,4,1,1,1]; 4&2 -> 2, [2,1,1,1]; 2&1 -> 1, [1,1,1];
 *                1&1 -> 0, [1]; answer 1
 * Input: [1]            Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Weights positive? (yes, 1..1000) Count? (<= 30, but do it well anyway)
 * - Empty input? (return 0)
 *
 * APPROACH 1 — Brute force   O(n^2 log n) time, O(n) space
 * Every turn sort the array, pop the two largest, push the difference back.
 * Up to n turns, each sorting -> n * n log n.
 *
 * APPROACH 2 — Optimal (max-heap simulation)   O(n log n) time, O(n) space
 * "Repeatedly take the largest" is the signal for a max-heap. Heapify once,
 * then while more than one stone: pop y, pop x, if y !== x push y - x.
 * Each turn costs O(log n) and removes at least one stone.
 *
 * Dry run on [2,7,4,1,8,1]:
 *   heap(max) -> pop 8, pop 7, push 1   -> {4,2,1,1,1}
 *   pop 4, pop 2, push 2                -> {2,1,1,1}
 *   pop 2, pop 1, push 1                -> {1,1,1}
 *   pop 1, pop 1, equal, push nothing   -> {1}
 *   one left -> 1
 *
 * EDGE CASES
 * - [] -> 0
 * - all equal pairs cancel to 0, e.g. [3,3] -> 0
 * - single stone -> itself
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function bruteForce(stones) {
  const arr = [...stones];
  while (arr.length > 1) {
    arr.sort((a, b) => a - b);
    const y = arr.pop();
    const x = arr.pop();
    if (y !== x) arr.push(y - x);
  }
  return arr.length ? arr[0] : 0;
}

function optimal(stones) {
  const maxHeap = MinHeap.from(stones, (a, b) => b - a); // comparator flips it to a max-heap
  while (maxHeap.size() > 1) {
    const heaviest = maxHeap.pop();
    const second = maxHeap.pop();
    if (heaviest !== second) maxHeap.push(heaviest - second);
  }
  return maxHeap.isEmpty() ? 0 : maxHeap.peek();
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 7, 4, 1, 8, 1]), 1);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([3, 3]), 0);
  assert.strictEqual(solve([10, 4, 2]), 4);
  assert.strictEqual(solve([1, 1, 1, 1, 1]), 1);
}
console.log('✓ 03-last-stone-weight passed');

module.exports = { optimal, bruteForce };
