# Math for DSA

A small set of math tools shows up again and again in coding interviews: greatest common
divisor, fast exponentiation, modular arithmetic, primes, combinations, digits and bases.
None of it is hard. Think of it like the multiplication table: you do not derive it every
time, you just know it, so your brain is free for the actual problem.

---

## Prerequisites

- [JavaScript For DSA](../../01_JavaScript_For_DSA/README.md): number precision, `Math.trunc`, `%` with negatives, `BigInt`.
- [Time Complexity](../../../01_Complexity_Analysis/01_Time_Complexity/README.md): why O(log n) algorithms like Euclid and fast power matter.

---

## Why it matters / when to use

- "Return the answer modulo 10^9 + 7" -> modular arithmetic
- "Compute x^n" with n up to 10^9 -> fast exponentiation (O(log n))
- "Count primes", "is prime", "prime factors" -> trial division or a sieve
- "Number of ways to choose k out of n" -> combinations, Pascal's triangle
- "Reverse the digits", "sum of digits", "is palindrome number" -> digit manipulation
- "Excel column", "base 7", "binary string" -> base conversion
- "Sum from 1 to n", "missing number" -> closed-form formulas instead of loops
- "Power of two", "perfect square", "sqrt" -> bit tricks and binary search
- GCD/LCM appear in array problems (rotations, tiling, fractions) and in reducing fractions

---

## How it works

All helpers below are implemented and tested in `02_Implementations/math_utils.js`.

### GCD and LCM (Euclid)

The greatest common divisor of `a` and `b` is the same as gcd of `b` and `a mod b`, because any
common divisor of both also divides the remainder. Repeat until the remainder is 0.

```
gcd(48, 18): 48 % 18 = 12 -> gcd(18, 12): 18 % 12 = 6 -> gcd(12, 6): 12 % 6 = 0 -> 6
```

```js
function gcd(a, b) { while (b !== 0) [a, b] = [b, a % b]; return Math.abs(a); }
function lcm(a, b) { return (a / gcd(a, b)) * b; }   // divide first to avoid overflow
```
Time O(log(min(a, b))): the numbers shrink at least by half every two steps.

### Fast exponentiation (binary exponentiation)

`x^n` by multiplying n times is O(n). Instead, square and halve: `x^10 = (x^5)^2`,
`x^5 = x * (x^2)^2`. Every step halves n -> O(log n).

```js
function fastPow(base, exponent) {
  let result = 1;
  while (exponent > 0) {
    if (exponent & 1) result *= base;   // odd: take one factor out
    base *= base;                       // square
    exponent >>= 1;                     // halve
  }
  return result;
}
```

Dry run x=2, n=10 (binary 1010):
```
n=10 even: base=4,   result=1
n=5  odd : result=4, base=16
n=2 even : base=256, result=4
n=1 odd  : result=4*256=1024, base=65536
n=0 stop -> 1024
```

### Modular arithmetic and why 1e9+7

Answers can get huge (counts of paths, number of ways). Problems ask for the answer **mod
1,000,000,007** so it fits in a normal integer. Why that number? It is prime (so division
via modular inverse works), it is below 2^30 (so a sum of two values stays below 2^31), and
`(1e9+7)^2` is about 10^18, which is still below 2^63 in languages with 64-bit ints.

In JS, `(1e9+7) * (1e9+7)` is about 10^18, which is **above** `MAX_SAFE_INTEGER` (9 * 10^15).
So multiplying two values under the modulus can lose precision. Options:
- use `BigInt` for the multiply, or
- split one factor into high and low 16-bit halves (see `mulMod` in `02_Implementations/math_utils.js`).

Rules (all keep the result in [0, m)):
```js
addMod(a, b) = (a + b) % m
subMod(a, b) = ((a - b) % m + m) % m        // JS % can be negative
mulMod(a, b) = (a * b) % m                  // careful: overflow, see above
powMod(x, n) = fast exponentiation with mulMod at every step
```

