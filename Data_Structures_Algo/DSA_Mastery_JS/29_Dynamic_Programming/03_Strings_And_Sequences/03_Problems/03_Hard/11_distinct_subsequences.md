# Distinct Subsequences

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Hard |
| **Pattern** | counting table, one-row right-to-left |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #115 — https://leetcode.com/problems/distinct-subsequences/ |
| **Solution file** | [11_distinct_subsequences.js](../solutions/11_distinct_subsequences.js) — open only after a real attempt |

## Problem

Given strings s and t, return the number of distinct subsequences of s that
equal t. (Count the different ways to pick positions in s that spell t.)

## Examples

```
Input: s = "rabbbit", t = "rabbit"   Output: 3
  Explanation: drop the 1st, 2nd or 3rd 'b' of "bbb" -> three different index sets
Input: s = "babgbag", t = "bag"      Output: 5
Input: s = "abc", t = ""             Output: 1   Explanation: pick nothing
```

## Constraints & clarifying questions

```
- Count ways by index positions, not by resulting string? (yes - that is why
  "rabbbit" gives 3, the three results look the same)
- t empty? (1 way) s empty and t non-empty? (0 ways)
- Answer size? (fits in 32-bit int on LeetCode)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting table, one-row right-to-left* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^m) time, O(m) space. At each char of s: skip it, or (if it matches t[j]) use it to match t[j].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(m*n) time, O(n) space. One row, iterate j from RIGHT to LEFT so dp[j-1] is still the previous row's value when we read it (same trick as 0/1 knapsack).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- t longer than s -> 0
- t === "" -> 1
- s === "" and t non-empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^m) time, O(m) space

```
At each char of s: skip it, or (if it matches t[j]) use it to match t[j].
Count paths that consume all of t.
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### APPROACH 3 — Space optimized   O(m*n) time, O(n) space

```
One row, iterate j from RIGHT to LEFT so dp[j-1] is still the previous row's value
when we read it (same trick as 0/1 knapsack).
```

### DP definition

```
STATE      dp[i][j] = number of ways s[0..i) can produce t[0..j)

RECURRENCE dp[i][j] = dp[i-1][j]                               (skip s[i-1])
+ (s[i-1] === t[j-1] ? dp[i-1][j-1] : 0)   (use s[i-1] for t[j-1])
BASE CASES dp[i][0] = 1 (empty t: one way, choose nothing); dp[0][j>0] = 0

ANSWER     dp[m][n]
Table for s = "babgbag", t = "bag" (rows = prefix of s, cols = prefix of t):
           ""  b  a  g
       ""   1  0  0  0
       b    1  1  0  0
       a    1  1  1  0
       b    1  2  1  0     dp[3][1]: skip (1) + match b (dp[2][0]=1) = 2
       g    1  2  1  1
       b    1  3  1  1
       a    1  3  4  1     dp[6][2]: skip (1) + match a (dp[5][1]=3) = 4
       g    1  3  4  5     answer 5
```

### Edge cases

```
- t longer than s -> 0
- t === "" -> 1
- s === "" and t non-empty -> 0
```

Full JavaScript solution with tests: [11_distinct_subsequences.js](../solutions/11_distinct_subsequences.js). Run it with `node 11_distinct_subsequences.js` from the solutions folder.

</details>

## Common mistakes

- Base cases flipped: an empty `t` is matched exactly once by any prefix of `s` (`dp[i][0] = 1`), while a non-empty `t` cannot come from an empty `s`.
- On a match, using only the diagonal; you must ADD both choices (use this character, or skip it).
- In the 1D version, iterating `j` forward so the same `s` character is used twice; go right to left.

## Related follow-ups

- [Longest Common Subsequence](../02_Medium/01_longest_common_subsequence.md)
- [Interleaving String](../02_Medium/12_interleaving_string.md)
- Number of Matching Subsequences (LeetCode #792)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
