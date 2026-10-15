# Reverse Bits

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Easy |
| **Pattern** | bit-by-bit with >>> |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #190 — https://leetcode.com/problems/reverse-bits/ |
| **Solution file** | [07_reverse_bits.js](../solutions/07_reverse_bits.js) — open only after a real attempt |

## Problem

Reverse the 32 bits of an unsigned integer. Bit 0 becomes bit 31, bit 1 becomes bit 30, ...

## Examples

```
Input: 43261596 (00000010100101000001111010011100)
Output: 964176192 (00111001011110000010100101000000)
Input: 1   Output: 2147483648 (bit 0 moved to bit 31)
```

## Constraints & clarifying questions

```
- Return value is unsigned? (yes -> in JS finish with >>> 0, otherwise bit 31 makes it negative)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bit-by-bit with >>>* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (string)   O(32) time, O(32) space. Convert to a 32-char binary string, reverse it, parse it back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bit-by-bit)   O(32) = O(1) time, O(1) space. Loop 32 times: shift result left by 1, append the lowest bit of n, shift n right (logical!).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 0 -> 0
- 0xFFFFFFFF (all ones) -> same value 4294967295
- input given as a negative JS int (e.g. -1): use >>> on n so it behaves as unsigned
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (string)   O(32) time, O(32) space

```
Convert to a 32-char binary string, reverse it, parse it back. Works, but interviewers
want the bit version.
```

### APPROACH 2 — Optimal (bit-by-bit)   O(32) = O(1) time, O(1) space

```
Loop 32 times: shift result left by 1, append the lowest bit of n, shift n right (logical!).
Finally `>>> 0` so the result is read as unsigned.

Dry run on n = 1 (showing only the first 2 and last steps):
  i=0: result = (0 << 1) | 1 = 1,   n = 0
  i=1: result = (1 << 1) | 0 = 2,   n = 0
  ... i=31: result = 1 << 31 = -2147483648 (signed)  -> >>> 0 -> 2147483648
```

### Edge cases

```
- 0 -> 0
- 0xFFFFFFFF (all ones) -> same value 4294967295
- input given as a negative JS int (e.g. -1): use >>> on n so it behaves as unsigned
```

Full JavaScript solution with tests: [07_reverse_bits.js](../solutions/07_reverse_bits.js). Run it with `node 07_reverse_bits.js` from the solutions folder.

</details>

## Common mistakes

- Returning a signed result; the answer must be viewed as unsigned with `>>> 0`.
- Looping until `n === 0` instead of exactly 32 times, which drops leading zeros that become trailing bits.
- Building the result with `<<` and forgetting the final unsigned conversion.

## Related follow-ups

- [Number of 1 Bits](02_number_of_1_bits.md)
- Reverse Integer (LeetCode #7)
- [Sum of Two Integers](../02_Medium/11_sum_of_two_integers.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
