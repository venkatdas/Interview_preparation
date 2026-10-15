# Fibonacci Call Tree

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Hard |
| **Pattern** | subtract-and-conquer recurrence, induction |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [09_fibonacci_call_tree.js](../solutions/09_fibonacci_call_tree.js) — open only after a real attempt |

## Problem

Count the calls made by naive recursive Fibonacci, prove the count is exactly
2·F(n+1) - 1, and derive a tight bound. Explain why the master theorem does not
apply, and compare with the memoized version's call count.

  function fib(n) { calls++; if (n < 2) return n; return fib(n - 1) + fib(n - 2); }

## Examples

```
(Fibonacci numbers: F(0)=0, F(1)=1, F(2)=1, F(3)=2, ...)
n = 0 -> 1 call   n = 1 -> 1   n = 2 -> 3   n = 5 -> 15   n = 10 -> 177   n = 30 -> 2692537
```

## Constraints & clarifying questions

```
- Exact count for n up to 70 (fits in a double: 2F(71) ≈ 6.1e14 < 2^53).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 45 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *The master theorem does not apply* (sizes n−1 and n−2). Sections 5.6 and 5.8 in [the concepts guide](../../01_Concepts/CONCEPTS.md), and [Proof of Correctness](../../../../02_Problem_Solving_Fundamentals/05_Proof_Of_Correctness/README.md) for induction.

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run it)   Θ(φ^n). Run naive fib with a counter (only up to n ≈ 32 in reasonable time).

</details>

<details><summary>Hint 3</summary>

**The key idea.** C(n) = C(n−1) + C(n−2) + 1 with C(0) = C(1) = 1. Guess `2F(n+1) − 1` and prove it by induction: (2F(n) − 1) + (2F(n−1) − 1) + 1 = 2F(n+1) − 1. Since F(n) = Θ(φ^n), so is C(n). Memoization makes it 2n − 1 calls.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0, 1 -> one call each
- large n: use the closed form; never run naive fib past ~35 in tests
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run it)   Θ(φ^n)

```
Run naive fib with a counter (only up to n ≈ 32 in reasonable time).
```

### APPROACH 2 — Optimal (prove a closed form, evaluate it iteratively)   O(n)

```
Recurrence: C(n) = C(n-1) + C(n-2) + 1, C(0) = C(1) = 1.
Guess C(n) = 2F(n+1) - 1. Proof by induction:
  base: C(0) = 2F(1) - 1 = 1 ✓, C(1) = 2F(2) - 1 = 1 ✓
  step: C(n) = (2F(n) - 1) + (2F(n-1) - 1) + 1 = 2(F(n) + F(n-1)) - 1 = 2F(n+1) - 1 ✓
F(n) = Θ(φ^n) with φ = (1 + √5)/2 ≈ 1.618 (Binet), so C(n) = Θ(φ^n).
Loose bounds also work: C(n) ≤ 2C(n-1)+1 -> O(2^n); C(n) ≥ 2C(n-2) -> Ω(√2^n). φ^n is the tight one.
The master theorem needs subproblems of size n/b; here sizes are n-1 and n-2 (subtract-and-conquer).
Memoized fib: each value is computed once and calls fib twice -> 2n - 1 calls for n >= 1: Θ(n).
```

### EMPIRICAL CHECK

```
C(n+1) / C(n) -> φ ≈ 1.618 (constant ratio per +1 step = exponential growth).
```

### Edge cases

```
- n = 0, 1 -> one call each
- large n: use the closed form; never run naive fib past ~35 in tests
```

### Common mistakes

```
- Saying Θ(2^n) as the tight bound (it is an upper bound; tight is φ^n).
- Saying the space is exponential too: the stack depth is only n -> Θ(n) space.
```

Full JavaScript solution with tests: [09_fibonacci_call_tree.js](../solutions/09_fibonacci_call_tree.js). Run it with `node 09_fibonacci_call_tree.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #509 Fibonacci Number (memo and bottom-up).
- LeetCode #70 Climbing Stairs.
- Count calls of naive recursive binomial C(n, k) = C(n−1, k−1) + C(n−1, k).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
