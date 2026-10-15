# Number Theory — Self-Assessment Quiz

Answer on paper first, then check. Aim for 12/14 before moving on.

### Q1. Predict the output
```js
const M = 1e9 + 7, a = M - 1;
console.log((a * a) % M === 1);
```
<details><summary>Answer</summary>

`false`. The product ≈ 1e18 exceeds 2^53, so it is rounded; the result is 999999972. Correct value is 1 (a ≡ -1).
</details>

### Q2. Multiple choice
Which inverse method is valid for modulus 12?
A) Fermat a^(m-2)  B) extended Euclid  C) both  D) neither
<details><summary>Answer</summary>

B. 12 is not prime, so Fermat does not apply. Extended Euclid works whenever gcd(a, 12) = 1 (a = 1, 5, 7, 11).
</details>

### Q3. Complexity
What is the time to factorize ONE number x <= N after building the spf table?
<details><summary>Answer</summary>

O(log x): each division by a prime >= 2 at least halves x.
</details>

### Q4. Compute
d(360) and sigma(12)?
<details><summary>Answer</summary>

360 = 2^3*3^2*5 -> 4*3*2 = 24 divisors. 12 = 2^2*3 -> (1+2+4)(1+3) = 28.
</details>

### Q5. Spot the bug
```js
function isUgly(n) { for (const p of [2,3,5]) while (n % p === 0) n /= p; return n === 1; }
```
<details><summary>Answer</summary>

For n = 0 the while loop never ends (0 % 2 === 0, 0 / 2 === 0). Add `if (n <= 0) return false`.
</details>

### Q6. Predict the output
```js
console.log(-7 % 3, ((-7 % 3) + 3) % 3);
```
<details><summary>Answer</summary>

`-1 2`. JS `%` keeps the sign of the dividend; normalize to get the mathematical remainder 2.
</details>

### Q7. Multiple choice
Which numbers in the sieve does the inner loop for p = 7 touch first?
A) 7  B) 14  C) 49  D) 21
<details><summary>Answer</summary>

C. Multiples below 49 have a smaller prime factor and are already crossed out.
</details>

### Q8. Compute
phi(36)?
<details><summary>Answer</summary>

36 * (1 - 1/2) * (1 - 1/3) = 12.
</details>

### Q9. Compute
3^-1 mod 11, and 2^-1 mod 1e9+7?
<details><summary>Answer</summary>

4 (3*4 = 12 ≡ 1). 500000004 (2 * 500000004 = 1e9+8 ≡ 1).
</details>

### Q10. Spot the bug
```js
function powMod(b, e, m) { let r = 1; while (e > 0) { if (e & 1) r = r * b % m; b = b * b % m; e >>= 1; } return r; }
powMod(2, 1e10, 1e9 + 7);
```
<details><summary>Answer</summary>

Two bugs: `e & 1` and `e >>= 1` truncate e to 32 bits (1e10 becomes 1410065408), and `r * b` / `b * b`
exceed 2^53 with m = 1e9+7. Use `e % 2`, `Math.floor(e / 2)` and an exact mulMod.
</details>

### Q11. True or false
Every even-length palindrome greater than 11 is composite.
<details><summary>Answer</summary>

True: it is divisible by 11 (alternating digit sum 0) and bigger than 11.
</details>

### Q12. Compute
Smallest non-negative x with x ≡ 1 (mod 4) and x ≡ 3 (mod 6)?
<details><summary>Answer</summary>

9. gcd(4,6) = 2 divides 3-1 = 2, so a solution exists modulo lcm = 12: 9 % 4 = 1, 9 % 6 = 3.
</details>

### Q13. Complexity
Counting divisors for every n from 1 to N by "for i, for multiples of i, cnt++" costs?
<details><summary>Answer</summary>

O(N log N): N/1 + N/2 + ... + N/N = N * H(N).
</details>

### Q14. Multiple choice
Why does Miller–Rabin in JS use BigInt even for n < 2^53?
A) BigInt is faster  B) the squares x*x reach n^2, far above 2^53  C) Number lacks %  D) no reason
<details><summary>Answer</summary>

B. Intermediate products are up to n^2.
</details>

## Mastery checklist

- [ ] I can explain the 2^53 trap and write an exact `mulMod` from memory in under 3 minutes.
- [ ] I can write gcd, extended Euclid and both modular inverse methods without notes, and say when each applies.
- [ ] I can build an smallest-prime-factor sieve and factorize with it, and compute d(n) and sigma(n) from a factorization.
- [ ] I solved problems 01–09 and 11 without opening the solution walkthrough, each within 30 minutes.
- [ ] I can explain the segmented sieve, CRT merge and Miller–Rabin at a whiteboard level (Advanced).
