/**
 * 04. Linked List Cycle II   (LeetCode 142 — Medium)
 *
 * PROBLEM
 * Given the head of a linked list, return the NODE where the cycle begins.
 * If there is no cycle, return null. Do not modify the list.
 *
 * EXAMPLES
 * Input: 3 -> 2 -> 0 -> -4 -> (back to 2)   Output: node with value 2
 * Input: 1 -> 2 -> (back to 1)              Output: node with value 1
 * Input: 1                                  Output: null
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Return the node or its index/value? (the node; we test by value)
 * - O(1) space required? (follow-up: yes)
 *
 * APPROACH 1 — Brute force (visited set)   O(n) time, O(n) space
 * Walk and record every node in a Set. The first node we see twice is the
 * start of the cycle (it's the first node reachable from two directions).
 *
 * APPROACH 2 — Optimal (Floyd, phase 2)   O(n) time, O(1) space
 * Phase 1: slow/fast as in problem 03 until they meet inside the cycle.
 * Phase 2: put one pointer back at head, leave the other at the meeting point,
 *          move both ONE step at a time. Where they meet is the cycle start.
 *
 * Why does phase 2 work?
 *   Let  a = distance head -> cycle start
 *        b = distance cycle start -> meeting point
 *        c = cycle length
 *   When they meet, slow walked a + b and fast walked 2(a + b).
 *   fast is also exactly some whole number of laps ahead:  2(a+b) = (a+b) + k*c
 *   so  a + b = k*c,  i.e.  a = k*c - b.
 *   "a steps from head" lands at the cycle start. "a steps from the meeting
 *   point" = k*c - b steps = go back b (to the start) then k full laps = also the
 *   cycle start. So two pointers moving 1 step each meet exactly there.
 *
 * Dry run on 1 -> 2 -> 3 -> 4 -> (back to 2):   a=1, c=3
 *   phase 1: slow 1,2,3,4   fast 1,3,2,4   -> meet at 4
 *   phase 2: p1=1(head) p2=4   step: p1=2, p2=2  -> meet at 2 = cycle start
 *
 * EDGE CASES
 * - no cycle -> null
 * - cycle starts at head (whole list is a loop)
 * - single self-looping node
 */

const { toCyclicList } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  const seen = new Set();
  let current = head;
  while (current) {
    if (seen.has(current)) return current;
    seen.add(current);
    current = current.next;
  }
  return null;
}

function optimal(head) {
  let slow = head;
  let fast = head;

  // phase 1: detect
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      // phase 2: find the entrance
      let pointer = head;
      while (pointer !== slow) {
        pointer = pointer.next;
        slow = slow.next;
      }
      return pointer;
    }
  }
  return null;
}

// ---------- tests ----------
const assert = require('assert');
const valueOf = (node) => (node ? node.val : null);
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(valueOf(solve(toCyclicList([3, 2, 0, -4], 1))), 2);
  assert.strictEqual(valueOf(solve(toCyclicList([1, 2], 0))), 1);
  assert.strictEqual(valueOf(solve(toCyclicList([1], -1))), null);
  assert.strictEqual(valueOf(solve(toCyclicList([1], 0))), 1);
  assert.strictEqual(valueOf(solve(toCyclicList([], -1))), null);
  assert.strictEqual(valueOf(solve(toCyclicList([1, 2, 3, 4, 5, 6], 3))), 4);
  assert.strictEqual(valueOf(solve(toCyclicList([1, 2, 3, 4, 5, 6], 5))), 6);
  assert.strictEqual(valueOf(solve(toCyclicList([1, 2, 3], -1))), null);
}
// must return the actual node, not a copy
const list = toCyclicList([1, 2, 3], 1);
assert.strictEqual(optimal(list), list.next);
console.log('✓ 04-linked-list-cycle-ii passed');

module.exports = { optimal, bruteForce };
