/**
 * 12. Minimum Cost to Connect Sticks   (LeetCode 1167 — Medium)
 *
 * PROBLEM
 * You have sticks with given lengths. Connecting two sticks of lengths x and y
 * costs x + y and produces one stick of length x + y. Connect all sticks into
 * one; return the minimum total cost.
 *
 * EXAMPLES
 * Input: [2,4,3]       Output: 14   Explanation: 2+3=5 (cost 5), 5+4=9 (cost 9), total 14
 * Input: [1,8,3,5]     Output: 30   Explanation: 1+3=4, 4+5=9, 9+8=17 -> 4+9+17 = 30
 * Input: [5]           Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Single stick -> 0 (nothing to connect). Empty -> 0.
 * - Why not just sort once? (the merged stick's length changes the order)
 *
 * APPROACH 1 — Brute force (re-sort each step)   O(n^2 log n) time, O(n) space
 * Each step: sort, take the two smallest, push their sum back. The greedy
 * choice is the same as the optimal; only the data structure is slow.
 *
 * APPROACH 2 — Optimal (min-heap, Huffman-style greedy)   O(n log n) time, O(n) space
 * A stick joined early gets counted in every later merge, so the SMALLEST
 * sticks should be merged first and the biggest as late as possible. That is
 * exactly Huffman coding. Heapify all sticks; while more than one: pop two
 * smallest, add their sum to the cost, push the sum.
 *
 * Dry run on [1,8,3,5]:
 *   heap {1,3,5,8}: pop 1,3 -> cost 4,  push 4   -> {4,5,8}
 *   pop 4,5 -> cost 4+9 = 13, push 9           -> {8,9}
 *   pop 8,9 -> cost 13+17 = 30, push 17        -> {17}
 *   one left -> 30
 *
 * EDGE CASES
 * - [] or [x] -> 0
 * - two sticks -> their sum
 * - many equal sticks
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function bruteForce(sticks) {
  const arr = [...sticks];
  let cost = 0;
  while (arr.length > 1) {
    arr.sort((a, b) => a - b);
    const joined = arr.shift() + arr.shift();
    cost += joined;
    arr.push(joined);
  }
  return cost;
}

function optimal(sticks) {
  const heap = MinHeap.from(sticks);
  let cost = 0;
  while (heap.size() > 1) {
    const joined = heap.pop() + heap.pop(); // two smallest
    cost += joined;
    heap.push(joined); // the new stick competes with the rest
  }
  return cost;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 4, 3]), 14);
  assert.strictEqual(solve([1, 8, 3, 5]), 30);
  assert.strictEqual(solve([5]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([3, 4]), 7);
  assert.strictEqual(solve([1, 1, 1, 1]), 8);
}
console.log('✓ 12-min-cost-connect-sticks passed');

module.exports = { optimal, bruteForce };
