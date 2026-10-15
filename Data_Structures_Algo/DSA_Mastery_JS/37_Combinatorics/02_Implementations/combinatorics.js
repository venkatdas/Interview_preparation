/**
 * Combinatorics toolkit for DSA interviews and competitive programming.
 *
 * Basic nCr / Pascal's row live in 00_Foundations/04_Mathematics_For_DSA/02_Implementations/math_utils.js.
 * This file goes deeper:
 *   [Essential]  exact counting with BigInt, Pascal's triangle, multiplicative nCr,
 *                permutations / combinations with and without repetition, stars and bars,
 *                Catalan numbers, derangements, next permutation, k-th permutation.
 *   [Advanced]   nCr mod p with precomputed factorials + inverse factorials (O(1) per query),
 *                inclusion-exclusion helper, Lucas-free modular counting.
 *
 * THE 2^53 TRAP: a JS number holds integers exactly only up to 2^53 - 1 (about 9.007e15).
 * Two residues mod 1e9+7 can each be ~1e9, so their product is ~1e18 > 2^53 and the low
 * digits are silently lost. `(a * b) % MOD` is therefore WRONG in JS for big residues.
 * mulMod() below fixes this by splitting b into 16-bit halves so every partial product
 * stays below 2^53. BigInt is the other safe option (simpler, slower).
 */

const MOD = 1_000_000_007;

// ---------- modular helpers ----------

/** (a * b) mod m without ever exceeding 2^53. Requires 0 <= a, b < m <= ~2^36. O(1). */
function mulMod(a, b, m = MOD) {
  // b = bHi * 2^16 + bLo. With a, b < 2^30: a * bHi < 2^44 and a * bLo < 2^46 -> exact.
  const bHi = Math.floor(b / 65536);
  const bLo = b % 65536;
  // (a * bHi mod m) * 65536 < 2^30 * 2^16 = 2^46  -> safe
  return (((a * bHi) % m) * 65536 + a * bLo) % m;
}

/** base^exp mod m by binary exponentiation. O(log exp). */
function powMod(base, exp, m = MOD) {
  base %= m;
  if (base < 0) base += m;
  let result = 1 % m;
  while (exp > 0) {
    if (exp & 1) result = mulMod(result, base, m);
    base = mulMod(base, base, m);
    exp = Math.floor(exp / 2);
  }
  return result;
}

// ---------- exact (BigInt) counting  [Essential] ----------

/** Exact C(n, k) using the multiplicative formula. Each partial result is itself a binomial,
 *  so the division is always exact. O(min(k, n-k)) BigInt operations. */
function nCrExact(n, k) {
  if (!Number.isInteger(n) || !Number.isInteger(k)) throw new TypeError('n and k must be integers');
  if (k < 0 || k > n) return 0n;
  k = Math.min(k, n - k); // symmetry: C(n,k) = C(n,n-k), fewer steps
  let result = 1n;
  for (let i = 1; i <= k; i++) {
    result = (result * BigInt(n - k + i)) / BigInt(i); // result = C(n-k+i, i), exact
  }
  return result;
}

/** Exact P(n, k) = n! / (n-k)!: ordered selections of k distinct items out of n. */
function nPrExact(n, k) {
  if (k < 0 || k > n) return 0n;
  let result = 1n;
  for (let i = 0; i < k; i++) result *= BigInt(n - i);
  return result;
}

/** Exact n!. */
function factorialExact(n) {
  let r = 1n;
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r;
}

/** Pascal's triangle, first numRows rows, as plain numbers (safe while values < 2^53, ~row 56). */
function pascalTriangle(numRows) {
  const rows = [];
  for (let r = 0; r < numRows; r++) {
    const row = new Array(r + 1).fill(1);
    for (let c = 1; c < r; c++) row[c] = rows[r - 1][c - 1] + rows[r - 1][c];
    rows.push(row);
  }
  return rows;
}

/** Permutations with repetition: n^k ordered strings of length k over an alphabet of n. */
function permutationsWithRepetition(n, k) {
  return BigInt(n) ** BigInt(k);
}

/** Combinations with repetition (multisets): C(n + k - 1, k). Same thing as stars and bars. */
function combinationsWithRepetition(n, k) {
  return nCrExact(n + k - 1, k);
}

/** Stars and bars: ways to put `stars` identical balls into `bins` distinct bins.
 *  allowEmpty=true  -> C(stars + bins - 1, bins - 1)
 *  allowEmpty=false -> C(stars - 1, bins - 1)  (give each bin one ball first) */
function starsAndBars(stars, bins, allowEmpty = true) {
  if (bins <= 0) return stars === 0 ? 1n : 0n;
  if (allowEmpty) return nCrExact(stars + bins - 1, bins - 1);
  return stars < bins ? 0n : nCrExact(stars - 1, bins - 1);
}

