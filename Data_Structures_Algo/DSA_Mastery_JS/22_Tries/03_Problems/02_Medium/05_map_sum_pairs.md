# Map Sum Pairs

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Medium |
| **Pattern** | values on nodes (prefix sums) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #677 — https://leetcode.com/problems/map-sum-pairs/ |
| **Solution file** | [05_map_sum_pairs.js](../solutions/05_map_sum_pairs.js) — open only after a real attempt |

## Problem

Design a class MapSum with:
  insert(key, val) - set key to val (overwrites an existing key)
  sum(prefix)      - sum of values of all keys that start with prefix

## Examples

```
insert("apple", 3); sum("ap") -> 3
insert("app", 2);   sum("ap") -> 5
insert("apple", 5); sum("ap") -> 7   Explanation: apple overwritten 3 -> 5
```

## Constraints & clarifying questions

```
- Can a key be inserted twice? (yes -> overwrite, NOT add)
- Values can be negative? (assume yes; the delta approach handles it)
- Lowercase only? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *values on nodes (prefix sums)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (Map + scan)   insert O(1), sum O(n * L). Keep a Map key -> value.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie with prefix sums stored on nodes)   O(L) per op. Each trie node stores `sum` = total value of all keys passing through it.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- sum of a prefix that does not exist -> 0
- sum("") -> total of all values
- overwrite with same value -> delta 0, nothing changes
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Map + scan)   insert O(1), sum O(n * L)

```
Keep a Map key -> value. sum loops over all keys and adds those with the prefix.
```

### APPROACH 2 — Optimal (Trie with prefix sums stored on nodes)   O(L) per op

```
Each trie node stores `sum` = total value of all keys passing through it.
On insert(key, val):
  delta = val - (old value of key, or 0)     <- handles overwrite
  walk the key's path and add delta to every node's sum
  remember the new value in a Map
sum(prefix): walk to the prefix node and return its sum (0 if path breaks).

Dry run: insert("apple",3): delta=3, nodes a,p,p,l,e all get +3
         insert("app",2):   delta=2, nodes a,p,p get +2  -> node 'p'(3rd) sum=5
         insert("apple",5): delta=5-3=2, a,p,p,l,e get +2 -> node 'p'(3rd) sum=7
         sum("ap") -> node at 'p'(2nd) = 7
```

### Edge cases

```
- sum of a prefix that does not exist -> 0
- sum("") -> total of all values
- overwrite with same value -> delta 0, nothing changes
```

Full JavaScript solution with tests: [05_map_sum_pairs.js](../solutions/05_map_sum_pairs.js). Run it with `node 05_map_sum_pairs.js` from the solutions folder.

</details>

## Common mistakes

- Adding the new value on top of the old one when a key is inserted again (use the difference).
- Summing by scanning all keys for each query.
- Storing the sum only at word ends instead of at every prefix node.

## Related follow-ups

- [Implement Trie](01_implement_trie.md)
- [Search Suggestions System](07_search_suggestions_system.md)
- [Range Sum of BST](../../../21_Binary_Search_Trees/03_Problems/01_Easy/03_range_sum_of_bst.md) (21_Binary_Search_Trees)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
