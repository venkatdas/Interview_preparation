const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const nt = require('../02_Implementations/number_theory');
const ugly = require('../03_Problems/solutions/01_ugly_number');
const fraction = require('../03_Problems/solutions/04_fraction_to_recurring_decimal');
const jug = require('../03_Problems/solutions/05_water_and_jug_problem');
const superPow = require('../03_Problems/solutions/08_super_pow');
const invTable = require('../03_Problems/solutions/10_modular_inverse_table');
const magical = require('../03_Problems/solutions/11_nth_magical_number');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(2026);
const randInt = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

describe('exact modular multiplication (the 2^53 trap)', () => {
  it('naive multiplication is wrong, safe versions are right', () => {
    const a = nt.MOD - 1;
    assert.notEqual(nt.mulModNaive(a, a, nt.MOD), 1);
    assert.equal(nt.mulMod(a, a), 1);
    assert.equal(nt.mulModSplit(a, a, nt.MOD), 1);
    assert.equal(nt.mulModDoubling(a, a, nt.MOD), 1);
  });
  it('handles negatives and modulus 1', () => {
    assert.equal(nt.mulMod(-3, 5, 7), 6); // -15 ≡ 6
    assert.equal(nt.powMod(123, 456, 1), 0);
    assert.equal(nt.powMod(-2, 3, 7), 6); // -8 ≡ 6
  });
  it('matches BigInt on random inputs', () => {
    for (let t = 0; t < 500; t++) {
      const m = randInt(2, 2 ** 40), a = randInt(0, m - 1), b = randInt(0, m - 1);
      assert.equal(nt.mulMod(a, b, m), Number((BigInt(a) * BigInt(b)) % BigInt(m)));
      const e = randInt(0, 1e12);
      assert.equal(nt.powMod(a, e, m), Number(nt.powModBig(a, e, m)));
    }
  });
});

describe('gcd, inverses, CRT', () => {
  it('extended gcd satisfies Bezout, including zeros and negatives', () => {
    for (const [a, b] of [[0, 5], [5, 0], [0, 0], [-12, 18], [240, 46]]) {
      const { g, x, y } = nt.extendedGcd(a, b);
      assert.equal(g, nt.gcd(a, b));
      assert.equal(a * x + b * y, g);
    }
  });
  it('inverse is null when not coprime', () => {
    assert.equal(nt.modInverse(4, 8), null);
    assert.equal(nt.modInverseFermat(14, 7), null);
    assert.equal(nt.modInverse(7, 1e9 + 7) * 7 % (1e9 + 7), 1);
  });
  it('CRT handles coprime, non-coprime and inconsistent systems', () => {
    assert.deepEqual(nt.crt([2, 3, 2], [3, 5, 7]), { r: 23n, m: 105n });
    assert.deepEqual(nt.crt([1, 3], [4, 6]), { r: 9n, m: 12n });
    assert.equal(nt.crt([0, 1], [2, 4]), null);
    assert.deepEqual(nt.crt([], []), { r: 0n, m: 1n });
  });
  it('CRT result exceeds 2^53 without losing precision', () => {
    const ps = [1000000007, 998244353, 1000000009];
    const res = nt.crt([1, 2, 3], ps);
    ps.forEach((p, i) => assert.equal(res.r % BigInt(p), BigInt(i + 1)));
    assert.ok(res.m > BigInt(Number.MAX_SAFE_INTEGER));
  });
});

