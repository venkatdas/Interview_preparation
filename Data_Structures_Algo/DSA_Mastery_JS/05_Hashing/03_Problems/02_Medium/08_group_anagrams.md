# Group Anagrams

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Medium |
| **Pattern** | group by canonical key |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #49 — https://leetcode.com/problems/group-anagrams/ |
| **Solution file** | [08_group_anagrams.js](../solutions/08_group_anagrams.js) — open only after a real attempt |

## Problem

Given an array of strings, group the anagrams together. Return the groups in any order.

## Examples

```
Input: ["eat","tea","tan","ate","nat","bat"]
Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
Input: [""]     Output: [[""]]
Input: ["a"]    Output: [["a"]]
```

## Constraints & clarifying questions

```
- Lowercase letters only? (yes -> enables the 26-count key)
- Does group order or order inside a group matter? (no)
- Max word length? (short words -> sorting is fine; long words -> counting key is better)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *group by canonical key* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2 * L) time, O(n) space. For each word, compare it against the representative of every existing group using an "is anagram" check (count letters).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (group by canonical key)   O(n * L log L) time, O(n * L) space. Anagrams become IDENTICAL once you sort their letters: "eat","tea","ate" -> "aet".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Empty string is a valid word: [""] -> [[""]]
- All words identical -> one group
- No anagrams at all -> every word its own group
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 * L) time, O(n) space

```
For each word, compare it against the representative of every existing group using
an "is anagram" check (count letters). n groups in the worst case -> O(n^2 * L).
```

### APPROACH 2 — Optimal (group by canonical key)   O(n * L log L) time, O(n * L) space

```
Anagrams become IDENTICAL once you sort their letters: "eat","tea","ate" -> "aet".
That sorted string is the canonical key. Map key -> list of words.

Even better key, O(n * L): count the 26 letters and join the counts with a separator:
"eat" -> "1#0#0#0#1#...#1#..." (a 26-slot fingerprint). No sorting needed.

Dry run on ["eat","tea","tan","ate","nat","bat"] with sorted keys:
  eat -> aet : {aet:[eat]}
  tea -> aet : {aet:[eat,tea]}
  tan -> ant : {aet:[eat,tea], ant:[tan]}
  ate -> aet : {aet:[eat,tea,ate], ant:[tan]}
  nat -> ant : {aet:[...], ant:[tan,nat]}
  bat -> abt : {aet:[...], ant:[...], abt:[bat]}
  return the map's values
```

### Edge cases

```
- Empty string is a valid word: [""] -> [[""]]
- All words identical -> one group
- No anagrams at all -> every word its own group
```

Full JavaScript solution with tests: [08_group_anagrams.js](../solutions/08_group_anagrams.js). Run it with `node 08_group_anagrams.js` from the solutions folder.

</details>

## Common mistakes

- Using an array as a Map key; arrays compare by reference, so every key is unique.
- Building a count key without a separator, so different counts collide.
- Returning groups in a required order when any order is accepted (no need to sort the output).

## Related follow-ups

- [Group Anagrams (Strings)](../../../04_Strings/03_Problems/02_Medium/08_group_anagrams.md) — the same problem in the strings topic
- [Valid Anagram](../01_Easy/03_valid_anagram.md) — the pairwise check
- [Isomorphic Strings](../01_Easy/05_isomorphic_strings.md) — another canonical-form idea

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
