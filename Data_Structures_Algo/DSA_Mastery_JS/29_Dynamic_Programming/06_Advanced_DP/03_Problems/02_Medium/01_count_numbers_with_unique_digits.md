# Count Numbers with Unique Digits

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Medium |
| **Pattern** | digit DP (lite) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #357 — https://leetcode.com/problems/count-numbers-with-unique-digits/ |
| **Solution file** | [01_count_numbers_with_unique_digits.js](../solutions/01_count_numbers_with_unique_digits.js) — open only after a real attempt |

## Problem

Given n, count all numbers x with 0 <= x < 10^n whose digits are all different.
(So for n = 2 we look at 0..99 and throw away 11, 22, 33, ... 99.)

## Examples

```
Input: n = 0   Output: 1     Explanation: only the number 0
Input: n = 1   Output: 10    Explanation: 0..9
Input: n = 2   Output: 91    Explanation: 100 numbers minus the 9 repeats 11,22,...,99
Input: n = 3   Output: 739
```

## Constraints & clarifying questions

```
- 0 <= n <= 8 (after 10 digits there is nothing new: you cannot have 11 distinct digits)
- Is 0 counted? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *digit DP (lite)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion over digits)   O(10^n * n) time, O(n) space. Build every number digit by digit, keep a "used digits" set, count the ones that are valid.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP by length (digit DP lite)   O(n) time, O(n) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 1
- n >= 10 -> same answer as n = 10 (no more unique-digit numbers exist)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion over digits)   O(10^n * n) time, O(n) space

```
Build every number digit by digit, keep a "used digits" set, count the ones that are
valid. This is the "digit DP lite" idea without memo: at each position choose a digit
not used yet. We only run it for tiny n in tests.
```

### APPROACH 2 — DP by length (digit DP lite)   O(n) time, O(n) space

### DP definition

```
STATE      dp[k] = how many numbers with EXACTLY k digits (no leading zero) have all
digits unique.
RECURRENCE dp[k] = 9 * 9 * 8 * 7 * ... (k terms): first digit 1..9 (9 choices), second
digit any of the remaining 9 (0 is now allowed), third 8 choices, and so on.
           dp[k] = dp[k - 1] * (10 - (k - 1))  for k >= 2.
BASE CASES dp[0] = 1 (just the number 0), dp[1] = 9 (1..9).
ANSWER     sum of dp[0..n]  (numbers with 0, 1, 2 ... n digits).
Dry run n = 3:
  k | dp[k]           | running sum
  0 | 1               | 1
  1 | 9               | 10
  2 | 9 * 9 = 81      | 91
  3 | 81 * 8 = 648    | 739   <- answer

Why is this "digit DP"? The real digit DP pattern counts numbers <= some limit by
walking the digits with a "tight" flag. Here the limit is 10^n - 1 = 999...9, so the
bound is never tight and the state collapses to just "how many digits are left".
```

### Edge cases

```
- n = 0 -> 1
- n >= 10 -> same answer as n = 10 (no more unique-digit numbers exist)
```

Full JavaScript solution with tests: [01_count_numbers_with_unique_digits.js](../solutions/01_count_numbers_with_unique_digits.js). Run it with `node 01_count_numbers_with_unique_digits.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that a number cannot start with 0, so the first digit has 9 choices, not 10.
- Forgetting to add the count for 0 itself (n = 0 → answer 1).
- Going past 10 digits; for n > 10 the count stops growing because there are only 10 distinct digits.

## Related follow-ups

- Numbers At Most N Given Digit Set (LeetCode #902)
- Count Special Integers (LeetCode #2376)
- [Count Vowels Permutation](../03_Hard/02_count_vowels_permutation.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
