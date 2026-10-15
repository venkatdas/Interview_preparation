# Number Theory

Number theory is the study of whole numbers: which numbers divide which, how numbers break into
primes, and how arithmetic behaves when you only keep the remainder ("mod"). In interviews it shows
up as primes, divisors, gcd tricks and "return the answer modulo 1e9 + 7". In competitive
programming it goes further: modular inverses, the Chinese Remainder Theorem and Miller–Rabin.

> **Already covered in Foundations** — [00_Foundations/04_Mathematics_For_DSA](../../00_Foundations/04_Mathematics_For_DSA/01_Concepts/CONCEPTS.md):
> gcd/lcm, fast power, the basic sieve, nCr, digit tricks, base conversion basics.
> This topic assumes those and goes deeper. Re-read that guide first if any of them feel shaky.

**How the content is labelled**

| Label | Meaning |
|---|---|
| **[Essential]** | Expected in FAANG-style interviews. Know it cold. |
| **[Advanced — competitive programming]** | Rare in interviews; common on Codeforces/AtCoder, in hard OAs, and in "follow-up" questions. Learn after the essentials. |

---

## 1. Prerequisites

- [Mathematics for DSA (Foundations)](../../00_Foundations/04_Mathematics_For_DSA/README.md) — gcd, fast pow, sieve, modular arithmetic basics
- [Complexity Analysis](../../01_Complexity_Analysis/) — O(sqrt n), O(log n), O(n log log n)
- [Searching](../../10_Searching/README.md) — binary search on the answer (used in problem 11)
- [Hashing](../../05_Hashing/README.md) — remainder maps (problem 04)

---

## 2. Intuition

Every integer bigger than 1 is built from primes in exactly one way, like a molecule built from atoms:
`360 = 2^3 * 3^2 * 5`. Once you know the "atoms", many questions become counting questions:

- How many divisors does 360 have? Pick how many 2s (0..3), 3s (0..2) and 5s (0..1): `4 * 3 * 2 = 24`.
- Do 12 and 35 share a factor? Their atoms {2, 3} and {5, 7} don't overlap, so gcd = 1.

The second big idea is **working mod m**: keep only remainders. Clock arithmetic is mod 12. Remainders
stay small, so we can compute with astronomically large numbers (like `2^(10^18)`) without storing them.

---

## 3. Mental model / analogy + ASCII visual

**Primes are atoms, factorization is the molecule formula.**

```
          360
         /   \
        2     180
             /   \
            2     90
                 /  \
                2    45
                    /  \
                   3    15
                       /  \
                      3    5        360 = 2^3 * 3^2 * 5^1
```

**Mod m is a clock with m positions.** Adding moves you around the clock; multiplying is repeated adding.

```
mod 7 clock:         0
                 6       1
               5           2
                  4     3
   5 + 4 = 9  -> lands on 2      (9 mod 7 = 2)
   3 * 5 = 15 -> lands on 1      (so 5 is the "inverse" of 3 mod 7)
```

**Sieve = crossing out multiples.**

```
2  3  [4]  5  [6]  7  [8]  [9]  [10]  11  [12]  13  [14]  [15]  ...
       ^ crossed by 2        ^ crossed by 3
```

---

## 4. Why it exists (what problem it solves)

| Problem you meet | Number-theory tool |
|---|---|
| Answers are huge, the problem says "mod 1e9 + 7" | modular arithmetic, **exact** mulMod, powMod |
| You need to DIVIDE under a modulus (nCr mod p, averages, probabilities) | modular inverse (Fermat or extended Euclid) |
| Many numbers to factorize | smallest-prime-factor (spf) sieve |
| Primes in [L, R] with R = 1e12 | segmented sieve |
| "Can we reach exactly T using steps of a and b?" | gcd / Bezout |
| Several "x mod m_i = r_i" conditions at once | Chinese Remainder Theorem |
| Is this 64-bit number prime? | Miller–Rabin |
| Count numbers coprime to n, or reduce giant exponents | Euler's totient |

