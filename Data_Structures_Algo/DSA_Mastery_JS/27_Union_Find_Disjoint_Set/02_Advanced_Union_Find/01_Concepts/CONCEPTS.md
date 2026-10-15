# Disjoint Set (Union-Find) — Advanced

## Prerequisites (Essential)

- [Union-Find Basics](../../01_Union_Find_Basics/README.md): find, union, path compression, union by size. Do that topic first.
- [Hashing](../../../05_Hashing/README.md): Map-based union-find keys.
- [Stacks](../../../16_Stacks/README.md): the rollback history is a stack.

## Intuition

**Union-Find** (also called Disjoint Set Union, DSU) keeps track of which items belong to the
same group when groups only ever **merge**. Think of friend circles at a party: when two people
shake hands their circles merge, and you can ask "are Alice and Bob in the same circle?" at any
moment. Two operations, both nearly O(1): `find(x)` returns the group's representative (root),
`union(a, b)` merges two groups.

The basics are in [Union-Find Basics](../../01_Union_Find_Basics/01_Concepts/CONCEPTS.md). This folder adds the versions that come up in harder
interviews: **rollback** (undo a union), **weighted** union-find (store a relation such as
`a / b = 2` on the edges), and union-find over **strings / ids** using a Map.

---

## Why it matters / when to use

- "Are x and y connected?" with connections only being **added** (never removed)
- Counting components as edges arrive online (Number of Islands II)
- Equivalence relations: "a == b" constraints, equivalent characters, accounts with shared emails
- **Weighted**: relations with a value between nodes — ratios (`a / b = 2`), differences
  (`a - b = 3`), parity ("same team / different team")
- **Rollback**: "try adding this edge, explore, then undo" (offline dynamic connectivity,
  divide-and-conquer over time, backtracking searches that need connectivity)
- Kruskal's minimum spanning tree, cycle detection in undirected graphs, Redundant Connection

Signals: "merge", "group", "connected", "equivalent", "same set", "friend circles".

---

## How it works

### Recap: parent pointers, path compression, union by size

```
after union(0,1), union(2,3), union(1,3):

      0                  parent = [0, 0, 0, 2]     size[0] = 4
    /   \
   1     2
         |
         3

find(3): 3 -> 2 -> 0  (root 0). With path compression, 3 now points straight at 0.
union by size: always hang the smaller tree under the larger root so depth stays O(log n);
with both tricks each op is O(alpha(n)) - effectively constant.
```

### Rollback (undo the last union)

Path compression rewrites many pointers at once, which makes exact undo messy. So the
rollback variant uses **union by size only** (depth stays O(log n), still fast) and records
each successful union on a **history stack**:

```
union(a, b):  ra = find(a), rb = find(b); hang rb under ra
              history.push({ child: rb, parent: ra })
rollback():   { child, parent } = history.pop()
              parent[child] = child            (detach)
              size[parent] -= size[child]      (shrink)
              count++

snapshot = history.length    ->   rollbackTo(snapshot) undoes everything after it
```

No-op unions (already connected) push `null` so every `union` has exactly one `rollback`.

### Weighted union-find (relations on edges)

Each node stores a **weight to its parent**: `value[x] = weight[x] * value[parent[x]]`.
After `find(x)` compresses the path, `weight[x] = value[x] / value[root]`.

```
a / b = 2,  b / c = 3

     c                    weight[b] = 3   (b = 3c)
     |
     b                    weight[a] = 2   (a = 2b)
     |
     a

find(a): walk a -> b -> c, multiply weights along the way: a = 2 * 3 * c -> weight[a] = 6,
         parent[a] = c  (compressed)
query(a, c) = weight[a] / weight[c] = 6 / 1 = 6
query(b, a) = weight[b] / weight[a] = 3 / 6 = 0.5

union(a, b, k) when roots differ:   a = w(a)*ra,  b = w(b)*rb,  a = k*b
    attach ra under rb with  weight[ra] = k * w(b) / w(a)
```

Additive version (for `a - b = d`): same code with `*` → `+`, `/` → `-`, initial weight 0.
Parity version (same/different team): weights in {0, 1} with XOR.

### Union-find over strings / ids

Use two `Map`s (`parent`, `size`) and auto-add unknown keys on `find`. Same algorithm.
Alternative: assign each string an integer id first and use arrays.

---

## Pseudocode

