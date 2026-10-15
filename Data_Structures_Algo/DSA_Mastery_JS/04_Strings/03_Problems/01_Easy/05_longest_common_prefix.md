# Longest Common Prefix

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Easy |
| **Pattern** | vertical scan |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #14 — https://leetcode.com/problems/longest-common-prefix/ |
| **Solution file** | [05_longest_common_prefix.js](../solutions/05_longest_common_prefix.js) — open only after a real attempt |

## Problem

Given an array of strings, return the longest prefix shared by ALL of them.
If there is none, return "".

## Examples

```
Input: ["flower","flow","flight"]   Output: "fl"
Input: ["dog","racecar","car"]      Output: ""   Explanation: first letters already differ
```

## Constraints & clarifying questions

```
- Can the array be empty? (return "")
- Can a string be empty? (then the answer is "")
- Case-sensitive? (yes, "A" and "a" differ)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *vertical scan* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(S) time, O(1) space   (S = total characters). Take the first string as the candidate prefix.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (vertical scan)   O(S) time, O(1) space. Compare column by column: look at character 0 of every word, then character 1, ...

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- []                     -> ""
- ["a"]                  -> "a"  (one word is its own prefix)
- ["", "abc"]            -> ""
- ["abc", "abc"]         -> "abc" (do not run past the end of the shortest word)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(S) time, O(1) space   (S = total characters)

```
Take the first string as the candidate prefix. For every other string, shrink the
candidate from the right until that string starts with it. Shrinking uses slice,
which copies, so it is a bit wasteful but still bounded by S.
```

### APPROACH 2 — Optimal (vertical scan)   O(S) time, O(1) space

```
Compare column by column: look at character 0 of every word, then character 1, ...
Stop at the first column where some word is too short or has a different character.
Worst case is still O(S) (all strings equal), but we stop as early as possible.

Dry run on ["flower","flow","flight"]:
  col 0: f f f  ok
  col 1: l l l  ok
  col 2: o o i  mismatch -> answer = first.slice(0, 2) = "fl"
```

### Edge cases

```
- []                     -> ""
- ["a"]                  -> "a"  (one word is its own prefix)
- ["", "abc"]            -> ""
- ["abc", "abc"]         -> "abc" (do not run past the end of the shortest word)
```

Full JavaScript solution with tests: [05_longest_common_prefix.js](../solutions/05_longest_common_prefix.js). Run it with `node 05_longest_common_prefix.js` from the solutions folder.

</details>

## Common mistakes

- Not handling an empty input array or an empty string inside it (answer is "").
- Indexing past the end of a shorter string; stop at the shortest length.
- Sorting and comparing only first and last is valid, but forgetting it costs O(n·L log n).

## Related follow-ups

- [Implement Trie](../../../22_Tries/03_Problems/02_Medium/01_implement_trie.md) — prefixes at scale
- [Longest Common Subsequence](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/01_longest_common_subsequence.md) — a much harder "common" question
- [Is Subsequence](../../../06_Two_Pointers/03_Problems/01_Easy/09_is_subsequence.md) — character-by-character matching with pointers

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
