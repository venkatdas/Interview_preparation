# Mathematics For DSA — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Predict the steps

Trace Euclid for `gcd(84, 36)`. What pairs (a, b) appear and what is the answer?

<details><summary>Answer</summary>

(84, 36) → (36, 12) → (12, 0). Answer 12.

</details>

### Q2. Multiple choice — how many multiplications does fast power need for x^1000?

A) about 10–20  B) about 500  C) 1000  D) about 100

<details><summary>Answer</summary>

**A.** log2(1000) ≈ 10 squarings plus at most 10 extra multiplications.

</details>

### Q3. Predict the output

```js
console.log(1e9 * 1e9 === 1e18, Number.isSafeInteger(1e9 * 1e9));
```

<details><summary>Answer</summary>

`true false`. 10^18 happens to be representable here, but it is beyond 2^53 so it is not "safe"; products like (10^9 + 7)^2 lose precision.

</details>

### Q4. Complexity — Sieve of Eratosthenes up to n

<details><summary>Answer</summary>

O(n log log n) time, O(n) space.

</details>

### Q5. Spot the bug (trailing zeros)

```js
function trailingZeroes(n) { return Math.floor(n / 5); }
```

<details><summary>Answer</summary>

It misses extra factors of 5 from 25, 125, ...: `trailingZeroes(25)` returns 5 instead of 6. Loop: `while (n > 0) { n = Math.floor(n / 5); count += n; }`.

</details>

### Q6. Predict the output

```js
console.log(Math.trunc(-7 / 2), Math.floor(-7 / 2));
```

<details><summary>Answer</summary>

`-3 -4`. Use `Math.trunc` for C-style integer division toward zero.

</details>

### Q7. Multiple choice — isPrime(n) by trial division only needs divisors up to

A) n / 2  B) √n  C) log n  D) n − 1

<details><summary>Answer</summary>

**B.**

</details>

### Q8. Spot the bug (reverse integer)

```js
function reverse(x) {
  let r = 0;
  while (x !== 0) { r = r * 10 + (x % 10); x = Math.floor(x / 10); }
  return r;
}
```

<details><summary>Answer</summary>

For negative x, `Math.floor(-1 / 10)` is −1, so x never reaches 0 and the loop runs forever. Use `Math.trunc(x / 10)`. The Reverse Integer problem also needs a 32-bit range check on the result.

</details>

### Q9. Predict the output

```js
let a = 0, b = 1;
for (let i = 0; i < 6; i++) [a, b] = [b, a + b];
console.log(a);
```

<details><summary>Answer</summary>

`8` (Fibonacci F(6)).

</details>

### Q10. Complexity — computing nCr mod p for 10^5 queries with n ≤ 10^6

<details><summary>Answer</summary>

O(n) precomputation of factorials and inverse factorials, then O(1) per query: about O(10^6 + 10^5) total.

</details>

### Q11. Multiple choice — 7 in base 2 is

A) 110  B) 111  C) 101  D) 1001

<details><summary>Answer</summary>

**B.**

</details>

### Q12. Spot the bug (happy number)

```js
function isHappy(n) { while (n !== 1) n = sumOfSquaredDigits(n); return true; }
```

<details><summary>Answer</summary>

Unhappy numbers enter a cycle (for example 4 → 16 → 37 → ... → 4) and the loop never ends. Track seen values in a `Set` or use Floyd's fast/slow pointers.

</details>

## Mastery checklist

- [ ] I can write gcd, lcm, fast power and powMod from memory.
- [ ] I can write the Sieve of Eratosthenes and explain why it starts at p².
- [ ] I know the safe integer limit and when to use `BigInt` or modular arithmetic.
- [ ] I can manipulate digits (extract, reverse, sum) without converting to strings.
- [ ] I scored at least 10/12 on this quiz.
