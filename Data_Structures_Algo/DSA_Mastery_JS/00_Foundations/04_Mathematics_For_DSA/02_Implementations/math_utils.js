/**
 * Math utilities for DSA. Each function states its time/space complexity.
 *
 * Sections: gcd/lcm, fast power, modular arithmetic, primes, factorials & combinations,
 * digits, base conversion, sum formulas, perfect square / power of two / integer sqrt.
 */

const MOD = 1_000_000_007;

// ---------- gcd / lcm ----------

// Euclid: gcd(a, b) = gcd(b, a % b). O(log min(a, b)) time, O(1) space.
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// lcm(a, b) = a * b / gcd. Divide FIRST so the intermediate value stays small.
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / gcd(a, b)) * b);
}

// ---------- fast exponentiation ----------

// Binary exponentiation. O(log n) time, O(1) space. Handles negative exponents.
function fastPow(base, exponent) {
  if (exponent < 0) {
    base = 1 / base;
    exponent = -exponent;
  }
  let result = 1;
  while (exponent > 0) {
    if (exponent % 2 === 1) result *= base; // odd exponent: take one factor out
    base *= base;                            // square the base
    exponent = Math.floor(exponent / 2);     // halve the exponent
  }
  return result;
}

// ---------- modular arithmetic ----------

function addMod(a, b, mod = MOD) {
  return (a + b) % mod;
}

// JS % keeps the sign of the dividend, so add mod before the final %.
function subMod(a, b, mod = MOD) {
  return (((a - b) % mod) + mod) % mod;
}

// a * b can exceed 2^53 when a, b are near 1e9. Use BigInt for the one multiply.
function mulMod(a, b, mod = MOD) {
  return Number((BigInt(a) * BigInt(b)) % BigInt(mod));
}

// Fast power with a mod at every step. O(log n).
function powMod(base, exponent, mod = MOD) {
  let result = 1;
  base = ((base % mod) + mod) % mod;
  while (exponent > 0) {
    if (exponent % 2 === 1) result = mulMod(result, base, mod);
    base = mulMod(base, base, mod);
    exponent = Math.floor(exponent / 2);
  }
  return result;
}

// Fermat's little theorem: for prime mod, a^(mod-2) is the inverse of a.
// Lets you "divide" under a modulus: (x / a) % mod === mulMod(x, modInverse(a)).
function modInverse(a, mod = MOD) {
  return powMod(a, mod - 2, mod);
}

// ---------- primes ----------

// Trial division up to sqrt(n). O(sqrt n) time, O(1) space.
function isPrime(n) {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= n; divisor += 2) {
    if (n % divisor === 0) return false;
  }
  return true;
}

// Sieve of Eratosthenes: all primes <= limit. O(n log log n) time, O(n) space.
function sieve(limit) {
  if (limit < 2) return [];
  const isComposite = new Uint8Array(limit + 1); // 0 = maybe prime, 1 = composite
  for (let p = 2; p * p <= limit; p++) {
    if (isComposite[p]) continue;
    // smaller multiples (2p, 3p, ...) were already marked by smaller primes
    for (let multiple = p * p; multiple <= limit; multiple += p) {
      isComposite[multiple] = 1;
    }
  }
  const primes = [];
  for (let i = 2; i <= limit; i++) if (!isComposite[i]) primes.push(i);
  return primes;
}

// Prime factorization as a Map { prime -> exponent }. O(sqrt n).
function primeFactors(n) {
  const factors = new Map();
  for (let divisor = 2; divisor * divisor <= n; divisor++) {
    while (n % divisor === 0) {
      factors.set(divisor, (factors.get(divisor) ?? 0) + 1);
      n /= divisor;
    }
  }
  if (n > 1) factors.set(n, (factors.get(n) ?? 0) + 1); // leftover is a prime
  return factors;
}

// ---------- factorials & combinations ----------

// BigInt so it never overflows. O(n).
function factorial(n) {
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) result *= i;
  return result;
}

