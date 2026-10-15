# Harmonic Loop

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Medium |
| **Pattern** | harmonic series |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [05_harmonic_loop.js](../solutions/05_harmonic_loop.js) — open only after a real attempt |

## Problem

This loop is the skeleton of the Sieve of Eratosthenes and of "for every number,
visit all its multiples" algorithms. Count the inner steps exactly, give a tight
Θ bound, and compute the exact count for n = 1e12 (brute force cannot).

  for (let i = 1; i <= n; i++)
    for (let j = i; j <= n; j += i)
      steps++;

## Examples

```
n = 1 -> 1    n = 4 -> 4+2+1+1 = 8    n = 8 -> 20    n = 10 -> 27
```

## Constraints & clarifying questions

```
- n up to 1e12 for the formula. Result fits in a double exactly? (≈ 2.8e13 < 2^53, yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Visit all multiples of every i*. Sections 5.5 and 8 (dry run) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run it)   Θ(n log n). For each i the inner loop visits i, 2i, 3i, ... ≤ n: floor(n / i) times.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The inner loop runs ⌊n/i⌋ times, and Σ n/i = n·H(n) ≈ n ln n → Θ(n log n). To compute the exact sum fast, note ⌊n/i⌋ has only O(√n) distinct values: process each block of equal quotients at once.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1
- very large n: use the block formula, never the loop
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run it)   Θ(n log n)

```
For each i the inner loop visits i, 2i, 3i, ... ≤ n: floor(n / i) times.
```

### APPROACH 2 — Optimal (divisor-block trick)   O(√n)

```
steps = Σ_{i=1}^{n} floor(n / i). floor(n/i) takes only O(√n) distinct values:
for a block of i with the same q = floor(n/i), the block ends at i' = floor(n / q).
Add q × (block length) and jump to i' + 1.
Growth: Σ n/i = n·H(n) ≈ n ln n, and the floors subtract at most n -> Θ(n log n).
(A sieve that only starts from primes is Θ(n log log n): even fewer steps.)

Dry run n = 10, blocks:
  i=1: q=10, ends 1 -> 10      i=2: q=5, ends 2 -> 5     i=3: q=3, ends 3 -> 3
  i=4..5: q=2 -> 2×2 = 4       i=6..10: q=1 -> 5×1 = 5    total 27
```

### EMPIRICAL CHECK

```
steps(n) / (n ln n) -> 1 (it is n ln n + (2γ - 1) n + O(√n), γ ≈ 0.577).
```

### Edge cases

```
- n = 1 -> 1
- very large n: use the block formula, never the loop
```

### Common mistakes

```
- Calling it Θ(n²) because of nesting.
- Calling it Θ(n) because "the inner loop shrinks fast": the harmonic series diverges (log n).
```

Full JavaScript solution with tests: [05_harmonic_loop.js](../solutions/05_harmonic_loop.js). Run it with `node 05_harmonic_loop.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #204 Count Primes (sieve visits multiples of primes only).
- Sum of divisors of every number up to n in Θ(n log n).
- LeetCode #1390 Four Divisors.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
