# Sum of Digits

| | |
|---|---|
| **Topic** | Recursion Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | linear recursion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [01_sum_of_digits.js](../solutions/01_sum_of_digits.js) — open only after a real attempt |

## Problem

Given a non-negative integer n, return the sum of its decimal digits using
RECURSION (no loops, no string conversion in the recursive version). Then extend it:
superDigit(n) keeps summing digits until a single digit remains, also recursively.

## Examples

```
Input: 4096   sumDigits = 19   superDigit = 1   (4096 -> 19 -> 10 -> 1)
Input: 7      sumDigits = 7    superDigit = 7
Input: 0      sumDigits = 0    superDigit = 0
Input: 999999 sumDigits = 54   superDigit = 9
```

## Constraints & clarifying questions

```
- 0 <= n <= Number.MAX_SAFE_INTEGER (at most 16 digits -> depth is tiny)
- Negative numbers? (not allowed; throw)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Linear recursion* on a number. Read sections 5.1 and 8 (dry run) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (string, iterative reference)   O(d) time, O(d) space. String(n).split('').reduce(...) — correct and simple; used as the oracle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A single digit (`n < 10`) is its own digit sum. Otherwise the last digit is `n % 10` and the rest of the number is `Math.floor(n / 10)`: return `n % 10 + sumDigits(Math.floor(n / 10))`. superDigit just applies sumDigits until the result is a single digit.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 0 (base case covers it: 0 < 10)
- n with zeros inside (4096) -> zeros add nothing but still recurse
- n < 0 or non-integer -> RangeError
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (string, iterative reference)   O(d) time, O(d) space

```
String(n).split('').reduce(...) — correct and simple; used as the oracle.
```

### APPROACH 2 — Optimal (linear recursion on the last digit)   O(d) time, O(d) stack

```
Base case: n < 10 -> n itself (a single digit).
Smaller problem: Math.floor(n / 10) drops the last digit.
Combine: (n % 10) + sumDigits(Math.floor(n / 10)).
superDigit(n) = n < 10 ? n : superDigit(sumDigits(n)).

Dry run sumDigits(4096):
  4096 -> 6 + sumDigits(409)
  409  -> 9 + sumDigits(40)
  40   -> 0 + sumDigits(4)
  4    -> base case 4
  unwinding: 0+4=4, 9+4=13, 6+13=19
```

### Edge cases

```
- n = 0 -> 0 (base case covers it: 0 < 10)
- n with zeros inside (4096) -> zeros add nothing but still recurse
- n < 0 or non-integer -> RangeError
```

### Common mistakes

```
- Base case n === 0 only: works, but sumDigits(7) then needs an extra call; n < 10 is cleaner.
- Using n / 10 without Math.floor -> never reaches the base case cleanly (floats).
- Forgetting to return the recursive expression.
```

Full JavaScript solution with tests: [01_sum_of_digits.js](../solutions/01_sum_of_digits.js). Run it with `node 01_sum_of_digits.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #258 Add Digits (O(1) digital root).
- Count the digits of n recursively.
- Reverse the digits of n recursively without strings.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
