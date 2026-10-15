/**
 * 10. Modular Inverse Table   (Original — Medium)
 *
 * PROBLEM
 * Given a prime p and an integer n with 1 <= n < p, return an array inv of length n + 1
 * where inv[0] = 0 and inv[i] is the modular inverse of i modulo p, i.e. (i * inv[i]) % p === 1.
 * FOLLOW-UP: given an arbitrary array a of values (none divisible by p), return all their
 * inverses using only ONE modular exponentiation.
 *
 * EXAMPLES
 * Input: n = 4, p = 7         Output: [0, 1, 4, 5, 2]   (1*1, 2*4=8, 3*5=15, 4*2=8 all ≡ 1 mod 7)
 * Input: n = 1, p = 2         Output: [0, 1]
 * Follow-up: a = [3, 5], p = 7 -> [5, 3]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - p prime, up to 1e9 + 7 (so products reach ~1e18: the 2^53 trap applies — use exact mulMod).
 * - n up to 1e6 (precomputing inverse factorials for nCr is the typical use).
 *
 * APPROACH 1 — Brute force (Fermat for each i)   O(n log p) time, O(n) space
 * inv[i] = i^(p-2) mod p by fast exponentiation. ~30 multiplications per entry.
 *
 * APPROACH 2 — Optimal (linear recurrence)   O(n) time, O(n) space
 * Write p = q*i + r with q = floor(p / i), r = p % i (r < i, already computed).
 *   q*i + r ≡ 0 (mod p)  ->  multiply both sides by inv[i] * inv[r]:
 *   q * inv[r] + inv[i] ≡ 0   ->   inv[i] ≡ -q * inv[r]  ≡ (p - q * inv[r] % p) % p
 *
 * Dry run p = 7:
 *   inv[1] = 1
 *   i=2: q=3, r=1 -> inv = -(3*1) mod 7 = 4        check 2*4 = 8 ≡ 1 ✓
 *   i=3: q=2, r=1 -> inv = -(2*1) mod 7 = 5        check 3*5 = 15 ≡ 1 ✓
 *   i=4: q=1, r=3 -> inv = -(1*5) mod 7 = 2        check 4*2 = 8 ≡ 1 ✓
 *
 * FOLLOW-UP (batch inversion, "Montgomery's trick")   O(m + log p)
 *   prefix[k] = a0*a1*...*a(k-1);  invAll = prefix[m]^(p-2);
 *   walk backwards: inv(a_k) = invAll * prefix[k];  invAll *= a_k.
 *
 * EDGE CASES
 * - n = 1.   p = 2.   Any a_i divisible by p has no inverse (throw).
 */

function mulMod(a, b, m) {
  const prod = a * b;
  if (prod <= Number.MAX_SAFE_INTEGER) return prod % m;
  return Number((BigInt(a) * BigInt(b)) % BigInt(m)); // exact past 2^53
}
function powMod(b, e, m) {
  let r = 1 % m; b %= m;
  while (e > 0) {
    if (e % 2 === 1) r = mulMod(r, b, m);
    b = mulMod(b, b, m);
    e = Math.floor(e / 2);
  }
  return r;
}

function bruteForce(n, p) {
  const inv = [0];
  for (let i = 1; i <= n; i++) inv.push(powMod(i, p - 2, p));
  return inv;
}

function optimal(n, p) {
  if (n >= p) throw new RangeError('need n < p');
  const inv = new Array(n + 1).fill(0);
  inv[1] = 1;
  for (let i = 2; i <= n; i++) {
    const q = Math.floor(p / i);
    inv[i] = (p - mulMod(q, inv[p % i], p)) % p;
  }
  return inv;
}

function batchInverse(a, p) {
  const m = a.length;
  const prefix = new Array(m + 1);
  prefix[0] = 1;
  for (let k = 0; k < m; k++) {
    if (a[k] % p === 0) throw new RangeError(`${a[k]} has no inverse mod ${p}`);
    prefix[k + 1] = mulMod(prefix[k], a[k] % p, p);
  }
  let invAll = powMod(prefix[m], p - 2, p); // the ONLY exponentiation
  const out = new Array(m);
  for (let k = m - 1; k >= 0; k--) {
    out[k] = mulMod(invAll, prefix[k], p);   // (a0..ak)^-1 * (a0..a(k-1)) = ak^-1
    invAll = mulMod(invAll, a[k] % p, p);    // now (a0..a(k-1))^-1
  }
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(4, 7), [0, 1, 4, 5, 2]);
  assert.deepStrictEqual(solve(1, 2), [0, 1]);
  assert.deepStrictEqual(solve(6, 7), [0, 1, 4, 5, 2, 3, 6]);
  const big = solve(2000, 1e9 + 7);
  for (let i = 1; i <= 2000; i++) assert.strictEqual(mulMod(i, big[i], 1e9 + 7), 1);
}
assert.deepStrictEqual(batchInverse([3, 5], 7), [5, 3]);
assert.deepStrictEqual(batchInverse([], 7), []);
assert.throws(() => batchInverse([14], 7));
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(10);
for (const p of [2, 3, 101, 998244353, 1e9 + 7]) {
  const n = Math.min(p - 1, 3000);
  assert.deepStrictEqual(optimal(n, p), bruteForce(n, p));
  const arr = Array.from({ length: 200 }, () => 1 + Math.floor(rng() * (p - 1)));
  const invs = batchInverse(arr, p);
  arr.forEach((x, k) => assert.strictEqual(mulMod(x, invs[k], p), 1));
}
console.log('✓ 10_modular_inverse_table passed');

module.exports = { optimal, bruteForce, batchInverse };