---

## 5. How it works, step by step

### 5.1 Divisibility basics [Essential]

- `a | b` ("a divides b") means `b % a === 0`.
- Divisors come in pairs `(d, n/d)` with one of them `<= sqrt(n)`. That is why trial division stops at `sqrt(n)`.
- Useful rules: divisible by 3/9 iff the digit sum is; by 11 iff the alternating digit sum is
  (so every even-length palindrome is divisible by 11 — problem 09); by 2^k iff the last k bits are 0.
- `gcd(a, b) = gcd(b, a mod b)` (Euclid). `lcm(a, b) = a / gcd(a, b) * b` — divide first to avoid overflow.

### 5.2 Prime factorization [Essential]

**Trial division — O(sqrt n).** Divide by 2, then odd d while `d*d <= n`. Whatever is left above 1 is
a single prime larger than the original square root.

**Smallest-prime-factor (spf) sieve — O(n) once, then O(log x) per number.** Store `spf[x]` for all
`x <= N`. To factorize x: repeatedly take `p = spf[x]` and divide. Each division at least halves x,
hence O(log x). The **linear sieve** builds spf so that each composite is written exactly once, by its
smallest prime.

```
linear sieve:
for i in 2..N:
  if spf[i] == 0: spf[i] = i; primes.push(i)
  for p in primes while p <= spf[i] and p*i <= N:
    spf[p*i] = p
```

### 5.3 Sieve of Eratosthenes, optimized [Essential] and segmented [Advanced — competitive programming]

- Start crossing at `p*p` (smaller multiples were already crossed by smaller primes).
- Store odds only and use `Uint8Array` (problem 02): half the memory, 8x less than a boolean `Array`.
- **Segmented sieve** for `[L, R]` with huge R but small `R - L`: sieve primes up to `sqrt(R)` normally,
  then cross out their multiples inside a window array of size `R - L + 1`. The first multiple of p in
  the window is `max(p*p, ceil(L/p)*p)`.

### 5.4 Divisor counting and sums [Essential]

If `n = p1^e1 * p2^e2 * ... * pk^ek`:

```
number of divisors   d(n)     = (e1 + 1)(e2 + 1)...(ek + 1)
sum of divisors      sigma(n) = prod (p^(e+1) - 1) / (p - 1)
```

For all n up to N at once: for each i, add to every multiple of i — `N/1 + N/2 + ... = O(N log N)`.

### 5.5 Trailing zeros of n! [Essential] (any base: [Advanced — competitive programming])

A trailing zero in base 10 needs one factor 10 = 2 * 5, and 2s are always more common, so count 5s.
**Legendre's formula**: the exponent of prime p in n! is `floor(n/p) + floor(n/p^2) + ...`.
For base b = prod p^a, the answer is `min over p of floor(legendre(n, p) / a)`.

### 5.6 Euler's totient [Advanced — competitive programming]

`phi(n)` = how many k in 1..n have `gcd(k, n) = 1`. Formula: `phi(n) = n * prod (1 - 1/p)` over primes p | n.
Euler's theorem: if `gcd(a, m) = 1` then `a^phi(m) ≡ 1 (mod m)`. Fermat's little theorem is the special
case m = p prime: `a^(p-1) ≡ 1`. This lets you reduce huge exponents mod phi(m) — **only** when a and m
are coprime (problem 08 shows the trap).

### 5.7 Extended Euclid and Bezout [Essential idea, Advanced details]

**Bezout**: for any a, b there are integers x, y with `a*x + b*y = gcd(a, b)`, and the values `a*x + b*y`
are exactly the multiples of gcd. (Problem 05, Water and Jug.)

**Extended Euclid** finds x and y while running Euclid. Iteratively: keep (r, s, t) with `r = a*s + b*t`
true for both rows; each step subtracts q times the newer row from the older.

