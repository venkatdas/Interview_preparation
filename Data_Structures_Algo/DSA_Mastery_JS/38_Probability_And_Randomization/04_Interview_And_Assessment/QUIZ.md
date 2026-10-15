# Quiz — Probability and Randomization

Answer each question before opening the answer.

**1. (Multiple choice)** In Fisher–Yates with `for (let i = n - 1; i > 0; i--)`, which line is correct?
A) `j = Math.floor(rng() * i)`  B) `j = Math.floor(rng() * (i + 1))`  C) `j = Math.floor(rng() * n)`
<details><summary>Answer</summary>B. j must range over [0, i], including i. A is Sattolo's algorithm (cyclic permutations only). C is the biased naive shuffle.</details>

**2. (Compute)** A die is rolled until a 6 appears. Expected number of rolls?
<details><summary>Answer</summary>6. Geometric with p = 1/6, expected 1/p.</details>

**3. (Compute)** Expected rand7 calls for rand10 using the 7x7 grid and rejecting 41..49?
<details><summary>Answer</summary>2 * 49/40 = 2.45.</details>

**4. (Spot the bug)**
```js
const x = rand7() * rand7();
if (x <= 40) return 1 + (x - 1) % 10;
```
<details><summary>Answer</summary>Products are not uniform: 12 appears 4 ways, 49 once, 11 never. Use `(rand7() - 1) * 7 + rand7()`.</details>

**5. (Reservoir)** Stream of 5 items, k = 1. With what probability does the 4th item replace the current answer when it arrives?
<details><summary>Answer</summary>1/4. And the final probability that item 4 is the answer is 1/4 * 4/5 = 1/5.</details>

**6. (Predict the output)** weights [2, 0, 3], prefix [2, 2, 5], search "first prefix > r". What index for r = 2.0?
<details><summary>Answer</summary>2. prefix[0] = 2 is not > 2, prefix[1] = 2 is not > 2, prefix[2] = 5 is. The zero-weight index 1 is never picked.</details>

**7. (Multiple choice)** Randomized quickselect is:
A) Monte Carlo  B) Las Vegas  C) deterministic
<details><summary>Answer</summary>B. Always correct; only the running time is random.</details>

**8. (Complexity)** Expected and worst-case time of randomized quickselect?
<details><summary>Answer</summary>Expected O(n), worst O(n^2).</details>

**9. (Linearity)** 10 people throw their hats in a pile and each takes a random hat. Expected number of people who get their own hat?
<details><summary>Answer</summary>1. Each person has probability 1/10; 10 * 1/10 = 1.</details>

**10. (Spot the bug)** In RandomizedSet.remove:
```js
const hole = idx.get(val);
idx.delete(val);
const last = arr[arr.length - 1];
arr[hole] = last; idx.set(last, hole); arr.pop();
```
<details><summary>Answer</summary>When val is the last element, `idx.set(last, hole)` re-inserts the deleted value into the map. Delete from the map after the move.</details>

**11. (Rectangles)** Rectangles [0,0,0,0] and [1,1,3,3]. Probability that pick() returns [0,0]?
<details><summary>Answer</summary>1/10. Point counts are 1 and 3 * 3 = 9; total 10 points, all equally likely.</details>

**12. (Testing)** Why use a seeded PRNG in tests instead of Math.random?
<details><summary>Answer</summary>So a failing run can be reproduced exactly with the same seed, and so the test result is deterministic in CI.</details>

**13. (Chi-square)** With 6 buckets, roughly what value does the chi-square statistic take for a fair generator, and what does `looksUniform` allow?
<details><summary>Answer</summary>Mean about df = 5 (standard deviation about sqrt(10) ~ 3.2). The band allows up to 5 + 6 * sqrt(10) ~ 24.</details>

**14. (Soup Servings)** Why can the answer return 1 for very large n?
<details><summary>Answer</summary>Per turn A loses 62.5 ml on average and B 37.5 ml, so A almost surely empties first as n grows; the exact value passes 1 - 1e-5 around m = 200 units, inside the allowed tolerance.</details>

## Mastery checklist

- [ ] I can write Fisher–Yates from memory and prove it gives probability 1/n! to every permutation.
- [ ] I can write reservoir sampling (k = 1 and general k) and explain the telescoping proof.
- [ ] I can implement weighted pick with prefix sums + binary search and handle boundaries with strict `>`.
- [ ] I can derive the expected cost of a rejection-sampling loop (E = 1/p) and build rand10 from rand7.
- [ ] I can write a seeded, non-flaky statistical test and turn a "probability" question into a DP.
