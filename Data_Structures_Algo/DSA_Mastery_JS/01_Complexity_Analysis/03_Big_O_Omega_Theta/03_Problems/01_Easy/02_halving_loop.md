# Halving Loop

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Easy |
| **Pattern** | logarithmic loop |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [02_halving_loop.js](../solutions/02_halving_loop.js) — open only after a real attempt |

## Problem

Analyze this function. Give the exact number of loop iterations as a formula in n
(n >= 1), a tight Θ bound, and confirm it with a step counter.

  function countHalvings(n) {
    let steps = 0;
    for (let i = n; i > 0; i = Math.floor(i / 2)) steps++;
    return steps;
  }

Then answer: what changes if the update is i = i - 2 instead? And i = Math.floor(i / 3)?

## Examples

```
n = 1 -> 1    n = 2 -> 2    n = 7 -> 3    n = 8 -> 4    n = 1e9 -> 30
```

## Constraints & clarifying questions

```
- n is a positive integer up to 2^53.
- Does the base of the logarithm matter for Θ? (no; it matters for the exact count)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *How many times can you halve n?* Section 5.5 (logarithms) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run it)   Θ(log n). Run the loop and count.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Each iteration removes one binary digit of i, so the loop runs once per bit: `floor(log2 n) + 1` = the bit length of n. Doubling n adds exactly one iteration.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1 step
- exact powers of two: Math.log2(2**k) is exact, but Math.log2 on large non-powers can round; the bit-length formula is safer
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run it)   Θ(log n)

```
Run the loop and count.
```

### APPROACH 2 — Optimal (closed form)   Θ(1)

```
Each iteration removes one binary digit from i (floor(i/2) is i >> 1 for small i).
The loop runs once per bit of n: steps = floor(log2 n) + 1 = the bit length of n.
Use n.toString(2).length to avoid floating-point log errors near powers of two.
Θ(log n). Variants: i -= 2 -> ceil(n/2) iterations, Θ(n); i = floor(i/3) -> floor(log3 n) + 1, still Θ(log n)
(different base = constant factor).
```

### EMPIRICAL CHECK

```
Doubling n adds exactly ONE step: steps(2n) = steps(n) + 1. The ratio steps(2n)/steps(n) -> 1.
```

### Edge cases

```
- n = 1 -> 1 step
- exact powers of two: Math.log2(2**k) is exact, but Math.log2 on large non-powers can round; the bit-length formula is safer
```

### Common mistakes

```
- Off by one: answering floor(log2 n) (forgets the iteration with i = 1).
- Calling it Θ(n/2) because "it halves": the NUMBER of halvings is logarithmic.
```

Full JavaScript solution with tests: [02_halving_loop.js](../solutions/02_halving_loop.js). Run it with `node 02_halving_loop.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #704 Binary Search (why it is Θ(log n)).
- LeetCode #191 Number of 1 Bits (loop over bits).
- Count iterations of `while (i < n) i = i * i` (Θ(log log n)).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
