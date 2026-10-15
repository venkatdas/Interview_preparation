# Root-Dominated Recursion

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Medium |
| **Pattern** | master theorem case 3 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [08_root_dominated_recursion.js](../solutions/08_root_dominated_recursion.js) — open only after a real attempt |

## Problem

h(n) does a quadratic amount of work and then recurses on two halves:

  function h(n) {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) steps++;   // n² work
    if (n <= 1) return;
    h(Math.floor(n / 2)); h(Math.ceil(n / 2));
  }

Write the recurrence, solve it with the master theorem, and compute the exact step
count for n = 1e9 (running the code is impossible: ~2e18 steps). Explain why the
recursion "does not matter" here.

## Examples

```
n = 1 -> 1   n = 2 -> 6   n = 3 -> 9 + 1 + 4 + 2·1 = 16   n = 4 -> 28   n = 1024 -> 2·1024² - 1024 = 2096128
```

## Constraints & clarifying questions

```
- Exact answer for n up to 1e9 must fit in a double exactly? (≈ 2e18 > 2^53: use BigInt)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Compare the work at the root with the work below it*. Section 5.7 (case 3) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run it)   Θ(n²). Run h with a counter (only feasible for small n).

</details>

<details><summary>Hint 3</summary>

**The key idea.** W(n) = n² + W(⌊n/2⌋) + W(⌈n/2⌉). Level i costs n²/2^i, a geometric series below 2n², so the root dominates: Θ(n²). For the exact value memoize on n: only two distinct sizes per level, so O(log n) evaluations, using BigInt.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 0 work (the loops do not run; we stop at n <= 1 after the loops)
- odd n: floor and ceil differ; the memo still has only two sizes per level
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run it)   Θ(n²)

```
Run h with a counter (only feasible for small n).
```

### APPROACH 2 — Optimal (memoized recurrence on distinct sizes)   O(log n) time

```
W(n) = n² + W(floor(n/2)) + W(ceil(n/2)), W(0) = 0, W(1) = 1.
At each depth the sizes are only floor/ceil of n/2^i, so at most 2 distinct values per level:
memoizing on n gives O(log n) evaluations. BigInt keeps it exact.
Master theorem: a = 2, b = 2, d = 2; log2 2 = 1 < 2 -> case 3 (root dominates) -> Θ(n²).
Level i costs 2^i · (n/2^i)² = n² / 2^i: a geometric series 1 + 1/2 + 1/4 + ... < 2,
so W(n) < 2n², and the root alone is n² -> Θ(n²). For n = 2^k exactly: W = 2n² - n.
```

### EMPIRICAL CHECK

```
W(2n) / W(n) -> 4 (quadratic), same as the root alone.
```

### Edge cases

```
- n = 0 -> 0 work (the loops do not run; we stop at n <= 1 after the loops)
- odd n: floor and ceil differ; the memo still has only two sizes per level
```

### Common mistakes

```
- Writing Θ(n² log n) by analogy with merge sort (that is case 2, when every level costs the same).
- Forgetting that the result overflows 2^53 for large n.
```

Full JavaScript solution with tests: [08_root_dominated_recursion.js](../solutions/08_root_dominated_recursion.js). Run it with `node 08_root_dominated_recursion.js` from the solutions folder.

</details>

## Related follow-ups

- T(n) = T(n/2) + n (quickselect's best-case shape) → Θ(n).
- T(n) = T(n/3) + T(2n/3) + n: solve with a recursion tree (Θ(n log n)).
- Analyze building a segment tree recursively.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
