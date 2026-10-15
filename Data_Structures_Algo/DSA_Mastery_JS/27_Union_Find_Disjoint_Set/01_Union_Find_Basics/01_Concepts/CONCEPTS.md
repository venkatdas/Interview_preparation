# Union-Find (Disjoint Set Union)

## Prerequisites (Essential)

- [Graphs](../../../23_Graphs/README.md): nodes, undirected edges, connected components.
- [Graph Traversal](../../../24_Graph_Traversal/README.md): counting components with DFS/BFS (the thing union-find speeds up).
- [Binary Trees](../../../20_Trees/01_Binary_Trees/README.md): parent pointers and tree height.

## Intuition

**Union-Find** is a data structure that keeps track of a collection of **disjoint sets**
(groups that share no members) and supports two operations, both in almost-constant time:

- `find(x)` - which group is x in?
- `union(a, b)` - merge the groups of a and b.

Think of a party where people slowly form circles. When two circles touch, they merge
into one. At any moment you can ask "are Alice and Bob in the same circle?" and "how many
circles are there?" without walking through the whole room.

---

## Why it matters / when to use

- "are these two nodes connected?" asked **many times** while edges are **added**
- "count the components / groups / provinces / friend circles"
- "number of islands as land is added one cell at a time" (dynamic connectivity)
- "does adding this edge create a **cycle** in an undirected graph?" (redundant connection)
- "merge accounts / emails / equations that are equal"
- Kruskal's minimum spanning tree (sort edges, union if not already connected)
- "minimum edges to remove / add to make everything connected"
- Any time DFS would work but the graph keeps **changing** (DFS recomputes from scratch;
  union-find updates incrementally)

---

## How it works

### The idea: every set is a tree, the root is the "name" of the set

```
parent array, start: everyone is their own root     parent = [0, 1, 2, 3, 4]

union(0, 1)   ->   1's root now points at 0          parent = [0, 0, 2, 3, 4]

                 0        2    3    4
                 |
                 1

union(2, 3), union(1, 3)   -> attach root of 3 (which is 2) under root of 1 (which is 0)

                 0          4                         parent = [0, 0, 0, 2, 4]
               /   \
              1     2
                    |
                    3

find(3): 3 -> 2 -> 0. Root is 0.   find(1): 1 -> 0.   Same root => connected.
```

### find with path compression

Walking up a long chain every time is slow. After we find the root, point every node on
the path **directly** at the root. The tree gets flatter with every query.

```
before find(3):   0 <- 2 <- 3        after find(3):   0 <- 2
                                                       ^----- 3
```

```js
find(x) {
  if (parent[x] !== x) parent[x] = find(parent[x]);   // compress on the way back
  return parent[x];
}
```

### union by size (or rank)

When merging two trees, always attach the **smaller** tree under the **bigger** root.
This keeps trees shallow (height <= log n) even before compression kicks in.

```js
union(a, b) {
  let ra = find(a), rb = find(b);
  if (ra === rb) return false;                         // already together
  if (size[ra] < size[rb]) [ra, rb] = [rb, ra];        // ra is the bigger tree
  parent[rb] = ra;
  size[ra] += size[rb];
  count--;
  return true;
}
```

### Why "almost O(1)"?

With both optimisations, a sequence of m operations on n elements costs
O(m * alpha(n)), where alpha is the **inverse Ackermann function**. It grows so
unbelievably slowly that alpha(n) <= 4 for every n you could ever store (more atoms than
the universe). So in practice each operation is constant time. You do not need to
understand Ackermann; just say "amortised near-constant, inverse Ackermann".

Without optimisations a chain can be n deep -> O(n) per find. Path compression alone
gives O(log n) amortised. Both together: alpha(n).

### Detecting a cycle in an undirected graph

Process edges one by one. If `union(u, v)` returns **false**, u and v were *already*
connected by earlier edges, so this edge closes a loop.

```
edges [0-1], [1-2], [2-0]
union(0,1) true,  union(1,2) true,  union(2,0) -> find(2)=0, find(0)=0 -> FALSE -> cycle
```

### Counting components dynamically

Start with `count = n`. Every successful union decreases `count` by one. At any moment
`count` is the number of components - no traversal needed. That is why "Number of Islands
II" (land added one cell at a time) is a union-find problem and not a DFS one.

### When union-find beats DFS

| Situation | DFS / BFS | Union-Find |
|-----------|-----------|------------|
| static graph, one query | O(V + E), simplest | overkill |
| edges arrive over time, many "connected?" queries | O(V + E) **per query** | ~O(1) per op |
| undirected cycle detection while reading edges | needs the whole graph first | online, stop at first false union |
| Kruskal's MST | not applicable | the natural tool |
| **directed** graphs | yes | **no** - union-find ignores direction |
| need the actual path | yes | no, only "same set?" |

---

## Pseudocode

