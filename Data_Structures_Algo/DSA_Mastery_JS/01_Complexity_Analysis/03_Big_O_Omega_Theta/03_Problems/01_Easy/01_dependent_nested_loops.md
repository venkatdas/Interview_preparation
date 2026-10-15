# Dependent Nested Loops

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Easy |
| **Pattern** | arithmetic series |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [01_dependent_nested_loops.js](../solutions/01_dependent_nested_loops.js) — open only after a real attempt |

## Problem

Analyze this function. Give (a) the EXACT number of times the innermost line runs
as a formula in n, (b) a tight Θ bound, (c) the space used. Then confirm the growth
empirically with a step counter.

  function pairProductSum(a) {            // n = a.length
    let total = 0;
    for (let i = 0; i < a.length; i++)
      for (let j = i + 1; j < a.length; j++)
        total += a[i] * a[j];             // <- count this line
    return total;
  }

Part 2: write an equivalent function that does Θ(n) work.

## Examples

```
n = 0 -> 0 steps;  n = 1 -> 0;  n = 2 -> 1;  n = 4 -> 6;  n = 1000 -> 499500
pairProductSum([1, 2, 3]) = 1*2 + 1*3 + 2*3 = 11
```

## Constraints & clarifying questions

```
- What is n? (the array length)
- Count only the innermost line? (yes; the other lines add lower-order terms)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Count iterations of a dependent inner loop*. Section 10 (reference table) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run the code and count)   Θ(n²) time. bruteForce(n) runs the loops literally and returns the step count. This is the ground truth we test the formula against.

</details>

<details><summary>Hint 3</summary>

**The key idea.** For a fixed i the inner loop runs `n - 1 - i` times. Add them up: (n−1) + (n−2) + ... + 0 = n(n−1)/2, which is Θ(n²). For the Θ(n) version keep a running prefix sum and add `a[j] * prefix`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 and n = 1 -> 0 steps (the inner loop never starts)
- the formula must be exact for every n, not just large n
- n = 0 in JS: 0 * (0 - 1) / 2 is -0 (a fun Programming Fundamentals reminder)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run the code and count)   Θ(n²) time

```
bruteForce(n) runs the loops literally and returns the step count. This is the
ground truth we test the formula against.
```

### APPROACH 2 — Optimal (closed form)   Θ(1) to evaluate

```
For a fixed i the inner loop runs (n - 1 - i) times. Sum over i = 0..n-1:
  (n-1) + (n-2) + ... + 1 + 0 = n(n-1)/2
n(n-1)/2 = n²/2 - n/2 -> Θ(n²): it is O(n²) (c = 1/2) and Ω(n²) (c = 1/4 for n >= 2).
Space: Θ(1) extra (two counters and the total).
Part 2: Σ_{i<j} a_i a_j = ((Σ a)² - Σ a²) / 2, or a running prefix sum:
  for each j: total += a[j] * prefix; prefix += a[j]   -> Θ(n).
```

### EMPIRICAL CHECK

```
steps(2n) / steps(n) = 2n(2n-1) / (n(n-1)) -> 4 as n grows (the quadratic signature).
```

### Edge cases

```
- n = 0 and n = 1 -> 0 steps (the inner loop never starts)
- the formula must be exact for every n, not just large n
- n = 0 in JS: 0 * (0 - 1) / 2 is -0 (a fun Programming Fundamentals reminder)
```

### Common mistakes

```
- Answering n² "because two loops" without the 1/2 (fine for Θ, wrong for the exact count).
- Thinking j starting at i + 1 makes it Θ(n log n). It only halves the work.
```

Full JavaScript solution with tests: [01_dependent_nested_loops.js](../solutions/01_dependent_nested_loops.js). Run it with `node 01_dependent_nested_loops.js` from the solutions folder.

</details>

## Related follow-ups

- Triple loop i < j < k: exact count C(n, 3) = Θ(n³).
- LeetCode #1 Two Sum (from Θ(n²) pairs to Θ(n) with a map).
- Count pairs with i < j and a[i] > a[j] (inversions) in Θ(n log n).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
