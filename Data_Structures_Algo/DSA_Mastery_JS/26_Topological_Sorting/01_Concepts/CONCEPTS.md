# Topological Sort

## Prerequisites (Essential)

- [Graphs](../../23_Graphs/README.md): directed edges, adjacency lists, in-degree.
- [Graph Traversal](../../24_Graph_Traversal/README.md): BFS with a queue and recursive DFS.
- [Queues and Deques](../../17_Queues_And_Deques/README.md): Kahn's algorithm is a BFS queue.

## Intuition

A **topological sort** is an ordering of the nodes of a **directed** graph such that for
every edge `A -> B`, A comes before B. Think of getting dressed: socks before shoes,
shirt before jacket. There are many valid orders (socks or shirt first, both fine), but
shoes can never come before socks.

It only exists when the graph has **no cycles** (a DAG). If A must come before B and B
before A, no order works - and that is exactly how we detect cycles in directed graphs.

---

### Mental model: peeling a to-do list

```
  "What can I do RIGHT NOW?"  ->  anything with no unfinished prerequisites

  socks ---> shoes          round 1: socks, shirt     (nothing blocks them)
  shirt ---> jacket         round 2: shoes, jacket    (their blockers are done)

  Every time you finish a task, cross out its arrows. Tasks whose last
  incoming arrow disappears become "ready". If tasks are left but none is
  ready, they are blocking each other: a cycle.
```

---

## Why it matters / when to use

- "prerequisites", "dependencies", "must be done before" -> topological sort
- "can all courses / tasks be finished?" -> does a topological order exist (cycle check)
- "give me a valid order to take the courses" -> return the order
- "build order" for packages, `npm install` resolving dependencies, Makefiles, spreadsheet
  cell recalculation, React effect / render scheduling, Webpack bundling
- "minimum number of semesters / rounds when things can run in parallel" -> levels of Kahn
- "longest path in a DAG" -> DP in topological order
- "alien dictionary" -> build edges from letter order, then sort
- Directed graph + "is there a cycle" -> 3-colour DFS or Kahn with `count < n`

---

## How it works

### DAG = Directed Acyclic Graph

```
   DAG (sortable)              NOT a DAG (cycle 1 -> 2 -> 3 -> 1)
   0 -> 1 -> 3                 0 -> 1 -> 2
   |         ^                      ^    |
   v         |                      |    v
   2 --------+                      3 <--+
   orders: 0 1 2 3  or  0 2 1 3    no valid order
```

### Kahn's algorithm (BFS style) - step by step

Idea: a node with **in-degree 0** (no incoming edges) has no prerequisites, so it can go
first. Output it, delete its outgoing edges, and see who became free.

```
Graph: 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3          in-degree: [0, 1, 1, 2]

step 1  queue = [0]                 (only node with in-degree 0)
        pop 0 -> order [0]
        edges 0->1, 0->2 removed    in-degree [_, 0, 0, 2]  -> push 1, 2

step 2  queue = [1, 2]
        pop 1 -> order [0, 1]
        edge 1->3 removed           in-degree [_, _, 0, 1]

step 3  pop 2 -> order [0, 1, 2]
        edge 2->3 removed           in-degree [_, _, _, 0]  -> push 3

step 4  pop 3 -> order [0, 1, 2, 3]   queue empty, 4 nodes out of 4 -> valid DAG
```

If a cycle exists, the nodes on it never reach in-degree 0, so `order.length < n`.
That single comparison is the cycle check.

```js
function topoSortKahn(n, edges) {
  const adj = buildAdjList(n, edges, true);
  const indegree = new Array(n).fill(0);
  for (const [, to] of edges) indegree[to]++;
  const queue = [];
  for (let v = 0; v < n; v++) if (indegree[v] === 0) queue.push(v);
  const order = [];
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    order.push(cur);
    for (const nxt of adj[cur]) if (--indegree[nxt] === 0) queue.push(nxt);
  }
  return order.length === n ? order : [];   // [] = cycle
}
```

