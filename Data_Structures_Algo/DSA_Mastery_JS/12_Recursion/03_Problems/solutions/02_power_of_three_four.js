/**
 * 02. Power of Three / Power of Four   (LeetCode 326 + 342 — Easy)
 *
 * PROBLEM
 * Given an integer n, decide whether n is a power of three (3^k for some k >= 0).
 * Same question for four. We solve both with one recursive helper isPowerOf(n, base).
 *
 * EXAMPLES
 * isPowerOfThree(27) -> true     (3^3)
 * isPowerOfThree(0)  -> false
 * isPowerOfThree(45) -> false    (45 = 3^2 * 5)
 * isPowerOfFour(16)  -> true     (4^2)
 * isPowerOfFour(8)   -> false    (power of two, but not of four)
 * isPowerOf(1, b)    -> true     (b^0)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n can be negative or zero? (yes -> always false)
 * - 32-bit range? (yes, -2^31 .. 2^31 - 1)
 *
 * APPROACH 1 — Brute force (multiply up)   O(log n) time, O(1) space
 * Start at p = 1, multiply by base until p >= n, then compare p === n.
 *
 * APPROACH 2 — Optimal (recursive "peel one factor")   O(log_b n) time, O(log_b n) stack
 * PROMISE: isPowerOf(n, b) says whether n = b^k.
 *   base cases: n <= 0 -> false;  n === 1 -> true (b^0)
 *   if n is not divisible by b it cannot be a power -> false
 *   otherwise n is a power of b exactly when n / b is -> recurse on n / b.
 * The input shrinks by a factor of b each step, so depth is log_b(n) (<= 20 for 3^19).
 * (Interview bonus: for 3, 1162261467 % n === 0 works because 3 is prime and 3^19 is the
 *  largest power in 32-bit range. For 4: power of two AND (n - 1) % 3 === 0.)
 *
 * Dry run isPowerOf(27, 3):
 *   27 % 3 = 0 -> isPowerOf(9) -> 9 % 3 = 0 -> isPowerOf(3) -> isPowerOf(1) -> true
 * Dry run isPowerOf(45, 3):
 *   45 -> 15 -> 5, 5 % 3 = 2 -> false
 *
 * EDGE CASES
 * - n = 1 -> true for every base
 * - n = 0 -> false (0 % 3 === 0 would recurse forever without the n <= 0 guard!)
 * - negative n -> false
 */

function bruteForce(n, base) {
  if (n <= 0) return false;
  let p = 1;
  while (p < n) p *= base;
  return p === n;
}

function optimal(n, base) {
  if (n <= 0) return false;            // also prevents infinite recursion on 0
  if (n === 1) return true;            // base^0
  if (n % base !== 0) return false;    // a leftover factor that is not base
  return optimal(n / base, base);      // peel one factor of base
}

const isPowerOfThree = (n) => optimal(n, 3);
const isPowerOfFour = (n) => optimal(n, 4);

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(isPowerOfThree(27), true);
assert.strictEqual(isPowerOfThree(0), false);
assert.strictEqual(isPowerOfThree(45), false);
assert.strictEqual(isPowerOfThree(-27), false);
assert.strictEqual(isPowerOfThree(1162261467), true);
assert.strictEqual(isPowerOfFour(16), true);
assert.strictEqual(isPowerOfFour(8), false);
assert.strictEqual(isPowerOfFour(1), true);
for (let n = -50; n <= 5000; n++) {
  for (const b of [2, 3, 4, 5]) assert.strictEqual(optimal(n, b), bruteForce(n, b), `n=${n} b=${b}`);
}
console.log('✓ 02_power_of_three_four passed');

module.exports = { optimal, bruteForce, isPowerOfThree, isPowerOfFour };
