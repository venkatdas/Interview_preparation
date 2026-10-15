# Missing Number

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | sum formula / XOR |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #268 — https://leetcode.com/problems/missing-number/ |
| **Solution file** | [11_missing_number.js](../solutions/11_missing_number.js) — open only after a real attempt |

## Problem

Given an array of n DISTINCT numbers taken from the range [0, n], exactly one
number of the range is missing. Return it.

## Examples

```
Input: [3, 0, 1]                      Output: 2   Explanation: n = 3, range 0..3, 2 is missing
Input: [0, 1]                         Output: 2   Explanation: n = 2, range 0..2
Input: [9, 6, 4, 2, 3, 5, 7, 0, 1]    Output: 8
```

## Constraints & clarifying questions

```
- Are values distinct and all within 0..n? (yes)
- Exactly one missing? (yes)
- O(n) time and O(1) space required? (that is the follow-up)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sum formula / XOR* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every number 0..n, scan the array to see whether it is present.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sum formula, or XOR)   O(n) time, O(1) space. The sum of 0..n is n * (n + 1) / 2.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Missing number is 0: [1] -> 0
- Missing number is n: [0, 1] -> 2
- Single element
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every number 0..n, scan the array to see whether it is present.
(Middle ground: put the array in a Set and check 0..n -> O(n) time, O(n) space.)
```

### APPROACH 2 — Optimal (sum formula, or XOR)   O(n) time, O(1) space

```
The sum of 0..n is n * (n + 1) / 2. Subtract the actual sum of the array; what is
left is the missing number. Alternative without overflow worries: XOR every index
0..n and every value; pairs cancel (x ^ x = 0) and the lone survivor is the answer.

Dry run on [3, 0, 1]:
  n = 3, expected sum = 3 * 4 / 2 = 6
  actual sum = 3 + 0 + 1 = 4
  6 - 4 = 2
XOR version: 0^1^2^3 = 0, then ^3^0^1 -> leaves 2
```

### Edge cases

```
- Missing number is 0: [1] -> 0
- Missing number is n: [0, 1] -> 2
- Single element
```

Full JavaScript solution with tests: [11_missing_number.js](../solutions/11_missing_number.js). Run it with `node 11_missing_number.js` from the solutions folder.

</details>

## Common mistakes

- Using the sum formula with n = max(nums) instead of n = nums.length, which fails when the missing number is n itself.
- Sorting first (O(n log n)) when O(n) is easy.
- Forgetting that the range starts at 0, not 1.

## Related follow-ups

- [Missing Number (Bit Manipulation)](../../../14_Bit_Manipulation/03_Problems/01_Easy/04_missing_number.md) — the XOR version
- [Find All Numbers Disappeared in an Array](12_find_all_numbers_disappeared.md) — many missing numbers, index-as-hash
- [First Missing Positive](../03_Hard/16_first_missing_positive.md) — unbounded values, cyclic sort

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
