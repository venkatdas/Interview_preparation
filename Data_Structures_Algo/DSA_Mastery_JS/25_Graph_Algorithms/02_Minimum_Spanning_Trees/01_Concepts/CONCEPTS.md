# Minimum Spanning Tree

A **spanning tree** of a connected, undirected graph is a subset of its edges that
connects every node with **no cycles** - exactly `n - 1` edges. The **minimum** spanning
tree (MST) is the spanning tree whose total edge weight is the smallest.

Real-world version: you must lay cables (or roads, or pipes) so that every house is
connected, and you want to spend as little as possible. You do not care about the
distance between any two particular houses, only that everything is connected cheaply.
That is the key difference from shortest paths.

## Prerequisites

- [Graphs](../../../23_Graphs/README.md): edge lists, adjacency lists, weighted undirected graphs.
- [Union-Find](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md): Kruskal's cycle check.
- [Heaps and Priority Queues](../../../19_Heaps_And_Priority_Queues/README.md): Prim's "cheapest edge out of the tree".
- [Shortest Paths](../../01_Shortest_Paths/README.md): Prim is Dijkstra with a different heap key; knowing one makes the other easy.
- [Greedy Algorithms](../../../28_Greedy_Algorithms/README.md): MST is the textbook case where greedy is provably optimal.

**Mental model.** Picture islands and a price list of bridges. Kruskal reads the price list
from cheapest to most expensive and builds a bridge unless the two islands are already
connected by land or other bridges. Prim stands on one island and keeps buying the
cheapest bridge that reaches a NEW island.

---

## Why it matters / when to use

- "minimum cost to **connect all** points / cities / islands / computers"
- "connect every node, any route is fine, total cost minimal"
- "cables / pipes / roads / wires" with costs
- "which edges are critical for the minimum total cost" (Critical and Pseudo-Critical)
- Clustering: remove the k - 1 largest MST edges to get k clusters
- Approximations for the travelling salesman problem

NOT an MST problem: "cheapest path from A to B" (that is Dijkstra). An MST minimises
the **sum of all edges**, not any single path.

---

## How it works

### The cut property (why greedy works)

Split the nodes into any two groups (a **cut**). The cheapest edge crossing the cut is
always in *some* MST. Intuition: if your tree does not use it, add it - that creates a
cycle that crosses the cut somewhere else with a heavier edge; remove that heavier edge
and you get a lighter spanning tree. So greedily picking cheapest crossing edges never
goes wrong. Both algorithms below are just two ways to apply this rule.

### Kruskal: sort edges, skip cycles

```
Edges sorted:  (0-1, 1)  (1-3, 2)  (0-3, 3)  (0-2, 4)  (2-3, 5)

take 0-1 (1)   sets {0,1} {2} {3}          0 --1-- 1
take 1-3 (2)   sets {0,1,3} {2}                     |
skip 0-3 (3)   0 and 3 already connected -> cycle   2
take 0-2 (4)   sets {0,1,2,3}  -> 3 edges = n-1, done     total = 7
```

```js
function kruskal(n, edges) {
  edges.sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  let total = 0, used = 0;
  for (const [u, v, w] of edges) {
    if (uf.union(u, v)) {            // false = would close a cycle
      total += w;
      if (++used === n - 1) break;
    }
  }
  return used === n - 1 ? total : -1;
}
```

Union-Find makes the cycle check ~O(1). Cost is dominated by the sort: O(E log E).

### Prim: grow one tree with a heap

Start anywhere. Keep a min-heap of edges leaving the tree. Repeatedly pop the cheapest
edge; if it leads to a node not yet in the tree, add that node and push its edges.

```
start 0:   heap [(1,1) (3,3) (4,2)]           tree {0}
pop (1,1): add 1, push 1's edges (2,3)        tree {0,1}      heap [(2,3) (3,3) (4,2)]
pop (2,3): add 3, push 3's edges (5,2)        tree {0,1,3}    heap [(3,3) (4,2) (5,2)]
pop (3,3): 3 already in tree -> skip
pop (4,2): add 2                              tree {0,1,2,3}  total = 1 + 2 + 4 = 7
```

```js
function prim(n, adj) {                 // adj[u] = [[v, w], ...]
  const inTree = new Array(n).fill(false);
  const heap = new MinHeap();
  heap.push([0, 0]);                    // [weight, node]
  let total = 0, count = 0;
  while (!heap.isEmpty() && count < n) {
    const [w, u] = heap.pop();
    if (inTree[u]) continue;
    inTree[u] = true; total += w; count++;
    for (const [v, vw] of adj[u]) if (!inTree[v]) heap.push([vw, v]);
  }
  return count === n ? total : -1;
}
```

