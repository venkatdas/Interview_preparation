# Pow

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Medium |
| **Pattern** | fast exponentiation |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #50 — https://leetcode.com/problems/powx-n/ |
| **Solution file** | [06_pow_x_n.js](../solutions/06_pow_x_n.js) — open only after a real attempt |

## Problem

Implement pow(x, n): compute x raised to the integer power n. n can be negative.

## Examples

```
Input: x = 2, n = 10     Output: 1024
Input: x = 2, n = -2     Output: 0.25     Explanation: 1 / 2^2
Input: x = 2.1, n = 3    Output: 9.261
Input: x = 5, n = 0      Output: 1
```

## Constraints & clarifying questions

```
- Can n be negative? (yes -> 1 / x^|n|)
- Can I use Math.pow / **? (no, that is the point of the question)
- How large is n? (up to 2^31, so an O(n) loop is too slow; and -2^31 negated overflows in
  32-bit languages, in JS it is fine)
- Floating point: is approximate equality acceptable? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fast exponentiation* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(|n|) time, O(1) space. Multiply x by itself |n| times.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary exponentiation)   O(log |n|) time, O(1) space. x^n = (x^2)^(n/2) when n is even, and x * (x^2)^((n-1)/2) when n is odd.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0            -> 1 (even for x = 0)
- n negative       -> invert x, use |n|
- x = 1 or -1      -> stays 1 / alternates sign
- x = 0, n > 0     -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(|n|) time, O(1) space

```
Multiply x by itself |n| times. For n = 10^9 that is a billion multiplications.
```

### APPROACH 2 — Optimal (binary exponentiation)   O(log |n|) time, O(1) space

```
x^n = (x^2)^(n/2) when n is even, and x * (x^2)^((n-1)/2) when n is odd.
Loop: if the current bit of n is 1, multiply the result by the current base; then square
the base and shift n right. Each iteration halves n, so about 31 iterations max.

Dry run x=2, n=10 (binary 1010):
  n=10 even          base=4        result=1
  n=5  odd  result=4 base=16
  n=2  even          base=256      result=4
  n=1  odd  result=4*256=1024  base=65536
  n=0  -> 1024
```

### Edge cases

```
- n = 0            -> 1 (even for x = 0)
- n negative       -> invert x, use |n|
- x = 1 or -1      -> stays 1 / alternates sign
- x = 0, n > 0     -> 0
```

Full JavaScript solution with tests: [06_pow_x_n.js](../solutions/06_pow_x_n.js). Run it with `node 06_pow_x_n.js` from the solutions folder.

</details>

## Common mistakes

- Looping n times (O(n)), which times out for n near 2^31.
- Negating n = -2^31 in a 32-bit language overflows; in JS it is fine, but handle negative n by inverting x.
- Recursing on `pow(x, n/2) * pow(x, n/2)`, which recomputes and is still O(n).

## Related follow-ups

- [Sqrt](../01_Easy/07_sqrt_x.md) — the inverse operation with binary search
- Super Pow (LeetCode #372) — modular fast exponentiation
- [Multiply Strings](../../../../04_Strings/03_Problems/02_Medium/14_multiply_strings.md) — arithmetic by hand

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
