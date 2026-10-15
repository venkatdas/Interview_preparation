const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../02_Implementations/math_utils');

// Seeded PRNG so random failures are reproducible.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

const bruteGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); let g = 0; for (let d = 1; d <= Math.max(a, b); d++) if (a % d === 0 && b % d === 0) g = d; return g; };
const bruteIsPrime = (n) => { if (n < 2) return false; for (let d = 2; d < n; d++) if (n % d === 0) return false; return true; };

describe('gcd / lcm', () => {
  it('handles normal cases', () => {
    assert.equal(M.gcd(48, 18), 6);
    assert.equal(M.lcm(4, 6), 12);
  });
  it('handles zero and negatives', () => {
    assert.equal(M.gcd(0, 7), 7);
    assert.equal(M.gcd(0, 0), 0);
    assert.equal(M.gcd(-12, 18), 6);
    assert.equal(M.lcm(0, 5), 0);
    assert.equal(M.lcm(-4, 6), 12);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const a = randInt(-300, 300), b = randInt(-300, 300);
      assert.equal(M.gcd(a, b), bruteGcd(a, b), `gcd(${a}, ${b})`);
    }
  });
});

describe('fastPow / powMod / modInverse', () => {
  it('handles exponent 0, 1 and negatives', () => {
    assert.equal(M.fastPow(5, 0), 1);
    assert.equal(M.fastPow(5, 1), 5);
    assert.equal(M.fastPow(2, 10), 1024);
    assert.equal(M.fastPow(2, -2), 0.25);
    assert.equal(M.fastPow(-3, 3), -27);
  });
  it('powMod matches BigInt reference on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const b = randInt(-1000, 1000), e = randInt(0, 60), m = randInt(2, 1e9);
      let ref = 1n; const B = ((BigInt(b) % BigInt(m)) + BigInt(m)) % BigInt(m);
      for (let i = 0; i < e; i++) ref = (ref * B) % BigInt(m);
      assert.equal(M.powMod(b, e, m), Number(ref % BigInt(m)) % m);
    }
  });
  it('modInverse times a is 1 modulo a prime', () => {
    for (const a of [1, 2, 3, 10, 123456789, M.MOD - 1]) assert.equal(M.mulMod(a, M.modInverse(a)), 1);
  });
  it('addMod / subMod / mulMod stay in range', () => {
    assert.equal(M.addMod(M.MOD - 1, 5), 4);
    assert.equal(M.subMod(3, 5), M.MOD - 2);
    assert.equal(M.mulMod(M.MOD - 1, M.MOD - 1), 1); // (-1)^2
  });
});

describe('primes', () => {
  it('isPrime on small edge cases', () => {
    for (const n of [-7, 0, 1]) assert.equal(M.isPrime(n), false);
    for (const n of [2, 3, 5, 97]) assert.equal(M.isPrime(n), true);
    for (const n of [4, 9, 25, 91]) assert.equal(M.isPrime(n), false);
  });
  it('sieve matches isPrime brute force', () => {
    assert.deepEqual(M.sieve(1), []);
    assert.deepEqual(M.sieve(2), [2]);
    const limit = 500;
    const expected = [];
    for (let i = 0; i <= limit; i++) if (bruteIsPrime(i)) expected.push(i);
    assert.deepEqual(M.sieve(limit), expected);
  });
  it('primeFactors multiply back to n', () => {
    for (let t = 0; t < 200; t++) {
      const n = randInt(2, 100000);
      let product = 1;
      for (const [p, e] of M.primeFactors(n)) { assert.ok(bruteIsPrime(p)); product *= p ** e; }
      assert.equal(product, n);
    }
  });
});

describe('factorials and combinations', () => {
  it('factorial uses BigInt', () => {
    assert.equal(M.factorial(0), 1n);
    assert.equal(M.factorial(20), 2432902008176640000n);
  });
  it('nCr matches Pascal row', () => {
    for (let n = 0; n <= 25; n++) {
      const row = M.pascalRow(n);
      for (let k = 0; k <= n; k++) assert.equal(M.nCr(n, k), row[k]);
    }
    assert.equal(M.nCr(5, -1), 0);
    assert.equal(M.nCr(5, 6), 0);
  });
});

