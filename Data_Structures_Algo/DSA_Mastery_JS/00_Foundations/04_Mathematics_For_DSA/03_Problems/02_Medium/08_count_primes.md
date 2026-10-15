# Count Primes

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Medium |
| **Pattern** | Sieve of Eratosthenes |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #204 — https://leetcode.com/problems/count-primes/ |
| **Solution file** | [08_count_primes.js](../solutions/08_count_primes.js) — open only after a real attempt |

## Problem

Given an integer n, return the number of prime numbers strictly less than n.

## Examples

```
Input: 10   Output: 4    Explanation: 2, 3, 5, 7
Input: 0    Output: 0
Input: 1    Output: 0
Input: 2    Output: 0    Explanation: strictly less than 2, so 2 itself is not counted
```

## Constraints & clarifying questions

```
- Strictly less than n, or <= n? (strictly less)
- How big is n? (up to 5 * 10^6, so O(n sqrt n) trial division is too slow)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Sieve of Eratosthenes* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (trial division per number)   O(n sqrt n) time, O(1) space. For each number from 2 to n - 1, test primality by trying divisors up to its square root.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Sieve of Eratosthenes)   O(n log log n) time, O(n) space. Assume every number from 2 to n - 1 is prime.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n <= 2 -> 0
- n = 3  -> 1 (only 2)
- large n -> use a typed array (Uint8Array) for memory and speed
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (trial division per number)   O(n sqrt n) time, O(1) space

```
For each number from 2 to n - 1, test primality by trying divisors up to its square root.
```

### APPROACH 2 — Optimal (Sieve of Eratosthenes)   O(n log log n) time, O(n) space

```
Assume every number from 2 to n - 1 is prime. For each p starting at 2, if p is still
marked prime, cross out all multiples of p starting at p * p (smaller multiples were
already crossed out by a smaller prime factor). Stop when p * p >= n. Count the survivors.

Dry run on n = 10 (candidates 2..9):
  p=2: cross 4, 6, 8          remaining: 2 3 5 7 9
  p=3: cross 9                remaining: 2 3 5 7
  p=4: 16 >= 10 stop
  count = 4
```

### Edge cases

```
- n <= 2 -> 0
- n = 3  -> 1 (only 2)
- large n -> use a typed array (Uint8Array) for memory and speed
```

Full JavaScript solution with tests: [08_count_primes.js](../solutions/08_count_primes.js). Run it with `node 08_count_primes.js` from the solutions folder.

</details>

## Common mistakes

- Counting primes `<= n`; the problem asks for primes strictly less than n.
- Starting the inner sieve loop at 2·i instead of i·i (correct, but slower).
- Testing each number by trial division up to n instead of up to √n.

## Related follow-ups

- [Factorial Trailing Zeroes](09_factorial_trailing_zeroes.md) — counting factors
- Ugly Number (LeetCode #263) — factor checks
- [Ugly Number II](../../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/15_ugly_number_ii.md) — generating numbers by prime factors

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