describe('primes and factorization', () => {
  it('small cases', () => {
    assert.deepEqual(nt.primesUpTo(1), []);
    assert.deepEqual(nt.primesUpTo(2), [2]);
    assert.equal(nt.isPrime(1), false);
    assert.equal(nt.millerRabin(1n), false);
    assert.deepEqual(nt.primeFactorization(97), [[97, 1]]);
    assert.deepEqual(nt.primeFactorization(2 ** 20), [[2, 20]]);
  });
  it('Miller-Rabin agrees with trial division on random 40-bit numbers', () => {
    for (let t = 0; t < 300; t++) {
      const n = randInt(1, 2 ** 40);
      assert.equal(nt.millerRabin(n), nt.isPrime(n));
    }
  });
  it('segmented sieve matches the normal sieve on random windows', () => {
    const flags = nt.sieve(200000);
    for (let t = 0; t < 50; t++) {
      const lo = randInt(0, 199000), hi = lo + randInt(0, 1000);
      const want = [];
      for (let x = lo; x <= hi; x++) if (flags[x]) want.push(x);
      assert.deepEqual(nt.segmentedSieve(lo, hi), want);
    }
  });
  it('spf factorization matches trial division', () => {
    const spf = nt.smallestPrimeFactorSieve(50000);
    for (let t = 0; t < 300; t++) {
      const x = randInt(2, 50000);
      assert.deepEqual(nt.factorizeWithSpf(x, spf), nt.primeFactorization(x));
    }
  });
});

describe('divisors, totient, factorial zeros, bases', () => {
  it('divisor functions on perfect squares and primes', () => {
    assert.deepEqual(nt.listDivisors(36), [1, 2, 3, 4, 6, 9, 12, 18, 36]);
    assert.equal(nt.countDivisors(36), 9);
    assert.equal(nt.sumDivisors(28), 56); // perfect number: sigma = 2n
    assert.equal(nt.countDivisors(1), 1);
  });
  it('phi of prime powers and products', () => {
    assert.equal(nt.eulerPhi(1), 1);
    assert.equal(nt.eulerPhi(97), 96);
    assert.equal(nt.eulerPhi(2 ** 10), 512);
    assert.equal(nt.eulerPhi(1337), 6 * 190);
  });
  it('trailing zeros', () => {
    assert.equal(nt.trailingZerosOfFactorial(1000), 249);
    assert.equal(nt.trailingZerosOfFactorial(1000, 12), 497);
    assert.equal(nt.trailingZerosOfFactorial(4), 0);
  });
  it('base conversion round trips and rejects bad input', () => {
    assert.equal(nt.toBase(255, 16), 'ff');
    assert.equal(nt.fromBase('-ff', 16), -255);
    assert.equal(nt.toNegativeBase(6), '11010');
    assert.throws(() => nt.toBase(5, 1), RangeError);
    assert.throws(() => nt.fromBase('2', 2), RangeError);
  });
});

describe('solution files on extra edge cases', () => {
  it('ugly number', () => {
    assert.equal(ugly.optimal(-6), false);
    assert.equal(ugly.optimal(2 * 3 * 5 * 7), false);
    assert.equal(ugly.optimal(2 ** 10 * 3 ** 5 * 5 ** 3), true);
  });
  it('fraction to recurring decimal', () => {
    assert.equal(fraction.optimal(1, 3), '0.(3)');
    assert.equal(fraction.optimal(-1, -3), '0.(3)');
    assert.equal(fraction.optimal(1, -4), '-0.25');
    assert.equal(fraction.optimal(7, -12), '-0.58(3)');
  });
  it('water and jug agrees with BFS on random small inputs', () => {
    for (let t = 0; t < 200; t++) {
      const x = randInt(1, 30), y = randInt(1, 30), target = randInt(0, 70);
      assert.equal(jug.optimal(x, y, target), jug.bruteForce(x, y, target));
    }
  });
  it('super pow with gcd(a, 1337) > 1', () => {
    assert.equal(superPow.optimal(191, [9, 9]), superPow.bruteForce(191, [9, 9]));
    assert.equal(superPow.optimal(7 * 191, [1]), 0);
  });
  it('inverse table and batch inverse with 998244353', () => {
    const p = 998244353;
    const inv = invTable.optimal(5000, p);
    for (let i = 1; i <= 5000; i++) assert.equal(nt.mulMod(i, inv[i], p), 1);
    const arr = [p - 1, 2, 123456789];
    invTable.batchInverse(arr, p).forEach((v, k) => assert.equal(nt.mulMod(arr[k], v, p), 1));
  });
  it('nth magical number when one divides the other', () => {
    assert.equal(magical.optimal(10, 3, 9), 30);
    assert.equal(magical.optimal(1, 7, 3), 3);
  });
});
