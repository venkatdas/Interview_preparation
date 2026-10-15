/**
 * 01. Pow(x, n) and Super Pow   (LeetCode 50 — Medium, LeetCode 372 — Medium)
 *
 * PROBLEM
 * (a) myPow(x, n): compute x raised to the integer power n (n may be negative).
 * (b) superPow(a, b): compute a^b mod 1337 where b is a HUGE number given as an array of
 *     decimal digits, e.g. b = [1,0] means 10.
 *
 * EXAMPLES
 * myPow(2.0, 10) -> 1024.0;  myPow(2.0, -2) -> 0.25;  myPow(2.1, 3) -> 9.261
 * superPow(2, [3]) -> 8;  superPow(2, [1,0]) -> 1024 % 1337 = 1024;  superPow(1, [4,3,3,8,5,2]) -> 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n fits in 32 bits (so -2^31 is possible: negating it overflows in some languages, not JS)
 * - x can be 0 with n negative? (assume not)
 * - superPow: b can have 2000 digits -> cannot convert to a number
 *
 * APPROACH 1 — Brute force   O(n) time
 * Multiply x by itself |n| times (invert at the end if n < 0). Too slow for n = 2^31.
 *
 * APPROACH 2 — Optimal (Divide & conquer: repeated squaring)   O(log n) time
 * x^n = (x^(n/2))^2 if n is even, x * (x^(n/2))^2 if n is odd. Each step halves n.
 * Iterative form: walk the bits of n from least significant; keep base = x^(2^i).
 *
 * Dry run myPow(3, 5): n = 5 = 101b
 *   bit 1: result *= 3 -> 3;      base = 9
 *   bit 0: skip;                  base = 81
 *   bit 1: result *= 81 -> 243;   done. 3^5 = 243
 *
 * superPow: split the exponent digit by digit: a^(10 * prefix + d) = (a^prefix)^10 * a^d.
 * Walk the digits left to right keeping result = a^(digits so far) mod 1337; each step costs
 * two small fast powers. Total O(len(b) * log 10).
 *
 * Dry run superPow(2, [1,0]): result 1
 *   digit 1: result = 1^10 * 2^1 = 2
 *   digit 0: result = 2^10 * 2^0 = 1024 -> 1024 % 1337 = 1024
 *
 * EDGE CASES
 * - n = 0 -> 1 (even for x = 0)
 * - n negative -> 1 / x^|n|
 * - x = 1 or -1 with huge n (-1^odd = -1)
 * - superPow with b = [0] -> 1
 */

function bruteForce(x, n) {
  let result = 1;
  for (let i = 0; i < Math.abs(n); i++) result *= x;
  return n < 0 ? 1 / result : result;
}

function optimal(x, n) {
  let exp = Math.abs(n);
  let result = 1;
  let base = x;
  while (exp > 0) {
    if (exp % 2 === 1) result *= base;        // this bit is set: multiply in base^(2^i)
    base *= base;                             // base^(2^(i+1))
    exp = Math.floor(exp / 2);
  }
  return n < 0 ? 1 / result : result;
}

const MOD = 1337;

function powMod(base, exp) {
  let result = 1;
  base %= MOD;
  while (exp > 0) {
    if (exp & 1) result = (result * base) % MOD;   // values < 1337 so products are tiny
    base = (base * base) % MOD;
    exp >>= 1;
  }
  return result;
}

function superPowBrute(a, b) {
  // only for small exponents: multiply digit-by-digit value times
  const exp = Number(b.join(''));
  let result = 1;
  for (let i = 0; i < exp; i++) result = (result * (a % MOD)) % MOD;
  return result;
}

function superPow(a, b) {
  let result = 1;
  for (const digit of b) {
    result = (powMod(result, 10) * powMod(a, digit)) % MOD;
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
// relative tolerance: repeated squaring and the naive loop round differently in the last bits
function close(a, b) {
  assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)), `${a} vs ${b}`);
}
for (const solve of [bruteForce, optimal]) {
  close(solve(2, 10), 1024);
  close(solve(2, -2), 0.25);
  close(solve(2.1, 3), 9.261);
  close(solve(5, 0), 1);
  close(solve(0, 0), 1);
  close(solve(-1, 7), -1);
  close(solve(-2, 4), 16);
}
for (let trial = 0; trial < 200; trial++) {
  const x = Math.random() * 4 - 2;
  const n = Math.floor(Math.random() * 41) - 20;
  if (Math.abs(x) < 0.01 && n < 0) continue;
  close(optimal(x, n), bruteForce(x, n));
}
assert.strictEqual(optimal(2, 31), 2147483648);

assert.strictEqual(superPow(2, [3]), 8);
assert.strictEqual(superPow(2, [1, 0]), 1024);
assert.strictEqual(superPow(1, [4, 3, 3, 8, 5, 2]), 1);
assert.strictEqual(superPow(2147483647, [2, 0, 0]), 1198);
assert.strictEqual(superPow(2, [0]), 1);
for (let trial = 0; trial < 100; trial++) {
  const a = 1 + Math.floor(Math.random() * 5000);
  const exp = Math.floor(Math.random() * 2000);
  const digits = String(exp).split('').map(Number);
  assert.strictEqual(superPow(a, digits), superPowBrute(a, digits));
}
console.log('✓ 01-pow-and-super-pow passed');

module.exports = { optimal, bruteForce, superPow, superPowBrute };
