# Number of Connected Components in an Undirected Graph

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | components on adjacency list |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #323 — https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/ |
| **Solution file** | [07_number_of_connected_components.js](../solutions/07_number_of_connected_components.js) — open only after a real attempt |

## Problem

n nodes 0..n-1 and an undirected edge list. Return how many connected components
(separate "islands" of nodes) the graph has.

## Examples

```
Input: n = 5, edges = [[0,1],[1,2],[3,4]]        Output: 2   ({0,1,2} and {3,4})
Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]  Output: 1
Input: n = 4, edges = []                         Output: 4   (every node is alone)
```

## Constraints & clarifying questions

```
- Can there be isolated nodes not in any edge? (yes - that is why we loop 0..n-1)
- Duplicate edges? (harmless)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *components on adjacency list* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (label propagation)   O(n * E) time, O(n) space. Give each node label = its own id.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS, count starts)   O(V + E) time, O(V + E) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no edges -> n
- n = 1 -> 1
- complete graph -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (label propagation)   O(n * E) time, O(n) space

```
Give each node label = its own id. Repeat: for every edge (u, v) set both labels to the
smaller one. Stop when a pass changes nothing. Count distinct labels. Up to n passes,
each O(E).
```

### APPROACH 2 — Optimal (DFS, count starts)   O(V + E) time, O(V + E) space

```
1. Build adjacency list.
  2. For node in 0..n-1: if unvisited -> count++, DFS marks its whole component.
Every time we need to START a new DFS, we have found a new component.

Dry run n=5, edges [[0,1],[1,2],[3,4]]:
  node 0 unvisited -> count=1, DFS marks 0,1,2
  node 1, 2 visited, skip
  node 3 unvisited -> count=2, DFS marks 3,4
  node 4 visited. Answer 2.

(Union-Find version in 27_Union_Find_Disjoint_Set/01_Union_Find_Basics/problems/01.)
```

### Edge cases

```
- no edges -> n
- n = 1 -> 1
- complete graph -> 1
```

Full JavaScript solution with tests: [07_number_of_connected_components.js](../solutions/07_number_of_connected_components.js). Run it with `node 07_number_of_connected_components.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting isolated vertices (they are components too).
- Adding edges in one direction only.
- Counting components by the number of traversal calls inside the inner loop instead of outer starts.

## Related follow-ups

- [Graph Valid Tree](08_graph_valid_tree.md)
- [Number of Provinces](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/04_number_of_provinces.md) (27_Union_Find_Disjoint_Set/01_Union_Find_Basics)
- [Redundant Connection](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/03_redundant_connection.md) (27_Union_Find_Disjoint_Set/01_Union_Find_Basics)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
