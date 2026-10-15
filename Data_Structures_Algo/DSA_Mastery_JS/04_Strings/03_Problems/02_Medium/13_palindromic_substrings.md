# Palindromic Substrings

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | expand around center |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #647 — https://leetcode.com/problems/palindromic-substrings/ |
| **Solution file** | [13_palindromic_substrings.js](../solutions/13_palindromic_substrings.js) — open only after a real attempt |

## Problem

Given a string s, count how many substrings of s are palindromes. Substrings at
different positions count separately even if they have the same text.

## Examples

```
Input: "abc"   Output: 3   Explanation: "a", "b", "c"
Input: "aaa"   Output: 6   Explanation: "a","a","a","aa","aa","aaa"
```

## Constraints & clarifying questions

```
- Count positions, not distinct strings? (positions)
- Only lowercase letters? (yes, but the solution does not depend on it)
- Empty string? (0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *expand around center* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^3) time, O(1) space. Every (start, end) pair, check palindrome with two pointers, count the hits.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (expand around center)   O(n^2) time, O(1) space. Same centers as Longest Palindromic Substring (problem 07): n odd centers and n-1 even centers.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""       -> 0
- "a"      -> 1
- "ab"     -> 2
- "aaaa"   -> 10 (= n(n+1)/2, every substring is a palindrome)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time, O(1) space

```
Every (start, end) pair, check palindrome with two pointers, count the hits.
```

### APPROACH 2 — Optimal (expand around center)   O(n^2) time, O(1) space

```
Same centers as Longest Palindromic Substring (problem 07): n odd centers and n-1 even
centers. From each one expand outward; EVERY successful expansion step is one more
palindrome, so count each step instead of tracking a maximum.
(A DP table dp[i][j] = "s[i..j] is palindrome" also works in O(n^2) time, O(n^2) space;
see 29_Dynamic_Programming.)

Dry run on "aaa":
  center 0 odd:  "a"            +1
  center 0 even: "aa" (0,1)     +1
  center 1 odd:  "a", "aaa"     +2
  center 1 even: "aa" (1,2)     +1
  center 2 odd:  "a"            +1
  center 2 even: (2,3) out of range  +0
  total 6
```

### Edge cases

```
- ""       -> 0
- "a"      -> 1
- "ab"     -> 2
- "aaaa"   -> 10 (= n(n+1)/2, every substring is a palindrome)
```

Full JavaScript solution with tests: [13_palindromic_substrings.js](../solutions/13_palindromic_substrings.js). Run it with `node 13_palindromic_substrings.js` from the solutions folder.

</details>

## Common mistakes

- Counting only odd-length centers; there are 2n - 1 centers in total.
- Counting distinct palindromes when the problem counts every occurrence by position.
- Building every substring and reversing it (O(n^3)).

## Related follow-ups

- [Longest Palindromic Substring](07_longest_palindromic_substring.md) — same expansion, keep the longest
- [Palindrome Partitioning](../../../13_Backtracking/03_Problems/02_Medium/10_palindrome_partitioning.md) — split a string into palindromes
- [Palindrome Partitioning II](../../../29_Dynamic_Programming/05_Interval_DP/03_Problems/03_Hard/04_palindrome_partitioning_ii.md) — minimum cuts

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
