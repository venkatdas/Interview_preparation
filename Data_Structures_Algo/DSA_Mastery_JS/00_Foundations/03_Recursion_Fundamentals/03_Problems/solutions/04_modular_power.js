/**
 * 04. Modular Power   (Original — Medium)
 *
 * PROBLEM
 * Compute (base ^ exp) mod m for non-negative integers, where exp can be as large
 * as 10^18. Inputs and output are BigInt. Write it recursively and report how many
 * recursive calls were made, so you can SEE the difference between linear and
 * halving recursion.
 *
 * EXAMPLES
 * Input: base = 2n,  exp = 10n,  m = 1000n          Output: 24n    (1024 mod 1000)
 * Input: base = 3n,  exp = 0n,   m = 7n             Output: 1n
 * Input: base = 10n, exp = 18n,  m = 1000000007n    Output: 49n    (10^18 mod 1e9+7)
 * Input: base = 5n,  exp = 3n,   m = 1n             Output: 0n     (anything mod 1 is 0)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Why BigInt? (products of two numbers near 1e9 exceed 2^53; Number would lose precision)
 * - m >= 1? (yes)  exp >= 0? (yes)
 * - Max exp 1e18 -> O(exp) calls is impossible (and would overflow the stack at ~1e4)
 *
 * APPROACH 1 — Brute force (linear recursion)   O(exp) time, O(exp) stack
 * pow(b, e) = e === 0 ? 1 % m : (b * pow(b, e - 1)) % m.
 * Fine for exp up to a few thousand; stack overflow beyond ~1e4.
 *
 * APPROACH 2 — Optimal (halving recursion, fast exponentiation)   O(log exp) time, O(log exp) stack
 * pow(b, e):
 *   e === 0 -> 1 % m
 *   half = pow(b, e / 2)            (ONE recursive call, reused twice)
 *   even e -> half * half % m
 *   odd e  -> half * half % m * b % m
 * Depth = number of bits of exp, about 60 for 1e18.
 *
 * Dry run pow(2, 10) mod 1000:
 *   pow(2,10) -> half = pow(2,5)
 *   pow(2,5)  -> half = pow(2,2) -> half = pow(2,1) -> half = pow(2,0) = 1
 *   pow(2,1) = 1*1*2 = 2;  pow(2,2) = 2*2 = 4;  pow(2,5) = 4*4*2 = 32;  pow(2,10) = 32*32 = 1024 mod 1000 = 24
 *   calls: 5 (vs 11 for the linear version)
 *
 * EDGE CASES
 * - exp = 0 -> 1 % m (which is 0 when m = 1!)
 * - base = 0 -> 0 for exp > 0
 * - base >= m -> reduce base first
 *
 * COMMON MISTAKES
 * - Calling pow(b, e/2) TWICE (half * half written as pow()*pow()) -> back to O(exp) calls.
 * - Mixing Number and BigInt (TypeError) or using Number and losing precision.
 * - Returning 1 for exp = 0 when m = 1.
 */

function bruteForce(base, exp, m) {
  let calls = 0;
  const b = base % m;
  function pow(e) {
    calls++;
    if (e === 0n) return 1n % m;
    return (b * pow(e - 1n)) % m;
  }
  return { value: pow(exp), calls };
}

function optimal(base, exp, m) {
  let calls = 0;
  const b = base % m;
  function pow(e) {
    calls++;
    if (e === 0n) return 1n % m;
    const half = pow(e / 2n);          // BigInt division truncates
    const sq = (half * half) % m;
    return e % 2n === 0n ? sq : (sq * b) % m;
  }
  return { value: pow(exp), calls };
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(2n, 10n, 1000n).value, 24n);
  assert.strictEqual(solve(3n, 0n, 7n).value, 1n);
  assert.strictEqual(solve(10n, 18n, 1000000007n).value, 49n);
  assert.strictEqual(solve(5n, 3n, 1n).value, 0n);
  assert.strictEqual(solve(0n, 5n, 13n).value, 0n);
}
assert.strictEqual(bruteForce(2n, 10n, 1000n).calls, 11);
assert.strictEqual(optimal(2n, 10n, 1000n).calls, 5);
// huge exponent: ~61 calls; Fermat check a^(p-1) = 1 mod p
const big = optimal(123456789n, 1000000006n, 1000000007n);
assert.strictEqual(big.value, 1n);
assert.ok(big.calls <= 32);
assert.ok(optimal(7n, 10n ** 18n, 998244353n).calls <= 61);
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(24);
for (let t = 0; t < 300; t++) {
  const b = BigInt(Math.floor(rand() * 1e6)), e = BigInt(Math.floor(rand() * 500)), m = BigInt(1 + Math.floor(rand() * 1e9));
  assert.strictEqual(optimal(b, e, m).value, bruteForce(b, e, m).value);
  assert.strictEqual(optimal(b, e, m).value, b ** e % m);
}
console.log('✓ 04_modular_power passed');

module.exports = { optimal, bruteForce };
