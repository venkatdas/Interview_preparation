/**
 * 06. Derangements Count   (Original — Medium)
 *
 * PROBLEM
 * n guests each bring a coat to a party. At the end every guest is handed a coat at random.
 * Count the ways to hand back the coats so that NOBODY gets their own coat (a permutation of
 * 1..n with no fixed point, written !n). Return the count modulo 1e9+7.
 *
 * EXAMPLES
 * Input: n = 3   Output: 2      ([2,3,1] and [3,1,2])
 * Input: n = 4   Output: 9
 * Input: n = 1   Output: 0      (the only guest must get their own coat)
 * Input: n = 0   Output: 1      (the empty arrangement has no fixed point)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 10^6
 * - Answer modulo 1e9+7 (it grows like n!/e)
 * - Many queries? (then precompute D[0..maxN] once)
 *
 * APPROACH 1 — Brute force   O(n * n!) time, O(n) space
 * Generate every permutation, count those with p[i] !== i for every i. Only for n <= 8.
 *
 * APPROACH 2 — Optimal (recurrence)   O(n) time, O(1) space
 * Look at where guest 1's coat goes: to guest j (n-1 choices). Then either
 *   - guest j takes coat 1 back: the other n-2 guests form a derangement  -> D(n-2)
 *   - guest j does NOT take coat 1: treat coat 1 as "j's forbidden coat"  -> D(n-1)
 * So D(n) = (n - 1) * (D(n-1) + D(n-2)), D(0) = 1, D(1) = 0.
 * (Inclusion–exclusion gives the same: D(n) = sum (-1)^i * n!/i!, about n!/e.)
 * THE 2^53 TRAP: (n-1) * (D(n-1)+D(n-2)) can be ~1e6 * 2e9 = 2e15 (fine) but in general a
 * product of two residues is ~1e18, so we use an exact mulMod.
 *
 * Dry run, n = 4:
 *   i=2: D = 1 * (0 + 1) = 1
 *   i=3: D = 2 * (1 + 0) = 2
 *   i=4: D = 3 * (2 + 1) = 9   -> 9
 *
 * EDGE CASES
 * - n = 0 -> 1, n = 1 -> 0, n = 2 -> 1
 * - large n -> keep everything reduced mod p
 */

const MOD = 1_000_000_007;

/** (a * b) mod m, exact: split b into 16-bit halves so no partial product passes 2^53. */
function mulMod(a, b, m = MOD) {
  const bHi = Math.floor(b / 65536), bLo = b % 65536;
  return (((a * bHi) % m) * 65536 + a * bLo) % m;
}

function bruteForce(n) {
  let count = 0;
  const used = new Array(n).fill(false);
  (function place(pos) {
    if (pos === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (used[c] || c === pos) continue; // guest pos must not get coat pos
      used[c] = true;
      place(pos + 1);
      used[c] = false;
    }
  })(0);
  return count % MOD;
}

function optimal(n) {
  if (n === 0) return 1;
  let prev2 = 1, prev1 = 0; // D(0), D(1)
  for (let i = 2; i <= n; i++) {
    const cur = mulMod(i - 1, (prev1 + prev2) % MOD);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

/** Inclusion–exclusion version with BigInt (exact, for cross-checking). */
function inclusionExclusionBig(n) {
  let total = 0n, term = 1n; // term = n!/i!
  for (let i = n; i >= 0; i--) {
    total += i % 2 === 0 ? term : -term;
    term *= BigInt(i === 0 ? 1 : i);
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(0), 1);
  assert.strictEqual(solve(1), 0);
  assert.strictEqual(solve(2), 1);
  assert.strictEqual(solve(3), 2);
  assert.strictEqual(solve(4), 9);
  assert.strictEqual(solve(5), 44);
}
for (let n = 0; n <= 60; n++) assert.strictEqual(optimal(n), Number(inclusionExclusionBig(n) % BigInt(MOD)));
assert.ok(optimal(1_000_000) >= 0 && optimal(1_000_000) < MOD);
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(6);
for (let t = 0; t < 20; t++) {
  const n = Math.floor(rand() * 9);
  assert.strictEqual(optimal(n), bruteForce(n));
}
console.log('✓ 06_derangements_count passed');

module.exports = { optimal, bruteForce, inclusionExclusionBig };
