# Bitwise AND of Numbers Range

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | common prefix |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #201 — https://leetcode.com/problems/bitwise-and-of-numbers-range/ |
| **Solution file** | [13_bitwise_and_of_numbers_range.js](../solutions/13_bitwise_and_of_numbers_range.js) — open only after a real attempt |

## Problem

Given two integers left <= right, return the bitwise AND of all numbers in [left, right].

## Examples

```
Input: left = 5, right = 7   Output: 4   Explanation: 101 & 110 & 111 = 100
Input: left = 0, right = 0   Output: 0
Input: left = 1, right = 2147483647   Output: 0
```

## Constraints & clarifying questions

```
- Range can be huge (2^31 numbers)? (yes -> cannot iterate)
- Non-negative inputs? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *common prefix* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(right - left) time. AND every number in the range.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (common binary prefix)   O(32) time, O(1) space. Key fact: if left &lt; right, the lowest bit will be 0 in at least one number (consecutive numbers alternate it), so bit 0 of the answer is 0.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- left === right -> that number
- range crosses a power of two (e.g. 7..8) -> 0 (no common prefix)
- left = 0 -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(right - left) time

```
AND every number in the range. Fine for tiny ranges, impossible for 2^31.
```

### APPROACH 2 — Optimal (common binary prefix)   O(32) time, O(1) space

```
Key fact: if left < right, the lowest bit will be 0 in at least one number (consecutive
numbers alternate it), so bit 0 of the answer is 0. The same holds for every bit below the
highest position where left and right differ. Above that, all numbers share the same bits.
So the answer is the COMMON PREFIX of left and right, with zeros below.
Implementation: shift both right until equal (counting shifts), then shift back left.

Dry run on 5 (101), 7 (111):
  101 != 111 -> shift: 10, 11, shifts=1
  10  != 11  -> shift: 1, 1,   shifts=2
  equal -> 1 << 2 = 100 = 4

Alternative: while (right > left) right &= right - 1; return right. (Clearing the lowest
bit of right until it drops to or below left strips exactly the non-shared suffix.)
```

### Edge cases

```
- left === right -> that number
- range crosses a power of two (e.g. 7..8) -> 0 (no common prefix)
- left = 0 -> 0
```

Full JavaScript solution with tests: [13_bitwise_and_of_numbers_range.js](../solutions/13_bitwise_and_of_numbers_range.js). Run it with `node 13_bitwise_and_of_numbers_range.js` from the solutions folder.

</details>

## Common mistakes

- Looping from left to right ANDing every number: O(range) times out for 0..2^31-1.
- Forgetting that the answer is the common binary prefix of left and right.
- Shifting back the wrong number of times after finding the prefix.

## Related follow-ups

- [Number of 1 Bits](../01_Easy/02_number_of_1_bits.md)
- [Power of Two](../01_Easy/03_power_of_two.md)
- [Minimum Flips to Make a OR b Equal to c](08_minimum_flips_a_or_b_equal_c.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
