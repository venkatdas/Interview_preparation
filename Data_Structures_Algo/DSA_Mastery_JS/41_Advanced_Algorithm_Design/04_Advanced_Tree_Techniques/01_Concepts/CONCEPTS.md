# Advanced Tree Techniques

> **Level: Advanced.** Read the "How often" column below before you spend time here.

| Technique | Label | How often in interviews |
|---|---|---|
| Tree diameter (two BFS / DFS heights) | Essential (for Advanced) | fairly common (Medium) |
| Tree centers / Minimum Height Trees | Essential (for Advanced) | fairly common (Medium) |
| Rerooting DP ("answer for every root") | Advanced | occasional at top companies (Hard) |
| Binary lifting: k-th ancestor, LCA | Advanced | occasional, taught in [01_Classic_Techniques](../../01_Classic_Techniques/01_Concepts/CONCEPTS.md) |
| Euler tour + Fenwick (subtree queries) | Advanced | rare; mostly competitive programming |
| Heavy-light decomposition (path queries) | Advanced | rare; competitive programming |
| Centroid decomposition | Advanced | rare; competitive programming |
| Tree isomorphism (canonical hashing) | Advanced | rare, but the "canonical form" idea appears in "find duplicate subtrees" |

---

## 1. Prerequisites

- [Binary Trees](../../../20_Trees/01_Binary_Trees/README.md) and [N-ary Trees](../../../20_Trees/02_N_Ary_Trees_And_Misc/README.md) - traversals, heights.
- [Graph Traversal](../../../24_Graph_Traversal/README.md) - BFS, DFS, adjacency lists.
- [Fenwick Tree](../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/README.md) - point update + prefix sum in O(log n).
- [Union-Find](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) - used in "Number of Good Paths".
- [Classic Techniques](../../01_Classic_Techniques/README.md) - binary lifting for k-th ancestor and LCA.

Vocabulary: a **tree** here is an undirected connected graph with n nodes and n - 1 edges
(no cycles). We often **root** it at node 0 so words like parent, child and subtree make sense.

---

## 2. Intuition

Most "query on a tree" problems become easy once you change the shape of the tree into
something simpler:

- **Diameter / centers:** the longest path tells you the "width" of the tree; its middle is
  the best place to stand.
- **Euler tour:** walk the tree once with DFS and write nodes down in visiting order. Every
  subtree becomes ONE slice of that list. Subtree questions turn into array range questions.
- **Rerooting:** compute the answer for root 0, then "slide" the root along one edge at a time,
  fixing the answer in O(1) per move.
- **Centroid decomposition:** cut the tree at its middle node, then cut each piece at its
  middle, and so on. Only O(log n) levels of cutting.
- **Heavy-light decomposition:** cut every path into a few "chains" that are contiguous in an
  array; path questions become a few range questions.
- **Canonical hashing:** give every subtree shape a number; equal numbers mean equal shapes.

---

## 3. Mental model / analogy + ASCII visual

Think of the tree as a **folder structure** in your editor's file explorer. Expanding all
folders gives a flat list where each folder's contents sit right under it. That flat list
IS the Euler tour.

```
Tree (root 0)                 DFS preorder list (Euler tour)
        0                     index: 0  1  2  3  4  5
      /   \                   node : 0  1  3  4  2  5
     1     2                          |-----|  subtree of 1 = indices 1..3
    / \     \                                   |--| subtree of 2 = indices 4..5
   3   4     5
tin  = [0,1,4,2,3,5]   (where node v sits in the list)
tout = [5,3,5,2,3,5]   (last index of v's subtree = tin + size - 1)
```

**Rerooting** is like moving the "you are here" pin on a map by one step: people on your
side of the step get 1 closer, everyone else 1 farther.

```
root p                     root c (one step)
   p ---- c                count[c] nodes (c's side) : distance - 1
   |      |\               n - count[c] nodes (p's side): distance + 1
  ...    ...
```

