# Graphs (Representation) — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What is a graph, and how do directed, undirected, weighted and unweighted graphs differ?

<details><summary>Model answer</summary>

A set of vertices plus edges between pairs of them. Undirected edges work both ways (friendship); directed edges go one way (follows, prerequisites). Weighted edges carry a cost (distance, time); unweighted edges all count as 1. The type decides the algorithm: BFS for unweighted shortest paths, Dijkstra for non-negative weights, topological sort only for directed acyclic graphs.

</details>

### 2. Adjacency list vs adjacency matrix — when do you use each?

<details><summary>Model answer</summary>

List: O(V + E) space, iterating neighbours costs O(degree), checking "is u–v an edge?" costs O(degree) (or O(1) with Sets). Best for sparse graphs, which is almost every interview graph. Matrix: O(V²) space, O(1) edge check, iterating neighbours costs O(V). Use it for dense graphs, small V (≤ ~1000), or algorithms like Floyd–Warshall.

</details>

### 3. How do you build an adjacency list from an edge list in JavaScript?

<details><summary>Model answer</summary>

`const adj = Array.from({ length: n }, () => []);` then for each `[u, v]` push `v` into `adj[u]` and, if undirected, `u` into `adj[v]`. Never use `new Array(n).fill([])`: it puts the same array in every slot. For string vertex names, use a `Map` of arrays.

</details>

### 4. What is the relationship between trees and graphs?

<details><summary>Model answer</summary>

A tree is a connected, acyclic, undirected graph; with n vertices it has exactly n − 1 edges. A rooted tree adds a direction (parent → child). That is why tree recursion needs no visited set but general graph traversal does.

</details>

### 5. What are degree, in-degree and out-degree, and why do they matter?

<details><summary>Model answer</summary>

Degree is the number of edges touching a vertex (undirected). In a directed graph, in-degree counts incoming edges and out-degree outgoing ones. The sum of degrees is 2E (handshake lemma). In-degree 0 vertices start Kahn's topological sort; "in-degree n − 1 and out-degree 0" identifies a town judge / universal sink.

</details>

### 6. What is an implicit graph? Give examples.

<details><summary>Model answer</summary>

A graph you never store: neighbours are computed on the fly. Grids (4 neighbouring cells), Word Ladder (words one letter apart), Open the Lock (turn one wheel), game states. You still need a visited set; you just generate neighbours with a function instead of reading a list.

</details>

### 7. What are the common "edge" cases in graph input?

<details><summary>Model answer</summary>

Disconnected components (start a traversal from every unvisited vertex), isolated vertices with no edges, self loops, parallel (repeated) edges, cycles, vertex labels that are not 0..n−1 (map them), and n = 1 or E = 0.

</details>

### 8. How many edges can a simple graph have? What is "dense" vs "sparse"?

<details><summary>Model answer</summary>

Undirected simple graph: at most V(V − 1)/2; directed: V(V − 1). Dense means E is close to V², sparse means E is closer to V. Most real and interview graphs are sparse, which is why O(V + E) algorithms on adjacency lists are the default.

</details>

### 9. What does it mean to reverse (transpose) a directed graph, and when is it useful?

<details><summary>Model answer</summary>

Flip every edge u → v into v → u. O(V + E). Useful for "which vertices can reach t?" (search from t in the transpose), Kosaraju's strongly connected components, and "eventual safe states"-style problems.

</details>

### 10. How would you represent a weighted graph in JavaScript?

<details><summary>Model answer</summary>

Adjacency list of pairs: `adj[u].push([v, w])` (or objects `{ to, weight }`), or a matrix with `Infinity` for "no edge" and 0 on the diagonal. Pairs are compact and work directly with Dijkstra's heap.

</details>

### 11. When a problem gives you a grid, should you convert it to an adjacency list?

<details><summary>Model answer</summary>

Usually no. Walk the grid directly with a direction array `[[1,0],[-1,0],[0,1],[0,-1]]` and bounds checks; that saves O(R·C) memory and code. Converting helps only if you need a generic graph algorithm that expects lists, or for teaching.

</details>

### 12. What clarifying questions do you ask about a graph problem?

<details><summary>Model answer</summary>

Directed or undirected? Weighted? Can there be cycles, self loops or repeated edges? Is it connected? How are vertices labelled and how many are there (V, E bounds)? Is the graph given explicitly (edge list, matrix) or implicitly (grid, rules)?

</details>

### 13. Where do traversal and the graph algorithms live in this course?

<details><summary>Model answer</summary>

BFS/DFS and grid problems: [24_Graph_Traversal](../../24_Graph_Traversal/README.md). Topological sort: [26_Topological_Sorting](../../26_Topological_Sorting/README.md). Union-Find: [27_Union_Find_Disjoint_Set](../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md). Shortest paths, MST, SCC/bridges/bipartite: [25_Graph_Algorithms](../../25_Graph_Algorithms/01_Shortest_Paths/README.md).

</details>
