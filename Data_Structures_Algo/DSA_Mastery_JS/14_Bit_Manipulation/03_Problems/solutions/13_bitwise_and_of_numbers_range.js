/**
 * 13. Bitwise AND of Numbers Range   (LeetCode 201 — Medium)
 *
 * PROBLEM
 * Given two integers left <= right, return the bitwise AND of all numbers in [left, right].
 *
 * EXAMPLES
 * Input: left = 5, right = 7   Output: 4   Explanation: 101 & 110 & 111 = 100
 * Input: left = 0, right = 0   Output: 0
 * Input: left = 1, right = 2147483647   Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Range can be huge (2^31 numbers)? (yes -> cannot iterate)
 * - Non-negative inputs? (yes)
 *
 * APPROACH 1 — Brute force   O(right - left) time
 * AND every number in the range. Fine for tiny ranges, impossible for 2^31.
 *
 * APPROACH 2 — Optimal (common binary prefix)   O(32) time, O(1) space
 * Key fact: if left < right, the lowest bit will be 0 in at least one number (consecutive
 * numbers alternate it), so bit 0 of the answer is 0. The same holds for every bit below the
 * highest position where left and right differ. Above that, all numbers share the same bits.
 * So the answer is the COMMON PREFIX of left and right, with zeros below.
 * Implementation: shift both right until equal (counting shifts), then shift back left.
 *
 * Dry run on 5 (101), 7 (111):
 *   101 != 111 -> shift: 10, 11, shifts=1
 *   10  != 11  -> shift: 1, 1,   shifts=2
 *   equal -> 1 << 2 = 100 = 4
 *
 * Alternative: while (right > left) right &= right - 1; return right. (Clearing the lowest
 * bit of right until it drops to or below left strips exactly the non-shared suffix.)
 *
 * EDGE CASES
 * - left === right -> that number
 * - range crosses a power of two (e.g. 7..8) -> 0 (no common prefix)
 * - left = 0 -> 0
 */

function bruteForce(left, right) {
  let result = left;
  for (let x = left + 1; x <= right; x++) result &= x;
  return result;
}

function optimal(left, right) {
  let shifts = 0;
  while (left !== right) {   // strip differing low bits until only the common prefix remains
    left >>>= 1;
    right >>>= 1;
    shifts++;
  }
  return (left << shifts) >>> 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(5, 7), 4);
  assert.strictEqual(solve(0, 0), 0);
  assert.strictEqual(solve(7, 8), 0);
  assert.strictEqual(solve(12, 15), 12);
  assert.strictEqual(solve(6, 6), 6);
  assert.strictEqual(solve(1, 3), 0);
  assert.strictEqual(solve(1024, 1030), 1024);
}
assert.strictEqual(optimal(1, 2147483647), 0);
assert.strictEqual(optimal(2147483646, 2147483647), 2147483646);
console.log('✓ 13-bitwise-and-of-numbers-range passed');

module.exports = { optimal, bruteForce };
