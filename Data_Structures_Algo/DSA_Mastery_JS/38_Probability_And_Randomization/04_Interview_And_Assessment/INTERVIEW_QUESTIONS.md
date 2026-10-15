# Interview Questions — Probability and Randomization

Answer out loud first, then open the model answer.

### 1. How do you shuffle an array so every order is equally likely? Prove it.
<details><summary>Model answer</summary>

Fisher–Yates: for i from n-1 down to 1, pick j uniform in [0, i] and swap a[i], a[j]. Step i has i+1 equally likely choices, so there are n! equally likely runs, and each produces a different permutation. Every permutation therefore has probability 1/n!. O(n) time, O(1) extra space.
</details>

### 2. What is wrong with swapping each a[i] with a random index from the whole array?
<details><summary>Model answer</summary>

It has n^n equally likely runs. For n >= 3, n^n is not divisible by n! (for n = 3: 27 runs over 6 permutations), so some permutations must get more runs than others. The result is biased. A chi-square bucket test detects it quickly.
</details>

### 3. Why is `arr.sort(() => Math.random() - 0.5)` a bad shuffle?
<details><summary>Model answer</summary>

Sort algorithms assume a consistent comparator (if a < b now, a < b later). A random comparator breaks that, and the output distribution depends on the engine's sort algorithm; it is measurably biased. It is also O(n log n) instead of O(n).
</details>

### 4. You receive a stream of unknown length. Pick one element uniformly using O(1) memory.
<details><summary>Model answer</summary>

Reservoir sampling: keep the i-th element with probability 1/i (replacing the current pick). Element i survives later elements with probability i/(i+1) * (i+1)/(i+2) * ... * (n-1)/n, so overall 1/i * i/n = 1/n. For k items: keep the first k, then replace a random slot with probability k/i.
</details>

### 5. How do you pick index i with probability proportional to w[i], many times?
<details><summary>Model answer</summary>

Prefix sums once (O(n)), then each pick draws r in [0, total) and binary-searches the first prefix > r (O(log n)). Index i owns an interval of length w[i]. If picks vastly outnumber builds, the alias method gives O(1) per pick. If weights change, store prefix sums in a Fenwick tree.
</details>

### 6. Build rand10 from rand7. What is the expected number of rand7 calls?
<details><summary>Model answer</summary>

Two calls make a uniform number in 1..49: (r1-1)*7 + r2. Accept 1..40 and return 1 + (c-1) % 10; otherwise retry. Acceptance p = 40/49, rounds are geometric with mean 49/40, so 2 * 49/40 = 2.45 calls. Reusing rejected values (1..9 uniform) lowers it to about 2.19.
</details>

### 7. What is linearity of expectation, and why is it so useful?
<details><summary>Model answer</summary>

E[X + Y] = E[X] + E[Y] for any random variables, even dependent ones. You split a complicated count into 0/1 indicators and add their probabilities. Example: expected fixed points of a random permutation = n * (1/n) = 1, with no need to understand the joint distribution.
</details>

### 8. Why does randomized quickselect run in expected O(n)?
<details><summary>Model answer</summary>

A random pivot lands in the middle half with probability 1/2, which cuts the range to at most 3/4 of its size. Expected 2 tries per "good" pivot, so the expected total work is bounded by 2n(1 + 3/4 + (3/4)^2 + ...) = 8n. The worst case is O(n^2) but no input can force it, because the randomness is ours. Use a three-way partition so duplicates do not break it.
</details>

### 9. Monte Carlo vs Las Vegas algorithms?
<details><summary>Model answer</summary>

Monte Carlo: bounded time, answer may be wrong with small probability (Miller–Rabin, estimating pi, random hashing). Las Vegas: always correct, running time is random (randomized quicksort, rejection sampling). Repeating a Monte Carlo test shrinks its error exponentially.
</details>

### 10. Design a set with O(1) insert, delete and getRandom.
<details><summary>Model answer</summary>

An array holds the values (O(1) random index); a Map holds value -> index (O(1) lookup). Delete moves the last element into the hole, updates its Map entry, pops the array, then deletes the removed value from the Map (in that order, so deleting the last element works).
</details>

### 11. How do you test code whose output is random?
<details><summary>Model answer</summary>

Inject the random source. In tests use a seeded PRNG (mulberry32) so failures are reproducible. Check invariants exactly (output is a permutation, in range) and distributions statistically: count outcomes into buckets and compare to expected counts with a chi-square statistic and a wide band (about 6 standard deviations). Use enough samples that a real bias exceeds the band by a lot.
</details>

### 12. Simulation or exact DP for "probability the knight stays on the board"?
<details><summary>Model answer</summary>

Exact DP. Monte Carlo error falls like 1/sqrt(N), so 1e-5 accuracy needs about 1e10 trials. The DP over (cell, step) is k * n^2 * 8 operations and exact up to floating point. Simulation is still useful to sanity-check the DP.
</details>

### 13. Why randomize a hash function's seed?
<details><summary>Model answer</summary>

With a fixed, known hash an attacker can craft many keys that collide, turning O(1) average operations into O(n). A random seed chosen at startup makes collisions for any fixed set of keys unlikely, restoring expected O(1) behaviour.
</details>

### 14. Is Math.random suitable for generating password reset tokens?
<details><summary>Model answer</summary>

No. Math.random (and mulberry32) are predictable PRNGs. Use a cryptographically secure source: `crypto.getRandomValues` in browsers or `crypto.randomBytes` / `crypto.randomInt` in Node.
</details>
