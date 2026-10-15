# Shortest Paths

A **shortest path** is the cheapest way to get from one node to another, where "cheap"
means fewest edges (unweighted) or smallest total weight (weighted). Google Maps finds
the fastest route; a network router finds the lowest-latency path; a game AI finds the
shortest walk through a dungeon. Four classic algorithms cover every interview case, and
which one you pick depends on **weights**: none, non-negative, negative, or "all pairs".

## Prerequisites

- [Graphs](../../../23_Graphs/README.md): adjacency lists, directed vs undirected, weighted edges.
- [Graph Traversal](../../../24_Graph_Traversal/README.md): BFS gives shortest paths when every edge costs 1.
- [Heaps and Priority Queues](../../../19_Heaps_And_Priority_Queues/README.md): Dijkstra needs a min-heap.
- Helpful later: [Dynamic Programming](../../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md) (Bellman-Ford and Floyd-Warshall are DP on "number of edges" and "allowed intermediate nodes").

**Mental model.** Think of every edge as a road with a toll. Each node holds a sticky note
with "the cheapest total toll I know of so far" (`dist`). The only move any algorithm makes
is **relaxing** an edge: "if going through u makes v's note smaller, rewrite v's note".
The algorithms differ only in **which edges they relax, and in what order**.

---

## Why it matters / when to use

- "minimum cost / time / distance / effort to get from A to B"
- "fewest moves / steps" (unweighted) -> BFS, see [24_Graph_Traversal](../../../24_Graph_Traversal/README.md)
- "cheapest flight with at most k stops" -> Bellman-Ford limited to k rounds, or
  Dijkstra on (node, stops) state
- "network delay: how long until every node receives the signal" -> Dijkstra, take the max
- "path where the largest step is as small as possible" (min-max) -> Dijkstra variant
- "most probable path" (multiply probabilities) -> Dijkstra with max-heap
- "distance between every pair of cities" with small n -> Floyd-Warshall
- "can I get from A to B with negative edges" or "is there a negative cycle" -> Bellman-Ford
- grid where moving costs 0 or 1 -> 0-1 BFS

---

## How it works

### 1. Unweighted: BFS

Every edge costs 1, so the first time BFS reaches a node is the shortest way. O(V + E).

### 2. Non-negative weights: Dijkstra

BFS with a **priority queue** instead of a plain queue. Always expand the node with the
smallest known distance. Because no edge is negative, when a node is popped its
distance can never improve again - it is final.

```
   0 --4-- 1 --1-- 2        dist = [0, inf, inf, inf, inf]      heap = [(0, node 0)]
   |       |
   1       2                pop (0,0): relax 1 -> 4, 3 -> 1     heap = [(1,3), (4,1)]
   |       |                pop (1,3): relax 4 -> 1+5 = 6       heap = [(4,1), (6,4)]
   3 --5-- 4                pop (4,1): relax 2 -> 5, 4 -> 4+2=6 (not better)
                            pop (5,2): nothing
                            pop (6,4): done.   dist = [0, 4, 5, 1, 6]
```

```js
function dijkstra(adj, source) {                // adj[u] = [[v, w], ...]
  const dist = new Array(adj.length).fill(Infinity);
  dist[source] = 0;
  const heap = new MinHeap();
  heap.push([0, source]);
  while (!heap.isEmpty()) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;                  // stale entry (lazy deletion)
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; heap.push([dist[v], v]); }
    }
  }
  return dist;
}
```

**Why we need a heap - and why JavaScript makes you write it.** Dijkstra asks "which
node is closest?" up to V times. A plain array answers in O(V) (scan), giving O(V^2).
A binary heap answers in O(log V), giving O((V + E) log V). Python has `heapq`, Java has
`PriorityQueue`, C++ has `priority_queue`. JavaScript has **nothing built in**, so every
Dijkstra / Prim solution starts with a 30-line `MinHeap`. Learn it by heart; it lives
in [`02_Implementations/shortest_paths.js`](../02_Implementations/shortest_paths.js) and [19_Heaps_And_Priority_Queues](../../../19_Heaps_And_Priority_Queues/README.md).

