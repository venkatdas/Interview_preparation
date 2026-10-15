# Is Subsequence

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Easy |
| **Pattern** | two sequences |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #392 — https://leetcode.com/problems/is-subsequence/ |
| **Solution file** | [09_is_subsequence.js](../solutions/09_is_subsequence.js) — open only after a real attempt |

## Problem

Given strings s and t, return true if s is a subsequence of t: s can be formed from t
by deleting some (possibly zero) characters without changing the order of the rest.

## Examples

```
Input: s = "abc", t = "ahbgdc"   Output: true    Explanation: a..b..c appear in order
Input: s = "axc", t = "ahbgdc"   Output: false   Explanation: no 'x' after 'a'
Input: s = "", t = "anything"    Output: true
```

## Constraints & clarifying questions

```
- Subsequence, not substring? (yes: gaps allowed, order matters)
- Empty s? (true) Empty t with non-empty s? (false)
- Follow-up: many s queries against one huge t? (preprocess t: char -> sorted index list,
  then binary search; see 10_Searching)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two sequences* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (recursion over t)   exponential-ish, O(|t|) stack. For each character of t decide: use it to match s[i] or skip it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers, one per string)   O(|t|) time, O(1) space. i walks s, j walks t.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- s longer than t -> false immediately
- s === t -> true
- repeated characters: s = "aaa", t = "aa" -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (recursion over t)   exponential-ish, O(|t|) stack

```
For each character of t decide: use it to match s[i] or skip it. This explores many
paths; good only to show the definition. We give a simple recursive version.
```

### APPROACH 2 — Optimal (two pointers, one per string)   O(|t|) time, O(1) space

```
i walks s, j walks t. Whenever t[j] === s[i], we "consume" that character: i++.
Always j++. If i reaches s.length, every character of s was found in order.
Greedy is safe: matching s[i] to the EARLIEST possible t[j] leaves the most of t
available for the remaining characters of s.

Dry run on s = "abc", t = "ahbgdc":
  j=0 'a' == s[0] -> i=1
  j=1 'h' no
  j=2 'b' == s[1] -> i=2
  j=3 'g' no
  j=4 'd' no
  j=5 'c' == s[2] -> i=3 == s.length -> true
```

### Edge cases

```
- s longer than t -> false immediately
- s === t -> true
- repeated characters: s = "aaa", t = "aa" -> false
```

Full JavaScript solution with tests: [09_is_subsequence.js](../solutions/09_is_subsequence.js). Run it with `node 09_is_subsequence.js` from the solutions folder.

</details>

## Common mistakes

- Advancing the pointer in s on every step instead of only on a match.
- Returning true when the loop ends without checking that all of s was matched.
- For the follow-up (many s strings), rescanning t every time instead of precomputing index lists and binary searching.

## Related follow-ups

- Number of Matching Subsequences (LeetCode #792) — the many-queries follow-up
- [Longest Common Subsequence](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/01_longest_common_subsequence.md) — the DP generalisation
- [Distinct Subsequences](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/03_Hard/11_distinct_subsequences.md) — count the ways

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
