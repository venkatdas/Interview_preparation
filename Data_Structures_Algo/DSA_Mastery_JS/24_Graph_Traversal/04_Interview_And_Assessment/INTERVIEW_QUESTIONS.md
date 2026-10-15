# Graph Traversal — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. BFS vs DFS: how do they differ and when do you choose each?

<details><summary>Model answer</summary>

BFS uses a queue and explores in rings of increasing distance, so it finds shortest paths in unweighted graphs and handles level-by-level questions. DFS uses a stack (or recursion) and goes deep first; it is natural for reachability, counting components, cycle detection, path enumeration and topological order. Both are O(V + E). Choose BFS when the question says "shortest", "fewest steps" or "nearest"; otherwise either works and DFS is often shorter to write.

</details>

### 2. Why mark a node visited when you enqueue it, not when you dequeue it?

<details><summary>Model answer</summary>

If you wait until dequeue, the same node can be enqueued many times by different neighbours before it is processed, blowing up time and memory (up to O(E) copies) and, in grid problems, timing out. Marking on enqueue guarantees each node enters the queue once.

</details>

### 3. Why does BFS give shortest paths in unweighted graphs?

<details><summary>Model answer</summary>

The queue processes all nodes at distance d before any node at distance d + 1. The first time a node is discovered it is reached through a node at the smallest possible distance, so its recorded distance is minimal. This breaks with weighted edges, where a longer path in edges can be cheaper; then use Dijkstra (or 0-1 BFS for 0/1 weights).

</details>

### 4. What is multi-source BFS and why is it correct?

<details><summary>Model answer</summary>

Put every source in the queue at distance 0 before starting. It is equivalent to adding a super-source connected to all sources with weight 0, so each cell gets its distance to the nearest source in one O(V + E) pass. Examples: Rotting Oranges, Walls and Gates, 01 Matrix.

</details>

### 5. How do you count connected components?

<details><summary>Model answer</summary>

Loop over all vertices; whenever you find an unvisited one, increase the count and run BFS/DFS from it to mark its whole component. O(V + E). Union-Find is an alternative, especially when edges arrive over time.

</details>

### 6. How do you detect a cycle in an undirected graph vs a directed graph?

<details><summary>Model answer</summary>

Undirected: during DFS/BFS, seeing a visited neighbour that is not your parent means a cycle (or use union-find: an edge joining two nodes already in the same set). Directed: DFS with three colours (unvisited, on the current path, done); reaching a node that is "on the current path" means a back edge, i.e. a cycle. Or Kahn's algorithm: if fewer than V nodes get processed, there is a cycle.

</details>

### 7. How do you treat a grid as a graph?

<details><summary>Model answer</summary>

Each cell is a node; neighbours are the up/down/left/right cells (sometimes 8 directions) that are inside the grid and passable. Use a direction array, check bounds before reading, and mark visited either with a separate boolean grid or by overwriting the cell (if mutation is allowed). O(R · C).

</details>

### 8. Why might recursive DFS fail in JavaScript, and how do you fix it?

<details><summary>Model answer</summary>

Recursion depth can reach V (or R · C on a grid). A 1000 × 1000 all-land grid would need about 10^6 frames, but Node's stack holds roughly 10k. Use an explicit stack or BFS for large inputs.

</details>

### 9. "Boundary" problems like Surrounded Regions or Pacific Atlantic: what's the trick?

<details><summary>Model answer</summary>

Reverse the question: instead of asking "can this cell reach the border/ocean?" from every cell (O((RC)²)), start from the border/ocean cells and flood inward, marking everything they can reach. Then the answer is the unmarked (or doubly marked) cells. O(R · C).

</details>

### 10. How do you approach Word Ladder?

<details><summary>Model answer</summary>

Words are nodes; edges connect words that differ in one letter. BFS from beginWord gives the shortest transformation length. Generate neighbours by changing each position to each letter a–z and checking a Set (O(L · 26) per word), or bucket by wildcard patterns (`h*t`). Remove words from the Set when visited. Bidirectional BFS speeds it up further.

</details>

### 11. How do you clone a graph?

<details><summary>Model answer</summary>

Traverse (BFS or DFS) with a Map from original node to its copy. When you meet a neighbour not in the Map, create its copy and schedule it; always wire `copy.neighbors.push(map.get(neighbor))`. The Map doubles as the visited set and handles cycles.

</details>

### 12. How can you tell an undirected graph is a valid tree?

<details><summary>Model answer</summary>

It must have exactly n − 1 edges **and** be connected (one traversal reaches all n nodes). With n − 1 edges, connected implies acyclic. Union-Find also works: any edge joining two nodes already connected means a cycle.

</details>

### 13. What edge cases do you test for traversal problems?

<details><summary>Model answer</summary>

Empty graph or grid, a single node, disconnected components, unreachable target (return -1 or 0 as specified), start equals target, cycles and self loops, start cell blocked, and very large grids (stack depth).

</details>