**Lazy deletion**: we never update an entry inside the heap (that would need a
decrease-key operation). We just push a new, better entry and skip the stale one when it
pops (`if (d > dist[u]) continue`).

### Why Dijkstra fails with negative edges

```
0 --4--> 1
0 --5--> 2
2 --(-3)--> 1
```

Dijkstra pops node 1 at distance 4 and marks it final. Later it discovers 0 -> 2 -> 1 =
5 - 3 = 2, but the greedy promise "popped = final" was already broken. With lazy
re-pushes it may *happen* to fix this small case, but there is no guarantee and with a
negative **cycle** it loops forever. Rule: any negative edge -> **not** Dijkstra.

### 3. Negative weights: Bellman-Ford

Simple idea: **relax every edge, V - 1 times.** Relaxing edge (u, v, w) means
`if dist[u] + w < dist[v] then dist[v] = dist[u] + w`. After round i, every shortest
path with at most i edges is correct. A shortest path has at most V - 1 edges, so V - 1
rounds suffice.

Round V is the **negative-cycle check**: if anything still improves, there is a cycle
whose total weight is negative (you could loop forever and keep getting "shorter").

```js
function bellmanFord(n, edges, source) {
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  for (let round = 0; round < n - 1; round++)
    for (const [u, v, w] of edges)
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  const hasNegativeCycle = edges.some(([u, v, w]) => dist[u] + w < dist[v]);
  return { dist, hasNegativeCycle };
}
```

O(V * E) - slower than Dijkstra, but it works with negatives and the "at most k edges"
variant is just "run k rounds" (Cheapest Flights Within K Stops). Important detail for
the k-rounds variant: relax from a **copy** of the previous round so one round cannot
chain several edges.

### 4. All pairs: Floyd-Warshall

`dist[i][j]` for every pair. For each possible intermediate node `k`, check whether
going through k helps: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.

```js
for (let k = 0; k < n; k++)            // k MUST be the outer loop
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
```

O(V^3) time, O(V^2) space, three lines. Handles negative edges. Perfect when V <= ~400
and you need many queries (Find the City). `dist[i][i] < 0` reveals a negative cycle.

### 5. Weights 0 and 1: 0-1 BFS

Use a **deque**. Relaxing a 0-weight edge does not change the distance, so push that
node to the **front** (process it with the current level); a 1-weight edge goes to the
**back**. The deque stays sorted by distance like a heap would, with O(1) operations.
O(V + E). Used by Minimum Cost to Make at Least One Valid Path.

### 6. A* (brief)

Dijkstra plus a heuristic estimate `h(node)` of the remaining distance (e.g. Manhattan
distance on a grid). Pop by `dist + h`. Same code, much faster on big maps when the
heuristic is good. Rarely required in interviews, worth one sentence.

---

## Pseudocode (Essential)

