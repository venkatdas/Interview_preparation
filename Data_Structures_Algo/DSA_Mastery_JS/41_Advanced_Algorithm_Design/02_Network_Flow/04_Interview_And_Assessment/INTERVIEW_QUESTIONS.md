# Network Flow — Interview Questions

Advanced topic, asked rarely. When it appears it is usually: "model this as matching or
min cut", "why does greedy fail here?", or "code bipartite matching". Answer out loud
first, then open the model answer.

### 1. What is a residual graph and why do we need reverse edges?

<details><summary>Model answer</summary>

For each edge with capacity c carrying flow f, the residual graph has a forward edge with
capacity c - f (room left) and a reverse edge with capacity f (flow we could cancel). Reverse
edges let a later augmenting path undo part of an earlier, badly chosen path. Without them,
"find a path, push, repeat" is just greedy and can get stuck below the maximum.

</details>

### 2. State the max-flow min-cut theorem and sketch why it is true.

<details><summary>Model answer</summary>

The maximum s-t flow value equals the minimum capacity of an s-t cut. (1) Any flow is at most
any cut, because every unit must cross from S to T. (2) When no augmenting path exists, let S
be the nodes reachable from s in the residual graph: all S->T edges are saturated and all
T->S edges carry zero, so the flow equals this cut's capacity. Together: max flow = min cut.

</details>

### 3. Ford–Fulkerson vs Edmonds–Karp: what's the difference and why does it matter?

<details><summary>Model answer</summary>

Ford–Fulkerson is the method (augment along any path). With arbitrary paths, the number of
rounds can be proportional to the flow value (huge capacities -> slow), and with irrational
capacities it may not even terminate. Edmonds–Karp always chooses the shortest path by BFS;
then the number of rounds is O(V·E), giving O(V·E²) regardless of capacities.

</details>

### 4. How does Dinic improve on Edmonds–Karp?

<details><summary>Model answer</summary>

Instead of one path per BFS, Dinic builds a level graph with one BFS and then pushes a
blocking flow (many paths) through it with DFS, using a current-edge pointer so dead edges
are never revisited. Each phase increases the s-t distance, so there are at most V phases:
O(V²·E) overall, and O(E·√V) for unit-capacity bipartite graphs.

</details>

### 5. How do you reduce bipartite matching to max flow?

<details><summary>Model answer</summary>

Add a source connected to every left node with capacity 1, connect every allowed left-right
pair with capacity 1, and connect every right node to a sink with capacity 1. An integral max
flow exists (integrality theorem), and the edges carrying 1 unit between the sides form a
maximum matching.

</details>

### 6. Explain Kuhn's algorithm. Why is the visited array reset per left node?

<details><summary>Model answer</summary>

For each left node u, DFS tries each neighbour v: if v is free, match it; otherwise
recursively try to re-match v's current partner elsewhere. A successful chain is an
augmenting path. The visited array prevents trying the same right node twice in one search
(avoids cycles and repeated work). It must be fresh for each left node because a right node
that was a dead end for u's search may be reachable usefully in later searches after the
matching changes. Complexity O(V·E).

</details>

### 7. What does Hopcroft–Karp add?

<details><summary>Model answer</summary>

Each phase runs one BFS from all free left nodes at once to get layers, then DFS finds a
maximal set of vertex-disjoint shortest augmenting paths. There are only O(√V) phases, so the
total is O(E·√V). It is Dinic specialised to unit-capacity bipartite networks.

</details>

### 8. What is König's theorem and where is it useful?

<details><summary>Model answer</summary>

In a bipartite graph, the size of a maximum matching equals the size of a minimum vertex
cover. Since the complement of a vertex cover is an independent set, maximum independent set
= V - maximum matching. It solves "place the most items so no two conflicting ones are both
chosen" when conflicts are bipartite, e.g. grid problems where conflicts join cells of
different column parity or checkerboard colour (Maximum Students Taking Exam).

</details>

### 9. How do you handle capacities on vertices instead of edges?

<details><summary>Model answer</summary>

Split each vertex v into v_in and v_out joined by an edge with v's capacity. Redirect all
incoming edges to v_in and all outgoing edges from v_out. Vertex-disjoint paths use capacity
1 on these internal edges.

</details>

### 10. Model "choose projects with profits (some negative) where choosing a forces b".

<details><summary>Model answer</summary>

Source -> project with capacity profit for positive projects, project -> sink with capacity
-profit for negative ones, and a -> b with infinite capacity for each dependency. A finite
cut can't put a on the source side and b on the sink side. Cut value = profit given up + cost
paid, so the answer is (sum of positive profits) - (min cut).

</details>

### 11. How do you recover the actual min cut edges?

<details><summary>Model answer</summary>

After max flow, BFS/DFS from s using only edges with residual capacity > 0. The reached set is
S. The cut is every original edge u->v with u in S and v not in S. Do not just list saturated
edges: a saturated edge with both ends in T is not part of this cut.

</details>

### 12. What is min-cost flow and how is it computed?

<details><summary>Model answer</summary>

Each edge also has a per-unit cost; find the maximum (or a required amount of) flow with the
least total cost. Successive shortest paths: repeatedly augment along the cheapest s-t path in
the residual graph, where reverse edges have negative cost. Use Bellman–Ford/SPFA (negative
edges), or Dijkstra with potentials. It solves weighted assignment problems.

</details>

### 13. When would you NOT use flow in an interview?

<details><summary>Model answer</summary>

When n <= ~20 and a bitmask DP is shorter (Campus Bikes II, Minimum XOR Sum), when a greedy
with an exchange argument is provably correct (interval scheduling), when the conflict graph
is not bipartite (independent set is NP-hard), or when the problem only needs connectivity or
shortest paths. Mention flow as the scalable alternative, but code the simpler correct solution.

</details>

### 14. Why does a greedy matching fail? Give a counterexample.

<details><summary>Model answer</summary>

Applicant 0 can take jobs {0, 1}, applicant 1 can take only {0}. Greedy gives job 0 to
applicant 0 first, then applicant 1 gets nothing (size 1). The maximum is 2 (0->1, 1->0).
Augmenting paths fix this: applicant 1 evicts applicant 0, who moves to job 1.

</details>
