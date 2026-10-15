# Minimum Insertion Steps to Make a String Palindrome

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Hard |
| **Pattern** | interval DP, n - LPS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1312 — https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/ |
| **Solution file** | [07_minimum_insertions_to_make_palindrome.js](../solutions/07_minimum_insertions_to_make_palindrome.js) — open only after a real attempt |

## Problem

Given a string s, in one step you can insert any character at any position.
Return the minimum number of insertions needed to make s a palindrome.

## Examples

```
Input: "zzazz"   Output: 0   Explanation: already a palindrome
Input: "mbadm"   Output: 2   Explanation: "mbdadbm" or "mdbabdm"
Input: "leetcode" Output: 5
```

## Constraints & clarifying questions

```
- Empty string? (0)
- Only insertions, or deletions too? (insertions; note that deletions give the
  same answer, since deleting a char mirrors inserting its twin)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *interval DP, n - LPS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Look at the two ends of the interval.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Interval DP (memo / tabulation)   O(n^2) time, O(n^2) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" -> 0, single char -> 0
- all distinct "abc" -> n - 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Look at the two ends of the interval. If they match, nothing to insert, shrink
both. If not, either insert a copy of s[r] on the left (then solve [l, r-1]) or
a copy of s[l] on the right (then solve [l+1, r]). 1 + min of the two.
```

### APPROACH 2 — Interval DP (memo / tabulation)   O(n^2) time, O(n^2) space

### DP definition

```
STATE      dp[l][r] = min insertions to make s[l..r] a palindrome

RECURRENCE if s[l] === s[r]: dp[l][r] = dp[l+1][r-1]
else:              dp[l][r] = 1 + min(dp[l+1][r], dp[l][r-1])
BASE CASES dp[i][i] = 0, and l > r -> 0

ANSWER     dp[0][n-1]
Table for "mbadm" (rows = l, cols = r):
         r: 0  1  2  3  4
  l=0 m     0  1  2  3  2     dp[0][4]: 'm'=='m' -> dp[1][3] = 2
  l=1 b        0  1  2  2     dp[1][3]: 'b'!='m' -> 1 + min(dp[2][3]=1, dp[1][2]=1) = 2
  l=2 a           0  1  2
  l=3 d              0  1
  l=4 m                 0

SHORTCUT: answer = n - LPS(s). The characters already in the longest palindromic
subsequence stay; every other character needs one mirror inserted. The
`optimized` version uses this with the two-row LPS.
```

### Edge cases

```
- "" -> 0, single char -> 0
- all distinct "abc" -> n - 1
```

Full JavaScript solution with tests: [07_minimum_insertions_to_make_palindrome.js](../solutions/07_minimum_insertions_to_make_palindrome.js). Run it with `node 07_minimum_insertions_to_make_palindrome.js` from the solutions folder.

</details>

## Common mistakes

- Trying to simulate insertions; the clean answer is `n - LPS(s)` (characters not in the longest palindromic subsequence each need a partner).
- Using the longest palindromic SUBSTRING instead of subsequence.
- Returning the inserted string length when only the count is asked.

## Related follow-ups

- [Longest Palindromic Subsequence](../02_Medium/06_longest_palindromic_subsequence.md)
- [Palindrome Partitioning II](../../../05_Interval_DP/03_Problems/03_Hard/04_palindrome_partitioning_ii.md)
- Valid Palindrome III (LeetCode #1216)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