/** Multinomial: n! / (c1! c2! ... ) = number of distinct arrangements of a multiset. */
function multinomialExact(counts) {
  let total = 0;
  let result = 1n;
  for (const c of counts) {
    total += c;
    result *= nCrExact(total, c); // place this letter's c copies among the slots so far
  }
  return result;
}

/** n-th Catalan number exactly: C(2n, n) / (n + 1). */
function catalanExact(n) {
  return nCrExact(2 * n, n) / BigInt(n + 1);
}

/** Derangements !n (permutations with no fixed point): D(n) = (n-1)(D(n-1) + D(n-2)). */
function derangementsExact(n) {
  if (n === 0) return 1n;
  if (n === 1) return 0n;
  let a = 1n, b = 0n; // D(0), D(1)
  for (let i = 2; i <= n; i++) [a, b] = [b, BigInt(i - 1) * (a + b)];
  return b;
}

// ---------- modular counting  [Advanced — competitive programming] ----------

/**
 * Precompute fact[0..maxN] and invFact[0..maxN] mod p (p prime, p > maxN).
 * Then C(n, k) mod p = fact[n] * invFact[k] * invFact[n-k] in O(1).
 * invFact[maxN] comes from Fermat (a^(p-2)); the rest walk down: invFact[i-1] = invFact[i] * i.
 * Build: O(maxN + log p). Query: O(1).
 */
class ModCombinatorics {
  constructor(maxN, mod = MOD) {
    if (!Number.isInteger(maxN) || maxN < 0) throw new RangeError('maxN must be a non-negative integer');
    this.mod = mod;
    this.fact = new Array(maxN + 1);
    this.invFact = new Array(maxN + 1);
    this.fact[0] = 1;
    for (let i = 1; i <= maxN; i++) this.fact[i] = mulMod(this.fact[i - 1], i, mod);
    this.invFact[maxN] = powMod(this.fact[maxN], mod - 2, mod);
    for (let i = maxN; i >= 1; i--) this.invFact[i - 1] = mulMod(this.invFact[i], i, mod);
  }
  nCr(n, k) {
    if (k < 0 || k > n || n < 0) return 0;
    if (n >= this.fact.length) throw new RangeError(`n=${n} exceeds precomputed maxN`);
    return mulMod(mulMod(this.fact[n], this.invFact[k], this.mod), this.invFact[n - k], this.mod);
  }
  nPr(n, k) {
    if (k < 0 || k > n || n < 0) return 0;
    return mulMod(this.fact[n], this.invFact[n - k], this.mod);
  }
  catalan(n) {
    // C(2n, n) - C(2n, n+1)  (the reflection-principle form, no division needed)
    return (this.nCr(2 * n, n) - this.nCr(2 * n, n + 1) + this.mod) % this.mod;
  }
}

/** Derangements mod p in O(n). */
function derangementsMod(n, mod = MOD) {
  if (n === 0) return 1;
  let a = 1, b = 0;
  for (let i = 2; i <= n; i++) [a, b] = [b, mulMod((i - 1) % mod, (a + b) % mod, mod)];
  return b;
}

/**
 * Inclusion-exclusion over k "bad" conditions.
 * countWithViolated(mask) must return how many objects violate AT LEAST the conditions in mask.
 * Answer = sum over masks of (-1)^popcount(mask) * countWithViolated(mask)  (objects violating none).
 * O(2^k * cost of countWithViolated).
 */
function inclusionExclusion(k, countWithViolated) {
  let total = 0n;
  for (let mask = 0; mask < 1 << k; mask++) {
    let bits = 0;
    for (let m = mask; m; m &= m - 1) bits++;
    const c = BigInt(countWithViolated(mask));
    total += bits % 2 === 0 ? c : -c;
  }
  return total;
}

// ---------- permutations in order  [Essential] ----------

/** Rearrange arr in place into the next lexicographic permutation. Returns false (and resets
 *  to ascending order) if arr was already the last one. O(n). */