Take the mod **at every step**, not only at the end, so values stay small.

### Primes

**Trial division** - is n prime? Check divisors up to sqrt(n). If n = a * b and a <= b then
a <= sqrt(n), so a divisor would have been found. O(sqrt n).

```js
function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}
```

**Sieve of Eratosthenes** - all primes below n. Start with everyone "prime", then for each
prime p cross out p*p, p*p+p, ... (smaller multiples were crossed out by smaller primes).
O(n log log n), practically O(n).

```
n=20   2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19
p=2    cross 4 6 8 10 12 14 16 18
p=3    cross 9 15 (6, 12, 18 already)
p=5    5*5=25 > 20 stop.   primes: 2 3 5 7 11 13 17 19
```

### Factorials and combinations

`n! = n * (n-1) * ... * 1`. Grows very fast: 21! > MAX_SAFE_INTEGER. Use `BigInt` or mod.

`C(n, k)` = ways to choose k items from n = `n! / (k! (n-k)!)`. Computing factorials overflows,
so build Pascal's triangle instead: `C(n, k) = C(n-1, k-1) + C(n-1, k)`.

```
        1
      1   1
    1   2   1
  1   3   3   1
1   4   6   4   1      row n, column k = C(n, k)
```
Or multiply step by step: `C(n, k) = C(n, k-1) * (n - k + 1) / k` (stays an integer at each step).

### Digit manipulation

```js
let sum = 0, reversed = 0;
while (n > 0) {
  const digit = n % 10;        // last digit
  sum += digit;
  reversed = reversed * 10 + digit;
  n = Math.floor(n / 10);      // drop the last digit
}
```
Number of digits = `Math.floor(Math.log10(n)) + 1` (n > 0) or `String(n).length`.

### Base conversion

Number -> base b: repeatedly take `n % b` (that is the lowest digit) and divide. The digits
come out reversed. Base b -> number: `value = value * b + digit` reading left to right.
Excel columns are base 26 but **without a zero** (A=1 ... Z=26), so subtract 1 before dividing.

### Sum formulas

| Series | Formula |
|---|---|
| 1 + 2 + ... + n | n(n+1)/2 |
| a + (a+d) + ... (k terms) | k * (first + last) / 2 |
| 1^2 + 2^2 + ... + n^2 | n(n+1)(2n+1)/6 |
| 1 + 2 + 4 + ... + 2^k | 2^(k+1) - 1 |
| 1 + r + r^2 + ... + r^k | (r^(k+1) - 1) / (r - 1) |

Use the formula to turn an O(n) loop into O(1), e.g. Missing Number = expected sum - actual sum.

### Perfect square, power of two, sqrt

```js
Number.isInteger(Math.sqrt(n));          // perfect square (fine for n < 2^52)
n > 0 && (n & (n - 1)) === 0;            // power of two (clears lowest set bit)
// integer sqrt without Math.sqrt: binary search for the largest x with x*x <= n (see problem 07)
```

---

## Pseudocode

```
GCD (Euclid)                          FAST POWER (x^n mod m)
gcd(a, b):                            result <- 1; base <- x mod m
    while b != 0:                     while n > 0:
        (a, b) <- (b, a mod b)            if n is odd: result <- result * base mod m
    return |a|                            base <- base * base mod m
                                          n <- floor(n / 2)
SIEVE OF ERATOSTHENES (primes < n)    return result
isPrime[0..n-1] <- true; isPrime[0] <- isPrime[1] <- false
for i from 2 while i * i < n:
    if isPrime[i]: for j from i*i to n-1 step i: isPrime[j] <- false
```

---

## Dry run on a concrete example

Euclid on `gcd(48, 18)`:

| step | a | b | a mod b |
|---|---|---|---|
| 1 | 48 | 18 | 12 |
| 2 | 18 | 12 | 6 |
| 3 | 12 | 6 | 0 |
| 4 | 6 | 0 | - (stop) |

