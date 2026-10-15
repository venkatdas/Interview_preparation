/**
 * 11. Add Two Numbers   (LeetCode 2 — Medium)
 *
 * PROBLEM
 * Two non-empty linked lists represent two non-negative integers. The digits
 * are stored in REVERSE order (ones digit first). Add the numbers and return
 * the sum as a linked list in the same reversed format.
 *
 * EXAMPLES
 * Input: 2 -> 4 -> 3,  5 -> 6 -> 4   Output: 7 -> 0 -> 8   Explanation: 342 + 465 = 807
 * Input: 0, 0                        Output: 0
 * Input: 9 -> 9 -> 9,  1             Output: 0 -> 0 -> 0 -> 1   Explanation: 999 + 1 = 1000
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Digits reversed (ones first)? (yes - that makes it easy: we add left to right)
 * - Can the lists have different lengths? (yes)
 * - Can the numbers be huge (more than 2^53)? (yes - so we must NOT convert to a JS number)
 *
 * APPROACH 1 — Brute force (convert to numbers)   O(n+m) time, O(n+m) space
 * Read each list into a number, add, write the digits back. Breaks for long
 * lists because JavaScript numbers lose precision above 2^53. We use BigInt
 * here so the brute force is at least correct, but the interviewer wants the
 * digit-by-digit approach.
 *
 * APPROACH 2 — Optimal (digit-by-digit with carry, like grade school)   O(max(n,m)) time, O(max(n,m)) space for the answer
 * Walk both lists together. At each step:
 *   sum   = digitA + digitB + carry      (missing digit counts as 0)
 *   digit = sum % 10                     (goes into the new node)
 *   carry = floor(sum / 10)              (0 or 1)
 * Keep going while either list has nodes OR carry is 1.
 * Use a dummy head so the first node needs no special handling.
 *
 * Dry run on 9 -> 9 -> 9  +  1:
 *   9+1+0 = 10 -> digit 0, carry 1       0
 *   9+0+1 = 10 -> digit 0, carry 1       0 -> 0
 *   9+0+1 = 10 -> digit 0, carry 1       0 -> 0 -> 0
 *   lists empty but carry=1 -> digit 1   0 -> 0 -> 0 -> 1
 *
 * EDGE CASES
 * - different lengths
 * - final carry creates an extra node
 * - both zero
 */

const { ListNode, toList, toArray } = require('../../02_Implementations/list_node');

function bruteForce(l1, l2) {
  const toBigInt = (head) => BigInt(toArray(head).reverse().join('') || '0');
  const digits = (toBigInt(l1) + toBigInt(l2)).toString().split('').reverse().map(Number);
  return toList(digits);
}

function optimal(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const digitA = l1 ? l1.val : 0;
    const digitB = l2 ? l2.val : 0;
    const sum = digitA + digitB + carry;

    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = Math.floor(sum / 10);

    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve(toList([2, 4, 3]), toList([5, 6, 4]))), [7, 0, 8]);
  assert.deepStrictEqual(toArray(solve(toList([0]), toList([0]))), [0]);
  assert.deepStrictEqual(toArray(solve(toList([9, 9, 9]), toList([1]))), [0, 0, 0, 1]);
  assert.deepStrictEqual(toArray(solve(toList([9, 9, 9, 9, 9, 9, 9]), toList([9, 9, 9, 9]))), [8, 9, 9, 9, 0, 0, 0, 1]);
  assert.deepStrictEqual(toArray(solve(toList([5]), toList([5]))), [0, 1]);
  assert.deepStrictEqual(toArray(solve(toList([1, 8]), toList([0]))), [1, 8]);
  // 30 digits: far beyond Number precision
  const big = new Array(30).fill(9);
  assert.deepStrictEqual(toArray(solve(toList(big), toList([1]))), [...new Array(30).fill(0), 1]);
}
console.log('✓ 11-add-two-numbers passed');

module.exports = { optimal, bruteForce };
