/**
 * 15. Rotate List   (LeetCode 61 — Medium)
 *
 * PROBLEM
 * Given the head of a linked list, rotate it to the RIGHT by k places.
 * (The last node moves to the front, k times.)
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 3 -> 4 -> 5, k = 2   Output: 4 -> 5 -> 1 -> 2 -> 3
 * Input: 0 -> 1 -> 2, k = 4             Output: 2 -> 0 -> 1   Explanation: k=4 is the same as k=1 for length 3
 * Input: (empty), k = 3                 Output: (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can k be larger than the length? (yes -> use k % length)
 * - Can k be 0? (yes -> unchanged)
 *
 * APPROACH 1 — Brute force (rotate one step, k times)   O(n*k) time, O(1) space
 * Each step: walk to the second-last node, detach the tail, put it in front.
 * Fine for tiny k, terrible when k is large.
 *
 * APPROACH 2 — Optimal (make a ring, then cut it)   O(n) time, O(1) space
 * 1. Walk to the tail, counting length n.
 * 2. Connect tail.next = head  (now it's a circle).
 * 3. k = k % n. The new tail is at position n - k - 1 (0-indexed) from the old head.
 *    Walk there, set newHead = newTail.next, cut newTail.next = null.
 *
 * Dry run on 1 -> 2 -> 3 -> 4 -> 5, k = 2:
 *   n = 5, tail = 5, make circle: 5 -> 1
 *   k = 2 % 5 = 2 ; steps to new tail = 5 - 2 - 1 = 2  -> node 3
 *   newHead = 3.next = 4 ; cut 3.next = null
 *   result 4 -> 5 -> 1 -> 2 -> 3
 *
 * EDGE CASES
 * - empty or single node -> unchanged
 * - k % n === 0 -> unchanged (don't cut at the old tail into an empty list!)
 * - k much larger than n
 */

const { toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head, k) {
  if (!head || !head.next) return head;
  let length = 0;
  for (let node = head; node; node = node.next) length++;
  k %= length;

  for (let step = 0; step < k; step++) {
    let beforeTail = head;
    while (beforeTail.next.next) beforeTail = beforeTail.next;
    const tail = beforeTail.next;
    beforeTail.next = null;
    tail.next = head;
    head = tail;
  }
  return head;
}

function optimal(head, k) {
  if (!head || !head.next || k === 0) return head;

  // 1. find the tail and the length
  let length = 1;
  let tail = head;
  while (tail.next) {
    tail = tail.next;
    length++;
  }

  k %= length;
  if (k === 0) return head; // full rotations change nothing

  // 2. close the ring
  tail.next = head;

  // 3. walk to the new tail and cut
  let newTail = head;
  for (let i = 0; i < length - k - 1; i++) newTail = newTail.next;
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5]), 2)), [4, 5, 1, 2, 3]);
  assert.deepStrictEqual(toArray(solve(toList([0, 1, 2]), 4)), [2, 0, 1]);
  assert.deepStrictEqual(toArray(solve(toList([]), 3)), []);
  assert.deepStrictEqual(toArray(solve(toList([1]), 99)), [1]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2]), 0)), [1, 2]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]), 3)), [1, 2, 3]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]), 1)), [3, 1, 2]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]), 2)), [2, 3, 1]);
}
console.log('✓ 15-rotate-list passed');

module.exports = { optimal, bruteForce };
