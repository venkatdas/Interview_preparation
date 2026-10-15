# Number Theory — Interview Questions

Answer each out loud first (1–2 minutes), then open the model answer.
**[E]** = Essential, **[A]** = Advanced (competitive programming / follow-ups).

### 1. [E] Why does trial division only need to test divisors up to sqrt(n)?
<details><summary>Model answer</summary>

Divisors come in pairs (d, n/d). If both were bigger than sqrt(n), their product would be bigger than n.
So every composite n has a divisor <= sqrt(n). If none exists, n is prime. Cost O(sqrt n).
</details>

### 2. [E] In JavaScript, what is wrong with `(a * b) % 1_000_000_007`?
<details><summary>Model answer</summary>

JS numbers are doubles; integers are exact only up to 2^53 - 1 ≈ 9e15. Two residues mod 1e9+7 multiply
to almost 1e18, so the low bits are rounded away before `%` runs. The result is silently wrong
(for a = 1e9+6, it gives 999999972 instead of 1). Fixes: BigInt, split multiplication
(b = hi*2^16 + lo, exact for m <= 2^32), double-and-add, or a fast path when a*b <= MAX_SAFE_INTEGER.
`Math.imul` is not a fix: it works mod 2^32.
</details>

### 3. [E] How do you divide under a modulus?
<details><summary>Model answer</summary>

Multiply by the modular inverse: a / b ≡ a * b^-1 (mod m). The inverse exists iff gcd(b, m) = 1.
If m is prime, b^-1 = b^(m-2) mod m (Fermat). Otherwise use extended Euclid.
</details>

### 4. [E] Fermat inverse vs extended Euclid inverse — when would you pick each?
<details><summary>Model answer</summary>

Fermat: only for a prime modulus, and it reuses powMod you already have — quick to write. Extended
Euclid: works for any modulus with gcd = 1, and tells you when no inverse exists. Both are O(log m).
For many inverses 1..n, the linear recurrence inv[i] = -(m/i)*inv[m % i] is O(n) total.
</details>

### 5. [E] Explain the Sieve of Eratosthenes and why the inner loop starts at p*p.
<details><summary>Model answer</summary>

Mark all numbers prime, then for each prime p cross out its multiples. Any multiple k*p with k < p
has a prime factor <= k < p, so it was already crossed out — starting at p*p skips that wasted work.
Complexity O(n log log n), memory O(n) (use a Uint8Array; odd-only halves it).
</details>

### 6. [E] You must factorize 10^5 numbers, each up to 10^6. What do you do?
<details><summary>Model answer</summary>

Build a smallest-prime-factor table up to 10^6 once (O(N) with a linear sieve), then factorize each number
by repeated division by spf[x], O(log x) each. Trial division would be 10^5 * 1000 = 1e8 operations.
</details>

### 7. [E] How many divisors does 720 have, and how do you compute it in general?
<details><summary>Model answer</summary>

720 = 2^4 * 3^2 * 5. d(n) = (4+1)(2+1)(1+1) = 30. In general factorize and multiply (exponent + 1):
each divisor chooses an exponent from 0..e for every prime.
</details>

### 8. [E] Two jugs of 6 and 10 liters: can you measure 4? 5?
<details><summary>Model answer</summary>

Reachable totals are multiples of gcd(6, 10) = 2 that are <= 16 (Bezout). 4 yes, 5 no.
</details>

### 9. [E] How many trailing zeros does 1000! have? What about in base 12?
<details><summary>Model answer</summary>

Base 10: count factors of 5 (Legendre): 200 + 40 + 8 + 1 = 249.
Base 12 = 2^2 * 3: exponent of 2 in 1000! is 994, of 3 is 498. Zeros = min(floor(994/2), floor(498/1)) = 497.
</details>

### 10. [A] What is Euler's totient and when can you reduce an exponent modulo phi(m)?
<details><summary>Model answer</summary>

phi(m) counts 1 <= k <= m with gcd(k, m) = 1; phi(m) = m * prod(1 - 1/p). Euler: if gcd(a, m) = 1,
a^phi(m) ≡ 1, so a^e ≡ a^(e mod phi(m)). If a and m share a factor this is false (for large e you
can use e mod phi(m) + phi(m) — the generalized Euler theorem).
</details>

### 11. [A] Solve x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7).
<details><summary>Model answer</summary>

Merge pairwise. x = 2 + 3k, need 3k ≡ 1 (mod 5) -> k = 2 -> x ≡ 8 (mod 15). Then x = 8 + 15k,
15k ≡ -6 (mod 7) -> k ≡ 1 -> x ≡ 23 (mod 105). With non-coprime moduli, check (r2 - r1) % gcd == 0 first.
</details>

### 12. [A] How would you test whether a 64-bit number is prime?
<details><summary>Model answer</summary>

Deterministic Miller–Rabin with bases {2,3,5,7,11,13,17,19,23,29,31,37}, using BigInt because the squares
exceed 2^53. Write n-1 = d*2^s; for each base check a^d ≡ 1 or a^(d*2^r) ≡ -1 for some r < s.
O(k log^3 n). Trial division would need ~4e9 steps.
</details>

### 13. [A] How do you list primes between 10^12 and 10^12 + 10^6?
<details><summary>Model answer</summary>

Segmented sieve: sieve primes up to sqrt(10^12 + 10^6) ≈ 10^6, then for each prime cross out multiples
inside a window array of size 10^6 + 1, starting at max(p*p, ceil(L/p)*p). Memory O(R - L + sqrt R).
</details>

### 14. [E] Why is gcd O(log n)?
<details><summary>Model answer</summary>

After two steps of Euclid the larger argument at least halves (if b <= a/2 then a mod b < b <= a/2,
otherwise a mod b = a - b < a/2). The worst case is consecutive Fibonacci numbers.
</details>
