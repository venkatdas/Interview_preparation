# Longest Substring Without Repeating Characters

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | variable, Set |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #3 — https://leetcode.com/problems/longest-substring-without-repeating-characters/ |
| **Solution file** | [03_longest_substring_without_repeating.js](../solutions/03_longest_substring_without_repeating.js) — open only after a real attempt |

## Problem

Given a string s, return the length of the longest substring that has no repeated characters.

## Examples

```
Input: "abcabcbb"   Output: 3   Explanation: "abc"
Input: "bbbbb"      Output: 1
Input: "pwwkew"     Output: 3   Explanation: "wke"
```

## Constraints & clarifying questions

```
- Substring (contiguous), not subsequence? (substring)
- Any characters (spaces, symbols, unicode)? (yes -> use a Set/Map, not a 26-array)
- Return length, not the substring? (length)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *variable, Set* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(k) space. For every start, extend until a repeat appears (use a Set per start).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (variable window with a Set, "longest valid")   O(n) time, O(k) space. The sliding-window view: the window [left, right] is VALID when it has no repeats.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Empty -> 0
- All same -> 1
- All unique -> n
- Repeat at the very end
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(k) space

```
For every start, extend until a repeat appears (use a Set per start).
```

### APPROACH 2 — Optimal (variable window with a Set, "longest valid")   O(n) time, O(k) space

```
The sliding-window view: the window [left, right] is VALID when it has no repeats.
Keep a Set of characters inside the window.
  expand: look at s[right]
  while s[right] is already in the Set: remove s[left] from the Set, left++   (shrink until valid)
  add s[right]; record right - left + 1
Monotonic condition: adding characters can only ADD repeats, removing can only remove
them, so left never needs to go backward.

Dry run on "pwwkew":
  right=0 'p' set{p}        len 1
  right=1 'w' set{p,w}      len 2
  right=2 'w' in set -> remove p (left=1), remove w (left=2), set{} -> add w, set{w} len 1
  right=3 'k' set{w,k}      len 2
  right=4 'e' set{w,k,e}    len 3
  right=5 'w' in set -> remove w (left=3), set{k,e} -> add w, set{k,e,w} len 3
  best 3

(05_Hashing has the "jump left using last index" version. Same O(n), fewer steps.)
```

### Edge cases

```
- Empty -> 0
- All same -> 1
- All unique -> n
- Repeat at the very end
```

Full JavaScript solution with tests: [03_longest_substring_without_repeating.js](../solutions/03_longest_substring_without_repeating.js). Run it with `node 03_longest_substring_without_repeating.js` from the solutions folder.

</details>

## Common mistakes

- Jumping `left` backward to an old last-seen index; always take the max with the current left.
- Shrinking with `if` instead of `while` in the Set version, leaving a duplicate in the window.
- Returning the substring when the length is asked for.

## Related follow-ups

- [Longest Substring Without Repeating Characters (Hashing)](../../../05_Hashing/03_Problems/02_Medium/12_longest_substring_without_repeating.md) — the last-index map view
- [Longest Repeating Character Replacement](04_longest_repeating_character_replacement.md) — a window with a replacement budget
- [Fruit Into Baskets](08_fruit_into_baskets.md) — at most two distinct values

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