```
a=240, b=46
  q   r     s     t
      240   1     0
      46    0     1
  5   10    1    -5
  4   6    -4    21
  1   4     5   -26
  1   2    -9    47      -> gcd 2 = 240*(-9) + 46*47
  2   0
```

### 5.8 Modular inverse [Essential for "mod 1e9+7" problems]

The inverse of a mod m is x with `a*x ≡ 1 (mod m)`. It exists iff `gcd(a, m) = 1`.

| Method | Works when | Cost |
|---|---|---|
| Fermat: `a^(m-2) mod m` | m is **prime** | O(log m) |
| Extended Euclid: x from `a*x + m*y = 1` | any m, gcd = 1 | O(log m) |
| Linear table `inv[i] = -(m/i) * inv[m % i]` | m prime, all i < m up to n | O(n) total |
| Batch (prefix products) | many arbitrary values | O(k + log m) |

Division under mod: `a / b ≡ a * inv(b) (mod m)`.

### 5.9 Modular exponentiation and THE 2^53 TRAP [Essential — this bites JavaScript developers]

JavaScript `Number` is a 64-bit float. Integers are exact only up to `2^53 - 1 ≈ 9.007e15`.
With `MOD = 1e9 + 7`, two residues can each be nearly `1e9`, so their product is nearly `1e18` —
**way past 2^53**. The multiplication silently rounds, and `% MOD` then gives a wrong answer:

```js
const MOD = 1e9 + 7, a = MOD - 1;           // a ≡ -1, so a*a ≡ 1
(a * a) % MOD                                // 999999972   <-- WRONG, no error thrown
Number(BigInt(a) * BigInt(a) % BigInt(MOD))  // 1           <-- correct
```

Four exact fixes (all in [number_theory.js](../02_Implementations/number_theory.js)):

1. **BigInt** — simplest, always right, roughly 10–50x slower. Fine for a few million operations.
2. **Split multiplication** (m <= 2^32): write `b = hi * 2^16 + lo`. Then
   `a*b mod m = ((a*hi mod m) * 2^16 + a*lo) mod m`. Every intermediate is below 2^49, so it is exact.
3. **Double-and-add** (m < 2^52): build a*b from additions of values below m. O(log b).
4. **Fast path**: if `a * b <= Number.MAX_SAFE_INTEGER` the float product is exact — use it directly.

Products that are safe: anything mod 1337 (problem 08), `n * min(a,b) <= 4e13` (problem 11),
`int32 * 10` (problem 04). Products that are **not**: residue * residue mod 1e9+7 or 998244353.

`Math.imul` is NOT a fix: it multiplies modulo 2^32, which is a different modulus.

### 5.10 Chinese Remainder Theorem [Advanced — competitive programming]

Solve `x ≡ r1 (mod m1)`, `x ≡ r2 (mod m2)`, ... If the moduli are pairwise coprime there is exactly one
solution modulo `M = m1 * m2 * ...`. General merge of two congruences (moduli need not be coprime):

```
x = r1 + m1*k  must satisfy  m1*k ≡ r2 - r1 (mod m2)
g = gcd(m1, m2); if (r2 - r1) % g != 0 -> no solution
k = ((r2 - r1)/g) * inv(m1/g, m2/g)  mod (m2/g)
new r = r1 + m1*k,  new m = lcm(m1, m2)
```

The combined modulus grows multiplicatively, so the implementation uses BigInt throughout.

### 5.11 Miller–Rabin primality test [Advanced — competitive programming]

Trial division is O(sqrt n): fine for 1e12, hopeless for 1e18. Miller–Rabin writes `n - 1 = d * 2^s` and,
for a base a, checks `a^d ≡ 1` or `a^(d*2^r) ≡ -1` for some `r < s`. A prime always passes; a composite
fails for at least 3/4 of bases. With the first 12 primes as bases the test is **deterministic for every
n < 3.3e24** (so all 64-bit numbers). The squares exceed 2^53, so we use **BigInt**.
Carmichael numbers like 561 fool the plain Fermat test but not Miller–Rabin.

