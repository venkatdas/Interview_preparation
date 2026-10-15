# Advanced Graphs

This folder collects the graph techniques that show up in the hardest interview rounds:
bipartite checks, strongly connected components, bridges and articulation points,
Eulerian paths, and the general idea of a **state-space graph** (a node is more than a
position). Each one is a short algorithm on top of DFS/BFS - the difficulty is in
recognising when to use it.

## Prerequisites

- [Graphs](../../../23_Graphs/README.md) and [Graph Traversal](../../../24_Graph_Traversal/README.md): you must be fluent with BFS, recursive DFS and visited arrays.
- [Topological Sorting](../../../26_Topological_Sorting/README.md): the SCC condensation is a DAG you then topologically sort.
- [Union-Find](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md): for the bipartite "enemy" trick and weighted ratios.
- [Shortest Paths](../../01_Shortest_Paths/README.md): for the state-space Dijkstra problems.

**Mental model.** Every algorithm here is "DFS plus one extra number per node":
a colour (bipartite), a discovery time and a low-link (SCC, bridges, articulation points),
or an edge pointer (Hierholzer). Learn plain DFS cold, then learn what the extra number
means.

---

## Why it matters / when to use

- "split people into two groups so no two who dislike each other share a group" -> bipartite
- "can the graph be 2-coloured", "is there an odd cycle" -> bipartite
- "which nodes can reach each other in both directions" (directed) -> SCC
- "collapse cycles into single nodes, then it is a DAG" -> SCC condensation
- "which connection, if it fails, splits the network" -> bridges
- "which server, if it goes down, splits the network" -> articulation points
- "use every ticket / edge exactly once", "reconstruct the itinerary" -> Eulerian path
- "shortest path but you also carry keys / fuel / a visited set / stops left" -> state graph
- "minimum vertices to reach all nodes", "safe states", "evaluate division" -> plain graph
  modelling with a twist

---

## How it works

### 1. Bipartite check (2-colouring)

A graph is bipartite if you can colour every node red or blue with no edge joining two
nodes of the same colour. Equivalent: it has **no odd-length cycle**.

```
bipartite (even cycle)      not bipartite (triangle)
  R --- B                     R --- B
  |     |                      \   /
  B --- R                        ?    <- must be both R and B
```

BFS from each uncoloured node, colour neighbours the opposite colour, fail if a
neighbour already has the same colour. O(V + E).

```js
color[v] === -1 ? (color[v] = 1 - color[u], queue.push(v)) : color[v] === color[u] && fail
```

Union-find alternative: for each edge (u, v), `union(u, enemyOf(v))` and
`union(v, enemyOf(u))` using a UF of size 2n; fail if `find(u) === find(v)`.

### 2. Strongly connected components (directed)

An SCC is a maximal set of nodes where every node can reach every other. Shrinking each
SCC to a single node leaves a DAG ("condensation graph"), which is why SCC is often the
first step before a topological-sort style DP.

```
0 -> 1 -> 2 -> 0      2 -> 3      3 <-> 4      5
SCCs: {0,1,2}  {3,4}  {5}
```

**Kosaraju** (easy to explain, two passes):
1. DFS the graph, record nodes by **finish time**.
2. Reverse every edge.
3. DFS the reversed graph in **decreasing finish time**; each DFS tree = one SCC.
Why it works: the last node to finish is in a "source" SCC of the condensation. Reversed
edges cannot escape that SCC, so the DFS collects exactly it.

**Tarjan** (one pass, the one to memorise):
- `ids[u]` = discovery order, `low[u]` = smallest id reachable from u via the DFS tree
  plus at most one back edge to a node **still on the stack**.
- After exploring u, if `low[u] === ids[u]`, u is the root of an SCC: pop the stack down
  to u.

```js
function dfs(u) {
  ids[u] = low[u] = timer++; stack.push(u); onStack[u] = true;
  for (const v of adj[u]) {
    if (ids[v] === -1) { dfs(v); low[u] = Math.min(low[u], low[v]); }
    else if (onStack[v]) low[u] = Math.min(low[u], ids[v]);
  }
  if (low[u] === ids[u]) { /* pop until u -> one SCC */ }
}
```

### 3. Bridges and articulation points (undirected, Tarjan low-link)

Same `ids` / `low` idea on an undirected graph, skipping the edge we arrived by.

- **Bridge** (u, v), v a DFS child: `low[v] > ids[u]`. Nothing below v can reach u or
  above except through u-v itself.
- **Articulation point** u (non-root): some child v has `low[v] >= ids[u]`. The root is
  one iff it has 2+ DFS children.

