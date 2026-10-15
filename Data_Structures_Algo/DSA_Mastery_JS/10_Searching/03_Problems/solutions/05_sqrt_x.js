/**
 * 05. Sqrt(x)   (LeetCode 69 — Easy)
 *
 * PROBLEM
 * Given a non-negative integer x, return the integer square root of x rounded DOWN.
 * Do not use Math.sqrt or the ** operator.
 *
 * EXAMPLES
 * Input: 4    Output: 2
 * Input: 8    Output: 2   (sqrt(8) = 2.828..., round down)
 * Input: 0    Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= x <= 2^31 - 1, so mid * mid can reach ~4.6e18: fine in JS doubles (< 2^53)
 *   but overflows 32-bit ints elsewhere (compare mid <= x / mid instead)
 * - Round down, never up
 *
 * APPROACH 1 — Brute force   O(sqrt(x)) time
 * Count up k = 0, 1, 2, ... while k * k <= x; return the last k that fit.
 * For x ~ 2 * 10^9 that is ~46,000 steps: acceptable but not O(log).
 *
 * APPROACH 2 — Optimal (binary search on the answer, LAST true)   O(log x) time, O(1) space
 * The predicate k * k <= x is true for small k then false: T T T F F F. We want the
 * LAST true. Search [0, x]: if mid * mid <= x, the answer is mid or bigger (lo = mid,
 * so round mid UP to avoid an infinite loop); else hi = mid - 1.
 * (Equivalent: find the first k with k * k > x and return k - 1.)
 *
 * Dry run x = 8:
 *   lo=0 hi=8 mid=4 16 > 8  -> hi=3
 *   lo=0 hi=3 mid=2 4 <= 8  -> lo=2
 *   lo=2 hi=3 mid=3 9 > 8   -> hi=2
 *   lo === hi === 2 -> 2
 *
 * EDGE CASES
 * - 0 -> 0, 1 -> 1
 * - perfect squares return exactly
 * - max int 2147483647 -> 46340
 */

function bruteForce(x) {
  let k = 0;
  while ((k + 1) * (k + 1) <= x) k++;
  return k;
}

function optimal(x) {
  let lo = 0, hi = x;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo + 1) / 2);   // round UP because we keep lo = mid
    if (mid * mid <= x) lo = mid;                      // mid fits: answer is >= mid
    else hi = mid - 1;                                 // too big
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4), 2);
  assert.strictEqual(solve(8), 2);
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(1), 1);
  assert.strictEqual(solve(2), 1);
  assert.strictEqual(solve(99), 9);
  assert.strictEqual(solve(100), 10);
  assert.strictEqual(solve(2147483647), 46340);
}
for (let x = 0; x < 2000; x++) assert.strictEqual(optimal(x), Math.floor(Math.sqrt(x)));
console.log('✓ 05-sqrt-x passed');

module.exports = { optimal, bruteForce };
