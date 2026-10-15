# Add Digits

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Easy |
| **Pattern** | digital root formula |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #258 — https://leetcode.com/problems/add-digits/ |
| **Solution file** | [04_add_digits.js](../solutions/04_add_digits.js) — open only after a real attempt |

## Problem

Given a non-negative integer, repeatedly add all its digits until the result has only one
digit. Return that digit.

## Examples

```
Input: 38   Output: 2   Explanation: 3 + 8 = 11, 1 + 1 = 2
Input: 0    Output: 0
Input: 9    Output: 9
```

## Constraints & clarifying questions

```
- Can n be 0? (yes -> 0)
- Follow-up: can you do it without any loop / recursion, in O(1)?
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *digital root formula* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate)   O(log n) time per round, a few rounds, O(1) space. While n has more than one digit, replace n with the sum of its digits.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (digital root formula)   O(1) time, O(1) space. A number and the sum of its digits leave the same remainder when divided by 9, because 10 = 1 (mod 9), so every power of 10 is 1 (mod 9).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 0            -> 0 (the formula would give 1 + (-1 % 9) = 0 in JS by luck; be explicit)
- multiples of 9 -> 9, not 0
- single digit -> itself
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate)   O(log n) time per round, a few rounds, O(1) space

```
While n has more than one digit, replace n with the sum of its digits. Each round shrinks
n a lot (a 10-digit number sums to at most 90), so it ends after 2-3 rounds.
```

### APPROACH 2 — Optimal (digital root formula)   O(1) time, O(1) space

```
A number and the sum of its digits leave the same remainder when divided by 9, because
10 = 1 (mod 9), so every power of 10 is 1 (mod 9). Repeating the digit sum does not change
n mod 9. The final single digit is therefore n mod 9, except that a multiple of 9 (other
than 0) ends at 9, not 0. The formula 1 + (n - 1) % 9 handles both cases.

Dry run on 38: 38 mod 9 = 2 -> 1 + (37 % 9) = 1 + 1 = 2. Matches 3+8=11, 1+1=2.
Dry run on 18: 18 mod 9 = 0 but the answer is 9: 1 + (17 % 9) = 1 + 8 = 9.
Dry run on 0: special-cased -> 0.
```

### Edge cases

```
- 0            -> 0 (the formula would give 1 + (-1 % 9) = 0 in JS by luck; be explicit)
- multiples of 9 -> 9, not 0
- single digit -> itself
```

Full JavaScript solution with tests: [04_add_digits.js](../solutions/04_add_digits.js). Run it with `node 04_add_digits.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the special case 0 in the digital-root formula `1 + (n - 1) % 9`.
- Converting to a string on every iteration is fine but slower than `% 10` arithmetic.
- Stopping after one round of summing instead of repeating until one digit remains.

## Related follow-ups

- [Happy Number](05_happy_number.md) — repeated digit transformation
- [Palindrome Number](01_palindrome_number.md) — digit extraction
- Sum of Digits in Base K (LeetCode #1837) — digits in another base

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
