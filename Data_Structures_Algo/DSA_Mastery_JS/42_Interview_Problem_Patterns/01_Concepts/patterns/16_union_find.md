# 16. Union-Find (Disjoint Set Union)

Union-find keeps track of groups that only ever **merge**. Each group has a representative (its
root). `find(x)` returns x's root; `union(a, b)` merges two groups. With **path compression**
(point nodes straight at the root while finding) and **union by rank/size** (hang the smaller
tree under the bigger), each operation is almost O(1) — technically O(α(n)), where α grows so
slowly it is below 5 for any real input.

Use it when edges arrive one at a time and you keep asking "are these connected?" or "how many
groups are there now?".

**Teaches in depth:** [Union-Find Basics](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md), [Advanced Union-Find](../../../27_Union_Find_Disjoint_Set/02_Advanced_Union_Find/README.md), [Minimum Spanning Trees](../../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at union-find |
|---|---|
| "number of connected components / provinces / groups" | count = n - successful unions |
| "redundant connection", "which edge creates a cycle" | `union` returns false when already connected |
| "is the graph a valid tree" | n - 1 edges and no failed union |
| "accounts merge", "same email means same person" | union items that share a key |
| "equations a == b, a != b satisfiable?" | union all equalities, then check inequalities |
| "islands appear one by one" (online) | union each new land cell with neighbors |
| "minimum spanning tree", "connect all points cheaply" | Kruskal = sort edges + union-find |

**Constraint hints**

- Up to 10^5 unions and queries interleaved -> union-find (near O(1) each) beats re-running BFS (O(V + E) each).
- Static graph, one question -> BFS/DFS is equally good and sometimes simpler.

## 2. When it applies (preconditions)

- Relationships are **symmetric and transitive** (undirected connectivity, equivalence).
- Groups only **merge**, never split.

## 3. When it does NOT apply

- **Deletions / splitting.** Remove edge `1 - 2` from `0 - 1 - 2`: union-find cannot undo it (no "un-union"). Process offline in reverse (add edges backward) or use another structure.
- **Directed reachability.** `a -> b` does not mean `b -> a`. Union-find would wrongly say b reaches a. Use DFS/BFS or SCCs.
- **Shortest paths or path contents.** Union-find knows *whether* two nodes are connected, not *how*. Use BFS/Dijkstra.

## 4. The template

```js
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n; // number of components
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]); // path compression
    return this.parent[x];
  }
  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false; // already connected (a cycle if this was a new edge)
    if (this.rank[rootA] < this.rank[rootB]) [rootA, rootB] = [rootB, rootA];
    this.parent[rootB] = rootA;
    if (this.rank[rootA] === this.rank[rootB]) this.rank[rootA]++;
    this.count--;
    return true;
  }
  connected(a, b) { return this.find(a) === this.find(b); }
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`UnionFind`) and [tests/patterns.test.js](../../tests/patterns.test.js) (component counts compared with `countComponents` DFS on random graphs).

**Dry run** n = 5, unions (0,1), (1,2), (3,4), (0,2):

| union | roots before | result | count |
|---|---|---|---|
| (0,1) | 0, 1 | parent[1] = 0 | 4 |
| (1,2) | 0, 2 | parent[2] = 0 | 3 |
| (3,4) | 3, 4 | parent[4] = 3 | 2 |
| (0,2) | 0, 0 | false (redundant) | 2 |

## 5. Variations

- **Union by size** instead of rank: also lets you answer "size of x's group".
- **String / coordinate keys:** map each key to an index first (`Map<string, number>`), or use a `Map` as the parent store.
- **Weighted union-find:** store a ratio to the parent (Evaluate Division: `a / b = 2`).
- **Kruskal MST:** sort edges by weight, add an edge if `union` succeeds; stop at n - 1 edges.
- **Grid problems:** index = `r * cols + c`.
- **Offline reverse processing:** to handle deletions, add edges in reverse order.

## 6. Common pitfalls

1. Comparing `parent[a] === parent[b]` instead of `find(a) === find(b)`: parents are not always roots.
2. Forgetting path compression and union by rank -> chains of length n, O(n) per find.
3. Recursive `find` on a very deep chain (no rank, 10^5 unions in a line) can overflow the stack. With union by rank the depth stays O(log n), so recursion is safe; otherwise write `find` iteratively.
4. Decrementing `count` even when the union failed.
5. Using union-find on directed edges (see section 3).

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Number of Connected Components | Medium | count after unions | [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/01_number_of_connected_components.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/01_number_of_connected_components.js) |
| 2 | Graph Valid Tree | Medium | n - 1 edges, no cycle | [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/02_graph_valid_tree.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/02_graph_valid_tree.js) |
| 3 | Redundant Connection | Medium | first failed union | [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/03_redundant_connection.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/03_redundant_connection.js) |
| 4 | Number of Provinces | Medium | adjacency matrix + DSU | [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/04_number_of_provinces.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/04_number_of_provinces.js) |
| 5 | Satisfiability of Equality Equations | Medium | union ==, check != | [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/05_satisfiability_of_equality_equations.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/05_satisfiability_of_equality_equations.js) |
| 6 | Accounts Merge | Medium | union by shared email | [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/06_accounts_merge.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/06_accounts_merge.js) |
| 7 | Most Stones Removed | Medium | union rows and columns | [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/07_most_stones_removed.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/07_most_stones_removed.js) |
| 8 | Evaluate Division | Medium | weighted DSU | [statement](../../../27_Union_Find_Disjoint_Set/02_Advanced_Union_Find/03_Problems/02_Medium/03_evaluate_division.md) · [solution](../../../27_Union_Find_Disjoint_Set/02_Advanced_Union_Find/03_Problems/solutions/03_evaluate_division.js) |
| 9 | Min Cost to Connect All Points | Medium | Kruskal | [statement](../../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/03_Problems/02_Medium/02_min_cost_to_connect_all_points.md) · [solution](../../../25_Graph_Algorithms/02_Minimum_Spanning_Trees/03_Problems/solutions/02_min_cost_to_connect_all_points.js) |
| 10 | Number of Islands II | Hard | online unions on a grid | [statement](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/03_Hard/10_number_of_islands_ii.md) · [solution](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/solutions/10_number_of_islands_ii.js) |

## 8. Self-check

**Q1.** What does `union` returning `false` tell you when adding edges of an undirected graph?

<details><summary>Answer</summary>

Both endpoints were already connected, so this edge closes a cycle. That is exactly "Redundant Connection".

</details>

**Q2.** Why do we need both path compression and union by rank?

<details><summary>Answer</summary>

Either alone gives O(log n) amortized. Together they give O(α(n)), effectively constant. Union by rank keeps trees shallow; path compression flattens them further on every find.

</details>

**Q3.** A graph with n nodes and n - 1 edges. Is it always a tree?

<details><summary>Answer</summary>

No. It is a tree only if it is also connected (equivalently, has no cycle). Example: n = 4, edges (0,1), (1,2), (2,0) — 3 edges, but a cycle plus an isolated node 3.

</details>

---

Previous: [15. Topological Sort](15_topological_sort.md) · Next: [17. Dynamic Programming (families)](17_dynamic_programming_families.md) · [Pattern index](../../README.md)
