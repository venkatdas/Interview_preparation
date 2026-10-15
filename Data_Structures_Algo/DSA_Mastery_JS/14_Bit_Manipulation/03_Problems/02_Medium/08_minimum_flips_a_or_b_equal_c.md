# Minimum Flips to Make a OR b Equal to c

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | per-bit case analysis |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1318 — https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/ |
| **Solution file** | [08_minimum_flips_a_or_b_equal_c.js](../solutions/08_minimum_flips_a_or_b_equal_c.js) — open only after a real attempt |

## Problem

Given positive integers a, b, c, return the minimum number of single-bit flips in a and/or b
so that (a | b) === c.

## Examples

```
Input: a = 2, b = 6, c = 5   Output: 3
  Explanation: a=010 b=110 c=101. bit0: need 1, both 0 -> 1 flip. bit1: need 0, both 1 -> 2 flips. bit2: ok.
Input: a = 4, b = 2, c = 7   Output: 1
Input: a = 1, b = 2, c = 3   Output: 0
```

## Constraints & clarifying questions

```
- All positive and fit in 32 bits? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *per-bit case analysis* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(32) time, O(1) space, via strings. Convert all three to 32-char binary strings and compare column by column with the same case analysis.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (per-bit case analysis)   O(32) = O(1) time, O(1) space. Look at bit i of a, b, c independently (bits do not interact under OR): c bit = 1 : need at least one of a,b to be 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- already equal -> 0
- c = 0 -> popcount(a) + popcount(b)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(32) time, O(1) space, via strings

```
Convert all three to 32-char binary strings and compare column by column with the
same case analysis. Same logic, just clunkier.
```

### APPROACH 2 — Optimal (per-bit case analysis)   O(32) = O(1) time, O(1) space

```
Look at bit i of a, b, c independently (bits do not interact under OR):
  c bit = 1 : need at least one of a,b to be 1. If both 0 -> 1 flip, else 0.
  c bit = 0 : need BOTH a,b to be 0. Flips = (a bit) + (b bit).

Dry run on a=2 (010), b=6 (110), c=5 (101):
  bit0: c=1, a=0, b=0 -> +1
  bit1: c=0, a=1, b=1 -> +2
  bit2: c=1, a=0, b=1 -> +0   -> 3
```

### Edge cases

```
- already equal -> 0
- c = 0 -> popcount(a) + popcount(b)
```

Full JavaScript solution with tests: [08_minimum_flips_a_or_b_equal_c.js](../solutions/08_minimum_flips_a_or_b_equal_c.js). Run it with `node 08_minimum_flips_a_or_b_equal_c.js` from the solutions folder.

</details>

## Common mistakes

- Counting only one flip when c's bit is 0 but both a and b have a 1 there (it needs two).
- Stopping when all three numbers are 0 too early or looping with a wrong bound.
- Mixing up OR and XOR when reasoning about the target bit.

## Related follow-ups

- [Hamming Distance](../01_Easy/05_hamming_distance.md)
- [Number of 1 Bits](../01_Easy/02_number_of_1_bits.md)
- [Bitwise AND of Numbers Range](13_bitwise_and_of_numbers_range.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
