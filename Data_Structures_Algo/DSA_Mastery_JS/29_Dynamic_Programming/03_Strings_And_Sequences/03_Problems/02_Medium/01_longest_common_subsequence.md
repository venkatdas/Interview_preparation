# Longest Common Subsequence

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | two-string table + reconstruct |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1143 — https://leetcode.com/problems/longest-common-subsequence/ |
| **Solution file** | [01_longest_common_subsequence.js](../solutions/01_longest_common_subsequence.js) — open only after a real attempt |

## Problem

Given two strings text1 and text2, return the length of their longest common
subsequence. A subsequence keeps the relative order of characters but may skip
some (so "ace" is a subsequence of "abcde"). Return 0 if there is none.

## Examples

```
Input: text1 = "abcde", text2 = "ace"   Output: 3   Explanation: "ace"
Input: text1 = "abc",   text2 = "abc"   Output: 3
Input: text1 = "abc",   text2 = "def"   Output: 0
```

## Constraints & clarifying questions

```
- Can a string be empty? (yes -> answer 0)
- Only lowercase letters? (assume any characters, we just compare equality)
- Do we need the actual subsequence or only its length? (length; we also show how
  to rebuild it in `reconstruct`)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-string table + reconstruct* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^(m+n)) time, O(m+n) space. Look at the first character of each string.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(m*n) time, O(min(m,n)) space. Each row only looks at the previous row, so keep two rows and swap them.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one or both strings empty -> 0
- identical strings -> full length
- no common characters -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^(m+n)) time, O(m+n) space

```
Look at the first character of each string. If they match, take it and move both
pointers. If not, try skipping a char from text1 OR from text2 and keep the better.
The same (i, j) pair is recomputed an exponential number of times.
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### APPROACH 3 — Space optimized   O(m*n) time, O(min(m,n)) space

```
Each row only looks at the previous row, so keep two rows and swap them.
```

### DP definition

```
STATE      dp[i][j] = LCS length of text1[0..i) and text2[0..j)  (first i and first j chars)

RECURRENCE if text1[i-1] === text2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
else:                          dp[i][j] = max(dp[i-1][j], dp[i][j-1])
BASE CASES dp[0][j] = dp[i][0] = 0   (an empty string shares nothing)

ANSWER     dp[m][n]
Table for "abcde" vs "ace"  (rows = prefix of text1, cols = prefix of text2):

           ""  a  c  e
       ""   0  0  0  0
       a    0  1  1  1
       b    0  1  1  1
       c    0  1  2  2
       d    0  1  2  2
       e    0  1  2  3   <- answer 3

Dry run of row 'c': 'c' vs 'a' -> no match, max(up=1, left=0)=1; 'c' vs 'c' -> match,
1 + diagonal(1) = 2; 'c' vs 'e' -> no match, max(up=1, left=2) = 2.
```

### Edge cases

```
- one or both strings empty -> 0
- identical strings -> full length
- no common characters -> 0
```

Full JavaScript solution with tests: [01_longest_common_subsequence.js](../solutions/01_longest_common_subsequence.js). Run it with `node 01_longest_common_subsequence.js` from the solutions folder.

</details>

## Common mistakes

- Sizing the table `m x n` instead of `(m+1) x (n+1)`; the extra row/column is the empty-prefix base case and removes all `i-1 < 0` checks.
- On a match, taking `max(dp[i-1][j], dp[i][j-1]) + 1` instead of `dp[i-1][j-1] + 1` (the diagonal), which can reuse a character twice.
- In the one-row version, overwriting `dp[j-1]` before reading the old diagonal value; save it in a `prev` variable first.

## Related follow-ups

- [Delete Operation for Two Strings](08_delete_operation_for_two_strings.md)
- [Uncrossed Lines](09_uncrossed_lines.md)
- [Shortest Common Supersequence](../03_Hard/13_shortest_common_supersequence.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