It is Dijkstra with one change: the heap key is the **edge weight**, not the distance
from the source.

### Kruskal vs Prim

| | Kruskal | Prim |
|---|---|---|
| Input shape | edge list | adjacency list |
| Core tool | sort + union-find | min-heap |
| Time | O(E log E) | O(E log V) |
| Best for | sparse graphs, edges already given as a list | dense graphs, "all pairs of points" (E ~ V^2) |
| Extra powers | easy to ask "is this edge in some MST?" (critical edges) | easy to start from a given node |
| Disconnected graph | detect: fewer than n - 1 edges chosen | detect: fewer than n nodes added |

For "connect all points in a plane" (Min Cost to Connect All Points), E = n^2 / 2 edges.
Kruskal must sort them all: O(n^2 log n). Prim with an O(n^2) array version (no heap)
is the fastest there.

---

## Pseudocode (Essential)

```
KRUSKAL(n, edges):
  sort edges by weight ascending
  uf = UnionFind(n); total = 0; used = 0
  for (u, v, w) in edges:
    if uf.union(u, v):                    # different components -> no cycle
      total += w; used += 1
      if used == n - 1: break
  return used == n - 1 ? total : -1       # fewer edges -> graph disconnected

PRIM(n, adj, start):
  inTree[*] = false; heap = {(0, start)}; total = 0; count = 0
  while heap not empty and count < n:
    (w, u) = pop smallest
    if inTree[u]: continue                # stale entry
    inTree[u] = true; total += w; count += 1
    for (v, wv) in adj[u]:
      if not inTree[v]: push (wv, v)
  return count == n ? total : -1
```

## Dry run: Kruskal as a table (Essential)

Graph: 0-1 (1), 0-2 (4), 0-3 (3), 1-3 (2), 2-3 (5), n = 4.

| Step | Edge (sorted) | find(u) == find(v)? | Action | Components after | total | used |
|------|---------------|---------------------|--------|------------------|-------|------|
| 1 | 0-1 (1) | no | take | {0,1} {2} {3} | 1 | 1 |
| 2 | 1-3 (2) | no | take | {0,1,3} {2} | 3 | 2 |
| 3 | 0-3 (3) | yes (same set) | skip, would close a cycle | {0,1,3} {2} | 3 | 2 |
| 4 | 0-2 (4) | no | take | {0,1,2,3} | 7 | 3 = n - 1, stop |

Edge 2-3 (5) is never looked at. MST weight = 7.

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| Kruskal | O(E log E) | O(V) | sort dominates; union-find is ~O(1) per edge |
| Prim (binary heap) | O(E log V) | O(V + E) | like Dijkstra |
| Prim (array, dense) | O(V^2) | O(V) | best when E ~ V^2 |
| check MST exists | included | | fewer than n - 1 edges => disconnected |

---

## JavaScript implementation

Full code with tests: [`02_Implementations/mst.js`](../02_Implementations/mst.js) (`kruskal`, `prim`).
It reuses `UnionFind` from
[`27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find.js`](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find.js)
and `MinHeap` from
[`01_Shortest_Paths/02_Implementations/shortest_paths.js`](../../01_Shortest_Paths/02_Implementations/shortest_paths.js).
Both return `{ weight, edges }`, with `weight = -1` when the graph is disconnected.

---

## Alternatives and trade-offs

- **Brute force**: try every subset of n - 1 edges, keep those that connect everything,
  take the cheapest. O(C(E, n-1) * n): only a test oracle (see `bruteForce` in
  [problem 01](../03_Problems/solutions/01_minimum_spanning_tree_weight.js)).
- **Kruskal**: best when you are handed an edge list, or need to reason about single
  edges (critical / pseudo-critical, "is this edge in some MST?").
- **Prim with a heap**: best for adjacency lists and medium-density graphs.
- **Prim with an array (no heap)**: O(V^2), the winner for complete graphs such as
  "connect all points".
- **Boruvka** (advanced): each component picks its cheapest outgoing edge in rounds;
  O(E log V), parallelises well. Name it only if asked.

## Assumptions and limitations

- The graph must be **undirected**. For directed graphs the analogue is a minimum-cost
  arborescence (Chu-Liu/Edmonds), a different and harder algorithm.
- If the graph is **disconnected** there is no spanning tree; you get a minimum spanning
  *forest* instead. Our implementations return `weight: -1`.
