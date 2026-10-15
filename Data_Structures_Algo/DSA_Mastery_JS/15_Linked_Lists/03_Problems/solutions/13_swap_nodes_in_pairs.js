/**
 * 13. Swap Nodes in Pairs   (LeetCode 24 — Medium)
 *
 * PROBLEM
 * Given a linked list, swap every two adjacent NODES and return the head.
 * You must swap the nodes themselves, not just their values.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 3 -> 4   Output: 2 -> 1 -> 4 -> 3
 * Input: 1 -> 2 -> 3        Output: 2 -> 1 -> 3   Explanation: the odd one out stays
 * Input: 1                  Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I just swap values? (interviewers usually say NO - practice the pointers)
 * - Odd length: leave the last node alone? (yes)
 *
 * APPROACH 1 — Brute force (swap values)   O(n) time, O(1) space
 * Walk in steps of two and swap node.val with node.next.val. Simple, but not
 * allowed when the question says "swap nodes".
 *
 * APPROACH 2 — Optimal (dummy + rewire 3 pointers per pair)   O(n) time, O(1) space
 * Use prev (starts at dummy), first = prev.next, second = first.next.
 *   prev.next   = second    (prev now points at the second node)
 *   first.next  = second.next  (first jumps over second to the rest)
 *   second.next = first     (second points back at first)
 *   prev = first            (first is now the last node of the swapped pair)
 *
 * Dry run on 1 -> 2 -> 3 -> 4:
 *   dummy -> 1 -> 2 -> 3 -> 4       prev=dummy first=1 second=2
 *   dummy -> 2 -> 1 -> 3 -> 4       prev=1
 *   first=3 second=4
 *   dummy -> 2 -> 1 -> 4 -> 3       prev=3, prev.next=null -> stop
 *   return dummy.next = 2
 *
 * APPROACH 3 — Recursive   O(n) time, O(n) stack
 * swap(head): second = head.next; head.next = swap(second.next); second.next = head; return second.
 *
 * EDGE CASES
 * - empty, one node
 * - odd length (last node untouched)
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  for (let node = head; node && node.next; node = node.next.next) {
    [node.val, node.next.val] = [node.next.val, node.val];
  }
  return head;
}

function optimal(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;

  while (prev.next && prev.next.next) {
    const first = prev.next;
    const second = first.next;

    prev.next = second;         // step 1
    first.next = second.next;   // step 2
    second.next = first;        // step 3

    prev = first;               // first is now at the back of the pair
  }
  return dummy.next;
}

function recursive(head) {
  if (!head || !head.next) return head;
  const second = head.next;
  head.next = recursive(second.next); // the rest, already swapped
  second.next = head;
  return second;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, recursive]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4]))), [2, 1, 4, 3]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]))), [2, 1, 3]);
  assert.deepStrictEqual(toArray(solve(toList([1]))), [1]);
  assert.deepStrictEqual(toArray(solve(toList([]))), []);
  assert.deepStrictEqual(toArray(solve(toList([1, 2]))), [2, 1]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5, 6]))), [2, 1, 4, 3, 6, 5]);
}
// optimal really moves nodes: the original first node is now in position 2
const list = toList([1, 2]);
const firstNode = list;
assert.strictEqual(optimal(list).next, firstNode);
console.log('✓ 13-swap-nodes-in-pairs passed');

module.exports = { optimal, bruteForce, recursive };
