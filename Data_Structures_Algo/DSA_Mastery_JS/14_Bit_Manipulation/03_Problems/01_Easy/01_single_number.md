# Single Number

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Easy |
| **Pattern** | XOR cancel pairs |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #136 — https://leetcode.com/problems/single-number/ |
| **Solution file** | [01_single_number.js](../solutions/01_single_number.js) — open only after a real attempt |

## Problem

Every element in nums appears exactly twice except one, which appears once.
Find it in O(n) time and O(1) extra space.

## Examples

```
Input: [2,2,1]        Output: 1
Input: [4,1,2,1,2]    Output: 4
Input: [1]            Output: 1
```

## Constraints & clarifying questions

```
- Exactly one element appears once? (yes)
- Negative numbers allowed? (yes, XOR does not care)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *XOR cancel pairs* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Count with a hash map, return the key with count 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (XOR)   O(n) time, O(1) space. XOR every number together.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element -> itself
- negative numbers: -3 ^ -3 = 0 still holds
- the single number is 0 -> result 0 (correct)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Count with a hash map, return the key with count 1. Simple but uses extra memory.
```

### APPROACH 2 — Optimal (XOR)   O(n) time, O(1) space

```
XOR every number together. a ^ a = 0 and a ^ 0 = a, and XOR is commutative, so every
pair cancels out and only the single number survives.

Dry run on [4,1,2,1,2]:
  0 ^ 4 = 4
  4 ^ 1 = 5      (100 ^ 001 = 101)
  5 ^ 2 = 7      (101 ^ 010 = 111)
  7 ^ 1 = 6      (111 ^ 001 = 110)
  6 ^ 2 = 4      (110 ^ 010 = 100)  -> 4
```

### Edge cases

```
- single element -> itself
- negative numbers: -3 ^ -3 = 0 still holds
- the single number is 0 -> result 0 (correct)
```

Full JavaScript solution with tests: [01_single_number.js](../solutions/01_single_number.js). Run it with `node 01_single_number.js` from the solutions folder.

</details>

## Common mistakes

- Sorting or using a hash map when O(1) space was asked.
- Starting the accumulator at something other than 0.
- Assuming it works when the others appear three times (that is Single Number II).

## Related follow-ups

- [Single Number II](../02_Medium/09_single_number_ii.md)
- [Single Number III](../02_Medium/10_single_number_iii.md)
- [Missing Number](04_missing_number.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
