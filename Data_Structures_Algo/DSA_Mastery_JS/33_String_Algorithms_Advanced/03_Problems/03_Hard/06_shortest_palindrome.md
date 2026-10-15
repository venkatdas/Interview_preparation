# Shortest Palindrome

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Hard |
| **Pattern** | KMP on s + '#' + reverse(s) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #214 — https://leetcode.com/problems/shortest-palindrome/ |
| **Solution file** | [06_shortest_palindrome.js](../solutions/06_shortest_palindrome.js) — open only after a real attempt |

## Problem

You may add characters only in FRONT of s. Return the shortest palindrome you can make.

## Examples

```
Input: "aacecaaa"   Output: "aaacecaaa"
Input: "abcd"       Output: "dcbabcd"
```

## Constraints & clarifying questions

```
- Length up to 5 * 10^4 -> O(n^2) is too slow in the worst case
- Only prepending allowed
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *KMP on s + '#' + reverse(s)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. Find the longest prefix of s that is a palindrome (try lengths n, n-1, ..., check each in O(n)).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (KMP on s + '#' + reverse(s))   O(n) time, O(n) space. "Longest palindromic PREFIX of s" = "longest prefix of s that is a suffix of reverse(s)".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty string -> ""
- already a palindrome -> unchanged
- single character
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
Find the longest prefix of s that is a palindrome (try lengths n, n-1, ..., check each in
O(n)). The rest of the string, reversed, goes in front.
```

### APPROACH 2 — Optimal (KMP on s + '#' + reverse(s))   O(n) time, O(n) space

```
"Longest palindromic PREFIX of s" = "longest prefix of s that is a suffix of reverse(s)".
The KMP failure table measures exactly "longest prefix that is also a suffix", so build
lps for  combined = s + '#' + reverse(s)  (the '#' never matches, so the prefix cannot
spill past s). lps[last] = length L of the longest palindromic prefix.
Answer = reverse(s.slice(L)) + s.

Dry run on "abcd": combined = "abcd#dcba"
  lps = [0,0,0,0,0,0,0,0,1]  -> L = 1 (just "a")
  prepend reverse("bcd") = "dcb" -> "dcbabcd"
"aacecaaa": combined = "aacecaaa#aaacecaa"; lps[last] = 7 ("aacecaa" is a palindrome)
  prepend reverse("a") -> "aaacecaaa"
```

### Edge cases

```
- empty string -> ""
- already a palindrome -> unchanged
- single character
```

Full JavaScript solution with tests: [06_shortest_palindrome.js](../solutions/06_shortest_palindrome.js). Run it with `node 06_shortest_palindrome.js` from the solutions folder.

</details>

## Common mistakes

- Running KMP on `s + reverse(s)` without a separator; the border can then run across the middle and be longer than s.
- Prepending the reverse of the wrong part: you prepend reverse(s[k..]) where k is the longest palindromic PREFIX length.
- Using the O(n^2) "check every prefix" approach on 5 * 10^4 characters.

## Related follow-ups

- [Longest Happy Prefix](04_longest_happy_prefix.md)
- [Longest Palindromic Substring](../02_Medium/05_longest_palindromic_substring.md)
- Palindrome Pairs (LeetCode #336)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
