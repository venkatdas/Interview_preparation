# Find All Anagrams in a String

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | fixed, counts |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #438 — https://leetcode.com/problems/find-all-anagrams-in-a-string/ |
| **Solution file** | [07_find_all_anagrams.js](../solutions/07_find_all_anagrams.js) — open only after a real attempt |

## Problem

Given strings s and p, return all start indices of substrings of s that are anagrams of p.

## Examples

```
Input: s = "cbaebabacd", p = "abc"   Output: [0, 6]
Input: s = "abab", p = "ab"          Output: [0, 1, 2]
```

## Constraints & clarifying questions

```
- Lowercase only? (yes)
- p longer than s? ([])
- Overlapping matches count? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fixed, counts* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(|s| * 26) with per-window recount. For every window of length |p|, count letters and compare the two 26-arrays.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (fixed window, counts, compare via a diff counter)   O(|s|) time, O(26) space. Sliding-window view (contrast with 05_Hashing which tracks "matched distinct letters"): keep ONE array `diff` = windowCount - pCount for each letter, plus `mismatched` = how many letters have diff !== 0.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- p longer than s -> []
- s === p -> [0]
- p with repeated letters
- no matches -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(|s| * 26) with per-window recount

```
For every window of length |p|, count letters and compare the two 26-arrays.
```

### APPROACH 2 — Optimal (fixed window, counts, compare via a diff counter)   O(|s|) time, O(26) space

```
Sliding-window view (contrast with 05_Hashing which tracks "matched distinct letters"):
keep ONE array `diff` = windowCount - pCount for each letter, plus `mismatched` = how
many letters have diff !== 0. The window is an anagram when mismatched === 0.
  slide in ch:  diff[ch]++  -> if diff became 0 mismatched--, if it became 1 mismatched++
  slide out ch: diff[ch]--  -> if diff became 0 mismatched--, if it became -1 mismatched++
Every step is O(1).

Dry run on s = "abab", p = "ab": diff starts {a:-1, b:-1}, mismatched 2
  r=0 in 'a': diff a=0 -> mismatched 1
  r=1 in 'b': diff b=0 -> mismatched 0; window [0,1] full -> record 0
  r=2 in 'a': diff a=1 -> mismatched 1; out s[0]='a': diff a=0 -> 0 -> record 1
  r=3 in 'b': b=1 -> 1; out s[1]='b': b=0 -> 0 -> record 2
  [0, 1, 2]
```

### Edge cases

```
- p longer than s -> []
- s === p -> [0]
- p with repeated letters
- no matches -> []
```

Full JavaScript solution with tests: [07_find_all_anagrams.js](../solutions/07_find_all_anagrams.js). Run it with `node 07_find_all_anagrams.js` from the solutions folder.

</details>

## Common mistakes

- Recounting the window each time instead of adding one character and removing one.
- Comparing count arrays with `===` or `JSON.stringify` per step (slow); keep a matches counter.
- Recording the end index of the window instead of the start index.

## Related follow-ups

- [Find All Anagrams in a String (Hashing)](../../../05_Hashing/03_Problems/02_Medium/13_find_all_anagrams.md) — same problem, hashing view
- [Permutation in String](06_permutation_in_string.md) — stop at the first match
- Substring with Concatenation of All Words (LeetCode #30) — anagram windows over words

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
