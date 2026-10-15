# Minimum Spanning Tree Weight

| | |
|---|---|
| **Topic** | Minimum Spanning Trees |
| **Difficulty** | Easy |
| **Pattern** | Kruskal and Prim on an edge list |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [01_minimum_spanning_tree_weight.js](../solutions/01_minimum_spanning_tree_weight.js) — open only after a real attempt |

## Problem

Given n nodes 0..n-1 and an undirected weighted edge list [u, v, w], return the total
weight of a minimum spanning tree, or -1 if the graph is not connected.

## Examples

```
Input: n = 4, edges = [[0,1,1],[0,2,4],[0,3,3],[1,3,2],[2,3,5]]   Output: 7
Explanation: edges 0-1 (1), 1-3 (2), 0-2 (4).
Input: n = 3, edges = [[0,1,1]]   Output: -1   (node 2 is unreachable)
```

## Constraints & clarifying questions

```
- Duplicate edges / self loops? (fine, skipped by union-find)
- n = 1 -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kruskal and Prim on an edge list* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (try every subset of n - 1 edges)   O(C(E, n-1) * n). Enumerate every subset of exactly n - 1 edges, keep those that form a tree (connected, via union-find), take the minimum weight.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kruskal)   O(E log E) time, O(V) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- disconnected -> -1
- exactly n - 1 edges forming a tree -> their sum
- heavier duplicate of an edge is ignored
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (try every subset of n - 1 edges)   O(C(E, n-1) * n)

```
Enumerate every subset of exactly n - 1 edges, keep those that form a tree (connected,
via union-find), take the minimum weight. Exponential; fine for tests with <= 10 edges.
```

### APPROACH 2 — Optimal (Kruskal)   O(E log E) time, O(V) space

```
1. Sort edges by weight.
  2. For each edge, union(u, v); if it succeeds add the weight.
  3. Stop after n - 1 successful unions. Fewer -> -1.
(`primVersion` shows the heap-based alternative; same answer.)

Dry run on example 1:
  sorted: (0,1,1) (1,3,2) (0,3,3) (0,2,4) (2,3,5)
  take 1, take 2, skip 3 (0-3 already connected), take 4 -> 3 edges, total 7
```

### Edge cases

```
- disconnected -> -1
- exactly n - 1 edges forming a tree -> their sum
- heavier duplicate of an edge is ignored
```

Full JavaScript solution with tests: [01_minimum_spanning_tree_weight.js](../solutions/01_minimum_spanning_tree_weight.js). Run it with `node 01_minimum_spanning_tree_weight.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the connectivity check: fewer than n - 1 accepted edges means no spanning tree (-1).
- Sorting the caller's edge array in place when they still need its order.
- Confusing MST with shortest paths: the MST minimises the SUM of chosen edges, not any one route.

## Related follow-ups

- [Connecting Cities With Minimum Cost](../02_Medium/03_connecting_cities_with_minimum_cost.md)
- [Min Cost to Connect All Points](../02_Medium/02_min_cost_to_connect_all_points.md)
- [Redundant Connection](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/03_redundant_connection.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