```
0 - 1 - 2 - 0   (triangle)     1 - 3     3 - 4
ids: 0:0 1:1 2:2 3:3 4:4
low[2] = 0 (back edge to 0)  -> edge 1-2 not a bridge
low[3] = 3 > ids[1] = 1      -> edge 1-3 IS a bridge; node 1 is an articulation point
low[4] = 4 > ids[3] = 3      -> edge 3-4 IS a bridge; node 3 is an articulation point
```

Note the `>` for bridges vs `>=` for articulation points, and skip the **parent edge by
index** (not by node) so parallel edges are handled.

### 4. Eulerian path (Hierholzer)

A path that uses **every edge exactly once**. Exists in a directed graph iff:
- every node has in-degree == out-degree (circuit), or
- exactly one node has out = in + 1 (start) and one has in = out + 1 (end).

Hierholzer: walk greedily from the start, always taking an unused edge. When you get
stuck, that node is **done** - append it to the result and backtrack. The result in
reverse is the Eulerian path. O(E).

```js
function hierholzer(adj, start) {           // adj: Map<node, [neighbours in order]>
  const path = [], stack = [start], ptr = new Map();
  while (stack.length) {
    const u = stack.at(-1), edges = adj.get(u) ?? [], i = ptr.get(u) ?? 0;
    if (i < edges.length) { ptr.set(u, i + 1); stack.push(edges[i]); }
    else path.push(stack.pop());
  }
  return path.reverse();
}
```

Reconstruct Itinerary = Hierholzer from "JFK" with neighbours sorted.

### 5. Cycle detection recap

| Graph | Method | Signal |
|-------|--------|--------|
| directed | DFS with WHITE/GRAY/BLACK | reaching a GRAY node |
| directed | Kahn's algorithm | processed count < n |
| undirected | DFS with parent | reaching a visited node that is not the parent |
| undirected | union-find | `union(u, v)` returns false |

### 6. Grid-as-graph tricks

- `id = r * cols + c` turns a cell into an integer node (for union-find or arrays).
- `DIRS` array for neighbours; 8-direction variant for "king moves".
- "Start from the border and work inward" (Surrounded Regions, Pacific Atlantic).
- Multi-source BFS from all targets instead of per-cell BFS.
- Transform the grid: a dungeon with doors and keys becomes a graph of (cell, keys).

### 7. State-space graphs

When the rules depend on more than position, the **node is a tuple**:

| Problem | State | Size |
|---------|-------|------|
| Cheapest Flights Within K Stops | (city, stopsUsed) | n * (k + 2) |
| Shortest Path with Obstacle Elimination | (r, c, eliminationsLeft) | m * n * k |
| Shortest Path Visiting All Nodes | (node, visitedMask) | n * 2^n |
| Shortest Path to Get All Keys | (r, c, keysMask) | m * n * 2^k |
| Bus Routes | route (not stop!) | number of routes |

BFS when every step costs 1, Dijkstra when steps have weights. The "visited" set must be
over the full state, not just the position.

---

## Pseudocode (Essential)

```
TARJAN_SCC(n, adj):
  timer = 0; ids[*] = -1; stack = []
  for u in 0..n-1: if ids[u] == -1: dfs(u)
  dfs(u):
    ids[u] = low[u] = timer++; push u; onStack[u] = true
    for v in adj[u]:
      if ids[v] == -1: dfs(v); low[u] = min(low[u], low[v])
      else if onStack[v]: low[u] = min(low[u], ids[v])
    if low[u] == ids[u]: pop until u -> one SCC

KOSARAJU_SCC(n, adj):
  DFS everything, push each node when it FINISHES -> order
  build reversed graph
  for u in reverse(order): if unvisited: DFS on reversed graph -> one SCC

BRIDGES(n, edges):                         # undirected
  dfs(u, parentEdge):
    ids[u] = low[u] = timer++
    for (v, e) in adj[u]:
      if e == parentEdge: continue
      if ids[v] == -1: dfs(v, e); low[u] = min(low[u], low[v])
                       if low[v] > ids[u]: (u, v) is a bridge
      else: low[u] = min(low[u], ids[v])

HIERHOLZER(adj, start):                    # Eulerian path, directed
  stack = [start]; path = []
  while stack: u = top
    if u has an unused edge (u, v): mark used; push v
    else: path.append(pop)
  return reverse(path)
```

## Dry run: Tarjan SCC as a table (Essential)

Directed graph: 0->1, 1->2, 2->0, 2->3, 3->4, 4->3. Start dfs(0).

