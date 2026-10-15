/**
 * 05. Happy Number   (LeetCode 202 — Easy)
 *
 * PROBLEM
 * Replace a number by the sum of the squares of its digits, repeatedly. If you reach 1 the
 * number is "happy". If you loop forever without reaching 1 it is not. Return true if happy.
 *
 * EXAMPLES
 * Input: 19   Output: true    Explanation: 1+81=82, 64+4=68, 36+64=100, 1+0+0=1
 * Input: 2    Output: false   Explanation: 4, 16, 37, 58, 89, 145, 42, 20, 4, ... loops
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n >= 1? (yes)
 * - How do I know it loops forever? (the sequence is bounded: a number with d digits maps to
 *   at most 81 * d, so values stay small and MUST eventually repeat)
 *
 * APPROACH 1 — Brute force (Set of seen values)   O(k) time, O(k) space, k = steps until repeat
 * Keep every value we have seen in a Set. If we see a value again, we are in a loop -> false.
 * If we reach 1 -> true.
 *
 * APPROACH 2 — Optimal (Floyd's cycle detection)   O(k) time, O(1) space
 * Treat next(n) as a linked-list "next pointer". Move a slow pointer one step and a fast
 * pointer two steps. If they meet at 1 the number is happy. If they meet elsewhere, we are
 * in a cycle that does not contain 1. Same trick as detecting a cycle in a linked list
 * (see 15_Linked_Lists), with no memory needed.
 *
 * Dry run on 19:
 *   slow=19 fast=19
 *   slow=82 fast=68
 *   slow=68 fast=1      fast reached 1 -> true
 * Dry run on 2:
 *   slow=4  fast=16
 *   slow=16 fast=58
 *   slow=37 fast=145
 *   slow=58 fast=20
 *   slow=89 fast=16
 *   slow=145 fast=58
 *   slow=42 fast=20
 *   slow=20 fast=16
 *   slow=4  fast=4      met at 4, not 1 -> false
 *
 * EDGE CASES
 * - n = 1          -> true immediately
 * - n = 7          -> true (7, 49, 97, 130, 10, 1)
 * - large n        -> shrinks quickly, no overflow concern
 */

function sumOfSquaredDigits(n) {
  let sum = 0;
  while (n > 0) {
    const digit = n % 10;
    sum += digit * digit;
    n = Math.floor(n / 10);
  }
  return sum;
}

function bruteForce(n) {
  const seen = new Set();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = sumOfSquaredDigits(n);
  }
  return n === 1;
}

function optimal(n) {
  let slow = n;
  let fast = n;
  do {
    slow = sumOfSquaredDigits(slow);                       // one step
    fast = sumOfSquaredDigits(sumOfSquaredDigits(fast));   // two steps
  } while (slow !== fast); // they always meet: either at 1 (which maps to itself) or inside the cycle
  return slow === 1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(19), true);
  assert.strictEqual(solve(2), false);
  assert.strictEqual(solve(1), true);
  assert.strictEqual(solve(7), true);
  assert.strictEqual(solve(4), false);
  assert.strictEqual(solve(100), true);
  assert.strictEqual(solve(1111111), true);
  assert.strictEqual(solve(999999999), false);
}
for (let n = 1; n <= 500; n++) assert.strictEqual(optimal(n), bruteForce(n));
console.log('✓ 05-happy-number passed');

module.exports = { optimal, bruteForce, sumOfSquaredDigits };
