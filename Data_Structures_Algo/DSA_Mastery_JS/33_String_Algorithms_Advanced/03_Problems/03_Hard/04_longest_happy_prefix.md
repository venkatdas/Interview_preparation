# Longest Happy Prefix

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Hard |
| **Pattern** | lps[n-1] |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1392 — https://leetcode.com/problems/longest-happy-prefix/ |
| **Solution file** | [04_longest_happy_prefix.js](../solutions/04_longest_happy_prefix.js) — open only after a real attempt |

## Problem

A "happy prefix" is a non-empty prefix that is also a suffix, excluding the whole string.
Return the longest happy prefix of s, or "" if none exists.

## Examples

```
Input: "level"         Output: "l"
Input: "ababab"        Output: "abab"
Input: "leetcodeleet"  Output: "leet"
Input: "a"             Output: ""
```

## Constraints & clarifying questions

```
- Length up to 10^5 -> O(n^2) string comparisons are too slow
- Must be a PROPER prefix (shorter than s)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *lps[n-1]* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. For len from n-1 down to 1, compare s.slice(0, len) with s.slice(n - len).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (KMP failure table)   O(n) time, O(n) space. This is literally the definition of lps[n-1]: the length of the longest proper prefix of s that is also a suffix of s.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single character -> ""
- all same letters "aaaa" -> "aaa"
- no repetition at all -> ""
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
For len from n-1 down to 1, compare s.slice(0, len) with s.slice(n - len).
```

### APPROACH 2 — Optimal (KMP failure table)   O(n) time, O(n) space

```
This is literally the definition of lps[n-1]: the length of the longest proper prefix
of s that is also a suffix of s. Build lps and return s.slice(0, lps[n-1]).

Dry run on "ababab":
  i=1: 'b' vs s[0]='a' -> len 0
  i=2: 'a' vs s[0] -> len 1
  i=3: 'b' vs s[1]='b' -> len 2
  i=4: 'a' vs s[2]='a' -> len 3
  i=5: 'b' vs s[3]='b' -> len 4
  lps = [0,0,1,2,3,4] -> answer s.slice(0, 4) = "abab"
```

### Edge cases

```
- single character -> ""
- all same letters "aaaa" -> "aaa"
- no repetition at all -> ""
```

Full JavaScript solution with tests: [04_longest_happy_prefix.js](../solutions/04_longest_happy_prefix.js). Run it with `node 04_longest_happy_prefix.js` from the solutions folder.

</details>

## Common mistakes

- Allowing the whole string as its own prefix; the prefix must be proper, which is exactly why `lps` excludes it.
- Comparing every prefix with every suffix by slicing, O(n^2) time and memory for n = 1e5.
- Hashing without checking for negative values after `(a - b) % mod` in JavaScript.

## Related follow-ups

- [Repeated Substring Pattern](../01_Easy/02_repeated_substring_pattern.md)
- [Shortest Palindrome](06_shortest_palindrome.md)
- [Sum of Scores of Built Strings](09_sum_of_scores_of_built_strings.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