Answer 6. Each step at least halves the larger number every two steps, so it runs in O(log min(a, b)). Then `lcm(48, 18) = 48 / 6 * 18 = 144` (divide first to keep the numbers small).

---

## Operations & complexity

| Operation | Time | Space | Note |
|---|---|---|---|
| gcd(a, b) | O(log min(a,b)) | O(1) | Euclid |
| fastPow(x, n) | O(log n) | O(1) | |
| isPrime(n) trial division | O(sqrt n) | O(1) | |
| sieve(n) | O(n log log n) | O(n) | boolean array |
| nCr via Pascal row | O(n * k) | O(k) | or O(k) multiplicative |
| digit loop on n | O(number of digits) = O(log10 n) | O(1) | |
| base conversion | O(log_b n) | O(log_b n) | output size |
| sum formulas | O(1) | O(1) | |
| powMod(x, n, m) | O(log n) | O(1) | mulMod inside |

---

## JavaScript implementation

`02_Implementations/math_utils.js` exports: `gcd`, `lcm`, `fastPow`, `addMod`, `subMod`, `mulMod`, `powMod`,
`modInverse`, `isPrime`, `sieve`, `factorial` (BigInt), `nCr` (Pascal), `pascalRow`,
`digits`, `digitSum`, `reverseDigits`, `toBase`, `fromBase`, `sumToN`, `sumOfSquares`,
`arithmeticSeriesSum`, `isPerfectSquare`, `isPowerOfTwo`, `intSqrt`.

```js
const { gcd, powMod, sieve, nCr } = require('../02_Implementations/math_utils');
gcd(48, 18);          // 6
powMod(2, 100, 1e9 + 7); // 976371285
sieve(20);            // [2, 3, 5, 7, 11, 13, 17, 19]
nCr(5, 2);            // 10
```

---

## Patterns / variations

### 1. Peel digits from the right

```js
function reverseDigits(n) {
  let result = 0;
  while (n > 0) { result = result * 10 + (n % 10); n = Math.floor(n / 10); }
  return result;
}
```
Use when: reverse integer, palindrome number, digit sum, happy number.

### 2. Square-and-halve (fast power)

Use when: x^n, matrix power (fibonacci in O(log n)), modular exponent, "n up to 10^9".

### 3. Sieve once, answer many queries

```js
const isComposite = new Uint8Array(limit + 1);
for (let p = 2; p * p <= limit; p++)
  if (!isComposite[p]) for (let multiple = p * p; multiple <= limit; multiple += p) isComposite[multiple] = 1;
```
Use when: count primes, prime checks in a loop, smallest prime factor.

### 4. Closed form instead of loop

Missing number = `n(n+1)/2 - sum(nums)`. Trailing zeroes of n! = `n/5 + n/25 + n/125 ...`.
Digital root = `1 + (n - 1) % 9`. Use when: a loop computes something with a known formula.

### 5. Cycle detection on a number sequence (Floyd)

```js
let slow = n, fast = n;
do { slow = next(slow); fast = next(next(fast)); } while (slow !== fast);
```
Use when: happy number, "does this process loop forever?". Same trick as linked-list cycles.

### 6. Binary search on the answer

Find the largest x with `x * x <= n` by searching x in [0, n]. Use when: sqrt, "minimum
speed / capacity such that ...". Full treatment in `10_Searching`.

---

## Alternatives and trade-offs

| Task | Naive | Better | Notes |
|---|---|---|---|
| x^n | multiply n times, O(n) | fast power, O(log n) | needed when n is up to 10^9 or more |
| Is n prime? | try all divisors, O(n) | try up to √n, O(√n) | for many queries use a sieve |
| All primes below n | test each, O(n√n) | sieve, O(n log log n) | sieve needs O(n) memory |
| nCr mod p | Pascal's triangle O(n·r) | factorials + modular inverse, O(1) per query after O(n) setup | inverse needs p prime |
| Sum 1..n | loop O(n) | n(n+1)/2, O(1) | watch overflow beyond 2^53 |

