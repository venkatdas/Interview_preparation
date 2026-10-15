# Combinatorics — Self-Assessment Quiz

Answer each question before opening it. Back to [the topic README](../README.md).

**1. (Multiple choice)** How many 3-letter "words" (any letters, order matters, repeats allowed) can be made from {a, b, c, d}?
A) 24 B) 64 C) 20 D) 4
<details><summary>Answer</summary>B — 4^3 = 64 (permutations with repetition).</details>

**2. (Multiple choice)** How many ways to choose 3 toppings out of 8 (no repeats, order irrelevant)?
A) 336 B) 56 C) 120 D) 512
<details><summary>Answer</summary>B — C(8,3) = 56. 336 is P(8,3).</details>

**3. (Predict the output)**
```js
const MOD = 1_000_000_007;
console.log(((MOD - 1) * (MOD - 2)) % MOD === Number((BigInt(MOD - 1) * BigInt(MOD - 2)) % BigInt(MOD)));
```
<details><summary>Answer</summary>`false` — the plain product (~1e18) exceeds 2^53 and is rounded, so the remainder is wrong.</details>

**4. (Stars and bars)** Number of ways to give 6 identical cookies to 3 kids, each kid at least one?
<details><summary>Answer</summary>C(6−1, 3−1) = C(5, 2) = 10.</details>

**5. (Recognize the sequence)** A count gives 1, 1, 2, 5, 14 for n = 0..4. What is n = 5?
<details><summary>Answer</summary>42 — Catalan numbers.</details>

**6. (Complexity)** Building fact[] and invFact[] up to N, then answering Q queries of C(n,k) mod p costs?
<details><summary>Answer</summary>O(N + log p + Q) time, O(N) space.</details>

**7. (Spot the bug)**
```js
function nCr(n, k) { let r = 1; for (let i = 1; i <= k; i++) r *= (n - i + 1) / i; return r; }
```
<details><summary>Answer</summary>Divides before multiplying, so it uses fractions: floating rounding gives non-integers like 251.99999. Multiply first then divide (`r = r * (n-i+1) / i`, exact since each partial is C(n, i)), and use BigInt for large values.</details>

**8. (Derangements)** How many ways can 5 letters go into 5 addressed envelopes with every letter in the wrong envelope?
<details><summary>Answer</summary>D(5) = 44.</details>

**9. (Inclusion–exclusion)** How many integers in [1, 100] are divisible by 2 or 3?
<details><summary>Answer</summary>50 + 33 − 16 = 67.</details>

**10. (Next permutation)** What comes after [2, 3, 1]?
<details><summary>Answer</summary>[3, 1, 2]. Ascent at index 0 (2 < 3), swap with 3 → [3,2,1], reverse suffix → [3,1,2].</details>

**11. (k-th permutation)** The 4th permutation of [1,2,3] in lexicographic order?
<details><summary>Answer</summary>"231" (123, 132, 213, 231).</details>

**12. (Spot the bug)** `invFact[i] = powMod(fact[i], MOD - 2)` inside a loop for i = 0..N. Wrong?
<details><summary>Answer</summary>Correct but slow: O(N log p). The downward walk invFact[i−1] = invFact[i]·i is O(N) after one powMod.</details>

**13. (Multinomial)** Distinct arrangements of "BANANA"?
<details><summary>Answer</summary>6!/(3!·2!·1!) = 60.</details>

**14. (Pigeonhole)** Minimum number of people to guarantee two share a birthday month?
<details><summary>Answer</summary>13.</details>

## Mastery checklist

- [ ] I can decide permutation vs combination vs with-repetition from the wording in under 30 seconds.
- [ ] I can write `nCrExact` (BigInt) and `ModCombinatorics` (fact + invFact tables) from memory.
- [ ] I can explain the 2^53 trap and write a safe `mulMod` without looking.
- [ ] I can recognize Catalan, stars and bars, derangement and inclusion–exclusion problems and derive their formulas.
- [ ] I solved all 9 problems here and verified each formula against a brute force on small inputs.
