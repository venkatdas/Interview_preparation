# Min Cost to Connect All Points

| | |
|---|---|
| **Topic** | Minimum Spanning Trees |
| **Difficulty** | Medium |
| **Pattern** | complete graph of points, Prim / Kruskal |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1584 — https://leetcode.com/problems/min-cost-to-connect-all-points/ |
| **Solution file** | [02_min_cost_to_connect_all_points.js](../solutions/02_min_cost_to_connect_all_points.js) — open only after a real attempt |

## Problem

points[i] = [x, y]. The cost of connecting two points is their Manhattan distance
|x1 - x2| + |y1 - y2|. Return the minimum cost to connect all points so that there is
a path between every pair.

## Examples

```
Input: [[0,0],[2,2],[3,10],[5,2],[7,0]]   Output: 20
Input: [[3,12],[-2,5],[-4,1]]             Output: 18
Input: [[0,0]]                            Output: 0
```

## Constraints & clarifying questions

```
- Up to 1000 points -> ~500k candidate edges; O(n^2) or O(n^2 log n) is fine
- Any two points can be connected directly? (yes, it is a complete graph)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *complete graph of points, Prim / Kruskal* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (Kruskal on all n^2/2 edges)   O(n^2 log n) time, O(n^2) space. Generate every pair, sort by distance, union-find.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Prim, array version, no heap)   O(n^2) time, O(n) space. On a COMPLETE graph the heap gains nothing (every node sees every other).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single point -> 0
- two points -> their distance
- duplicate points -> distance 0 edge
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (Kruskal on all n^2/2 edges)   O(n^2 log n) time, O(n^2) space

```
Generate every pair, sort by distance, union-find. Simple, but the sort of 500k edges
and the memory are the cost. Shown as `kruskalVersion`.
```

### APPROACH 2 — Optimal (Prim, array version, no heap)   O(n^2) time, O(n) space

```
On a COMPLETE graph the heap gains nothing (every node sees every other). Keep
minDist[i] = cheapest known edge from the tree to point i. Each round: pick the
unvisited point with the smallest minDist (O(n) scan), add it, update minDist for all
others (O(n)). n rounds -> O(n^2), and no edge list is ever materialised.

Dry run on [[0,0],[2,2],[3,10],[5,2],[7,0]]:
  add 0: minDist = [_, 4, 13, 7, 7]
  add 1 (4): minDist = [_, _, 9, 3, 7]
  add 3 (3): minDist = [_, _, 9, _, 4]
  add 4 (4): minDist = [_, _, 9, _, _]   (3 -> 2 is 10, 4 -> 2 is 14)
  add 2 (9): total 4 + 3 + 4 + 9 = 20
```

### Edge cases

```
- single point -> 0
- two points -> their distance
- duplicate points -> distance 0 edge
```

Full JavaScript solution with tests: [02_min_cost_to_connect_all_points.js](../solutions/02_min_cost_to_connect_all_points.js). Run it with `node 02_min_cost_to_connect_all_points.js` from the solutions folder.

</details>

## Common mistakes

- Using Euclidean distance; the problem uses Manhattan distance |x1 - x2| + |y1 - y2|.
- Generating both (i, j) and (j, i) pairs, doubling the work for nothing.
- Choosing heap-Kruskal on a complete graph without noting the O(n^2 log n) cost; the O(n^2) array Prim is the best fit.

## Related follow-ups

- [Minimum Spanning Tree Weight (basic)](../01_Easy/01_minimum_spanning_tree_weight.md)
- [Optimize Water Distribution in a Village](../03_Hard/04_optimize_water_distribution.md)
- [K Closest Points to Origin](../../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/04_k_closest_points.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
