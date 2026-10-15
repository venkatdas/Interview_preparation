/**
 * 07. Palindrome Linked List   (LeetCode 234 — Easy)
 *
 * PROBLEM
 * Given the head of a singly linked list, return true if the values read the
 * same forwards and backwards.
 *
 * EXAMPLES
 * Input: 1 -> 2 -> 2 -> 1   Output: true
 * Input: 1 -> 2             Output: false
 * Input: 1 -> 2 -> 3 -> 2 -> 1   Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - May I modify the list? (the O(1) space solution reverses half; ask, and
 *   offer to restore it afterwards)
 * - Follow-up: O(n) time and O(1) space?
 *
 * APPROACH 1 — Brute force (copy to array)   O(n) time, O(n) space
 * Copy values into an array and compare with two pointers from both ends.
 * Simple and correct, but uses O(n) extra memory.
 *
 * APPROACH 2 — Optimal (find middle, reverse second half, compare)   O(n) time, O(1) space
 * 1. Fast/slow pointers to find the end of the first half.
 * 2. Reverse the second half in place.
 * 3. Walk both halves together comparing values.
 * 4. (Optional but polite) reverse the second half back to restore the input.
 *
 * Dry run on 1 -> 2 -> 2 -> 1:
 *   step 1: slow stops at the first 2 (end of first half)
 *   step 2: reverse 2 -> 1 into 1 -> 2 ; list is now 1 -> 2 -> 2 <- 1 (visually)
 *   step 3: compare 1 vs 1 ok, 2 vs 2 ok -> true
 *
 * The second half is never longer than the first half, so the compare loop runs
 * while the reversed half still has nodes. On an odd-length list the middle
 * node belongs to the first half and the loop ends before reaching it, which
 * is exactly what we want (the middle never needs comparing).
 *
 * EDGE CASES
 * - empty or single node -> true
 * - two equal nodes -> true, two different -> false
 * - odd length with a different middle is still a palindrome (1,2,1)
 */

const { toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(head) {
  const values = toArray(head);
  let left = 0;
  let right = values.length - 1;
  while (left < right) {
    if (values[left] !== values[right]) return false;
    left++;
    right--;
  }
  return true;
}

function reverse(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}

function optimal(head) {
  if (!head || !head.next) return true;

  // 1. find the end of the first half (first middle on even length)
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. reverse the second half
  const secondHalfHead = reverse(slow.next);

  // 3. compare
  let left = head;
  let right = secondHalfHead;
  let isPalindrome = true;
  while (right) {
    if (left.val !== right.val) { isPalindrome = false; break; }
    left = left.next;
    right = right.next;
  }

  // 4. restore the list (good manners: callers don't expect side effects)
  slow.next = reverse(secondHalfHead);
  return isPalindrome;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(toList([1, 2, 2, 1])), true);
  assert.strictEqual(solve(toList([1, 2])), false);
  assert.strictEqual(solve(toList([1, 2, 3, 2, 1])), true);
  assert.strictEqual(solve(toList([1])), true);
  assert.strictEqual(solve(toList([])), true);
  assert.strictEqual(solve(toList([1, 1])), true);
  assert.strictEqual(solve(toList([1, 2, 3])), false);
  assert.strictEqual(solve(toList([1, 2, 1, 2])), false);
}
// optimal must leave the list untouched
const original = toList([1, 2, 3, 2, 1]);
optimal(original);
assert.deepStrictEqual(toArray(original), [1, 2, 3, 2, 1]);
console.log('✓ 07-palindrome-linked-list passed');

module.exports = { optimal, bruteForce };
