/**
 * 01. Ugly Number   (LeetCode 263 — Easy)
 *
 * PROBLEM
 * An "ugly" number is a POSITIVE integer whose only prime factors are 2, 3 and 5.
 * Given an integer n, return true if it is ugly. (1 counts as ugly: it has no prime factors.)
 *
 * EXAMPLES
 * Input: 6    Output: true    (2 * 3)
 * Input: 1    Output: true    (empty factorization)
 * Input: 14   Output: false   (7 is a factor)
 * Input: 0    Output: false   (not positive)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - -2^31 <= n <= 2^31 - 1. Negative numbers and 0 are never ugly.
 * - Is 1 ugly? (yes, by definition)
 *
 * APPROACH 1 — Brute force   O(sqrt n) time, O(log n) space
 * Fully factorize n by trial division and check every prime is 2, 3 or 5.
 * Does more work than needed: it searches for primes we will reject anyway.
 *
 * APPROACH 2 — Optimal (divide out allowed primes)   O(log n) time, O(1) space
 * Divide by 2 while possible, then 3, then 5. If what remains is 1, nothing else
 * was ever in the factorization (fundamental theorem of arithmetic: factorization is unique).
 *
 * Dry run on n = 30:
 *   p=2: 30 -> 15      p=3: 15 -> 5      p=5: 5 -> 1     remaining 1 -> true
 * Dry run on n = 14:
 *   p=2: 14 -> 7       p=3: no           p=5: no         remaining 7 -> false
 *
 * EDGE CASES
 * - n <= 0 -> false (the loop on 0 would never end: 0 % 2 === 0 forever)
 * - n = 1  -> true
 */

function bruteForce(n) {
  if (n <= 0) return false;
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      if (p !== 2 && p !== 3 && p !== 5) return false;
      n /= p;
    }
  }
  return n === 1 || n === 2 || n === 3 || n === 5; // leftover is a prime (or 1)
}

function optimal(n) {
  if (n <= 0) return false; // guard first: 0 would loop forever
  for (const p of [2, 3, 5]) {
    while (n % p === 0) n /= p;
  }
  return n === 1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(6), true);
  assert.strictEqual(solve(1), true);
  assert.strictEqual(solve(14), false);
  assert.strictEqual(solve(0), false);
  assert.strictEqual(solve(-30), false);
  assert.strictEqual(solve(2 ** 30), true);
  assert.strictEqual(solve(2147483647), false); // a prime
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(263);
for (let t = 0; t < 2000; t++) {
  const n = Math.floor(rng() * 200000) - 100;
  assert.strictEqual(optimal(n), bruteForce(n));
}
console.log('✓ 01_ugly_number passed');

module.exports = { optimal, bruteForce };
