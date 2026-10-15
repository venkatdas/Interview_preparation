# Is Graph Bipartite?

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Medium |
| **Pattern** | BFS 2-colouring |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #785 — https://leetcode.com/problems/is-graph-bipartite/ |
| **Solution file** | [01_is_graph_bipartite.js](../solutions/01_is_graph_bipartite.js) — open only after a real attempt |

## Problem

graph[u] is the list of nodes adjacent to u (undirected, no self loops, no parallel
edges, possibly disconnected). Return true if the nodes can be split into two sets so
that every edge connects a node from one set to a node from the other.

## Examples

```
Input: [[1,2,3],[0,2],[0,1,3],[0,2]]   Output: false   (0-1-2 is a triangle)
Input: [[1,3],[0,2],[1,3],[0,2]]       Output: true    ({0,2} and {1,3})
```

## Constraints & clarifying questions

```
- Disconnected graph allowed? (yes -> loop over every start node)
- Empty graph / isolated nodes? (bipartite)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS 2-colouring* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (try every 2-colouring)   O(2^n * E) time. Enumerate all 2^n assignments of colours; accept if some assignment has no same-colour edge.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS 2-colouring)   O(V + E) time, O(V) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- graph = [] -> true
- single node with no edges -> true
- two components, one bipartite one not -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (try every 2-colouring)   O(2^n * E) time

```
Enumerate all 2^n assignments of colours; accept if some assignment has no
same-colour edge. Fine for n <= 20, useless beyond.
```

### APPROACH 2 — Optimal (BFS 2-colouring)   O(V + E) time, O(V) space

```
1. color[] = -1 for all.
  2. For every uncoloured node: colour it 0, BFS. Each neighbour gets 1 - colour.
     If a neighbour already has the SAME colour -> odd cycle -> false.
  3. Finished every component -> true.

Dry run on [[1,3],[0,2],[1,3],[0,2]]:
  color 0 = 0; queue [0]
  pop 0: 1 -> 1, 3 -> 1
  pop 1: 0 is 0 (different, ok), 2 -> 0
  pop 3: 0 ok, 2 is 0 (different, ok)
  pop 2: 1 is 1 ok, 3 is 1 ok -> true
On the triangle: 0=0, 1=1, 2=1 (from 0)... then edge 1-2 both 1 -> false.
```

### Edge cases

```
- graph = [] -> true
- single node with no edges -> true
- two components, one bipartite one not -> false
```

Full JavaScript solution with tests: [01_is_graph_bipartite.js](../solutions/01_is_graph_bipartite.js). Run it with `node 01_is_graph_bipartite.js` from the solutions folder.

</details>

## Common mistakes

- Starting BFS/DFS only from node 0; the graph may be disconnected, so loop over every uncoloured node.
- Using a boolean visited array instead of a colour array, losing the information needed to detect a conflict.
- Assuming any cycle breaks bipartiteness; only ODD cycles do.

## Related follow-ups

- [Possible Bipartition](02_possible_bipartition.md)
- [Graph Valid Tree](../../../../24_Graph_Traversal/03_Problems/02_Medium/08_graph_valid_tree.md)
- [Satisfiability of Equality Equations](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/05_satisfiability_of_equality_equations.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
