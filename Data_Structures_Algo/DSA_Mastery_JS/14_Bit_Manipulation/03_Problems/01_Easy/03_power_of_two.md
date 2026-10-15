# Power of Two

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Easy |
| **Pattern** | n & (n-1) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #231 — https://leetcode.com/problems/power-of-two/ |
| **Solution file** | [03_power_of_two.js](../solutions/03_power_of_two.js) — open only after a real attempt |

## Problem

Return true if the integer n is a power of two (1, 2, 4, 8, ...).

## Examples

```
Input: 1    Output: true    Explanation: 2^0
Input: 16   Output: true    Explanation: 2^4
Input: 3    Output: false
Input: 0    Output: false
Input: -8   Output: false
```

## Constraints & clarifying questions

```
- Is 1 a power of two? (yes, 2^0)
- Negative numbers? (never a power of two)
- No loops / recursion allowed? (bit trick handles that)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *n & (n-1)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(log n) time, O(1) space. While n is even, divide by 2.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (n & (n - 1))   O(1) time, O(1) space. A power of two has exactly ONE bit set: 1000.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 0: 0 & -1 = 0 would wrongly say true -> guard with n > 0
- negative numbers -> false
- 2^30 (fits in 32 bits) -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(log n) time, O(1) space

```
While n is even, divide by 2. It was a power of two iff you end at 1.
```

### APPROACH 2 — Optimal (n & (n - 1))   O(1) time, O(1) space

```
A power of two has exactly ONE bit set: 1000. Subtracting 1 gives 0111.
AND-ing them gives 0. For any other positive number there is a higher bit that survives.

Dry run:
  16 = 10000, 15 = 01111, 16 & 15 = 00000 -> true
  12 = 01100, 11 = 01011, 12 & 11 = 01000 -> false
```

### Edge cases

```
- 0: 0 & -1 = 0 would wrongly say true -> guard with n > 0
- negative numbers -> false
- 2^30 (fits in 32 bits) -> true
```

Full JavaScript solution with tests: [03_power_of_two.js](../solutions/03_power_of_two.js). Run it with `node 03_power_of_two.js` from the solutions folder.

</details>

## Common mistakes

- Returning true for 0 because `0 & -1 === 0`.
- Returning true for negative numbers like `-2147483648`.
- Using floating-point `Math.log2` and comparing with `Number.isInteger` (rounding risk for large values).

## Related follow-ups

- Power of Four (LeetCode #342)
- [Number of 1 Bits](02_number_of_1_bits.md)
- Power of Three (LeetCode #326)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
