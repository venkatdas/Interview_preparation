# Word Pattern

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Easy |
| **Pattern** | two-way mapping |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #290 — https://leetcode.com/problems/word-pattern/ |
| **Solution file** | [06_word_pattern.js](../solutions/06_word_pattern.js) — open only after a real attempt |

## Problem

Given a pattern (a string of letters) and a sentence s (words separated by single
spaces), return true if s follows the pattern: there is a one-to-one mapping between
letters in pattern and words in s.

## Examples

```
Input: pattern = "abba", s = "dog cat cat dog"    Output: true    Explanation: a->dog, b->cat
Input: pattern = "abba", s = "dog cat cat fish"   Output: false   Explanation: a->dog then a->fish
Input: pattern = "aaaa", s = "dog cat cat dog"    Output: false
Input: pattern = "abba", s = "dog dog dog dog"    Output: false   Explanation: a and b both map to dog
```

## Constraints & clarifying questions

```
- Words separated by exactly one space? (yes)
- Different number of words than letters? (then false)
- Case sensitive? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two-way mapping* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (shape fingerprint)   O(n^2) time, O(n) space. Build the "first occurrence index" shape of the pattern letters and of the word list and compare them.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two maps)   O(n) time, O(n) space. This is Isomorphic Strings where one side is words instead of characters.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Word count != pattern length -> false ("aaa" vs "dog dog")
- Single letter / single word -> true
- Two letters mapping to the same word -> false (needs the reverse map)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (shape fingerprint)   O(n^2) time, O(n) space

```
Build the "first occurrence index" shape of the pattern letters and of the word list
and compare them. Same idea as Isomorphic Strings, but over words.
```

### APPROACH 2 — Optimal (two maps)   O(n) time, O(n) space

```
This is Isomorphic Strings where one side is words instead of characters.
Split s into words. If counts differ -> false. Then walk both lists with
letterToWord and wordToLetter maps, rejecting any conflict in either direction.

Dry run on "abba" / "dog cat cat dog":
  a/dog: new both ways
  b/cat: new both ways
  b/cat: letterToWord[b] = cat ok, wordToLetter[cat] = b ok
  a/dog: ok, ok -> true
```

### Edge cases

```
- Word count != pattern length -> false ("aaa" vs "dog dog")
- Single letter / single word -> true
- Two letters mapping to the same word -> false (needs the reverse map)
```

Full JavaScript solution with tests: [06_word_pattern.js](../solutions/06_word_pattern.js). Run it with `node 06_word_pattern.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to check that the number of words equals the pattern length.
- Checking only pattern→word and missing two letters mapped to the same word.
- Storing words in a plain object where a word like "constructor" collides with built-in properties; use a Map.

## Related follow-ups

- [Isomorphic Strings](05_isomorphic_strings.md) — the character-to-character version
- Word Pattern II (LeetCode #291) — no spaces, needs backtracking
- [Group Anagrams](../02_Medium/08_group_anagrams.md) — mapping strings to keys

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
