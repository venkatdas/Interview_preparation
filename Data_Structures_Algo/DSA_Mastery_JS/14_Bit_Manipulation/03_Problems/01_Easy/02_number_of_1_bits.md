# Number of 1 Bits

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Easy |
| **Pattern** | Kernighan |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #191 — https://leetcode.com/problems/number-of-1-bits/ |
| **Solution file** | [02_number_of_1_bits.js](../solutions/02_number_of_1_bits.js) — open only after a real attempt |

## Problem

Given a 32-bit unsigned integer, return the number of 1 bits (its "Hamming weight").

## Examples

```
Input: 11          Output: 3   Explanation: 1011
Input: 128         Output: 1   Explanation: 10000000
Input: 4294967293  Output: 31  Explanation: all ones except bit 1 (in JS this is -3 | 0)
```

## Constraints & clarifying questions

```
- Is the input treated as unsigned? (yes; in JS negative inputs must be viewed with >>> 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kernighan* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(32) time, O(1) space. Check all 32 bit positions with (n >>> i) & 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Brian Kernighan)   O(k) time, O(1) space, k = number of 1 bits. n & (n - 1) clears the lowest set bit.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 0 -> 0
- 2^31 (sign bit) -> 1; convert with >>> 0 so the loop terminates
- -1 (all bits set) -> 32
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(32) time, O(1) space

```
Check all 32 bit positions with (n >>> i) & 1. Always 32 iterations.
```

### APPROACH 2 — Optimal (Brian Kernighan)   O(k) time, O(1) space, k = number of 1 bits

```
n & (n - 1) clears the lowest set bit. Repeat until n is 0, counting iterations.
Loops only as many times as there are 1 bits.

Dry run on 11 (1011):
  1011 & 1010 = 1010   count 1
  1010 & 1001 = 1000   count 2
  1000 & 0111 = 0000   count 3 -> 3
```

### Edge cases

```
- 0 -> 0
- 2^31 (sign bit) -> 1; convert with >>> 0 so the loop terminates
- -1 (all bits set) -> 32
```

Full JavaScript solution with tests: [02_number_of_1_bits.js](../solutions/02_number_of_1_bits.js). Run it with `node 02_number_of_1_bits.js` from the solutions folder.

</details>

## Common mistakes

- Using `>>` in a `while (n !== 0)` loop on negative input: the sign bit refills and it never ends.
- Writing `n & 1 === 1` without parentheses.
- Forgetting the input may be given as an unsigned 32-bit value larger than 2^31.

## Related follow-ups

- [Counting Bits](06_counting_bits.md)
- [Hamming Distance](05_hamming_distance.md)
- [Reverse Bits](07_reverse_bits.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