```
DIJKSTRA(graph, source):                 # all weights >= 0
  dist[*] = INF; dist[source] = 0
  heap = {(0, source)}
  while heap not empty:
    (d, u) = pop smallest
    if d > dist[u]: continue             # stale entry
    for each edge (u, v, w):
      if d + w < dist[v]:
        dist[v] = d + w; push (dist[v], v)
  return dist

BELLMAN_FORD(n, edges, source):          # any weights
  dist[*] = INF; dist[source] = 0
  repeat n - 1 times:
    for each edge (u, v, w):
      if dist[u] != INF and dist[u] + w < dist[v]: dist[v] = dist[u] + w
  for each edge (u, v, w):               # one more round
    if dist[u] != INF and dist[u] + w < dist[v]: report NEGATIVE CYCLE
  return dist

FLOYD_WARSHALL(n, edges):                # all pairs
  dist[i][j] = 0 if i == j, w(i, j) if edge, INF otherwise
  for k in 0..n-1:                       # allowed intermediate node, OUTER loop
    for i in 0..n-1:
      for j in 0..n-1:
        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

## Dry run: Dijkstra step by step (Essential)

Graph (undirected): 0-1 (4), 1-2 (1), 0-3 (1), 1-4 (2), 3-4 (5). Source 0.

| Step | Popped (d, u) | Stale? | Relaxations | dist after step | Heap after step |
|------|---------------|--------|-------------|-----------------|-----------------|
| 0 | - | - | init | [0, ∞, ∞, ∞, ∞] | (0,0) |
| 1 | (0, 0) | no | 1: 0+4=4, 3: 0+1=1 | [0, 4, ∞, 1, ∞] | (1,3) (4,1) |
| 2 | (1, 3) | no | 4: 1+5=6 | [0, 4, ∞, 1, 6] | (4,1) (6,4) |
| 3 | (4, 1) | no | 2: 4+1=5; 4: 4+2=6 not < 6 | [0, 4, 5, 1, 6] | (5,2) (6,4) |
| 4 | (5, 2) | no | none better | [0, 4, 5, 1, 6] | (6,4) |
| 5 | (6, 4) | no | none better | [0, 4, 5, 1, 6] | empty |

## Dry run: Bellman-Ford with a negative edge

Directed edges in this order: 0->1 (4), 0->2 (5), 2->1 (-3). Source 0, n = 3.

| Round | Edge | dist[0] | dist[1] | dist[2] | Note |
|-------|------|---------|---------|---------|------|
| init | - | 0 | ∞ | ∞ | |
| 1 | 0->1 | 0 | 4 | ∞ | |
| 1 | 0->2 | 0 | 4 | 5 | |
| 1 | 2->1 | 0 | **2** | 5 | 5 - 3 = 2 beats 4 |
| 2 | all | 0 | 2 | 5 | nothing changes -> early exit |
| check | all | | | | no edge improves -> no negative cycle |

## Operations & complexity

| Algorithm | Weights | Time | Space | Negative cycles |
|-----------|---------|------|-------|-----------------|
| BFS | all equal | O(V + E) | O(V) | n/a |
| 0-1 BFS | 0 or 1 | O(V + E) | O(V) | n/a |
| Dijkstra (binary heap) | >= 0 | O((V + E) log V) | O(V + E) | wrong answers |
| Dijkstra (array, dense) | >= 0 | O(V^2) | O(V) | wrong answers |
| Bellman-Ford | any | O(V * E) | O(V) | detects |
| Floyd-Warshall | any, all pairs | O(V^3) | O(V^2) | detects (dist[i][i] < 0) |
| A* | >= 0 | depends on heuristic | O(V) | wrong answers |

---

## JavaScript implementation

Full code with tests: [`02_Implementations/shortest_paths.js`](../02_Implementations/shortest_paths.js) (`MinHeap`, `Deque`, `bfsShortest`,
`dijkstra`, `dijkstraWithPath`, `bellmanFord`, `floydWarshall`, `zeroOneBfs`).
Problems import `MinHeap` with `require('../../02_Implementations/shortest_paths')`.

The MinHeap core (binary heap stored in an array; parent of i is `(i - 1) >> 1`,
children are `2i + 1` and `2i + 2`):

```js
class MinHeap {
  #data = [];
  push(item) { this.#data.push(item); this.#siftUp(this.#data.length - 1); }
  pop() {
    const top = this.#data[0], last = this.#data.pop();
    if (this.#data.length) { this.#data[0] = last; this.#siftDown(0); }
    return top;
  }
  #siftUp(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.#data[p][0] <= this.#data[i][0]) break;
      [this.#data[p], this.#data[i]] = [this.#data[i], this.#data[p]];
      i = p;
    }
  }
  #siftDown(i) { /* swap with the smaller child until in place */ }
}
```

---

## Alternatives and trade-offs

| Need | Simplest correct option | Better option | Why |
|------|-------------------------|---------------|-----|
| one source, unweighted | DFS trying every path (exponential) | BFS, O(V + E) | first arrival = fewest edges |
| one source, weights >= 0 | Bellman-Ford O(V * E) | Dijkstra O((V + E) log V) | greedy "popped = final" is valid |
| weights 0 or 1 | Dijkstra | 0-1 BFS O(V + E) | deque replaces the heap |
| negative edges | - | Bellman-Ford (or SPFA in practice) | Dijkstra's greedy promise breaks |
| all pairs, small n | V runs of Dijkstra O(V (V + E) log V) | Floyd-Warshall O(V^3) | tiny code, handles negatives |
| all pairs, big sparse graph with negatives | V runs of Bellman-Ford | Johnson's algorithm (reweight, then V x Dijkstra) | advanced; name it only |
| one target on a huge map | Dijkstra | A* with an admissible heuristic | explores far fewer nodes |

**Brute force** (try every simple path with DFS) is O(V!) in the worst case. It is only a
test oracle for tiny graphs, never an interview answer.

## Assumptions and limitations of each algorithm

- **BFS**: every edge must cost the same. One heavier edge and the answer is wrong.
- **Dijkstra**: all weights must be **non-negative**. It cannot detect negative cycles.
  With lazy deletion the heap can hold up to E entries, so space is O(V + E).
- **Bellman-Ford**: works with negative edges and **detects** a negative cycle that is
  reachable from the source. If such a cycle exists, the distances it reports for nodes
  "behind" the cycle are meaningless (they are really -infinity). Slow: O(V * E).
- **Floyd-Warshall**: O(V^3) time and O(V^2) memory, so only for V up to a few hundred.
  With a negative cycle, entries can be wrong; check `dist[i][i] < 0`.
- **0-1 BFS**: weights must be exactly 0 or 1 (or two values you can rescale).
- **A\***: the heuristic must never over-estimate (admissible), or it can return a
  non-shortest path.
- Our JS implementations use plain numbers; sums above 2^53 lose precision (use BigInt).
- The recursion-free implementations here are safe for large V; there is no call-stack risk.

## Patterns / variations

### 1. Dijkstra with a different "distance"

The relaxation rule is the only thing that changes:

| Problem | dist meaning | relax rule | heap |
|---------|--------------|-----------|------|
| Network Delay | sum of weights | `d + w` | min |
| Path With Minimum Effort | max edge on path | `Math.max(d, w)` | min |
| Swim in Rising Water | max cell on path | `Math.max(d, grid[r][c])` | min |
| Path With Maximum Probability | product | `d * p` | **max** (push `-p`) |

### 2. State = (node, extra)

When the rules depend on something besides position (stops left, obstacles eliminated,
keys held), the graph node is the **pair**. Dijkstra / BFS over the state space.
Shortest Path with Obstacles Elimination: state (r, c, obstaclesLeft).

### 3. Count the shortest paths

Carry `ways[v]` next to `dist[v]`. On a strictly better distance: `ways[v] = ways[u]`.
On an equal distance: `ways[v] += ways[u]`. (Number of Ways to Arrive at Destination.)

### 4. Bellman-Ford with k rounds

```js
for (let round = 0; round <= k; round++) {
  const next = [...dist];                                 // copy!
  for (const [u, v, w] of edges) if (dist[u] + w < next[v]) next[v] = dist[u] + w;
  dist = next;
}
```

### 5. Grid Dijkstra

Nodes are cells; neighbours via `DIRS`; weight is the cost of entering the cell.
Same code, `id = r * cols + c` or just push `[d, r, c]`.

---

## Common mistakes & edge cases

- Using Dijkstra with negative edges. It does not crash; it returns wrong numbers.
- Forgetting the stale-entry check `if (d > dist[u]) continue;` -> still correct, but
  O(E log E) extra work and possible TLE.
- Using `Array.sort()` inside the loop as a fake priority queue -> O(V^2 log V).
- Bellman-Ford k-rounds without copying the array (edges chain within one round).
- Floyd-Warshall with `k` as the inner loop - wrong answers.
- `Infinity + w` is fine in JS, but `Infinity - Infinity` is NaN; guard
  `dist[u] !== Infinity` in Bellman-Ford.
- Unreachable target: return -1 / Infinity explicitly; check before using the value.
- Network Delay: answer is the **max** of all distances, and -1 if any is Infinity.
- Min-max problems: the relax operation is `max`, not `+`.

---

## When this does NOT apply

- "Connect every node at minimum TOTAL cost" -> that is a [minimum spanning tree](../../02_Minimum_Spanning_Trees/01_Concepts/CONCEPTS.md), not a shortest path.
- "Longest path" in a general graph is NP-hard; only on a DAG can you do it (topological
  order + DP, see [26_Topological_Sorting](../../../26_Topological_Sorting/README.md)).
- "Visit every node once with minimum cost" (travelling salesman) is not a shortest-path
  problem; with n <= ~15 it becomes bitmask DP / BFS on (node, mask).
- Negative edges -> no Dijkstra. Negative cycle reachable from the source -> "shortest"
  is undefined; report the cycle instead.
- Path quality that is not monotone (adding an edge can make the cost go down, e.g. some
  "average weight" objectives) breaks the greedy invariant of Dijkstra.

---

## Interview tips

- First question to ask yourself out loud: "Are the edges weighted? Any negative?"
  That alone picks the algorithm.
- Say "Dijkstra with a min-heap, O((V + E) log V)" and then say "JavaScript has no
  built-in heap, so I'll write a small one" - the interviewer will often let you stub it.
- For Dijkstra, explain the invariant: "when I pop a node, its distance is final because
  all weights are non-negative."
- For Bellman-Ford, explain "V - 1 rounds because a shortest path has at most V - 1 edges".
- Mention Floyd-Warshall only when n is small (<= a few hundred) and all pairs are needed.
- If the grid has 0/1 costs, mention 0-1 BFS as the linear-time option.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Network Delay Time | Medium | Dijkstra, max of dist | 03_Problems/solutions/01_network_delay_time.js |
| 02 | Cheapest Flights Within K Stops | Medium | Bellman-Ford k rounds | 03_Problems/solutions/02_cheapest_flights_within_k_stops.js |
| 03 | Path With Minimum Effort | Medium | Dijkstra min-max on grid | 03_Problems/solutions/03_path_with_minimum_effort.js |
| 04 | Path With Maximum Probability | Medium | Dijkstra with max-heap / product | 03_Problems/solutions/04_path_with_maximum_probability.js |
| 05 | Swim in Rising Water | Hard | Dijkstra min-max on grid | 03_Problems/solutions/05_swim_in_rising_water.js |
| 06 | Number of Ways to Arrive at Destination | Medium | Dijkstra + path counting | 03_Problems/solutions/06_number_of_ways_to_arrive_at_destination.js |
| 07 | Find the City With the Smallest Number of Neighbors | Medium | Floyd-Warshall | 03_Problems/solutions/07_find_the_city.js |
| 08 | Minimum Cost to Make at Least One Valid Path | Hard | 0-1 BFS | 03_Problems/solutions/08_minimum_cost_valid_path.js |
| 09 | Shortest Path in a Grid with Obstacles Elimination | Hard | BFS on (r, c, k) state | 03_Problems/solutions/09_shortest_path_with_obstacles_elimination.js |
| 10 | Reachable Nodes in Subdivided Graph | Hard | Dijkstra + edge accounting | 03_Problems/solutions/10_reachable_nodes_in_subdivided_graph.js |

---

## Practice more

Medium: Minimum Cost to Reach City With Discounts (2093), Number of Restricted Paths
From First to Last Node (1786), Minimum Obstacle Removal to Reach Corner (2290, 0-1 BFS),
Minimum Time to Reach Destination (2577), Second Minimum Time to Reach Destination (2045),
Design Graph With Shortest Path Calculator (2642), Shortest Path with Alternating Colors
(1129), Minimum Score of a Path Between Two Cities (2492)

Hard: Minimum Cost to Reach Destination in Time (1928), Trapping Rain Water II (407),
Modify Graph Edge Weights (2699), Minimum Weighted Subgraph With the Required Paths (2203),
Number of Ways to Reach a Position (variant), The Maze III (499)
