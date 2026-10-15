# Longest Repeating Character Replacement

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | variable, counts + maxFreq |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #424 — https://leetcode.com/problems/longest-repeating-character-replacement/ |
| **Solution file** | [04_longest_repeating_character_replacement.js](../solutions/04_longest_repeating_character_replacement.js) — open only after a real attempt |

## Problem

Given a string s of uppercase letters and an integer k, you may replace at most k
characters with any other uppercase letter. Return the length of the longest substring
containing the same letter after the replacements.

## Examples

```
Input: s = "ABAB", k = 2      Output: 4   Explanation: replace both A's -> "BBBB"
Input: s = "AABABBA", k = 1   Output: 4   Explanation: "AABA" -> "AAAA" (or "ABBB" -> "BBBB")
```

## Constraints & clarifying questions

```
- Uppercase only? (yes -> 26-slot count array)
- k can be 0? (yes -> longest run of a single letter)
- k >= length? (whole string)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *variable, counts + maxFreq* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2 * 26) time. For each start/end pair count the letters; the window works if (length - most frequent count) &lt;= k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (variable window, counts + maxFreq)   O(n) time, O(26) space. A window is VALID if (windowLength - maxFreqInWindow) &lt;= k: the non-majority letters are the ones we'd replace, and there must be at most k of them.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 -> longest run of one letter
- k >= n -> n
- Single letter string
- Empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 * 26) time

```
For each start/end pair count the letters; the window works if
(length - most frequent count) <= k.
```

### APPROACH 2 — Optimal (variable window, counts + maxFreq)   O(n) time, O(26) space

```
A window is VALID if (windowLength - maxFreqInWindow) <= k: the non-majority letters
are the ones we'd replace, and there must be at most k of them.
  expand: counts[s[right]]++, maxFreq = max(maxFreq, counts[s[right]])
  while window invalid: counts[s[left]]--, left++
  record window length
Subtle point: maxFreq is never decreased when the window shrinks. That's safe because
the answer only improves when maxFreq grows; a stale (too high) maxFreq can only let
the window be as large as a previous valid window, never larger than a true answer.

Dry run on "AABABBA", k = 1:
  right=0 A counts{A:1} maxFreq 1 len 1 - 1 = 0 <= 1 ok   best 1
  right=1 A {A:2} mf 2 len 2 ok best 2
  right=2 B {A:2,B:1} mf 2 len 3, 3-2=1 ok best 3
  right=3 A {A:3,B:1} mf 3 len 4, 4-3=1 ok best 4
  right=4 B {A:3,B:2} mf 3 len 5, 5-3=2 > 1 -> shrink: drop A -> {A:2,B:2} left=1 len 4, 4-3=1 ok
  right=5 B {A:2,B:3} mf 3 len 5, 2 > 1 -> drop A (left=2) {A:1,B:3} len 4 ok
  right=6 A {A:2,B:3} mf 3 len 5 -> drop B (left=3) {A:2,B:2} len 4 ok
  best 4
```

### Edge cases

```
- k = 0 -> longest run of one letter
- k >= n -> n
- Single letter string
- Empty -> 0
```

Full JavaScript solution with tests: [04_longest_repeating_character_replacement.js](../solutions/04_longest_repeating_character_replacement.js). Run it with `node 04_longest_repeating_character_replacement.js` from the solutions folder.

</details>

## Common mistakes

- Recomputing max frequency across all letters each step and still treating the stale-max trick as wrong; it is safe because the answer only grows when maxFreq grows.
- Checking validity before adding the new character to the counts.
- Forgetting that k replacements can turn *any* letters, so the best letter to keep is the most frequent one in the window.

## Related follow-ups

- [Longest Repeating Character Replacement (Strings)](../../../04_Strings/03_Problems/02_Medium/12_longest_repeating_character_replacement.md) — the same problem in the strings topic
- [Max Consecutive Ones III](09_max_consecutive_ones_iii.md) — binary version with k flips
- [Longest Subarray of 1's After Deleting One Element](10_longest_subarray_of_ones_after_deleting.md) — budget of one zero

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
