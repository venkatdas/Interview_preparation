# Longest Repeating Character Replacement

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | sliding window (teaser) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #424 — https://leetcode.com/problems/longest-repeating-character-replacement/ |
| **Solution file** | [12_longest_repeating_character_replacement.js](../solutions/12_longest_repeating_character_replacement.js) — open only after a real attempt |

## Problem

Given a string of uppercase letters and an integer k, you may change at most k
characters to any other uppercase letter. Return the length of the longest substring
that can be made of a single repeated letter after those changes.

## Examples

```
Input: s = "ABAB", k = 2     Output: 4   Explanation: change both A's (or both B's)
Input: s = "AABABBA", k = 1  Output: 4   Explanation: "AABA" -> "AAAA" by changing one B
```

## Constraints & clarifying questions

```
- Only uppercase A-Z? (yes -> 26-slot count array)
- k can be 0? (yes -> longest run of equal letters)
- k >= n? (then the whole string, n)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sliding window (teaser)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every start, extend end one char at a time while maintaining counts for the window.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sliding window with max frequency)   O(n) time, O(1) space. Keep a window [left, right].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""            -> 0
- k = 0         -> longest run of one letter
- k >= n        -> n
- all same      -> n regardless of k
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start, extend end one char at a time while maintaining counts for the
window. The window is fixable if (windowLength - mostFrequentCount) <= k.
Checking the max of 26 counts is O(1).
```

### APPROACH 2 — Optimal (sliding window with max frequency)   O(n) time, O(1) space

```
Keep a window [left, right]. A window is valid when the characters that are NOT the
most frequent one can all be replaced: windowLength - maxCount <= k.
Grow right every step. If the window becomes invalid, slide left by ONE.
Trick: maxCount never needs to decrease. A smaller maxCount could never give a longer
answer than one we already saw, so the window only ever grows or slides - O(n).

Dry run on "AABABBA", k=1:
  right=0 'A' count A:1 max=1 len=1 ok  best=1
  right=1 'A' A:2 max=2 len=2 ok        best=2
  right=2 'B' B:1 max=2 len=3 3-2=1 ok  best=3
  right=3 'A' A:3 max=3 len=4 4-3=1 ok  best=4
  right=4 'B' B:2 max=3 len=5 5-3=2 >1 -> slide left: remove 'A' (A:2), left=1, len=4
  right=5 'B' B:3 max=3 len=5 5-3=2 >1 -> remove 'A' (A:1), left=2, len=4
  right=6 'A' A:2 max=3 len=5 >1 -> remove 'B' (B:2), left=3, len=4
  answer 4
```

### Edge cases

```
- ""            -> 0
- k = 0         -> longest run of one letter
- k >= n        -> n
- all same      -> n regardless of k
```

Full JavaScript solution with tests: [12_longest_repeating_character_replacement.js](../solutions/12_longest_repeating_character_replacement.js). Run it with `node 12_longest_repeating_character_replacement.js` from the solutions folder.

</details>

## Common mistakes

- Recomputing the max frequency over all 26 letters on every shrink and thinking the "stale max" trick is a bug; it is safe because the answer only grows when maxFreq grows.
- Using `while` vs `if` for shrinking without understanding why the window never needs to shrink by more than one.
- Testing `windowLen - maxFreq > k` with the length computed before adding the new character.

## Related follow-ups

- [Longest Repeating Character Replacement (Sliding Window)](../../../07_Sliding_Window/03_Problems/02_Medium/04_longest_repeating_character_replacement.md) — same problem in the window topic
- [Max Consecutive Ones III](../../../07_Sliding_Window/03_Problems/02_Medium/09_max_consecutive_ones_iii.md) — the binary-array version with k flips
- [Longest Substring Without Repeating Characters](../../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md) — variable window with a validity rule

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