### 5.12 Base conversion [Essential]

To base b: repeatedly take `n % b` (next digit from the right) and `n = floor(n / b)`.
From base b: Horner's rule `n = n*b + digit`. Negative bases (LeetCode 1017): if the remainder comes out
negative, add |b| to it and add 1 to the quotient.

---

## 6. Pseudocode

```
powMod(base, e, m):            # binary exponentiation
  result = 1; base = base mod m
  while e > 0:
    if e is odd: result = mulMod(result, base, m)
    base = mulMod(base, base, m); e = floor(e / 2)
  return result

extGcd(a, b):                  # returns g, x, y with a*x + b*y = g
  (r0, r1, s0, s1, t0, t1) = (a, b, 1, 0, 0, 1)
  while r1 != 0:
    q = floor(r0 / r1)
    (r0, r1) = (r1, r0 - q*r1); (s0, s1) = (s1, s0 - q*s1); (t0, t1) = (t1, t0 - q*t1)
  return r0, s0, t0

segmentedSieve(L, R):
  base = primes up to sqrt(R)
  mark = array of size R-L+1, all "prime"
  for p in base: for j from max(p*p, ceil(L/p)*p) to R step p: mark[j-L] = composite
  return all unmarked j in [max(L,2), R]
```

---

## 7. JavaScript implementation

Everything lives in [02_Implementations/number_theory.js](../02_Implementations/number_theory.js)
(run it: `node 02_Implementations/number_theory.js`). The core piece every "mod" problem needs:

```js
function mulMod(a, b, m) {
  a = ((a % m) + m) % m; b = ((b % m) + m) % m;
  const p = a * b;
  if (p <= Number.MAX_SAFE_INTEGER) return p % m;      // exact
  if (m <= 2 ** 32) {                                   // split b into 16-bit halves
    const hi = Math.floor(b / 65536), lo = b % 65536;
    return (((a * hi) % m) * 65536 + a * lo) % m;
  }
  return Number((BigInt(a) * BigInt(b)) % BigInt(m));   // last resort
}
```

Exports: `gcd, lcm, extendedGcd, mulMod (+ Naive/BigInt/Split/Doubling variants), powMod, powModBig,
modInverse, modInverseFermat, modInverseTable, isPrime, sieve, primesUpTo, smallestPrimeFactorSieve,
factorizeWithSpf, primeFactorization, segmentedSieve, millerRabin, eulerPhi, phiSieve, crt,
listDivisors, countDivisors, sumDivisors, divisorCountSieve, legendre, trailingZerosOfFactorial,
toBase, fromBase, toNegativeBase`.

---

## 8. Dry run on a concrete example

**Modular inverse of 3 mod 11 with extended Euclid** (a = 3, b = 11):

| step | q | old_r | r | old_s | s | invariant check `old_r = 3*old_s + 11*old_t` |
|---|---|---|---|---|---|---|
| start | – | 3 | 11 | 1 | 0 | 3 = 3*1 + 11*0 |
| 1 | 0 | 11 | 3 | 0 | 1 | 11 = 3*0 + 11*1 |
| 2 | 3 | 3 | 2 | 1 | -3 | 3 = 3*1 |
| 3 | 1 | 2 | 1 | -3 | 4 | 2 = 3*(-3) + 11*1 |
| 4 | 2 | 1 | 0 | 4 | -11 | 1 = 3*4 + 11*(-1) |

gcd = 1 and x = 4, so `3^-1 ≡ 4 (mod 11)`. Check: `3 * 4 = 12 ≡ 1`. Fermat agrees: `3^9 mod 11 = 4`.

**powMod(3, 13, 7)** (13 = binary 1101):

