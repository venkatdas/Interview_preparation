/**
 * 06. Swap Nodes in Pairs   (LeetCode 24 — Medium)
 *
 * PROBLEM
 * Given a linked list, swap every two adjacent nodes and return the new head.
 * Swap the NODES themselves (relink pointers), do not just swap their values.
 *
 * EXAMPLES
 * 1->2->3->4   =>   2->1->4->3
 * 1->2->3      =>   2->1->3       (odd one out stays)
 * (empty)      =>   (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0..100 nodes
 * - Must nodes move, or can values be swapped? (nodes must move)
 *
 * APPROACH 1 — Brute force (array of nodes, relink)   O(n) time, O(n) space
 * Put every node into an array, swap entries i and i+1 for even i, then relink the
 * array in order. Simple but uses O(n) extra memory.
 *
 * APPROACH 2 — Optimal (recursion on pairs)   O(n) time, O(n/2) stack
 * PROMISE: swapPairs(head) swaps pairs in the list starting at head, returns new head.
 *   base: fewer than two nodes -> nothing to swap -> return head
 *   step: first = head, second = head.next.
 *         first.next = swapPairs(second.next)   // trust the rest
 *         second.next = first
 *         return second
 * (Iterative with a dummy node gets O(1) space.)
 *
 * Dry run 1->2->3->4:
 *   swap(1): first=1, second=2, 1.next = swap(3)
 *     swap(3): first=3, second=4, 3.next = swap(null) = null, 4.next = 3, return 4
 *   1.next = 4 (4->3), 2.next = 1, return 2   => 2->1->4->3
 *
 * EDGE CASES
 * - empty list / single node
 * - odd length: last node stays where it is
 */

class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const out = []; for (; h; h = h.next) out.push(h.val); return out; };

function bruteForce(head) {
  const nodes = [];
  for (let n = head; n; n = n.next) nodes.push(n);
  for (let i = 0; i + 1 < nodes.length; i += 2) [nodes[i], nodes[i + 1]] = [nodes[i + 1], nodes[i]];
  for (let i = 0; i < nodes.length; i++) nodes[i].next = nodes[i + 1] || null;
  return nodes[0] || null;
}

function optimal(head) {
  if (head === null || head.next === null) return head;
  const first = head, second = head.next;
  first.next = optimal(second.next);   // the rest, already swapped
  second.next = first;
  return second;
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(toArray(optimal(fromArray([1, 2, 3, 4]))), [2, 1, 4, 3]);
assert.deepStrictEqual(toArray(optimal(fromArray([1, 2, 3]))), [2, 1, 3]);
assert.strictEqual(optimal(null), null);
assert.deepStrictEqual(toArray(optimal(fromArray([1]))), [1]);
// nodes really moved (identity check)
const h = fromArray([10, 20]);
const second = h.next;
assert.strictEqual(optimal(h), second);
for (let n = 0; n <= 30; n++) {
  const arr = Array.from({ length: n }, (_, i) => i * 3 - 7);
  assert.deepStrictEqual(toArray(optimal(fromArray(arr))), toArray(bruteForce(fromArray(arr))));
}
console.log('✓ 06_swap_nodes_in_pairs passed');

module.exports = { optimal, bruteForce, ListNode, fromArray, toArray };
