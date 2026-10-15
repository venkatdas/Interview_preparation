/**
 * 08. Super Pow   (LeetCode 372 — Medium)
 *
 * PROBLEM
 * Compute a^b mod 1337 where a is a positive integer and b is a HUGE positive integer
 * given as an array of decimal digits (most significant first).
 *
 * EXAMPLES
 * Input: a=2, b=[3]          Output: 8
 * Input: a=2, b=[1,0]        Output: 1024
 * Input: a=1, b=[4,3,3,8,5,2] Output: 1
 * Input: a=2147483647, b=[2,0,0]  Output: 1198
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= a <= 2^31 - 1, 1 <= b.length <= 2000, no leading zeros.
 * - Modulus is fixed at 1337 = 7 * 191 (NOT prime) — so Fermat tricks need care.
 *
 * APPROACH 1 — Brute force (BigInt exponent)   O(len^2) to build b, O(len * log 10) multiplications
 * Build b as a BigInt from the digits and run BigInt binary exponentiation. Correct and
 * simple; building a 2000-digit BigInt is fine, but in an interview the expected idea is below.
 *
 * APPROACH 2 — Optimal (digit-by-digit exponent, Horner's rule)   O(len) time, O(1) space
 * If b = 10*x + d then a^b = (a^x)^10 * a^d. Walk the digits left to right:
 *   result = result^10 * a^d   (mod 1337)
 * Each step is two small powMods with exponent <= 10. All products < 1337^2 ≈ 1.8e6: no 2^53 risk.
 *
 * Dry run a=2, b=[1,0]:
 *   result=1
 *   d=1: result = 1^10 * 2^1 = 2
 *   d=0: result = 2^10 * 2^0 = 1024 % 1337 = 1024
 *
 * EDGE CASES
 * - a multiple of 1337 -> 0.   a % 1337 === 1 -> 1.
 * - Common mistake: reducing b mod phi(1337) = 1140 is ONLY valid when gcd(a, 1337) = 1.
 *   (Euler's theorem needs coprimality; a = 7 breaks it.)
 */

const M = 1337;

function powSmall(base, exp) {
  let r = 1; base %= M;
  while (exp > 0) {
    if (exp & 1) r = (r * base) % M;
    base = (base * base) % M;
    exp >>= 1;
  }
  return r;
}

function bruteForce(a, b) {
  let e = 0n;
  for (const d of b) e = e * 10n + BigInt(d);
  let base = BigInt(a) % 1337n, r = 1n;
  while (e > 0n) {
    if (e & 1n) r = (r * base) % 1337n;
    base = (base * base) % 1337n;
    e >>= 1n;
  }
  return Number(r);
}

function optimal(a, b) {
  let result = 1;
  for (const d of b) result = (powSmall(result, 10) * powSmall(a, d)) % M;
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(2, [3]), 8);
  assert.strictEqual(solve(2, [1, 0]), 1024);
  assert.strictEqual(solve(1, [4, 3, 3, 8, 5, 2]), 1);
  assert.strictEqual(solve(2147483647, [2, 0, 0]), 1198);
  assert.strictEqual(solve(1337, [5]), 0);
  assert.strictEqual(solve(3, [1, 1, 4, 0]), 1); // Euler: 3^phi(1337) = 3^1140 ≡ 1 (gcd(3,1337)=1)
}
// a=7 shares a factor with 1337: the "reduce exponent mod 1140" shortcut fails here
assert.notStrictEqual(optimal(7, [1, 1, 4, 0]), optimal(7, [0]));
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(372);
for (let t = 0; t < 300; t++) {
  const a = 1 + Math.floor(rng() * 2147483646);
  const len = 1 + Math.floor(rng() * 60);
  const b = Array.from({ length: len }, (_, i) => (i === 0 ? 1 : 0) + Math.floor(rng() * (i === 0 ? 9 : 10)));
  assert.strictEqual(optimal(a, b), bruteForce(a, b));
}
console.log('✓ 08_super_pow passed');

module.exports = { optimal, bruteForce };
