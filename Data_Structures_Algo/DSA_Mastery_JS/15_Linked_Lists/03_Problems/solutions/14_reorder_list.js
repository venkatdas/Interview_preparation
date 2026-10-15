/**
 * 14. Reorder List   (LeetCode 143 — Medium)
 *
 * PROBLEM
 * Given L0 -> L1 -> ... -> Ln, reorder it IN PLACE to
 *   L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...
 * Only node pointers may change, not values. Nothing is returned.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 3 -> 4        Output: 1 -> 4 -> 2 -> 3
 * Input: 1 -> 2 -> 3 -> 4 -> 5   Output: 1 -> 5 -> 2 -> 4 -> 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - In place with O(1) extra space? (expected)
 * - Return value? (none; mutate the list)
 *
 * APPROACH 1 — Brute force (array of nodes + two pointers)   O(n) time, O(n) space
 * Store all nodes in an array. Use left/right indices: link nodes[left] ->
 * nodes[right] -> nodes[left+1] -> ... until they meet. Then null-terminate.
 *
 * APPROACH 2 — Optimal (three classic steps combined)   O(n) time, O(1) space
 * This problem is a combo of three earlier ones:
 *   1. Find the middle (fast/slow)                    -> problem 05
 *   2. Reverse the second half                        -> problem 01
 *   3. Merge the two halves alternately               -> like problem 02
 *
 * Dry run on 1 -> 2 -> 3 -> 4 -> 5:
 *   1. middle = 3.  first half: 1 -> 2 -> 3,   second half: 4 -> 5
 *   2. reversed second: 5 -> 4
 *   3. merge alternately:
 *        1 -> 5 -> 2 -> 4 -> 3        (3 is left over from the longer first half)
 *
 * Make sure to CUT the first half (middle.next = null) before merging,
 * otherwise the halves stay connected and you create a cycle.
 *
 * EDGE CASES
 * - empty, one node, two nodes -> unchanged
 * - odd vs even length (the first half is the longer one by our middle choice)
 */

const { toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  if (!head) return;
  const nodes = [];
  for (let node = head; node; node = node.next) nodes.push(node);

  let left = 0;
  let right = nodes.length - 1;
  while (left < right) {
    nodes[left].next = nodes[right];
    left++;
    if (left === right) break;
    nodes[right].next = nodes[left];
    right--;
  }
  nodes[left].next = null;
}

function optimal(head) {
  if (!head || !head.next) return;

  // 1. find the middle (first middle on even length)
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. split and reverse the second half
  let second = slow.next;
  slow.next = null; // cut! otherwise we'll loop forever
  let prev = null;
  while (second) {
    const next = second.next;
    second.next = prev;
    prev = second;
    second = next;
  }
  second = prev;

  // 3. merge alternately: first takes a node, then second takes a node
  let first = head;
  while (second) {
    const firstNext = first.next;
    const secondNext = second.next;
    first.next = second;
    second.next = firstNext;
    first = firstNext;
    second = secondNext;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  const run = (values) => { const head = toList(values); solve(head); return toArray(head); };
  assert.deepStrictEqual(run([1, 2, 3, 4]), [1, 4, 2, 3]);
  assert.deepStrictEqual(run([1, 2, 3, 4, 5]), [1, 5, 2, 4, 3]);
  assert.deepStrictEqual(run([]), []);
  assert.deepStrictEqual(run([1]), [1]);
  assert.deepStrictEqual(run([1, 2]), [1, 2]);
  assert.deepStrictEqual(run([1, 2, 3]), [1, 3, 2]);
  assert.deepStrictEqual(run([1, 2, 3, 4, 5, 6]), [1, 6, 2, 5, 3, 4]);
}
console.log('✓ 14-reorder-list passed');

module.exports = { optimal, bruteForce };
