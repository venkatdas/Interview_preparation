# Reverse Integer

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Medium |
| **Pattern** | digit reversal + overflow |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #7 — https://leetcode.com/problems/reverse-integer/ |
| **Solution file** | [02_reverse_integer.js](../solutions/02_reverse_integer.js) — open only after a real attempt |

## Problem

Given a signed 32-bit integer x, return x with its digits reversed. If reversing makes
the value go outside [-2^31, 2^31 - 1], return 0. Assume you cannot store 64-bit integers.

## Examples

```
Input: 123    Output: 321
Input: -123   Output: -321
Input: 120    Output: 21      Explanation: leading zero disappears
Input: 1534236469  Output: 0  Explanation: 9646324351 overflows 32 bits
```

## Constraints & clarifying questions

```
- What to return on overflow? (0)
- Is x itself always within 32 bits? (yes)
- Does the sign stay in front? (yes: -123 -> -321)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *digit reversal + overflow* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (string)   O(d) time, O(d) space. Take the absolute value, convert to string, reverse, parse, re-apply the sign, then check the 32-bit range.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (digit loop with overflow check before the multiply)   O(d) time, O(1) space. Peel digits with % 10 and floor-divide by 10.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 0                    -> 0
- trailing zeros       -> dropped (120 -> 21)
- exactly at the limit -> 2147483647 reversed overflows -> 0
- -2^31 (-2147483648)  -> reversed overflows -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (string)   O(d) time, O(d) space

```
Take the absolute value, convert to string, reverse, parse, re-apply the sign, then check
the 32-bit range. Works, but relies on JS numbers being 64-bit floats.
```

### APPROACH 2 — Optimal (digit loop with overflow check before the multiply)   O(d) time, O(1) space

```
Peel digits with % 10 and floor-divide by 10. Before doing reversed * 10 + digit, check
whether it would exceed the limit: reversed > MAX / 10, or reversed === MAX / 10 and
digit > 7 (MAX ends in 7, MIN ends in 8). We work on |x| and re-apply the sign at the end.

Dry run on x = -123:
  sign=-1, n=123, rev=0
  digit=3 -> rev=3,   n=12
  digit=2 -> rev=32,  n=1
  digit=1 -> rev=321, n=0
  return -321
```

### Edge cases

```
- 0                    -> 0
- trailing zeros       -> dropped (120 -> 21)
- exactly at the limit -> 2147483647 reversed overflows -> 0
- -2^31 (-2147483648)  -> reversed overflows -> 0
```

Full JavaScript solution with tests: [02_reverse_integer.js](../solutions/02_reverse_integer.js). Run it with `node 02_reverse_integer.js` from the solutions folder.

</details>

## Common mistakes

- Checking for overflow only at the end; in a 32-bit language the overflow already happened. Check before multiplying by 10.
- Using `%` on negatives and expecting a positive digit; JS keeps the sign (-123 % 10 is -3).
- Using `Math.floor` for negative division; use `Math.trunc`.

## Related follow-ups

- [Palindrome Number](../01_Easy/01_palindrome_number.md) — digit extraction
- [String to Integer](../../../../04_Strings/03_Problems/02_Medium/06_string_to_integer_atoi.md) — 32-bit clamping while parsing
- [Add Digits](../01_Easy/04_add_digits.md) — digit manipulation

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
