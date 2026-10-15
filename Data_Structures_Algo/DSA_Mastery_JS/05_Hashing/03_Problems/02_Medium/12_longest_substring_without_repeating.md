# Longest Substring Without Repeating Characters

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Medium |
| **Pattern** | index map + window |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #3 — https://leetcode.com/problems/longest-substring-without-repeating-characters/ |
| **Solution file** | [12_longest_substring_without_repeating.js](../solutions/12_longest_substring_without_repeating.js) — open only after a real attempt |

## Problem

Given a string s, return the length of the longest substring with no repeated characters.

## Examples

```
Input: "abcabcbb"   Output: 3   Explanation: "abc"
Input: "bbbbb"      Output: 1   Explanation: "b"
Input: "pwwkew"     Output: 3   Explanation: "wke" ("pwke" is not a substring)
Input: ""           Output: 0
```

## Constraints & clarifying questions

```
- Substring (contiguous) or subsequence? (substring)
- Character set? (any; spaces and symbols count as characters)
- Return the length or the substring itself? (length)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *index map + window* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(k) space. For every start index, extend to the right adding characters to a Set until a repeat appears.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (index map + jumping window)   O(n) time, O(k) space. This folder's view: hashing gives us "where did I LAST see this character?" in O(1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Empty -> 0
- All same chars -> 1
- All unique -> n
- "abba": stale index must not move left backwards
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(k) space

```
For every start index, extend to the right adding characters to a Set until a repeat
appears. Track the longest.
```

### APPROACH 2 — Optimal (index map + jumping window)   O(n) time, O(k) space

```
This folder's view: hashing gives us "where did I LAST see this character?" in O(1).
Keep a window [left, right] with no repeats. When s[right] was seen at index p and
p >= left, the window must start AFTER p: left = p + 1. We jump directly instead of
shrinking one by one. Store/overwrite lastIndex[s[right]] = right every step.

(The shrink-one-at-a-time version with a Set is in 07_Sliding_Window; same O(n).)

Dry run on "abcabcbb":
  r=0 'a' not seen        left=0  len=1  map{a:0}
  r=1 'b' not seen        left=0  len=2  map{a:0,b:1}
  r=2 'c' not seen        left=0  len=3  map{a:0,b:1,c:2}
  r=3 'a' seen at 0 >= 0  left=1  len=3  map{a:3,...}
  r=4 'b' seen at 1 >= 1  left=2  len=3  map{b:4,...}
  r=5 'c' seen at 2 >= 2  left=3  len=3
  r=6 'b' seen at 4 >= 3  left=5  len=2
  r=7 'b' seen at 6 >= 5  left=7  len=1
  best = 3

The `p >= left` check matters: in "abba", at the final 'a' the map says a was at 0,
but left is already 2, so we must NOT move left backwards.
```

### Edge cases

```
- Empty -> 0
- All same chars -> 1
- All unique -> n
- "abba": stale index must not move left backwards
```

Full JavaScript solution with tests: [12_longest_substring_without_repeating.js](../solutions/12_longest_substring_without_repeating.js). Run it with `node 12_longest_substring_without_repeating.js` from the solutions folder.

</details>

## Common mistakes

- Moving `left` backwards when the last seen index of a character is outside the current window; use `Math.max(left, last + 1)`.
- Updating the answer before shrinking the window.
- Assuming only lowercase letters; spaces and digits count as characters too.

## Related follow-ups

- [Longest Substring Without Repeating Characters (Sliding Window)](../../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md) — the window view
- [Longest Repeating Character Replacement](../../../07_Sliding_Window/03_Problems/02_Medium/04_longest_repeating_character_replacement.md) — a window with a budget
- Longest Substring with At Most K Distinct Characters (LeetCode #340) — count distinct keys in the map

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
