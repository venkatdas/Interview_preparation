/**
 * 17. Reverse Nodes in k-Group   (LeetCode 25 — Hard)
 *
 * PROBLEM
 * Reverse the nodes of the list k at a time. If the last group has fewer than
 * k nodes, leave it as is. Only pointers may change, not values.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 3 -> 4 -> 5, k = 2   Output: 2 -> 1 -> 4 -> 3 -> 5
 * Input: 1 -> 2 -> 3 -> 4 -> 5, k = 3   Output: 3 -> 2 -> 1 -> 4 -> 5
 * Input: 1 -> 2, k = 1                  Output: 1 -> 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - What happens with the leftover group? (keep its order)
 * - k = 1? (no change) k >= length? (reverse all only if exactly length, else no change)
 * - O(1) extra space? (expected)
 *
 * APPROACH 1 — Brute force (array of values)   O(n) time, O(n) space
 * Copy values into an array, reverse each full chunk of k with a loop, write
 * the values back. Easy, but it swaps values not nodes.
 *
 * APPROACH 2 — Optimal (check k ahead, reverse the group, reconnect)   O(n) time, O(1) space
 * Use a dummy and a pointer `groupPrev` at the node just before the current group.
 * Repeat:
 *   1. Walk k steps from groupPrev to find `kth`. If we hit null, stop (leftover group).
 *   2. groupNext = kth.next (where the next group starts).
 *   3. Reverse the nodes from groupPrev.next up to kth using the 3-pointer
 *      reversal, with prev starting at groupNext so the last node links forward.
 *   4. Reconnect: the old first node of the group is now its last; groupPrev.next = kth;
 *      groupPrev = old first.
 *
 * Dry run on 1 -> 2 -> 3 -> 4 -> 5, k = 2:
 *   dummy -> 1 -> 2 -> 3 -> 4 -> 5     groupPrev=dummy
 *   kth = 2, groupNext = 3
 *   reverse 1,2 with prev=3:   2 -> 1 -> 3    dummy.next = 2 ; groupPrev = 1
 *   kth = 4, groupNext = 5
 *   reverse 3,4 with prev=5:   4 -> 3 -> 5    1.next = 4 ; groupPrev = 3
 *   kth: walk 2 from 3 -> 5 -> null  -> stop
 *   result 2 -> 1 -> 4 -> 3 -> 5
 *
 * EDGE CASES
 * - k = 1 -> unchanged
 * - length < k -> unchanged
 * - length is an exact multiple of k -> every group reversed
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head, k) {
  const values = toArray(head);
  for (let start = 0; start + k <= values.length; start += k) {
    let left = start;
    let right = start + k - 1;
    while (left < right) {
      [values[left], values[right]] = [values[right], values[left]];
      left++;
      right--;
    }
  }
  let node = head;
  for (const value of values) {
    node.val = value;
    node = node.next;
  }
  return head;
}

function optimal(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;

  while (true) {
    // 1. is there a full group of k ahead?
    let kth = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break; // fewer than k nodes left: leave them

    // 2. remember where the next group starts
    const groupNext = kth.next;

    // 3. reverse this group; prev starts at groupNext so the group tail links forward
    let prev = groupNext;
    let current = groupPrev.next;
    while (current !== groupNext) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    // 4. reconnect: the group's old first node is now its last
    const oldFirst = groupPrev.next;
    groupPrev.next = kth;   // kth is the group's new first node
    groupPrev = oldFirst;
  }
  return dummy.next;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5]), 2)), [2, 1, 4, 3, 5]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5]), 3)), [3, 2, 1, 4, 5]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2]), 1)), [1, 2]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4]), 4)), [4, 3, 2, 1]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3]), 5)), [1, 2, 3]);
  assert.deepStrictEqual(toArray(solve(toList([1]), 1)), [1]);
  assert.deepStrictEqual(toArray(solve(toList([1, 2, 3, 4, 5, 6]), 2)), [2, 1, 4, 3, 6, 5]);
  assert.deepStrictEqual(toArray(solve(toList([]), 2)), []);
}
console.log('✓ 17-reverse-nodes-in-k-group passed');

module.exports = { optimal, bruteForce };
