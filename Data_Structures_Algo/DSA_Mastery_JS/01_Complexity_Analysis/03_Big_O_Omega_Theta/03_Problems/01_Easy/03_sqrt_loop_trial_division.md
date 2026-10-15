# Square-Root Loop and Trial Division

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Easy |
| **Pattern** | √n loop, best vs worst case |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [03_sqrt_loop_trial_division.js](../solutions/03_sqrt_loop_trial_division.js) — open only after a real attempt |

## Problem

Analyze trial division. Count the number of times the % check runs, and give the
BEST-case and WORST-case Θ bounds as a function of n. Which inputs produce each case?

  function isPrime(n) {                       // n >= 2
    for (let d = 2; d * d <= n; d++)
      if (n % d === 0) return false;          // <- count this check
    return true;
  }

Write a closed-form step count: steps(n) = (smallest divisor d of n with d*d <= n) - 1
if such a divisor exists, else floor(sqrt(n)) - 1.

## Examples

```
n = 2 -> 0 checks (loop never runs)     n = 4 -> 1 (d = 2 divides)
n = 97 (prime) -> 8 (d = 2..9)          n = 1000000 -> 1 (even: best case)
n = 999983 (prime) -> 998               n = 25 -> 4 (d = 2,3,4,5)
```

## Constraints & clarifying questions

```
- n up to 1e12 -> worst case 1e6 checks: fine.
- Is the input SIZE n, or the number of digits? (here we analyze in terms of the value n;
  in terms of bits b, √n = 2^(b/2): exponential! This is a pseudo-polynomial algorithm.)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Best case vs worst case*, and a loop that stops at √n. Sections 5.2 and 9 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run it)   Θ(1) best, Θ(√n) worst. Run the loop with a counter.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The loop stops at the smallest divisor d ≤ √n after d − 1 checks; if none exists (n is prime) it runs `floor(√n) − 1` times. Best case Θ(1) (even n), worst case Θ(√n) (prime n). In terms of input bits that is exponential: pseudo-polynomial.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 2, 3 -> 0 checks
- perfect squares of primes (25, 49): the divisor is exactly √n, so d*d <= n must use <=
- floating sqrt: use an integer correction, not Math.floor(Math.sqrt(n)) blindly for huge n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run it)   Θ(1) best, Θ(√n) worst

```
Run the loop with a counter.
```

### APPROACH 2 — Optimal (closed form)   O(√n) to find the smallest divisor, O(1) to evaluate

```
The loop stops at the smallest divisor d ≤ √n, after d - 1 checks (d = 2 is the first check).
If n is prime, no divisor ≤ √n exists and the loop runs d = 2..floor(√n): floor(√n) - 1 checks.
Best case: n even -> 1 check -> Θ(1). Worst case: n prime -> Θ(√n).
Average over all n is dominated by small divisors (half the numbers are even), but
"the complexity of isPrime" usually means the worst case: Θ(√n).
```

### EMPIRICAL CHECK

```
For primes p near 4x apart, steps grow ~2x (√ signature): steps(4p) / steps(p) ≈ 2.
```

### Edge cases

```
- n = 2, 3 -> 0 checks
- perfect squares of primes (25, 49): the divisor is exactly √n, so d*d <= n must use <=
- floating sqrt: use an integer correction, not Math.floor(Math.sqrt(n)) blindly for huge n
```

### Common mistakes

```
- Saying "Ω(1) because best case" — Ω and best case are different things (see concepts 5.2).
- Loop condition d * d < n: misses the square divisor (25 would be "prime").
```

Full JavaScript solution with tests: [03_sqrt_loop_trial_division.js](../solutions/03_sqrt_loop_trial_division.js). Run it with `node 03_sqrt_loop_trial_division.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #204 Count Primes (sieve: Θ(n log log n)).
- Factor n completely by trial division: worst-case analysis.
- LeetCode #367 Valid Perfect Square (binary search on the answer).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
