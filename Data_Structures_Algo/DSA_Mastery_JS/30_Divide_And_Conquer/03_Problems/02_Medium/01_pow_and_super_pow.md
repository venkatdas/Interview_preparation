# Pow

| | |
|---|---|
| **Topic** | Divide and Conquer |
| **Difficulty** | Medium |
| **Pattern** | halve the exponent, digit-by-digit mod |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #50 — https://leetcode.com/problems/powx-n/; LeetCode #372 — https://leetcode.com/problems/super-pow/ |
| **Solution file** | [01_pow_and_super_pow.js](../solutions/01_pow_and_super_pow.js) — open only after a real attempt |

## Problem

(a) myPow(x, n): compute x raised to the integer power n (n may be negative).
(b) superPow(a, b): compute a^b mod 1337 where b is a HUGE number given as an array of
    decimal digits, e.g. b = [1,0] means 10.

## Examples

```
myPow(2.0, 10) -> 1024.0;  myPow(2.0, -2) -> 0.25;  myPow(2.1, 3) -> 9.261
superPow(2, [3]) -> 8;  superPow(2, [1,0]) -> 1024 % 1337 = 1024;  superPow(1, [4,3,3,8,5,2]) -> 1
```

## Constraints & clarifying questions

```
- n fits in 32 bits (so -2^31 is possible: negating it overflows in some languages, not JS)
- x can be 0 with n negative? (assume not)
- superPow: b can have 2000 digits -> cannot convert to a number
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *halve the exponent, digit-by-digit mod* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time. Multiply x by itself |n| times (invert at the end if n &lt; 0).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Divide & conquer: repeated squaring)   O(log n) time. x^n = (x^(n/2))^2 if n is even, x * (x^(n/2))^2 if n is odd.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 1 (even for x = 0)
- n negative -> 1 / x^|n|
- x = 1 or -1 with huge n (-1^odd = -1)
- superPow with b = [0] -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time

```
Multiply x by itself |n| times (invert at the end if n < 0). Too slow for n = 2^31.
```

### APPROACH 2 — Optimal (Divide & conquer: repeated squaring)   O(log n) time

```
x^n = (x^(n/2))^2 if n is even, x * (x^(n/2))^2 if n is odd. Each step halves n.
Iterative form: walk the bits of n from least significant; keep base = x^(2^i).

Dry run myPow(3, 5): n = 5 = 101b
  bit 1: result *= 3 -> 3;      base = 9
  bit 0: skip;                  base = 81
  bit 1: result *= 81 -> 243;   done. 3^5 = 243

superPow: split the exponent digit by digit: a^(10 * prefix + d) = (a^prefix)^10 * a^d.
Walk the digits left to right keeping result = a^(digits so far) mod 1337; each step costs
two small fast powers. Total O(len(b) * log 10).

Dry run superPow(2, [1,0]): result 1
  digit 1: result = 1^10 * 2^1 = 2
  digit 0: result = 2^10 * 2^0 = 1024 -> 1024 % 1337 = 1024
```

### Edge cases

```
- n = 0 -> 1 (even for x = 0)
- n negative -> 1 / x^|n|
- x = 1 or -1 with huge n (-1^odd = -1)
- superPow with b = [0] -> 1
```

Full JavaScript solution with tests: [01_pow_and_super_pow.js](../solutions/01_pow_and_super_pow.js). Run it with `node 01_pow_and_super_pow.js` from the solutions folder.

</details>

## Common mistakes

- Negating `n` for negative exponents in a 32-bit language overflows at -2^31; in JS take `Math.abs(n)` and invert at the end.
- Recursing `pow(x, n/2) * pow(x, n/2)` with two calls - that is O(n), not O(log n). Compute once and square.
- Super Pow: multiplying numbers bigger than the modulus without reducing first.

## Related follow-ups

- Count Good Numbers (LeetCode #1922)
- Fibonacci in O(log n) via matrix power
- [Math for DSA](../../../00_Foundations/04_Mathematics_For_DSA/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
