# Longest Palindromic Substring

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | expand around center |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #5 — https://leetcode.com/problems/longest-palindromic-substring/ |
| **Solution file** | [07_longest_palindromic_substring.js](../solutions/07_longest_palindromic_substring.js) — open only after a real attempt |

## Problem

Given a string s, return the longest substring of s that is a palindrome.
(A substring is contiguous. If there are several of the same length, any one is accepted.)

## Examples

```
Input: "babad"   Output: "bab"   Explanation: "aba" is also valid
Input: "cbbd"    Output: "bb"
Input: "a"       Output: "a"
```

## Constraints & clarifying questions

```
- Return the substring or just its length? (substring)
- Any answer when there are ties? (yes)
- Empty string? (return "")
- Case-sensitive? (yes)
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

**Start simple.** APPROACH 1 — Brute force   O(n^3) time, O(1) space. Try every pair (start, end), check whether that substring is a palindrome with two pointers (O(n)), keep the longest.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (expand around center)   O(n^2) time, O(1) space. Every palindrome is symmetric around a center.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""              -> ""
- "a"             -> "a"
- all same "aaaa" -> "aaaa" (even and odd centers both expand fully)
- no repeats "abc"-> any single char
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time, O(1) space

```
Try every pair (start, end), check whether that substring is a palindrome with two
pointers (O(n)), keep the longest. n^2 substrings * O(n) check.
```

### APPROACH 2 — Optimal (expand around center)   O(n^2) time, O(1) space

```
Every palindrome is symmetric around a center. A center is either one character
(odd length, like "aba") or the gap between two characters (even length, like "abba").
That gives 2n - 1 centers. From each center, expand outward while the two ends match.
Track the best (start, length). Each expansion is O(n), so O(n^2) total, no extra memory.
(Manacher's algorithm does it in O(n) but is almost never required.)

Dry run on "cbbd":
  center i=0 odd:  "c" len 1; even (0,1): c!=b -> len 0
  center i=1 odd:  "b" len 1; even (1,2): b==b expand -> c!=d stop, len 2 "bb"  best=2
  center i=2 odd:  "b" len 1; even (2,3): b!=d
  center i=3 odd:  "d" len 1
  answer "bb"
```

### Edge cases

```
- ""              -> ""
- "a"             -> "a"
- all same "aaaa" -> "aaaa" (even and odd centers both expand fully)
- no repeats "abc"-> any single char
```

Full JavaScript solution with tests: [07_longest_palindromic_substring.js](../solutions/07_longest_palindromic_substring.js). Run it with `node 07_longest_palindromic_substring.js` from the solutions folder.

</details>

## Common mistakes

- Expanding only around single characters and missing even-length palindromes like "abba".
- Off-by-one when converting the expanded bounds back to a substring (`s.slice(l + 1, r)` after the loop overshoots).
- Checking every substring with a palindrome test (O(n^3)) and calling it acceptable.

## Related follow-ups

- [Palindromic Substrings](13_palindromic_substrings.md) — count instead of find the longest, same expansion
- [Longest Palindromic Substring (DP)](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/05_longest_palindromic_substring.md) — the table-based solution
- [Longest Palindromic Subsequence](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/06_longest_palindromic_subsequence.md) — subsequence, not substring

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
