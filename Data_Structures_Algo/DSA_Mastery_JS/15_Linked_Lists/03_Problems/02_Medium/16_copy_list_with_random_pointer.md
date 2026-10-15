# Copy List with Random Pointer

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | Map / interleave |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #138 — https://leetcode.com/problems/copy-list-with-random-pointer/ |
| **Solution file** | [16_copy_list_with_random_pointer.js](../solutions/16_copy_list_with_random_pointer.js) — open only after a real attempt |

## Problem

Each node has a `next` pointer and a `random` pointer that may point to ANY
node in the list (or null). Make a deep copy: brand-new nodes, where every
copied node's next/random point to the corresponding COPIED nodes.

## Examples

```
Input:  [[7,null],[13,0],[11,4],[10,2],[1,0]]   (value, index that random points to)
Output: a new list with the same shape
```

## Constraints & clarifying questions

```
- Can random point to the node itself? (yes)
- Must the original list stay untouched after the call? (yes - restore it)
- O(1) extra space follow-up? (yes, see approach 2)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Map / interleave* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force / standard (Map old node -> new node)   O(n) time, O(n) space. Pass 1: create a copy of every node and store old -> copy in a Map.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (interleave copies, O(1) extra space)   O(n) time, O(1) space. Trick: put each copy right AFTER its original, so the "map" is just .next.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty list
- random points to self
- random is null for some nodes
- copied list must not share any node with the original
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force / standard (Map old node -> new node)   O(n) time, O(n) space

```
Pass 1: create a copy of every node and store old -> copy in a Map.
Pass 2: for every old node, copy.next = map.get(old.next), copy.random = map.get(old.random).
This is the solution most people give and it is perfectly fine.
```

### APPROACH 2 — Optimal (interleave copies, O(1) extra space)   O(n) time, O(1) space

```
Trick: put each copy right AFTER its original, so the "map" is just .next.
  1. Interleave:   A -> A' -> B -> B' -> C -> C'
  2. Set randoms:  A'.random = A.random.next   (the copy of A.random sits right after it)
  3. Unweave:      separate the two lists and restore the original's next pointers.

Dry run on A -> B, A.random = B, B.random = A:
  1. A -> A' -> B -> B'
  2. A'.random = A.random.next = B.next = B'    B'.random = B.random.next = A.next = A'
  3. A -> B ; A' -> B'
```

### Edge cases

```
- empty list
- random points to self
- random is null for some nodes
- copied list must not share any node with the original
```

Full JavaScript solution with tests: [16_copy_list_with_random_pointer.js](../solutions/16_copy_list_with_random_pointer.js). Run it with `node 16_copy_list_with_random_pointer.js` from the solutions folder.

</details>

## Common mistakes

- Setting `random` to the original node instead of its copy.
- Not handling `random === null`.
- In the interleaving method, not restoring the original list's `next` pointers.

## Related follow-ups

- [Clone Graph](../../../24_Graph_Traversal/03_Problems/02_Medium/09_clone_graph.md) (24_Graph_Traversal)
- [Clone N-ary Tree](../../../20_Trees/02_N_Ary_Trees_And_Misc/03_Problems/02_Medium/04_clone_n_ary_tree.md) (20_Trees/02_N_Ary_Trees_And_Misc)
- [LRU Cache](20_lru_cache.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