---

## Common mistakes & edge cases

- `-7 % 3` is `-1` in JS. Use `((x % m) + m) % m` when the result must be non-negative.
- `(a * b) % m` overflows above 2^53. Use `BigInt` or `mulMod`.
- `n / 2` in JS is a float. Use `Math.floor`, `Math.trunc`, or `>> 1` (only below 2^31).
- Factorials: 21! is already beyond `MAX_SAFE_INTEGER`.
- `Math.sqrt` on huge numbers can be off by one float error; verify with `mid * mid`.
- `isPrime(1)` is false, `isPrime(2)` is true. Handle n < 2 first.
- Sieve: start crossing out at `p * p`, not `2 * p`, and only up to `sqrt(n)`.
- Reverse Integer: check 32-bit overflow `[-2^31, 2^31 - 1]`; JS numbers do not overflow by themselves.
- Negative numbers in digit loops: take `Math.abs` first, re-apply the sign at the end.
- Excel columns are 1-based: `'Z'` is 26, `'AA'` is 27, not 26.

---

## When this does NOT apply

- **Exact results above 2^53 - 1** (about 9 × 10^15): plain `Number` loses precision. Use `BigInt` or keep values reduced modulo m.
- **Modular division** only works with a modular inverse, which needs the divisor and the modulus to be coprime (true when m is prime and the divisor is not a multiple of m).
- **Floating-point math** (`Math.sqrt`, `Math.log`) can be off by one for large integers; verify with integer arithmetic.
- **Sieves** need memory proportional to n; for a single huge n, use trial division up to √n instead.

---

## Interview tips

- When you see "mod 10^9+7", say "I'll take the mod at every addition and multiplication to avoid overflow".
- For "x^n with large n", say "binary exponentiation, O(log n)" before writing it.
- For prime counting, say "sieve, O(n log log n)" and explain starting at p*p.
- For digit problems, write the `% 10` / `floor(/10)` loop immediately; it is the same every time.
- Know the three formulas: 1..n sum, sum of squares, geometric sum.
- For sqrt, offer the binary-search version. It shows you know the pattern even here.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Palindrome Number | Easy | digit reversal | 03_Problems/solutions/01_palindrome_number.js |
| 02 | Reverse Integer | Medium | digit reversal + overflow | 03_Problems/solutions/02_reverse_integer.js |
| 03 | Excel Sheet Column Number & Title | Easy | base conversion (bijective base 26) | 03_Problems/solutions/03_excel_sheet_column_number.js |
| 04 | Add Digits | Easy | digital root formula | 03_Problems/solutions/04_add_digits.js |
| 05 | Happy Number | Easy | Floyd cycle detection | 03_Problems/solutions/05_happy_number.js |
| 06 | Pow(x, n) | Medium | fast exponentiation | 03_Problems/solutions/06_pow_x_n.js |
| 07 | Sqrt(x) | Easy | binary search on the answer | 03_Problems/solutions/07_sqrt_x.js |
| 08 | Count Primes | Medium | Sieve of Eratosthenes | 03_Problems/solutions/08_count_primes.js |
| 09 | Factorial Trailing Zeroes | Medium | counting factors of 5 | 03_Problems/solutions/09_factorial_trailing_zeroes.js |

---

## Practice more

Easy: Plus One (66), Power of Two (231), Power of Three (326), Fizz Buzz (412),
Valid Perfect Square (367), Self Dividing Numbers (728), Ugly Number (263),
Add Binary (67), Number of 1 Bits (191), Sum of Two Integers (371)

Medium: Integer to Roman (12), Fraction to Recurring Decimal (166), Multiply Strings (43),
Super Pow (372), Nth Digit (400), Divide Two Integers (29), Bulb Switcher (319),
Count Numbers with Unique Digits (357), Perfect Squares (279), Integer Break (343)

Hard: Max Points on a Line (149, uses gcd), Basic Calculator (224)
