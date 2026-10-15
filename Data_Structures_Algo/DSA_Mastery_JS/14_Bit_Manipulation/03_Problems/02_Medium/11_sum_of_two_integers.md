# Sum of Two Integers

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | XOR + carry |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #371 — https://leetcode.com/problems/sum-of-two-integers/ |
| **Solution file** | [11_sum_of_two_integers.js](../solutions/11_sum_of_two_integers.js) — open only after a real attempt |

## Problem

Return a + b without using the + or - operators. Inputs fit in 32-bit signed ints.

## Examples

```
Input: a = 1, b = 2     Output: 3
Input: a = 2, b = 3     Output: 5
Input: a = -1, b = 1    Output: 0
```

## Constraints & clarifying questions

```
- 32-bit overflow behaviour? (wrap like a 32-bit int, which JS bitwise ops do for free)
- Negative inputs? (yes, two's complement handles them)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *XOR + carry* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(|b|) time. Increment a |b| times using ++ / -- (technically not + or -).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (XOR for sum, AND for carry)   O(32) time, O(1) space. Adding two bits: 0+0=0, 0+1=1, 1+0=1, 1+1=0 carry 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- a = -1, b = 1 -> 0 (carry propagates off the top and disappears)
- b = 0 -> a
- both negative -> correct two's complement result
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(|b|) time

```
Increment a |b| times using ++ / -- (technically not + or -). Only for tiny b; shown
for contrast.
```

### APPROACH 2 — Optimal (XOR for sum, AND for carry)   O(32) time, O(1) space

```
Adding two bits: 0+0=0, 0+1=1, 1+0=1, 1+1=0 carry 1.
  sum without carries = a ^ b
  carries             = (a & b) << 1   (a carry moves one position left)
Then add the carries to the partial sum the same way. Each round the carry loses at
least its lowest bit, so after at most 32 rounds the carry is 0.

Dry run on a = 5 (101), b = 3 (011):
  sum = 101 ^ 011 = 110,  carry = (101 & 011) << 1 = 001 << 1 = 010
  sum = 110 ^ 010 = 100,  carry = (110 & 010) << 1 = 010 << 1 = 100
  sum = 100 ^ 100 = 000,  carry = (100 & 100) << 1 = 1000
  sum = 000 ^ 1000 = 1000, carry = 0  -> 8
```

### Edge cases

```
- a = -1, b = 1 -> 0 (carry propagates off the top and disappears)
- b = 0 -> a
- both negative -> correct two's complement result
```

Full JavaScript solution with tests: [11_sum_of_two_integers.js](../solutions/11_sum_of_two_integers.js). Run it with `node 11_sum_of_two_integers.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the carry must be shifted left by one.
- Infinite loop in languages without 32-bit wraparound; in JS the `| 0` semantics bound it at 32 iterations.
- Using `+` or `-` hidden inside a helper.

## Related follow-ups

- [Divide Two Integers](18_divide_two_integers.md)
- Add Binary (LeetCode #67)
- [Add Two Numbers](../../../15_Linked_Lists/03_Problems/02_Medium/11_add_two_numbers.md) (15_Linked_Lists)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
