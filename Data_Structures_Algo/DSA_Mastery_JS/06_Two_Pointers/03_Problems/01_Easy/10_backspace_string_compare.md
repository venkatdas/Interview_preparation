# Backspace String Compare

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Easy |
| **Pattern** | two sequences from the back |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #844 — https://leetcode.com/problems/backspace-string-compare/ |
| **Solution file** | [10_backspace_string_compare.js](../solutions/10_backspace_string_compare.js) — open only after a real attempt |

## Problem

Given two strings s and t where '#' means backspace, return true if they are equal
after being typed into empty text editors. Backspacing an empty editor does nothing.

## Examples

```
Input: s = "ab#c", t = "ad#c"     Output: true    Explanation: both become "ac"
Input: s = "ab##", t = "c#d#"     Output: true    Explanation: both become ""
Input: s = "a#c", t = "b"         Output: false   Explanation: "c" vs "b"
```

## Constraints & clarifying questions

```
- Can '#' appear when the editor is empty? (yes, it's a no-op)
- Follow-up: can you do O(n) time with O(1) space? (that is the two-pointer solution)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two sequences from the back* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (build with a stack)   O(n + m) time, O(n + m) space. Simulate typing: push characters, pop on '#'.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers from the BACK)   O(n + m) time, O(1) space. A backspace deletes the character BEFORE it, so reading forwards we don't know if a character survives.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Both reduce to "" -> true
- More '#' than characters -> fine
- "a##c" vs "#a#c": both "c"
- Different lengths but same result
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (build with a stack)   O(n + m) time, O(n + m) space

```
Simulate typing: push characters, pop on '#'. Compare the two final strings.
Perfectly good answer, but uses extra space. (See 16_Stacks.)
```

### APPROACH 2 — Optimal (two pointers from the BACK)   O(n + m) time, O(1) space

```
A backspace deletes the character BEFORE it, so reading forwards we don't know if a
character survives. Reading BACKWARDS we do: count '#'s as "pending skips", and every
normal character either gets skipped (skips > 0) or is a real, surviving character.
Walk both strings from the end simultaneously; each time both pointers land on a
surviving character, compare. If one string runs out before the other, false.

Dry run on s = "ab#c", t = "ad#c":
  i=3 'c' survives | j=3 'c' survives -> equal, i=2, j=2
  i=2 '#' skip=1, i=1 'b' skipped, skip=0, i=0 'a' survives
  j=2 '#' skip=1, j=1 'd' skipped, j=0 'a' survives -> equal
  i=-1, j=-1 -> both exhausted -> true
```

### Edge cases

```
- Both reduce to "" -> true
- More '#' than characters -> fine
- "a##c" vs "#a#c": both "c"
- Different lengths but same result
```

Full JavaScript solution with tests: [10_backspace_string_compare.js](../solutions/10_backspace_string_compare.js). Run it with `node 10_backspace_string_compare.js` from the solutions folder.

</details>

## Common mistakes

- Scanning from the left; backspaces affect earlier characters, so the O(1)-space version scans from the right.
- Letting the skip counter go negative when "#" appears at the start.
- Stopping when one string runs out without checking the other is also fully consumed.

## Related follow-ups

- [Valid Parentheses](../../../16_Stacks/03_Problems/01_Easy/01_valid_parentheses.md) — the stack approach to "undo" characters
- [Remove Element](04_remove_element.md) — write pointer compaction
- Removing Stars From a String (LeetCode #2390) — the same backspace idea

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