| Step | Event | ids | low | stack | SCC emitted |
|------|-------|-----|-----|-------|-------------|
| 1 | visit 0 | 0:0 | 0:0 | [0] | |
| 2 | visit 1 | 1:1 | 1:1 | [0,1] | |
| 3 | visit 2 | 2:2 | 2:2 | [0,1,2] | |
| 4 | 2 sees 0 on stack | | 2:0 | | |
| 5 | visit 3 (from 2) | 3:3 | 3:3 | [0,1,2,3] | |
| 6 | visit 4 | 4:4 | 4:4 | [0,1,2,3,4] | |
| 7 | 4 sees 3 on stack | | 4:3 | | |
| 8 | 4 done, low 3 != id 4 | | | | |
| 9 | back in 3: low[3] = min(3, 3) | | 3:3 | | |
| 10 | 3 done, low == id | | | [0,1,2] | {4, 3} |
| 11 | back in 2: low[2] = min(0, 3) = 0 | | 2:0 | | |
| 12 | back in 1: low[1] = 0; back in 0: low == id | | | [] | {2, 1, 0} |

Node 5 (isolated) is visited by the outer loop and forms {5}. SCCs come out in
**reverse topological order** of the condensation ({3,4} before {0,1,2}).

## Operations & complexity

| Algorithm | Time | Space | Graph type |
|-----------|------|-------|------------|
| bipartite BFS | O(V + E) | O(V) | undirected |
| Tarjan SCC | O(V + E) | O(V) | directed |
| Kosaraju SCC | O(V + E) | O(V + E) (reversed graph) | directed |
| bridges | O(V + E) | O(V) | undirected |
| articulation points | O(V + E) | O(V) | undirected |
| Hierholzer | O(E) | O(E) | directed (undirected variant similar) |
| BFS over (node, mask) | O(2^n * n^2) | O(2^n * n) | state space |

---

## JavaScript implementation

Full code with tests: [`02_Implementations/advanced_graph_algorithms.js`](../02_Implementations/advanced_graph_algorithms.js) (`isBipartite`, `tarjanSCC`,
`kosarajuSCC`, `findBridges`, `articulationPoints`, `hierholzer`). Problems import them
with `require('../../02_Implementations/advanced_graph_algorithms')`.

---

## Alternatives and trade-offs

| Task | Brute force | Better | Trade-off |
|------|-------------|--------|-----------|
| bipartite | try all 2^n colourings | BFS/DFS colouring O(V + E) | union-find "enemy" trick is also O(E α) and works online (edges arriving one by one) |
| SCC | reachability from every node, O(V (V + E)) | Tarjan (1 pass) or Kosaraju (2 passes + reversed graph) | Kosaraju is easier to explain, Tarjan uses less memory |
| bridges | remove each edge, recheck connectivity, O(E (V + E)) | Tarjan low-link O(V + E) | brute force is a perfect test oracle |
| articulation points | remove each vertex, recheck, O(V (V + E)) | low-link with `>=` and the root rule | same DFS as bridges |
| Eulerian path | backtracking over edge orders (exponential) | Hierholzer O(E) | check the degree conditions first |

## Assumptions and limitations

- **isBipartite** expects an undirected adjacency list (both directions present). It
  checks every component. A self-loop makes a graph non-bipartite.
- **tarjanSCC / kosarajuSCC** are for **directed** graphs. On an undirected graph they just
  return connected components. Both are recursive: JavaScript's call stack overflows
  around 10^4 to 10^5 deep, so very long chains need an iterative rewrite.
- **findBridges** skips the parent by **edge index**, so parallel edges are handled.
- **articulationPoints** skips the parent by **node**, so it assumes a **simple graph**
  (no parallel edges). With a doubled edge u=v it may wrongly report a cut vertex.
- **hierholzer** assumes an Eulerian path from `start` exists (degree conditions hold and
  all edges are reachable). It does not verify this; if the conditions fail it returns a
  walk that does not use every edge. Check `path.length === edges + 1`.
- SCC output order: Tarjan emits components in reverse topological order; Kosaraju in
  topological order. The order of nodes inside a component is unspecified.

## Patterns / variations

### 1. Bipartite with union-find ("enemy" trick)

```js
const uf = new UnionFind(2 * n);              // node i, "enemy of i" = i + n
for (const [a, b] of dislikes) {
  if (uf.connected(a, b)) return false;
  uf.union(a, b + n); uf.union(b, a + n);
}
```

### 2. Weighted union-find (ratios)

Store `weight[x]` = value(x) / value(parent(x)); on find, multiply along the path.
Evaluate Division: a/b = 2, b/c = 3 -> a/c = 6.

### 3. BFS on routes instead of stops

Bus Routes: a node is a **bus route**; two routes are adjacent if they share a stop.
Answer = number of routes on the path + 0 if source === target.

### 4. Bitmask BFS

