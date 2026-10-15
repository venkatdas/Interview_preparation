# Longest Word in Dictionary

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Medium |
| **Pattern** | DFS through end flags |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #720 — https://leetcode.com/problems/longest-word-in-dictionary/ |
| **Solution file** | [03_longest_word_in_dictionary.js](../solutions/03_longest_word_in_dictionary.js) — open only after a real attempt |

## Problem

Given an array of words, return the longest word that can be built one
character at a time by other words in the array (every prefix must also be a
word). If there is a tie, return the lexicographically smallest. If none, "".

## Examples

```
Input: ["w","wo","wor","worl","world"]  Output: "world"
Input: ["a","banana","app","appl","ap","apply","apple"]  Output: "apple"
  Explanation: "apple" and "apply" both buildable; "apple" is smaller.
Input: ["b","br","bre","brea"]  Output: "brea"
```

## Constraints & clarifying questions

```
- Lowercase only? (yes)
- Must the single-letter word itself be in the list? (yes: every prefix including length 1)
- Duplicates in input? (possible; harmless)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS through end flags* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (set + check all prefixes)   O(n * L^2) time, O(n*L) space. Put all words in a Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie + DFS through isEnd nodes only)   O(total chars) time & space. Insert every word.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no single-letter word at all -> ""
- all words same length 1 -> smallest letter
- empty input -> ""
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (set + check all prefixes)   O(n * L^2) time, O(n*L) space

```
Put all words in a Set. For each word, check every prefix is in the set.
Keep the best (longer, or equal length and smaller). Each prefix check builds
a substring, hence L^2 per word.
```

### APPROACH 2 — Optimal (Trie + DFS through isEnd nodes only)   O(total chars) time & space

```
Insert every word. Then DFS from the root but ONLY step into children that are
isEnd (a node that is not a word breaks the chain). Visit children in sorted
order so the first word of max length we see is the lexicographically smallest.

Dry run on ["a","ap","app","apple","b"]:
  root -> 'a'(end) ok, depth 1, best="a"
    -> 'p'(end) ok, best="ap"
      -> 'p'(end) ok, best="app"
        -> 'l'(NOT end) -> stop, never reach "apple"
  root -> 'b'(end), length 1 < 3, ignore
  answer "app"
```

### Edge cases

```
- no single-letter word at all -> ""
- all words same length 1 -> smallest letter
- empty input -> ""
```

Full JavaScript solution with tests: [03_longest_word_in_dictionary.js](../solutions/03_longest_word_in_dictionary.js). Run it with `node 03_longest_word_in_dictionary.js` from the solutions folder.

</details>

## Common mistakes

- Not requiring every prefix of the answer to be a word.
- Tie-breaking by length but forgetting the lexicographically smallest rule.
- Sorting by length only, so equal-length ties come out in the wrong order.

## Related follow-ups

- [Implement Trie](01_implement_trie.md)
- [Replace Words](04_replace_words.md)
- Longest Word With All Prefixes (LeetCode #1858)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
