# First Unique Character in a String

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Easy |
| **Pattern** | frequency table, two passes |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #387 — https://leetcode.com/problems/first-unique-character-in-a-string/ |
| **Solution file** | [04_first_unique_character.js](../solutions/04_first_unique_character.js) — open only after a real attempt |

## Problem

Given a string s, return the index of the first character that appears exactly once.
If there is no such character, return -1.

## Examples

```
Input: "leetcode"       Output: 0   Explanation: 'l' appears once
Input: "loveleetcode"   Output: 2   Explanation: 'l' and 'o' repeat, 'v' is the first unique
Input: "aabb"           Output: -1
```

## Constraints & clarifying questions

```
- Only lowercase letters? (yes -> 26-slot array)
- Return the index or the character? (index)
- Empty string? (return -1)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *frequency table, two passes* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each index i, scan the whole string to see if s[i] appears anywhere else.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (frequency table, two passes)   O(n) time, O(1) space. Pass 1: count every character.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""        -> -1
- "z"       -> 0
- all same  -> -1
- unique char is the last one -> still found by pass 2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each index i, scan the whole string to see if s[i] appears anywhere else.
The first i with no other occurrence is the answer.
```

### APPROACH 2 — Optimal (frequency table, two passes)   O(n) time, O(1) space

```
Pass 1: count every character. Pass 2: walk left to right and return the first index
whose character has count 1. The second pass guarantees "first" in string order.

Dry run on "loveleetcode":
  counts: l:2 o:2 v:1 e:4 t:1 c:1 d:1
  pass 2: i=0 'l' count 2, i=1 'o' count 2, i=2 'v' count 1 -> return 2
```

### Edge cases

```
- ""        -> -1
- "z"       -> 0
- all same  -> -1
- unique char is the last one -> still found by pass 2
```

Full JavaScript solution with tests: [04_first_unique_character.js](../solutions/04_first_unique_character.js). Run it with `node 04_first_unique_character.js` from the solutions folder.

</details>

## Common mistakes

- Finding the answer by scanning a plain object of counts; object key order is not guaranteed to match string order, so re-walk the string instead.
- Using `indexOf === lastIndexOf` per character, which is O(n^2).
- Returning the character instead of its index, or forgetting -1 when none exists.

## Related follow-ups

- [Ransom Note](../../../05_Hashing/03_Problems/01_Easy/04_ransom_note.md) — another count-then-check problem
- [Valid Anagram](03_valid_anagram.md) — character frequency counting
- First Unique Number (LeetCode #1429) — the streaming version with a queue and a map

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
