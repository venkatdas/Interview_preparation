/**
 * Number theory toolkit for DSA interviews and competitive programming.
 *
 * Builds on 00_Foundations/04_Mathematics_For_DSA (gcd, fast pow, basic sieve).
 * Every function states its complexity and WHY it is written the way it is.
 *
 * Essential  : gcd, extendedGcd, modInverse, mulMod, powMod, isPrime, primeFactorization,
 *              sieve, smallestPrimeFactorSieve, listDivisors, countDivisors, sumDivisors,
 *              trailingZerosOfFactorial, toBase / fromBase
 * Advanced   : segmentedSieve, eulerPhi / phiSieve, crt, millerRabin, modInverseTable,
 *              legendre (generalised trailing zeros), mulModDoubling
 *
 * THE 2^53 TRAP
 * JavaScript numbers are 64-bit floats. Integers are exact only up to 2^53 - 1
 * (Number.MAX_SAFE_INTEGER ≈ 9.007e15). With MOD = 1e9 + 7 two residues can be
 * almost 1e9 each, so a * b ≈ 1e18 > 2^53: the low bits are silently rounded away
 * and (a * b) % MOD is WRONG — no error, no warning.
 *   (1e9+6) * (1e9+6) % (1e9+7)  -> 999999972 in plain JS, correct answer is 1.
 * Fixes shown below: BigInt (simple, slower), split multiplication (fast, m ≤ 2^32),
 * and double-and-add (any m < 2^52, O(log b)).
 */
'use strict';

const MOD = 1_000_000_007;
const TWO_POW_16 = 65536;
const TWO_POW_32 = 4294967296;

function assertNonNegInt(x, name) {
  if (!Number.isSafeInteger(x) || x < 0) throw new RangeError(`${name} must be a non-negative safe integer, got ${x}`);
}

// ---------------------------------------------------------------- gcd family

/** O(log min(a,b)). Works for negatives (result is always >= 0). */
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

/** Overflow-safe lcm: divide BEFORE multiplying. */
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / gcd(a, b)) * b);
}

/**
 * Extended Euclid (iterative). Returns { g, x, y } with a*x + b*y = g = gcd(a, b).
 * WHY: x is the modular inverse of a mod b when g = 1, and the triple solves
 * linear Diophantine equations (Bezout). O(log min(a,b)).
 */
function extendedGcd(a, b) {
  let oldR = a, r = b, oldS = 1, s = 0, oldT = 0, t = 1;
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  if (oldR < 0) { oldR = -oldR; oldS = -oldS; oldT = -oldT; }
  return { g: oldR, x: oldS, y: oldT };
}

// ---------------------------------------------------------------- safe modular multiplication

/** The buggy version, kept only to demonstrate the trap. DO NOT USE for large values. */
function mulModNaive(a, b, m) {
  return (a * b) % m;
}

/** BigInt: always exact, ~10-50x slower than Number arithmetic. */
function mulModBigInt(a, b, m) {
  return Number((BigInt(a) * BigInt(b)) % BigInt(m));
}

/**
 * Split multiplication: write b = hi * 2^16 + lo. Requires 0 <= a, b < m <= 2^32.
 * Every intermediate stays below 2^49 so it is exact:
 *   a * hi < 2^32 * 2^16 = 2^48,  (… % m) * 2^16 < 2^48,  a * lo < 2^48.
 */
function mulModSplit(a, b, m) {
  const hi = Math.floor(b / TWO_POW_16);
  const lo = b % TWO_POW_16;
  return (((a * hi) % m) * TWO_POW_16 + a * lo) % m;
}

/**
 * Double-and-add ("Russian peasant"): a*b = sum of a*2^i for set bits of b.
 * Only additions of values < m, so it is exact for any m < 2^52. O(log b).
 */
function mulModDoubling(a, b, m) {
  a %= m; b %= m;
  let result = 0;
  while (b > 0) {
    if (b % 2 === 1) { result += a; if (result >= m) result -= m; }
    a += a; if (a >= m) a -= m;
    b = Math.floor(b / 2);
  }
  return result;
}

