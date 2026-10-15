# Optimize Water Distribution in a Village

| | |
|---|---|
| **Topic** | Minimum Spanning Trees |
| **Difficulty** | Hard |
| **Pattern** | virtual node + Kruskal |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1168 — https://leetcode.com/problems/optimize-water-distribution-in-a-village/ |
| **Solution file** | [04_optimize_water_distribution.js](../solutions/04_optimize_water_distribution.js) — open only after a real attempt |

## Problem

n houses 1..n. You can supply water to house i either by building a WELL at cost
wells[i-1], or by laying a PIPE between two houses: pipes[j] = [house1, house2, cost]
(undirected). A house with water can pass it on through pipes. Return the minimum total
cost to give every house water.

## Examples

```
Input: n = 3, wells = [1,2,2], pipes = [[1,2,1],[2,3,1]]   Output: 3
Explanation: well at house 1 (1), pipe 1-2 (1), pipe 2-3 (1).
Input: n = 2, wells = [1,1], pipes = [[1,2,1],[1,2,2]]     Output: 2
```

## Constraints & clarifying questions

```
- Can every house get a well? (yes, so a solution always exists)
- Can there be several wells? (yes - each well starts its own supply)

THE TRICK: add a VIRTUAL house 0 that is "the water source". Building a well at house
i is the same as laying a pipe 0 - i with cost wells[i-1]. Now every house must be
connected to the component containing 0 as cheaply as possible = MST on n + 1 nodes.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *virtual node + Kruskal* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (choose which houses get wells, MST the rest)   exponential. Try every subset of houses to receive wells, then connect everything to them via cheapest pipes (Kruskal with the well houses pre-unioned to a virtual node).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (virtual node + Kruskal)   O((n + p) log(n + p)). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no pipes -> sum of all wells
- pipes very cheap -> one well + pipes
- duplicate pipes with different costs
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (choose which houses get wells, MST the rest)   exponential

```
Try every subset of houses to receive wells, then connect everything to them via
cheapest pipes (Kruskal with the well houses pre-unioned to a virtual node). 2^n
subsets - only for tiny n, but it shows WHY the virtual node is equivalent.
```

### APPROACH 2 — Optimal (virtual node + Kruskal)   O((n + p) log(n + p))

```
1. edges = pipes + [0, i, wells[i-1]] for every house i.
  2. Kruskal on n + 1 nodes; the answer is the MST weight.

Dry run n=3, wells [1,2,2], pipes [[1,2,1],[2,3,1]]:
  edges: (0,1,1) (0,2,2) (0,3,2) (1,2,1) (2,3,1)   sorted by cost
  take (0,1,1) take (1,2,1) take (2,3,1) -> 3 edges = n, done. total 3
```

### Edge cases

```
- no pipes -> sum of all wells
- pipes very cheap -> one well + pipes
- duplicate pipes with different costs
```

Full JavaScript solution with tests: [04_optimize_water_distribution.js](../solutions/04_optimize_water_distribution.js). Run it with `node 04_optimize_water_distribution.js` from the solutions folder.

</details>

## Common mistakes

- Trying to "pick the cheapest well" first; the virtual-node trick lets one MST decide where wells go.
- Forgetting that houses are 1-indexed, so the virtual node can be 0.
- Running MST on n nodes instead of n + 1 (the virtual well node must be counted).

## Related follow-ups

- [Min Cost to Connect All Points](../02_Medium/02_min_cost_to_connect_all_points.md)
- [Connecting Cities With Minimum Cost](../02_Medium/03_connecting_cities_with_minimum_cost.md)
- [Find Critical and Pseudo-Critical Edges](05_critical_and_pseudo_critical_edges.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
