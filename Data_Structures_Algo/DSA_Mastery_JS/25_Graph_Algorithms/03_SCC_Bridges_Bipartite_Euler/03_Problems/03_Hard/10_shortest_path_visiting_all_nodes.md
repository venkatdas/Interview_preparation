# Shortest Path Visiting All Nodes

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Hard |
| **Pattern** | BFS on (node, bitmask) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #847 — https://leetcode.com/problems/shortest-path-visiting-all-nodes/ |
| **Solution file** | [10_shortest_path_visiting_all_nodes.js](../solutions/10_shortest_path_visiting_all_nodes.js) — open only after a real attempt |

## Problem

An undirected connected graph with n nodes (graph[i] = neighbours of i). Return the
length of the shortest walk that visits EVERY node at least once. You may start at any
node, revisit nodes and reuse edges.

## Examples

```
Input: [[1,2,3],[0],[0],[0]]           Output: 4   (e.g. 1 -> 0 -> 2 -> 0 -> 3)
Input: [[1],[0,2,4],[1,3,4],[2],[1,2]] Output: 4   (e.g. 0 -> 1 -> 4 -> 2 -> 3)
```

## Constraints & clarifying questions

```
- n <= 12 -> 2^12 * 12 = 49k states, BFS is fine
- Single node -> 0

The position alone is not enough: we need to remember WHICH nodes we have seen.
State = (currentNode, visitedMask). All moves cost 1 -> BFS.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS on (node, bitmask)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (all-pairs BFS distances + try every visiting order)   O(n! * n). Compute dist[i][j] with BFS from each node, then try every permutation of nodes as the order in which they are FIRST visited, summing the pairwise distances.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS over (node, mask))   O(2^n * n^2) time, O(2^n * n) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 0
- a path graph of n nodes -> n - 1
- complete graph -> n - 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (all-pairs BFS distances + try every visiting order)   O(n! * n)

```
Compute dist[i][j] with BFS from each node, then try every permutation of nodes as the
order in which they are FIRST visited, summing the pairwise distances. Correct because
between consecutive "new" nodes the walk takes a shortest path. Works for n <= 8 or so.
```

### APPROACH 2 — Optimal (BFS over (node, mask))   O(2^n * n^2) time, O(2^n * n) space

```
1. Start from EVERY node simultaneously: state (i, 1 << i) at distance 0.
  2. BFS: from (u, mask), move to (v, mask | 1 << v) for every neighbour v.
  3. The first state with mask === (1 << n) - 1 gives the answer.

Dry run on the star [[1,2,3],[0],[0],[0]]:
  level 0: (0,0001) (1,0010) (2,0100) (3,1000)
  level 1: from leaves: (0,0011) (0,0101) (0,1001); from centre: (1,0011) (2,0101) (3,1001)
  level 2: (2,0111) (3,1011) ... (0,0111)...
  level 3: (0,0111)->(3,1111)? (0, 0111) came at level 3 from (2,0111) at level 2
  level 4: (3,1111) full mask -> 4
```

### Edge cases

```
- n = 1 -> 0
- a path graph of n nodes -> n - 1
- complete graph -> n - 1
```

Full JavaScript solution with tests: [10_shortest_path_visiting_all_nodes.js](../solutions/10_shortest_path_visiting_all_nodes.js). Run it with `node 10_shortest_path_visiting_all_nodes.js` from the solutions folder.

</details>

## Common mistakes

- Starting BFS from a single node; you may start anywhere, so seed the queue with every (node, 1 << node).
- Keeping `visited` per node instead of per (node, mask).
- Returning a count of nodes instead of edges; a single-node graph answers 0.

## Related follow-ups

- [Shortest Path in a Grid with Obstacles Elimination](../../../01_Shortest_Paths/03_Problems/03_Hard/09_shortest_path_with_obstacles_elimination.md)
- [Bus Routes](05_bus_routes.md)
- [Rotting Oranges (multi-source BFS)](../../../../24_Graph_Traversal/03_Problems/02_Medium/10_rotting_oranges.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
