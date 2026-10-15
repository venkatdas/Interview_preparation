# Graphs

> **Prerequisites:** [Hashing](../../05_Hashing/README.md) (Map / Set), [Matrix and Multidimensional Arrays](../../09_Matrix_And_Multidimensional_Arrays/README.md) (grids, adjacency matrices), [Binary Trees](../../20_Trees/01_Binary_Trees/README.md) (a tree is a special graph), [Queues and Deques](../../17_Queues_And_Deques/README.md) and [Stacks](../../16_Stacks/README.md) (used by BFS / DFS in the next topic).

A **graph** is a set of **nodes** (also called vertices) connected by **edges**.
That is it. A social network is a graph (people = nodes, friendships = edges). A map is a
graph (cities = nodes, roads = edges). Your `package.json` dependencies form a graph.
Even a maze or a chess board is a graph once you say "each cell is a node and each legal
move is an edge".

Graphs are the most *general* structure in this course. Arrays, linked lists and trees are
all just graphs with extra rules. That is why graph questions feel hard at first: there is
less structure to lean on. The good news is that almost every graph interview question is
solved by one of about eight algorithms, and topics 23–27 of this course teach all of them.

This topic (23) covers what a graph is and how to store one. Traversal lives in [24_Graph_Traversal](../../24_Graph_Traversal/README.md), and the algorithms in topics 25–27 (study them in order, see below).

---

## Why it matters / when to use

Reach for a graph when the problem statement has any of these signals:

- "connected", "reachable", "can you get from A to B", "is there a path"
- "network", "friends", "cities and roads", "flights", "dependencies", "prerequisites"
- "shortest path", "minimum number of steps / moves / transformations"
- "order the tasks so every dependency comes first" (build order, course schedule)
- "islands", "regions", "groups", "clusters", "provinces" (connected components)
- "cycle", "deadlock", "can all courses be finished"
- "minimum cost to connect everything" (minimum spanning tree)
- "two groups such that no two in the same group are linked" (bipartite)
- A **2-D grid** where you move up / down / left / right - that is a graph in disguise
- A **state** that changes by small steps (a lock, a word, a puzzle board) - also a graph

---

## How it works

### Terminology (learn these words, interviewers use them)

| Term | Meaning | Picture |
|------|---------|---------|
| vertex / node | a thing | `(A)` |
| edge | a link between two nodes | `(A)---(B)` |
| undirected edge | goes both ways (friendship) | `A --- B` |
| directed edge | one way only (Twitter follow, "A must come before B") | `A --> B` |
| weighted edge | has a cost / distance / time | `A --5-- B` |
| degree | number of edges touching a node (directed: in-degree and out-degree) | |
| path | a sequence of nodes where each pair is joined by an edge | `A -> B -> D` |
| cycle | a path that starts and ends at the same node | `A -> B -> C -> A` |
| connected | every node can reach every other node (undirected) | |
| connected component | a maximal "island" of nodes that can reach each other | |
| DAG | **D**irected **A**cyclic **G**raph: directed, no cycles. Dependencies live here | |
| tree | an undirected graph that is connected and has no cycles. `n` nodes, exactly `n - 1` edges | |
| dense / sparse | many edges (close to n^2) / few edges (close to n) | |

```
Undirected, unweighted        Directed (DAG)               Weighted, undirected

   0 --- 1                      0 --> 1                       0 --4-- 1
   |     |                      |     |                       |       |
   2 --- 3     4                v     v                       2       1
                                2 --> 3                       |       |
   two components              topological order:             2 --3-- 3
   {0,1,2,3} and {4}           0,1,2,3  or  0,2,1,3
```

A **tree is a graph**: a connected, acyclic, undirected graph. Everything in `20_Trees`
works on graphs too, you just need a `visited` set because a graph can have cycles and
a node can have more than one "parent".

### Representations (with JavaScript)

Suppose `n = 4` nodes and edges `[[0,1],[0,2],[1,3],[2,3]]`.

**1. Adjacency list** (use this 95% of the time)

Each node keeps a list of its neighbours.

```
0: [1, 2]
1: [0, 3]
2: [0, 3]
3: [1, 2]
```

