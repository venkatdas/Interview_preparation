# Network Flow (Advanced)

> **Level: Advanced.** **How often in interviews:** rare. Most product-company interviews
> never ask you to *code* max flow. What does show up, occasionally at top companies
> (Google, quant firms, some infra teams): **bipartite matching** (Kuhn's DFS, ~25 lines)
> and recognising "this is a min cut / matching problem" in a design or follow-up
> discussion. Write Kuhn and Edmonds–Karp from memory; know Dinic, Hopcroft–Karp and
> min-cost flow well enough to explain. Competitive programming uses all of it constantly.

A **flow network** is a directed graph where every edge is a pipe with a *capacity*.
Water starts at a **source** `s` and must end at a **sink** `t`. The **maximum flow**
question: how much water per second can you push from `s` to `t` without overfilling any
pipe? Surprisingly many problems — matching people to jobs, cutting a network as cheaply
as possible, choosing projects with dependencies — turn into exactly this question.

---

## 1. Prerequisites

- [Graphs](../../../23_Graphs/README.md) — adjacency lists, directed edges
- [Graph Traversal](../../../24_Graph_Traversal/README.md) — BFS and DFS (every flow algorithm is BFS/DFS in a loop)
- [Shortest Paths](../../../25_Graph_Algorithms/01_Shortest_Paths/README.md) — Bellman–Ford, for min-cost flow
- [SCC, Bridges, Bipartite](../../../25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/README.md) — what "bipartite" means
- [Classic Techniques](../../01_Classic_Techniques/README.md) — the previous sub-topic

---

## 2. Intuition

Imagine city water pipes. Each pipe has a maximum throughput. You want as much water as
possible from the reservoir (`s`) to the city (`t`).

Simple plan: find any route with spare room, push as much as the narrowest pipe on it
allows, repeat. The catch: an early route may use pipes "badly" and block better routes
later. The fix is the single most important idea in this topic:

> Pushing flow along u -> v creates the option to **push it back** along v -> u later.
> Pushing back = cancelling (undoing) part of an earlier decision.

The graph of "how much more can I push on each edge, including these undo edges" is the
**residual graph**. Keep finding paths in it (**augmenting paths**) until none exist. At
that moment the flow is maximum.

---

## 3. Mental model and visual

```
Original network (capacity on each edge)       Residual graph after pushing 2 along s -> a -> t

      s --3--> a --2--> t                        s --1--> a --0--> t      (forward: c - f)
      |        |        ^                        s <--2-- a <--2-- t      (backward: f, the "undo" edges)
      2        1        3                        |        |        ^
      v        v        |                        2        1        3
      b ---------------+                         v        v        |
      (a -> b, b -> t)                           b ---------------+

Pipe with capacity c and flow f  ==>  forward residual c - f,  backward residual f.
```

The "two-sided pipe" picture: every edge is a pair of counters. Sending flow moves units
from the forward counter to the backward counter. Undoing moves them back.

**Min cut picture.** Draw a line separating `s` from `t`. Every drop of water must cross
that line, so the total capacity of pipes crossing it (from the s side to the t side) is
an upper bound on the flow. The *smallest* such line is the bottleneck of the whole
network.

```
Same network. Cut S = {s, a} | T = {b, t}:

        S side         |   T side
   s --3--> a --2------|-----> t         crossing S -> T:  a->t (2) + a->b (1) + s->b (2) = 5
   s --2---------------|-----> b         (an edge T -> S would NOT count)
            a --1------|-----> b

Other cuts: S = {s} costs 3 + 2 = 5, S = {s, a, b} costs 2 + 3 = 5.
The smallest cut is 5, and (section 8) the max flow is also 5. Not a coincidence.
```

---

## 4. Why it exists

Some problems are "assign things under limits" or "separate things as cheaply as
possible". Greedy fails on them because an early choice blocks later choices, and
brute force is exponential. Flow gives a **polynomial** algorithm with a built-in undo,
and the max-flow min-cut theorem gives a **proof of optimality** for free (you can show the
cut that matches your flow).

Problems that reduce to flow:

| Problem | Model |
|---|---|
| Maximum bipartite matching (applicants -> jobs) | S->left cap 1, left->right cap 1, right->T cap 1 |
| Assignment with capacities | right->T cap = capacity |
| Edge-disjoint paths | every edge cap 1 |
| Vertex-disjoint paths | split v into v_in -> v_out cap 1 |
| Minimum cut / cheapest disconnection | max flow, then residual BFS |
| Project selection (closure) | S->positive, negative->T, infinite dependency edges |
| Min-cost assignment | min-cost max-flow |

---

## 5. How it works, step by step

### 5.1 Definitions (Essential)

- **Capacity** `c(u, v) >= 0`. **Flow** `f(u, v)` with `0 <= f <= c`.
- **Conservation:** for every node except `s` and `t`, flow in = flow out.
- **Value** of a flow = total flow leaving `s`.
- **Residual capacity:** `c(u,v) - f(u,v)` forward, plus `f(u,v)` backward on `v -> u`.
- **Augmenting path:** an `s -> t` path in the residual graph using only edges with
  residual capacity > 0. Its **bottleneck** is the smallest residual capacity on it.

### 5.2 Ford–Fulkerson method (Essential)

```
flow = 0
while there is an augmenting path P:
    b = bottleneck(P)
    for each edge e on P: residual[e] -= b; residual[reverse(e)] += b
    flow += b
return flow
```

With integer capacities each round adds >= 1, so it terminates. With DFS-chosen paths the
number of rounds can be as large as the flow value itself (bad when capacities are huge).

### 5.3 Edmonds–Karp (Essential) — use BFS

Pick the **shortest** augmenting path (fewest edges) with BFS. Key fact: the BFS distance
from `s` to every node never decreases, and every round saturates at least one edge whose
"criticality" can only happen O(V) times. Result: O(V·E) rounds, **O(V·E²)** total,
independent of capacities.

### 5.4 Dinic (Advanced) — levels + blocking flow

1. BFS from `s` computes `level[v]` = distance in the residual graph. Keep only edges
   going from level `L` to `L + 1` (the **level graph**).
2. DFS pushes flow along level-graph paths until no `s -> t` path remains in it (a
   **blocking flow**). A "current edge" pointer per node means we never retry a dead edge.
3. Repeat. Each phase strictly increases `dist(s, t)`, so there are at most V phases.

**O(V²·E)** in general; **O(E·√V)** on unit-capacity bipartite graphs (that's exactly
Hopcroft–Karp). Dinic is the default max-flow for competitive programming.

### 5.5 Max-flow min-cut theorem (Essential intuition)

An **s-t cut** `(S, T)` splits nodes with `s ∈ S`, `t ∈ T`; its capacity is the sum of
capacities of edges from `S` to `T`.

1. **Flow <= any cut:** every unit leaving `s` must cross from `S` to `T` at some point
   (it may cross back, but then it crosses forward again).
2. **When Ford–Fulkerson stops, some cut equals the flow:** let `S` = nodes reachable
   from `s` in the residual graph. `t ∉ S` (no augmenting path). Every edge `S -> T` must
   be **saturated** (else its endpoint would be reachable), and every edge `T -> S` must
   carry **zero** flow (else the reverse residual edge would make it reachable). So net
   flow across the cut = cut capacity.
3. Both together: **max flow = min cut**, and the residual BFS *finds* the min cut.

### 5.6 Bipartite matching (Essential)

Left set `L`, right set `R`, edges only between them. A **matching** uses each node at most
once. Three ways:

- **Via flow:** S -> each left (cap 1), left -> right (cap 1), right -> T (cap 1). Max flow
  = max matching (integrality: an integer max flow always exists).
- **Kuhn's algorithm** (the interview one): for each left node, DFS for an augmenting path
  "take a free right node, or evict its owner if the owner can move elsewhere". O(V·E).
- **Hopcroft–Karp:** BFS from *all* free left nodes to build layers, then DFS to find a
  maximal set of disjoint shortest augmenting paths. O(E·√V) — Dinic specialised.

**König's theorem** (bipartite only): max matching = min vertex cover, so
**max independent set = V - max matching**. This is what solves Maximum Students Taking
Exam.

### 5.7 Min-cost flow (Advanced, brief)

Each edge also has a cost per unit. Goal: send the maximum flow (or exactly `k` units) at
minimum total cost. **Successive shortest paths:** repeatedly augment along the cheapest
`s -> t` path in the residual graph; reverse edges have cost `-c` (undoing refunds the cost),
so use Bellman–Ford/SPFA (or Dijkstra with Johnson potentials). O(F·V·E) with Bellman–Ford.
Classic use: the assignment problem (n workers, n jobs, cost matrix) — also solvable with
the Hungarian algorithm in O(n³).

---

## 6. Pseudocode

```
EDMONDS_KARP(G, s, t):
  flow = 0
  loop:
    parentEdge = BFS(s) over edges with cap > 0
    if t not reached: return flow
    b = min cap over path(t -> s via parentEdge)
    for e on path: cap[e] -= b; cap[e ^ 1] += b
    flow += b

DINIC(G, s, t):
  flow = 0
  while BFS_LEVELS(s) reaches t:
    it[v] = first edge of v, for all v
    while (pushed = DFS_PUSH(s, Infinity)) > 0: flow += pushed
  return flow

DFS_PUSH(u, limit):
  if u == t: return limit
  for e = it[u] onwards (advance it[u] when e is useless):
    v = to[e]
    if cap[e] > 0 and level[v] == level[u] + 1:
      d = DFS_PUSH(v, min(limit, cap[e]))
      if d > 0: cap[e] -= d; cap[e ^ 1] += d; return d
  return 0

KUHN(left u, stamp):
  for v in adj[u]:
    if seen[v] == stamp: continue
    seen[v] = stamp
    if matchR[v] == -1 or KUHN(matchR[v], stamp):
      matchR[v] = u; return true
  return false
```

---

## 7. JavaScript implementation

Full, commented, self-tested code lives in:

- [`../02_Implementations/max_flow.js`](../02_Implementations/max_flow.js) — `EdmondsKarp`, `Dinic`
  (iterative DFS, current-edge pointers), `minCut`, `MinCostMaxFlow`, `bruteForceMinCut`.
- [`../02_Implementations/bipartite_matching.js`](../02_Implementations/bipartite_matching.js) —
  `kuhn`, `hopcroftKarp`, `matchingViaFlow`, `bruteForceMatching`.

The core trick, in five lines:

```js
// edge e and its reverse e ^ 1 are always added together
addEdge(u, v, c) { to.push(v); cap.push(c); adj[u].push(to.length - 1);
                   to.push(u); cap.push(0); adj[v].push(to.length - 1); }
// pushing b units along edge e:
cap[e] -= b; cap[e ^ 1] += b;
```

Why `e ^ 1`? Edges are created in pairs at indices (0,1), (2,3), (4,5)... and XOR with 1
flips between the two members of a pair. No objects, no maps, very fast.

Run them: `node 02_Implementations/max_flow.js` and `node 02_Implementations/bipartite_matching.js`.
The self-tests compare Edmonds–Karp, Dinic and a brute-force min cut on 300 random graphs,
and Kuhn, Hopcroft–Karp and flow-matching against a brute-force matcher.

---

## 8. Dry run (Edmonds–Karp)

Network from section 3 with 0 = s, 1 = a, 2 = b, 3 = t: edges `0->1 (3)`, `0->2 (2)`, `1->2 (1)`, `1->3 (2)`, `2->3 (3)`.

| Round | BFS path | Bottleneck | Residual changes | Flow |
|---|---|---|---|---|
| 1 | 0 -> 1 -> 3 | min(3, 2) = 2 | 0->1: 1, 1->3: 0, back 1->0: 2, 3->1: 2 | 2 |
| 2 | 0 -> 2 -> 3 | min(2, 3) = 2 | 0->2: 0, 2->3: 1, back 2->0: 2, 3->2: 2 | 4 |
| 3 | 0 -> 1 -> 2 -> 3 | min(1, 1, 1) = 1 | 0->1: 0, 1->2: 0, 2->3: 0 | 5 |
| 4 | BFS from 0: no out-edge with cap > 0 | — | stop | **5** |

Min cut: reachable from 0 in the residual graph = `{0}`. Edges leaving it: `0->1 (3)` +
`0->2 (2)` = 5 = max flow. ✓

---

## 9. Edge cases

- `s === t` — undefined; throw or return 0 (ask).
- Sink unreachable — flow 0, min cut = 0 (S = everything reachable).
- Parallel edges — fine with the edge-list representation; each is separate.
- Anti-parallel edges `u->v` and `v->u` — fine; each has its own reverse twin.
- Self-loops — never on a shortest path; harmless.
- Zero-capacity edges — harmless.
- Infinite capacities (project selection) — use `Infinity`; any finite bottleneck keeps
  arithmetic finite. If using a "big number", it must exceed the sum of all finite capacities.
- Undirected edge of capacity c — add **two** directed edges, each with capacity c.
- Large flows — JS numbers are exact up to 2^53; fine for interview inputs.

---

## 10. Complexity analysis

| Operation | Time | Space | Why |
|---|---|---|---|
| Ford–Fulkerson (DFS paths) | O(E · F) | O(V + E) | each round O(E), adds >= 1 unit; F = max flow value |
| Edmonds–Karp | O(V · E²) | O(V + E) | O(V·E) BFS rounds (shortest-path distances only grow) |
| Dinic | O(V² · E) | O(V + E) | <= V phases, each blocking flow O(V·E) |
| Dinic, unit capacities | O(E · min(√E, V^(2/3))) | O(V + E) | few phases on unit graphs |
| Min cut after max flow | O(V + E) | O(V) | one residual BFS |
| Kuhn matching | O(V · E) | O(V) | one DFS per left node |
| Hopcroft–Karp | O(E · √V) | O(V) | O(√V) phases, each O(E) |
| Min-cost flow (Bellman–Ford) | O(F · V · E) | O(V + E) | one shortest path per augmentation |

---

## 11. Alternatives

| Approach | When it is right | Trade-off |
|---|---|---|
| Greedy assignment | each item has one choice / matroid structure | wrong when choices interact |
| Brute force over subsets / assignments | n <= ~15, as a test oracle | exponential |
| Kuhn's DFS matching | bipartite, unit capacities, V <= ~5000 | 25 lines, easy to get right |
| Hopcroft–Karp | large bipartite graphs | more code |
| Edmonds–Karp | general capacities, small graphs, interviews | slower than Dinic |
| Dinic | general max flow, contests | trickier (levels + current edge) |
| Hungarian algorithm | dense n x n assignment with costs | O(n³), specialised |
| Bitmask DP | tiny n (<= 20) assignment/matching | O(2^n · n), exponential |

---

## 12. Common mistakes

| Mistake | Why it happens | Fix |
|---|---|---|
| No reverse edges | "flow only goes forward" intuition | always add the twin edge with capacity 0 |
| Undirected edge as one directed edge | forgetting flow can go both ways | two directed edges of capacity c |
| Kuhn without a per-search visited mark | copying DFS without thinking | stamp `seen[v] = searchId` |
| Clearing visited only once for all left nodes | "optimisation" | reset (or new stamp) per left node |
| Reporting saturated edges as the min cut | confusing saturated with crossing | BFS in residual graph; edges S -> T only |
| Dinic without current-edge pointer | it still terminates, so the bug hides | `it[u]` advances past dead edges; otherwise exponential-ish slowdowns |
| Recursive DFS on a long path | JS call stack ~10k frames | iterative DFS (as in `max_flow.js`) |
| Big-M too small in project selection | `1e9` "feels infinite" | use `Infinity` or a value > total capacity |
| Infinity edge pointing the wrong way | "a requires b" reads both ways | edge a -> b means choosing a forces b |

---

## 13. Patterns and variations (templates)

### 13.1 Bipartite matching via Kuhn

```js
function maxMatching(nLeft, nRight, adj) {
  const matchR = new Array(nRight).fill(-1), seen = new Array(nRight).fill(-1);
  const tryKuhn = (u, stamp) => {
    for (const v of adj[u]) {
      if (seen[v] === stamp) continue;
      seen[v] = stamp;
      if (matchR[v] === -1 || tryKuhn(matchR[v], stamp)) { matchR[v] = u; return true; }
    }
    return false;
  };
  let size = 0;
  for (let u = 0; u < nLeft; u++) if (tryKuhn(u, u)) size++;
  return size;
}
```

### 13.2 Capacities on nodes — split the node

```
v  ==>  v_in --(cap of v)--> v_out
all edges into v go to v_in, all edges out of v leave from v_out
```

### 13.3 Many sources / many sinks — super source, super sink

```
S* -> each source (cap = its supply), each sink -> T* (cap = its demand)
```

### 13.4 Project selection / maximum closure

```
S -> i (profit) if profit > 0;  i -> T (-profit) if profit < 0;  a -> b (Infinity) for "a needs b"
answer = sum(positive profits) - maxflow
```

### 13.5 Bipartite max independent set / min vertex cover (König)

```
min vertex cover = max matching;   max independent set = V - max matching
```

### 13.6 Feasibility: "can every demand be met?"

```
build the network, run max flow, check flow == total demand
```

---

## 14. Recognition clues

**Use flow / matching when you see:**

- "assign each X to at most one Y" with eligibility lists -> bipartite matching
- "each Y can take up to k" -> flow with capacities
- "minimum cost/number of edges or nodes to remove to separate A from B" -> min cut
- "maximum number of disjoint paths" -> unit-capacity max flow
- "choose a subset, choosing a forces b, maximise profit" -> project selection
- grid "no two adjacent / conflicting cells" and conflicts always join black and white
  checkerboard cells (or even and odd columns) -> König
- small constraints (V <= a few thousand) together with "assign" or "separate"

**It does NOT apply (or is overkill) when:**

- a greedy exchange argument works (interval scheduling, sorting by deadline)
- the conflict graph is not bipartite (max independent set is NP-hard in general -> DP / backtracking)
- n <= 20 and a bitmask DP is simpler to write in 30 minutes
- the problem is shortest path / connectivity only (use BFS, Dijkstra, union-find)
- you need a global min cut with no fixed s and t (Stoer–Wagner / Karger instead)

---

## 15. Interview application

**Talk track (matching-style problem):**

1. "Two groups, each item used at most once — this is bipartite matching."
2. "Greedy fails because an early choice can block a later one; here is an example."
3. "I'll use augmenting paths (Kuhn): for each left node, DFS to find a free right node or
   evict someone who can move. O(V·E)."
4. "It's optimal because a matching is maximum iff there is no augmenting path (Berge)."
5. Code Kuhn (~20 lines), dry run on the example, state complexity.
6. Mention Hopcroft–Karp (O(E·√V)) if the interviewer asks to scale.

**Clarifying questions to ask:** directed or undirected? capacities on edges or nodes? are
capacities integers? any upper bound on V and E? do you need the assignment / the cut
itself or only the number? can there be parallel edges?

**If you can't remember an algorithm:** say "this reduces to max flow; with these sizes
Edmonds–Karp is fine", write the network construction carefully, and implement BFS
augmenting paths. Correct modeling is most of the credit.

---

## 16. Problems in this topic

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Maximum Bipartite Matching — Hiring Applicants | Medium | Kuhn augmenting paths | [statement](../03_Problems/02_Medium/01_maximum_bipartite_matching.md) | [solution](../03_Problems/solutions/01_maximum_bipartite_matching.js) |
| 02 | Count Edge-Disjoint Paths | Medium | unit-capacity flow (Menger) | [statement](../03_Problems/02_Medium/02_edge_disjoint_paths.md) | [solution](../03_Problems/solutions/02_edge_disjoint_paths.js) |
| 03 | Cheapest Way to Disconnect Two Servers | Medium | max-flow min-cut | [statement](../03_Problems/02_Medium/03_minimum_cut_network.md) | [solution](../03_Problems/solutions/03_minimum_cut_network.js) |
| 04 | Assign Tasks to Workers with Capacities | Medium | flow with capacities | [statement](../03_Problems/02_Medium/04_assign_tasks_with_capacity.md) | [solution](../03_Problems/solutions/04_assign_tasks_with_capacity.js) |
| 05 | Project Selection with Prerequisites | Hard | min cut / maximum closure | [statement](../03_Problems/03_Hard/05_project_selection.md) | [solution](../03_Problems/solutions/05_project_selection.js) |
| 06 | Maximum Students Taking Exam | Hard | König: V - matching | [statement](../03_Problems/03_Hard/06_maximum_students_taking_exam.md) | [solution](../03_Problems/solutions/06_maximum_students_taking_exam.js) |

### Practice more

- LeetCode 1349 Maximum Students Taking Exam (done here)
- LeetCode 1820 Maximum Number of Accepted Invitations (bipartite matching)
- LeetCode 1066 Campus Bikes II (assignment; bitmask DP or min-cost flow)
- LeetCode 1947 Maximum Compatibility Score Sum (assignment)
- LeetCode 2172 Maximum AND Sum of Array (assignment with slot capacity 2)
- LeetCode 1879 Minimum XOR Sum of Two Arrays (assignment)
- LeetCode 2123 Minimum Operations to Remove Adjacent Ones in Matrix (König on a grid)
- LeetCode 785 Is Graph Bipartite? (warm-up for the bipartite structure)