/** The one to use: fast path when the product is provably exact, else a safe fallback. */
function mulMod(a, b, m = MOD) {
  a = ((a % m) + m) % m;
  b = ((b % m) + m) % m;
  const p = a * b;
  if (p <= Number.MAX_SAFE_INTEGER) return p % m; // exact: true product < 2^53
  if (m <= TWO_POW_32) return mulModSplit(a, b, m);
  return mulModBigInt(a, b, m);
}

/** Binary exponentiation with exact multiplication. O(log exp). */
function powMod(base, exp, m = MOD) {
  assertNonNegInt(exp, 'exp');
  if (m === 1) return 0;
  let result = 1;
  base = ((base % m) + m) % m;
  while (exp > 0) {
    if (exp % 2 === 1) result = mulMod(result, base, m);
    base = mulMod(base, base, m);
    exp = Math.floor(exp / 2);
  }
  return result;
}

/** Same algorithm entirely in BigInt (used by Miller-Rabin for n up to 2^64 and beyond). */
function powModBig(base, exp, m) {
  base = BigInt(base); exp = BigInt(exp); m = BigInt(m);
  if (m === 1n) return 0n;
  let result = 1n;
  base = ((base % m) + m) % m;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % m;
    base = (base * base) % m;
    exp >>= 1n;
  }
  return result;
}

// ---------------------------------------------------------------- modular inverse

/** Inverse via extended Euclid: works for ANY modulus as long as gcd(a, m) = 1. Returns null otherwise. */
function modInverse(a, m) {
  const { g, x } = extendedGcd(((a % m) + m) % m, m);
  if (g !== 1) return null;
  return ((x % m) + m) % m;
}

/** Inverse via Fermat: a^(p-2) mod p. Only valid when p is PRIME and p does not divide a. */
function modInverseFermat(a, p) {
  if (a % p === 0) return null;
  return powMod(a, p - 2, p);
}

/**
 * All inverses 1..n mod prime p in O(n):  inv[i] = -(p / i) * inv[p % i]  (mod p).
 * WHY: p = q*i + r  =>  0 ≡ q*i + r  =>  i^-1 ≡ -q * r^-1.  Requires n < p.
 */
function modInverseTable(n, p = MOD) {
  if (n >= p) throw new RangeError('n must be < p');
  const inv = new Array(n + 1).fill(0);
  if (n >= 1) inv[1] = 1;
  for (let i = 2; i <= n; i++) {
    const q = Math.floor(p / i);
    inv[i] = (p - mulMod(q, inv[p % i], p)) % p;
  }
  return inv;
}

// ---------------------------------------------------------------- primes

/** Trial division by 2, 3, then 6k ± 1 up to sqrt(n). O(sqrt n). */
function isPrime(n) {
  if (!Number.isSafeInteger(n) || n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/** Sieve of Eratosthenes. Returns Uint8Array, flag[i] = 1 iff i is prime. O(n log log n). */
function sieve(n) {
  const flag = new Uint8Array(Math.max(n + 1, 2)).fill(1);
  flag[0] = 0; flag[1] = 0;
  for (let i = 2; i * i <= n; i++) {
    if (flag[i]) for (let j = i * i; j <= n; j += i) flag[j] = 0;
  }
  return n < 2 ? new Uint8Array(n + 1) : flag;
}

function primesUpTo(n) {
  const flag = sieve(n);
  const out = [];
  for (let i = 2; i <= n; i++) if (flag[i]) out.push(i);
  return out;
}

/**
 * Smallest-prime-factor sieve (linear sieve). spf[x] = smallest prime dividing x.
 * WHY: after O(n) preprocessing, ANY x <= n factorizes in O(log x) by repeated division.
 * Each composite is crossed out exactly once, by its smallest prime factor.
 */
function smallestPrimeFactorSieve(n) {
  const spf = new Int32Array(n + 1);
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) { spf[i] = i; primes.push(i); }
    for (const p of primes) {
      if (p > spf[i] || p * i > n) break;
      spf[p * i] = p;
    }
  }
  return spf;
}