```
MAKE(n):
    parent[i] <- i, size[i] <- 1 for every i;  count <- n

FIND(x):                                   // with path compression
    if parent[x] != x:
        parent[x] <- FIND(parent[x])       // point x straight at the root
    return parent[x]

UNION(a, b):                               // by size
    ra <- FIND(a); rb <- FIND(b)
    if ra == rb: return false              // already together -> this edge closes a cycle
    if size[ra] < size[rb]: swap(ra, rb)   // ra is the bigger tree
    parent[rb] <- ra
    size[ra] <- size[ra] + size[rb]
    count <- count - 1
    return true

CONNECTED(a, b): return FIND(a) == FIND(b)
```

### Assumptions and limitations

- Sets can only **merge**. There is no efficient "split" or "delete edge". If edges are
  removed over time, process time backwards (deletions become additions).
- Union-find ignores **direction**. It answers "same group?" for undirected / symmetric
  relations only.
- It tells you **whether** two items are connected, never **how** (no path, no distance).
- The array version needs elements numbered `0..n-1`. For strings or sparse ids use the
  Map version or assign ids first.
- The near-O(1) bound needs **both** path compression and union by size/rank; drop one
  and the bound gets worse.

---

## Operations & complexity

| Operation | Time (amortised) | Space | Note |
|-----------|------------------|-------|------|
| constructor(n) | O(n) | O(n) | parent + size arrays |
| find(x) | O(alpha(n)) ~ O(1) | O(1) | with path compression |
| union(a, b) | O(alpha(n)) ~ O(1) | O(1) | with union by size |
| connected(a, b) | O(alpha(n)) | O(1) | two finds |
| count() | O(1) | O(1) | maintained counter |
| naive (no optimisation) | O(n) worst | | avoid |

---

## JavaScript implementation

Full code with tests: [`union_find.js`](../02_Implementations/union_find.js) (`UnionFind` for 0..n-1 and `UnionFindMap` for
arbitrary keys like email strings). Core (simplified: the real file keeps the fields private
and exposes `count()` as a method, plus `sizeOf(x)` and an iterative `findIterative(x)`):

```js
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array(n).fill(1);
    this.count = n;
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    this.count--;
    return true;
  }
  connected(a, b) { return this.find(a) === this.find(b); }
}
```

Solution files import it with `require('../../02_Implementations/union_find')`.

---

## Dry run on a concrete example

n = 5. Ties in union by size keep the FIRST root as the parent.

| Step | Call | find results | Action | parent | size (roots) | count | returns |
|------|------|--------------|--------|--------|--------------|-------|---------|
| 0 | new UnionFind(5) | - | - | [0, 1, 2, 3, 4] | all 1 | 5 | - |
| 1 | union(0, 1) | 0, 1 | 1 under 0 | [0, 0, 2, 3, 4] | size[0]=2 | 4 | true |
| 2 | union(2, 3) | 2, 3 | 3 under 2 | [0, 0, 2, 2, 4] | size[2]=2 | 3 | true |
| 3 | union(1, 3) | 0, 2 | tie, 2 under 0 | [0, 0, 0, 2, 4] | size[0]=4 | 2 | true |
| 4 | union(3, 0) | 3 -> 2 -> 0 (compress 3 to 0), 0 | same root | [0, 0, 0, 0, 4] | size[0]=4 | 2 | false (cycle) |
| 5 | connected(4, 1) | 4, 0 | - | unchanged | - | 2 | false |

Step 4 shows both ideas at once: the `false` return detects that edge 3-0 closes a
loop, and the find on 3 flattened the tree so later finds on 3 take one hop.

---

## Edge cases

- `n = 0` or `n = 1`: count is n; nothing to merge.
- `union(x, x)`: returns false and changes nothing.
- The same edge twice: the second call returns false (it would be a "cycle" in a multigraph).
- Labels starting at 1: allocate `n + 1` slots or subtract 1.
- Very long chains before compression: recursive `find` could hit the stack limit;
  union by size prevents that, and `findIterative` avoids recursion completely.

---

## Patterns / variations

### 1. Count components

```js
const uf = new UnionFind(n);
for (const [u, v] of edges) uf.union(u, v);
return uf.count();
```

### 2. First edge that creates a cycle

```js
for (const [u, v] of edges) if (!uf.union(u, v)) return [u, v];
```
Use when: Redundant Connection, Graph Valid Tree (cycle => false; also need count === 1).

### 3. Grid cells as nodes: id = row * cols + col

```js
const id = (r, c) => r * cols + c;
```
Use when: Number of Islands II, Surrounded Regions (UF variant), Bricks Falling.

### 4. Map-based union-find for strings

```js
uf.union(email1, email2);  // UnionFindMap auto-registers keys
```
Use when: Accounts Merge, Synonymous Sentences.

### 5. Union by "value" (consecutive numbers)

Union `x` with `x + 1` when both exist. The biggest set size is the longest run.
Use when: Longest Consecutive Sequence (UF variant).

### 6. Weighted union-find (ratio between a node and its root)

