/**
 * 12. Odd Even Linked List   (LeetCode 328 — Medium)
 *
 * PROBLEM
 * Group all nodes at odd POSITIONS (1st, 3rd, 5th...) followed by all nodes at
 * even positions (2nd, 4th...). Keep the relative order inside each group.
 * Must run in O(1) extra space and O(n) time.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 3 -> 4 -> 5          Output: 1 -> 3 -> 5 -> 2 -> 4
 * Input: 2 -> 1 -> 3 -> 5 -> 6 -> 4 -> 7   Output: 2 -> 3 -> 6 -> 7 -> 1 -> 5 -> 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - "Odd/even" refers to position (1-indexed), not value? (yes)
 * - O(1) space required? (yes, so no extra arrays)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Walk the list and push values into two arrays (odd positions, even
 * positions), then build a new list from odd + even.
 *
 * APPROACH 2 — Optimal (two chains, then connect)   O(n) time, O(1) space
 * Keep two "tails": odd and even. Repeatedly:
 *   odd.next  = even.next     (skip over the even node)
 *   odd       = odd.next
 *   even.next = odd.next      (skip over the odd node)
 *   even      = even.next
 * Remember evenHead (the 2nd node) so we can attach it after the odd chain.
 * Stop when even or even.next is null (no more pairs to pull apart).
 *
 * Dry run on 1 -> 2 -> 3 -> 4 -> 5:
 *   odd=1 even=2 evenHead=2
 *   odd.next=3, odd=3 ; even.next=4, even=4       odd chain 1-3, even chain 2-4
 *   odd.next=5, odd=5 ; even.next=null, even=null  odd chain 1-3-5, even chain 2-4
 *   even is null -> stop. odd.next (5.next) = evenHead  ->  1 3 5 2 4
 *
 * EDGE CASES
 * - empty, one node, two nodes -> unchanged
 * - odd length: last node is odd, even chain ends with null automatically
 * - even length: last node is even; odd.next must be set to evenHead, which
 *   also cuts the leftover pointer from the last odd node into the even chain
 */

const { toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  const odds = [];
  const evens = [];
  let position = 1;
  for (let node = head; node; node = node.next, position++) {
    (position % 2 === 1 ? odds : evens).push(node.val);
  }
  return toList([...odds, ...evens]);
}

function optimal(head) {
  if (!head || !head.next) return head;

  let odd = head;
  let even = head.next;
  const evenHead = even; // we'll glue this after the last odd node

  while (even && even.next) {
    odd.next = even.next; // link odd to the next odd
    odd = odd.next;
    even.next = odd.next; // link even to the next even
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5]))), [1, 3, 5, 2, 4]);
  assert.deepStrictEqual(toArray(solve(toList([2, 1, 3, 5, 6, 4, 7]))), [2, 3, 6, 7, 1, 5, 4]);
  assert.deepStrictEqual(toArray(solve(toList([]))), []);
  assert.deepStrictEqual(toArray(solve(toList([1]))), [1]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2]))), [1, 2]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4]))), [1, 3, 2, 4]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]))), [1, 3, 2]);
}
console.log('✓ 12-odd-even-linked-list passed');

module.exports = { optimal, bruteForce };