### DFS post-order version

When DFS **finishes** a node (all its descendants are done), push it to a list. A node
finishes only after everything it points to has finished, so the finish list is a
*reverse* topological order. Reverse it.

```
0 -> 1 -> 3, 0 -> 2 -> 3
dfs(0) -> dfs(1) -> dfs(3) finish 3 -> finish 1 -> dfs(2) (3 done) finish 2 -> finish 0
finish list: [3, 1, 2, 0]   reversed: [0, 2, 1, 3]   valid
```

### Cycle detection with three colours

| Colour | Meaning |
|--------|---------|
| WHITE | not visited yet |
| GRAY | visiting: on the current recursion path |
| BLACK | finished |

While exploring, if you step onto a **GRAY** node you have walked in a circle -> cycle.
Stepping onto a **BLACK** node is fine (a diamond `0->1->3, 0->2->3` reaches 3 twice but
3 is black the second time, not gray). This is the key difference from undirected
cycle detection, where any visited non-parent node means a cycle.

```js
function dfs(node) {
  color[node] = GRAY;
  for (const nxt of adj[node]) {
    if (color[nxt] === GRAY) return true;            // back edge
    if (color[nxt] === WHITE && dfs(nxt)) return true;
  }
  color[node] = BLACK;
  return false;
}
```

### Applications

- **Course scheduling**: courses = nodes, prerequisite = edge. Order = Kahn's output.
- **Build systems** (make, Gradle, Turborepo): targets depend on each other; build in
  topological order, and the Kahn *levels* tell you what can build in parallel.
- **npm / package managers**: install dependencies before dependents; a cycle is a
  "circular dependency" warning.
- **Spreadsheets**: recalculate cells in dependency order.

---

## Pseudocode

```
KAHN(n, edges):
    build adj list and indegree[] from edges (edge u -> v means u before v)
    queue <- every node with indegree 0
    order <- []
    while queue not empty:
        u <- queue.dequeue()
        append u to order
        for each v in adj[u]:
            indegree[v] <- indegree[v] - 1
            if indegree[v] == 0: queue.enqueue(v)
    if length(order) < n: return "cycle"        // some nodes never became free
    return order

DFS_TOPO(n, edges):
    color[] <- WHITE for every node; finished <- []
    visit(u):
        color[u] <- GRAY
        for each v in adj[u]:
            if color[v] == GRAY: report cycle
            if color[v] == WHITE: visit(v)
        color[u] <- BLACK; append u to finished
    for each node u: if color[u] == WHITE: visit(u)
    return reverse(finished)
```

### Assumptions and limitations

- The graph must be **directed**. On an undirected graph "u before v" has no meaning.
- A topological order exists **only for DAGs**. Any cycle (including a self loop) means
  there is no answer; both algorithms detect this.
- The order is usually **not unique**. If the problem wants one specific order
  (lexicographically smallest, for example) you must change the queue (use a min-heap).
- Recursive DFS can overflow the call stack on a very long chain (about 10^4 frames in
  Node). Kahn's algorithm is iterative and has no such limit.
- Nodes are assumed to be labelled `0..n-1`. Strings or 1-based labels need a map or an
  offset first.

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| build in-degree array | O(V + E) | O(V) | |
| Kahn's algorithm | O(V + E) | O(V) | queue + order |
| DFS topological sort | O(V + E) | O(V) | recursion depth up to V |
| cycle detection (either) | O(V + E) | O(V) | |
| longest path in DAG | O(V + E) | O(V) | DP in topo order |

---

## JavaScript implementation

Full code with tests: [`topological_sort.js`](../02_Implementations/topological_sort.js) (`topoSortKahn`, `topoSortDfs`,
`hasCycleDirected`, `longestPathInDag`). See the snippets above for the cores.

---

## Dry run (Kahn) on a concrete example