Keep `weight[x]` = value(x) / value(parent). Used by Evaluate Division. See
[Advanced Union-Find](../../02_Advanced_Union_Find/01_Concepts/CONCEPTS.md) and its solution
[03_evaluate_division.js](../../02_Advanced_Union_Find/03_Problems/solutions/03_evaluate_division.js)
(a graph/DFS version lives in [25_Graph_Algorithms](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/03_Problems/solutions/04_evaluate_division.js)).

### 7. Reverse / offline processing

If the problem REMOVES edges over time, process it backwards: start from the final
state and ADD edges. Union-find can only merge, never split.

---

## Alternatives

| Approach | Cost | Trade-off |
|----------|------|-----------|
| Re-run DFS/BFS for every query | O(V + E) per query | Simplest; fine for one static question, too slow for many queries on a growing graph |
| Label array ("quick-find"): relabel a whole group on union | find O(1), union O(n) | Easy to reason about; quadratic overall |
| Union-find without optimisations ("quick-union") | O(n) worst per op | Chains can get long |
| Union-find with union by size + path compression | ~O(1) amortised | The standard; cannot split sets |
| Union-find with rollback (no compression) | O(log n) | Supports undo; see [Advanced Union-Find](../../02_Advanced_Union_Find/README.md) |

---

## Common mistakes & edge cases

- Comparing `parent[a] === parent[b]` instead of `find(a) === find(b)` - only roots
  identify sets.
- Forgetting path compression -> O(n) chains -> TLE on big inputs.
- Union-find on a **directed** graph - it loses the direction. Use topological sort.
- Counting components with a separate traversal instead of the maintained `count`.
- Grid id arithmetic: `r * cols + c`, not `r * rows + c`.
- Processing a node twice in Number of Islands II (adding land where there already is
  land) - check before counting.
- Recursion depth in `find` on a 10^5-long chain before compression - use
  `findIterative` if worried.

---

## When this does NOT apply

- **Directed reachability or ordering** (prerequisites, "A must come before B"): use
  [topological sort](../../../26_Topological_Sorting/README.md) or DFS.
- **Shortest path / distance / the actual path**: union-find has no notion of path. Use
  BFS or [shortest-path algorithms](../../../25_Graph_Algorithms/01_Shortest_Paths/README.md).
- **Edges deleted online** in arbitrary order: plain union-find cannot split. Reverse time
  if all deletions are known in advance; otherwise you need heavier structures.
- **A single static "how many components?" question**: DFS/BFS is just as fast and simpler
  to write; union-find shines when edges keep arriving.

---

## Interview tips

- One-liner to say: "Union-find gives near-constant connectivity queries while edges are
  added; I'll use path compression and union by size."
- Draw the parent array, not the trees - it is faster on a whiteboard.
- Say `union` returns false on a redundant edge; that is your cycle detector.
- If asked complexity, say "O(alpha(n)) amortised, effectively constant" and move on.
- Mention the trade-off vs DFS: DFS is simpler for a static one-shot question;
  union-find wins when the graph changes or there are many queries.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Number of Connected Components | Medium | count via unions | 03_Problems/solutions/01_number_of_connected_components.js |
| 02 | Graph Valid Tree | Medium | cycle + count === 1 | 03_Problems/solutions/02_graph_valid_tree.js |
| 03 | Redundant Connection | Medium | first failed union | 03_Problems/solutions/03_redundant_connection.js |
| 04 | Number of Provinces | Medium | adjacency matrix unions | 03_Problems/solutions/04_number_of_provinces.js |
| 05 | Satisfiability of Equality Equations | Medium | union equals, check not-equals | 03_Problems/solutions/05_satisfiability_of_equality_equations.js |
| 06 | Accounts Merge | Medium | map-based UF on emails | 03_Problems/solutions/06_accounts_merge.js |
| 07 | Most Stones Removed | Medium | union rows and columns | 03_Problems/solutions/07_most_stones_removed.js |
| 08 | Smallest String With Swaps | Medium | group indices, sort within group | 03_Problems/solutions/08_smallest_string_with_swaps.js |
| 09 | Longest Consecutive Sequence (UF) | Medium | union x with x+1 | 03_Problems/solutions/09_longest_consecutive_sequence.js |
| 10 | Number of Islands II | Hard | dynamic components on a grid | 03_Problems/solutions/10_number_of_islands_ii.js |

---

## Practice more

Easy: Find if Path Exists in Graph (1971), Count the Number of Complete Components (2685)

Medium: Lexicographically Smallest Equivalent String (1061), Regions Cut By Slashes (959),
Number of Operations to Make Network Connected (1319), Remove Max Number of Edges to
Keep Graph Fully Traversable (1579), Checking Existence of Edge Length Limited Paths (1697),
Rank Transform of a Matrix (1632), Largest Component Size by Common Factor (952),
Synonymous Sentences (1258), The Earliest Moment When Everyone Become Friends (1101)

Hard: Redundant Connection II (685), Bricks Falling When Hit (803), Swim in Rising Water
(778, UF version), Minimize Malware Spread (924), Making A Large Island (827)
