# Longest Common Substring

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | two-string table, reset on mismatch |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [02_longest_common_substring.js](../solutions/02_longest_common_substring.js) — open only after a real attempt |

## Problem

Given two strings, return the length of the longest string that appears as a
CONTIGUOUS block in both. (Contrast with subsequence, which may skip characters.)

## Examples

```
Input: "abcdxyz", "xyzabcd"   Output: 4   Explanation: "abcd"
Input: "abcde",   "ace"       Output: 1   Explanation: "a", "c" or "e" (not "ace")
Input: "abc",     "def"       Output: 0
```

## Constraints & clarifying questions

```
- Empty strings allowed? (yes -> 0)
- Case sensitive? (assume yes)
- Length only, or the substring itself? (length; the end index of the max cell
  lets you slice it out if needed)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-string table, reset on mismatch* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(m*n*min(m,n)) time, O(1) space. For every pair of start positions (i, j) extend while characters match and record the longest run.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(m*n) time, O(n) space. Only the diagonal from the previous row is needed, so keep two rows.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty input -> 0
- identical strings -> full length
- repeated characters like "aaa" vs "aa" -> 2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m*n*min(m,n)) time, O(1) space

```
For every pair of start positions (i, j) extend while characters match and
record the longest run. (Written recursively below so it is a true "plain
recursion": common(i, j) = 1 + common(i+1, j+1) if chars match, else 0, and we
take the max over all starting pairs.)
```

### APPROACH 2 — DP (memo / tabulation)   O(m*n) time, O(m*n) space

### APPROACH 3 — Space optimized   O(m*n) time, O(n) space

```
Only the diagonal from the previous row is needed, so keep two rows.
```

### DP definition

```
STATE      dp[i][j] = length of the longest common SUFFIX of s1[0..i) and s2[0..j)
i.e. the match must END at s1[i-1] and s2[j-1]
RECURRENCE if s1[i-1] === s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
else:                    dp[i][j] = 0        <- the big difference from LCS
BASE CASES dp[0][j] = dp[i][0] = 0

ANSWER     max over ALL cells (not the bottom-right one, because the best block can
end anywhere)

Table for "abcde" vs "ace":

           ""  a  c  e
       ""   0  0  0  0
       a    0  1  0  0
       b    0  0  0  0
       c    0  0  1  0
       d    0  0  0  0
       e    0  0  0  1      max = 1

Table for "abcd" vs "xabcd" (the diagonal run shows the block "abcd"):
           ""  x  a  b  c  d
       a    0  0  1  0  0  0
       b    0  0  0  2  0  0
       c    0  0  0  0  3  0
       d    0  0  0  0  0  4   max = 4
```

### Edge cases

```
- empty input -> 0
- identical strings -> full length
- repeated characters like "aaa" vs "aa" -> 2
```

Full JavaScript solution with tests: [02_longest_common_substring.js](../solutions/02_longest_common_substring.js). Run it with `node 02_longest_common_substring.js` from the solutions folder.

</details>

## Common mistakes

- Copying the LCS recurrence: on a mismatch a substring run must reset to 0, not take `max(top, left)`.
- Returning `dp[m][n]` instead of the maximum value seen anywhere in the table.
- Using `dp[i-1][j-1]` on a mismatch "to keep the run going" — runs must be contiguous.

## Related follow-ups

- Maximum Length of Repeated Subarray (LeetCode #718) — the same DP on integer arrays
- [Longest Common Subsequence](01_longest_common_subsequence.md)
- [Longest Duplicate Substring (hashing)](../../../../33_String_Algorithms_Advanced/03_Problems/03_Hard/07_longest_duplicate_substring.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