Graph with 6 nodes: `5 -> 2, 5 -> 0, 4 -> 0, 4 -> 1, 2 -> 3, 3 -> 1`.
Starting in-degree: `[2, 2, 1, 1, 0, 0]` (node 0 has two incoming edges, and so on).

| Step | Dequeued | Edges removed | In-degree after | Newly ready | Queue after | Order so far |
|------|----------|---------------|-----------------|-------------|-------------|--------------|
| 0 | - | - | [2, 2, 1, 1, 0, 0] | 4, 5 | [4, 5] | [] |
| 1 | 4 | 4->0, 4->1 | [1, 1, 1, 1, _, 0] | - | [5] | [4] |
| 2 | 5 | 5->2, 5->0 | [0, 1, 0, 1, _, _] | 2, 0 | [2, 0] | [4, 5] |
| 3 | 2 | 2->3 | [0, 1, _, 0, _, _] | 3 | [0, 3] | [4, 5, 2] |
| 4 | 0 | (none) | unchanged | - | [3] | [4, 5, 2, 0] |
| 5 | 3 | 3->1 | [_, 0, _, _, _, _] | 1 | [1] | [4, 5, 2, 0, 3] |
| 6 | 1 | (none) | all done | - | [] | [4, 5, 2, 0, 3, 1] |

6 nodes came out of 6, so there is no cycle. Check one edge: `3 -> 1`, and 3 is at
position 4, 1 at position 5. Correct.

Now add the edge `1 -> 5`. Node 5 now has in-degree 1, so the starting queue is only
`[4]`. After 4 is processed, 0 and 1 still wait on 5, and 5 waits on 1. The queue
empties with only 1 node output: `1 < 6`, so we report a cycle (`5 -> 2 -> 3 -> 1 -> 5`).

---

## Edge cases

- `n = 0`: the order is empty (not a cycle).
- No edges at all: every node is free at once; any permutation is valid.
- Self loop `u -> u`: a cycle; u's in-degree never reaches 0.
- Several disconnected pieces: Kahn handles them automatically because all their
  in-degree-0 nodes start in the queue; DFS needs the outer loop over every node.
- Duplicate edges: fine, as long as in-degree and adjacency are built from the same list.

---

## Patterns / variations

### 1. "Can it be done?" -> Kahn count

```js
return topoSortKahn(n, edges).length === n;
```
Use when: Course Schedule I.

### 2. "Give me an order" -> return Kahn output

Use when: Course Schedule II, Alien Dictionary (plus the string-comparison step to build
the edges).

### 3. Levels = minimum rounds (parallel scheduling)

Process the queue one level at a time; the number of levels is the minimum number of
semesters / rounds when independent tasks run in parallel.

```js
let rounds = 0;
while (queue.length) {
  rounds++;
  const next = [];
  for (const node of queue) for (const nxt of adj[node]) if (--indeg[nxt] === 0) next.push(nxt);
  queue = next;
}
```
Use when: Parallel Courses, Minimum Height Trees (peel leaves layer by layer).

### 4. Reverse the graph

"Safe states" = nodes that cannot reach a cycle. Reverse all edges and run Kahn: nodes
that get processed are the safe ones. Use when: Find Eventual Safe States.

### 5. DFS + memo = topological DP

In a DAG, `f(node) = 1 + max(f(next))` with memoisation IS a topological sort in
disguise (the memo guarantees each node is computed after its successors). Use when:
Longest Increasing Path in a Matrix.

### 6. Uniqueness of the order

The topological order is **unique** only if the queue never holds more than one node at
a time. Use when: Sequence Reconstruction.

---

## Alternatives

| Approach | Time | When to prefer it |
|----------|------|-------------------|
| Brute force: repeatedly scan all nodes for one with no remaining incoming edge | O(V * (V + E)) | Never in an interview; useful only to understand the idea |
| Kahn's algorithm (BFS + in-degree) | O(V + E) | Default. Iterative, gives levels for "minimum rounds", easy cycle check |
| DFS post-order (3 colours) | O(V + E) | When you already run DFS (memoised DP on a DAG), or want a natural recursive proof |
| Kahn with a min-heap instead of a queue | O(V log V + E) | Lexicographically smallest order |
| Union-find | - | Does NOT work: it ignores edge direction |

