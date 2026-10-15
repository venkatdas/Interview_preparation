# Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree

| | |
|---|---|
| **Topic** | Minimum Spanning Trees |
| **Difficulty** | Hard |
| **Pattern** | Kruskal with forced include / exclude |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1489 — https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/ |
| **Solution file** | [05_critical_and_pseudo_critical_edges.js](../solutions/05_critical_and_pseudo_critical_edges.js) — open only after a real attempt |

## Problem

n nodes, edges[i] = [u, v, weight]. An edge is CRITICAL if removing it increases the
MST weight (or makes an MST impossible). An edge is PSEUDO-CRITICAL if it appears in
SOME MST but not all. Return [criticalIndices, pseudoCriticalIndices].

## Examples

```
Input: n = 5, edges = [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]
Output: [[0,1], [2,3,4,5]]
Explanation: MST weight is 7. Edges 0 and 1 are in every MST. Edges 2/3 are
interchangeable, so are 4/5. Edge 6 is in no MST.
Input: n = 4, edges = [[0,1,1],[1,2,1],[2,3,1],[0,3,1]]   Output: [[], [0,1,2,3]]
```

## Constraints & clarifying questions

```
- n <= 100, edges <= 200 -> O(E^2 * alpha) is fine
- Output order inside each list? (any, we return ascending)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kruskal with forced include / exclude* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (enumerate all spanning trees)   exponential. Enumerate every subset of n - 1 edges that is a tree; among those with minimum weight, an edge in ALL of them is critical, in SOME is pseudo-critical.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kruskal with exclude / include)   O(E^2 * alpha(V)). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all weights equal in a cycle -> all pseudo-critical
- a bridge (only connection to some node) -> critical
- an edge heavier than any alternative -> neither
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (enumerate all spanning trees)   exponential

```
Enumerate every subset of n - 1 edges that is a tree; among those with minimum weight,
an edge in ALL of them is critical, in SOME is pseudo-critical. Only for tiny inputs;
used as a test oracle.
```

### APPROACH 2 — Optimal (Kruskal with exclude / include)   O(E^2 * alpha(V))

```
1. base = MST weight with plain Kruskal.
  2. For each edge i:
     a. Kruskal SKIPPING edge i. If the weight > base (or no tree) -> critical.
     b. Otherwise Kruskal with edge i FORCED first (union its ends, add its weight).
        If the weight === base -> pseudo-critical (it fits in some MST).

Dry run on example 2 (4-cycle, all weight 1, base = 3):
  edge 0 skipped: 1+1+1 = 3 = base -> not critical. Forced: 1 + 2 more = 3 -> pseudo.
  same for every edge -> [[], [0,1,2,3]]
```

### Edge cases

```
- all weights equal in a cycle -> all pseudo-critical
- a bridge (only connection to some node) -> critical
- an edge heavier than any alternative -> neither
```

Full JavaScript solution with tests: [05_critical_and_pseudo_critical_edges.js](../solutions/05_critical_and_pseudo_critical_edges.js). Run it with `node 05_critical_and_pseudo_critical_edges.js` from the solutions folder.

</details>

## Common mistakes

- Sorting the edges and losing their original indices; attach the index before sorting.
- Classifying an edge as pseudo-critical even though it is critical; check "critical" first.
- When excluding an edge makes the graph disconnected, treating the weight as unchanged instead of infinite (the edge IS critical).

## Related follow-ups

- [Critical Connections in a Network](../../../03_SCC_Bridges_Bipartite_Euler/03_Problems/03_Hard/07_critical_connections.md)
- [Minimum Spanning Tree Weight (basic)](../01_Easy/01_minimum_spanning_tree_weight.md)
- [Redundant Connection](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/03_redundant_connection.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
