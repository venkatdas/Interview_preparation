# Count Subtree Sums with Updates

| | |
|---|---|
| **Topic** | Advanced Tree Techniques |
| **Difficulty** | Medium |
| **Pattern** | Euler tour + Fenwick tree |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Fenwick Tree](../../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/README.md) |
| **Source** | Original exercise |
| **Solution file** | [03_count_subtree_sums_with_updates.js](../solutions/03_count_subtree_sums_with_updates.js) — open only after a real attempt |

## Problem

A tree with n nodes 0..n-1 is rooted at node 0, and node v holds an integer `values[v]`.
Process the queries in order:

- `['update', v, x]` sets `values[v] = x`.
- `['sum', v]` asks for the sum of the values in the subtree of v (v included).

Return the answers of all `'sum'` queries, in order. Think of a file explorer showing folder
sizes while files keep changing size.

## Examples

```
         0(1)
        /    \
     1(2)    2(3)
     /  \
  3(4)  4(5)

edges = [[0,1],[0,2],[1,3],[1,4]], values = [1,2,3,4,5]
queries = [['sum',1], ['update',3,10], ['sum',1], ['sum',0]]
Output: [11, 17, 21]
```

## Constraints & clarifying questions

```
- n and the number of queries up to 10^5 -> O(n) per query is too slow.
- Values may be negative; sums fit in a double exactly.
- The root is fixed at 0.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Turn the tree into an array where every subtree is one contiguous slice: the *Euler tour*. Section 5.3 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** For each sum query, walk v's subtree with a stack: O(n) per query.

</details>

<details><summary>Hint 3</summary>

**The key idea.** In DFS preorder, the subtree of v sits at positions tin[v]..tin[v]+size[v]-1. Now you need "point update, range sum" on an array: a Fenwick tree.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Store the old value so the update adds the difference. Use an iterative DFS for deep trees. n = 1 works naturally.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per query, O(n) space

Keep the values; for each sum query, DFS the subtree and add.

### APPROACH 2 — Optimal (Euler tour + Fenwick)   O(n + q log n) time, O(n) space

```
1. Iterative preorder DFS from 0: tin[v] = visit index; size[v] from reverse order.
2. Fenwick over positions: add(tin[v], values[v]).
3. update v x : add(tin[v], x - values[v]); values[v] = x
   sum v      : range(tin[v], tin[v] + size[v] - 1)

Dry run (stack preorder visits 0, 2, 1, 4, 3):
  tin = [0,2,1,4,3], size = [5,3,1,1,1]
  positions hold [1,3,2,5,4]
  sum(1)        -> positions 2..4 = 2+5+4 = 11
  update(3,10)  -> position 3 gets +6
  sum(1)        -> 2+5+10 = 17;  sum(0) -> 21
```

### Edge cases

```
- leaf -> slice of length 1
- update to the same value -> delta 0
- 10^5-node path -> iterative DFS
```

### Common mistakes

- Adding the NEW value instead of the difference to the Fenwick tree.
- Computing tout with a different counter than tin.
- Recursive DFS on deep trees.

Full JavaScript solution with tests: [03_count_subtree_sums_with_updates.js](../solutions/03_count_subtree_sums_with_updates.js).

</details>

## Related follow-ups

- Subtree **range add** + point query (difference array on the tour, still a Fenwick)
- Subtree maximum with updates (segment tree instead of Fenwick)
- Minimum Score After Removals on a Tree (LeetCode #2322) - uses tin/tout ancestor checks

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
