/**
 * 18. Merge k Sorted Lists   (LeetCode 23 — Hard)
 *
 * PROBLEM
 * You are given an array of k linked lists, each sorted ascending. Merge all
 * of them into one sorted linked list and return its head.
 *
 * EXAMPLES
 * Input: [1->4->5, 1->3->4, 2->6]   Output: 1->1->2->3->4->4->5->6
 * Input: []                         Output: (empty)
 * Input: [ (empty) ]                Output: (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can lists be empty / can the array be empty? (yes, both)
 * - What are k and N (total nodes)? (complexity is discussed in terms of both)
 *
 * APPROACH 1 — Brute force (collect and sort)   O(N log N) time, O(N) space
 * Dump every value into one array, sort it, rebuild a list. Ignores the fact
 * that each list is already sorted.
 *
 * APPROACH 1b — Merge one by one   O(N * k) time
 * Merge list 1 with list 2, then with list 3... The growing result is
 * re-walked for every list, so this is slow when k is large.
 *
 * APPROACH 2 — Optimal A (divide & conquer)   O(N log k) time, O(log k) stack
 * Pair the lists up and merge each pair (using Merge Two Sorted Lists), halving
 * the number of lists each round. log k rounds, each touching all N nodes.
 *
 *   round 0: [A, B, C, D]
 *   round 1: [merge(A,B), merge(C,D)]
 *   round 2: [merge(AB, CD)]
 *
 * APPROACH 3 — Optimal B (min-heap of list heads)   O(N log k) time, O(k) space
 * Keep the current head of every list in a min-heap keyed by value. Pop the
 * smallest, append it to the result, push that list's next node. Every node
 * enters and leaves the heap once -> N * log k. We implement a tiny binary heap
 * inline (full heap theory lives in 19_Heaps_And_Priority_Queues).
 *
 * Dry run (heap) on [1->4, 1->3, 2]:
 *   heap {1,1,2}  pop 1 (list A) push 4 -> {1,2,4}   result 1
 *   pop 1 (B) push 3 -> {2,3,4}                      result 1 1
 *   pop 2 (C) nothing to push -> {3,4}               result 1 1 2
 *   pop 3, pop 4                                     result 1 1 2 3 4
 *
 * EDGE CASES
 * - empty array, array of empty lists
 * - a single list -> return it
 * - lists of very different lengths
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(lists) {
  const values = lists.flatMap((head) => toArray(head)).sort((a, b) => a - b);
  return toList(values);
}

function mergeTwo(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}

function optimal(lists) {
  if (lists.length === 0) return null;
  let current = lists;
  while (current.length > 1) {
    const merged = [];
    for (let i = 0; i < current.length; i += 2) {
      const left = current[i];
      const right = i + 1 < current.length ? current[i + 1] : null;
      merged.push(mergeTwo(left, right));
    }
    current = merged;
  }
  return current[0];
}

// ---- tiny min-heap keyed on node.val ----
class MinHeap {
  constructor() { this.items = []; }
  size() { return this.items.length; }
  push(node) {
    this.items.push(node);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.items[parent].val <= this.items[i].val) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
      i = parent;
    }
  }
  pop() {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < this.items.length && this.items[left].val < this.items[smallest].val) smallest = left;
        if (right < this.items.length && this.items[right].val < this.items[smallest].val) smallest = right;
        if (smallest === i) break;
        [this.items[smallest], this.items[i]] = [this.items[i], this.items[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

function withHeap(lists) {
  const heap = new MinHeap();
  for (const head of lists) if (head) heap.push(head);

  const dummy = new ListNode(0);
  let tail = dummy;
  while (heap.size() > 0) {
    const smallest = heap.pop();
    tail.next = smallest;
    tail = tail.next;
    if (smallest.next) heap.push(smallest.next);
  }
  return dummy.next;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, withHeap]) {
  const run = (arrays) => toArray(solve(arrays.map(toList)));
  assert.deepStrictEqual(run([[1, 4, 5], [1, 3, 4], [2, 6]]), [1, 1, 2, 3, 4, 4, 5, 6]);
  assert.deepStrictEqual(run([]), []);
  assert.deepStrictEqual(run([[]]), []);
  assert.deepStrictEqual(run([[], []]), []);
  assert.deepStrictEqual(run([[7]]), [7]);
  assert.deepStrictEqual(run([[1], [0]]), [0, 1]);
  assert.deepStrictEqual(run([[-2, 5], [], [-3, -3, 10], [1]]), [-3, -3, -2, 1, 5, 10]);
  assert.deepStrictEqual(run([[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]]), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
}
console.log('✓ 18-merge-k-sorted-lists passed');

module.exports = { optimal, bruteForce, withHeap };
