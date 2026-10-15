/**
 * 12. Sort List   (LeetCode 148 — Medium)
 *
 * PROBLEM
 * Given the head of a singly linked list, return the list sorted ascending.
 * Follow-up: O(n log n) time and O(1) extra memory (ignoring recursion stack).
 *
 * EXAMPLES
 * Input: 4 -> 2 -> 1 -> 3          Output: 1 -> 2 -> 3 -> 4
 * Input: -1 -> 5 -> 3 -> 4 -> 0    Output: -1 -> 0 -> 3 -> 4 -> 5
 * Input: (empty)                   Output: (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 5 * 10^4, values can be negative
 * - Singly linked: no random access, so quick sort / heap sort are awkward -> merge sort
 * - May I create new nodes? (better to relink the existing ones)
 *
 * APPROACH 1 — Brute force   O(n log n) time, O(n) space
 * Copy the values into an array, sort the array, write the values back into the nodes.
 * Works, but misses the point (an interviewer wants the list manipulation).
 *
 * APPROACH 2 — Optimal (top-down merge sort on the list)   O(n log n) time, O(log n) stack
 *   1. base case: 0 or 1 node -> already sorted
 *   2. find the middle with slow/fast pointers (fast moves 2, slow moves 1), cut the list
 *   3. sort both halves recursively
 *   4. merge two sorted lists with a dummy head (see 15_Linked_Lists)
 * Recursion depth is log n (~16 for 5 * 10^4), so the stack is safe.
 * (The true O(1)-space version is bottom-up: merge runs of size 1, 2, 4, ... iteratively.)
 *
 * Dry run 4 -> 2 -> 1 -> 3:
 *   split: slow stops at 2 -> left 4->2, right 1->3
 *   sort left: split 4 | 2 -> merge -> 2->4
 *   sort right: split 1 | 3 -> merge -> 1->3
 *   merge 2->4 with 1->3: 1, 2, 3, 4
 *
 * EDGE CASES
 * - empty list, single node
 * - two nodes (the split must put exactly one in each half or you recurse forever)
 * - duplicates, negatives, already sorted
 */

// tiny local ListNode so this file is self-contained
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function fromArray(values) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of values) { tail.next = new ListNode(v); tail = tail.next; }
  return dummy.next;
}

function toArray(head) {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
}

function bruteForce(head) {
  const values = toArray(head).sort((a, b) => a - b);
  let node = head;
  for (const v of values) { node.val = v; node = node.next; }
  return head;
}

function optimal(head) {
  if (!head || !head.next) return head;              // 0 or 1 node

  // 1. split: slow ends on the last node of the first half
  let slow = head, fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const secondHalf = slow.next;
  slow.next = null;                                  // cut the list in two

  // 2. sort each half (trust the function)
  const left = optimal(head);
  const right = optimal(secondHalf);

  // 3. merge two sorted lists
  return mergeLists(left, right);
}

function mergeLists(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }   // <= keeps it stable
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;                                    // append whatever is left
  return dummy.next;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(fromArray([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepStrictEqual(toArray(solve(fromArray([-1, 5, 3, 4, 0]))), [-1, 0, 3, 4, 5]);
  assert.deepStrictEqual(toArray(solve(fromArray([]))), []);
  assert.deepStrictEqual(toArray(solve(fromArray([1]))), [1]);
  assert.deepStrictEqual(toArray(solve(fromArray([2, 1]))), [1, 2]);
  assert.deepStrictEqual(toArray(solve(fromArray([3, 3, 1, 3]))), [1, 3, 3, 3]);
  assert.deepStrictEqual(toArray(solve(fromArray([1, 2, 3, 4, 5]))), [1, 2, 3, 4, 5]);
}
const big = Array.from({ length: 50000 }, () => Math.floor(Math.random() * 200001) - 100000);
assert.deepStrictEqual(toArray(optimal(fromArray(big))), [...big].sort((a, b) => a - b));
console.log('✓ 12-sort-list passed');

module.exports = { optimal, bruteForce, ListNode, fromArray, toArray };
