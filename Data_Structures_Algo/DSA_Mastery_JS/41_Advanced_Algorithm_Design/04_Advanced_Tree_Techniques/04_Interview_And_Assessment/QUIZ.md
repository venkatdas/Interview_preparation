# Advanced Tree Techniques — Quiz

Answer each question before opening its answer. Aim for 12/14 before moving on.

**Q1 (multiple choice).** Two BFS find the diameter correctly on:
A) any undirected graph  B) trees with non-negative edge weights  C) trees with any edge weights  D) DAGs

<details><summary>Answer</summary>B. Cycles or negative weights break the "farthest node is a diameter endpoint" argument.</details>

**Q2 (predict the output).** `treeCenters(5, [[0,1],[1,2],[2,3],[3,4]])`

<details><summary>Answer</summary>`[2]` - a path of 4 edges has one middle node.</details>

**Q3 (predict the output).** `treeCenters(4, [[0,1],[1,2],[2,3]])`

<details><summary>Answer</summary>`[1, 2]` - 3 edges, two middles.</details>

**Q4 (complexity).** q subtree-sum queries with point updates using Euler tour + Fenwick on n nodes cost?

<details><summary>Answer</summary>O(n) to build (O(n log n) if you add values one by one) + O(log n) per query/update.</details>

**Q5 (fill in).** Rerooting for sum of distances: `ans[c] = ans[p] - ____ + ____`.

<details><summary>Answer</summary>`ans[c] = ans[p] - count[c] + (n - count[c])`.</details>

**Q6 (spot the bug).**

```js
function dfs(u, p) { for (const v of adj[u]) if (v !== p) dfs(v, u); }
dfs(0, -1); // n = 100000, edges form a path
```

<details><summary>Answer</summary>Recursion depth 10^5 overflows the JS call stack (RangeError). Use an explicit stack or BFS order.</details>

**Q7 (spot the bug).**

```js
update(v, x) { this.bit.add(this.tin[v], x); }
```

<details><summary>Answer</summary>A Fenwick tree stores sums: add the DIFFERENCE `x - values[v]` and then remember `values[v] = x`.</details>

**Q8 (multiple choice).** With tin/tout from an Euler tour, u is an ancestor of v (or equal) when:
A) tin[u] < tin[v]  B) tin[u] <= tin[v] && tout[v] <= tout[u]  C) tout[u] < tin[v]  D) depth[u] < depth[v]

<details><summary>Answer</summary>B - v's range sits inside u's range.</details>

**Q9 (complexity).** HLD path query with a Fenwick tree?

<details><summary>Answer</summary>O(log^2 n): O(log n) chains, each one Fenwick range query of O(log n).</details>

**Q10 (spot the bug).** In the HLD loop, the code lifts whichever of u, v has the larger `depth[u]` / `depth[v]`. What goes wrong?

<details><summary>Answer</summary>You must compare the depths of the chain HEADS. Lifting the deeper node can jump above the LCA when its own chain head is shallower than the other chain's head.</details>

**Q11 (multiple choice).** Maximum depth of a centroid decomposition tree for n nodes:
A) O(1)  B) O(log n)  C) O(sqrt n)  D) O(n)

<details><summary>Answer</summary>B - every piece is at most half of its parent piece.</details>

**Q12 (predict).** Canonical ids: do the rooted trees "root with children [leaf, path of 2]" and "root with children [path of 2, leaf]" get the same id?

<details><summary>Answer</summary>Yes - children ids are sorted before lookup, so child order does not matter.</details>

**Q13 (predict the output).** Number of Good Paths with vals = [2, 5, 2], edges = [[0,1],[1,2]].

<details><summary>Answer</summary>3 - only the single nodes; the 2..2 path passes through 5.</details>

**Q14 (recognition).** "For each node, return the sum of distances to all nodes in the tree, n = 3 * 10^4." Which technique?

<details><summary>Answer</summary>Rerooting DP, O(n). (BFS from every node is O(n^2) ~ 9 * 10^8.)</details>

## Mastery checklist

- [ ] I can code tree diameter (two BFS) and Minimum Height Trees from memory in under 15 minutes each.
- [ ] I can derive the rerooting formula for Sum of Distances on a whiteboard and explain both passes.
- [ ] I can build an Euler tour iteratively and answer subtree sums with updates using a Fenwick tree.
- [ ] I can explain centroid decomposition and heavy-light decomposition, including why each gives O(log n) levels/chains.
- [ ] I can say which of these techniques are interview-relevant and which are mostly competitive programming, and pick the simplest one that fits.
