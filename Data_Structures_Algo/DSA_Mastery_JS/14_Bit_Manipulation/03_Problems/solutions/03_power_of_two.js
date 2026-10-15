/**
 * 03. Power of Two   (LeetCode 231 — Easy)
 *
 * PROBLEM
 * Return true if the integer n is a power of two (1, 2, 4, 8, ...).
 *
 * EXAMPLES
 * Input: 1    Output: true    Explanation: 2^0
 * Input: 16   Output: true    Explanation: 2^4
 * Input: 3    Output: false
 * Input: 0    Output: false
 * Input: -8   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is 1 a power of two? (yes, 2^0)
 * - Negative numbers? (never a power of two)
 * - No loops / recursion allowed? (bit trick handles that)
 *
 * APPROACH 1 — Brute force   O(log n) time, O(1) space
 * While n is even, divide by 2. It was a power of two iff you end at 1.
 *
 * APPROACH 2 — Optimal (n & (n - 1))   O(1) time, O(1) space
 * A power of two has exactly ONE bit set: 1000. Subtracting 1 gives 0111.
 * AND-ing them gives 0. For any other positive number there is a higher bit that survives.
 *
 * Dry run:
 *   16 = 10000, 15 = 01111, 16 & 15 = 00000 -> true
 *   12 = 01100, 11 = 01011, 12 & 11 = 01000 -> false
 *
 * EDGE CASES
 * - 0: 0 & -1 = 0 would wrongly say true -> guard with n > 0
 * - negative numbers -> false
 * - 2^30 (fits in 32 bits) -> true
 */

function bruteForce(n) {
  if (n <= 0) return false;
  while (n % 2 === 0) n /= 2;
  return n === 1;
}

function optimal(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(1), true);
  assert.strictEqual(solve(16), true);
  assert.strictEqual(solve(3), false);
  assert.strictEqual(solve(0), false);
  assert.strictEqual(solve(-8), false);
  assert.strictEqual(solve(2 ** 30), true);
  assert.strictEqual(solve(6), false);
}
console.log('✓ 03-power-of-two passed');

module.exports = { optimal, bruteForce };
