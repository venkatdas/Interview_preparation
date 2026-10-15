# Valid Anagram

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Easy |
| **Pattern** | frequency count |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #242 — https://leetcode.com/problems/valid-anagram/ |
| **Solution file** | [03_valid_anagram.js](../solutions/03_valid_anagram.js) — open only after a real attempt |

## Problem

Given two strings s and t, return true if t is an anagram of s: the same letters
with the same counts, in any order.

## Examples

```
Input: s = "anagram", t = "nagaram"   Output: true
Input: s = "rat", t = "car"           Output: false   Explanation: 'r','a' match but 't' vs 'c'
Input: s = "a", t = "ab"              Output: false   Explanation: different lengths
```

## Constraints & clarifying questions

```
- Only lowercase English letters? (if yes, a 26-slot array works; a Map handles Unicode)
- Is case significant? Are spaces counted? (assume yes, exact characters)
- Empty strings? ("" and "" -> true)
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

**Start simple.** APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space. Sort both strings and compare.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (frequency count with one Map)   O(n) time, O(k) space. (k = number of distinct characters, at most 26 for lowercase letters) 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Different lengths -> false (fast exit, avoids a full count)
- Same letters different counts: "aab" vs "abb" -> false
- Empty strings -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space

```
Sort both strings and compare. Simple, but sorting is slower than counting.
```

### APPROACH 2 — Optimal (frequency count with one Map)   O(n) time, O(k) space

```
(k = number of distinct characters, at most 26 for lowercase letters)
  1. Different lengths -> false immediately.
  2. Walk s and increment counts; walk t and decrement counts.
  3. If any count ever goes below zero, t has a letter s doesn't -> false.
  Lengths are equal, so if nothing went negative, nothing is positive either.

Dry run on s = "rat", t = "car":
  count s: {r:1, a:1, t:1}
  t: 'c' -> count becomes -1 -> false

Dry run on s = "ab", t = "ba":
  count s: {a:1, b:1}
  t: 'b' -> {a:1, b:0}; 'a' -> {a:0, b:0}; never negative -> true
```

### Edge cases

```
- Different lengths -> false (fast exit, avoids a full count)
- Same letters different counts: "aab" vs "abb" -> false
- Empty strings -> true
```

Full JavaScript solution with tests: [03_valid_anagram.js](../solutions/03_valid_anagram.js). Run it with `node 03_valid_anagram.js` from the solutions folder.

</details>

## Common mistakes

- Skipping the length check, so a shorter string passes the decrement test.
- Using a plain object with `obj[c]--` on a missing key, which yields NaN instead of -1.
- Assuming 26 lowercase letters when the follow-up asks about Unicode; switch to a Map.

## Related follow-ups

- [Valid Anagram (Strings)](../../../04_Strings/03_Problems/01_Easy/03_valid_anagram.md) — the same problem in the strings topic
- [Group Anagrams](../02_Medium/08_group_anagrams.md) — anagram signatures as map keys
- [Find All Anagrams in a String](../02_Medium/13_find_all_anagrams.md) — counts inside a sliding window

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