| e | e odd? | result | base |
|---|---|---|---|
| 13 | yes | 1*3 = 3 | 3^2 = 9 ≡ 2 |
| 6 | no | 3 | 2^2 = 4 |
| 3 | yes | 3*4 = 12 ≡ 5 | 4^2 = 16 ≡ 2 |
| 1 | yes | 5*2 = 10 ≡ 3 | – |

`3^13 mod 7 = 3` (check: 3^6 ≡ 1 by Fermat, so 3^13 = 3^12 * 3 ≡ 3).

**CRT** `x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)`:

| merge | r | m |
|---|---|---|
| start | 0 | 1 |
| with (2, 3) | 2 | 3 |
| with (3, 5): 3k ≡ 1 (mod 5) -> k = 2 | 2 + 3*2 = 8 | 15 |
| with (2, 7): 15k ≡ -6 ≡ 1 (mod 7) -> k = 1 | 8 + 15 = 23 | 105 |

---

## 9. Edge cases

- 0 and 1 are neither prime nor composite. Factorization of 1 is empty; `d(1) = 1`.
- Negative numbers: `-7 % 3 === -1` in JS. Normalize with `((x % m) + m) % m`.
- `powMod(x, 0, m)` is 1 — except when m = 1, where everything is 0.
- Inverse does not exist when `gcd(a, m) != 1` (e.g. 6 mod 9). Fermat with a non-prime m gives garbage, not an error.
- `lcm` of large values: compute `a / gcd * b`, and check it stays below 2^53.
- Sieve bounds: "less than n" vs "at most n".
- Anything mod 1e9+7 that multiplies two residues: **2^53 trap**.

---

## 10. Complexity analysis

| Operation | Time | Space | Why |
|---|---|---|---|
| gcd / extended gcd | O(log min(a,b)) | O(1) | remainders shrink at least as fast as Fibonacci numbers |
| powMod | O(log e) | O(1) | one squaring per bit of the exponent |
| mulMod (split) | O(1) | O(1) | a constant number of exact float operations |
| mulMod (doubling) | O(log b) | O(1) | one addition per bit |
| Trial-division factorization / isPrime | O(sqrt n) | O(1) | divisors pair up around sqrt n |
| Sieve of Eratosthenes | O(n log log n) | O(n) | sum of n/p over primes p |
| Linear spf sieve | O(n) | O(n) | each composite set once |
| Factorize with spf | O(log x) | O(1) | each step at least halves x |
| Segmented sieve [L,R] | O((R-L) log log R + sqrt R) | O(R-L + sqrt R) | only the window is stored |
| Euler phi (single) | O(sqrt n) | O(1) | needs the distinct primes |
| phi sieve 1..n | O(n log log n) | O(n) | like the sieve |
| Divisor-count sieve 1..n | O(n log n) | O(n) | harmonic series n/1 + n/2 + ... |
| Inverse table 1..n | O(n) | O(n) | each entry from an earlier one |
| CRT with k congruences | O(k log M) | O(1) | one extended gcd per merge |
| Miller–Rabin (12 bases) | O(12 * log^3 n) with BigInt | O(1) | 12 modular exponentiations |

---

## 11. Alternatives (brute force vs optimized, trade-offs)

| Task | Brute force | Better | When the brute force is fine |
|---|---|---|---|
| Primes below n | trial division each | sieve | n <= 1e4 |
| Factorize many numbers | trial division each | spf sieve | few numbers, or values > 1e7 (spf memory) |
| Primes in [1e12, 1e12+1e6] | trial division | segmented sieve | a handful of numbers |
| Is a 1e18 number prime? | trial division (1e9 steps) | Miller–Rabin | never |
| Inverse | try every x | ext. Euclid / Fermat | never |
| mulMod with 1e9+7 | `(a*b) % m` (WRONG) | split / BigInt | only if you proved a*b < 2^53 |
| Divisor sums | enumerate divisors | formula from factorization | single small n |

---

## 12. Common mistakes (and why they happen)

