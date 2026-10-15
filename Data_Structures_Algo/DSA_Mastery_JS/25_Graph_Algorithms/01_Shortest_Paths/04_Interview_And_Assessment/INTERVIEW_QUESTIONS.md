# Shortest Paths — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [quiz](QUIZ.md).

---

### 1. How do you choose between BFS, Dijkstra, Bellman-Ford, Floyd-Warshall and 0-1 BFS?

<details><summary>Model answer</summary>

Ask two questions: *what are the weights?* and *how many sources?*

- All edges cost the same -> BFS, O(V + E).
- Weights only 0 or 1 -> 0-1 BFS with a deque, O(V + E).
- Non-negative weights, one source -> Dijkstra with a min-heap, O((V + E) log V).
- Negative weights, or you must detect a negative cycle -> Bellman-Ford, O(V * E).
- All pairs and V is small (a few hundred) -> Floyd-Warshall, O(V^3).

</details>

### 2. Why is a node's distance final when Dijkstra pops it?

<details><summary>Model answer</summary>

When u is popped, its distance d is the smallest in the heap. Every other route to u
must leave the set of finished nodes through some node x still in the heap, with
`dist[x] >= d`. Every remaining edge is non-negative, so the rest of that route can only
add cost. So no route can beat d. This argument needs **non-negative** weights. One
negative edge breaks it.

</details>

### 3. Show a graph where Dijkstra gives the wrong answer.

<details><summary>Model answer</summary>

Directed: A->B (2), A->C (3), C->B (-2). Dijkstra pops B at 2 and calls it final. The
real shortest path is A->C->B = 1. A version that never re-processes a popped node
returns 2, which is wrong. A lazy version may re-push B and fix this tiny case, but then
the O((V + E) log V) bound is lost, and with a negative cycle it never stops.

</details>

### 4. Why does Bellman-Ford run exactly V - 1 rounds, and what does round V tell you?

<details><summary>Model answer</summary>

A shortest simple path has at most V - 1 edges. After round i, every shortest path that
uses at most i edges is correct (induction: round i extends the correct (i-1)-edge
prefixes by one edge). So V - 1 rounds are enough. If round V still improves some
distance, a shorter walk with V or more edges exists. Such a walk repeats a node, so it
contains a cycle, and that cycle must have negative total weight.

</details>

### 5. What is "lazy deletion" in Dijkstra and why do we use it in JavaScript?

<details><summary>Model answer</summary>

A binary heap has no cheap decrease-key unless you track each node's position. Instead,
when a distance improves we just push a new `[dist, node]` entry. When an old, larger
entry pops later we skip it with `if (d > dist[u]) continue`. The heap can hold up to E
entries, so the cost is O(E log E). Since log E <= 2 log V, that is the same as O(E log V).
JavaScript has no built-in priority queue, so this keeps the heap code tiny.

</details>

### 6. Cheapest Flights Within K Stops: why copy the distance array in each Bellman-Ford round?

<details><summary>Model answer</summary>

A round should add **at most one edge** to every path. If you update `dist` in place,
an edge relaxed early in the round can feed another edge later in the same round. Then
one round can chain several flights and break the "at most k + 1 flights" limit. Relax
from `prev` and write into `next = [...prev]`.

</details>

### 7. How do you adapt Dijkstra to "minimise the largest step" (Path With Minimum Effort)?

<details><summary>Model answer</summary>

Only the relaxation changes: `candidate = Math.max(d, |h[u] - h[v]|)` instead of
`d + w`. Dijkstra still works because the cost never goes **down** as a path gets longer
(max is monotone, like adding non-negative weights). Two other answers also work:
binary search on the answer with BFS, or union-find that adds edges in sorted order
until start and end connect.

</details>

### 8. How do you count the number of shortest paths?

<details><summary>Model answer</summary>

Keep `ways[]` next to `dist[]`. Set `ways[source] = 1`. When relaxing u->v: if
`d + w < dist[v]`, set `dist[v] = d + w` and **reset** `ways[v] = ways[u]`. If
`d + w === dist[v]`, do `ways[v] += ways[u]`. Skip stale heap entries, or you will count
paths twice. Take a modulo if the counts get big.

</details>

### 9. Why must `k` be the outermost loop in Floyd-Warshall?

<details><summary>Model answer</summary>

The DP state is "shortest i->j path using only nodes 0..k as stops in the middle".
Layer k is built from layer k-1. If k is an inner loop, you combine `dist[i][k]` values
that are not finished yet, and the answers can be wrong. With k outermost, every
`dist[i][k]` and `dist[k][j]` already uses all of 0..k-1 as possible stops.

</details>

### 10. How does 0-1 BFS keep the deque sorted?

<details><summary>Model answer</summary>

At any moment the deque holds nodes whose distances are only d or d + 1. Front = d,
back = d + 1. A 0-edge gives a neighbour the same distance d, so it goes to the front. A
1-edge gives d + 1, so it goes to the back. The front is always a smallest distance,
just like a heap's top, but each operation is O(1).

</details>

### 11. When would you model the graph as (node, extra state)? Give the cost.

<details><summary>Model answer</summary>

Use it when the rule for moving depends on more than your position: stops used,
obstacles you can still remove, keys held, nodes visited. Each node becomes a tuple, and
the visited set must cover the whole tuple. The cost is (positions × extra values) times
the branching factor. Example: obstacles elimination is O(m · n · k).

</details>

### 12. How would you get the path itself, not just its length?

<details><summary>Model answer</summary>

Store `prev[v] = u` every time v's distance improves. At the end, walk back from the
target through `prev` until you reach the source, then reverse the list. If the target's
distance is still Infinity, return an empty path. See `dijkstraWithPath` in
[shortest_paths.js](../02_Implementations/shortest_paths.js).

</details>

### 13. A* vs Dijkstra — when and why?

<details><summary>Model answer</summary>

A* pops by `dist + h(node)`, where h is an estimate of the distance left to the target.
If h never over-estimates (it is admissible), A* still finds the shortest path, and it
explores far fewer nodes on big maps (for example, Manhattan distance on a grid). It only
helps with a single target. With h = 0 it is exactly Dijkstra.

</details>

### 14. What do you clarify before coding a shortest-path problem?

<details><summary>Model answer</summary>

- Directed or undirected? Can there be parallel edges or self-loops?
- Can weights be negative or zero? Can there be cycles?
- Are nodes 0- or 1-indexed?
- What should I return if the target is unreachable (-1, Infinity, 0)?
- One source or all pairs? How big are V and E? (This decides between heap and array Dijkstra, or Floyd-Warshall.)
- Can the answer overflow 2^53 (so I need BigInt or a modulo)?

</details>
