# 14. Graph Traversal & Shortest Paths

A graph is nodes plus edges. Many problems hide the graph: cells of a grid, words that differ by
one letter, lock combinations, accounts sharing an email. Once you see the graph, three tools
solve most problems:

- **DFS / BFS** for reachability, components, flood fill, cycle checks.
- **BFS** for the shortest path when every edge costs the same (counting steps).
- **Dijkstra** (BFS with a min-heap) for shortest paths with **non-negative** weights; **Bellman-Ford** when weights can be negative or the number of edges is limited.

Always keep a `visited` set: graphs can have cycles.

**Teaches in depth:** [Graphs](../../../23_Graphs/README.md), [Graph Traversal](../../../24_Graph_Traversal/README.md), [Shortest Paths](../../../25_Graph_Algorithms/01_Shortest_Paths/README.md)

---

## 1. Recognition clues

| Words in the problem | Tool |
|---|---|
| "connected", "reachable", "number of components / provinces" | DFS or BFS (or union-find, [16](16_union_find.md)) |
| "minimum number of steps / moves / transformations" | BFS (unweighted) |
| "nearest X for every cell", "spread from many sources" | multi-source BFS |
| "cheapest", "minimum time / cost / effort" with weights | Dijkstra |
| "negative weights", "at most k stops / edges" | Bellman-Ford (k rounds) |
| "all pairs", n <= 400 | Floyd-Warshall O(n^3) |
| "edge weights are only 0 or 1" | 0-1 BFS with a deque |
| "clone the graph" | traversal + map old -> new |

**Constraint hints**

- V, E up to 10^5 -> O(V + E) traversal or O(E log V) Dijkstra. Not Floyd-Warshall.
- Grid R x C -> V = R*C, E ≈ 4V.

## 2. When it applies (preconditions)

- You can list the neighbors of a node (adjacency list, grid directions, or a generator function).
- For BFS shortest paths: all edges have the **same** cost.
- For Dijkstra: all edge weights are **>= 0**.

## 3. When it does NOT apply

- **BFS with weighted edges.** Edges A->B (10), A->C (1), C->B (1). BFS reaches B in 1 step (cost 10) and stops, but A->C->B costs 2. Use Dijkstra.
- **Dijkstra with negative edges.** A->B (2), A->C (3), C->B (-2). Dijkstra finalizes B at 2 before seeing A->C->B = 1. Use Bellman-Ford.
- **Longest simple path** in a general graph is NP-hard. Only in a DAG is it easy (DP over a topological order, [15](15_topological_sort.md)).
- **DFS for shortest paths.** DFS finds *a* path, not the shortest one.

## 4. The template