/** Factorize x using a precomputed spf table. Returns [[prime, exponent], ...]. O(log x). */
function factorizeWithSpf(x, spf) {
  const out = [];
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) { x /= p; e++; }
    out.push([p, e]);
  }
  return out;
}

/** Trial-division factorization. Returns [[prime, exponent], ...] ascending. O(sqrt n). */
function primeFactorization(n) {
  assertNonNegInt(n, 'n');
  const out = [];
  for (let p = 2; p * p <= n; p += (p === 2 ? 1 : 2)) {
    if (n % p !== 0) continue;
    let e = 0;
    while (n % p === 0) { n /= p; e++; }
    out.push([p, e]);
  }
  if (n > 1) out.push([n, 1]); // what is left is a prime > sqrt(original n)
  return out;
}

/**
 * Segmented sieve: primes in [lo, hi] when hi is huge (1e12) but hi - lo is small (1e6).
 * WHY: a normal sieve needs O(hi) memory. Here we only need primes up to sqrt(hi)
 * and a window of size hi - lo + 1.  O((hi-lo) log log hi + sqrt(hi)).
 */
function segmentedSieve(lo, hi) {
  assertNonNegInt(lo, 'lo'); assertNonNegInt(hi, 'hi');
  if (hi < 2 || hi < lo) return [];
  lo = Math.max(lo, 2);
  const base = primesUpTo(Math.floor(Math.sqrt(hi)));
  const isComp = new Uint8Array(hi - lo + 1);
  for (const p of base) {
    // first multiple of p in the window, but never p itself
    let start = Math.max(p * p, Math.ceil(lo / p) * p);
    for (let j = start; j <= hi; j += p) isComp[j - lo] = 1;
  }
  const out = [];
  for (let i = 0; i < isComp.length; i++) if (!isComp[i]) out.push(lo + i);
  return out;
}

/**
 * Miller-Rabin with BigInt. Deterministic for n < 3.3e24 with the first 12 primes as bases
 * (covers every 64-bit integer). Accepts Number or BigInt.
 * WHY: n - 1 = d * 2^s. For prime n, a^d ≡ 1 or a^(d*2^r) ≡ -1 for some r < s.
 * A base that breaks this is a "witness" that n is composite.
 */
const MR_BASES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
function millerRabin(n) {
  n = BigInt(n);
  if (n < 2n) return false;
  for (const p of MR_BASES) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  let d = n - 1n, s = 0;
  while ((d & 1n) === 0n) { d >>= 1n; s++; }
  outer:
  for (const a of MR_BASES) {
    let x = powModBig(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    for (let r = 1; r < s; r++) {
      x = (x * x) % n;
      if (x === n - 1n) continue outer;
    }
    return false; // a is a witness: definitely composite
  }
  return true;
}

// ---------------------------------------------------------------- totient

/** Euler's phi(n) = n * prod(1 - 1/p) over primes p | n. O(sqrt n). */
function eulerPhi(n) {
  assertNonNegInt(n, 'n');
  if (n === 0) return 0;
  let result = n;
  for (const [p] of primeFactorization(n)) result -= result / p; // exact: p divides result
  return result;
}

/** phi(1..n) with a sieve. O(n log log n). */
function phiSieve(n) {
  const phi = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 2; i <= n; i++) {
    if (phi[i] === i) for (let j = i; j <= n; j += i) phi[j] -= phi[j] / i;
  }
  return phi;
}

// ---------------------------------------------------------------- CRT

function extendedGcdBig(a, b) {
  let oldR = a, r = b, oldS = 1n, s = 0n;
  while (r !== 0n) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return { g: oldR, x: oldS };
}

/**
 * Chinese Remainder Theorem, general version (moduli need NOT be coprime).
 * Solves x ≡ remainders[i] (mod moduli[i]). Returns { r, m } as BigInt with 0 <= r < m
 * (m = lcm of moduli), or null if the system is inconsistent.
 * WHY BigInt: the combined modulus grows multiplicatively and quickly passes 2^53.
 */