function nextPermutation(arr) {
  let i = arr.length - 2;
  while (i >= 0 && arr[i] >= arr[i + 1]) i--; // find the rightmost "ascent"
  if (i >= 0) {
    let j = arr.length - 1;
    while (arr[j] <= arr[i]) j--;             // smallest element on the right bigger than arr[i]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // suffix is non-increasing; reverse it to make it the smallest possible
  for (let l = i + 1, r = arr.length - 1; l < r; l++, r--) [arr[l], arr[r]] = [arr[r], arr[l]];
  return i >= 0;
}

/** k-th (1-indexed) permutation of [1..n] using the factorial number system. O(n^2). */
function kthPermutation(n, k) {
  // 18! < 2^53, so factorials stay exact as plain numbers up to n = 18
  if (n < 1 || n > 18) throw new RangeError('n must be in [1, 18]');
  const fact = [1];
  for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
  if (k < 1 || k > fact[n]) throw new RangeError('k out of range');
  const pool = Array.from({ length: n }, (_, i) => i + 1);
  const out = [];
  k -= 1; // 0-indexed rank
  for (let i = n; i >= 1; i--) {
    const block = fact[i - 1];            // permutations per choice of the first remaining digit
    const idx = Math.floor(k / block);
    out.push(pool.splice(idx, 1)[0]);
    k %= block;
  }
  return out;
}

/** All permutations of arr (brute-force reference). O(n * n!). */
function allPermutations(arr) {
  if (arr.length <= 1) return [arr.slice()];
  const out = [];
  arr.forEach((x, i) => {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of allPermutations(rest)) out.push([x, ...p]);
  });
  return out;
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  // seeded PRNG so failures are reproducible
  function mulberry32(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(37);
  const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

  // the 2^53 trap, demonstrated
  const a = MOD - 1, b = MOD - 2;
  const naive = (a * b) % MOD;
  const exact = Number((BigInt(a) * BigInt(b)) % BigInt(MOD));
  assert.notStrictEqual(naive, exact, 'naive multiplication should lose precision here');
  assert.strictEqual(mulMod(a, b), exact);
  for (let t = 0; t < 2000; t++) {
    const x = randInt(0, MOD - 1), y = randInt(0, MOD - 1);
    assert.strictEqual(mulMod(x, y), Number((BigInt(x) * BigInt(y)) % BigInt(MOD)));
  }

  // exact counts
  assert.strictEqual(nCrExact(5, 2), 10n);
  assert.strictEqual(nCrExact(100, 50), 100891344545564193334812497256n);
  assert.strictEqual(nCrExact(3, 5), 0n);
  assert.strictEqual(nPrExact(5, 2), 20n);
  assert.deepStrictEqual(pascalTriangle(5)[4], [1, 4, 6, 4, 1]);
  assert.strictEqual(permutationsWithRepetition(2, 10), 1024n);
  assert.strictEqual(combinationsWithRepetition(3, 2), 6n); // {aa,ab,ac,bb,bc,cc}
  assert.strictEqual(starsAndBars(5, 3), 21n);
  assert.strictEqual(starsAndBars(5, 3, false), 6n);
  assert.strictEqual(multinomialExact([1, 2, 2]), 30n); // "abbcc" -> 5!/(2!2!)
  assert.deepStrictEqual([0, 1, 2, 3, 4, 5].map(catalanExact), [1n, 1n, 2n, 5n, 14n, 42n]);
  assert.deepStrictEqual([0, 1, 2, 3, 4, 5].map(derangementsExact), [1n, 0n, 1n, 2n, 9n, 44n]);

  // modular table vs BigInt
  const mc = new ModCombinatorics(2000);
  for (let t = 0; t < 300; t++) {
    const n = randInt(0, 1000), k = randInt(-2, n + 2);
    assert.strictEqual(mc.nCr(n, k), Number(nCrExact(n, k) % BigInt(MOD)));
  }
  for (let n = 0; n <= 30; n++) assert.strictEqual(mc.catalan(n), Number(catalanExact(n) % BigInt(MOD)));
  for (let n = 0; n <= 40; n++) assert.strictEqual(derangementsMod(n), Number(derangementsExact(n) % BigInt(MOD)));

  // derangements via inclusion-exclusion must agree with the recurrence
  for (let n = 0; n <= 8; n++) {
    const ie = inclusionExclusion(n, (mask) => {
      let fixed = 0;
      for (let m = mask; m; m &= m - 1) fixed++;
      return factorialExact(n - fixed); // permutations fixing at least these points
    });
    assert.strictEqual(ie, derangementsExact(n));
  }

  // next / k-th permutation vs brute force enumeration
  for (let n = 1; n <= 6; n++) {
    const all = allPermutations(Array.from({ length: n }, (_, i) => i + 1));
    const cur = Array.from({ length: n }, (_, i) => i + 1);
    for (let k = 1; k <= all.length; k++) {
      assert.deepStrictEqual(kthPermutation(n, k), all[k - 1]);
      assert.deepStrictEqual(cur, all[k - 1]);
      nextPermutation(cur);
    }
  }
  const dup = [1, 1, 2];
  const seen = [dup.join('')];
  while (nextPermutation(dup)) seen.push(dup.join(''));
  assert.deepStrictEqual(seen, ['112', '121', '211']);

  console.log('✓ combinatorics.js self-test passed');
}

module.exports = {
  MOD, mulMod, powMod,
  nCrExact, nPrExact, factorialExact, pascalTriangle,
  permutationsWithRepetition, combinationsWithRepetition, starsAndBars, multinomialExact,
  catalanExact, derangementsExact, derangementsMod,
  ModCombinatorics, inclusionExclusion,
  nextPermutation, kthPermutation, allPermutations,
};