Visit all nodes: state (node, mask); start from EVERY node with mask = 1 << node.
First state with mask === (1 << n) - 1 gives the answer.

### 5. Shortest path DAG for "all shortest paths"

Word Ladder II: BFS once to get dist[] from the start, then DFS from the end following
only edges where `dist[next] === dist[cur] - 1`. Collects every shortest path without
exploding the queue.

---

## Common mistakes & edge cases

- Tarjan: forgetting the `onStack` check (treating a cross edge to a finished SCC as a
  back edge) merges components that are not strongly connected.
- Bridges: skipping the parent **node** instead of the parent **edge index** - parallel
  edges then look like bridges.
- Articulation points: using `>` instead of `>=`, and forgetting the root rule.
- Bipartite: checking only one component; or starting BFS from node 0 only.
- Hierholzer: building the result in the wrong order (must reverse) or not sorting the
  neighbours for lexical order.
- State BFS: putting only the position in `visited` - you will prune valid states.
- Bus Routes: source === target must return 0 before any BFS.
- Word Ladder II: do not remove words from the set during the parent-building BFS until
  the whole level is done, or you lose alternative parents.

---

## When this does NOT apply

- Undirected "which nodes are connected" -> plain BFS/DFS or union-find, not SCC.
- "Remove a node/edge and count components" once -> brute force BFS may be enough for
  small inputs; low-link is for "all such edges/nodes" on big inputs.
- "Visit every **node** exactly once" is a Hamiltonian path (NP-hard), not Eulerian.
  Euler is about **edges**.
- "Split into 3+ groups with no conflicts" is graph k-colouring (NP-hard for k >= 3);
  only 2-colouring is linear.
- Weighted shortest paths -> [Shortest Paths](../../01_Shortest_Paths/01_Concepts/CONCEPTS.md); state graphs only change what a "node" is.

---

## Interview tips

- Name the technique before coding: "This is asking for bridges, I'll use Tarjan's
  low-link." Interviewers reward recognition.
- For SCC, explain Kosaraju (it is easier to justify in words) even if you code Tarjan.
- For low-link algorithms, draw ids and low values on a tiny graph; the comparison
  `low[v] > ids[u]` is much clearer with numbers.
- For state problems say "the state is (position, extra) so the graph has size X; BFS is
  O(size * branching)".
- If the problem says "lexicographically smallest", think "sort neighbours, then
  Hierholzer / DFS in order".

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Is Graph Bipartite? | Medium | BFS 2-colouring | 03_Problems/solutions/01_is_graph_bipartite.js |
| 02 | Possible Bipartition | Medium | bipartite / UF enemy trick | 03_Problems/solutions/02_possible_bipartition.js |
| 03 | Minimum Number of Vertices to Reach All Nodes | Medium | in-degree 0 | 03_Problems/solutions/03_minimum_vertices_to_reach_all_nodes.js |
| 04 | Evaluate Division | Medium | weighted DFS / weighted UF | 03_Problems/solutions/04_evaluate_division.js |
| 05 | Bus Routes | Hard | BFS on routes | 03_Problems/solutions/05_bus_routes.js |
| 06 | Cheapest Flights Within K Stops (Dijkstra + state) | Medium | Dijkstra on (city, stops) | 03_Problems/solutions/06_cheapest_flights_dijkstra_state.js |
| 07 | Critical Connections in a Network | Hard | bridges (Tarjan) | 03_Problems/solutions/07_critical_connections.js |
| 08 | Reconstruct Itinerary | Hard | Eulerian path (Hierholzer) | 03_Problems/solutions/08_reconstruct_itinerary.js |
| 09 | Word Ladder II | Hard | BFS layers + backtracking | 03_Problems/solutions/09_word_ladder_ii.js |
| 10 | Shortest Path Visiting All Nodes | Hard | BFS on (node, bitmask) | 03_Problems/solutions/10_shortest_path_visiting_all_nodes.js |

---

## Practice more

Medium: Flower Planting With No Adjacent (1042), Number of Ways to Arrive at Destination
(1976), Reachable Nodes With Restrictions (2368), Count Unreachable Pairs of Nodes (2316),
Minimum Fuel Cost to Report to the Capital (2477), Find Closest Node to Given Two Nodes (2359)

Hard: Shortest Path to Get All Keys (864), Sliding Puzzle (773), Minimum Degree of a
Connected Trio (1761), Longest Cycle in a Graph (2360), Maximum Employees to Be Invited to
a Meeting (2127), Valid Arrangement of Pairs (2097, Eulerian), Cracking the Safe (753,
Eulerian), Strongly Connected Components on CSES (classic), Largest Color Value in a
Directed Graph (1857)