function crt(remainders, moduli) {
  if (remainders.length !== moduli.length) throw new RangeError('length mismatch');
  let r = 0n, m = 1n;
  for (let i = 0; i < moduli.length; i++) {
    const m2 = BigInt(moduli[i]);
    if (m2 <= 0n) throw new RangeError('moduli must be positive');
    const r2 = ((BigInt(remainders[i]) % m2) + m2) % m2;
    // want r + m*k ≡ r2 (mod m2)  =>  m*k ≡ (r2 - r) (mod m2)
    const { g, x } = extendedGcdBig(m, m2);
    const diff = r2 - r;
    if (diff % g !== 0n) return null;
    const step = m2 / g;
    const k = ((((diff / g) * x) % step) + step) % step;
    r = r + m * k;
    m = m * step;
    r = ((r % m) + m) % m;
  }
  return { r, m };
}

// ---------------------------------------------------------------- divisors

/** All divisors ascending, pairing d with n/d. O(sqrt n). */
function listDivisors(n) {
  assertNonNegInt(n, 'n');
  const small = [], large = [];
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) {
      small.push(d);
      if (d !== n / d) large.push(n / d);
    }
  }
  return small.concat(large.reverse());
}

/** d(n) = prod(e + 1). O(sqrt n). */
function countDivisors(n) {
  if (n === 1) return 1;
  return primeFactorization(n).reduce((acc, [, e]) => acc * (e + 1), 1);
}

/** sigma(n) = prod((p^(e+1) - 1) / (p - 1)). O(sqrt n). */
function sumDivisors(n) {
  if (n === 1) return 1;
  return primeFactorization(n).reduce((acc, [p, e]) => acc * ((p ** (e + 1) - 1) / (p - 1)), 1);
}

/** d(1..n) by adding 1 to every multiple of every i. O(n log n) (harmonic series). */
function divisorCountSieve(n) {
  const cnt = new Int32Array(n + 1);
  for (let i = 1; i <= n; i++) for (let j = i; j <= n; j += i) cnt[j]++;
  return cnt;
}

// ---------------------------------------------------------------- factorials

/** Legendre's formula: exponent of prime p in n! = sum floor(n / p^k). O(log_p n). */
function legendre(n, p) {
  let e = 0;
  while (n > 0) { n = Math.floor(n / p); e += n; }
  return e;
}

/**
 * Trailing zeros of n! written in base b (default 10).
 * Each zero needs one full copy of b = prod p^a, so answer = min over p of floor(legendre(n,p) / a).
 * For base 10 that is just legendre(n, 5) (2s are always more plentiful).
 */
function trailingZerosOfFactorial(n, base = 10) {
  assertNonNegInt(n, 'n');
  let best = Infinity;
  for (const [p, a] of primeFactorization(base)) best = Math.min(best, Math.floor(legendre(n, p) / a));
  return best;
}

// ---------------------------------------------------------------- base conversion

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Integer to base 2..36 (handles negatives). O(log_b n). */
function toBase(n, base) {
  if (!Number.isInteger(base) || base < 2 || base > 36) throw new RangeError('base must be 2..36');
  if (n === 0) return '0';
  const neg = n < 0;
  n = Math.abs(n);
  let s = '';
  while (n > 0) { s = DIGITS[n % base] + s; n = Math.floor(n / base); }
  return neg ? '-' + s : s;
}

/** Base 2..36 string back to integer (Horner's rule). */
function fromBase(str, base) {
  if (!Number.isInteger(base) || base < 2 || base > 36) throw new RangeError('base must be 2..36');
  let i = 0, neg = false;
  if (str[0] === '-') { neg = true; i = 1; }
  let n = 0;
  for (; i < str.length; i++) {
    const d = DIGITS.indexOf(str[i].toLowerCase());
    if (d < 0 || d >= base) throw new RangeError(`bad digit ${str[i]} for base ${base}`);
    n = n * base + d;
  }
  return neg ? -n : n;
}

