# Cheapest Way to Disconnect Two Servers (Minimum s-t Cut)

| | |
|---|---|
| **Topic** | Network Flow (Advanced) |
| **Difficulty** | Medium |
| **Pattern** | max-flow min-cut, residual reachability |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [03_minimum_cut_network.js](../solutions/03_minimum_cut_network.js) — open only after a real attempt |

## Problem

A network has `n` servers and two-way cables `cables[i] = [u, v, cost]`. Cutting cable `i`
costs `cost`. Find the minimum total cost so that, after cutting, server `s` can no longer
reach server `t`. Return `{ cost, cut }`, where `cut` is the sorted list of cable indices
to cut.

## Examples

```
Input: n=4, cables=[[0,1,3],[0,2,2],[1,3,2],[2,3,3],[1,2,1]], s=0, t=3
Output: { cost: 5, cut: [0,1] }       (another optimal answer: [1,2,4])
Input: n=2, cables=[[0,1,7],[0,1,4]], s=0, t=1    Output: { cost: 11, cut: [0,1] }
Input: n=3, cables=[[0,1,5]], s=0, t=2            Output: { cost: 0, cut: [] }
```

## Constraints & clarifying questions

```
- n <= 200, cables <= 2000, 0 <= cost <= 10^6.
- Two-way cables? (yes)
- If several cuts tie, is any one fine? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "Minimum cost to separate s from t" = minimum s-t cut = maximum flow. See
"Max-flow min-cut theorem" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Any cut splits servers into a side S containing s and a side T containing
t. Try all 2^(n-2) splits and add up the costs of cables that cross.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Run max flow with each cable as two directed edges of capacity `cost`.
Then BFS from s using only edges with remaining capacity. Reached = S side. Cables with
exactly one end in S are the cut, and their total equals the max flow.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- s, t already disconnected -> cost 0, empty cut
- parallel cables: each one crossing must be cut
- zero-cost cables: free, leave them out of the list
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n · E) time

```
for every subset S with s in S and t not in S: cost = sum of crossing cables; keep min
```

### APPROACH 2 — Optimal (max flow, then residual BFS)   O(V^2 · E) with Dinic

```
1. Build a flow network: cable (u, v, c) -> edges u->v and v->u, both capacity c.
2. maxFlow(s, t).
3. BFS from s over edges with residual capacity > 0. Reached = S.
4. cut = cables with one end in S and one outside.

Dry run (example 1):
  push 2 on 0-1-3, 2 on 0-2-3, 1 on 0-1-2-3  -> flow 5
  0-1 carries 3 (full), 0-2 carries 2 (full) -> BFS from 0 reaches nothing else, S = {0}
  crossing cables: #0 (3) + #1 (2) = 5 = max flow
```

### Why does this work?

Every unit of flow must cross every cut, so flow <= any cut. When no augmenting path
remains, the reachable set S has every outgoing edge saturated and every incoming edge
empty, so this particular cut equals the flow. Both inequalities meet: max flow = min cut.

### Common mistakes

```
- Treating a two-way cable as one directed edge (wrong answer when flow goes "backwards").
- Reporting saturated edges instead of S->T crossing edges (saturated edges deep inside T are not part of the cut).
- BFS over original capacities instead of residual ones.
```

Full JavaScript solution with tests: [03_minimum_cut_network.js](../solutions/03_minimum_cut_network.js). Run it with `node 03_minimum_cut_network.js` from the solutions folder.

</details>

## Related follow-ups

- Minimum number of cables (all cost 1) -> equals the number of edge-disjoint paths ([02](02_edge_disjoint_paths.md)).
- Cut servers instead of cables -> split each server into in/out with capacity = its cost.
- Global min cut (no fixed s, t) -> Stoer–Wagner or Karger.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
