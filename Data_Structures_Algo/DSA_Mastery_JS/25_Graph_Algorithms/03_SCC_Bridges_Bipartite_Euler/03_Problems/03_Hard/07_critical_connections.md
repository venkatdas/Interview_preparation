# Critical Connections in a Network

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Hard |
| **Pattern** | bridges (Tarjan) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1192 — https://leetcode.com/problems/critical-connections-in-a-network/ |
| **Solution file** | [07_critical_connections.js](../solutions/07_critical_connections.js) — open only after a real attempt |

## Problem

n servers 0..n-1 connected by undirected connections. A connection is CRITICAL if
removing it makes some server unreachable from some other. Return all critical
connections (any order).

## Examples

```
Input: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]   Output: [[1,3]]
Explanation: 0-1-2 is a cycle (no single edge is critical); 1-3 is the only link to 3.
Input: n = 2, connections = [[0,1]]                     Output: [[0,1]]
```

## Constraints & clarifying questions

```
- Graph is connected? (yes)
- Up to 10^5 edges -> we need O(V + E); the brute force is O(E * (V + E))
- Output order / pair order? (any)

Critical connection = BRIDGE.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bridges (Tarjan)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (remove each edge, test connectivity)   O(E * (V + E)). For each edge: delete it, BFS from 0, if some node is unreachable the edge is a bridge.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Tarjan low-link)   O(V + E) time, O(V) space. ids[u] = DFS discovery time; low[u] = lowest id reachable from u's subtree using at most one back edge (and never the edge we came in by).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- a tree -> every edge is critical
- a single cycle -> none
- parallel edges between the same pair -> not critical (handled by skipping by edge index)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (remove each edge, test connectivity)   O(E * (V + E))

```
For each edge: delete it, BFS from 0, if some node is unreachable the edge is a
bridge. Great oracle for tests.
```

### APPROACH 2 — Optimal (Tarjan low-link)   O(V + E) time, O(V) space

```
ids[u] = DFS discovery time; low[u] = lowest id reachable from u's subtree using at
  most one back edge (and never the edge we came in by).
  After exploring child v of u: low[u] = min(low[u], low[v]).
  If low[v] > ids[u], the subtree under v has NO way back to u or above except through
  u-v -> u-v is a bridge.

Dry run n=4, [[0,1],[1,2],[2,0],[1,3]]:
  dfs(0): id 0.  -> dfs(1): id 1.  -> dfs(2): id 2; 2 sees 0 (back edge) low[2]=0
    back in 1: low[1] = min(1, 0) = 0; low[2]=0 > ids[1]=1? no -> 1-2 not a bridge
    -> dfs(3): id 3, low 3. back in 1: low[3]=3 > ids[1]=1 -> 1-3 IS a bridge
  back in 0: low[1]=0 > ids[0]=0? no -> 0-1 not a bridge
```

### Edge cases

```
- a tree -> every edge is critical
- a single cycle -> none
- parallel edges between the same pair -> not critical (handled by skipping by edge index)
```

Full JavaScript solution with tests: [07_critical_connections.js](../solutions/07_critical_connections.js). Run it with `node 07_critical_connections.js` from the solutions folder.

</details>

## Common mistakes

- Using `>=` instead of `>` when testing `low[v]` against `ids[u]` (that is the articulation-point test).
- Skipping the parent NODE instead of the parent EDGE, which mis-handles parallel edges.
- Recursion depth: 10^5 nodes can overflow the JS call stack; mention an iterative DFS.

## Related follow-ups

- [Find Critical and Pseudo-Critical Edges](../../../02_Minimum_Spanning_Trees/03_Problems/03_Hard/05_critical_and_pseudo_critical_edges.md)
- [Redundant Connection](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/03_redundant_connection.md)
- [Graph Valid Tree](../../../../24_Graph_Traversal/03_Problems/02_Medium/08_graph_valid_tree.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
