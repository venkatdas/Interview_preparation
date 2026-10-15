# Kth Ancestor of a Tree Node

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Hard |
| **Pattern** | binary lifting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1483 — https://leetcode.com/problems/kth-ancestor-of-a-tree-node/ |
| **Solution file** | [08_kth_ancestor_of_a_tree_node.js](../solutions/08_kth_ancestor_of_a_tree_node.js) — open only after a real attempt |

## Problem

A tree with n nodes 0..n-1, rooted at 0, is given as parent[] (parent[0] = -1).
Implement TreeAncestor(n, parent) with getKthAncestor(node, k): the k-th ancestor of
node (1st = parent), or -1 if it does not exist.

## Examples

```
TreeAncestor(7, [-1,0,0,1,1,2,2])
  getKthAncestor(3, 1) -> 1;  getKthAncestor(5, 2) -> 0;  getKthAncestor(6, 3) -> -1
```

## Constraints & clarifying questions

```
- n up to 5 * 10^4, k up to n, up to 5 * 10^4 queries -> O(k) per query is too slow in total
- Tree is static (so we can preprocess)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *binary lifting* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(k) per query, O(n) space. Walk up k parent links; return -1 if you reach the root early.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Binary lifting)   O(n log n) preprocessing, O(log n) per query. up[j][v] = 2^j-th ancestor of v (-1 if none).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 -> the node itself (not asked by LeetCode, but define it)
- k larger than the depth -> -1
- the root with any k >= 1 -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(k) per query, O(n) space

```
Walk up k parent links; return -1 if you reach the root early.
```

### APPROACH 2 — Optimal (Binary lifting)   O(n log n) preprocessing, O(log n) per query

```
up[j][v] = 2^j-th ancestor of v (-1 if none). up[0] = parent;
up[j][v] = up[j-1][ up[j-1][v] ] (if that intermediate is -1, stay -1).
getKthAncestor(v, k): for each set bit j of k, v = up[j][v]; stop at -1.
Why it works: any k is a sum of distinct powers of two, so k jumps of lengths 2^j land
exactly k levels up, in at most log k steps.

Dry run on the example, getKthAncestor(5, 2): k = 2 = 10b
  bit 0 not set; bit 1 set -> v = up[1][5] = up[0][up[0][5]] = up[0][2] = 0 -> 0
getKthAncestor(6, 3): k = 11b: bit 0 -> up[0][6] = 2; bit 1 -> up[1][2] = up[0][0] = -1 -> -1
```

### Edge cases

```
- k = 0 -> the node itself (not asked by LeetCode, but define it)
- k larger than the depth -> -1
- the root with any k >= 1 -> -1
```

Full JavaScript solution with tests: [08_kth_ancestor_of_a_tree_node.js](../solutions/08_kth_ancestor_of_a_tree_node.js). Run it with `node 08_kth_ancestor_of_a_tree_node.js` from the solutions folder.

</details>

## Common mistakes

- Walking up one parent at a time, O(k) per query, which times out for k up to 5·10^4 and many queries.
- Not stopping when an intermediate ancestor is -1, and then indexing `up[j][-1]`.
- Using too few levels: you need `ceil(log2(n))` levels to cover any k ≤ n.

## Related follow-ups

- [Lowest Common Ancestor with Binary Lifting](07_lowest_common_ancestor_binary_lifting.md)
- Lowest Common Ancestor of a Binary Tree (LeetCode #236)
- Minimum Edge Weight Equilibrium Queries in a Tree (LeetCode #2846)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