```
// ---- rollback variant (union by size, NO path compression) ----
FIND(x): while parent[x] != x: x <- parent[x];  return x
UNION(a, b):
    ra <- FIND(a); rb <- FIND(b)
    if ra == rb: push null onto history; return false
    if size[ra] < size[rb]: swap(ra, rb)
    parent[rb] <- ra; size[ra] += size[rb]; count -= 1
    push (child = rb, parent = ra) onto history; return true
ROLLBACK():
    e <- pop history; if e is null: return
    parent[e.child] <- e.child; size[e.parent] -= size[e.child]; count += 1

// ---- weighted (multiplicative) variant ----
// invariant: value[x] = weight[x] * value[parent[x]]
FIND(x):
    if parent[x] == x: return x
    p <- parent[x]
    root <- FIND(p)                     // p now points at root, weight[p] = value[p] / value[root]
    weight[x] <- weight[x] * weight[p]
    parent[x] <- root
    return root
UNION(a, b, k):                         // records a / b = k
    ra <- FIND(a); rb <- FIND(b)
    if ra == rb: return
    parent[ra] <- rb
    weight[ra] <- k * weight[b] / weight[a]
QUERY(a, b):
    if a or b unknown, or FIND(a) != FIND(b): return "unknown" (-1)
    return weight[a] / weight[b]
```

### Assumptions and limitations

- **Rollback** only undoes unions in **reverse order** (it is a stack). You cannot undo an
  arbitrary old union in the middle.
- **Rollback** must not use path compression; finds cost O(log n), not O(alpha(n)).
- **Weighted** union-find assumes the relation is consistent and invertible (ratios with
  non-zero values, differences, XOR parity). A contradictory new equation is silently
  ignored by `union` when the two nodes are already connected; check `query` first if
  you must detect contradictions.
- Floating-point ratios accumulate rounding error; compare with a tolerance (`1e-9`).
- Like every union-find, nothing here can split a set.

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| find / union (compression + size) | O(alpha(n)) amortized | O(n) | effectively O(1) |
| find / union (rollback variant, size only) | O(log n) | O(n + history) | no compression |
| rollback | O(1) | - | pop one history entry |
| weighted find / union / query | O(alpha(n)) amortized | O(n) | one extra weight array |
| Map-based ops | O(alpha(n)) + hashing | O(n) | strings as keys |

`alpha(n)` is the inverse Ackermann function: < 5 for any input that fits in the universe.

---

## JavaScript implementation

Full code with randomized tests against a naive labelling reference: [`union_find.js`](../02_Implementations/union_find.js)
(`UnionFind`, `UnionFindRollback`, `WeightedUnionFind`, `MapUnionFind`). The standard core:

```js
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array(n).fill(1);
    this.count = n;
  }
  find(x) {
    while (this.parent[x] !== x) { this.parent[x] = this.parent[this.parent[x]]; x = this.parent[x]; } // path halving
    return x;
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra; this.size[ra] += this.size[rb]; this.count--;
    return true;
  }
}
```

---

## Dry run: weighted union-find

Equations `a / b = 2`, `b / c = 3`, `d / a = 4`, then queries. `w[x]` is the weight to the
current parent.

| Step | Operation | What happens | parent (non-roots) | w (non-1 values) | Result |
|------|-----------|--------------|--------------------|------------------|--------|
| 1 | union(a, b, 2) | ra = a, rb = b; hang a under b; w[a] = 2 * w(b) / w(a) = 2 | a->b | a:2 | - |
| 2 | union(b, c, 3) | ra = b, rb = c; hang b under c; w[b] = 3 * 1 / 1 = 3 | a->b, b->c | a:2, b:3 | - |
| 3 | query(a, c) | find(a): a->b->c, so w[a] = 2 * 3 = 6, a now points at c | a->c, b->c | a:6, b:3 | 6 / 1 = **6** |
| 4 | query(b, a) | same root c | a->c, b->c | a:6, b:3 | 3 / 6 = **0.5** |
| 5 | union(d, a, 4) | rd = d, ra = c; hang d under c; w[d] = 4 * w(a) / w(d) = 4 * 6 / 1 = 24 | a,b,d -> c | a:6, b:3, d:24 | - |
| 6 | query(d, b) | same root | unchanged | unchanged | 24 / 3 = **8** (d = 4a = 8b) |
| 7 | query(a, x) | x never seen | - | - | `null` (Evaluate Division reports **-1**) |

## Edge cases

- Querying a variable that never appeared, even `x / x`: answer -1, not 1.
- `rollback()` with an empty history: no-op.
- Redundant union in the rollback variant: still pushes `null` so the undo count stays aligned.
- Lexicographic representative: 26 letters only, so skipping union by size is safe.
- Number of Islands II with a repeated position: the count must not change.

---

## Patterns / variations

### 1. Two-pass constraints (equalities first, then inequalities)

```js
for (const eq of equations) if (eq[1] === '=') union(eq[0], eq[3]);
for (const eq of equations) if (eq[1] === '!' && find(eq[0]) === find(eq[3])) return false;
```
Use when: Satisfiability of Equality Equations. Order matters.

### 2. Choose the representative on purpose

```js
if (ra < rb) parent[rb] = ra; else parent[ra] = rb;   // smallest letter is the root
```
Use when: Lexicographically Smallest Equivalent String. Skip union-by-size when the
representative must carry meaning (26 nodes → depth is irrelevant).