---

## Common mistakes & edge cases

- Building the adjacency list in the wrong direction. "`[a, b]` means take b before a"
  (LeetCode Course Schedule) -> edge `b -> a`. Read the statement twice.
- Forgetting isolated nodes: they have in-degree 0 and must be in the initial queue.
- Using the undirected cycle check (`visited && not parent`) on a directed graph - the
  diamond shape gives a false positive. Use 3 colours.
- Returning the DFS finish list without reversing it.
- Alien Dictionary: a prefix case like `["abc", "ab"]` is invalid (longer word first with
  the same prefix) -> return "". Also letters that appear in no edge still belong in the
  output.
- Duplicate edges inflate in-degree counts; they still work with Kahn (both copies get
  decremented) as long as you build adjacency from the same list.

---

## When this does NOT apply

- **Undirected graphs**: there is no "before". Use DFS/BFS or [union-find](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) for connectivity and cycles.
- **Graphs with cycles where you still need an answer** (for example "longest path"
  in a general graph): topological DP is invalid. Condense strongly connected components
  first ([SCC](../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md)), or the problem may be NP-hard.
- **Weighted shortest paths with negative edges on a general graph**: use
  [Bellman-Ford](../../25_Graph_Algorithms/01_Shortest_Paths/README.md). (On a DAG, though, "relax in topological order" is the fastest shortest-path method.)
- **Constraints that are not pairwise "A before B"** (for example "A and B must be in the
  same group", "at most 2 tasks at once"): plain topological sort is not enough; you
  need extra structure (grouping, DP over subsets, greedy with a heap).

---

## Interview tips

- Say "directed graph, dependencies, so I need a topological sort - and if the graph has
  a cycle there is no valid order."
- Walk through Kahn's with the in-degree array on the whiteboard; it is the easiest
  version to explain.
- Mention both approaches exist (Kahn / DFS) and pick Kahn unless you need DFS for
  another reason (e.g. you are already doing DFS for longest path).
- State O(V + E) and explain: each edge decrements one in-degree exactly once.
- If asked "what if there are multiple valid answers" - any is fine unless the problem
  asks for lexicographically smallest (then use a min-heap as the queue).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Course Schedule | Medium | Kahn cycle check | 03_Problems/solutions/01_course_schedule.js |
| 02 | Course Schedule II | Medium | Kahn order | 03_Problems/solutions/02_course_schedule_ii.js |
| 03 | Find Eventual Safe States | Medium | reverse graph + Kahn / 3-colour DFS | 03_Problems/solutions/03_find_eventual_safe_states.js |
| 04 | Minimum Height Trees | Medium | peel leaves (levels) | 03_Problems/solutions/04_minimum_height_trees.js |
| 05 | Parallel Courses | Medium | Kahn levels | 03_Problems/solutions/05_parallel_courses.js |
| 06 | Sequence Reconstruction | Medium | unique topological order | 03_Problems/solutions/06_sequence_reconstruction.js |
| 07 | Longest Increasing Path in a Matrix | Hard | DFS + memo as topological DP | 03_Problems/solutions/07_longest_increasing_path_in_matrix.js |
| 08 | Alien Dictionary | Hard | build edges + Kahn | 03_Problems/solutions/08_alien_dictionary.js |

---

## Practice more

Medium: All Ancestors of a Node in a DAG (2192), Build a Matrix With Conditions (2392),
Loud and Rich (851), Sort Items by Groups Respecting Dependencies (1203),
Parallel Courses II (1494), Find All Possible Recipes from Given Supplies (2115),
Largest Color Value in a Directed Graph (1857), Collect Coins in a Tree (2603),
Course Schedule IV (1462)

Hard: Parallel Courses III (2050), Strange Printer II (1591), Minimum Time to Finish All
Jobs with Dependencies (variant)
