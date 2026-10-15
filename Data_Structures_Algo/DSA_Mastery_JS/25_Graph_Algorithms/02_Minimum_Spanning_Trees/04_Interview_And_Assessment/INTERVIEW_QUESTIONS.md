# Minimum Spanning Trees — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [quiz](QUIZ.md).

---

### 1. What is a minimum spanning tree and how is it different from a shortest-path tree?

<details><summary>Model answer</summary>

A spanning tree connects all V nodes using exactly V - 1 edges and has no cycle. The MST
is the spanning tree with the smallest **total** weight. A shortest-path tree from a source
minimises each node's distance **from that source**. These are different goals. Triangle
example: A-B 2, B-C 2, A-C 3. The MST is {A-B, B-C} with total 4. The shortest-path tree
from A uses A-C (3) to reach C, while the MST path from A to C costs 4.

</details>

### 2. State the cut property and use it to justify Kruskal.

<details><summary>Model answer</summary>

For any split of the nodes into two groups, the lightest edge crossing the split belongs
to some MST. Kruskal considers edges from light to heavy. When it accepts edge (u, v),
u and v are in different components. Look at the split "u's component vs everything
else". No lighter edge crosses it, or Kruskal would have accepted that edge earlier. So
(u, v) is the lightest crossing edge and is safe to take.

</details>

### 3. Kruskal or Prim? How do you decide?

<details><summary>Model answer</summary>

- The edges come as a list and the graph is sparse -> Kruskal, O(E log E). It also makes
  "force or forbid an edge" questions easy.
- You have an adjacency list, or the graph is dense -> Prim with a heap, O(E log V).
- The graph is complete (all pairs of points) -> Prim with a plain array, O(V^2), which
  beats sorting V^2 edges.

</details>

### 4. Why does Kruskal need union-find, and what is its cost?

<details><summary>Model answer</summary>

For each edge, Kruskal asks "are u and v already connected?" Running BFS every time would
make the whole thing O(E · V). Union-find with path compression and union by rank answers
in about O(α(V)), which is effectively constant. So the sort, O(E log E), dominates.

</details>

### 5. How do you detect that no spanning tree exists?

<details><summary>Model answer</summary>

In Kruskal, count the successful unions. Fewer than V - 1 means the graph is
disconnected. In Prim, count the nodes added to the tree. Fewer than V means some nodes
can't be reached. In both cases return -1 (or whatever the problem asks).

</details>

### 6. Does MST work with negative weights? With equal weights?

<details><summary>Model answer</summary>

Negative weights are fine. Kruskal and Prim only compare weights, and adding a constant
to every edge does not change which tree is lightest, since every spanning tree has
exactly V - 1 edges. Equal weights can give several different MSTs, all with the same
total. If all weights are distinct, the MST is unique.

</details>

### 7. In Prim, why do we mark a node "in the tree" when we pop it, not when we push it?

<details><summary>Model answer</summary>

A node can be pushed several times with different edge weights. A later push may be
cheaper. Only the first time it is **popped** do we know it is the cheapest edge into
the tree. If you mark it on push, you lock in the first edge you saw, which may not be
the cheapest. That gives a heavier tree.

</details>

### 8. How do you solve "Optimize Water Distribution" with MST?

<details><summary>Model answer</summary>

Add a virtual node 0 that stands for "the water source". Connect it to every house i
with weight `wells[i]`. Building a well at i is now the same as using edge 0-i. Run MST
on n + 1 nodes. The MST total is the minimum cost, and it decides on its own which
houses get wells and which get pipes.

</details>

### 9. How do you find critical and pseudo-critical MST edges?

<details><summary>Model answer</summary>

First compute the MST weight W. For each edge e (keep its original index):
- Run Kruskal **without** e. If the weight is greater than W, or the graph becomes
  disconnected, e is **critical**.
- Otherwise, run Kruskal with e **forced in** first. If the weight equals W, e is
  **pseudo-critical**.
That is O(E · E α) after the sort, which is fine for E up to about 200.

</details>

### 10. What is the "minimax" property of an MST?

<details><summary>Model answer</summary>

For any two nodes, the path between them in the MST has the smallest possible **largest
edge** among all paths. That is why "minimise the maximum edge on a path" problems
(Path With Minimum Effort, Swim in Rising Water) can also be solved with Kruskal-style
union-find: add edges in sorted order until the two endpoints connect.

</details>

### 11. How would you get k clusters from a set of points?

<details><summary>Model answer</summary>

Run Kruskal but stop after V - k successful unions (or build the full MST and remove its
k - 1 heaviest edges). This gives the k-clustering with the largest possible gap between
clusters. It is called single-linkage clustering.

</details>

### 12. Complexity of Min Cost to Connect All Points with each approach?

<details><summary>Model answer</summary>

There are E = n(n-1)/2 edges. Kruskal: O(n^2 log n) time and O(n^2) memory to hold all
the edges. Prim with a heap: O(n^2 log n). Prim with an array: O(n^2) time and O(n)
memory. For n = 1000 the array version is the clear winner.

</details>

### 13. What would you clarify before coding an MST problem?

<details><summary>Model answer</summary>

- Is the graph undirected? (MST needs that.)
- Is it guaranteed to be connected? What should I return if it isn't?
- Are nodes 0- or 1-indexed? Can there be parallel edges or self-loops?
- Do you need the total weight, the edges, or both?
- How big are V and E? Is the graph complete (that decides array Prim vs Kruskal)?

</details>