describe('digits and bases', () => {
  it('digits / digitSum / reverseDigits', () => {
    assert.deepEqual(M.digits(0), [0]);
    assert.deepEqual(M.digits(-907), [9, 0, 7]);
    assert.equal(M.digitSum(0), 0);
    assert.equal(M.digitSum(-999), 27);
    assert.equal(M.reverseDigits(1200), 21);
    assert.equal(M.reverseDigits(-123), -321);
  });
  it('toBase / fromBase round-trip on random inputs', () => {
    assert.equal(M.toBase(0, 2), '0');
    assert.equal(M.toBase(-10, 2), '-1010');
    assert.equal(M.fromBase('FF', 16), 255);
    for (let t = 0; t < 200; t++) {
      const n = randInt(0, 1e7), base = randInt(2, 36);
      assert.equal(M.toBase(n, base), n.toString(base));
      assert.equal(M.fromBase(M.toBase(n, base), base), n);
    }
  });
});

describe('sum formulas and squares', () => {
  it('closed forms match loops', () => {
    for (let n = 0; n <= 100; n++) {
      let s = 0, sq = 0;
      for (let i = 1; i <= n; i++) { s += i; sq += i * i; }
      assert.equal(M.sumToN(n), s);
      assert.equal(M.sumOfSquares(n), sq);
    }
    assert.equal(M.arithmeticSeriesSum(3, 4, 5), 3 + 7 + 11 + 15 + 19);
  });
  it('isPerfectSquare / isPowerOfTwo / intSqrt', () => {
    assert.equal(M.isPerfectSquare(-4), false);
    assert.equal(M.isPerfectSquare(0), true);
    assert.equal(M.isPowerOfTwo(0), false);
    assert.equal(M.isPowerOfTwo(1), true);
    assert.equal(M.isPowerOfTwo(6), false);
    assert.equal(M.intSqrt(0), 0);
    assert.equal(M.intSqrt(1), 1);
    for (let t = 0; t < 200; t++) {
      const n = randInt(0, 1e9);
      const r = M.intSqrt(n);
      assert.ok(r * r <= n && (r + 1) * (r + 1) > n, `intSqrt(${n}) = ${r}`);
      assert.equal(M.isPerfectSquare(n), r * r === n);
    }
  });
});

describe('solution files: extra edge cases', () => {
  const palindrome = require('../03_Problems/solutions/01_palindrome_number');
  const happy = require('../03_Problems/solutions/05_happy_number');
  const pow = require('../03_Problems/solutions/06_pow_x_n');
  const primes = require('../03_Problems/solutions/08_count_primes');
  const zeros = require('../03_Problems/solutions/09_factorial_trailing_zeroes');

  it('Palindrome Number: negatives, trailing zero, single digit', () => {
    for (const f of [palindrome.optimal, palindrome.bruteForce]) {
      assert.equal(f(-121), false);
      assert.equal(f(10), false);
      assert.equal(f(0), true);
      assert.equal(f(7), true);
      assert.equal(f(1221), true);
    }
  });
  it('Happy Number: 1 is happy, 2 is not, agrees with brute force', () => {
    assert.equal(happy.optimal(1), true);
    assert.equal(happy.optimal(2), false);
    for (let n = 1; n <= 300; n++) assert.equal(happy.optimal(n), happy.bruteForce(n));
  });
  it('Pow(x, n): zero exponent, negative exponent, x = 1 with huge n', () => {
    assert.equal(pow.optimal(2, 0), 1);
    assert.ok(Math.abs(pow.optimal(2, -2) - 0.25) < 1e-12);
    assert.equal(pow.optimal(1, 2 ** 31 - 1), 1);
    assert.equal(pow.optimal(-1, 2 ** 31 - 1), -1);
  });
  it('Count Primes: strictly less than n', () => {
    assert.equal(primes.optimal(0), 0);
    assert.equal(primes.optimal(2), 0);
    assert.equal(primes.optimal(3), 1);
    for (let n = 0; n <= 200; n++) assert.equal(primes.optimal(n), primes.bruteForce(n));
  });
  it('Factorial Trailing Zeroes: counts extra fives in 25, 125', () => {
    assert.equal(zeros.optimal(0), 0);
    assert.equal(zeros.optimal(24), 4);
    assert.equal(zeros.optimal(25), 6);
    assert.equal(zeros.optimal(125), 31);
  });
});
