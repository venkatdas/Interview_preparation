# Group Anagrams

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | canonical key + Map |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #49 — https://leetcode.com/problems/group-anagrams/ |
| **Solution file** | [08_group_anagrams.js](../solutions/08_group_anagrams.js) — open only after a real attempt |

## Problem

Given an array of strings, group the anagrams together. Return the groups in any order;
each group's words can be in any order.

## Examples

```
Input: ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
Input: [""]     Output: [[""]]
Input: ["a"]    Output: [["a"]]
```

## Constraints & clarifying questions

```
- Only lowercase letters? (yes -> can use a 26-count key)
- Does the order of groups / words matter? (no)
- How long are the words? (short -> sorting them is cheap; the count key is still better)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *canonical key + Map* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2 * k) time, O(n) space   (n words, k = max word length). For each word not yet grouped, compare it with every later word using an isAnagram check (O(k) with a frequency table), collecting matches into a group.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (canonical key + hash map)   O(n * k) time, O(n * k) space. Two words are anagrams exactly when they have the same letter counts.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [""]         -> [[""]]   (empty word has a key too: all zeros)
- ["a"]        -> [["a"]]
- duplicates ["ab","ab"] -> both in the same group
- why join with ',' and not ''? "1,11" vs "11,1" would collide as "111" without a separator
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 * k) time, O(n) space   (n words, k = max word length)

```
For each word not yet grouped, compare it with every later word using an isAnagram check
(O(k) with a frequency table), collecting matches into a group.
```

### APPROACH 2 — Optimal (canonical key + hash map)   O(n * k) time, O(n * k) space

```
Two words are anagrams exactly when they have the same letter counts. So build a KEY
from the counts: an array of 26 counts joined with a separator, e.g. "1,0,0,...,1,...".
All anagrams produce the same key -> they land in the same Map bucket.
(Alternative key: the sorted word, O(n * k log k). Fine too, slightly slower.)

Dry run on ["eat","tea","tan"]:
  "eat" -> counts a:1 e:1 t:1 -> key K1 -> Map{K1:["eat"]}
  "tea" -> same counts -> key K1 -> Map{K1:["eat","tea"]}
  "tan" -> a:1 n:1 t:1 -> key K2 -> Map{K1:[...], K2:["tan"]}
  return [["eat","tea"],["tan"]]
```

### Edge cases

```
- [""]         -> [[""]]   (empty word has a key too: all zeros)
- ["a"]        -> [["a"]]
- duplicates ["ab","ab"] -> both in the same group
- why join with ',' and not ''? "1,11" vs "11,1" would collide as "111" without a separator
```

Full JavaScript solution with tests: [08_group_anagrams.js](../solutions/08_group_anagrams.js). Run it with `node 08_group_anagrams.js` from the solutions folder.

</details>

## Common mistakes

- Using an array of counts directly as a Map key; arrays are compared by reference, so join it into a string first.
- Joining counts without a separator ("1,11" vs "11,1" collide when written as "111").
- Forgetting the empty string is a valid input and forms its own group.

## Related follow-ups

- [Group Anagrams (Hashing)](../../../05_Hashing/03_Problems/02_Medium/08_group_anagrams.md) — the same idea, hashing focus
- [Valid Anagram](../01_Easy/03_valid_anagram.md) — the pairwise check
- Group Shifted Strings (LeetCode #249) — a different canonical key

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