### 3. Online component counting

```js
count++;                                   // new node is its own island
for (const nb of neighbours) if (isLand(nb) && union(id, nb)) count--;
```
Use when: Number of Islands II, "connect cells one by one".

### 4. Weighted relations

```js
union(a, b, values[i]);                    // a / b = values[i]
query(x, y);                               // weight[x] / weight[y] or -1
```
Use when: Evaluate Division, "Checking Existence of Edge Length Limited Paths" style
offline problems, "is this parity assignment consistent".

### 5. Rollback for offline / divide-and-conquer over time

Sort queries, apply edges that are alive on a segment, recurse into halves, `rollbackTo`
on the way back. Appears in competitive programming more than in interviews; know the idea.

---

## Alternatives

| Problem | Union-find variant | Alternative | Trade-off |
|---------|--------------------|-------------|-----------|
| Ratios between variables (Evaluate Division) | weighted UF, ~O(1) per query | build a weighted graph, DFS/BFS per query, O(V + E) per query | DFS is easier to derive; UF wins with many queries |
| Undo / offline dynamic connectivity | rollback UF, O(log n) | recompute components after every change, O(V + E) each | Recompute is simpler but quadratic overall |
| Parity ("same / different team") | XOR-weighted UF | BFS 2-colouring ([bipartite check](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md)) | BFS is standard for a static graph; UF handles constraints arriving online |
| String keys | Map-based UF | map strings to ids first, then array UF | Arrays are faster; Maps are less code |

---

## Common mistakes & edge cases

- Calling `union` on raw nodes instead of their roots when adjusting sizes/weights.
- Rollback + path compression together: do **not** compress in the rollback variant.
- Weighted find: update the weight **after** the recursive call returns (the parent must
  already be compressed), i.e. `weight[x] *= weight[p]` where `p` is the old parent.
- Weighted union formula direction: derive it on paper every time
  (`a = w(a)·ra`, `b = w(b)·rb`, `a = k·b` ⇒ `w(ra) = k·w(b)/w(a)`).
- Unknown variables in queries (`x / x` where `x` never appeared) → `-1`, not `1`.
- Duplicate inserts in online problems (Number of Islands II) must not change the count.
- Converting 2D cells to ids: `row * cols + col`, with `cols` (not `rows`).

---

## When this does NOT apply

- The relation is **not transitive** ("a likes b" does not make a like c) or is **directed**:
  union-find would merge things that should stay apart. Use graph traversal or
  [topological sort](../../../26_Topological_Sorting/README.md).
- You need to **remove** arbitrary connections in an arbitrary order, online.
- You need **paths or distances**, not just group membership.
- Weighted relations that are **not invertible** (for example "a <= b"): the
  multiply/divide trick needs an inverse; inequalities need a graph (difference
  constraints with [Bellman-Ford](../../../25_Graph_Algorithms/01_Shortest_Paths/README.md)).

---

## Interview tips

- Start with the recap sentence: *"Union-find with path compression and union by size gives
  near-constant find/union; perfect because edges are only added."*
- For weighted problems, draw three nodes in a chain, write the weights, and derive
  `query = weight[x] / weight[y]` before coding. Interviewers reward the derivation.
- Mention the DFS alternative for Evaluate Division and why union-find is nicer when queries
  interleave with new equations.
- When asked about deleting edges: *"Union-find can't delete; either reverse time (process
  deletions backwards as additions) or use rollback with offline divide-and-conquer."*
- Say `count` is maintained inside the structure - interviewers like that it is free.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Satisfiability of Equality Equations | Medium | two-pass constraints | 03_Problems/solutions/01_satisfiability_of_equality_equations.js |
| 02 | Lexicographically Smallest Equivalent String | Medium | chosen representative (smallest letter) | 03_Problems/solutions/02_lexicographically_smallest_equivalent_string.js |
| 03 | Evaluate Division | Medium | weighted union-find (ratios) | 03_Problems/solutions/03_evaluate_division.js |
| 04 | Number of Islands II | Hard | online union-find on a grid with a Map | 03_Problems/solutions/04_number_of_islands_ii.js |

---

## Practice more

Medium: Number of Provinces (547), Redundant Connection (684), Accounts Merge (721),
Most Stones Removed with Same Row or Column (947), Regions Cut By Slashes (959),
Smallest String With Swaps (1202), Number of Operations to Make Network Connected (1319),
Graph Valid Tree (261), Is Graph Bipartite? (785, parity union-find), Similar String Groups (839)

Hard: Number of Islands II (305), Swim in Rising Water (778), Bricks Falling When Hit (803,
reverse time), Checking Existence of Edge Length Limited Paths (1697), Minimize Malware Spread (924),
Rank Transform of a Matrix (1632), Making A Large Island (827), Number of Good Paths (2421)
