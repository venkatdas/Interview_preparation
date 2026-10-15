/**
 * 08. Remove Linked List Elements   (LeetCode 203 — Easy)
 *
 * PROBLEM
 * Given the head of a linked list and an integer val, remove every node whose
 * value equals val and return the new head.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 6 -> 3 -> 4 -> 5 -> 6, val = 6   Output: 1 -> 2 -> 3 -> 4 -> 5
 * Input: (empty), val = 1                           Output: (empty)
 * Input: 7 -> 7 -> 7 -> 7, val = 7                  Output: (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the head itself be removed? (yes - that's why we use a dummy node)
 * - Can every node be removed? (yes -> return null)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Copy the values that are NOT val into an array, then build a brand new list.
 * Easy, but allocates n new nodes.
 *
 * APPROACH 2 — Optimal (dummy head + "prev" pointer)   O(n) time, O(1) space
 * Removing a node means changing the next pointer of the node BEFORE it. So we
 * walk with a pointer `prev` and look at prev.next:
 *   - if prev.next.val === val  ->  prev.next = prev.next.next  (skip it, do NOT advance prev,
 *                                   because the new prev.next might also need removing)
 *   - else                      ->  prev = prev.next
 * A dummy node in front of head means removing the head is not a special case.
 *
 * Dry run on 1 -> 6 -> 6 -> 2, val = 6:
 *   dummy -> 1 -> 6 -> 6 -> 2       prev = dummy
 *   prev.next = 1 (keep)            prev = 1
 *   prev.next = 6 (remove)          dummy -> 1 -> 6 -> 2     prev stays on 1
 *   prev.next = 6 (remove)          dummy -> 1 -> 2          prev stays on 1
 *   prev.next = 2 (keep)            prev = 2
 *   prev.next = null -> stop. return dummy.next = 1 -> 2
 *
 * EDGE CASES
 * - empty list
 * - all nodes removed
 * - val appears at head, at tail, consecutively
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head, val) {
  const kept = toArray(head).filter((value) => value !== val);
  return toList(kept);
}

function optimal(head, val) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next) {
    if (prev.next.val === val) {
      prev.next = prev.next.next; // unlink; stay on prev to re-check the new next
    } else {
      prev = prev.next;
    }
  }
  return dummy.next;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 6, 3, 4, 5, 6]), 6)), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(toArray(solve(toList([]), 1)), []);
  assert.deepStrictEqual(toArray(solve(toList([7, 7, 7, 7]), 7)), []);
  assert.deepStrictEqual(toArray(solve(toList([1, 6, 6, 2]), 6)), [1, 2]);
  assert.deepStrictEqual(toArray(solve(toList([6, 1, 2]), 6)), [1, 2]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]), 9)), [1, 2, 3]);
  assert.deepStrictEqual(toArray(solve(toList([-1, 0, -1]), -1)), [0]);
}
console.log('✓ 08-remove-linked-list-elements passed');

module.exports = { optimal, bruteForce };
