# Integer Break

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | split the number |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #343 — https://leetcode.com/problems/integer-break/ |
| **Solution file** | [16_integer_break.js](../solutions/16_integer_break.js) — open only after a real attempt |

## Problem

Break a positive integer n into the sum of at least TWO positive integers
so that the product of those integers is maximised. Return the product.

## Examples

```
Input: n = 2    Output: 1    Explanation: 1 + 1
Input: n = 10   Output: 36   Explanation: 3 + 3 + 4 -> 3 * 3 * 4
```

## Constraints & clarifying questions

```
- 2 <= n <= 58
- At least two parts, so n itself is not allowed as the "break" of n.

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *split the number* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   exponential time. Try every first part, recurse on the rest.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Math   O(n) time, O(1) space. Use as many 3s as possible (3 is the best factor), fix up with a 2 or a 4.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 2 -> 1, n = 3 -> 2 (forced to break even though it lowers the product)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   exponential time

```
Try every first part, recurse on the rest.
```

### APPROACH 2 — Memoization   O(n^2) time, O(n) space


### APPROACH 3 — Tabulation   O(n^2) time, O(n) space

```
Dry run:
  i   : 1  2  3  4  5  6  7   8   9   10
  dp  : 1  1  2  4  6  9  12  18  27  36
  dp[4] = max(1*max(3,2), 2*max(2,1), 3*max(1,1)) = max(3, 4, 3) = 4
  dp[10]= max over j; j=3 -> 3*max(7, dp[7]=12) = 36
```

### APPROACH 4 — Math   O(n) time, O(1) space

```
Use as many 3s as possible (3 is the best factor), fix up with a 2 or a 4.
```

### DP definition

```
STATE:       dp[i] = max product from breaking i into ONE OR MORE parts
(allowing "no break" makes the recurrence clean; we only forbid it at the top)
RECURRENCE:  dp[i] = max over first part j in [1, i-1] of  j * max(i - j, dp[i - j])
(the remainder is either kept whole or broken further)
BASE CASES:  dp[1] = 1
ANSWER:      dp[n] computed WITHOUT the "keep whole" option at the top level
```

### Edge cases

```
- n = 2 -> 1, n = 3 -> 2 (forced to break even though it lowers the product)
```

Full JavaScript solution with tests: [16_integer_break.js](../solutions/16_integer_break.js). Run it with `node 16_integer_break.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting you must split at least once: `integerBreak(2) = 1` and `integerBreak(3) = 2`, not 2 and 3.
- Only using `dp[j]` for the left part; also consider keeping `j` whole: `max(j, dp[j]) * (i - j)`.
- Using the "split into 3s" math trick without being able to justify it; state the DP first.

## Related follow-ups

- [Perfect Squares](14_perfect_squares.md)
- [Rod Cutting](../../../02_Knapsack/03_Problems/02_Medium/10_rod_cutting.md)
- [Word Break](17_word_break.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
