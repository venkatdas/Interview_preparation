/**
 * 02. Merge Two Sorted Lists   (LeetCode 21 — Easy)
 *
 * PROBLEM
 * You are given the heads of two sorted linked lists. Merge them into one sorted
 * list by splicing together the existing nodes. Return the head of the merged list.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 4,  1 -> 3 -> 4   Output: 1 -> 1 -> 2 -> 3 -> 4 -> 4
 * Input: (empty), (empty)           Output: (empty)
 * Input: (empty), 0                 Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are both lists sorted ascending? (yes)
 * - Can I reuse the nodes or must I create new ones? (reuse)
 * - Duplicates allowed? (yes, keep all of them)
 *
 * APPROACH 1 — Brute force   O((n+m) log(n+m)) time, O(n+m) space
 * Dump all values into an array, sort it, build a new list. Ignores the fact
 * that the inputs are already sorted.
 *
 * APPROACH 2 — Optimal (dummy head + two pointers)   O(n+m) time, O(1) space
 * Create a dummy node so we never special-case "which node is the head?".
 * Keep a tail pointer at the end of the merged list. Compare the fronts of the
 * two lists, attach the smaller one to tail, and advance that list.
 * When one list runs out, attach the rest of the other list in one move.
 *
 * Dry run on A = 1 -> 3,  B = 2 -> 4:
 *   dummy -> (tail = dummy)
 *   1 < 2  attach 1    dummy -> 1              A = 3
 *   3 > 2  attach 2    dummy -> 1 -> 2         B = 4
 *   3 < 4  attach 3    dummy -> 1 -> 2 -> 3    A = empty
 *   A empty: tail.next = B    dummy -> 1 -> 2 -> 3 -> 4
 *   return dummy.next
 *
 * EDGE CASES
 * - one or both lists empty
 * - all values of one list smaller than the other
 * - equal values (take from either; we take from list1 for stability)
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(list1, list2) {
  const values = [...toArray(list1), ...toArray(list2)].sort((a, b) => a - b);
  return toList(values);
}

function optimal(list1, list2) {
  const dummy = new ListNode(0); // sentinel: its .next will be the real head
  let tail = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  // whichever list still has nodes is already sorted: attach it whole
  tail.next = list1 || list2;
  return dummy.next;
}

// Recursive version: nice to know, O(n+m) stack space.
function recursive(list1, list2) {
  if (!list1) return list2;
  if (!list2) return list1;
  if (list1.val <= list2.val) {
    list1.next = recursive(list1.next, list2);
    return list1;
  }
  list2.next = recursive(list1, list2.next);
  return list2;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, recursive]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 4]), toList([1, 3, 4]))), [1, 1, 2, 3, 4, 4]);
  assert.deepStrictEqual(toArray(solve(toList([]), toList([]))), []);
  assert.deepStrictEqual(toArray(solve(toList([]), toList([0]))), [0]);
  assert.deepStrictEqual(toArray(solve(toList([5]), toList([]))), [5]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]), toList([4, 5]))), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(toArray(solve(toList([-3, -1]), toList([-2, 0]))), [-3, -2, -1, 0]);
  assert.deepStrictEqual(toArray(solve(toList([2, 2]), toList([2]))), [2, 2, 2]);
}
console.log('✓ 02-merge-two-sorted-lists passed');

module.exports = { optimal, bruteForce, recursive };