**Heavy-light chains** (thick = heavy edge to the child with the biggest subtree):

```
        0
       ‖  \
       1   7          chains: [0,1,2,4] [3] [5,6] [7]
      ‖ \             a path never crosses more than O(log n) chains
      2  3
     ‖  \
     4   5
          ‖
          6
```

---

## 4. Why it exists (what problem it solves)

| Problem | Naive cost | With the technique |
|---|---|---|
| longest path in a tree | BFS from every node, O(n^2) | two BFS, O(n) |
| best root (min height) | BFS from every node, O(n^2) | peel leaves, O(n) |
| sum of distances from every node | O(n^2) | rerooting, O(n) |
| q subtree sums with updates | O(n) per query | Euler tour + Fenwick, O(log n) |
| q path sums with updates | O(n) per query | HLD + Fenwick, O(log^2 n) |
| count pairs at distance <= k | O(n^2) | centroid decomposition, O(n log^2 n) |
| k-th ancestor / LCA for many queries | O(n) per query | binary lifting, O(log n) |
| are two trees the same shape | try all n! labelings | canonical ids, O(n log n) |

---

## 5. How it works, step by step

### 5.1 Tree diameter (two BFS) — Essential for Advanced

1. BFS from any node s (say 0). Let a be the farthest node.
2. BFS from a. Let b be the farthest node. dist(a, b) is the diameter.

Why step 1 works: the farthest node from ANY node is an endpoint of some longest path. If it
were not, you could splice paths together and build something longer than the diameter.

Alternative (one DFS): for every node, the longest path "bending" at it is
`top1 + top2` of its children's heights + 1 each. Useful when edges have weights or when you
already run a post-order DP.

### 5.2 Tree centers (Minimum Height Trees)

The middle 1 or 2 nodes of a diameter minimise the height. Easiest code: peel leaves layer by
layer (all degree-1 nodes at once) until at most 2 nodes remain.

### 5.3 Euler tour + Fenwick

1. Preorder DFS from the root, giving each node `tin[v]` = its index in the visit order.
2. `size[v]` by adding children's sizes (process nodes in reverse preorder).
3. `tout[v] = tin[v] + size[v] - 1`. Subtree of v = positions `tin[v]..tout[v]`.
4. Fenwick tree over positions: put `value[v]` at `tin[v]`.
   - update value of v -> `add(tin[v], newValue - oldValue)`
   - subtree sum of v -> `range(tin[v], tout[v])`
5. Bonus: "is u an ancestor of v?" is `tin[u] <= tin[v] && tout[v] <= tout[u]` in O(1).

### 5.4 Rerooting DP