// Row n of Pascal's triangle: [C(n,0), C(n,1), ..., C(n,n)]. O(n^2) time, O(n) space.
function pascalRow(n) {
  let row = [1];
  for (let i = 1; i <= n; i++) {
    const nextRow = new Array(i + 1).fill(1);
    for (let k = 1; k < i; k++) nextRow[k] = row[k - 1] + row[k]; // each cell = sum of the two above
    row = nextRow;
  }
  return row;
}

// C(n, k) multiplicatively: C(n, k) = C(n, k-1) * (n-k+1) / k, always an integer. O(k).
function nCr(n, k) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k); // symmetry: C(n, k) = C(n, n-k)
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - k + i)) / i;
  }
  return result;
}

// ---------- digits ----------

// Digits of |n| from most to least significant. O(log10 n).
function digits(n) {
  n = Math.abs(n);
  if (n === 0) return [0];
  const result = [];
  while (n > 0) {
    result.push(n % 10);         // last digit
    n = Math.floor(n / 10);      // drop it
  }
  return result.reverse();
}

function digitSum(n) {
  n = Math.abs(n);
  let sum = 0;
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  return sum;
}

// Reverses the digits, keeps the sign. 120 -> 21, -123 -> -321.
function reverseDigits(n) {
  const sign = n < 0 ? -1 : 1;
  n = Math.abs(n);
  let reversed = 0;
  while (n > 0) {
    reversed = reversed * 10 + (n % 10);
    n = Math.floor(n / 10);
  }
  return sign * reversed;
}

// ---------- base conversion ----------

const DIGIT_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

// Number -> string in base (2..36). O(log_base n).
function toBase(n, base) {
  if (n === 0) return '0';
  const negative = n < 0;
  n = Math.abs(n);
  const chars = [];
  while (n > 0) {
    chars.push(DIGIT_CHARS[n % base]); // lowest digit first
    n = Math.floor(n / base);
  }
  return (negative ? '-' : '') + chars.reverse().join('');
}

// String in base -> number. O(length).
function fromBase(str, base) {
  let value = 0;
  for (const ch of str.toLowerCase()) {
    value = value * base + DIGIT_CHARS.indexOf(ch); // shift left, add digit
  }
  return value;
}

// ---------- sum formulas ----------

function sumToN(n) {
  return (n * (n + 1)) / 2;
}

function sumOfSquares(n) {
  return (n * (n + 1) * (2 * n + 1)) / 6;
}

// first + (first + step) + ... for `count` terms
function arithmeticSeriesSum(first, step, count) {
  const last = first + step * (count - 1);
  return (count * (first + last)) / 2;
}

// ---------- squares & powers of two ----------

function isPerfectSquare(n) {
  if (n < 0) return false;
  const root = Math.floor(Math.sqrt(n));
  return root * root === n; // verify, do not trust float sqrt alone
}

// A power of two has exactly one set bit; n & (n - 1) clears the lowest set bit.
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// Largest integer x with x * x <= n, by binary search. O(log n).
function intSqrt(n) {
  if (n < 2) return n;
  let low = 1;
  let high = Math.floor(n / 2);
  let answer = 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (mid * mid <= n) {
      answer = mid;      // mid works; try bigger
      low = mid + 1;
    } else {
      high = mid - 1;    // mid too big
    }
  }
  return answer;
}

// ---------- self-test ----------
const assert = require('assert');

assert.strictEqual(gcd(48, 18), 6);
assert.strictEqual(gcd(17, 5), 1);
assert.strictEqual(gcd(0, 7), 7);
assert.strictEqual(gcd(-12, 8), 4);
assert.strictEqual(lcm(4, 6), 12);
assert.strictEqual(lcm(0, 5), 0);

assert.strictEqual(fastPow(2, 10), 1024);
assert.strictEqual(fastPow(3, 0), 1);
assert.strictEqual(fastPow(2, -2), 0.25);
assert.strictEqual(fastPow(-2, 3), -8);

