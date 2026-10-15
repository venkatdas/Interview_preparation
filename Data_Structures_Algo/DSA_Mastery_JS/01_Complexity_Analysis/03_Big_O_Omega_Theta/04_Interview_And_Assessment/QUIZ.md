# Big O, Omega, Theta — Self-Assessment Quiz

Answer each question before opening the answer. Back to the [topic README](../README.md).

**Q1. True or false: n² = O(n³); n³ = O(n²); n² = Ω(n); n log n = Θ(n).**
<details><summary>Answer</summary>True, false, true, false.</details>

**Q2. Find c and n0 showing 2n + 30 = O(n).**
<details><summary>Answer</summary>c = 3, n0 = 30 (2n + 30 ≤ 3n ⇔ n ≥ 30). Many other pairs work.</details>

**Q3. Complexity?**
```js
for (let i = 1; i < n; i *= 3) for (let j = 0; j < n; j++) steps++;
```
<details><summary>Answer</summary>Θ(n log n): ⌈log₃ n⌉ outer iterations × n.</details>

**Q4. Complexity?**
```js
for (let i = 0; i < n; i++) for (let j = 1; j < n; j *= 2) for (let k = 0; k < j; k++) steps++;
```
<details><summary>Answer</summary>For each i the inner two loops do 1 + 2 + 4 + ... < 2n steps → Θ(n) per i → Θ(n²) total.</details>

**Q5. Master theorem: T(n) = 4T(n/2) + n.**
<details><summary>Answer</summary>log₂4 = 2 > 1 → case 1 → Θ(n²).</details>

**Q6. Master theorem: T(n) = T(n/2) + n.**
<details><summary>Answer</summary>log₂1 = 0 < 1 → case 3 → Θ(n). (n + n/2 + n/4 + ... < 2n.)</details>

**Q7. Master theorem: T(n) = 2T(n/4) + √n.**
<details><summary>Answer</summary>log₄2 = 1/2 = d → case 2 → Θ(√n log n).</details>

**Q8. Spot the bug in this analysis: "`function sum(a) { return a.length ? a[0] + sum(a.slice(1)) : 0 }` is Θ(n) because it makes n calls."**
<details><summary>Answer</summary>Each call slices (copies) the rest: T(n) = T(n − 1) + n → Θ(n²) time and Θ(n²) total allocation.</details>

**Q9. Which grows faster: n^100 or 1.01^n? log(n!) or n log n? 2^(n+1) or 2^n?**
<details><summary>Answer</summary>1.01^n (any exponential beats any polynomial eventually); same class Θ(n log n); same class (2^(n+1) = 2·2^n). But 2^(2n) = 4^n is a bigger class.</details>

**Q10. Multiple choice: hash map lookup is** (a) Θ(1) worst case (b) Θ(1) expected, Θ(n) worst case (c) Θ(log n)
<details><summary>Answer</summary>(b).</details>

**Q11. steps(2n)/steps(n) measured as 2.0, 2.1, 4.0, 8.0, 1.0 for five functions. Name a likely class for each.**
<details><summary>Answer</summary>Θ(n), Θ(n log n), Θ(n²), Θ(n³), Θ(1) or Θ(log n) (check steps(2n) − steps(n): constant difference means log n).</details>

**Q12. What is the stack space of naive recursive fib(n)?**
<details><summary>Answer</summary>Θ(n): the deepest path is n, n−1, ..., 1.</details>

**Q13. Is `T(n) = 2T(n/2) + n log n` covered by the basic master theorem? What is the answer?**
<details><summary>Answer</summary>Not the basic form (n log n is not n^d), but the extended case 2 gives Θ(n log² n).</details>

## Mastery checklist

- [ ] I can state the formal definitions of O, Ω, Θ and find c, n0 for a polynomial.
- [ ] I keep "which case" (best/average/worst) separate from "which bound" (O/Ω/Θ) and say both.
- [ ] I can solve divide-and-conquer recurrences with the master theorem and draw the recursion tree when it does not apply.
- [ ] I can analyze loops with dependent, multiplicative and harmonic bounds without assuming nested = n².
- [ ] I can confirm a claim empirically with a step counter and a doubling ratio.
