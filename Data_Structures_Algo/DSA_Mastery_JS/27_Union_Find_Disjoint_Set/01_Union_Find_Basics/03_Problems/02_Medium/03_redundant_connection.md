# Redundant Connection

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | first failed union |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #684 — https://leetcode.com/problems/redundant-connection/ |
| **Solution file** | [03_redundant_connection.js](../solutions/03_redundant_connection.js) — open only after a real attempt |

## Problem

A tree with n nodes (1..n) had ONE extra edge added, creating exactly one cycle. Given
the resulting edge list, return the edge that can be removed to make it a tree again.
If several answers exist, return the one that appears LAST in the input.

## Examples

```
Input: [[1,2],[1,3],[2,3]]                 Output: [2,3]
Input: [[1,2],[2,3],[3,4],[1,4],[1,5]]     Output: [1,4]
```

## Constraints & clarifying questions

```
- Nodes are 1-indexed? (yes, allocate n + 1)
- Exactly one extra edge? (yes -> exactly one union will fail)
- "Last in input" tie-break -> process edges in order, the FIRST failing union is the
  last edge of the cycle in input order, which is what we want.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *first failed union* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (remove each edge from the end, test for tree)   O(E * (V+E)). Iterate edges from last to first; remove it and check whether the remaining graph is connected (DFS).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find, first failed union)   O(E * alpha(V)) time, O(V). Add edges one by one.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- the redundant edge is the very first one that completes a triangle
- n = 3 triangle
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (remove each edge from the end, test for tree)   O(E * (V+E))

```
Iterate edges from last to first; remove it and check whether the remaining graph is
connected (DFS). The first such edge is the answer.
```

### APPROACH 2 — Optimal (Union-Find, first failed union)   O(E * alpha(V)) time, O(V)

```
Add edges one by one. The moment union(u, v) returns false, u and v are already
connected, so [u, v] closes the cycle. Because edges are processed in input order, this
is the last cycle edge in the input.

Dry run [[1,2],[2,3],[3,4],[1,4],[1,5]]:
  union(1,2) ok, union(2,3) ok, union(3,4) ok, union(1,4): same root -> return [1,4]
```

### Edge cases

```
- the redundant edge is the very first one that completes a triangle
- n = 3 triangle
```

Full JavaScript solution with tests: [03_redundant_connection.js](../solutions/03_redundant_connection.js). Run it with `node 03_redundant_connection.js` from the solutions folder.

</details>

## Common mistakes

- Returning the first edge of the cycle instead of the edge that CLOSES it (the first union that returns false).
- Allocating parent of size n when nodes are labelled 1..n (needs n + 1).
- Using this approach on a directed graph; that is Redundant Connection II and needs extra in-degree logic.

## Related follow-ups

- [Graph Valid Tree](02_graph_valid_tree.md)
- Redundant Connection II (LeetCode #685)
- [Minimum Spanning Tree Weight](../../../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/03_Problems/01_Easy/01_minimum_spanning_tree_weight.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