assert.strictEqual(addMod(MOD - 1, 5), 4);
assert.strictEqual(subMod(3, 5), MOD - 2);
assert.strictEqual(mulMod(MOD - 1, MOD - 1), 1); // (-1)*(-1) = 1 mod p
assert.strictEqual(powMod(2, 10), 1024);
assert.strictEqual(powMod(2, 100), 976371285);
assert.strictEqual(mulMod(7, modInverse(7)), 1); // 7 * 7^-1 = 1
assert.strictEqual(powMod(-2, 3, 7), 6);          // -8 mod 7 = 6

assert.strictEqual(isPrime(1), false);
assert.strictEqual(isPrime(2), true);
assert.strictEqual(isPrime(97), true);
assert.strictEqual(isPrime(100), false);
assert.deepStrictEqual(sieve(20), [2, 3, 5, 7, 11, 13, 17, 19]);
assert.deepStrictEqual(sieve(1), []);
assert.strictEqual(sieve(100000).length, 9592);
assert.deepStrictEqual([...primeFactors(360)], [[2, 3], [3, 2], [5, 1]]);
assert.deepStrictEqual([...primeFactors(97)], [[97, 1]]);

assert.strictEqual(factorial(5), 120n);
assert.strictEqual(factorial(0), 1n);
assert.strictEqual(factorial(25), 15511210043330985984000000n);
assert.deepStrictEqual(pascalRow(4), [1, 4, 6, 4, 1]);
assert.deepStrictEqual(pascalRow(0), [1]);
assert.strictEqual(nCr(5, 2), 10);
assert.strictEqual(nCr(10, 0), 1);
assert.strictEqual(nCr(10, 11), 0);
assert.strictEqual(nCr(30, 15), 155117520);
assert.strictEqual(nCr(30, 15), pascalRow(30)[15]);

assert.deepStrictEqual(digits(1203), [1, 2, 0, 3]);
assert.deepStrictEqual(digits(0), [0]);
assert.strictEqual(digitSum(1203), 6);
assert.strictEqual(reverseDigits(120), 21);
assert.strictEqual(reverseDigits(-123), -321);
assert.strictEqual(reverseDigits(0), 0);

assert.strictEqual(toBase(255, 2), '11111111');
assert.strictEqual(toBase(255, 16), 'ff');
assert.strictEqual(toBase(-7, 7), '-10');
assert.strictEqual(toBase(0, 2), '0');
assert.strictEqual(fromBase('ff', 16), 255);
assert.strictEqual(fromBase('1010', 2), 10);
assert.strictEqual(fromBase(toBase(123456, 36), 36), 123456);

assert.strictEqual(sumToN(100), 5050);
assert.strictEqual(sumOfSquares(3), 14);
assert.strictEqual(arithmeticSeriesSum(2, 3, 4), 2 + 5 + 8 + 11);

assert.strictEqual(isPerfectSquare(49), true);
assert.strictEqual(isPerfectSquare(50), false);
assert.strictEqual(isPerfectSquare(0), true);
assert.strictEqual(isPerfectSquare(-4), false);
assert.strictEqual(isPowerOfTwo(1), true);
assert.strictEqual(isPowerOfTwo(1024), true);
assert.strictEqual(isPowerOfTwo(0), false);
assert.strictEqual(isPowerOfTwo(12), false);
assert.strictEqual(intSqrt(0), 0);
assert.strictEqual(intSqrt(1), 1);
assert.strictEqual(intSqrt(8), 2);
assert.strictEqual(intSqrt(2147395599), 46339);

console.log('✓ math-utils.js self-test passed');

module.exports = {
  MOD,
  gcd,
  lcm,
  fastPow,
  addMod,
  subMod,
  mulMod,
  powMod,
  modInverse,
  isPrime,
  sieve,
  primeFactors,
  factorial,
  pascalRow,
  nCr,
  digits,
  digitSum,
  reverseDigits,
  toBase,
  fromBase,
  sumToN,
  sumOfSquares,
  arithmeticSeriesSum,
  isPerfectSquare,
  isPowerOfTwo,
  intSqrt,
};
