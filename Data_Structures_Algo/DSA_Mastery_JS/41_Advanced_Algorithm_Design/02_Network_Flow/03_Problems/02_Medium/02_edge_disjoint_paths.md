# Count Edge-Disjoint Paths

| | |
|---|---|
| **Topic** | Network Flow (Advanced) |
| **Difficulty** | Medium |
| **Pattern** | unit-capacity max flow (Menger's theorem) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Graph Traversal](../../../../24_Graph_Traversal/README.md) |
| **Source** | Original exercise |
| **Solution file** | [02_edge_disjoint_paths.js](../solutions/02_edge_disjoint_paths.js) — open only after a real attempt |

## Problem

A data center has `n` routers and one-way cables `edges[i] = [u, v]`. Two routes from
router `s` to router `t` are *independent* if they never use the same cable (sharing
routers is fine). Return the maximum number of pairwise independent routes.

## Examples

```
Input: n=4, edges=[[0,1],[0,2],[1,3],[2,3],[1,2]], s=0, t=3   Output: 2
Input: n=3, edges=[[0,1],[1,2]], s=0, t=2                     Output: 1
Input: n=3, edges=[[0,1],[0,1],[1,2],[1,2]], s=0, t=2         Output: 2   (parallel cables)
Input: n=3, edges=[[0,1]], s=0, t=2                           Output: 0
```

## Constraints & clarifying questions

```
- n <= 500, edges <= 5000.
- Directed? (yes; undirected -> add an edge in each direction)
- Can routes share routers? (yes; if not -> vertex-disjoint, split each node into in/out)
- s === t? (return 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "Maximum number of disjoint paths" is a max-flow question in disguise. See
"Applications" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Greedy: find any path with BFS, delete its edges, repeat. Try it on
`[[0,1],[1,2],[2,3],[0,2],[1,3]]`, s=0, t=3: if the first path is 0-1-2-3 you get only 1,
but the answer is 2. Greedy needs a way to *undo*.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Give each edge capacity 1. A flow of value k splits into k paths that
share no edge, and k disjoint paths form a flow of value k. Reverse residual edges are the
"undo" that greedy lacked. Answer = max flow.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- t unreachable -> 0
- parallel cables each count
- self-loops never help
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   exponential

```
Backtrack over every simple s->t path using unused edges, mark them, recurse; memoise
on the bitmask of used edges. Only for ~15 edges.
```

### APPROACH 2 — Optimal (unit-capacity max flow)   O(E · F), F <= out-degree of s

```
Every edge gets capacity 1, reverse edge capacity 0.
repeat: BFS for an s->t path in the residual graph; if none, stop; else push 1 unit.

Dry run on the trap graph [[0,1],[1,2],[2,3],[0,2],[1,3]]:
  path A: 0->1->3                         flow 1
  path B: 0->2->3                         flow 2
  (if the first path had been 0->1->2->3, the second BFS would go 0->2, use the
   REVERSE edge 2->1, then 1->3 — undoing the bad choice; still flow 2)
  no more paths. answer 2
```

### Complexity

Each augmentation adds 1 and costs O(V + E), and the flow is at most the out-degree of s,
so O(E · deg(s)) <= O(E^2). Dinic on unit graphs is O(E · min(√E, V^(2/3))).

### Common mistakes

```
- Deleting edges greedily without reverse edges.
- Mixing up edge-disjoint (capacity on edges) with vertex-disjoint (capacity on nodes).
```

Full JavaScript solution with tests: [02_edge_disjoint_paths.js](../solutions/02_edge_disjoint_paths.js). Run it with `node 02_edge_disjoint_paths.js` from the solutions folder.

</details>

## Related follow-ups

- Vertex-disjoint paths: split v into v_in -> v_out with capacity 1.
- Minimum number of cables to cut to disconnect s from t: same number (Menger) — see [03](03_minimum_cut_network.md).
- Undirected version: add both directions with capacity 1 each.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
