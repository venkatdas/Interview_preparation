# Topological Sorting — Interview Questions

Answer each question out loud first, then open the model answer. Back to the [topic README](../README.md) or the [concepts guide](../01_Concepts/CONCEPTS.md).

---

### 1. What is a topological order, and when does one exist?

<details><summary>Model answer</summary>

It is an ordering of the nodes of a directed graph such that for every edge `u -> v`, u comes before v. One exists if and only if the graph is a DAG (directed, acyclic). If there is a cycle `a -> b -> a`, a must come before b and b before a, which is impossible.

</details>

### 2. Explain Kahn's algorithm and why it detects cycles.

<details><summary>Model answer</summary>

Compute every node's in-degree. Put all in-degree-0 nodes in a queue. Repeatedly dequeue a node, append it to the order, and decrement the in-degree of each neighbour; neighbours that reach 0 join the queue. Nodes on a cycle always have at least one incoming edge from another cycle node that never gets removed, so they never reach in-degree 0. If the output has fewer than n nodes, there is a cycle.

</details>

### 3. Explain the DFS approach. Why do we reverse the finish order?

<details><summary>Model answer</summary>

Run DFS and append each node to a list when it **finishes** (after all its descendants). For an edge `u -> v`, v always finishes before u: either v was already finished, or DFS visits v from u and finishes it first (if v were still in progress, that would be a back edge, i.e. a cycle). So the finish list has every edge pointing backwards; reversing it gives a topological order.

</details>

### 4. Why do we need three colours for directed cycle detection, when undirected cycle detection only needs "visited"?

<details><summary>Model answer</summary>

In a directed graph, reaching an already visited node is not always a cycle. In a diamond `0->1->3, 0->2->3`, node 3 is reached twice but there is no cycle. Only reaching a node that is still **on the current DFS path** (GRAY) proves a cycle. BLACK nodes are fully finished and safe. Undirected graphs do not have this distinction because every edge goes both ways.

</details>

### 5. What is the time and space complexity, and why?

<details><summary>Model answer</summary>

O(V + E) time for both methods: each node is enqueued / visited once, and each edge is looked at once (one in-degree decrement, or one neighbour check). O(V + E) space for the adjacency list, plus O(V) for in-degrees / colours and the queue or recursion stack.

</details>

### 6. How do you find the minimum number of semesters to finish all courses if you can take any number per semester?

<details><summary>Model answer</summary>

Run Kahn's algorithm level by level: all nodes in the queue at once form one semester. Count the levels. That equals the number of nodes on the longest path in the DAG. If not every course gets processed, return -1 (cycle).

</details>

### 7. How would you return the lexicographically smallest topological order?

<details><summary>Model answer</summary>

Use a min-heap instead of a FIFO queue in Kahn's algorithm. At every step, among all currently free nodes, take the smallest. Time becomes O(V log V + E).

</details>

### 8. How can you tell whether the topological order is unique?

<details><summary>Model answer</summary>

Run Kahn's algorithm and check that the queue never holds more than one node. If two nodes are free at the same time, they can be swapped, so the order is not unique. Equivalently, the unique order exists if and only if each consecutive pair in it is joined by an edge (the DAG has a Hamiltonian path).

</details>

### 9. In Course Schedule, `[a, b]` means "take b before a". Which way should the edge point, and what happens if you get it wrong?

<details><summary>Model answer</summary>

`b -> a` (from prerequisite to the course that needs it). If you reverse every edge, the cycle check still gives the right yes/no (reversing all edges preserves cycles), but the returned order is backwards, which breaks Course Schedule II. Always state the direction out loud before coding.

</details>

### 10. How does Alien Dictionary build its graph, and what are the traps?

<details><summary>Model answer</summary>

Compare each pair of adjacent words. The first position where they differ gives an edge `word1[i] -> word2[i]`; later positions tell you nothing. Traps: (1) if word2 is a strict prefix of word1 (`"abc"` before `"ab"`), the input is invalid, return `""`; (2) letters that appear in no edge still belong in the output; (3) avoid adding the same edge twice or in-degrees get inflated; (4) a cycle means `""`.

</details>

### 11. How do you find the longest (or shortest) path in a DAG, even with negative weights?

<details><summary>Model answer</summary>

Process nodes in topological order and relax each outgoing edge: `dist[v] = max(dist[v], dist[u] + w)` (or `min` for shortest). When you reach u, all its predecessors are done, so `dist[u]` is final. This is O(V + E) and works with negative weights, because there are no cycles. In a general graph, longest simple path is NP-hard.

</details>

### 12. Find Eventual Safe States: why reverse the graph?

<details><summary>Model answer</summary>

A node is safe if every path from it ends at a terminal node. Terminal nodes have out-degree 0. In the reversed graph they have in-degree 0, so Kahn's algorithm starts from them; a node becomes free when all of its original successors are known to be safe. Nodes on or leading into a cycle never become free. Alternatively, run 3-colour DFS: a node is safe if it finishes BLACK without meeting GRAY.

</details>

### 13. When would you choose DFS over Kahn, and vice versa?

<details><summary>Model answer</summary>

Kahn: iterative (no stack overflow), naturally gives levels for "minimum rounds", easy cycle check, easy to make lexicographic with a heap. DFS: natural when you are already doing memoised DFS (longest increasing path in a matrix), or need the finish order for something else (Kosaraju's SCC). Both are O(V + E).

</details>

### 14. Where does topological sorting show up in real frontend / tooling work?

<details><summary>Model answer</summary>

Bundlers order modules by imports and report circular imports; package managers install dependencies before dependents; monorepo tools (Turborepo, Nx) build packages in dependency order and run independent ones in parallel (the Kahn levels); spreadsheets recalculate cells in dependency order; reactive frameworks schedule derived values after their sources.

</details>
