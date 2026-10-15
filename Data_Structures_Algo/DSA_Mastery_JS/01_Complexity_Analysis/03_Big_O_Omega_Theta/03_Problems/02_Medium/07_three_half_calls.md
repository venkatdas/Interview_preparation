# Three Half-Size Calls

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Medium |
| **Pattern** | master theorem case 1 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [07_three_half_calls.js](../solutions/07_three_half_calls.js) — open only after a real attempt |

## Problem

Count the total number of calls made by g(n), give the recurrence, solve it with
the master theorem, and give an exact closed form.

  function g(n) {
    calls++;
    if (n <= 1) return;
    const h = n >> 1;          // floor(n / 2)
    g(h); g(h); g(h);          // three recursive calls on half the size, O(1) other work
  }

Bonus: the "buggy fast power" pow(x, n) = pow(x, n/2) * pow(x, n/2) has the same
shape with TWO calls. What is its complexity?

## Examples

```
n = 1 -> 1 call    n = 2 -> 4    n = 3 -> 4    n = 4 -> 13    n = 8 -> 40    n = 1024 -> 88573
```

## Constraints & clarifying questions

```
- n >= 1 integer.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Count the leaves*. Section 5.7 (case 1: leaves dominate) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run it)   Θ(n^log2(3)). Run g with a counter.

</details>

<details><summary>Hint 3</summary>

**The key idea.** C(n) = 3C(⌊n/2⌋) + 1. log₂3 ≈ 1.585 > 0 → case 1 → Θ(n^1.585). Every n in `[2^k, 2^(k+1))` gives a complete ternary tree of depth k, so C = (3^(k+1) − 1)/2. With two calls (the buggy fast power) the same reasoning gives Θ(n).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1 call (just the base case)
- n = 2 and n = 3 give the same count (floor)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run it)   Θ(n^log2(3))

```
Run g with a counter.
```

### APPROACH 2 — Optimal (closed form)   O(1)

```
Recurrence: C(n) = 3·C(floor(n/2)) + 1, C(1) = 1.
Master theorem: a = 3, b = 2, d = 0; log2 3 ≈ 1.585 > 0 -> case 1 (leaves dominate) -> Θ(n^1.585).
Every n in [2^k, 2^(k+1)) halves down to 1 in exactly k steps, so the call tree is a
complete ternary tree of depth k: C = 1 + 3 + 9 + ... + 3^k = (3^(k+1) - 1) / 2,
with k = floor(log2 n) = bitLength(n) - 1.
Number of leaves 3^k = (2^k)^log2(3) ≈ n^1.585: this is Karatsuba's shape (with an O(n) merge, still case 1).
Bonus: two calls -> C(n) = 2C(n/2) + 1 -> case 1 with log2 2 = 1 -> Θ(n). The "fast" power
becomes linear unless you store the half result.
```

### EMPIRICAL CHECK

```
Doubling n triples the leaves: C(2n) / C(n) -> 3 = 2^1.585.
```

### Edge cases

```
- n = 1 -> 1 call (just the base case)
- n = 2 and n = 3 give the same count (floor)
```

### Common mistakes

```
- Answering Θ(n log n) or Θ(n) by "each level halves": the NUMBER of calls triples per level.
- Using log base 10 for the exponent (log10 3 ≠ log2 3).
```

Full JavaScript solution with tests: [07_three_half_calls.js](../solutions/07_three_half_calls.js). Run it with `node 07_three_half_calls.js` from the solutions folder.

</details>

## Related follow-ups

- Karatsuba multiplication: T(n) = 3T(n/2) + n.
- Strassen: T(n) = 7T(n/2) + n² → Θ(n^2.807).
- LeetCode #50 Pow(x, n): why one call per level matters.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
