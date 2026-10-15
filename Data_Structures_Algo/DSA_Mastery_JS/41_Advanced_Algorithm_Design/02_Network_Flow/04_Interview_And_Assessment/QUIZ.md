# Network Flow — Self-Assessment Quiz

Answer each question before opening the answer.

### 1. (Multiple choice) In the residual graph, an edge with capacity 7 carrying flow 3 gives:

A) forward 3, backward 7  B) forward 4, backward 3  C) forward 4, backward 0  D) forward 7, backward 3

<details><summary>Answer</summary>

**B.** Forward residual = c - f = 4 (room left). Backward residual = f = 3 (flow that can be cancelled).

</details>

### 2. (Complexity) What is the time complexity of Edmonds–Karp?

<details><summary>Answer</summary>

O(V·E²): O(V·E) BFS rounds, each O(E).

</details>

### 3. (Predict the output) Max flow from 0 to 3 for edges `0->1 (5)`, `0->2 (5)`, `1->3 (2)`, `2->3 (8)`, `1->2 (10)`?

<details><summary>Answer</summary>

**10.** Cut {0} has capacity 5 + 5 = 10. Flow: 2 along 0-1-3, 3 along 0-1-2-3, 5 along 0-2-3 = 10.

</details>

### 4. (Multiple choice) Which statement about a minimum cut is TRUE?

A) It is the set of all saturated edges  B) Its capacity equals the max flow  C) It is unique  D) It counts edges in both directions

<details><summary>Answer</summary>

**B.** Saturated edges can lie entirely inside T (A false), several min cuts may exist (C false), and only S->T edges count (D false).

</details>

### 5. (Spot the bug)

```js
function maxMatching(nL, nR, adj) {
  const matchR = new Array(nR).fill(-1);
  const seen = new Array(nR).fill(false);
  const tryK = u => {
    for (const v of adj[u]) {
      if (seen[v]) continue; seen[v] = true;
      if (matchR[v] === -1 || tryK(matchR[v])) { matchR[v] = u; return true; }
    }
    return false;
  };
  let size = 0;
  for (let u = 0; u < nL; u++) if (tryK(u)) size++;
  return size;
}
```

<details><summary>Answer</summary>

`seen` is never reset between left nodes, so later searches can't revisit right nodes they
need. Reset it (or use a per-search stamp) inside the outer loop.

</details>

### 6. (Complexity) Hopcroft–Karp runs in?

<details><summary>Answer</summary>

O(E·√V).

</details>

### 7. (Multiple choice) An undirected edge of capacity 4 should be modelled as:

A) one directed edge of capacity 4  B) two directed edges of capacity 2  C) two directed edges of capacity 4 each  D) one directed edge of capacity 8

<details><summary>Answer</summary>

**C.** Flow can go either way, up to 4 in whichever direction is used.

</details>

### 8. (Predict the output) A bipartite graph has 10 vertices and a maximum matching of size 3. Size of a maximum independent set?

<details><summary>Answer</summary>

**7** (König: V - max matching = 10 - 3).

</details>

### 9. (Concept) Why do we use `e ^ 1` to find the reverse edge?

<details><summary>Answer</summary>

Each edge and its reverse are pushed consecutively at indices 2k and 2k+1; XOR with 1 maps
2k <-> 2k+1, so the twin is found in O(1) with no extra storage.

</details>

### 10. (Modeling) Vertex-disjoint s-t paths: how do you enforce "each intermediate node used once"?

<details><summary>Answer</summary>

Split each node v into v_in -> v_out with capacity 1, then run unit-capacity max flow.

</details>

### 11. (Spot the bug) Project selection: `addEdge(b, a, Infinity)` for "a requires b". What goes wrong?

<details><summary>Answer</summary>

The edge direction encodes "b requires a". Choosing a without b would be allowed, and choosing
b would wrongly force a. The edge must be a -> b.

</details>

### 12. (Multiple choice) Why can min-cost flow not use plain Dijkstra on the residual graph?

A) costs are integers  B) reverse edges have negative costs  C) the graph has cycles  D) it can, always

<details><summary>Answer</summary>

**B.** Reverse edges cost -c. Use Bellman–Ford/SPFA, or Dijkstra with Johnson potentials.

</details>

### 13. (Complexity) Dinic's general bound?

<details><summary>Answer</summary>

O(V²·E); O(E·√V) on unit-capacity bipartite graphs.

</details>

## Mastery checklist

- [ ] I can explain residual graphs and why reverse edges make augmenting paths correct.
- [ ] I can write Kuhn's matching from memory in under 10 minutes and dry run it.
- [ ] I can write Edmonds–Karp with the `e ^ 1` edge list and recover the min cut.
- [ ] I can model matching, capacities, disjoint paths and project selection as flow networks.
- [ ] I can explain when flow is overkill and a bitmask DP or greedy is the better interview answer.
