# Longest Palindromic Subsequence

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | interval DP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #516 — https://leetcode.com/problems/longest-palindromic-subsequence/ |
| **Solution file** | [06_longest_palindromic_subsequence.js](../solutions/06_longest_palindromic_subsequence.js) — open only after a real attempt |

## Problem

Given a string s, return the length of the longest subsequence (may skip chars,
order kept) that is a palindrome.

## Examples

```
Input: "bbbab"   Output: 4   Explanation: "bbbb"
Input: "cbbd"    Output: 2   Explanation: "bb"
Input: "abcd"    Output: 1
```

## Constraints & clarifying questions

```
- Empty string? (0)
- Subsequence, not substring? (yes - we can skip characters)
- Length only? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *interval DP* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Recursion on the interval [l, r]: if the ends match, keep both and shrink inside; otherwise drop the left end OR the right end and take the better.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Space optimized   O(n^2) time, O(n) space. Row l only needs row l+1, so keep two rows.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" -> 0
- single char -> 1
- whole string is a palindrome -> n
- all distinct -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Recursion on the interval [l, r]: if the ends match, keep both and shrink inside;
otherwise drop the left end OR the right end and take the better. Exponential
because (l, r) pairs repeat.
```

### APPROACH 2 — Interval DP (memo / tabulation)   O(n^2) time, O(n^2) space

### APPROACH 3 — Space optimized   O(n^2) time, O(n) space

```
Row l only needs row l+1, so keep two rows.
```

### DP definition

```
STATE      dp[l][r] = longest palindromic subsequence length inside s[l..r]

RECURRENCE if s[l] === s[r]: dp[l][r] = 2 + dp[l+1][r-1]   (l &lt; r)
else:              dp[l][r] = max(dp[l+1][r], dp[l][r-1])
BASE CASES dp[i][i] = 1; empty interval (l > r) = 0
```

### ORDER      l from n-1 down to 0, r from l+1 up to n-1 (so l+1 row is done)

### ANSWER     dp[0][n-1]

```
Table for "bbbab" (rows = l, cols = r):
         r: 0  1  2  3  4
  l=0 b     1  2  3  3  4     dp[0][4]: 'b'=='b' -> 2 + dp[1][3] = 2 + 2 = 4
  l=1 b        1  2  2  3
  l=2 b           1  1  3     dp[2][4]: 'b'=='b' -> 2 + dp[3][3] = 3
  l=3 a              1  1
  l=4 b                 1

TRICK: LPS(s) === LCS(s, reverse(s)). Same answer, and a good thing to mention.
```

### Edge cases

```
- "" -> 0
- single char -> 1
- whole string is a palindrome -> n
- all distinct -> 1
```

Full JavaScript solution with tests: [06_longest_palindromic_subsequence.js](../solutions/06_longest_palindromic_subsequence.js). Run it with `node 06_longest_palindromic_subsequence.js` from the solutions folder.

</details>

## Common mistakes

- Confusing it with the substring version: here characters may be skipped, so a mismatch takes `max(dp[l+1][r], dp[l][r-1])` instead of resetting.
- Forgetting the base case `dp[i][i] = 1`.
- Iterating `l` upward so `dp[l+1][...]` is still empty.

## Related follow-ups

- [Minimum Insertion Steps to Make a String Palindrome](../03_Hard/07_minimum_insertions_to_make_palindrome.md)
- [Longest Palindromic Substring](05_longest_palindromic_substring.md)
- [Longest Common Subsequence](01_longest_common_subsequence.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