1. **`(a * b) % MOD` with MOD = 1e9+7.** Habit from C++/Java where 64-bit ints are exact. In JS the product is a float; precision is gone above 2^53. Use `mulMod`.
2. **Using Fermat's inverse with a composite modulus.** Fermat needs a prime. Use extended Euclid.
3. **Reducing an exponent mod phi(m) when gcd(a, m) != 1.** Euler's theorem requires coprimality.
4. **Negative remainders.** JS `%` keeps the sign of the dividend. Normalize.
5. **`lcm = a * b / gcd`** — multiplies first and can overflow. Divide first.
6. **Sieve inner loop starting at 2p or p.** 2p is just slower; p marks the prime itself as composite.
7. **Counting distinct primes when multiplicity matters** (problem 07) or vice versa.
8. **Bitwise ops on large numbers.** `x >> 1` and `x & 1` truncate to 32 bits. Use `Math.floor(x / 2)` and `x % 2` for exponents above 2^31.

---

## 13. Patterns / variations with templates

### Pattern A — "sieve once, answer many" [Essential]
```js
const spf = smallestPrimeFactorSieve(MAX);
for (const x of queries) { const f = factorizeWithSpf(x, spf); /* ... */ }
```
Problems: 03, 07; Largest Component Size by Common Factor (LC 952).

### Pattern B — divide under a prime modulus [Essential]
```js
const ans = mulMod(numerator, modInverseFermat(denominator, MOD), MOD);
```
Problems: 10; nCr mod p and probabilities mod p (37_Combinatorics, 38_Probability_And_Randomization).

### Pattern C — gcd/Bezout reachability [Essential]
"Using steps of size a and b (forwards/backwards), can you hit T?" -> `T % gcd(a, b) === 0` (plus range limits).
Problems: 05; Check If It Is a Good Array (LC 1250).

### Pattern D — inclusion–exclusion with lcm + binary search [Essential]
```js
const count = x => Math.floor(x / a) + Math.floor(x / b) - Math.floor(x / lcm(a, b));
```
Problems: 11; Ugly Number III (LC 1201).

### Pattern E — cycle in remainders [Essential]
There are only m remainders, so any process "rem = f(rem) mod m" repeats within m steps.
Problems: 04; Smallest Integer Divisible by K (LC 1015).

### Pattern F — exact power with a huge exponent [Essential / Advanced]
Horner on digit arrays (problem 08), exponent reduction via Euler when coprime, `powModBig` for m > 2^32.

### Pattern G — CRT / Miller–Rabin / segmented sieve [Advanced — competitive programming]
Reach for these when values exceed 1e12 or the problem mixes several moduli.

---

## 14. Recognition clues

**Use number theory when you see:**
- "prime", "divisor", "factor", "coprime", "gcd", "lcm", "multiple of"
- "return the answer modulo 1e9 + 7" (then: exact mulMod, and inverses if you divide)
- "divisible by a or b", "k-th number with property" over multiples
- huge exponents, digit-array exponents, "last digits of"
- reachability with fixed step sizes (jugs, frog jumps on a circle)

**It does NOT apply / is the wrong tool when:**
- Values are small and few: just brute force; a sieve of 1e7 for 3 queries is wasted setup.
- The modulus is not part of the problem — don't invent one.
- "Divisible" questions about **subarray sums** -> prefix sums + remainder hashing ([08_Prefix_Sums](../../08_Prefix_Sums_And_Difference_Arrays/README.md)), not factorization.
- Floating-point geometry or probabilities without a modulus -> [39_Geometric_Algorithms](../../39_Geometric_Algorithms/README.md) or plain doubles.

---

## 15. Interview application (talk track, what to clarify)

