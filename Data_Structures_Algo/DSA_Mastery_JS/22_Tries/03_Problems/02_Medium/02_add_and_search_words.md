# Design Add and Search Words Data Structure

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Medium |
| **Pattern** | trie + wildcard DFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #211 — https://leetcode.com/problems/design-add-and-search-words-data-structure/ |
| **Solution file** | [02_add_and_search_words.js](../solutions/02_add_and_search_words.js) — open only after a real attempt |

## Problem

Design a class WordDictionary with:
  addWord(word)
  search(word) - word may contain '.', which matches ANY single letter.

## Examples

```
addWord("bad"), addWord("dad"), addWord("mad")
search("pad") -> false
search("bad") -> true
search(".ad") -> true    Explanation: '.' matches b, d or m
search("b..") -> true
search("b.")  -> false   Explanation: lengths differ
```

## Constraints & clarifying questions

```
- Can addWord contain '.'? (no, only search does)
- Max word length? (LeetCode: 25 — so backtracking depth is tiny)
- How many dots per query? (at most 2 on LeetCode, but solution handles any)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *trie + wildcard DFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (list + regex-like compare)   search O(n * L). Store words in an array.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie + DFS backtracking on '.')   O(L) normal, O(26^dots * L) worst. Build a normal trie.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "...." longer than all words -> false (path runs out)
- "." with only empty structure -> false
- query is exactly a prefix -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (list + regex-like compare)   search O(n * L)

```
Store words in an array. For each stored word of the same length, compare
char by char treating '.' as a wildcard.
```

### APPROACH 2 — Optimal (Trie + DFS backtracking on '.')   O(L) normal, O(26^dots * L) worst

```
Build a normal trie. search is recursive:
  - if char is a letter, follow that one child
  - if char is '.', try EVERY child; succeed if any branch succeeds
  - at the end of the word, the node must be isEnd

Dry run: search(".ad") on trie with bad, dad, mad
  root has children b, d, m. '.' -> try each:
    b -> 'a' exists -> 'd' exists, isEnd -> true (stop, found)

Dry run: search("b.")
  root -b-> (b). '.' -> try child 'a' -> end of query, (a).isEnd = false -> false
  no more children -> false
```

### Edge cases

```
- "...." longer than all words -> false (path runs out)
- "." with only empty structure -> false
- query is exactly a prefix -> false
```

Full JavaScript solution with tests: [02_add_and_search_words.js](../solutions/02_add_and_search_words.js). Run it with `node 02_add_and_search_words.js` from the solutions folder.

</details>

## Common mistakes

- Returning after trying only the first child for `.`.
- Base case returns `true` at the end of the pattern instead of `node.isEnd`.
- Scanning every stored word per query (O(n·L)).

## Related follow-ups

- [Implement Trie](01_implement_trie.md)
- [Word Search II](../03_Hard/10_word_search_ii.md)
- Regular Expression Matching (LeetCode #10)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