- **Negative weights are fine** for MST (unlike Dijkstra): only the relative order of
  weights matters.
- With **equal weights** there can be several MSTs with the same total; Kruskal and Prim
  may pick different edges, but the total is always the same.
- MST minimises the **sum**. It also minimises the largest edge on the path between any two
  nodes (the "minimax" property), but it does **not** minimise the path sum between two
  nodes.
- The implementation needs `n >= 1`; there is no meaningful MST of an empty graph.

## Patterns / variations

### 1. Points in a plane -> complete graph

Build all pairs with Manhattan (or Euclidean) distance, then Kruskal or Prim.
Use when: Min Cost to Connect All Points.

### 2. Virtual node for "build a source anywhere"

If each node can also be served directly at a cost (a well, a power plant), add a
virtual node 0 connected to every node with that cost; run MST on n + 1 nodes.
Use when: Optimize Water Distribution in a Village.

### 3. Force an edge in / out

- MST **without** edge e: run Kruskal skipping e. If the weight rises (or no tree
  exists), e is **critical**.
- MST **with** edge e forced: union its endpoints first, add its weight, then run
  Kruskal. If the weight equals the MST weight, e is **pseudo-critical** (in some MST).
Use when: Find Critical and Pseudo-Critical Edges.

### 4. Maximum spanning tree

Sort descending (or negate weights). Same code.

### 5. Clustering

Run Kruskal but stop after n - k unions: you get k clusters whose inter-cluster
distance is maximised.

---

## Common mistakes & edge cases

- Confusing MST with shortest path. The MST path between two nodes can be much longer
  than their shortest path.
- Forgetting to check connectivity: if fewer than n - 1 edges are chosen, return -1 /
  "impossible".
- Prim: marking a node "in tree" when **pushing** instead of when **popping** - a node
  may be pushed several times with different weights; only the first pop counts.
- Kruskal: sorting in place when the caller still needs the original order (copy first).
- Points problems: generating both (i, j) and (j, i) doubles the edge list for no gain.
- Duplicate edges / self loops: self loops are skipped automatically by union-find
  (same set), duplicates by the second union returning false.

---

## When this does NOT apply

- "Cheapest route from A to B" -> [shortest paths](../../01_Shortest_Paths/01_Concepts/CONCEPTS.md).
- Directed graphs ("one-way pipes") -> not plain MST.
- "Connect only a chosen SUBSET of nodes, other nodes optional" -> Steiner tree,
  NP-hard; an MST over the subset is only an approximation.
- "Every node may have at most 2 connections" or other degree limits -> not MST
  (that is closer to a travelling-salesman path).
- "Minimum cost to connect sticks / ropes" (merge costs add up) -> a heap greedy, not MST.

---

## Interview tips

- First sentence: "Connect everything at minimum total cost - that is a minimum spanning
  tree, not a shortest path."
- Pick Kruskal when edges are handed to you as a list; pick Prim when you build the graph
  from points or an adjacency list. Say why.
- State the cut property in one sentence to justify the greedy choice.
- Mention that Kruskal needs union-find; write the tiny version by hand (10 lines).
- Complexity: "O(E log E) for the sort; union-find is effectively constant."

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Minimum Spanning Tree Weight (basic) | Easy | Kruskal and Prim on an edge list | 03_Problems/solutions/01_minimum_spanning_tree_weight.js |
| 02 | Min Cost to Connect All Points | Medium | complete graph of points, Prim / Kruskal | 03_Problems/solutions/02_min_cost_to_connect_all_points.js |
| 03 | Connecting Cities With Minimum Cost | Medium | Kruskal, detect disconnected | 03_Problems/solutions/03_connecting_cities_with_minimum_cost.js |
| 04 | Optimize Water Distribution in a Village | Hard | virtual node + Kruskal | 03_Problems/solutions/04_optimize_water_distribution.js |
| 05 | Find Critical and Pseudo-Critical Edges | Hard | Kruskal with forced include / exclude | 03_Problems/solutions/05_critical_and_pseudo_critical_edges.js |

---

## Practice more

Medium: Number of Operations to Make Network Connected (1319), Min Cost to Connect All
Points (1584), Path With Minimum Effort (1631, MST view), Remove Max Number of Edges to
Keep Graph Fully Traversable (1579)

Hard: Minimum Cost to Connect Sticks (1167, heap not MST - a good contrast),
Minimize Malware Spread (924), Checking Existence of Edge Length Limited Paths (1697),
Min Cost to Connect All Cities with Minimum Number of Roads (variant)