```js
function bfsGraph(graph, start) {                 // graph: Map node -> neighbors
  const dist = new Map([[start, 0]]);
  const queue = [start];
  let head = 0;                                   // index pointer instead of shift()
  while (head < queue.length) {
    const node = queue[head++];
    for (const next of graph.get(node) || []) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(node) + 1);
        queue.push(next);
      }
    }
  }
  return dist;
}

function dijkstra(graph, source) {                // graph: Map node -> [[neighbor, weight], ...]
  const dist = new Map();
  const heap = new MinHeap((a, b) => a[0] - b[0]); // [distance, node]
  heap.push([0, source]);
  while (heap.size()) {
    const [d, node] = heap.pop();
    if (dist.has(node)) continue;                 // already finalized with a shorter distance
    dist.set(node, d);
    for (const [next, weight] of graph.get(node) || []) {
      if (!dist.has(next)) heap.push([d + weight, next]);
    }
  }
  return dist;
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`bfsGraph`, `dfsGraph`, `buildAdjList`, `dijkstra`, `bfsGrid`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`countComponents`, `bellmanFord`) and [tests/patterns.test.js](../../tests/patterns.test.js) (Dijkstra vs Bellman-Ford on random graphs).

**Dry run** `dijkstra`: edges 0->1 (4), 0->2 (1), 2->1 (2), 1->3 (1):

| pop [d, node] | finalized | pushes |
|---|---|---|
| [0, 0] | 0:0 | [4,1], [1,2] |
| [1, 2] | 2:1 | [3,1] |
| [3, 1] | 1:3 | [4,3] |
| [4, 1] | skip (done) | — |
| [4, 3] | 3:4 | — |

## 5. Variations

- **Grid BFS:** neighbors are the 4 directions; `visited` as a 2D boolean array.
- **Multi-source BFS:** push every source with distance 0 first (Rotting Oranges, 01 Matrix).
- **BFS on implicit graphs:** generate neighbors on the fly (Word Ladder, Open the Lock — see [22](22_state_space_search_and_pruning.md)).
- **Dijkstra on a grid / with state:** node = `(r, c)` or `(node, stopsUsed)`.
- **Minimax path (Path With Minimum Effort):** Dijkstra where the path cost is `max` of edges instead of sum.
- **Bipartite check:** BFS/DFS 2-coloring.

## 6. Common pitfalls

1. `queue.shift()` is O(n). On 10^5 nodes BFS becomes O(n^2). Use a head index.
2. Marking visited when **popping** instead of when **pushing** in BFS — nodes get queued many times.
3. Building adjacency with `new Array(n).fill([])` — every node shares one array. Use `Array.from({ length: n }, () => [])`.
4. Forgetting edges go both ways in an undirected graph.
5. Dijkstra without the "skip if already finalized" check: still correct but slower, and wrong if you update on stale entries.
6. Recursive DFS on 10^5 nodes overflows the JS stack. Use an explicit stack.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Find if Path Exists in Graph | Easy | reachability | [statement](../../../24_Graph_Traversal/03_Problems/01_Easy/03_find_if_path_exists.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/03_find_if_path_exists.js) |
| 2 | Number of Islands | Medium | components on a grid | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/05_number_of_islands.js) |
| 3 | Clone Graph | Medium | traversal + map | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/09_clone_graph.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/09_clone_graph.js) |
| 4 | Rotting Oranges | Medium | multi-source BFS | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/10_rotting_oranges.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/10_rotting_oranges.js) |
| 5 | Pacific Atlantic Water Flow | Medium | reverse BFS from both oceans | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/14_pacific_atlantic_water_flow.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/14_pacific_atlantic_water_flow.js) |
| 6 | Shortest Path in Binary Matrix | Medium | BFS 8 directions | [statement](../../../24_Graph_Traversal/03_Problems/02_Medium/16_shortest_path_in_binary_matrix.md) · [solution](../../../24_Graph_Traversal/03_Problems/solutions/16_shortest_path_in_binary_matrix.js) |
| 7 | Network Delay Time | Medium | Dijkstra | [statement](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/01_network_delay_time.md) · [solution](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/solutions/01_network_delay_time.js) |
| 8 | Cheapest Flights Within K Stops | Medium | Bellman-Ford k rounds | [statement](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/02_cheapest_flights_within_k_stops.md) · [solution](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/solutions/02_cheapest_flights_within_k_stops.js) |
| 9 | Path With Minimum Effort | Medium | Dijkstra with max | [statement](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/03_path_with_minimum_effort.md) · [solution](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/solutions/03_path_with_minimum_effort.js) |
| 10 | Is Graph Bipartite | Medium | 2-coloring | [statement](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/02_Medium/01_is_graph_bipartite.md) · [solution](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/solutions/01_is_graph_bipartite.js) |

## 8. Self-check

**Q1.** Why does BFS give shortest paths in unweighted graphs?

<details><summary>Answer</summary>

BFS visits nodes in order of distance: all nodes at distance d are dequeued before any at distance d + 1. The first time a node is reached is therefore along a shortest path.

</details>

**Q2.** What is Dijkstra's complexity with a binary heap?

<details><summary>Answer</summary>

O((V + E) log V) — each edge may push one heap entry (O(log) each), and each node is finalized once.

</details>

**Q3.** "Cheapest flight with at most k stops" — why not plain Dijkstra?

<details><summary>Answer</summary>

The cheapest path may use too many stops, and a more expensive path with fewer stops may be the only valid one. Dijkstra keyed only by cost throws that path away. Use Bellman-Ford for k + 1 rounds (copying the distance array each round), or Dijkstra over `(node, stops)` states.

</details>

---

Previous: [13. Tree Traversal & Tree Properties](13_tree_traversal_and_properties.md) · Next: [15. Topological Sort](15_topological_sort.md) · [Pattern index](../../README.md)
