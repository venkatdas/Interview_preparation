/**
 * 03. Linked List Cycle   (LeetCode 141 — Easy)
 *
 * PROBLEM
 * Given the head of a linked list, return true if some node's next pointer
 * points back to an earlier node (the list loops forever), otherwise false.
 *
 * EXAMPLES
 * Input: 3 -> 2 -> 0 -> -4 -> (back to 2)   Output: true
 * Input: 1 -> 2 -> (back to 1)              Output: true
 * Input: 1                                  Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I modify the nodes (e.g. mark them visited)? (usually no)
 * - Is O(1) extra space required? (that's the follow-up; yes)
 *
 * APPROACH 1 — Brute force (visited set)   O(n) time, O(n) space
 * Walk the list and store every node object in a Set. If we ever meet a node
 * that is already in the Set, there is a cycle. If we reach null, there is none.
 *
 * APPROACH 2 — Optimal (Floyd's tortoise and hare)   O(n) time, O(1) space
 * Two pointers: slow moves 1 step, fast moves 2 steps.
 * - No cycle: fast reaches null -> return false.
 * - Cycle: both pointers eventually enter the loop. Inside the loop fast gains
 *   exactly 1 step on slow every move, so the gap shrinks by 1 each time and
 *   MUST hit 0 within one lap. They meet -> return true.
 *   (Why can't fast "jump over" slow? Because the gap shrinks by exactly 1,
 *   it passes through every value down to 0.)
 *
 * Dry run on 1 -> 2 -> 3 -> 4 -> (back to 2):
 *   slow=1 fast=1
 *   slow=2 fast=3
 *   slow=3 fast=2   (fast went 3 -> 4 -> 2)
 *   slow=4 fast=4   meet -> true
 *
 * EDGE CASES
 * - empty list -> false
 * - single node with no cycle -> false
 * - single node pointing to itself -> true
 */

const { toCyclicList } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  const seen = new Set();
  let current = head;
  while (current) {
    if (seen.has(current)) return true;
    seen.add(current);
    current = current.next;
  }
  return false;
}

function optimal(head) {
  let slow = head;
  let fast = head;
  // fast must be able to take 2 steps: check fast and fast.next
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true; // compare NODES, not values
  }
  return false; // fast fell off the end
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(toCyclicList([3, 2, 0, -4], 1)), true);
  assert.strictEqual(solve(toCyclicList([1, 2], 0)), true);
  assert.strictEqual(solve(toCyclicList([1], -1)), false);
  assert.strictEqual(solve(toCyclicList([1], 0)), true);   // self loop
  assert.strictEqual(solve(toCyclicList([], -1)), false);
  assert.strictEqual(solve(toCyclicList([1, 2, 3, 4, 5], -1)), false);
  assert.strictEqual(solve(toCyclicList([1, 2, 3, 4, 5], 4)), true); // tail loops to itself
}
console.log('✓ 03-linked-list-cycle passed');

module.exports = { optimal, bruteForce };
