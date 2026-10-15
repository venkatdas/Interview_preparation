# BFS and DFS

> **Prerequisites:** [Graphs (representation)](../../23_Graphs/README.md), [Queues and Deques](../../17_Queues_And_Deques/README.md) (BFS queue), [Stacks](../../16_Stacks/README.md) (iterative DFS), [Backtracking & Recursion](../../13_Backtracking/README.md) (recursive DFS), [Matrix and Multidimensional Arrays](../../09_Matrix_And_Multidimensional_Arrays/README.md) (grid indexing).

**BFS** (Breadth-First Search) and **DFS** (Depth-First Search) are the two ways to walk a
graph. BFS explores like ripples in a pond: everything 1 step away, then everything 2
steps away, and so on. DFS explores like a maze runner: pick a corridor, follow it to the
very end, come back, try the next corridor.

Every other graph algorithm in this topic is a decorated BFS or DFS. Master these two and
the rest is details.

---

## Why it matters / when to use

- "count the islands / regions / groups" -> DFS or BFS, one traversal per component
- "fewest steps", "shortest path" on an **unweighted** graph or grid -> **BFS** (never DFS)
- "is there a path from A to B", "can all rooms be reached" -> either one
- "fill / replace this connected area" (paint bucket) -> flood fill (DFS)
- "distance to the nearest X" for every cell -> **multi-source BFS**
- "how long until everything is infected / rotten" -> multi-source BFS, answer = levels
- "transform word A into word B one letter at a time" -> BFS on an implicit graph
- "clone / copy this graph" -> traverse with a map old -> new

---

## How it works

### BFS = queue, DFS = stack

```
Graph:        0           BFS from 0 (queue):      DFS from 0 (stack / recursion):
            / | \         visit 0                  visit 0
           1  2  3        visit 1, 2, 3  (level 1)   go 1 -> 4 -> (dead end), back
           |     |        visit 4, 5     (level 2)   go 2, back
           4     5                                   go 3 -> 5
          order: 0 1 2 3 4 5             order: 0 1 4 2 3 5
```

The ONLY difference in code is the data structure:

```js
// BFS                                   // DFS (iterative)
const queue = [start]; let head = 0;     const stack = [start];
while (head < queue.length) {            while (stack.length) {
  const cur = queue[head++];               const cur = stack.pop();
  ...                                      ...
}                                        }
```

### The visited set

Trees have no cycles, so tree traversals need no bookkeeping. Graphs can have cycles,
so without a `visited` set a traversal loops forever. Three ways to store it:

| Visited store | When |
|---------------|------|
| `Set` of node ids | nodes are arbitrary values |
| `boolean[]` of length n | nodes are 0..n-1 (fastest) |
| mutate the grid itself (`grid[r][c] = '0'`) | grid problems, when mutating input is allowed - ask! |

**BFS rule:** mark visited when you **push** into the queue. If you mark when you pop,
the same node can be pushed by several neighbours and you do extra work (and level
counts can go wrong).

### Level tracking in BFS (the "how many steps" trick)

Two ways:

```js
// 1. dist array - cleanest when you need the distance of each node
dist[next] = dist[cur] + 1;

// 2. process one full level per outer loop - cleanest when you need "number of rounds"
let steps = 0;
while (queue.length) {
  const size = queue.length;            // freeze the current level
  for (let i = 0; i < size; i++) { /* pop + push neighbours */ }
  steps++;
}
```

### When to use which

| Need | Use | Why |
|------|-----|-----|
| shortest path (unweighted) | BFS | the first time BFS reaches a node is via the fewest edges |
| any path / reachability | either | DFS is shorter to write |
| connected components / counting islands | either | DFS (recursive) is the usual pick |
| flood fill | DFS | natural recursion |
| distance from many sources | multi-source BFS | one BFS, all sources at level 0 |
| very deep graphs (long chains, big grids) | BFS or iterative DFS | recursion can overflow the stack |
| need to explore "all paths" / backtracking | DFS | you need the path on the call stack |

### BFS on a grid with a directions array

