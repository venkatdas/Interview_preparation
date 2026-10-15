# Sum of Scores of Built Strings

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Hard |
| **Pattern** | Z-function |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #2223 — https://leetcode.com/problems/sum-of-scores-of-built-strings/ |
| **Solution file** | [09_sum_of_scores_of_built_strings.js](../solutions/09_sum_of_scores_of_built_strings.js) — open only after a real attempt |

## Problem

You build string s one character at a time by PREPENDING, so after i steps you hold the
suffix s[n-i..]. The score of each intermediate string is the length of its longest
common prefix with the final s. Return the sum of all n scores.

## Examples

```
Input: "babab"   Output: 9
  suffixes: "b" (lcp 1), "ab" (0), "bab" (3), "abab" (0), "babab" (5) -> 1+0+3+0+5 = 9
Input: "azbazbzaz"   Output: 14
```

## Constraints & clarifying questions

```
- Length up to 10^5 -> O(n^2) comparisons too slow
- The whole string counts once (score n)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Z-function* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. For each suffix compare it with s character by character until a mismatch.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Z-function)   O(n) time, O(n) space. z[i] is DEFINED as the length of the longest common prefix of s and s[i..].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single character -> 1
- all same letters "aaaa" -> 4+3+2+1 = 10
- no repeated prefix -> n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
For each suffix compare it with s character by character until a mismatch.
```

### APPROACH 2 — Optimal (Z-function)   O(n) time, O(n) space

```
z[i] is DEFINED as the length of the longest common prefix of s and s[i..]. That is
exactly the score of the suffix starting at i. Answer = n (for i = 0) + sum of z[1..n-1].
The Z-algorithm keeps the rightmost "Z-box" [l, r) that matches a prefix of s; for a new
i inside it, z[i] starts at min(r - i, z[i - l]) (copy from the mirrored position) and is
only extended by direct comparison beyond r. Each comparison moves r forward -> O(n).

Dry run on "babab":
  z[0] = 5 (by definition)
  i=1: 'a' vs 'b' -> 0
  i=2: compare s[2..] "bab" with "bab" -> 3; box [2, 5)
  i=3: inside box: z[3] = min(5-3, z[1]) = 0; s[3]='a' vs s[0]='b' -> 0
  i=4: inside box: z[4] = min(1, z[2]=3) = 1; s[5] out of range -> 1
  sum = 5 + 0 + 3 + 0 + 1 = 9
```

### Edge cases

```
- single character -> 1
- all same letters "aaaa" -> 4+3+2+1 = 10
- no repeated prefix -> n
```

Full JavaScript solution with tests: [09_sum_of_scores_of_built_strings.js](../solutions/09_sum_of_scores_of_built_strings.js). Run it with `node 09_sum_of_scores_of_built_strings.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that the score of the full string itself is n (z[0] is set to n by our convention, but some Z implementations leave it 0).
- Using a 32-bit-style accumulator; the sum can reach about n^2/2, so keep it in a Number (safe below 2^53).
- Recomputing the common prefix from scratch for every suffix, which is O(n^2) on "aaaa...".

## Related follow-ups

- [Longest Happy Prefix](04_longest_happy_prefix.md)
- [Find the Index of the First Occurrence](../01_Easy/01_find_index_of_first_occurrence.md)
- Longest Common Prefix (LeetCode #14)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
