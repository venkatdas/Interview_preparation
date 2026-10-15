# Mathematics For DSA — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. How does Euclid's algorithm compute the GCD, and how fast is it?

<details><summary>Model answer</summary>

`gcd(a, b) = gcd(b, a mod b)` until b is 0; then a is the answer. It works because any common divisor of a and b also divides `a mod b`. The numbers shrink at least by half every two steps, so it runs in O(log min(a, b)). LCM is `a / gcd(a, b) * b` (divide first to keep numbers small).

</details>

### 2. Explain fast (binary) exponentiation.

<details><summary>Model answer</summary>

To compute x^n, look at n in binary. Square the base each step and multiply it into the result when the current bit is 1; halve n. That uses O(log n) multiplications instead of n. With a modulus, reduce after every multiplication. For negative n compute (1/x)^(−n).

</details>

### 3. Why do problems ask for answers modulo 10^9 + 7?

<details><summary>Model answer</summary>

The real answer is huge (counts of paths, combinations). 10^9 + 7 is prime (so modular inverses exist via Fermat) and small enough that the sum of two residues fits in 32-bit ints. In JavaScript the product of two residues (~10^18) exceeds 2^53, so use `BigInt` or split multiplication for `mulMod`.

</details>

### 4. How do you test if n is prime, and how do you find all primes below n?

<details><summary>Model answer</summary>

Single test: try divisors up to √n (any factor above √n pairs with one below it): O(√n). All primes below n: the Sieve of Eratosthenes marks multiples of each prime starting at p², giving O(n log log n) time and O(n) space.

</details>

### 5. Why does the sieve start crossing out at p·p?

<details><summary>Model answer</summary>

Any smaller multiple k·p with k < p has a prime factor smaller than p, so it was already crossed out when that smaller prime was processed. Starting at p² avoids redundant work, and it also means the outer loop can stop once p² exceeds n.

</details>

### 6. How do you compute nCr mod a prime efficiently for many queries?

<details><summary>Model answer</summary>

Precompute factorials and inverse factorials up to n mod p in O(n). Then `nCr = fact[n] * invFact[r] * invFact[n − r] mod p` in O(1). The inverse comes from Fermat's little theorem: `a^(p−2) mod p`. For small n without a modulus, Pascal's triangle or the multiplicative formula works.

</details>

### 7. How do you extract and reverse the digits of a number without strings?

<details><summary>Model answer</summary>

`n % 10` gives the last digit; `Math.floor(n / 10)` (or `Math.trunc` for negatives) removes it. Reverse by `rev = rev * 10 + digit`. Handle the sign separately, and for 32-bit problems check the range before or after building.

</details>

### 8. How do you count trailing zeros of n! without computing n!?

<details><summary>Model answer</summary>

Each trailing zero needs a factor 10 = 2 × 5, and 2s are plentiful, so count factors of 5: `n/5 + n/25 + n/125 + ...` (integer division). O(log n).

</details>

### 9. How do you detect a cycle in a number sequence like Happy Number?

<details><summary>Model answer</summary>

Either store seen values in a `Set` (O(k) space) or use Floyd's tortoise and hare: apply the step function once for slow and twice for fast; if they meet at a value other than the target, there is a cycle. Floyd uses O(1) space.

</details>

### 10. Why is `Math.sqrt` risky for large integers, and how do you compute an integer square root safely?

<details><summary>Model answer</summary>

Floating-point rounding can make `Math.floor(Math.sqrt(n))` off by one near perfect squares for large n. Verify with integer arithmetic (adjust while `r * r > n` or `(r + 1)^2 <= n`), or binary search the largest r with `r * r <= n`.

</details>

### 11. What closed-form sums should you know?

<details><summary>Model answer</summary>

1 + 2 + ... + n = n(n + 1)/2; sum of squares n(n + 1)(2n + 1)/6; arithmetic series count × (first + last)/2; geometric series a(r^n − 1)/(r − 1). They turn O(n) loops into O(1) and power "missing number" style tricks.

</details>

### 12. How do you check if n is a power of two?

<details><summary>Model answer</summary>

`n > 0 && (n & (n − 1)) === 0`: a power of two has exactly one set bit, and `n − 1` flips that bit and all bits below it. Valid for n below 2^31 in JavaScript because of 32-bit bitwise operators; for larger values use `Number.isInteger(Math.log2(n))` with care or BigInt.

</details>
