# Implement Trie

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Medium |
| **Pattern** | core trie |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #208 — https://leetcode.com/problems/implement-trie-prefix-tree/ |
| **Solution file** | [01_implement_trie.js](../solutions/01_implement_trie.js) — open only after a real attempt |

## Problem

Design a class Trie with three methods:
  insert(word)       - add a word
  search(word)       - true if exactly this word was inserted
  startsWith(prefix) - true if some inserted word starts with prefix

## Examples

```
insert("apple"); search("apple") -> true; search("app") -> false;
startsWith("app") -> true; insert("app"); search("app") -> true
```

## Constraints & clarifying questions

```
- Only lowercase a-z? (yes on LeetCode; a Map handles any alphabet anyway)
- Can the same word be inserted twice? (yes, it is a no-op)
- Empty string? (startsWith("") is true; search("") is false unless inserted)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *core trie* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (array of words)   insert O(1), search O(n), startsWith O(n*L). Keep all words in an array.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie)   O(L) per operation, O(total characters) space. Each node has a Map of children and an isEnd flag.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- search a prefix of an inserted word -> false (isEnd flag matters)
- search a longer word than any inserted -> false (path breaks)
- insert same word twice -> still works
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (array of words)   insert O(1), search O(n), startsWith O(n*L)

```
Keep all words in an array. search = includes, startsWith = loop and check
each word's prefix. Works, but every query scans the whole dictionary.
```

### APPROACH 2 — Optimal (Trie)   O(L) per operation, O(total characters) space

```
Each node has a Map of children and an isEnd flag.
  insert: walk char by char, create missing nodes, mark the last node isEnd.
  search: walk; if a char is missing -> false; at the end return isEnd.
  startsWith: walk; return true if we never fell off the path.

Dry run: insert("app"), insert("apple")
  root -a-> (a) -p-> (p) -p-> (p, isEnd)
                                 -l-> (l) -e-> (e, isEnd)
  search("app")   : a,p,p exist, node.isEnd = true  -> true
  search("ap")    : a,p exist, node.isEnd = false    -> false
  startsWith("ap"): a,p exist                        -> true
  search("apx")   : 'x' missing under (p)            -> false
```

### Edge cases

```
- search a prefix of an inserted word -> false (isEnd flag matters)
- search a longer word than any inserted -> false (path breaks)
- insert same word twice -> still works
```

Full JavaScript solution with tests: [01_implement_trie.js](../solutions/01_implement_trie.js). Run it with `node 01_implement_trie.js` from the solutions folder.

</details>

## Common mistakes

- Returning `true` from `search` when only a prefix exists (forgetting `isEnd`).
- Creating a new node even when the child already exists, wiping earlier words.
- Using a plain object for children and colliding with built-in keys like `constructor`; prefer `Map`.

## Related follow-ups

- [Design Add and Search Words Data Structure](02_add_and_search_words.md)
- [Map Sum Pairs](05_map_sum_pairs.md)
- [Search Suggestions System](07_search_suggestions_system.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
