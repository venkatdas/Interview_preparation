/**
 * 06. Remove Nth Node From End of List   (LeetCode 19 — Medium)
 *
 * PROBLEM
 * Given the head of a linked list, remove the n-th node counted from the END
 * and return the head.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 3 -> 4 -> 5, n = 2   Output: 1 -> 2 -> 3 -> 5
 * Input: 1, n = 1                       Output: (empty)
 * Input: 1 -> 2, n = 1                  Output: 1
 * Input: 1 -> 2, n = 2                  Output: 2   Explanation: the head itself is removed
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is n always valid (1 <= n <= length)? (yes)
 * - One pass required? (the follow-up asks for it)
 *
 * APPROACH 1 — Brute force (two passes)   O(n) time, O(1) space
 * Pass 1: count length L. The node to delete is at index L - n from the front.
 * Pass 2: walk to index L - n - 1 and skip the next node. Removing the head
 * (L - n === 0) needs a special case, which a dummy node removes.
 *
 * APPROACH 2 — Optimal (two pointers with a gap of n, one pass)   O(n) time, O(1) space
 * Start both pointers at a dummy node in front of head. Move fast n+1 steps
 * ahead. Now move both together until fast is null. slow is then exactly
 * one node BEFORE the one to delete, so slow.next = slow.next.next.
 *
 * Dry run on 1 -> 2 -> 3 -> 4 -> 5, n = 2:
 *   dummy -> 1 -> 2 -> 3 -> 4 -> 5
 *   fast moves 3 steps: fast = 3, slow = dummy
 *   move both: fast=4 slow=1 ; fast=5 slow=2 ; fast=null slow=3
 *   slow.next (4) is the target. 3.next = 5  ->  1 -> 2 -> 3 -> 5
 *
 * Why dummy? If n = length, the head itself is removed and slow stays on dummy,
 * so "slow.next = slow.next.next" still works with no if-statement.
 *
 * EDGE CASES
 * - removing the head (n === length)
 * - removing the tail (n === 1)
 * - single node -> empty list
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head, n) {
  let length = 0;
  for (let node = head; node; node = node.next) length++;

  const dummy = new ListNode(0, head);
  let before = dummy;
  for (let i = 0; i < length - n; i++) before = before.next;
  before.next = before.next.next;
  return dummy.next;
}

function optimal(head, n) {
  const dummy = new ListNode(0, head);
  let slow = dummy;
  let fast = dummy;

  // open a gap of n+1 nodes so slow lands BEFORE the target
  for (let i = 0; i <= n; i++) fast = fast.next;

  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next; // unlink the target
  return dummy.next;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]);
  assert.deepStrictEqual(toArray(solve(toList([1]), 1)), []);
  assert.deepStrictEqual(toArray(solve(toList([1, 2]), 1)), [1]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2]), 2)), [2]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]), 3)), [2, 3]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]), 1)), [1, 2]);
}
console.log('✓ 06-remove-nth-from-end passed');

module.exports = { optimal, bruteForce };
