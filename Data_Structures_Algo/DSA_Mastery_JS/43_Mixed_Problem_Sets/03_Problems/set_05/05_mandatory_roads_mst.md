# Mandatory Roads Network

| | |
|---|---|
| **Set** | [Mixed Set 05](README.md) — problem 05 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [05_mandatory_roads_mst.js](solutions/05_mandatory_roads_mst.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A region has n towns (0..n-1). Some roads are MANDATORY (the council already promised
to build them) and some are OPTIONAL. Each road is [u, v, cost]. Choose a set of roads
that includes every mandatory road and connects all towns, with the minimum total cost.
Return that cost, or -1 if even using every road the towns cannot all be connected.

## Examples

```
Input: n = 4, mandatory = [[0, 1, 9]], optional = [[1, 2, 1], [0, 2, 2], [2, 3, 4], [0, 3, 3]]
Output: 13   Explanation: 9 (mandatory) + 1 + 3
Input: n = 3, mandatory = [], optional = [[0, 1, 1]]   Output: -1
Input: n = 1, mandatory = [], optional = []            Output: 0
```

## Constraints & clarifying questions

```
- n up to 10^4, roads up to 10^5, costs >= 0.
- Mandatory roads may form a cycle? (yes — still all must be paid)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Union-find seeded with forced edges + Kruskal (greedy MST). See [Minimum Spanning Trees](../../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md), [Union-Find](../../../27_Union_Find_Disjoint_Set/README.md) and [Greedy](../../../28_Greedy_Algorithms/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Try every subset of optional roads, add the mandatory ones, check connectivity.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Union all mandatory roads first (paying for each). Then Kruskal on the optional roads only joins different components.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> cost of mandatory roads only (0 if none)
- disconnected even with every road -> -1
- optional cost 0 roads -> always fine to take
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^m * (n + m)) time

```
Try every subset of optional roads; add all mandatory roads; if the result connects all
towns, keep the cheapest total.
```

### APPROACH 2 — Optimal (union-find seeded with mandatory roads + greedy Kruskal)   O(m log m) time, O(n) space

```
Pay for and union every mandatory road first. Then run Kruskal on the optional roads
sorted by cost: take a road only if it joins two different components. The usual MST
exchange argument still holds once the mandatory components are treated as single
"super towns". Finally check that one component remains.

Dry run on example 1:
  mandatory: union(0,1) total 9          components {0,1} {2} {3}
  optional sorted: (1,2,1) join -> 10    (0,2,2) same comp skip
                   (0,3,3) join -> 13    (2,3,4) skip
  one component -> 13
```

### Edge cases

```
- n = 1 -> cost of mandatory roads only (0 if none)
- disconnected even with every road -> -1
- optional cost 0 roads -> always fine to take
```

### Common mistakes

```
- Skipping a mandatory road because it forms a cycle (it must still be paid).
- Forgetting the final connectivity check.
```

Full JavaScript solution with tests: [05_mandatory_roads_mst.js](solutions/05_mandatory_roads_mst.js). Run it with `node solutions/05_mandatory_roads_mst.js` from this folder.

</details>

## Related follow-ups

- Some roads are forbidden
- Find which optional roads are in EVERY optimal solution (critical edges, LeetCode #1489)
- Budget limit: connect as many towns as possible

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
