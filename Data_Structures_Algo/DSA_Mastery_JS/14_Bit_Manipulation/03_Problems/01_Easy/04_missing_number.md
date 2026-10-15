# Missing Number

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Easy |
| **Pattern** | XOR indices and values |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #268 — https://leetcode.com/problems/missing-number/ |
| **Solution file** | [04_missing_number.js](../solutions/04_missing_number.js) — open only after a real attempt |

## Problem

nums contains n distinct numbers from the range [0, n]. Exactly one number of the range
is missing. Return it.

## Examples

```
Input: [3,0,1]              Output: 2
Input: [0,1]                Output: 2
Input: [9,6,4,2,3,5,7,0,1]  Output: 8
```

## Constraints & clarifying questions

```
- Numbers are distinct and within [0, n]? (yes)
- Can we modify / sort the input? (not needed)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *XOR indices and values* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Put the numbers in a Set; scan 0..n and return the first one not in the set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (XOR)   O(n) time, O(1) space. XOR all indices 0..n together with all values.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [0] -> 1
- missing is 0 -> [1] -> 0
- missing is n (the largest) -> [0,1] -> 2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Put the numbers in a Set; scan 0..n and return the first one not in the set.
(Also common: Gauss sum n(n+1)/2 - sum(nums), O(1) space but can overflow in other languages.)
```

### APPROACH 2 — Optimal (XOR)   O(n) time, O(1) space

```
XOR all indices 0..n together with all values. Every number that IS present appears twice
(once as an index, once as a value) and cancels. The missing number appears only once
(as an index) and survives.

Dry run on [3,0,1] (n = 3):
  result = 0 ^ 1 ^ 2 ^ 3        (indices 0..n)
         ^ 3 ^ 0 ^ 1            (values)
  pairs cancel: (0^0)(1^1)(3^3) -> leaves 2
```

### Edge cases

```
- [0] -> 1
- missing is 0 -> [1] -> 0
- missing is n (the largest) -> [0,1] -> 2
```

Full JavaScript solution with tests: [04_missing_number.js](../solutions/04_missing_number.js). Run it with `node 04_missing_number.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to include `n` itself in the XOR (indices go 0..n-1 but values go 0..n).
- Using the sum formula without considering overflow in languages with fixed-width ints (fine in JS for these sizes, but mention it).
- Sorting first, which costs O(n log n) for no reason.

## Related follow-ups

- [Single Number](01_single_number.md)
- [Find the Duplicate Number](../02_Medium/16_find_the_duplicate_number.md)
- [First Missing Positive](../../../03_Arrays/03_Problems/03_Hard/16_first_missing_positive.md) (03_Arrays)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
