# Connecting Cities With Minimum Cost

| | |
|---|---|
| **Topic** | Minimum Spanning Trees |
| **Difficulty** | Medium |
| **Pattern** | Kruskal, detect disconnected |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1135 — https://leetcode.com/problems/connecting-cities-with-minimum-cost/ |
| **Solution file** | [03_connecting_cities_with_minimum_cost.js](../solutions/03_connecting_cities_with_minimum_cost.js) — open only after a real attempt |

## Problem

n cities labelled 1..n and connections[i] = [city1, city2, cost]. Return the minimum
cost to connect all cities (every pair reachable), or -1 if impossible.

## Examples

```
Input: n = 3, connections = [[1,2,5],[1,3,6],[2,3,1]]   Output: 6   (2-3 and 1-2)
Input: n = 4, connections = [[1,2,3],[3,4,4]]           Output: -1  (two separate pairs)
```

## Constraints & clarifying questions

```
- 1-indexed cities? (yes -> allocate n + 1 or subtract 1)
- Multiple connections between the same pair? (possible; take the cheapest naturally)

This is the textbook MST question; the only twist is detecting "impossible".
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kruskal, detect disconnected* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (Prim with a heap)   O(E log V). Build adjacency, grow from city 1, count added cities; fewer than n -> -1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kruskal)   O(E log E) time, O(V) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1, no connections -> 0
- connections insufficient to connect -> -1
- redundant expensive edges are never picked
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (Prim with a heap)   O(E log V)

```
Build adjacency, grow from city 1, count added cities; fewer than n -> -1.
Shown as `primVersion`.
```

### APPROACH 2 — Optimal (Kruskal)   O(E log E) time, O(V) space

```
1. Sort connections by cost.
  2. union; add cost on success; count edges used.
  3. used === n - 1 ? total : -1

Dry run n=3, [[1,2,5],[1,3,6],[2,3,1]]:
  sorted (2,3,1) (1,2,5) (1,3,6)
  take 1 -> {2,3}; take 5 -> {1,2,3} used 2 = n-1 -> 6
```

### Edge cases

```
- n = 1, no connections -> 0
- connections insufficient to connect -> -1
- redundant expensive edges are never picked
```

Full JavaScript solution with tests: [03_connecting_cities_with_minimum_cost.js](../solutions/03_connecting_cities_with_minimum_cost.js). Run it with `node 03_connecting_cities_with_minimum_cost.js` from the solutions folder.

</details>

## Common mistakes

- Cities are labelled 1..n; sizing union-find with n instead of n + 1 (or not shifting) breaks the last city.
- Returning the partial sum when the graph is disconnected instead of -1.
- Not stopping after n - 1 unions (harmless for correctness, but wasted work).

## Related follow-ups

- [Minimum Spanning Tree Weight (basic)](../01_Easy/01_minimum_spanning_tree_weight.md)
- [Number of Connected Components](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/01_number_of_connected_components.md)
- [Optimize Water Distribution in a Village](../03_Hard/04_optimize_water_distribution.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
