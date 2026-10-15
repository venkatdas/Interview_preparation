/**
 * 01. Reverse Linked List   (LeetCode 206 — Easy)
 *
 * PROBLEM
 * Given the head of a singly linked list, reverse the list and return the new head.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 3 -> 4 -> 5   Output: 5 -> 4 -> 3 -> 2 -> 1
 * Input: 1 -> 2                  Output: 2 -> 1
 * Input: (empty)                 Output: (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I modify the nodes in place, or must I return a new list? (in place is expected)
 * - Can the list be empty? (yes -> return null)
 * - Should I do it iteratively or recursively? (know both; iterative uses O(1) space)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Walk the list, copy every value into an array, reverse the array, then walk the
 * list again writing the values back. Works, but uses extra memory and does not
 * actually practice pointer manipulation, which is what the interviewer wants to see.
 *
 * APPROACH 2 — Optimal (3 pointers, iterative)   O(n) time, O(1) space
 * Keep three pointers: prev, current, next.
 * At every node: save next, point current backwards to prev, then slide both
 * prev and current one step to the right.
 *
 * Dry run on 1 -> 2 -> 3:
 *   start:  prev=null  current=1        1 -> 2 -> 3 -> null
 *   step 1: next=2, 1.next=null         null <- 1    2 -> 3 -> null
 *           prev=1, current=2
 *   step 2: next=3, 2.next=1            null <- 1 <- 2    3 -> null
 *           prev=2, current=3
 *   step 3: next=null, 3.next=2         null <- 1 <- 2 <- 3
 *           prev=3, current=null -> stop
 *   return prev (3)
 *
 * APPROACH 3 — Recursive   O(n) time, O(n) space (call stack)
 * Reverse everything after head, then make head's next node point back at head
 * and cut head's own next. Base case: empty or single node is already reversed.
 *
 *   reverse(1 -> 2 -> 3)
 *     newHead = reverse(2 -> 3)   // returns 3 -> 2, and node 2 still has 1 pointing at it
 *     1.next.next = 1             // 2.next = 1  ->  3 -> 2 -> 1 -> 2 ... (temporary cycle)
 *     1.next = null               // cut it     ->  3 -> 2 -> 1 -> null
 *     return 3
 *
 * EDGE CASES
 * - empty list -> null
 * - one node -> same node
 * - two nodes -> swap
 */

const { toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  const values = toArray(head).reverse();
  let current = head;
  for (const value of values) {
    current.val = value;
    current = current.next;
  }
  return head;
}

function optimal(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next; // remember the rest of the list
    current.next = prev;       // flip the arrow backwards
    prev = current;            // slide prev forward
    current = next;            // slide current forward
  }
  return prev; // prev stopped on the old tail = the new head
}

function recursive(head) {
  if (head === null || head.next === null) return head; // 0 or 1 node: already reversed
  const newHead = recursive(head.next); // reverse the rest; head.next is now the tail of that part
  head.next.next = head;                // make the old "next" point back at us
  head.next = null;                     // we become the new tail (for now)
  return newHead;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, recursive]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2]))), [2, 1]);
  assert.deepStrictEqual(toArray(solve(toList([1]))), [1]);
  assert.deepStrictEqual(toArray(solve(toList([]))), []);
  assert.deepStrictEqual(toArray(solve(toList([-1, 0, -1]))), [-1, 0, -1]);
}
// reversing twice gives the original back
assert.deepStrictEqual(toArray(optimal(optimal(toList([1, 2, 3])))), [1, 2, 3]);
console.log('✓ 01-reverse-linked-list passed');

module.exports = { optimal, bruteForce, recursive };