```js
// Nodes are 0..n-1 -> an array of arrays is fastest and simplest
function buildAdjList(n, edges, directed = false) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    if (!directed) adj[v].push(u);  // undirected = add both directions
  }
  return adj;
}

// Nodes are strings / arbitrary values -> use a Map
const adj = new Map();
function addEdge(u, v) {
  if (!adj.has(u)) adj.set(u, []);
  if (!adj.has(v)) adj.set(v, []);
  adj.get(u).push(v);
  adj.get(v).push(u);
}

// Weighted: store [neighbour, weight] pairs
// adj[u].push([v, w]);
```

**2. Adjacency matrix** (small or dense graphs, Floyd-Warshall)

`matrix[u][v] = 1` (or the weight) if there is an edge, else `0` (or `Infinity`).

```
     0  1  2  3
  0 [0, 1, 1, 0]
  1 [1, 0, 0, 1]
  2 [1, 0, 0, 1]
  3 [0, 1, 1, 0]
```

```js
const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
for (const [u, v] of edges) { matrix[u][v] = 1; matrix[v][u] = 1; }
```

**3. Edge list** (what the problem usually hands you; Kruskal sorts it)

```js
const edges = [[0, 1], [0, 2], [1, 3], [2, 3]];
```

**4. Implicit graphs** - no data structure at all, neighbours are *computed*

```js
// Grid: node = (row, col), neighbours = 4 directions
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
for (const [dr, dc] of DIRS) {
  const r = row + dr, c = col + dc;
  if (r < 0 || c < 0 || r >= rows || c >= cols) continue; // off the grid
  // ... visit grid[r][c]
}

// Word ladder: node = a word, neighbours = all words one letter away
// Lock: node = "0000".."9999", neighbours = turn one wheel up or down
```

Full code with tests: [`02_Implementations/graph.js`](../02_Implementations/graph.js) (a `Graph` class plus `buildAdjList`, `buildAdjMatrix`,
`DIRS`). Most problem solutions build their own small adjacency list, exactly as you would in an interview.

---

## Pseudocode

```
BUILD_ADJ_LIST(n, edges, directed):
    adj = [new empty list for each of n vertices]      # never fill([]) - shared list!
    for (u, v[, w]) in edges:
        adj[u].append(v or (v, w))
        if not directed: adj[v].append(u or (u, w))
    return adj

BUILD_ADJ_MATRIX(n, edges, directed):
    m = n x n filled with INFINITY; m[i][i] = 0
    for (u, v, w = 1) in edges:
        m[u][v] = w
        if not directed: m[v][u] = w
    return m

DEGREES(n, edges):                 # directed
    in = [0]*n; out = [0]*n
    for (u, v) in edges: out[u] += 1; in[v] += 1

GRID_NEIGHBOURS(r, c):             # implicit graph
    for (dr, dc) in [(1,0), (-1,0), (0,1), (0,-1)]:
        nr, nc = r + dr, c + dc
        if inside grid and cell (nr, nc) is open: yield (nr, nc)
```

---

## Operations & complexity

`V` = number of vertices, `E` = number of edges.

| Representation | Space | add edge | has edge u-v? | iterate neighbours of u | Best for |
|----------------|-------|----------|---------------|-------------------------|----------|
| adjacency list | O(V + E) | O(1) | O(degree(u)) | O(degree(u)) | almost everything, sparse graphs |
| adjacency matrix | O(V^2) | O(1) | O(1) | O(V) | dense graphs, V <= ~1000, Floyd-Warshall |
| edge list | O(E) | O(1) | O(E) | O(E) | Kruskal (sort edges), Bellman-Ford |

Traversal cost on an adjacency list: BFS and DFS are both **O(V + E)** time and **O(V)**
space. Every node is visited once, every edge looked at once (twice if undirected).

