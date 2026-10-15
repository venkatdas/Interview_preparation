/**
 * 10. Intersection of Two Linked Lists   (LeetCode 160 — Easy)
 *
 * PROBLEM
 * Two singly linked lists may merge at some node and share the rest of their
 * nodes (a "Y" shape). Return the node where they intersect, or null.
 * Intersection is by NODE identity, not by value.
 *
 * EXAMPLES
 *   A: 4 -> 1 \
 *               8 -> 4 -> 5        Output: node 8
 *   B: 5 -> 6 -> 1 /
 *
 *   A: 2 -> 6 -> 4
 *   B: 1 -> 5                      Output: null
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - No cycles? (correct)
 * - Must the lists keep their original structure? (yes, no modification)
 * - O(1) memory required? (follow-up: yes)
 *
 * APPROACH 1 — Brute force (visited set)   O(n+m) time, O(n) space
 * Put every node of A into a Set. Walk B; the first node already in the Set
 * is the intersection.
 *
 * APPROACH 2 — Optimal (two pointers that switch lists)   O(n+m) time, O(1) space
 * Walk pointerA through A and then through B; walk pointerB through B and then
 * through A. Both travel exactly lengthA + lengthB steps, so they reach the
 * intersection at the same moment (or both hit null at the same moment if
 * there is none).
 *
 * Intuition: the "extra" length before the shared part differs between the two
 * lists. By making each pointer walk BOTH prefixes, the difference cancels out.
 *
 * Dry run (A = 4,1,8,4,5  B = 5,6,1,8,4,5, shared from 8):
 *   pA: 4 1 8 4 5 null 5 6 1 8
 *   pB: 5 6 1 8 4 5 null 4 1 8
 *   both land on 8 at step 10 -> return 8
 *
 * Alternative O(1) approach: compute both lengths, advance the longer list by
 * the difference, then walk together. Same complexity, slightly more code.
 *
 * EDGE CASES
 * - one list empty -> null
 * - no intersection -> both pointers reach null together (loop must end!)
 * - intersection at the very first node (lists are identical)
 */

const { ListNode, toList } = require('../../02_Implementations/list_node');

function bruteForce(headA, headB) {
  const seen = new Set();
  for (let node = headA; node; node = node.next) seen.add(node);
  for (let node = headB; node; node = node.next) {
    if (seen.has(node)) return node;
  }
  return null;
}

function optimal(headA, headB) {
  if (!headA || !headB) return null;
  let pointerA = headA;
  let pointerB = headB;
  // When a pointer hits null it jumps to the OTHER head. If there is no
  // intersection both become null at the same time and the loop exits.
  while (pointerA !== pointerB) {
    pointerA = pointerA ? pointerA.next : headB;
    pointerB = pointerB ? pointerB.next : headA;
  }
  return pointerA;
}

// ---------- tests ----------
const assert = require('assert');

function buildIntersecting(prefixA, prefixB, shared) {
  const sharedHead = toList(shared);
  const headA = toList(prefixA);
  const headB = toList(prefixB);
  const attach = (head) => {
    if (!head) return sharedHead;
    let tail = head;
    while (tail.next) tail = tail.next;
    tail.next = sharedHead;
    return head;
  };
  return [attach(headA), attach(headB), sharedHead];
}

for (const solve of [bruteForce, optimal]) {
  let [a, b, shared] = buildIntersecting([4, 1], [5, 6, 1], [8, 4, 5]);
  assert.strictEqual(solve(a, b), shared);

  [a, b, shared] = buildIntersecting([1, 9, 1], [3], [2, 4]);
  assert.strictEqual(solve(a, b), shared);

  assert.strictEqual(solve(toList([2, 6, 4]), toList([1, 5])), null); // no intersection
  assert.strictEqual(solve(null, toList([1])), null);
  assert.strictEqual(solve(null, null), null);

  [a, b, shared] = buildIntersecting([], [], [1, 2, 3]);      // identical lists
  assert.strictEqual(solve(a, b), shared);

  // same values but different nodes must NOT count as intersecting
  assert.strictEqual(solve(toList([1, 2]), toList([1, 2])), null);
  assert.strictEqual(solve(new ListNode(7), new ListNode(7)), null);
}
console.log('✓ 10-intersection-of-two-linked-lists passed');

module.exports = { optimal, bruteForce };
