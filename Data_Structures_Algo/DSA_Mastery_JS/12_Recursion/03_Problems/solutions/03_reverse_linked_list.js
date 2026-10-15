/**
 * 03. Reverse Linked List (recursive)   (LeetCode 206 — Easy)
 *
 * PROBLEM
 * Given the head of a singly linked list, reverse the list and return the new head.
 * Here we focus on the recursive version: trust the call to reverse "the rest".
 *
 * EXAMPLES
 * 1 -> 2 -> 3 -> 4 -> 5   =>   5 -> 4 -> 3 -> 2 -> 1
 * 1 -> 2                  =>   2 -> 1
 * (empty)                 =>   (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 5000 nodes (recursion depth 5000 is fine in Node; 10^6 would not be)
 * - Reverse in place, or may we allocate new nodes? (in place)
 *
 * APPROACH 1 — Brute force (copy values out, write them back)   O(n) time, O(n) space
 * Walk the list collecting values into an array, then walk again writing them back
 * in reverse order. Works, but uses an extra array and does not move pointers.
 *
 * APPROACH 2 — Optimal (recursion)   O(n) time, O(n) stack space
 * PROMISE: reverse(head) reverses the list starting at head and returns its new head.
 *   base: empty list or single node is already reversed -> return head
 *   step: newHead = reverse(head.next). Now head.next is the TAIL of the reversed rest.
 *         Hook head after it: head.next.next = head; and cut head.next = null.
 *   return newHead (it never changes on the way back up).
 * (The iterative three-pointer version is O(1) space — mention it as the follow-up.)
 *
 * Dry run on 1 -> 2 -> 3:
 *   reverse(1) calls reverse(2) calls reverse(3) -> base, returns 3
 *   back in reverse(2): 2.next is 3; set 3.next = 2, 2.next = null   => 3 -> 2
 *   back in reverse(1): 1.next is 2; set 2.next = 1, 1.next = null   => 3 -> 2 -> 1
 *   return 3
 *
 * EDGE CASES
 * - empty list -> null;  one node -> same node
 * - forgetting head.next = null creates a 2-cycle between the first two nodes
 */

class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const out = []; for (; h; h = h.next) out.push(h.val); return out; };

function bruteForce(head) {
  const values = toArray(head);
  let node = head;
  for (let i = values.length - 1; i >= 0; i--, node = node.next) node.val = values[i];
  return head;
}

function optimal(head) {
  if (head === null || head.next === null) return head; // already reversed
  const newHead = optimal(head.next);  // rest reversed; head.next is now its tail
  head.next.next = head;               // put head after that tail
  head.next = null;                    // head is the new tail
  return newHead;
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(toArray(optimal(fromArray([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);
assert.deepStrictEqual(toArray(optimal(fromArray([1, 2]))), [2, 1]);
assert.strictEqual(optimal(null), null);
assert.deepStrictEqual(toArray(optimal(fromArray([7]))), [7]);
assert.deepStrictEqual(toArray(optimal(fromArray([1, 1, 2, 2]))), [2, 2, 1, 1]);
assert.strictEqual(toArray(optimal(fromArray(Array.from({ length: 5000 }, (_, i) => i))))[0], 4999);
let seed = 7;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 200; t++) {
  const arr = Array.from({ length: Math.floor(rnd() * 20) }, () => Math.floor(rnd() * 100));
  assert.deepStrictEqual(toArray(optimal(fromArray(arr))), toArray(bruteForce(fromArray(arr))));
}
console.log('✓ 03_reverse_linked_list passed');

module.exports = { optimal, bruteForce, ListNode, fromArray, toArray };
