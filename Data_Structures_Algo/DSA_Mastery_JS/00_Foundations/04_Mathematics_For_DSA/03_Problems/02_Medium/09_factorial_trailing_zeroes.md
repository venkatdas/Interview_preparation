# Factorial Trailing Zeroes

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Medium |
| **Pattern** | counting factors of 5 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #172 — https://leetcode.com/problems/factorial-trailing-zeroes/ |
| **Solution file** | [09_factorial_trailing_zeroes.js](../solutions/09_factorial_trailing_zeroes.js) — open only after a real attempt |

## Problem

Given an integer n, return the number of trailing zeroes in n! (n factorial).

## Examples

```
Input: 3    Output: 0    Explanation: 3! = 6
Input: 5    Output: 1    Explanation: 5! = 120
Input: 25   Output: 6    Explanation: 25! ends in 000000
```

## Constraints & clarifying questions

```
- n up to 10^4; n! has thousands of digits, so computing it is not the plan
- Follow-up: can you do it in O(log n)?
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting factors of 5* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (compute n! with BigInt, count zeros)   O(n * digits) time, O(digits) space. Multiply 1..n as a BigInt, convert to a string, count trailing '0's.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count factors of 5)   O(log5 n) time, O(1) space. A trailing zero comes from a factor of 10 = 2 * 5.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 0! = 1 -> 0 zeroes
- n < 5 -> 0
- n = 5^k boundaries (5, 25, 125) each add a new layer
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (compute n! with BigInt, count zeros)   O(n * digits) time, O(digits) space

```
Multiply 1..n as a BigInt, convert to a string, count trailing '0's. Works for small n
only; the number grows to ~35,000 digits for n = 10^4.
```

### APPROACH 2 — Optimal (count factors of 5)   O(log5 n) time, O(1) space

```
A trailing zero comes from a factor of 10 = 2 * 5. In n! there are always far more 2s than
5s, so the number of zeros equals the number of times 5 appears as a factor across
1..n. Multiples of 5 contribute one 5 each (n / 5 of them), multiples of 25 contribute a
second one (n / 25), multiples of 125 a third (n / 125), and so on.

Dry run on n = 25:
  25 / 5   = 5   (5, 10, 15, 20, 25)
  25 / 25  = 1   (25 has a second factor of 5)
  25 / 125 = 0   stop
  total = 6
Dry run on n = 100: 100/5 = 20, 100/25 = 4, 100/125 = 0 -> 24
```

### Edge cases

```
- n = 0 -> 0! = 1 -> 0 zeroes
- n < 5 -> 0
- n = 5^k boundaries (5, 25, 125) each add a new layer
```

Full JavaScript solution with tests: [09_factorial_trailing_zeroes.js](../solutions/09_factorial_trailing_zeroes.js). Run it with `node 09_factorial_trailing_zeroes.js` from the solutions folder.

</details>

## Common mistakes

- Computing n! directly; it overflows almost immediately.
- Counting only multiples of 5 and missing the extra 5s in 25, 125, ...
- Counting factors of 2 (there are always more 2s than 5s, so 5s decide).

## Related follow-ups

- [Count Primes](08_count_primes.md) — another number theory warm-up
- Preimage Size of Factorial Zeroes Function (LeetCode #793) — binary search on this count
- [Add Digits](../01_Easy/04_add_digits.md) — math shortcut instead of simulation

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
