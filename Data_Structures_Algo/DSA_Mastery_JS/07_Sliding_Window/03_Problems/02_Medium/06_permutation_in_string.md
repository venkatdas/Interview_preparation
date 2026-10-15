# Permutation in String

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | fixed, counts |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #567 — https://leetcode.com/problems/permutation-in-string/ |
| **Solution file** | [06_permutation_in_string.js](../solutions/06_permutation_in_string.js) — open only after a real attempt |

## Problem

Given strings s1 and s2, return true if s2 contains a permutation of s1 as a substring.
In other words: does some window of s2 with length |s1| have exactly s1's letter counts?

## Examples

```
Input: s1 = "ab", s2 = "eidbaooo"   Output: true    Explanation: "ba" is a permutation of "ab"
Input: s1 = "ab", s2 = "eidboaoo"   Output: false
```

## Constraints & clarifying questions

```
- Lowercase letters only? (yes -> two 26-slot arrays)
- |s1| > |s2|? (false)
- Empty s1? (clarify; LeetCode says length >= 1)
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

**Start simple.** APPROACH 1 — Brute force   O(|s2| * |s1| log |s1|) time. For each window of length |s1| in s2, sort it and compare to sorted s1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (fixed window + counts + "matches" counter)   O(|s2|) time, O(26) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- s1 longer than s2 -> false
- s1 === s2 -> true
- s1 has repeated letters: "aab" in "baa" -> true
- Match at the very end of s2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(|s2| * |s1| log |s1|) time

```
For each window of length |s1| in s2, sort it and compare to sorted s1.
```

### APPROACH 2 — Optimal (fixed window + counts + "matches" counter)   O(|s2|) time, O(26) space

```
1. need[26] = counts of s1. window[26] = counts of the first |s1| letters of s2.
  2. matches = how many of the 26 letters have need[i] === window[i]. If 26 -> true.
  3. Slide: for the incoming letter, window[in]++, then
       if window[in] === need[in]  -> matches++
       else if window[in] === need[in] + 1 -> matches--   (we just broke a match)
     for the outgoing letter, window[out]--, then
       if window[out] === need[out] -> matches++
       else if window[out] === need[out] - 1 -> matches--
  4. After each slide, if matches === 26 -> true.
Keeping `matches` makes each step O(1) instead of comparing 26 slots.

Dry run on s1 = "ab", s2 = "eidbaooo":
  need {a:1, b:1}. first window "ei": matches = 24 (all letters except a, b match at 0)
  slide in 'd', out 'e': no change to a/b, matches 24
  slide in 'b', out 'i': window b=1 === need -> 25
  slide in 'a', out 'd': window a=1 === need -> 26 -> true
```

### Edge cases

```
- s1 longer than s2 -> false
- s1 === s2 -> true
- s1 has repeated letters: "aab" in "baa" -> true
- Match at the very end of s2
```

Full JavaScript solution with tests: [06_permutation_in_string.js](../solutions/06_permutation_in_string.js). Run it with `node 06_permutation_in_string.js` from the solutions folder.

</details>

## Common mistakes

- Generating all permutations of s1 (factorial time).
- Using a variable-size window; the window size is fixed at |s1|.
- Forgetting the case |s1| > |s2|.

## Related follow-ups

- [Find All Anagrams in a String](07_find_all_anagrams.md) — return every start index
- [Valid Anagram](../../../04_Strings/03_Problems/01_Easy/03_valid_anagram.md) — the single comparison
- [Minimum Window Substring](../03_Hard/14_minimum_window_substring.md) — the variable-size version

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
