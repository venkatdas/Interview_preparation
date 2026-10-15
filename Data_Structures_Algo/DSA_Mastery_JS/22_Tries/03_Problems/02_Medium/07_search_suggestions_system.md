# Search Suggestions System

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Medium |
| **Pattern** | autocomplete, sorted DFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1268 — https://leetcode.com/problems/search-suggestions-system/ |
| **Solution file** | [07_search_suggestions_system.js](../solutions/07_search_suggestions_system.js) — open only after a real attempt |

## Problem

Given a list of products and a searchWord, after typing each character of
searchWord return up to 3 product names that start with the typed prefix,
in lexicographic order. Return an array of these lists (one per character).

## Examples

```
products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"
Output: [
  ["mobile","moneypot","monitor"],   // "m"
  ["mobile","moneypot","monitor"],   // "mo"
  ["mouse","mousepad"],              // "mou"
  ["mouse","mousepad"],              // "mous"
  ["mouse","mousepad"]               // "mouse"
]
```

## Constraints & clarifying questions

```
- Lowercase only? (yes)
- Fewer than 3 matches -> return what exists (possibly empty list).
- Duplicates in products? (assume unique)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *autocomplete, sorted DFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(L * n * L) time. Sort products.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie + DFS with early stop)   O(total chars) build, O(L * (L + 3)) query. Insert all products.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- searchWord has no matching products at all -> array of empty lists
- a product equals a prefix -> it is included (node.isEnd checked first)
- exactly 3 matches / more than 3 -> capped at 3
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(L * n * L) time

```
Sort products. For each prefix, filter products that start with it, take 3.
```

### APPROACH 2 — Optimal (Trie + DFS with early stop)   O(total chars) build, O(L * (L + 3)) query

```
Insert all products. Walk the trie one char of searchWord at a time; at each
node run a DFS that visits children in SORTED order and stops as soon as 3
words are collected. Once the path breaks, every later answer is [].
(Alternative optimal: sort + binary search for the prefix's lower bound.)

Dry run: "mou" -> walk m,o,u to node (u). DFS sorted: s -> e(end) "mouse",
  e -> p -> a -> d(end) "mousepad". Only 2 found -> ["mouse","mousepad"].
```

### Edge cases

```
- searchWord has no matching products at all -> array of empty lists
- a product equals a prefix -> it is included (node.isEnd checked first)
- exactly 3 matches / more than 3 -> capped at 3
```

Full JavaScript solution with tests: [07_search_suggestions_system.js](../solutions/07_search_suggestions_system.js). Run it with `node 07_search_suggestions_system.js` from the solutions folder.

</details>

## Common mistakes

- Returning suggestions in insertion order instead of lexicographic order.
- Continuing to search after the prefix has no matches (all later lists must be empty).
- Returning more than 3 suggestions.

## Related follow-ups

- [Implement Trie](01_implement_trie.md)
- [Top K Frequent Words](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/06_top_k_frequent_words.md) (19_Heaps_And_Priority_Queues)
- Design Search Autocomplete System (LeetCode #642)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