```js
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];   // down, up, right, left
for (const [dr, dc] of DIRS) {
  const r = row + dr, c = col + dc;
  if (r < 0 || c < 0 || r >= rows || c >= cols) continue;   // 1. bounds
  if (grid[r][c] !== 1 || visited[r][c]) continue;          // 2. walkable + unseen
  visited[r][c] = true;                                      // 3. mark
  queue.push([r, c]);                                        // 4. push
}
```

Always in that order: bounds first, or you read `undefined[c]` and crash.

### Multi-source BFS

Put **every** source in the queue at distance 0 before the loop starts. Then run normal BFS.
Each cell ends up with the distance to its **nearest** source. Rotting Oranges, Walls and
Gates and 01 Matrix are all exactly this.

```
grid (G = gate, # = wall, . = empty)    distances to nearest gate
  . # G .                                 3 # 0 1
  . . . #                                 2 1 1 #
  . # G .                                 1 # 0 1
```

### DFS iterative pitfalls

1. If you mark visited when pushing, the visit **order** differs from recursive DFS
   (still a valid traversal, but post-order based algorithms like topological sort break).
   Mark when popping and skip already-visited pops to get the recursive order.
2. Push neighbours in **reverse** if you want the same order as recursion.
3. For post-order (needed by topological sort / Tarjan) push a `[node, 'exit']` marker
   or keep an index pointer per node. The recursive version is much simpler - use it
   unless depth is a problem.

### Connected components

```js
let count = 0;
for (let node = 0; node < n; node++) {
  if (!visited[node]) { count++; dfs(node); }   // each unvisited start = new component
}
```

### Flood fill

DFS from the start cell; only step onto cells of the **old** colour; repaint as you go
(the repaint is the visited mark). Guard the `oldColor === newColor` case or you recurse
forever.

---

## Pseudocode

```
BFS(adj, s):
    dist = [-1] * n; dist[s] = 0
    queue = [s]; head = 0
    while head < queue.length:
        u = queue[head++]
        for v in adj[u]:
            if dist[v] == -1:            # mark when ENQUEUING
                dist[v] = dist[u] + 1
                queue.push(v)
    return dist

DFS(adj, u, seen):
    seen.add(u); visit(u)
    for v in adj[u]:
        if v not in seen: DFS(adj, v, seen)

COUNT_COMPONENTS(n, adj):
    count = 0; seen = {}
    for v in 0..n-1:
        if v not in seen: count += 1; DFS(adj, v, seen)
    return count

GRID BFS / DFS: same code, neighbours = 4 directions,
    skip (r, c) if out of bounds, a wall, or already seen.
```

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| BFS / DFS on adjacency list | O(V + E) | O(V) | queue/stack + visited |
| BFS / DFS on an m x n grid | O(m * n) | O(m * n) | each cell has <= 4 edges |
| multi-source BFS | O(m * n) | O(m * n) | same as single source |
| connected components | O(V + E) | O(V) | sum of all traversals |
| flood fill | O(m * n) | O(m * n) | recursion depth can reach m * n |

---

## JavaScript implementation

Full code with tests: `traversals.js` (`bfs`, `bfsLevels`, `dfsRecursive`, `dfsIterative`,
`bfsGrid`, `multiSourceBfs`, `countComponents`, `floodFill`). The heart of it:

```js
function bfs(adj, start) {
  const dist = new Array(adj.length).fill(-1);
  dist[start] = 0;
  const queue = [start];
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    for (const nxt of adj[cur]) {
      if (dist[nxt] === -1) { dist[nxt] = dist[cur] + 1; queue.push(nxt); }
    }
  }
  return dist;
}

function dfs(adj, node, visited) {
  visited[node] = true;
  for (const nxt of adj[node]) if (!visited[nxt]) dfs(adj, nxt, visited);
}
```

---

## Dry run

**BFS from 0** on the undirected graph `0-1, 0-2, 1-3, 2-3, 3-4`:

