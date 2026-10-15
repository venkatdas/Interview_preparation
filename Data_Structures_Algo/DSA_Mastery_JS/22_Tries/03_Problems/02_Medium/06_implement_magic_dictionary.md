# Implement Magic Dictionary

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Medium |
| **Pattern** | DFS with edit budget |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #676 — https://leetcode.com/problems/implement-magic-dictionary/ |
| **Solution file** | [06_implement_magic_dictionary.js](../solutions/06_implement_magic_dictionary.js) — open only after a real attempt |

## Problem

Design a class MagicDictionary:
  buildDict(words)    - store a list of distinct words
  search(searchWord)  - true if you can change EXACTLY ONE letter of
                        searchWord to get a word in the dictionary.

## Examples

```
buildDict(["hello","leetcode"])
search("hello")   -> false  Explanation: must change exactly one letter
search("hhllo")   -> true   Explanation: hhllo -> hello
search("hell")    -> false  Explanation: lengths differ
search("leetcoded") -> false
```

## Constraints & clarifying questions

```
- Exactly one change, not zero and not two? (exactly one)
- Lowercase only? (yes)
- Is the dictionary built once? (yes, then many searches)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS with edit budget* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * L) per search. For every dictionary word with the same length, count differing positions; true if some word differs in exactly 1 position.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie + DFS with a "changes left" budget)   O(26 * L) worst per search. Build a trie.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- word exactly in dictionary -> false (zero changes)
- different length -> false
- empty dictionary -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * L) per search

```
For every dictionary word with the same length, count differing positions;
true if some word differs in exactly 1 position.
```

### APPROACH 2 — Optimal (Trie + DFS with a "changes left" budget)   O(26 * L) worst per search

```
Build a trie. DFS(node, index, changesLeft):
  - at the end: return node.isEnd && changesLeft === 0
  - take the exact child (no change used)
  - OR, if changesLeft is 1, take any OTHER child and set changesLeft to 0
The budget means we branch at most once, so cost is about 26 * L, not 26^L.

Dry run: search("hhllo") with "hello":
  h: exact child 'h' -> index 1
  h: no child 'h' under (h)... other child 'e' exists -> use change, budget 0
  l, l, o: exact children exist -> end, isEnd and budget 0 -> true
```

### Edge cases

```
- word exactly in dictionary -> false (zero changes)
- different length -> false
- empty dictionary -> false
```

Full JavaScript solution with tests: [06_implement_magic_dictionary.js](../solutions/06_implement_magic_dictionary.js). Run it with `node 06_implement_magic_dictionary.js` from the solutions folder.

</details>

## Common mistakes

- Accepting a word that matches exactly (exactly one character must differ).
- Accepting words with a different length.
- Allowing more than one change during the DFS.

## Related follow-ups

- [Design Add and Search Words Data Structure](02_add_and_search_words.md)
- [Word Ladder](../../../24_Graph_Traversal/03_Problems/03_Hard/18_word_ladder.md) (24_Graph_Traversal)
- [Hamming Distance](../../../14_Bit_Manipulation/03_Problems/01_Easy/05_hamming_distance.md) (14_Bit_Manipulation)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
