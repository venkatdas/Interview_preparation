# Doubling Inner Loop

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Medium |
| **Pattern** | Σ log i |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [04_doubling_inner_loop.js](../solutions/04_doubling_inner_loop.js) — open only after a real attempt |

## Problem

Analyze the step count of this function and give a tight Θ bound. Then write a
closed form that computes the EXACT count in O(log n) time.

  function f(n) {
    let steps = 0;
    for (let i = 1; i < n; i++)
      for (let j = 1; j <= i; j *= 2)
        steps++;
    return steps;
  }

## Examples

```
n = 1 -> 0    n = 2 -> 1    n = 5 -> 1+2+2+3 = 8    n = 9 -> 1+2+2+3+3+3+3+4 = 21
```

## Constraints & clarifying questions

```
- n up to 1e15 for the closed form (brute force only up to ~1e6).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *An inner loop with a multiplicative step*. Section 10 (reference table) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run it)   Θ(n log n). Run the nested loops with a counter.

</details>

<details><summary>Hint 3</summary>

**The key idea.** For a fixed i, `j = 1, 2, 4, ...` takes bitLength(i) values. Group i by bit length: the 2^k numbers in `[2^k, 2^(k+1))` each contribute k + 1. The total is Θ(n log n): at most n·log n, and the top half alone gives (n/2)·log(n/2).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> no i at all -> 0
- the last group is partial (n - 1 is usually not 2^(k+1) - 1)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run it)   Θ(n log n)

```
Run the nested loops with a counter.
```

### APPROACH 2 — Optimal (group i by bit length)   O(log n)

```
For fixed i, j takes the values 1, 2, 4, ... ≤ i: that is floor(log2 i) + 1 = bitLength(i) values.
So steps = Σ_{i=1}^{n-1} bitLength(i). All i in [2^k, 2^(k+1)) have bitLength k + 1,
and there are 2^k of them. Sum group by group, cutting the last group at n - 1.
Each term is ≤ log2 n and there are n terms -> O(n log n); the upper half
i ≥ n/2 alone contributes (n/2)·log2(n/2) -> Ω(n log n). Hence Θ(n log n).

Dry run n = 9 (i = 1..8):
  bit length 1: i = 1        -> 1 × 1 = 1
  bit length 2: i = 2,3      -> 2 × 2 = 4
  bit length 3: i = 4..7     -> 4 × 3 = 12
  bit length 4: i = 8        -> 1 × 4 = 4      total 21
```

### EMPIRICAL CHECK

```
doubling ratio slightly above 2 (n log n), e.g. ≈ 2.1 near n = 2^16, approaching 2 slowly.
```

### Edge cases

```
- n = 1 -> no i at all -> 0
- the last group is partial (n - 1 is usually not 2^(k+1) - 1)
```

### Common mistakes

```
- "Two nested loops => n²". The inner loop is logarithmic.
- Using Σ log2 i without the +1 (off by n).
```

Full JavaScript solution with tests: [04_doubling_inner_loop.js](../solutions/04_doubling_inner_loop.js). Run it with `node 04_doubling_inner_loop.js` from the solutions folder.

</details>

## Related follow-ups

- Same loop with j *= 3 (still Θ(n log n)).
- Analyze building a binary heap by repeated insertion vs heapify.
- LeetCode #338 Counting Bits.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
