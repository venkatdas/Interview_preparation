/**
 * 19. Sort List   (LeetCode 148 — Medium)
 *
 * PROBLEM
 * Sort a linked list in ascending order. Follow-up: O(n log n) time and O(1)
 * extra memory (ignoring recursion stack, or using the bottom-up version).
 *
 * EXAMPLES
 * Input: 4 -> 2 -> 1 -> 3          Output: 1 -> 2 -> 3 -> 4
 * Input: -1 -> 5 -> 3 -> 4 -> 0    Output: -1 -> 0 -> 3 -> 4 -> 5
 * Input: (empty)                   Output: (empty)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I copy to an array and sort? (works, but the interviewer wants merge sort on the list)
 * - Why merge sort and not quicksort? (merge sort doesn't need random access; lists
 *   can't jump to index i cheaply)
 *
 * APPROACH 1 — Brute force (array sort)   O(n log n) time, O(n) space
 * Copy values to an array, sort, write back.
 *
 * APPROACH 2 — Optimal (top-down merge sort)   O(n log n) time, O(log n) stack
 * 1. Base case: 0 or 1 node is sorted.
 * 2. Find the middle with slow/fast and CUT the list into two halves.
 * 3. Sort each half recursively.
 * 4. Merge the two sorted halves (Merge Two Sorted Lists).
 *
 * Dry run on 4 -> 2 -> 1 -> 3:
 *   split: [4,2] [1,3]
 *     split [4,2] -> [4] [2]  merge -> 2 -> 4
 *     split [1,3] -> [1] [3]  merge -> 1 -> 3
 *   merge (2->4, 1->3) -> 1 -> 2 -> 3 -> 4
 *
 * Why O(n log n)? log n levels of splitting, each level merges all n nodes.
 *
 * (A bottom-up version merges runs of size 1, 2, 4, ... iteratively for true
 * O(1) extra space. Mention it if asked; the top-down version is what most
 * interviews expect.)
 *
 * EDGE CASES
 * - empty, single node
 * - already sorted, reverse sorted, all equal
 * - negatives
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  const values = toArray(head).sort((a, b) => a - b);
  let node = head;
  for (const value of values) {
    node.val = value;
    node = node.next;
  }
  return head;
}

function merge(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}

function optimal(head) {
  if (!head || !head.next) return head;

  // find the middle and cut
  let slow = head;
  let fast = head.next; // start fast one ahead so slow lands on the FIRST middle
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const rightHalf = slow.next;
  slow.next = null;

  const sortedLeft = optimal(head);
  const sortedRight = optimal(rightHalf);
  return merge(sortedLeft, sortedRight);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(toList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepStrictEqual(toArray(solve(toList([-1, 5, 3, 4, 0]))), [-1, 0, 3, 4, 5]);
  assert.deepStrictEqual(toArray(solve(toList([]))), []);
  assert.deepStrictEqual(toArray(solve(toList([1]))), [1]);
  assert.deepStrictEqual(toArray(solve(toList([2, 1]))), [1, 2]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5]))), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(toArray(solve(toList([5, 4, 3, 2, 1]))), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(toArray(solve(toList([3, 3, 1, 3]))), [1, 3, 3, 3]);
}
// bigger random check
const random = Array.from({ length: 200 }, () => Math.floor(Math.random() * 100) - 50);
assert.deepStrictEqual(toArray(optimal(toList(random))), [...random].sort((a, b) => a - b));
console.log('✓ 19-sort-list passed');

module.exports = { optimal, bruteForce };
