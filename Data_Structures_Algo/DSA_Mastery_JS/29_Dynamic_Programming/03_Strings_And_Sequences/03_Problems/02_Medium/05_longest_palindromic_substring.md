# Longest Palindromic Substring

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | interval DP, expand around center |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #5 — https://leetcode.com/problems/longest-palindromic-substring/ |
| **Solution file** | [05_longest_palindromic_substring.js](../solutions/05_longest_palindromic_substring.js) — open only after a real attempt |

## Problem

Given a string s, return the longest contiguous substring that reads the same
forwards and backwards.

## Examples

```
Input: "babad"   Output: "bab"   Explanation: "aba" is also valid
Input: "cbbd"    Output: "bb"
Input: "a"       Output: "a"
```

## Constraints & clarifying questions

```
- If several answers, which one? (any; we return the first found - tests check length
  and that the result is a palindrome inside s)
- Empty string? (return "")
- Case sensitive? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *interval DP, expand around center* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^3) time, O(n) space. Check every substring with a recursive isPalindrome(l, r): equal ends and the inside is a palindrome.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Expand around center   O(n^2) time, O(1) space. Every palindrome has a center (a char, or the gap between two chars).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" -> ""
- all same chars "aaaa" -> whole string
- no palindrome longer than 1 "abc" -> "a"
- even-length palindrome "abba"
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time, O(n) space

```
Check every substring with a recursive isPalindrome(l, r): equal ends and the
inside is a palindrome. No caching, so the inside is rechecked many times.
```

### APPROACH 2 — Interval DP (memo / tabulation)   O(n^2) time, O(n^2) space

### APPROACH 3 — Expand around center   O(n^2) time, O(1) space

```
Every palindrome has a center (a char, or the gap between two chars). For each of
the 2n-1 centers expand outwards while characters match. Same time, no table.
This is what interviewers usually expect; the DP table is the "learn the pattern"
version and is reused in Palindrome Partitioning and Count Palindromic Substrings.
```

### DP definition

```
STATE      dp[l][r] = true if s[l..r] (inclusive) is a palindrome

RECURRENCE dp[l][r] = s[l] === s[r] && (r - l &lt; 2 || dp[l+1][r-1])
(a palindrome is "same ends + palindrome inside")
BASE CASES dp[i][i] = true (single char); dp[i][i+1] = s[i] === s[i+1]
```

### ORDER      dp[l][r] needs dp[l+1][r-1], so fill by increasing length (or l from

```
right to left). Track the best (l, r) while filling.

Table for "babad" (T = palindrome, rows = l, cols = r, only r >= l shown):
         r: 0  1  2  3  4
  l=0 b     T  .  T  .  .      dp[0][2]: 'b'=='b' and dp[1][1] T -> T  "bab"
  l=1 a        T  .  T  .      dp[1][3]: 'a'=='a' and dp[2][2] T -> T  "aba"
  l=2 b           T  .  .
  l=3 a              T  .
  l=4 d                 T      longest = length 3 -> "bab"
```

### Edge cases

```
- "" -> ""
- all same chars "aaaa" -> whole string
- no palindrome longer than 1 "abc" -> "a"
- even-length palindrome "abba"
```

Full JavaScript solution with tests: [05_longest_palindromic_substring.js](../solutions/05_longest_palindromic_substring.js). Run it with `node 05_longest_palindromic_substring.js` from the solutions folder.

</details>

## Common mistakes

- Filling `isPal[l][r]` with `l` going upward: `isPal[l+1][r-1]` is not computed yet. Iterate by length, or `l` from n-1 down to 0.
- Forgetting even-length centers ("abba") in the expand-around-center version.
- Mixing up the inclusive `r` with `slice(l, r)` and returning a string one character short.

## Related follow-ups

- [Longest Palindromic Subsequence](06_longest_palindromic_subsequence.md)
- [Longest Palindromic Substring with Manacher (O(n))](../../../../33_String_Algorithms_Advanced/03_Problems/02_Medium/05_longest_palindromic_substring.md)
- Palindromic Substrings (LeetCode #647)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
