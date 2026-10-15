# SCC, Bridges, Bipartite and Euler — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [quiz](QUIZ.md).

---

### 1. When is a graph bipartite, and how do you check it?

<details><summary>Model answer</summary>

A graph is bipartite when you can colour every node with one of two colours so that no
edge joins two nodes of the same colour. That is true exactly when the graph has **no odd
cycle**. To check: BFS or DFS from every node that has no colour yet, give each neighbour
the opposite colour, and fail if a neighbour already has the same colour. O(V + E).
Remember to start from every component, not just node 0.

</details>

### 2. What is a strongly connected component, and why is it useful?

<details><summary>Model answer</summary>

An SCC is a largest set of nodes in a directed graph where every node can reach every
other node. If you shrink each SCC into a single node, you get a DAG (the condensation).
On that DAG you can use topological order, DP, or in-degree tricks. Example uses:
"minimum number of edges to add so the whole graph is strongly connected", and 2-SAT.

</details>

### 3. Explain Kosaraju's algorithm and why it works.

<details><summary>Model answer</summary>

1. DFS the whole graph and record each node when it **finishes**.
2. Reverse every edge.
3. Go through the nodes from the latest finish time to the earliest. Each DFS on the
   reversed graph from an unvisited node collects exactly one SCC.

Why: the node that finishes last is in a "source" SCC of the condensation (nothing else
points into it). After reversing, that SCC has no edges going out to other SCCs, so the
DFS cannot leak out. Then remove it and repeat the argument.

</details>

### 4. What does `low[u]` mean in Tarjan's algorithm?

<details><summary>Model answer</summary>

`low[u]` is the smallest discovery id you can reach from u's DFS subtree using tree
edges plus at most one back edge. For SCC, that back edge must go to a node that is still
on the stack. If `low[u] === ids[u]`, nothing below u can climb above u, so u is the root
of an SCC: pop the stack down to u.

</details>

### 5. Bridge condition vs articulation-point condition — why `>` vs `>=`?

<details><summary>Model answer</summary>

Edge u-v (v is u's child in the DFS) is a **bridge** if `low[v] > ids[u]`. Nothing in v's
subtree can reach u, or anything above u, without using u-v itself.
Vertex u (not the root) is an **articulation point** if some child has
`low[v] >= ids[u]`. The subtree may reach u itself, but nothing above u, so removing u
cuts it off. The root is a special case: it is an articulation point exactly when it has
2 or more DFS children.

</details>

### 6. Why skip the parent edge by index rather than by parent node?

<details><summary>Model answer</summary>

With parallel edges (two edges between u and v), the second edge is a real back edge.
It keeps u and v connected even if one edge is removed. If you skip "the parent node",
you skip both edges and wrongly call u-v a bridge. Skipping only the edge you came
through (by its index) handles this correctly.

</details>

### 7. When does a directed graph have an Eulerian path or circuit?

<details><summary>Model answer</summary>

Ignore nodes with no edges. All nodes that have edges must be connected (weakly
connected is enough). Then:
- **Circuit**: every node has in-degree = out-degree.
- **Path**: exactly one node has out = in + 1 (the start), exactly one has in = out + 1
  (the end), and every other node is balanced.

For undirected graphs: a circuit needs every degree even. A path needs exactly 0 or 2
nodes with odd degree.

</details>

### 8. How does Hierholzer's algorithm work, and why do we reverse at the end?

<details><summary>Model answer</summary>

Walk from the start, always taking an unused edge. When you get stuck at a node (it has
no unused edges left), that node must come **last** among what remains of the path. So
append it to the result and step back. Any loops you missed are spliced in while you step
back. Because nodes are added in "finish" order, the list comes out backwards; reverse it.
O(E). For the lexically smallest answer (Reconstruct Itinerary), sort each neighbour list.

</details>

### 9. Tarjan or Kosaraju in an interview?

<details><summary>Model answer</summary>

Kosaraju is easier to explain and to prove, but it needs a reversed graph and two
passes. Tarjan does one pass with less memory, but it has more small details
(`onStack`, using `ids[v]` vs `low[v]`). A good plan: explain Kosaraju, code whichever
one you know best, and mention that both are O(V + E).

</details>

### 10. How would you solve Possible Bipartition with union-find?

<details><summary>Model answer</summary>

Make a union-find of size 2n, where node `i + n` means "the enemy group of i". For each
dislike (a, b): if a and b are already in the same set, return false. Otherwise
`union(a, b + n)` and `union(b, a + n)`. This handles the edges one at a time, as they
arrive (online), which BFS colouring cannot easily do.

</details>

### 11. What is a state-space graph? Give the size for "Shortest Path Visiting All Nodes".

<details><summary>Model answer</summary>

It is a graph whose nodes are (position, extra information) rather than just positions.
For visiting all nodes, the state is (node, bitmask of visited nodes). There are n · 2^n
states, and each has up to n edges, so the BFS is O(n^2 · 2^n). For n = 12 that is about
600k steps.

</details>

### 12. Why can't you check "every node can reach every other node" in a directed graph with one BFS?

<details><summary>Model answer</summary>

One BFS from node s only shows that s can reach everyone. You also need everyone to reach s. Run a second BFS from s on the **reversed** graph. If both BFSs visit all nodes, the graph is strongly connected (it is a single SCC). This is the core idea behind Kosaraju.

</details>

### 13. What are the recursion risks in JavaScript for these algorithms?

<details><summary>Model answer</summary>

Tarjan, Kosaraju and the low-link algorithms are usually written as recursive DFS. A
path graph with 10^5 nodes goes 10^5 calls deep, which can overflow the V8 call stack.
Fixes: write the DFS with an explicit stack (keep a "next neighbour index" for each
frame), or mention that you would do so in production code.

</details>
