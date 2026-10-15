/**
 * 05. Middle of the Linked List   (LeetCode 876 — Easy)
 *
 * PROBLEM
 * Given the head of a singly linked list, return the middle node.
 * If there are two middle nodes (even length), return the SECOND one.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 3 -> 4 -> 5        Output: node 3
 * Input: 1 -> 2 -> 3 -> 4 -> 5 -> 6   Output: node 4   Explanation: middles are 3 and 4, return 4
 * Input: 1                            Output: node 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Even length: first or second middle? (second for this problem; many
 *   problems such as Palindrome / Sort List want the FIRST - see the variant below)
 * - Is the list non-empty? (LeetCode guarantees >= 1 node; we also handle null)
 *
 * APPROACH 1 — Brute force (two passes)   O(n) time, O(1) space
 * Pass 1: count the nodes (n). Pass 2: walk floor(n/2) steps from head.
 *
 * APPROACH 2 — Optimal (fast & slow pointers, one pass)   O(n) time, O(1) space
 * slow moves 1 step, fast moves 2 steps. When fast reaches the end, slow has
 * travelled exactly half the distance = the middle.
 *
 * Dry run on 1 -> 2 -> 3 -> 4 -> 5:
 *   slow=1 fast=1
 *   slow=2 fast=3
 *   slow=3 fast=5   fast.next is null -> stop, return slow (3)
 *
 * Dry run on 1 -> 2 -> 3 -> 4:
 *   slow=1 fast=1
 *   slow=2 fast=3
 *   slow=3 fast=null -> stop, return 3 (the second middle)
 *
 * To get the FIRST middle instead, loop while (fast.next && fast.next.next).
 *
 * EDGE CASES
 * - single node -> itself
 * - two nodes -> the second one
 * - empty list -> null
 */

const { toList } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  let count = 0;
  for (let node = head; node; node = node.next) count++;
  let middle = head;
  for (let i = 0; i < Math.floor(count / 2); i++) middle = middle.next;
  return middle;
}

function optimal(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

// Variant used by Palindrome Linked List / Sort List: the FIRST middle on even length.
function firstMiddle(head) {
  if (!head) return null;
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

// ---------- tests ----------
const assert = require('assert');
const valueOf = (node) => (node ? node.val : null);
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(valueOf(solve(toList([1, 2, 3, 4, 5]))), 3);
  assert.strictEqual(valueOf(solve(toList([1, 2, 3, 4, 5, 6]))), 4);
  assert.strictEqual(valueOf(solve(toList([1]))), 1);
  assert.strictEqual(valueOf(solve(toList([1, 2]))), 2);
  assert.strictEqual(valueOf(solve(toList([]))), null);
}
assert.strictEqual(valueOf(firstMiddle(toList([1, 2, 3, 4]))), 2);
assert.strictEqual(valueOf(firstMiddle(toList([1, 2, 3, 4, 5]))), 3);
assert.strictEqual(valueOf(firstMiddle(toList([1]))), 1);
console.log('✓ 05-middle-of-linked-list passed');

module.exports = { optimal, bruteForce, firstMiddle };
