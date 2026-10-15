# Valid Anagram

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Easy |
| **Pattern** | frequency table |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #242 — https://leetcode.com/problems/valid-anagram/ |
| **Solution file** | [03_valid_anagram.js](../solutions/03_valid_anagram.js) — open only after a real attempt |

## Problem

Given two strings s and t, return true if t is an anagram of s: the same letters with
the same counts, in any order.

## Examples

```
Input: s = "anagram", t = "nagaram"   Output: true
Input: s = "rat", t = "car"           Output: false   Explanation: 'r','a' match but 't' vs 'c'
```

## Constraints & clarifying questions

```
- Only lowercase English letters? (yes on LeetCode -> 26-slot array works)
- Follow-up: what if inputs contain Unicode? (switch the array to a Map)
- Different lengths? (can never be anagrams -> early return)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *frequency table* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) time, O(n) space. Sort both strings and compare.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (frequency table)   O(n) time, O(1) space. One array of 26 counters.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" and ""            -> true
- "a" and "ab"         -> false (length check)
- "aa" and "a" style duplicates: counts handle it, sets would not
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) time, O(n) space

```
Sort both strings and compare. Anagrams sort to the identical string.
s.split('').sort().join('') === t.split('').sort().join('')
```

### APPROACH 2 — Optimal (frequency table)   O(n) time, O(1) space

```
One array of 26 counters. For each index i: add 1 for s[i], subtract 1 for t[i].
If every counter is 0 at the end, every letter appeared equally often in both.
Space is O(1) because 26 does not grow with n.

Dry run on s="rat", t="car":
  i=0: counts[r]++ counts[c]--   -> r:1 c:-1
  i=1: counts[a]++ counts[a]--   -> a:0
  i=2: counts[t]++ counts[r]--   -> t:1 r:0
  c:-1 and t:1 are non-zero -> false
```

### Edge cases

```
- "" and ""            -> true
- "a" and "ab"         -> false (length check)
- "aa" and "a" style duplicates: counts handle it, sets would not
```

Full JavaScript solution with tests: [03_valid_anagram.js](../solutions/03_valid_anagram.js). Run it with `node 03_valid_anagram.js` from the solutions folder.

</details>

## Common mistakes

- Not checking lengths first; "ab" and "abb" share letters but are not anagrams.
- Sorting with `s.split("").sort().join("")` is fine but O(n log n); say so when asked for the optimal.
- Assuming lowercase only without asking; Unicode input needs a Map instead of a 26-slot array.

## Related follow-ups

- [Valid Anagram (Hashing)](../../../05_Hashing/03_Problems/01_Easy/03_valid_anagram.md) — the same problem from the hashing angle
- [Group Anagrams](../02_Medium/08_group_anagrams.md) — group many strings by their letter signature
- [Find All Anagrams in a String](../../../07_Sliding_Window/03_Problems/02_Medium/07_find_all_anagrams.md) — anagram check inside a sliding window

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
