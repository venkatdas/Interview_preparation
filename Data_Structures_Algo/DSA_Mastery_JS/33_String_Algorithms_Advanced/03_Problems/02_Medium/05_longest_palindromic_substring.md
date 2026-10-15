# Longest Palindromic Substring

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Medium |
| **Pattern** | Manacher (and expand-around-center) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #5 — https://leetcode.com/problems/longest-palindromic-substring/ |
| **Solution file** | [05_longest_palindromic_substring.js](../solutions/05_longest_palindromic_substring.js) — open only after a real attempt |

## Problem

Return the longest substring of s that reads the same forwards and backwards.
If there are several of the same length, any one is accepted.

## Examples

```
Input: "babad"   Output: "bab" (or "aba")
Input: "cbbd"    Output: "bb"
Input: "a"       Output: "a"
```

## Constraints & clarifying questions

```
- Length up to 1000 -> O(n^2) expand-around-center is the expected interview answer;
  Manacher's O(n) is the bonus that distinguishes you
- Case sensitive, every character counts
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Manacher (and expand-around-center)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force / expand around center   O(n^2) time, O(1) space. Every palindrome has a center: a character (odd length) or a gap between two characters (even length).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Manacher's algorithm)   O(n) time, O(n) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty string -> ""
- all same characters -> whole string
- no repeated characters -> any single character
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force / expand around center   O(n^2) time, O(1) space

```
Every palindrome has a center: a character (odd length) or a gap between two characters
(even length). For each of the 2n - 1 centers expand outwards while the ends match.
(The true brute force checks all O(n^2) substrings in O(n) each = O(n^3).)
```

### APPROACH 2 — Optimal (Manacher's algorithm)   O(n) time, O(n) space

```
1. Transform: "abba" -> "^#a#b#b#a#$". Now every palindrome has odd length and the
   sentinels ^ and $ stop the expansion without bounds checks.
2. radius[i] = how far the palindrome centred at i reaches. Keep the palindrome with the
   rightmost edge: (center, right).
3. For a new i inside that palindrome, its mirror j = 2*center - i already has a known
   radius, and the palindrome around j is reflected around center, so
   radius[i] >= min(radius[j], right - i). Start from there and only expand further.
4. Each expansion step pushes `right` further, and right only moves n times -> O(n).

Dry run on "cbbd" -> t = "^#c#b#b#d#$" (indices 0..10)
  i=1 '#': 0      i=2 'c': 0      i=3 '#': 0
  i=4 'b': t[5]='#' === t[3]='#' -> 1; t[6]='b' vs t[2]='c' stop.   radius[4] = 1
  i=5 '#': t[6]='b' === t[4]='b' -> 1; t[7]='#' === t[3]='#' -> 2; t[8]='d' vs t[2]='c' stop.
           radius[5] = 2, center 5, right 7
  i=6 'b': inside (6 < 7); mirror 4 has radius 1, right - i = 1 -> start 1;
           t[8]='d' vs t[4]='b' stop.                                 radius[6] = 1
  best radius 2 at center 5 -> start (5 - 2 - 1) / 2 = 1, length 2 -> "bb"
```

### Edge cases

```
- empty string -> ""
- all same characters -> whole string
- no repeated characters -> any single character
```

Full JavaScript solution with tests: [05_longest_palindromic_substring.js](../solutions/05_longest_palindromic_substring.js). Run it with `node 05_longest_palindromic_substring.js` from the solutions folder.

</details>

## Common mistakes

- Expanding only around single characters and missing even-length palindromes like "abba".
- Mapping Manacher indices back to the original string off by one (the `#` separators double every index).
- Building a full n x n boolean DP table when O(1) extra space (expand around center) is enough.

## Related follow-ups

- [Longest Palindromic Substring (DP view)](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/05_longest_palindromic_substring.md)
- [Shortest Palindrome](../03_Hard/06_shortest_palindrome.md)
- Palindromic Substrings (LeetCode #647)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
