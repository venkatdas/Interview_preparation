/**
 * 07. Merge k Sorted Lists   (LeetCode 23 — Hard)
 *
 * PROBLEM
 * You are given an array of k linked lists, each sorted ascending. Merge them
 * into one sorted linked list and return its head.
 *
 * EXAMPLES
 * Input: [[1,4,5],[1,3,4],[2,6]]   Output: [1,1,2,3,4,4,5,6]
 * Input: []                        Output: []
 * Input: [[]]                      Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - k up to 10^4, total nodes N up to 10^4 * 500 -> need N log k
 * - Lists can be null/empty
 * - Should I reuse nodes or create new ones? (reuse: relink the existing nodes)
 *
 * APPROACH 1 — Brute force (collect + sort)   O(N log N) time, O(N) space
 * Walk every list, push all values into an array, sort, rebuild a list.
 * Ignores the fact that each list is already sorted.
 *
 * APPROACH 2 — Optimal (k-way merge with a min-heap)   O(N log k) time, O(k) space
 * At any moment the next smallest node overall is the smallest among the
 * CURRENT HEADS of the k lists. Keep those heads in a min-heap (size <= k):
 *   1. push the head of every non-empty list
 *   2. pop the smallest, append it to the result
 *   3. if the popped node has a next, push that next (same list's new head)
 * Each of the N nodes is pushed and popped once at O(log k).
 *
 * Dry run on [[1,4,5],[1,3,4],[2,6]]:
 *   heap = {1(a),1(b),2(c)}  pop 1(a) -> push 4(a)   result 1
 *   heap = {1(b),2(c),4(a)}  pop 1(b) -> push 3(b)   result 1,1
 *   heap = {2(c),3(b),4(a)}  pop 2(c) -> push 6(c)   result 1,1,2
 *   heap = {3(b),4(a),6(c)}  pop 3(b) -> push 4(b)   result 1,1,2,3
 *   heap = {4(a),4(b),6(c)}  pop 4(a) -> push 5(a)   ...
 *   ... continues until the heap is empty -> 1,1,2,3,4,4,5,6
 *
 * (Alternative with the same complexity: divide and conquer, merge pairs of
 * lists like merge sort.)
 *
 * EDGE CASES
 * - lists = [] or all lists empty -> null
 * - a single list -> return it unchanged
 * - duplicate values across lists
 * - negative values
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

// local ListNode (the linked-list folder has the full version)
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function fromArray(values) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
}

function toArray(head) {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
}

function bruteForce(lists) {
  const values = [];
  for (const head of lists) {
    for (let node = head; node; node = node.next) values.push(node.val);
  }
  values.sort((a, b) => a - b);
  return fromArray(values);
}

function optimal(lists) {
  const heap = new MinHeap((a, b) => a.val - b.val); // holds at most k nodes
  for (const head of lists) {
    if (head) heap.push(head);
  }

  const dummy = new ListNode(0); // dummy head avoids special-casing the first node
  let tail = dummy;
  while (!heap.isEmpty()) {
    const smallest = heap.pop();
    tail.next = smallest; // relink the existing node
    tail = smallest;
    if (smallest.next) heap.push(smallest.next); // advance that list
  }
  tail.next = null;
  return dummy.next;
}

// ---------- tests ----------
const assert = require('assert');
const build = (arrays) => arrays.map(fromArray);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(build([[1, 4, 5], [1, 3, 4], [2, 6]]))), [1, 1, 2, 3, 4, 4, 5, 6]);
  assert.deepStrictEqual(toArray(solve(build([]))), []);
  assert.deepStrictEqual(toArray(solve(build([[]]))), []);
  assert.deepStrictEqual(toArray(solve(build([[], [], [7]]))), [7]);
  assert.deepStrictEqual(toArray(solve(build([[-3, -1], [-2, 0]]))), [-3, -2, -1, 0]);
  assert.deepStrictEqual(toArray(solve(build([[2, 2], [2]]))), [2, 2, 2]);
}
console.log('✓ 07-merge-k-sorted-lists passed');

module.exports = { optimal, bruteForce, ListNode, fromArray, toArray };
