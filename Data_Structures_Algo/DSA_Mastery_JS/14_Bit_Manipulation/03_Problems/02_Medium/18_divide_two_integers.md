# Divide Two Integers

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | shift-and-subtract |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #29 — https://leetcode.com/problems/divide-two-integers/ |
| **Solution file** | [18_divide_two_integers.js](../solutions/18_divide_two_integers.js) — open only after a real attempt |

## Problem

Divide two integers without using *, / or %. Truncate toward zero. The result must fit in
a 32-bit signed int: if it overflows (only -2^31 / -1), return 2^31 - 1.

## Examples

```
Input: dividend = 10, divisor = 3    Output: 3
Input: dividend = 7, divisor = -3    Output: -2
Input: dividend = -2147483648, divisor = -1   Output: 2147483647 (clamped)
```

## Constraints & clarifying questions

```
- divisor is never 0? (yes)
- Truncate toward zero (not floor)? (yes: -7 / 2 = -3)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *shift-and-subtract* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(quotient) time. Repeatedly subtract |divisor| from |dividend| and count.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (doubling / shift-and-subtract, long division in base 2)   O(32^2) = O(1) time, O(1) space. Work with positive values (track the sign separately).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- overflow case -2^31 / -1 -> clamp to 2^31 - 1
- dividend = 0 -> 0
- |dividend| < |divisor| -> 0
- negative / negative -> positive
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(quotient) time

```
Repeatedly subtract |divisor| from |dividend| and count. 2^31 iterations in the worst
case - far too slow, but shows the idea.
```

### APPROACH 2 — Optimal (doubling / shift-and-subtract, long division in base 2)   O(32^2) = O(1) time, O(1) space

```
Work with positive values (track the sign separately). While remaining >= divisor:
double the divisor (and a matching `multiple` starting at 1) as long as the doubled value
still fits. Subtract that biggest chunk and add `multiple` to the quotient. Each outer
round strips the highest remaining bit of the quotient, like long division in base 2.
Doubling is done with `+` (no `*`), and we never shift, so the 32-bit trap of `<<` never
bites (JS doubles hold these values exactly).

Dry run on 10 / 3:
  round 1: chunk 3->6 (12 > 10 stop), multiple 1->2. remaining 10-6 = 4, quotient 2
  round 2: chunk 3 (6 > 4 stop),      multiple 1.    remaining 4-3 = 1, quotient 3
  1 < 3 -> stop. answer 3
```

### Edge cases

```
- overflow case -2^31 / -1 -> clamp to 2^31 - 1
- dividend = 0 -> 0
- |dividend| < |divisor| -> 0
- negative / negative -> positive
```

Full JavaScript solution with tests: [18_divide_two_integers.js](../solutions/18_divide_two_integers.js). Run it with `node 18_divide_two_integers.js` from the solutions folder.

</details>

## Common mistakes

- Not clamping `-2^31 / -1` to `2^31 - 1`.
- Converting negatives to positives with `Math.abs` and overflowing 32-bit shifts; work in negatives or use plain number doubling.
- Rounding toward negative infinity instead of truncating toward zero.

## Related follow-ups

- [Sum of Two Integers](11_sum_of_two_integers.md)
- [Pow](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/02_Medium/06_pow_x_n.md) (00_Foundations/04_Mathematics_For_DSA)
- [Sqrt](../../../10_Searching/03_Problems/01_Easy/05_sqrt_x.md) (10_Searching)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
