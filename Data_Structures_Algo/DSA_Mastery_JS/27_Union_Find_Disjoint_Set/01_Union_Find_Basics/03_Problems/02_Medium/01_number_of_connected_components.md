# Number of Connected Components in an Undirected Graph

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | count via unions |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #323 — https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/ |
| **Solution file** | [01_number_of_connected_components.js](../solutions/01_number_of_connected_components.js) — open only after a real attempt |

## Problem

n nodes 0..n-1 and an undirected edge list. Return the number of connected components.
(Same problem as 24_Graph_Traversal/problems/07 - here we solve it with union-find.)

## Examples

```
Input: n = 5, edges = [[0,1],[1,2],[3,4]]        Output: 2
Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]  Output: 1
```

## Constraints & clarifying questions

```
- Isolated nodes count as components? (yes)
- Duplicate edges? (harmless - the second union returns false)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *count via unions* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (DFS over adjacency list)   O(V + E) time, O(V + E) space. Build the adjacency list, DFS from every unvisited node, count the starts.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find)   O(E * alpha(V)) time, O(V) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no edges -> n
- n = 1 -> 1
- duplicate edge -> no double-decrement (union returns false)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (DFS over adjacency list)   O(V + E) time, O(V + E) space

```
Build the adjacency list, DFS from every unvisited node, count the starts.
Shown as `dfsVersion`; it is the standard solution when the graph is static.
```

### APPROACH 2 — Optimal (Union-Find)   O(E * alpha(V)) time, O(V) space

```
1. uf = new UnionFind(n)  -> count = n
  2. for each edge union(u, v); each SUCCESSFUL union merges two components -> count--
  3. return uf.count()
No adjacency list at all, and it keeps working if edges keep arriving.

Dry run n=5, edges [[0,1],[1,2],[3,4]]:
  count 5
  union(0,1) true -> 4
  union(1,2) true -> 3
  union(3,4) true -> 2
  answer 2
```

### Edge cases

```
- no edges -> n
- n = 1 -> 1
- duplicate edge -> no double-decrement (union returns false)
```

Full JavaScript solution with tests: [01_number_of_connected_components.js](../solutions/01_number_of_connected_components.js). Run it with `node 01_number_of_connected_components.js` from the solutions folder.

</details>

## Common mistakes

- Counting only nodes that appear in edges; isolated nodes are components too (start the count at n).
- Decrementing the count on every union call instead of only on successful merges.
- Comparing `parent[a] === parent[b]` instead of the roots from `find`.

## Related follow-ups

- [Number of Connected Components (DFS version)](../../../../24_Graph_Traversal/03_Problems/02_Medium/07_number_of_connected_components.md)
- [Number of Provinces](04_number_of_provinces.md)
- [Graph Valid Tree](02_graph_valid_tree.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
