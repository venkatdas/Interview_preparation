# Anagram Pair Count

| | |
|---|---|
| **Set** | [Mixed Set 01](README.md) — problem 03 of 5 |
| **Difficulty** | Easy |
| **Time box** | 15 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [03_anagram_pair_count.js](solutions/03_anagram_pair_count.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A word game shows a list of words. Two positions i < j form a "twin pair" if
words[i] and words[j] are anagrams of each other (same letters, same counts; equal
words also count). Return the number of twin pairs.

## Examples

```
Input: ["listen", "silent", "enlist", "google"]   Output: 3   Explanation: 3 words in one group -> 3 pairs
Input: ["ab", "ba", "ab"]                          Output: 3
Input: ["a", "b"]                                  Output: 0
```

## Constraints & clarifying questions

```
- Lowercase English letters only? (yes) Can words be empty? (yes; two empty words are twins)
- Up to 10^5 words, each up to 100 letters, so comparing all pairs is too slow.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 15 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Canonical key + hash map + counting pairs. See [Hashing](../../../05_Hashing/README.md) and [Strings](../../../04_Strings/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: compare every pair of words after sorting their letters.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Words in the same anagram group share a key. A new word pairs with every earlier word that had the same key, so add the current count before incrementing it.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty list or one word  -> 0
- duplicate identical words count as anagrams
- empty strings: all have the same key
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 * k log k) time, O(k) space

```
For every pair (i, j) sort both words and compare.
```

### APPROACH 2 — Optimal (canonical key + hash map + counting pairs)   O(n * k) time, O(n * k) space

```
Turn each word into a canonical key: a 26-slot letter count joined with '#'.
Group sizes come from a Map key -> count. While scanning, a word with key K pairs
with every earlier word that has key K, so add map.get(K) before incrementing.
(Equivalent: sum c*(c-1)/2 over all groups.)

Dry run on ["ab", "ba", "ab"]:
  "ab" key=1#1#0...  seen 0 -> +0  map{K:1}  total=0
  "ba" key=1#1#0...  seen 1 -> +1  map{K:2}  total=1
  "ab" key=1#1#0...  seen 2 -> +2  map{K:3}  total=3
  answer 3
```

### Edge cases

```
- empty list or one word  -> 0
- duplicate identical words count as anagrams
- empty strings: all have the same key
```

### Common mistakes

```
- Joining counts without a separator: [1,11] and [11,1] both become "111".
- Counting groups instead of pairs (a group of 3 gives 3 pairs, not 1 or 2).
```

Full JavaScript solution with tests: [03_anagram_pair_count.js](solutions/03_anagram_pair_count.js). Run it with `node solutions/03_anagram_pair_count.js` from this folder.

</details>

## Related follow-ups

- Return the groups themselves (LeetCode #49)
- Count pairs that differ by exactly one letter after sorting
- Unicode words: which key still works?

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
