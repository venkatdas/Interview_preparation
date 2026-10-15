# Ransom Note

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Easy |
| **Pattern** | frequency count |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #383 — https://leetcode.com/problems/ransom-note/ |
| **Solution file** | [04_ransom_note.js](../solutions/04_ransom_note.js) — open only after a real attempt |

## Problem

Given two strings ransomNote and magazine, return true if ransomNote can be built
using letters from magazine. Each letter in magazine can be used only once.

## Examples

```
Input: ransomNote = "a", magazine = "b"     Output: false
Input: ransomNote = "aa", magazine = "ab"   Output: false   Explanation: only one 'a' available
Input: ransomNote = "aa", magazine = "aab"  Output: true
```

## Constraints & clarifying questions

```
- Only lowercase letters? (assume yes; a Map works for anything)
- Can ransomNote be empty? (yes -> true, nothing to build)
- Is magazine allowed to have leftover letters? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *frequency count* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * m) time, O(m) space. For every letter in the note, search the magazine for it and remove the first match.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (frequency count)   O(n + m) time, O(k) space. Count every letter in magazine once.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- note longer than magazine -> false without counting
- empty note -> true
- note has a letter magazine lacks entirely -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * m) time, O(m) space

```
For every letter in the note, search the magazine for it and remove the first match.
Each search+remove is O(m).
```

### APPROACH 2 — Optimal (frequency count)   O(n + m) time, O(k) space

```
Count every letter in magazine once. Then walk the note and "spend" letters:
if the count for a letter is already 0 (or missing), we can't build it -> false.
Quick exit: if the note is longer than the magazine it's impossible.

Dry run on note = "aa", magazine = "aab":
  counts = {a:2, b:1}
  'a' -> a:1   'a' -> a:0   done -> true
Dry run on note = "aa", magazine = "ab":
  counts = {a:1, b:1}
  'a' -> a:0   'a' -> count is 0 -> false
```

### Edge cases

```
- note longer than magazine -> false without counting
- empty note -> true
- note has a letter magazine lacks entirely -> false
```

Full JavaScript solution with tests: [04_ransom_note.js](../solutions/04_ransom_note.js). Run it with `node 04_ransom_note.js` from the solutions folder.

</details>

## Common mistakes

- Counting the ransom note and comparing against the magazine in the wrong direction (every note letter must be covered by the magazine).
- Using `includes` and `replace` per character, which is O(n·m).
- Not decrementing counts, so one magazine letter is reused many times.

## Related follow-ups

- [Valid Anagram](03_valid_anagram.md) — exact count equality instead of coverage
- [First Unique Character in a String](../../../04_Strings/03_Problems/01_Easy/04_first_unique_character.md) — count, then scan
- [Minimum Window Substring](../../../07_Sliding_Window/03_Problems/03_Hard/14_minimum_window_substring.md) — coverage of counts inside a window

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
