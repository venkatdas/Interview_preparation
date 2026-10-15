# Union-Find Basics — Interview Questions

Answer each question out loud first, then open the model answer. Back to the [topic README](../README.md) or the [concepts guide](../01_Concepts/CONCEPTS.md).

---

### 1. What problem does union-find solve, and what are its two core operations?

<details><summary>Model answer</summary>

It maintains a partition of elements into disjoint groups while groups merge over time. `find(x)` returns the representative (root) of x's group; `union(a, b)` merges the groups of a and b. Two elements are in the same group exactly when their roots are equal.

</details>

### 2. How is it stored, and why is the root the "name" of the set?

<details><summary>Model answer</summary>

A `parent` array: each element points to a parent, and a root points to itself. Every group is a tree, and there is exactly one root per tree, so the root identifies the group. Comparing roots answers "same group?".

</details>

### 3. Explain path compression.

<details><summary>Model answer</summary>

During `find(x)`, after locating the root, make every node on the path point directly at the root. The next `find` on any of those nodes takes one step. It is done recursively (`parent[x] = find(parent[x])`) or with a second iterative pass.

</details>

### 4. Explain union by size (or rank) and why it matters.

<details><summary>Model answer</summary>

When merging, attach the root of the smaller tree under the root of the larger one. A node's depth only increases when its tree is at least doubled in size, so depth stays at most log2(n). Without it, unions like `union(0,1), union(0,2) ...` with the wrong attach direction can build a chain of length n.

</details>

### 5. What is the complexity with both optimisations? With only one?

<details><summary>Model answer</summary>

Both: O(alpha(n)) amortised per operation, where alpha is the inverse Ackermann function (at most 4 for any practical n), so effectively constant. Union by size alone: O(log n) worst case per find. Path compression alone: O(log n) amortised. Neither: O(n) per operation in the worst case. Space is O(n).

</details>

### 6. How do you detect a cycle in an undirected graph with union-find?

<details><summary>Model answer</summary>

Process edges one at a time. If `find(u) === find(v)` before the union, u and v are already connected by earlier edges, so `u - v` closes a cycle. In code, `union` returns false. Redundant Connection returns exactly that edge.

</details>

### 7. How do you check whether a graph is a valid tree?

<details><summary>Model answer</summary>

A tree on n nodes has exactly n - 1 edges, no cycle, and one component. Check `edges.length === n - 1`, then union every edge; if any union fails there is a cycle. With n - 1 edges and no cycle, the graph is automatically connected.

</details>

### 8. Why not just use DFS/BFS for connectivity?

<details><summary>Model answer</summary>

For one question on a fixed graph, DFS/BFS is O(V + E) and simpler. Union-find wins when edges arrive over time and you ask "connected?" or "how many components?" after each change (Number of Islands II), because it updates incrementally instead of recomputing. It is also the natural tool inside Kruskal's MST.

</details>

### 9. Why can union-find not be used for directed graphs?

<details><summary>Model answer</summary>

Union merges symmetric groups: after `union(a, b)`, a and b are interchangeable. Directed reachability is not symmetric (a reaches b does not mean b reaches a), so the direction is lost. Use DFS, topological sort, or SCC algorithms instead.

</details>

### 10. Can union-find delete an edge? What do you do if a problem removes edges?

<details><summary>Model answer</summary>

No; it can only merge. If all removals are known up front, process time in reverse: start from the final graph and add edges back (Bricks Falling When Hit). Otherwise use a rollback union-find with offline divide-and-conquer, or a different structure.

</details>

### 11. How do you use union-find on a grid?

<details><summary>Model answer</summary>

Map cell `(r, c)` to the id `r * cols + c`. Union each land cell with its land neighbours (usually only up and left are needed when scanning once, or all four when cells appear online). Track the count of land cells added minus successful unions.

</details>

### 12. In Accounts Merge, what do you union, and why not union by name?

<details><summary>Model answer</summary>

Union all emails within one account (e.g. each with the account's first email). Names are not unique: two different people can both be "John", so only a shared email proves identity. At the end, group emails by root, sort each group, and prepend the owner's name.

</details>

### 13. Most Stones Removed: why is the answer `stones - components`?

<details><summary>Model answer</summary>

Stones sharing a row or column are connected. Inside one connected component you can always remove stones in an order (e.g. reverse DFS order) until only one remains, and you can never remove the last one. So each component keeps exactly one stone: answer = n - number of components. Union rows with columns (offset column ids) to build the components.

</details>

### 14. What happens with recursive `find` on a deep tree in JavaScript?

<details><summary>Model answer</summary>

With union by size, depth is at most log2(n) (about 17 for 10^5), so recursion is fine. Without union by size, a chain of 10^5 can overflow the call stack. An iterative two-pass find avoids recursion completely.

</details>