/** Negative base (e.g. -2, LeetCode 1017): force each remainder into 0..|b|-1. */
function toNegativeBase(n, base = -2) {
  if (n === 0) return '0';
  let s = '';
  while (n !== 0) {
    let r = n % base;
    n = Math.trunc(n / base);
    if (r < 0) { r += -base; n += 1; }
    s = DIGITS[r] + s;
  }
  return s;
}

module.exports = {
  MOD, gcd, lcm, extendedGcd,
  mulModNaive, mulModBigInt, mulModSplit, mulModDoubling, mulMod, powMod, powModBig,
  modInverse, modInverseFermat, modInverseTable,
  isPrime, sieve, primesUpTo, smallestPrimeFactorSieve, factorizeWithSpf, primeFactorization,
  segmentedSieve, millerRabin, eulerPhi, phiSieve, crt,
  listDivisors, countDivisors, sumDivisors, divisorCountSieve,
  legendre, trailingZerosOfFactorial, toBase, fromBase, toNegativeBase,
};

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(36);
  const randInt = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

  // the 2^53 trap, demonstrated
  const a = MOD - 1;
  assert.notStrictEqual(mulModNaive(a, a, MOD), 1); // silently wrong!
  assert.strictEqual(mulModBigInt(a, a, MOD), 1);
  assert.strictEqual(mulModSplit(a, a, MOD), 1);
  assert.strictEqual(mulModDoubling(a, a, MOD), 1);
  assert.strictEqual(mulMod(a, a), 1);
  for (let t = 0; t < 2000; t++) {
    const m = randInt(2, 2 ** 32), x = randInt(0, m - 1), y = randInt(0, m - 1);
    const want = mulModBigInt(x, y, m);
    assert.strictEqual(mulModSplit(x, y, m), want);
    assert.strictEqual(mulModDoubling(x, y, m), want);
    assert.strictEqual(mulMod(x, y, m), want);
  }
  const bigM = 2 ** 50 + 27;
  assert.strictEqual(mulMod(bigM - 1, bigM - 1, bigM), 1);
  assert.strictEqual(mulModDoubling(bigM - 1, bigM - 1, bigM), 1);

  // gcd / ext gcd / inverse
  assert.strictEqual(gcd(48, 18), 6);
  assert.strictEqual(lcm(4, 6), 12);
  for (let t = 0; t < 500; t++) {
    const x = randInt(-1e6, 1e6), y = randInt(-1e6, 1e6);
    const { g, x: s, y: u } = extendedGcd(x, y);
    assert.strictEqual(g, gcd(x, y));
    assert.strictEqual(x * s + y * u, g);
  }
  assert.strictEqual(modInverse(3, 11), 4);
  assert.strictEqual(modInverse(6, 9), null);
  assert.strictEqual(modInverseFermat(3, 11), 4);
  for (let t = 0; t < 300; t++) {
    const x = randInt(1, MOD - 1);
    assert.strictEqual(modInverse(x, MOD), modInverseFermat(x, MOD));
    assert.strictEqual(mulMod(x, modInverse(x, MOD)), 1);
  }
  const table = modInverseTable(1000, 1009);
  for (let i = 1; i <= 1000; i++) assert.strictEqual(table[i], modInverse(i, 1009));

  // powMod vs BigInt
  assert.strictEqual(powMod(2, 10, 1000), 24);
  assert.strictEqual(powMod(5, 0, 7), 1);
  for (let t = 0; t < 300; t++) {
    const b = randInt(0, 2e9), e = randInt(0, 1e12), m = randInt(1, 2e9);
    assert.strictEqual(powMod(b, e, m), Number(powModBig(b, e, m)));
  }

  // primes
  const flags = sieve(10000);
  for (let i = 0; i <= 10000; i++) {
    assert.strictEqual(isPrime(i), flags[i] === 1);
    assert.strictEqual(millerRabin(i), flags[i] === 1);
  }
  assert.strictEqual(millerRabin(2n ** 61n - 1n), true);           // Mersenne prime
  assert.strictEqual(millerRabin(3215031751n), false);             // strong pseudoprime to 2,3,5,7
  assert.strictEqual(millerRabin(18446744073709551557n), true);    // largest 64-bit prime
  assert.strictEqual(millerRabin(561), false);                     // Carmichael number

  const spf = smallestPrimeFactorSieve(100000);
  for (let t = 0; t < 500; t++) {
    const x = randInt(2, 100000);
    assert.deepStrictEqual(factorizeWithSpf(x, spf), primeFactorization(x));
  }
  assert.deepStrictEqual(primeFactorization(360), [[2, 3], [3, 2], [5, 1]]);
  assert.deepStrictEqual(primeFactorization(1), []);

  const seg = segmentedSieve(1e12, 1e12 + 1000);
  assert.ok(seg.every(p => millerRabin(p)));
  for (let x = 1e12; x <= 1e12 + 1000; x++) assert.strictEqual(seg.includes(x), millerRabin(x));
  assert.deepStrictEqual(segmentedSieve(0, 20), [2, 3, 5, 7, 11, 13, 17, 19]);

  // totient
  const phis = phiSieve(2000);
  for (let n = 1; n <= 2000; n++) {
    let brute = 0;
    for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) brute++;
    assert.strictEqual(phis[n], brute);
    assert.strictEqual(eulerPhi(n), brute);
  }

  // CRT
  assert.deepStrictEqual(crt([2, 3, 2], [3, 5, 7]), { r: 23n, m: 105n });
  assert.deepStrictEqual(crt([1, 3], [4, 6]), { r: 9n, m: 12n });  // non-coprime, consistent
  assert.strictEqual(crt([1, 2], [4, 6]), null);                   // inconsistent
  for (let t = 0; t < 300; t++) {
    const ms = [randInt(1, 40), randInt(1, 40), randInt(1, 40)];
    const x = randInt(0, 1e6);
    const res = crt(ms.map(m => x % m), ms);
    const L = BigInt(ms.reduce((acc, m) => lcm(acc, m), 1));
    assert.strictEqual(res.m, L);
    assert.strictEqual(res.r, BigInt(x) % L);
  }

  // divisors
  const dsieve = divisorCountSieve(3000);
  for (let n = 1; n <= 3000; n++) {
    const ds = listDivisors(n);
    assert.strictEqual(countDivisors(n), ds.length);
    assert.strictEqual(dsieve[n], ds.length);
    assert.strictEqual(sumDivisors(n), ds.reduce((s, d) => s + d, 0));
  }

  // trailing zeros
  assert.strictEqual(trailingZerosOfFactorial(100), 24);
  assert.strictEqual(trailingZerosOfFactorial(0), 0);
  assert.strictEqual(trailingZerosOfFactorial(10, 2), 8);   // 10! = 3628800 = 2^8 * ...
  assert.strictEqual(trailingZerosOfFactorial(10, 16), 2);  // floor(8 / 4)
  let f = 1n;
  for (let n = 1; n <= 60; n++) {
    f *= BigInt(n);
    for (const b of [10, 12, 9]) {
      const s = f.toString(b);
      assert.strictEqual(trailingZerosOfFactorial(n, b), s.length - s.replace(/0+$/, '').length);
    }
  }

  // bases
  for (let t = 0; t < 500; t++) {
    const n = randInt(-1e9, 1e9), b = randInt(2, 36);
    assert.strictEqual(toBase(n, b), n.toString(b));
    assert.strictEqual(fromBase(toBase(n, b), b), n);
  }
  assert.strictEqual(toNegativeBase(2), '110');
  assert.strictEqual(toNegativeBase(3), '111');
  for (let n = 0; n <= 2000; n++) {
    const s = toNegativeBase(n);
    let v = 0;
    for (const ch of s) v = v * -2 + Number(ch);
    assert.strictEqual(v, n);
  }

  console.log('✓ number_theory.js self-test passed');
}
