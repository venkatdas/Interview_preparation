# Reachable Nodes in Subdivided Graph

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Hard |
| **Pattern** | Dijkstra + edge accounting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #882 — https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/ |
| **Solution file** | [10_reachable_nodes_in_subdivided_graph.js](../solutions/10_reachable_nodes_in_subdivided_graph.js) — open only after a real attempt |

## Problem

Undirected graph with n nodes; edges[i] = [u, v, cnt] means the edge u-v is subdivided
into cnt NEW tiny nodes in a chain (so walking u -> v takes cnt + 1 moves). Starting at
node 0 with maxMoves moves, how many nodes (original + tiny) can you reach?

## Examples

```
Input: edges = [[0,1,10],[0,2,1],[1,2,2]], maxMoves = 6, n = 3   Output: 13
Input: edges = [[0,1,4],[1,2,6],[0,2,8],[1,3,1]], maxMoves = 10, n = 4   Output: 23
Input: edges = [[1,2,4],[1,4,5],[1,3,1],[2,3,4],[3,4,5]], maxMoves = 17, n = 5   Output: 1
```

## Constraints & clarifying questions

```
- cnt can be up to 10^4 and there can be 10^4 edges -> we cannot build the subdivided
  graph (10^8 nodes). We must count tiny nodes with arithmetic.
- Node 0 is always reachable (counts as 1 even if isolated)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dijkstra + edge accounting* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (actually build the subdivided graph and BFS). O(sum of cnt + E) time and space Create the tiny nodes, BFS from 0 with a move budget, count visited.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dijkstra on the original graph + per-edge accounting). O(E log V) time, O(V + E) space 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- node 0 isolated -> 1
- maxMoves = 0 -> 1
- an edge reachable from both ends whose tiny nodes overlap -> the min() caps it
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (actually build the subdivided graph and BFS)

```
O(sum of cnt + E) time and space
Create the tiny nodes, BFS from 0 with a move budget, count visited. Correct and a
great test oracle for small inputs; impossible at the upper constraints.
```

### APPROACH 2 — Optimal (Dijkstra on the original graph + per-edge accounting)

```
O(E log V) time, O(V + E) space
  1. Dijkstra from 0 with weight cnt + 1 -> dist[] to original nodes.
  2. Original nodes with dist <= maxMoves are reachable: count them.
  3. For each edge (u, v, cnt): from u we can walk max(0, maxMoves - dist[u]) tiny
     nodes into the edge; from v similarly. The edge contributes
     min(cnt, fromU + fromV) tiny nodes (never more than exist).

Dry run example 1 (maxMoves 6):
  dist[0]=0, dist[2]=2 (via 1 tiny node), dist[1]=5 (0-2-1: 2 + 3)
  originals reachable: 0, 1, 2 -> 3
  edge 0-1 (10): from 0: 6, from 1: 1 -> min(10, 7) = 7
  edge 0-2 (1):  from 0: 6, from 2: 4 -> min(1, 10) = 1
  edge 1-2 (2):  from 1: 1, from 2: 4 -> min(2, 5) = 2
  total 3 + 7 + 1 + 2 = 13
```

### Edge cases

```
- node 0 isolated -> 1
- maxMoves = 0 -> 1
- an edge reachable from both ends whose tiny nodes overlap -> the min() caps it
```

Full JavaScript solution with tests: [10_reachable_nodes_in_subdivided_graph.js](../solutions/10_reachable_nodes_in_subdivided_graph.js). Run it with `node 10_reachable_nodes_in_subdivided_graph.js` from the solutions folder.

</details>

## Common mistakes

- Materialising every subdivided node; with cnt up to 10^4 per edge the graph explodes.
- Counting an edge's middle nodes from both ends without capping at cnt (double counting).
- Using edge weight cnt instead of cnt + 1 when walking across a subdivided edge.

## Related follow-ups

- [Network Delay Time](../02_Medium/01_network_delay_time.md)
- [Number of Ways to Arrive at Destination](../02_Medium/06_number_of_ways_to_arrive_at_destination.md)
- [Find the City With the Smallest Number of Neighbors](../02_Medium/07_find_the_city.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
