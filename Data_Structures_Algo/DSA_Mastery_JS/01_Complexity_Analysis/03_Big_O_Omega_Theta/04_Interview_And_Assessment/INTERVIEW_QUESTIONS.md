# Big O, Omega, Theta — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md).

**1. Define Big O, Big Omega and Big Theta.**
<details><summary>Model answer</summary>

f = O(g) if there are constants c > 0 and n0 with f(n) ≤ c·g(n) for all n ≥ n0 (upper bound). f = Ω(g) if f(n) ≥ c·g(n) for all n ≥ n0 (lower bound). f = Θ(g) if both hold (tight bound).
</details>

**2. Is "Big O is worst case and Big Omega is best case" correct?**
<details><summary>Model answer</summary>

No. Best/average/worst case choose which inputs you measure; O/Ω/Θ bound the resulting function. Insertion sort is Θ(n) in the best case and Θ(n²) in the worst case: each case has its own tight bound.
</details>

**3. Is binary search O(n)? Is that a good answer?**
<details><summary>Model answer</summary>

It is true (O is only an upper bound) but loose. The informative answer is Θ(log n) worst case, Θ(1) best case.
</details>

**4. Prove 3n² + 10n + 5 = O(n²).**
<details><summary>Model answer</summary>

Pick c = 4: need 3n² + 10n + 5 ≤ 4n², i.e. n² − 10n − 5 ≥ 0, true for n ≥ 11. So c = 4, n0 = 11 works. (Or c = 18, n0 = 1, since 10n ≤ 10n² and 5 ≤ 5n² for n ≥ 1.)
</details>

**5. Why does the base of the logarithm not matter in O(log n), but matters in n^(log n) style exponents?**
<details><summary>Model answer</summary>

log_a n = log_b n / log_b a: a constant factor, absorbed by O. In an exponent, a constant factor becomes a different power: n^(log₂ 3) ≈ n^1.585 vs n^(log₄ 3) ≈ n^0.79, which are different classes.
</details>

**6. State the master theorem and give one example per case.**
<details><summary>Model answer</summary>

T(n) = a T(n/b) + Θ(n^d). If d < log_b a: Θ(n^(log_b a)) (e.g. 3T(n/2) + n → n^1.585). If d = log_b a: Θ(n^d log n) (merge sort 2T(n/2) + n → n log n). If d > log_b a: Θ(n^d) (2T(n/2) + n² → n²).
</details>

**7. Why is merge sort Θ(n log n)? Explain with a recursion tree.**
<details><summary>Model answer</summary>

Each level of the tree splits the array into pieces whose sizes add up to n, and merging a level costs Θ(n). Halving gives log₂ n levels. n per level × log n levels = Θ(n log n).
</details>

**8. What is the complexity of T(n) = T(n − 1) + n? Can you use the master theorem?**
<details><summary>Model answer</summary>

No, that is subtract-and-conquer, not divide by b. Unrolling: n + (n − 1) + ... + 1 = n(n + 1)/2 = Θ(n²). This is what `f(arr.slice(1))` recursion costs.
</details>

**9. What is the tight bound for naive recursive Fibonacci, and is O(2^n) wrong?**
<details><summary>Model answer</summary>

The call count is 2F(n+1) − 1 = Θ(φ^n), φ ≈ 1.618. O(2^n) is a correct upper bound but not tight. Space is Θ(n) (stack depth).
</details>

**10. `for (i = 1; i <= n; i++) for (j = i; j <= n; j += i)` — complexity?**
<details><summary>Model answer</summary>

The inner loop runs ⌊n/i⌋ times; Σ n/i = n·H(n) ≈ n ln n → Θ(n log n). This is the harmonic series, the skeleton of sieve-style algorithms.
</details>

**11. Trial division `isPrime(n)` is Θ(√n). Is it a polynomial-time algorithm?**
<details><summary>Model answer</summary>

Not in the input size. The input has b ≈ log₂ n bits, and √n = 2^(b/2), exponential in b. It is pseudo-polynomial: polynomial in the numeric value, not in the length of the input.
</details>

**12. How would you check a complexity claim empirically without timing?**
<details><summary>Model answer</summary>

Add a step counter and compare steps(2n)/steps(n): ~1 (constant/log), ~2 (linear), slightly above 2 (n log n), ~4 (quadratic), ~2^d (n^d). For exponential, steps(n+1)/steps(n) stays a constant > 1. Counting is deterministic, timing is noisy.
</details>

**13. What do you say when you can prove an upper bound but you think it is not tight?**
<details><summary>Model answer</summary>

State it honestly: "It's O(n²) for sure; I believe the real bound is O(n log n) because ... " and give the intuition (e.g. an amortized or harmonic argument), or offer to analyze more carefully.
</details>
