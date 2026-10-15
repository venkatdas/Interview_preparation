/**
 * 08. Count Good Numbers (fast power)   (LeetCode 1922 — Medium)
 *
 * PROBLEM
 * A digit string is "good" if digits at even indices (0, 2, 4, ...) are even
 * (0,2,4,6,8 -> 5 choices) and digits at odd indices are prime (2,3,5,7 -> 4 choices).
 * Leading zeros are allowed. Given n (the length), return the number of good strings
 * modulo 1e9 + 7.
 *
 * EXAMPLES
 * n = 1  -> 5
 * n = 4  -> 400        (5 * 4 * 5 * 4)
 * n = 50 -> 564908303
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 10^15  -> we cannot loop n times, and products overflow 2^53 -> BigInt
 *
 * APPROACH 1 — Brute force (enumerate strings)   O(10^n * n) time
 * Generate every digit string of length n and test it. Only usable for n <= 6.
 * (A linear loop multiplying 5 and 4 alternately is O(n): still too slow for 10^15.)
 *
 * APPROACH 2 — Optimal (count = 5^ceil(n/2) * 4^floor(n/2), recursive fast power)
 *   O(log n) time, O(log n) stack
 * PROMISE: pow(b, e) returns b^e mod M.
 *   base: e = 0 -> 1
 *   step: half = pow(b, floor(e/2)) ONCE; result = half*half (times b if e is odd).
 * Calling pow twice for the halves would bring us back to O(e) calls — the single call
 * reused twice is the whole trick.
 *
 * Dry run pow(5, 5):
 *   pow(5,5) -> half = pow(5,2) -> half = pow(5,1) -> half = pow(5,0) = 1 -> 1*1*5 = 5
 *            pow(5,2) = 5*5 = 25
 *   pow(5,5) = 25*25*5 = 3125 ✓
 *
 * EDGE CASES
 * - n = 1 -> only one even position -> 5
 * - huge n (10^15): BigInt needed for the exponent arithmetic and products
 */

const MOD = 1000000007n;

function bruteForce(n) {
  let count = 0;
  const total = 10 ** n;
  for (let x = 0; x < total; x++) {
    const s = String(x).padStart(n, '0');
    let good = true;
    for (let i = 0; i < n && good; i++) {
      const d = Number(s[i]);
      good = i % 2 === 0 ? d % 2 === 0 : [2, 3, 5, 7].includes(d);
    }
    if (good) count++;
  }
  return count;
}

function powMod(base, exp) {
  if (exp === 0n) return 1n;
  const half = powMod(base, exp / 2n);         // ONE recursive call
  const sq = (half * half) % MOD;
  return exp % 2n === 0n ? sq : (sq * base) % MOD;
}

function optimal(n) {
  const N = BigInt(n);
  const evens = (N + 1n) / 2n;                 // positions 0, 2, 4, ...
  const odds = N / 2n;                         // positions 1, 3, 5, ...
  return Number((powMod(5n, evens) * powMod(4n, odds)) % MOD);
}

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(optimal(1), 5);
assert.strictEqual(optimal(2), 20);
assert.strictEqual(optimal(4), 400);
assert.strictEqual(optimal(50), 564908303);
assert.ok(optimal(1e15) >= 0 && optimal(1e15) < 1e9 + 7);
assert.strictEqual(optimal('1000000000000000'), optimal(1e15)); // string input also fine
for (let n = 1; n <= 5; n++) assert.strictEqual(optimal(n), bruteForce(n));
console.log('✓ 08_count_good_numbers passed');

module.exports = { optimal, bruteForce, powMod };