1. **Clarify the ranges.** "What is the max value? How many queries?" This decides trial division vs sieve vs Miller–Rabin.
2. **Clarify the modulus.** "Is the modulus prime?" (decides Fermat vs extended Euclid). "Do we take mod at the end only?"
3. **Mention the JS pitfall unprompted.** "In JavaScript, a product of two residues mod 1e9+7 can exceed 2^53, so I'll use a safe mulMod (or BigInt)." Interviewers notice this.
4. **State the math in one sentence, then code.** "Even-length palindromes are divisible by 11, so I only generate odd lengths."
5. **Give complexity in terms of the value, not just n.** O(sqrt V), O(V log log V).
6. **Test with tiny cases** (0, 1, 2, a prime, a prime power, a perfect square).

---

## 16. Problems in this topic + practice more

| # | Problem | Difficulty | Level | Pattern | Solution |
|---|---|---|---|---|---|
| 01 | [Ugly Number](../03_Problems/01_Easy/01_ugly_number.md) | Easy | Essential | divide out primes | [js](../03_Problems/solutions/01_ugly_number.js) |
| 02 | [Count Primes (odd-only sieve)](../03_Problems/02_Medium/02_count_primes.md) | Medium | Essential | sieve | [js](../03_Problems/solutions/02_count_primes.js) |
| 03 | [Four Divisors](../03_Problems/02_Medium/03_four_divisors.md) | Medium | Essential | spf + divisor formula | [js](../03_Problems/solutions/03_four_divisors.js) |
| 04 | [Fraction to Recurring Decimal](../03_Problems/02_Medium/04_fraction_to_recurring_decimal.md) | Medium | Essential | remainder cycle | [js](../03_Problems/solutions/04_fraction_to_recurring_decimal.js) |
| 05 | [Water and Jug Problem](../03_Problems/02_Medium/05_water_and_jug_problem.md) | Medium | Essential | Bezout | [js](../03_Problems/solutions/05_water_and_jug_problem.js) |
| 06 | [Closest Prime Numbers in Range](../03_Problems/02_Medium/06_closest_prime_numbers_in_range.md) | Medium | Essential | sieve + scan | [js](../03_Problems/solutions/06_closest_prime_numbers_in_range.js) |
| 07 | [Smallest Value After Replacing With Sum of Prime Factors](../03_Problems/02_Medium/07_smallest_value_after_replacing_with_sum_of_prime_factors.md) | Medium | Essential | spf sieve | [js](../03_Problems/solutions/07_smallest_value_after_replacing_with_sum_of_prime_factors.js) |
| 08 | [Super Pow](../03_Problems/02_Medium/08_super_pow.md) | Medium | Essential | powMod, Horner | [js](../03_Problems/solutions/08_super_pow.js) |
| 09 | [Prime Palindrome](../03_Problems/02_Medium/09_prime_palindrome.md) | Medium | Essential | divisibility by 11 | [js](../03_Problems/solutions/09_prime_palindrome.js) |
| 10 | [Modular Inverse Table](../03_Problems/02_Medium/10_modular_inverse_table.md) | Medium | Advanced | inverse recurrence | [js](../03_Problems/solutions/10_modular_inverse_table.js) |
| 11 | [Nth Magical Number](../03_Problems/03_Hard/11_nth_magical_number.md) | Hard | Essential | binary search + incl–excl | [js](../03_Problems/solutions/11_nth_magical_number.js) |

**Practice more (LeetCode):** 1015 Smallest Integer Divisible by K, 1201 Ugly Number III, 264 Ugly Number II,
313 Super Ugly Number, 952 Largest Component Size by Common Factor, 1250 Check If It Is a Good Array,
1922 Count Good Numbers (exact powMod!), 2521 Distinct Prime Factors of Product of Array,
1017 Convert to Base -2, 507 Perfect Number, 2447 Number of Subarrays With GCD Equal to K,
1979 Find Greatest Common Divisor of Array, 914 X of a Kind in a Deck of Cards.
**Advanced practice:** CSES "Counting Divisors", "Exponentiation II" (Euler reduction), "Sum of Divisors";
Codeforces problems tagged "number theory" and "chinese remainder theorem".