| Step | dequeued u | neighbours checked | newly discovered (dist) | queue after |
|---|---|---|---|---|
| 1 | 0 | 1, 2 | 1 (1), 2 (1) | [1, 2] |
| 2 | 1 | 0, 3 | 3 (2) | [2, 3] |
| 3 | 2 | 0, 3 | - (3 already seen) | [3] |
| 4 | 3 | 1, 2, 4 | 4 (3) | [4] |
| 5 | 4 | 3 | - | [] |

Final `dist = [0, 1, 1, 2, 3]`. Node 3 was discovered once (from 1) even though 2 also points to it — that's what "mark on enqueue" buys you.

---

## Patterns / variations

### 1. Count islands (DFS sink)

```js
function numIslands(grid) {
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0';                       // sink it = mark visited
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === '1') { count++; sink(r, c); }
  return count;
}
```
Use when: islands, provinces, regions, max area, enclaves.

### 2. BFS shortest path with levels

```js
let steps = 0;
while (queue.length) {
  for (let i = queue.length; i > 0; i--) {      // one level
    const cur = queue.shift();
    if (cur === target) return steps;
    for (const nxt of neighbours(cur)) if (!seen.has(nxt)) { seen.add(nxt); queue.push(nxt); }
  }
  steps++;
}
return -1;
```
Use when: word ladder, open the lock, shortest path in binary matrix.

### 3. Multi-source BFS

Seed the queue with all sources, run pattern 2. Use when: rotting oranges, walls and gates,
01 matrix.

### 4. Reverse thinking (start from the border)

Instead of asking "is this region surrounded?", ask "which cells can reach the border?"
and DFS **from the border inward**. Use when: surrounded regions, pacific atlantic,
number of enclaves.

### 5. Graph clone with a Map

```js
const copies = new Map();               // original node -> cloned node
function clone(node) {
  if (copies.has(node)) return copies.get(node);
  const copy = { val: node.val, neighbors: [] };
  copies.set(node, copy);               // set BEFORE recursing to handle cycles
  for (const nb of node.neighbors) copy.neighbors.push(clone(nb));
  return copy;
}
```

### 6. Implicit graph

Nodes are generated on the fly (`"abc"` -> all one-letter variants, `"0000"` -> 8
neighbours). You never build the adjacency list. Use when: word ladder, open the lock,
sliding puzzle, minimum genetic mutation.

---

## Alternatives (brute force vs optimized)

| Question | Brute force | Traversal approach | Other options |
|---|---|---|---|
| Is t reachable from s? | Enumerate all paths (exponential) | BFS/DFS: O(V + E) | Union-Find if many queries on a static graph |
| Fewest steps (unweighted) | DFS trying every path | BFS: O(V + E) | Bidirectional BFS for big implicit graphs |
| Distance to nearest source for every cell | BFS from every cell: O((RC)²) | Multi-source BFS: O(RC) | - |
| Cells that can reach the border | DFS from every cell | Flood from the border inward | - |
| Components | Pairwise reachability: O(V · (V + E)) | One traversal per new component: O(V + E) | Union-Find: near O(E) |
| Weighted shortest path | BFS (wrong!) | - | Dijkstra / Bellman-Ford ([25 Shortest Paths](../../25_Graph_Algorithms/01_Shortest_Paths/README.md)) |

---

## Common mistakes & edge cases

- Empty grid / `grid[0]` undefined - check `if (!grid.length) return 0`.
- Start cell is a wall (Shortest Path in Binary Matrix: `grid[0][0] === 1` -> `-1`).
- Marking visited on pop in BFS (duplicates in the queue).
- Forgetting to add **both** directions for undirected edge lists.
- Isolated nodes: components must iterate over `0..n-1`, not just nodes in `edges`.
- Mutating the input grid when the interviewer did not allow it - ask first, or copy.
- Recursion depth on big grids. Node's default stack handles ~10k frames; a 300 x 300
  all-land grid needs 90k. Use iterative DFS / BFS when the grid is large.
- `queue.shift()` is O(n). Fine for interviews if you mention it; use a head index when
  you want to be precise.
- 8-directional vs 4-directional - read the problem (Shortest Path in Binary Matrix is 8).

---

## When this does NOT apply

