# Lowest Common Ancestor with Binary Lifting

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Hard |
| **Pattern** | binary lifting + depth equalisation |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [07_lowest_common_ancestor_binary_lifting.js](../solutions/07_lowest_common_ancestor_binary_lifting.js) — open only after a real attempt |

## Problem

A rooted tree with n nodes (0..n-1) is given as a parent array (parent[root] = -1).
Answer many queries lca(u, v): the deepest node that is an ancestor of both u and v
(a node is its own ancestor).

## Examples

```
parent = [-1, 0, 0, 1, 1, 2]        tree:      0
                                             /   \
                                            1     2
                                           / \     \
                                          3   4     5
  lca(3, 4) -> 1;  lca(3, 5) -> 0;  lca(1, 3) -> 1;  lca(2, 2) -> 2
```

## Constraints & clarifying questions

```
- n up to 10^5 and queries up to 10^5 -> O(n) per query is too slow; need preprocessing
- Tree is static (no edge changes)
- For a BINARY tree given as nodes, the usual recursive LCA (LeetCode 236) is O(n) per
  query; binary lifting is the many-queries tool
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *binary lifting + depth equalisation* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per query. Collect the ancestors of u in a Set, then walk up from v until hitting one.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Binary lifting)   O(n log n) preprocessing, O(log n) per query. up[k][v] = the 2^k-th ancestor of v, computed as up[k][v] = up[k-1][ up[k-1][v] ] (jump 2^(k-1), then 2^(k-1) again).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- u === v
- one node is an ancestor of the other
- the root in a query
- a path-shaped tree (depth n) and a star-shaped tree (depth 1)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per query

```
Collect the ancestors of u in a Set, then walk up from v until hitting one.
```

### APPROACH 2 — Optimal (Binary lifting)   O(n log n) preprocessing, O(log n) per query

```
up[k][v] = the 2^k-th ancestor of v, computed as up[k][v] = up[k-1][ up[k-1][v] ]
(jump 2^(k-1), then 2^(k-1) again). Also compute depth[v].
lca(u, v):
  1. make u the deeper node; lift it by depth[u] - depth[v] using the binary digits of
     that difference (one jump per set bit)
  2. if u === v, done
  3. for k from high to low: if up[k][u] !== up[k][v], jump both (they are still below
     the LCA, so jumping is safe); after the loop both sit just under the LCA
  4. return up[0][u]

Dry run on the example, lca(3, 5):
  depth: [0,1,1,2,2,2]; up[0] = parent (root maps to itself): [0,0,0,1,1,2]; up[1] = [0,0,0,0,0,0]
  same depth; u=3, v=5 differ
  k=1: up[1][3]=0 === up[1][5]=0 -> no jump
  k=0: up[0][3]=1 !== up[0][5]=2 -> jump: u=1, v=2
  return up[0][1] = 0
```

### Edge cases

```
- u === v
- one node is an ancestor of the other
- the root in a query
- a path-shaped tree (depth n) and a star-shaped tree (depth 1)
```

Full JavaScript solution with tests: [07_lowest_common_ancestor_binary_lifting.js](../solutions/07_lowest_common_ancestor_binary_lifting.js). Run it with `node 07_lowest_common_ancestor_binary_lifting.js` from the solutions folder.

</details>

## Common mistakes

- Jumping from the root of the table downwards in the wrong direction: try the LARGEST jumps first and only jump when the ancestors differ.
- Not equalising depths before the common climb.
- Letting `up[k][root]` be -1 and then indexing with it; point the root at itself.

## Related follow-ups

- Lowest Common Ancestor of a Binary Tree (LeetCode #236)
- [Kth Ancestor of a Tree Node](08_kth_ancestor_of_a_tree_node.md)
- [Sparse Table](../../../../34_Range_Query_Data_Structures/03_Sparse_Table/README.md) (Euler tour + RMQ alternative)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