| Algorithm | Time | Space | Folder |
|-----------|------|-------|--------|
| BFS / DFS | O(V + E) | O(V) | [24_Graph_Traversal](../../24_Graph_Traversal/README.md) |
| Topological sort (Kahn / DFS) | O(V + E) | O(V) | [26_Topological_Sorting](../../26_Topological_Sorting/README.md) |
| Union-Find (per op) | ~O(1) amortized | O(V) | [27 Union-Find](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |
| Dijkstra (binary heap) | O((V + E) log V) | O(V) | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| Bellman-Ford | O(V * E) | O(V) | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| Floyd-Warshall | O(V^3) | O(V^2) | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| Kruskal | O(E log E) | O(V) | [25 MST](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md) |
| Prim (heap) | O(E log V) | O(V) | [25 MST](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md) |
| Tarjan SCC / bridges | O(V + E) | O(V) | [25 SCC / Bridges / Bipartite / Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) |

---

## JavaScript implementation

Full code: [`02_Implementations/graph.js`](../02_Implementations/graph.js). The core of the class:

```js
class Graph {
  #adj = new Map();                       // vertex -> [{ to, weight }]
  constructor({ directed = false } = {}) { this.directed = directed; }

  addVertex(v) { if (!this.#adj.has(v)) this.#adj.set(v, []); return this; }

  addEdge(u, v, weight = 1) {
    this.addVertex(u).addVertex(v);
    this.#adj.get(u).push({ to: v, weight });
    if (!this.directed) this.#adj.get(v).push({ to: u, weight });
    return this;
  }

  neighbors(v) { return (this.#adj.get(v) ?? []).map((e) => e.to); }

  bfs(start) {
    const visited = new Set([start]), order = [], queue = [start];
    let head = 0;                          // pointer instead of shift() -> O(1)
    while (head < queue.length) {
      const cur = queue[head++];
      order.push(cur);
      for (const nxt of this.neighbors(cur)) {
        if (!visited.has(nxt)) { visited.add(nxt); queue.push(nxt); }
      }
    }
    return order;
  }
}
```

In interviews you will rarely write a class. You will write `buildAdjList` and a loop.

---

## Dry run

**Build an undirected adjacency list**, `n = 4`, edges `[[0,1],[0,2],[1,2],[2,3]]`:

| Edge | adj[0] | adj[1] | adj[2] | adj[3] |
|---|---|---|---|---|
| start | [] | [] | [] | [] |
| [0,1] | [1] | [0] | [] | [] |
| [0,2] | [1, 2] | [0] | [0] | [] |
| [1,2] | [1, 2] | [0, 2] | [0, 1] | [] |
| [2,3] | [1, 2] | [0, 2] | [0, 1, 3] | [2] |

Degrees: 2, 2, 3, 1 — sum 8 = 2 × 4 edges (handshake lemma).

**Same graph as a matrix** (1 = edge, `·` = none, diagonal 0):

| | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **0** | 0 | 1 | 1 | · |
| **1** | 1 | 0 | 1 | · |
| **2** | 1 | 1 | 0 | 1 |
| **3** | · | · | 1 | 0 |

---

## Patterns / variations

### How to recognise a graph problem

1. Can I name the **nodes**? (cells, people, words, states, courses...)
2. Can I name the **edges**? (adjacent cells, "knows", one-letter change, prerequisite...)
3. Is the question about **reachability, distance, ordering, grouping or cycles**?

If you answered yes to all three, it is a graph problem. Then pick the algorithm below.

### Decision table: which algorithm for which question

| The question says... | Use | Folder |
|----------------------|-----|--------|
| "is there a path", "count islands / components", "fill a region" | DFS or BFS | [24_Graph_Traversal](../../24_Graph_Traversal/README.md) |
| "shortest path / fewest steps" and edges are **unweighted** (or all weight 1) | **BFS** | [24_Graph_Traversal](../../24_Graph_Traversal/README.md) |
| shortest path from several sources at once ("nearest gate", "rotting") | multi-source BFS | [24_Graph_Traversal](../../24_Graph_Traversal/README.md) |
| shortest path, weights are **non-negative** | **Dijkstra** (min-heap) | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| shortest path, some weights are **negative** | **Bellman-Ford** | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| shortest path with "at most k edges / stops" | Bellman-Ford limited to k rounds, or BFS/Dijkstra on (node, stops) state | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| shortest path between **all pairs**, small V | **Floyd-Warshall** | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| edge weights are only 0 and 1 | 0-1 BFS (deque) | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) |
| "order with dependencies", "can all courses be finished", "build order" | **topological sort** (Kahn) | [26_Topological_Sorting](../../26_Topological_Sorting/README.md) |
| cycle in a **directed** graph | DFS with 3 colours, or Kahn's count < n | [26_Topological_Sorting](../../26_Topological_Sorting/README.md) |
| cycle in an **undirected** graph | DFS with parent check, or **union-find** (edge joins same set) | [27 Union-Find](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |
| "connect / merge groups as edges arrive", "are these in the same group" | **union-find** | [27 Union-Find](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |
| "minimum cost to connect everything" | MST: **Kruskal** (edge list) or **Prim** (heap) | [25 MST](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md) |
| "split into two groups with no edge inside a group" | bipartite check (BFS 2-colouring) | [25 SCC / Bridges / Bipartite / Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) |
| "which nodes can reach each other both ways" (directed) | SCC: **Tarjan** or **Kosaraju** | [25 SCC / Bridges / Bipartite / Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) |
| "which edge, if removed, disconnects the network" | bridges (Tarjan low-link) | [25 SCC / Bridges / Bipartite / Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) |
| "use every edge exactly once" (itinerary) | Eulerian path (Hierholzer) | [25 SCC / Bridges / Bipartite / Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) |
| node = (position, extra state such as keys / fuel / stops) | BFS / Dijkstra over the **state graph** | [25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md), [25 SCC / Bridges / Bipartite / Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) |

### Study order of the sub-folders

| Folder | What you learn | Why this order |
|--------|----------------|----------------|
| [24_Graph_Traversal](../../24_Graph_Traversal/README.md) | the two traversals, grids, components, implicit graphs | everything else is built on these |
| [26_Topological_Sorting](../../26_Topological_Sorting/README.md) | ordering a DAG, detecting directed cycles | first "real" algorithm, reuses BFS/DFS |
| [27_Union_Find_Disjoint_Set/01_Union_Find_Basics](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) | a data structure for merging groups | a different tool for components and undirected cycles |
| [25_Graph_Algorithms/01_Shortest_Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) | Dijkstra, Bellman-Ford, Floyd-Warshall, 0-1 BFS | needs a heap (see `19_Heaps_And_Priority_Queues`) |
| [25_Graph_Algorithms/02_Minimum_Spanning_Trees](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md) | Kruskal and Prim | combines union-find + heap |
| [25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) | bipartite, SCC, bridges, Eulerian path, state graphs | the hard-interview material |

---

## Alternatives (brute force vs optimized)

| Representation | Space | Edge check | List neighbours | Best for |
|---|---|---|---|---|
| Edge list `[[u, v], ...]` | O(E) | O(E) | O(E) | Input format; Kruskal's MST; Bellman-Ford |
| Adjacency list (arrays) | O(V + E) | O(deg) | O(deg) | Almost everything (BFS, DFS, Dijkstra, topo sort) |
| Adjacency list of Sets | O(V + E) | O(1) average | O(deg) | Many "is there an edge?" checks, dedupe |
| Adjacency matrix | O(V²) | O(1) | O(V) | Dense graphs, small V, Floyd–Warshall |
| Map of arrays (string keys) | O(V + E) | O(deg) | O(deg) | Vertices are names (words, airports) |
| Implicit (computed neighbours) | O(1) extra | rule check | generate on the fly | Grids, word ladders, puzzle states |

---

## Common mistakes & edge cases

- **Forgetting the `visited` set.** Trees do not need one, graphs always do (cycles =
  infinite loop).
- Marking a node visited when you **pop** it instead of when you **push** it in BFS. That
  lets the same node enter the queue many times -> wrong level counts and O(V * E) time.
- Using `queue.shift()` - it is O(n). Use a head index, or accept it only for small inputs
  and say so out loud.
- Building an undirected graph but adding the edge in only **one** direction.
- Nodes with **no edges** do not appear in the edge list. Always build the adjacency list
  from `n`, not from the edges, or you will miss isolated nodes when counting components.
- Grid problems: check bounds **before** reading `grid[r][c]`.
- Recursive DFS on a 1000 x 1000 grid can overflow the call stack (~10k frames in Node).
  Know the iterative version.
- Directed vs undirected cycle detection are **different algorithms**. Mixing them gives
  wrong answers.
- Dijkstra with negative edges is silently wrong - it does not crash, it just lies.

---

## When this does NOT apply

- **The data is a tree you already have as nodes** (`TreeNode` objects): use tree recursion; no visited set or adjacency list needed.
- **The "graph" is a grid and you only need local moves**: don't build an adjacency list; walk the grid directly.
- **Relationships are a simple order or sequence**: arrays, stacks or linked lists are simpler.
- **Huge sparse graphs**: never use a matrix.
- **Only grouping / "same component?" queries with edges arriving over time**: Union-Find is often simpler than storing the graph ([27_Union_Find_Disjoint_Set](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md)).

---

## Interview tips

- Start by saying what the nodes and edges are. "Each cell is a node; adjacent land cells
  are connected." Interviewers love this sentence because it shows you see the graph.
- Then say which representation you will build and why ("adjacency list, because the
  graph is sparse").
- Then name the algorithm from the decision table and its complexity before coding.
- Write `buildAdjList` as a separate tiny function - it keeps the main solution clean.
- State the complexity as O(V + E), not O(n). If the input is a grid of `m x n` cells, say
  O(m * n) because V = m * n and E <= 4 * m * n.
- If you use recursion, mention the stack-depth risk and that you could switch to an
  explicit stack.

---

## Problems in this folder

This topic has six short **original** exercises about building and representing graphs:

| # | Problem | Difficulty | Pattern | Solution |
|---|---|---|---|---|
| 01 | [Edge List to Adjacency List](../03_Problems/01_Easy/01_edge_list_to_adjacency_list.md) | Easy | build adjacency list | [01_edge_list_to_adjacency_list.js](../03_Problems/solutions/01_edge_list_to_adjacency_list.js) |
| 02 | [Degree Report](../03_Problems/01_Easy/02_degree_report.md) | Easy | in/out-degree counting | [02_degree_report.js](../03_Problems/solutions/02_degree_report.js) |
| 03 | [Matrix and List Conversion](../03_Problems/01_Easy/03_matrix_list_conversion.md) | Easy | representation conversion | [03_matrix_list_conversion.js](../03_Problems/solutions/03_matrix_list_conversion.js) |
| 04 | [Reverse a Directed Graph](../03_Problems/02_Medium/04_reverse_directed_graph.md) | Medium | transpose graph | [04_reverse_directed_graph.js](../03_Problems/solutions/04_reverse_directed_graph.js) |
| 05 | [Find the Hub Server](../03_Problems/02_Medium/05_find_the_hub_server.md) | Medium | universal sink in a matrix | [05_find_the_hub_server.js](../03_Problems/solutions/05_find_the_hub_server.js) |
| 06 | [Grid to Graph](../03_Problems/02_Medium/06_grid_to_graph.md) | Medium | implicit graph → explicit | [06_grid_to_graph.js](../03_Problems/solutions/06_grid_to_graph.js) |

Traversal and algorithm problems live in the next topics:

| Folder | Count | Highlights |
|--------|-------|-----------|
| [24_Graph_Traversal](../../24_Graph_Traversal/README.md) | 18 | Number of Islands, Rotting Oranges, Word Ladder, Clone Graph |
| [26_Topological_Sorting](../../26_Topological_Sorting/README.md) | 8 | Course Schedule I/II, Alien Dictionary |
| [27_Union_Find_Disjoint_Set/01_Union_Find_Basics](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) | 10 | Redundant Connection, Accounts Merge, Number of Islands II |
| [25_Graph_Algorithms/01_Shortest_Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md) | 10 | Network Delay Time, Cheapest Flights, Swim in Rising Water |
| [25_Graph_Algorithms/02_Minimum_Spanning_Trees](../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md) | 5 | Min Cost to Connect All Points, Critical Edges |
| [25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) | 10 | Critical Connections, Reconstruct Itinerary, Word Ladder II |

---

## Practice more

Easy: Find Center of Star Graph (1791), Find if Path Exists in Graph (1971),
Flood Fill (733), Island Perimeter (463)

Medium: Number of Islands (200), Clone Graph (133), Course Schedule (207),
Rotting Oranges (994), Pacific Atlantic Water Flow (417), Redundant Connection (684),
Network Delay Time (743), Min Cost to Connect All Points (1584), Is Graph Bipartite (785),
Accounts Merge (721), Minimum Height Trees (310), Evaluate Division (399),
All Paths From Source to Target (797), Keys and Rooms (841)

Hard: Word Ladder (127), Alien Dictionary (269), Critical Connections in a Network (1192),
Reconstruct Itinerary (332), Swim in Rising Water (778), Bus Routes (815),
Shortest Path Visiting All Nodes (847), Number of Islands II (305)