- **Edges have different weights**: BFS distances are wrong; use Dijkstra (non-negative) or Bellman-Ford (negative), or 0-1 BFS when weights are only 0 and 1.
- **You need an ordering with dependencies**: use topological sort ([26_Topological_Sorting](../../26_Topological_Sorting/README.md)), which is built on traversal but adds in-degrees or finish order.
- **Edges arrive over time and you only ask "same group?"**: Union-Find avoids re-traversing.
- **You must list all paths, not just reach**: that's backtracking (exponential), not a single traversal with a global visited set.
- **The structure is a tree given as nodes**: plain tree recursion without a visited set is enough.

---

## Interview tips

- Say the nodes and edges out loud first: "each land cell is a node, 4-adjacent land cells
  are connected".
- Choose BFS for "shortest / minimum steps", DFS for "exists / count / fill". Say why.
- Mention the visited strategy (set vs mutate grid) and ask if mutating input is OK.
- Say "O(m * n), each cell is visited once and has at most 4 neighbours."
- For BFS, draw one level expansion on the whiteboard; it makes the level trick obvious.
- Know the iterative DFS; interviewers sometimes ask "what if the grid is huge?".

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Flood Fill | Easy | DFS flood fill | 03_Problems/solutions/01_flood_fill.js |
| 02 | Island Perimeter | Easy | grid scan / DFS | 03_Problems/solutions/02_island_perimeter.js |
| 03 | Find if Path Exists in Graph | Easy | BFS reachability | 03_Problems/solutions/03_find_if_path_exists.js |
| 04 | Keys and Rooms | Medium | DFS reachability | 03_Problems/solutions/04_keys_and_rooms.js |
| 05 | Number of Islands | Medium | DFS components on grid | 03_Problems/solutions/05_number_of_islands.js |
| 06 | Max Area of Island | Medium | DFS returning size | 03_Problems/solutions/06_max_area_of_island.js |
| 07 | Number of Connected Components | Medium | components on adjacency list | 03_Problems/solutions/07_number_of_connected_components.js |
| 08 | Graph Valid Tree | Medium | DFS cycle check + connectivity | 03_Problems/solutions/08_graph_valid_tree.js |
| 09 | Clone Graph | Medium | DFS with Map | 03_Problems/solutions/09_clone_graph.js |
| 10 | Rotting Oranges | Medium | multi-source BFS levels | 03_Problems/solutions/10_rotting_oranges.js |
| 11 | Walls and Gates | Medium | multi-source BFS | 03_Problems/solutions/11_walls_and_gates.js |
| 12 | 01 Matrix | Medium | multi-source BFS | 03_Problems/solutions/12_01_matrix.js |
| 13 | Surrounded Regions | Medium | DFS from border | 03_Problems/solutions/13_surrounded_regions.js |
| 14 | Pacific Atlantic Water Flow | Medium | DFS from border, two sets | 03_Problems/solutions/14_pacific_atlantic_water_flow.js |
| 15 | Number of Enclaves | Medium | DFS from border | 03_Problems/solutions/15_number_of_enclaves.js |
| 16 | Shortest Path in Binary Matrix | Medium | BFS, 8 directions | 03_Problems/solutions/16_shortest_path_in_binary_matrix.js |
| 17 | Open the Lock | Medium | BFS implicit graph | 03_Problems/solutions/17_open_the_lock.js |
| 18 | Word Ladder | Hard | BFS implicit graph | 03_Problems/solutions/18_word_ladder.js |

---

## Practice more

Easy: Find Center of Star Graph (1791), Find the Town Judge (997), Flood Fill (733)

Medium: Number of Closed Islands (1254), Count Sub Islands (1905), As Far from Land as
Possible (1162), Minimum Genetic Mutation (433), All Paths From Source to Target (797),
Shortest Bridge (934), Nearest Exit from Entrance in Maze (1926), Snakes and Ladders (909),
Coloring A Border (1034), Detect Cycles in 2D Grid (1559), Jump Game III (1306)

Hard: Sliding Puzzle (773), Shortest Path to Get All Keys (864), Making A Large Island (827),
Cut Off Trees for Golf Event (675)