1. Root at 0. Post-order: `count[v]` (subtree size) and `down[v]` (answer inside v's subtree).
2. `ans[0] = down[0]`.
3. Pre-order: for each child c of p, derive `ans[c]` from `ans[p]` by removing c's
   contribution and adding the "rest of the tree" as a new child of c.
   For sum of distances: `ans[c] = ans[p] - count[c] + (n - count[c])`.

General recipe: "what does the parent side look like when seen from c?" If the combine is
max instead of sum, you need prefix/suffix maxima over siblings (or top-2) to "remove" c.

### 5.5 Centroid decomposition

1. A **centroid** is a node whose removal leaves pieces of size <= n/2. Every tree has one.
   Find it: compute subtree sizes, start anywhere, keep stepping into a child whose size is
   > n/2 until there is none.
2. Mark the centroid removed. Recurse on every remaining piece.
3. Each piece is at most half the size, so depth is O(log n) and every node belongs to
   O(log n) pieces in total.
4. Every path u..v has exactly ONE centroid c that is the first one removed among the path's
   nodes; the path goes through c. So "count paths with property P" = for each c, count
   paths through c inside its piece, subtracting pairs that stay inside the same child piece.

### 5.6 Heavy-light decomposition (overview + simple path sums)

1. Root the tree, compute sizes. `heavy[v]` = child with the largest subtree.
2. Walk from each chain head down its heavy children, giving consecutive positions `pos`.
   Every light child starts a new chain. `head[v]` = top of v's chain.
3. Moving up a light edge at least doubles the subtree size, so any root path crosses at
   most log2(n) light edges -> O(log n) chains.
4. Path query u..v: while `head[u] != head[v]`, take whichever has the DEEPER head, add the
   range `pos[head]..pos[node]`, jump to `parent[head]`. Then add the last range.
5. Point update: Fenwick add at `pos[v]`. Each query costs O(log n) chains x O(log n) Fenwick.

### 5.7 Tree isomorphism via canonical ids (AHU idea)

1. Rooted trees: post-order. A node's id is determined by the **sorted** list of its
   children's ids. Keep a shared `Map` from "sorted list" to a fresh integer.
2. Two rooted trees are the same shape exactly when the roots get the same id.
3. Unrooted trees: root at the center(s) (at most 2) and compare.

### 5.8 Binary lifting (link, no duplicate)

`up[k][v]` = 2^k-th ancestor. k-th ancestor: jump by the set bits of k. LCA: equalise depths,
then jump both nodes with the largest jumps that keep them different. Full explanation and
code: [01_Classic_Techniques CONCEPTS section 13](../../01_Classic_Techniques/01_Concepts/CONCEPTS.md).
Our implementation file re-exports it with `require`, so there is one copy.

---

## 6. Pseudocode

```
diameter(tree):
  a = farthest(BFS(0)); (b, d) = farthest(BFS(a)); return d

eulerTour(root):
  stack = [root]; timer = 0
  while stack: v = pop; tin[v] = timer++; push unvisited neighbours
  size via reverse order; tout[v] = tin[v] + size[v] - 1

reroot(sum of distances):
  post-order: count[p] += count[c]; down[p] += down[c] + count[c]
  ans[root] = down[root]
  pre-order:  ans[c] = ans[p] - count[c] + (n - count[c])

centroid(component):
  compute sizes from any start; c = start
  while some child x of c (away from start) has size[x] > total/2: c = x
  return c

hldPathSum(u, v):
  s = 0
  while head[u] != head[v]:
    if depth[head[u]] < depth[head[v]]: swap(u, v)
    s += range(pos[head[u]], pos[u]); u = parent[head[u]]
  if depth[u] > depth[v]: swap(u, v)
  return s + range(pos[u], pos[v])

canonicalId(v):
  ids = sorted(canonicalId(c) for c in children(v))
  return registry.getOrAssign(ids)
```

---

## 7. JavaScript implementation

Everything lives in [02_Implementations/tree_techniques.js](../02_Implementations/tree_techniques.js):
`treeDiameter`, `treeCenters`, `eulerTour`, `SubtreeSumQuery`, `sumOfDistances`,
`centroidDecomposition`, `countPairsWithinDistance`, `HeavyLightDecomposition`,
`rootedCanonicalId`, `areIsomorphic`, plus `binaryLiftingLCA` re-exported from
`01_Classic_Techniques`. All traversals are iterative.

The heart of rerooting, as short as it gets:

```js
// order = BFS order from 0 (parents before children), parent[] filled by the BFS
for (let i = n - 1; i > 0; i--) {             // children first
  const v = order[i], p = parent[v];
  count[p] += count[v];
  down[p] += down[v] + count[v];
}
ans[0] = down[0];
for (let i = 1; i < n; i++) {                 // parents first
  const v = order[i];
  ans[v] = ans[parent[v]] - count[v] + (n - count[v]);
}
```

Run it: `node 02_Implementations/tree_techniques.js` -> `✓ tree_techniques.js self-test passed`.

---

## 8. Dry run on a concrete example

Tree: edges `[0,1] [0,2] [2,3] [2,4] [2,5]`, n = 6, root 0 (LeetCode 834 example).

```
      0
     / \
    1   2
      / | \
     3  4  5
```

**Post-order (children first):**

| step | node v | parent p | count[v] | down[v] | count[p] after | down[p] after |
|---|---|---|---|---|---|---|
| 1 | 3 | 2 | 1 | 0 | 2 | 1 |
| 2 | 4 | 2 | 1 | 0 | 3 | 2 |
| 3 | 5 | 2 | 1 | 0 | 4 | 3 |
| 4 | 2 | 0 | 4 | 3 | 5 | 7 |
| 5 | 1 | 0 | 1 | 0 | 6 | 8 |

**Pre-order (parents first):** `ans[0] = down[0] = 8`

| node c | parent | formula | ans[c] |
|---|---|---|---|
| 1 | 0 | 8 - 1 + (6 - 1) | 12 |
| 2 | 0 | 8 - 4 + (6 - 4) | 6 |
| 3 | 2 | 6 - 1 + 5 | 10 |
| 4 | 2 | 6 - 1 + 5 | 10 |
| 5 | 2 | 6 - 1 + 5 | 10 |

Answer `[8, 12, 6, 10, 10, 10]`. Check node 2 by hand: distances 1 (to 0), 2 (to 1), 1, 1, 1 -> 6.

**Diameter on the same tree:** BFS from 0 -> dist `[0,1,1,2,2,2]`, farthest a = 3.
BFS from 3 -> dist `[2,3,1,0,2,2]`, farthest b = 1 at distance 3. Diameter = 3 (path 3-2-0-1).

---

## 9. Edge cases

- n = 1 (no edges): diameter 0, centers [0], sum of distances [0], subtree = the whole tree.
- n = 2: two centers.
- Path-shaped trees with 10^5 nodes: **recursion overflows** the JS call stack (about 10k
  frames). Use an explicit stack or BFS order.
- Star-shaped trees: one node has degree n - 1; adjacency lists handle it fine.
- Input edges in any orientation (`[child, parent]` or `[parent, child]`) - always add both
  directions.
- Node labels may not satisfy `parent[i] < i`; never assume a topological labelling.
- Negative node values in sum queries - Fenwick works with any numbers.
- Disconnected input means it is a forest, not a tree; ask. Run the technique per component.

---

## 10. Complexity analysis

| Operation | Time | Space | Why |
|---|---|---|---|
| diameter (two BFS) | O(n) | O(n) | each BFS touches every edge twice |
| centers (peel leaves) | O(n) | O(n) | each node removed once |
| Euler tour build | O(n) | O(n) | one DFS |
| subtree sum / point update | O(log n) | O(n) | one Fenwick range / point op |
| rerooting DP (all roots) | O(n) | O(n) | two passes, O(1) per edge |
| centroid decomposition build | O(n log n) | O(n) | O(log n) levels, each level is O(n) work |
| count pairs dist <= k (centroid) | O(n log^2 n) | O(n) | sorting distances at each level |
| HLD build | O(n) | O(n) | sizes + one walk over chains |
| HLD path sum / point update | O(log^2 n) / O(log n) | O(n) | O(log n) chains, each a Fenwick range |
| canonical ids | O(n log n) | O(n) | sorting children's ids at each node |
| binary lifting build / query | O(n log n) / O(log n) | O(n log n) | log n jump tables |

---

## 11. Alternatives (brute force vs optimized, trade-offs)

- **Diameter:** BFS from every node is O(n^2) but obviously correct; perfect as a test oracle.
  The one-DFS "top two heights" method also handles weighted edges with non-negative weights.
  Two BFS does NOT work with negative edge weights.
- **Subtree queries:** if there are no updates, a plain post-order DP (`sum[v]`) answers every
  subtree sum in O(1). Use Euler tour + Fenwick only when values change.
- **Path queries:** with no updates, prefix sums from the root + LCA give
  `sum(u,v) = pre[u] + pre[v] - 2*pre[lca] + val[lca]` in O(log n). HLD is for updates
  (or for max/min on paths, where subtraction does not work).
- **Segment tree instead of Fenwick:** needed for range updates or for min/max.
- **Centroid vs small-to-large merging:** "DSU on tree" / small-to-large merging of maps often
  solves the same counting problems in O(n log n) or O(n log^2 n) with simpler code.
- **Isomorphism with strings:** `"(" + sorted child strings + ")"` is easier to explain but can
  cost O(n^2) on deep trees; integer ids keep it O(n log n).

---

## 12. Common mistakes (and why they happen)

| Mistake | Why it happens | Fix |
|---|---|---|
| Recursive DFS on 10^5-node path | JS stack is shallow | iterative stack / BFS order |
| Adding only one direction of each edge | thinking of the tree as directed | push both `u->v` and `v->u` |
| Forgetting `seen`/`parent` check | trees have no cycles, but undirected edges go back to parent | skip the parent |
| Rerooting with wrong count | using `count[p]` instead of `count[c]` | the nodes that get closer are c's subtree |
| Euler tour with `tout` from a post-order counter | mixing two different numbering schemes | use `tout = tin + size - 1` |
| Fenwick update with the new value instead of the delta | Fenwick stores sums, not values | `add(pos, newValue - oldValue)` and remember the old value |
| HLD: lifting the node with the deeper NODE instead of deeper HEAD | looks symmetric | compare `depth[head[u]]` vs `depth[head[v]]` |
| Centroid: using sizes from the original rooting | sizes change after removals | recompute sizes per component |
| Isomorphism: not sorting children | children order is arbitrary | sort ids before building the key |
| MHT: starting the peel loop when n <= 2 | degree-1 logic breaks for n = 1 | return early for n <= 2 |

---

## 13. Patterns / variations with templates

### Pattern A — "farthest node" / "longest path" -> two BFS

```js
const far = src => { const d = bfs(src); let a = 0; d.forEach((x, i) => { if (x > d[a]) a = i; }); return [a, d[a]]; };
const [a] = far(0);
const [, diameter] = far(a);
```

### Pattern B — "answer for every node as root" -> rerooting

```js
// pass 1: down[v] from children; pass 2: ans[c] = combine(ans[p] without c, c's own down)
```

### Pattern C — "many subtree queries with updates" -> Euler tour + Fenwick / segment tree

```js
bit.add(tin[v], delta);                  // update node v
bit.range(tin[v], tin[v] + size[v] - 1); // subtree of v
```

### Pattern D — "many path queries with updates" -> HLD (or LCA + prefix sums if no updates)

### Pattern E — "count pairs / paths with distance property" -> centroid decomposition

### Pattern F — "same shape" / "duplicate subtrees" -> canonical id per subtree

```js
const key = childIds.sort((a, b) => a - b).join(',');
if (!registry.has(key)) registry.set(key, registry.size);
```

### Pattern G — "process values in increasing order, connect as you go" -> sort + union-find (Good Paths)

---

## 14. Recognition clues

**Use these techniques when:**

- "longest path", "farthest pair", "diameter" in a tree -> two BFS.
- "which root minimises height", "best meeting node" -> centers / rerooting.
- "for EACH node, compute something about the whole tree" with n ~ 10^4..10^5 -> rerooting.
- "subtree of v" + "update a node" in many queries -> Euler tour + Fenwick.
- "path between u and v" + updates -> HLD; without updates -> LCA (+ prefix sums).
- "k-th ancestor", "lowest common ancestor", many queries -> binary lifting.
- "count pairs of nodes at distance <= k / exactly k" on a big tree -> centroid.
- "are these trees the same up to relabelling" -> canonical ids.

**They do NOT apply when:**

- The graph has cycles (not a tree): diameter by two BFS is wrong on general graphs.
- Only ONE query: a single DFS is already O(n); the fancy structure is overhead.
- n <= 1000 and an O(n^2) BFS-from-every-node fits the limit - write the simple version.
- Edge weights can be negative: two BFS / farthest-node arguments break.
- The "tree" is a BST and the question is about ordering - use BST techniques instead.

---

## 15. Interview application (talk track, what to clarify)

**Clarify first:**

1. Is it guaranteed to be a tree (connected, n - 1 edges)? Rooted or unrooted? Which root?
2. How big is n, how many queries? (decides O(n) per query vs O(log n) per query)
3. Are there updates? Point or range? Sum or max?
4. Can the tree be a long path (recursion depth)?

**Talk track (Sum of Distances example):**

> "Brute force is BFS from every node, O(n^2), too slow for 3 * 10^4. Notice that if I know
> the answer for a node p, moving to a neighbour c changes every distance by exactly one:
> c's subtree gets closer, the rest gets farther. So one post-order pass gives the answer for
> the root and subtree sizes, and one pre-order pass derives everyone else in O(1) each.
> O(n) total. I'll do it iteratively in case the tree is a long chain."

**Honest positioning:** if a problem seems to need HLD or centroid decomposition in an
interview, first look for a simpler idea (LCA + prefix sums, small-to-large merging, offline
sorting + union-find). Interviewers rarely expect HLD code; explaining the idea is a strong
bonus.

---

## 16. Problems in this topic + Practice more

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Tree Diameter | Medium | two BFS | [statement](../03_Problems/02_Medium/01_tree_diameter.md) | [solution](../03_Problems/solutions/01_tree_diameter.js) |
| 02 | Minimum Height Trees | Medium | peel leaves / centers | [statement](../03_Problems/02_Medium/02_minimum_height_trees.md) | [solution](../03_Problems/solutions/02_minimum_height_trees.js) |
| 03 | Count Subtree Sums with Updates | Medium | Euler tour + Fenwick | [statement](../03_Problems/02_Medium/03_count_subtree_sums_with_updates.md) | [solution](../03_Problems/solutions/03_count_subtree_sums_with_updates.js) |
| 04 | Kth Ancestor of a Tree Node | Hard | binary lifting (reused) | [statement](../03_Problems/03_Hard/04_kth_ancestor_of_a_tree_node.md) | [solution](../03_Problems/solutions/04_kth_ancestor_of_a_tree_node.js) |
| 05 | Path Sum Queries with Updates | Hard | heavy-light decomposition | [statement](../03_Problems/03_Hard/05_path_sum_queries_with_updates.md) | [solution](../03_Problems/solutions/05_path_sum_queries_with_updates.js) |
| 06 | Sum of Distances in Tree | Hard | rerooting DP | [statement](../03_Problems/03_Hard/06_sum_of_distances_in_tree.md) | [solution](../03_Problems/solutions/06_sum_of_distances_in_tree.js) |
| 07 | Number of Good Paths | Hard | sort + union-find | [statement](../03_Problems/03_Hard/07_number_of_good_paths.md) | [solution](../03_Problems/solutions/07_number_of_good_paths.js) |

**Practice more (LeetCode):**

- 543 Diameter of Binary Tree, 1522 Diameter of N-Ary Tree, 2246 Longest Path With Different Adjacent Characters
- 2538 Difference Between Maximum and Minimum Price Sum (rerooting), 2581 Count Number of Possible Root Nodes (rerooting), 310 Minimum Height Trees
- 1617 Count Subtrees With Max Distance Between Cities, 2603 Collect Coins in a Tree (peel leaves)
- 236 Lowest Common Ancestor of a Binary Tree, 2846 Minimum Edge Weight Equilibrium Queries in a Tree (LCA + counts)
- 652 Find Duplicate Subtrees (canonical ids), 2003 Smallest Missing Genetic Value in Each Subtree
- 1569 Number of Ways to Reorder Array to Get Same BST, 2322 Minimum Score After Removals on a Tree (Euler tour tin/tout)
