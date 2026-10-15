/**
 * 09. Remove Duplicates from Sorted List   (LeetCode 83 — Easy)
 *
 * PROBLEM
 * Given the head of a SORTED linked list, delete all duplicates so each value
 * appears only once. Return the list, still sorted.
 *
 * EXAMPLES
 * Input: 1 -> 1 -> 2              Output: 1 -> 2
 * Input: 1 -> 1 -> 2 -> 3 -> 3    Output: 1 -> 2 -> 3
 * Input: (empty)                  Output: (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the list guaranteed sorted? (yes; that's why duplicates are always adjacent)
 * - Keep one copy, or remove ALL nodes that have duplicates? (keep one here;
 *   LeetCode 82 "Remove Duplicates II" removes all - see the bonus function)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Walk the list, collect values into a Set (which drops duplicates), build a
 * new list from the Set. Works for unsorted lists too but allocates.
 *
 * APPROACH 2 — Optimal (compare with next)   O(n) time, O(1) space
 * Because the list is sorted, duplicates are neighbours. Stand on a node and
 * look at the next one: if it has the same value, skip it (current.next =
 * current.next.next) and look again. Otherwise step forward.
 *
 * Dry run on 1 -> 1 -> 2 -> 3 -> 3:
 *   current=1, next=1 same -> skip    1 -> 2 -> 3 -> 3
 *   current=1, next=2 diff -> move    current=2
 *   current=2, next=3 diff -> move    current=3
 *   current=3, next=3 same -> skip    1 -> 2 -> 3
 *   current=3, next=null -> stop
 *
 * EDGE CASES
 * - empty list, single node
 * - all nodes identical -> single node
 * - duplicates at the tail
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  return toList([...new Set(toArray(head))]);
}

function optimal(head) {
  let current = head;
  while (current && current.next) {
    if (current.next.val === current.val) {
      current.next = current.next.next; // drop the duplicate, stay put
    } else {
      current = current.next;
    }
  }
  return head;
}

// Bonus: LeetCode 82 - delete ALL nodes that have duplicate values.
// 1 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5  ->  1 -> 2 -> 5
// Needs a dummy because the head can disappear, and a `prev` that only advances
// when the node after it is unique.
function removeAllDuplicates(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next) {
    let current = prev.next;
    if (current.next && current.next.val === current.val) {
      // skip the whole run of equal values
      const duplicateValue = current.val;
      while (current && current.val === duplicateValue) current = current.next;
      prev.next = current; // prev does NOT move: its new next may also be a duplicate run
    } else {
      prev = prev.next;
    }
  }
  return dummy.next;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 1, 2]))), [1, 2]);
  assert.deepStrictEqual(toArray(solve(toList([1, 1, 2, 3, 3]))), [1, 2, 3]);
  assert.deepStrictEqual(toArray(solve(toList([]))), []);
  assert.deepStrictEqual(toArray(solve(toList([5]))), [5]);
  assert.deepStrictEqual(toArray(solve(toList([2, 2, 2, 2]))), [2]);
  assert.deepStrictEqual(toArray(solve(toList([-2, -2, 0, 1]))), [-2, 0, 1]);
}
assert.deepStrictEqual(toArray(removeAllDuplicates(toList([1, 2, 3, 3, 4, 4, 5]))), [1, 2, 5]);
assert.deepStrictEqual(toArray(removeAllDuplicates(toList([1, 1, 1, 2, 3]))), [2, 3]);
assert.deepStrictEqual(toArray(removeAllDuplicates(toList([1, 1]))), []);
assert.deepStrictEqual(toArray(removeAllDuplicates(toList([1, 2]))), [1, 2]);
console.log('✓ 09-remove-duplicates-sorted-list passed');

module.exports = { optimal, bruteForce, removeAllDuplicates };
