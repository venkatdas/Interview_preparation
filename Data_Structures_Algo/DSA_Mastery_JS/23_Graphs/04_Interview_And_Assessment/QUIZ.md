# Graphs (Representation) — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Complexity)** Space of an adjacency list vs an adjacency matrix for V vertices and E edges?

<details><summary>Answer</summary>List O(V + E); matrix O(V²).</details>

**2. (Predict the output)**

```js
const adj = new Array(3).fill([]);
adj[0].push(1);
console.log(adj);
```

<details><summary>Answer</summary>`[ [ 1 ], [ 1 ], [ 1 ] ]` — all three slots share one array. Use `Array.from({ length: 3 }, () => [])`.</details>

**3. (Multiple choice)** A graph has 10^5 vertices and 2·10^5 edges. Best representation?
A) adjacency matrix  B) adjacency list  C) edge list only  D) either A or B

<details><summary>Answer</summary>B. A matrix would need 10^10 cells.</details>

**4. (Predict the output)** Undirected edges `[[0,1],[1,2],[2,0],[3,3]]` with n = 4: degree of each vertex (a self loop adds 2)?

<details><summary>Answer</summary>`[2, 2, 2, 2]`. Sum = 8 = 2E.</details>

**5. (Spot the bug)** Building an undirected list:

```js
for (const [u, v] of edges) adj[u].push(v);
```

<details><summary>Answer</summary>The reverse direction is missing: also `adj[v].push(u)`.</details>

**6. (Multiple choice)** A connected undirected graph with n vertices and n − 1 edges is:
A) always a tree  B) always a cycle  C) dense  D) directed

<details><summary>Answer</summary>A.</details>

**7. (Complexity)** Checking whether edge (u, v) exists: list vs matrix?

<details><summary>Answer</summary>List O(deg(u)) (O(1) if you store Sets); matrix O(1).</details>

**8. (Predict the output)** Reverse the directed graph `[[1],[2],[0]]`.

<details><summary>Answer</summary>`[[2],[0],[1]]`.</details>

**9. (Multiple choice)** Which is an implicit graph?
A) an edge list  B) a 0/1 grid where you move to adjacent open cells  C) an adjacency matrix  D) a Map of arrays

<details><summary>Answer</summary>B.</details>

**10. (Spot the bug)** Weighted matrix:

```js
const m = Array.from({ length: n }, () => new Array(n).fill(0));
for (const [u, v, w] of edges) m[u][v] = w;
```

<details><summary>Answer</summary>0 means both "no edge" and "free edge", so shortest-path code will treat missing edges as cost 0. Fill with `Infinity` and set the diagonal to 0.</details>

**11. (Complexity)** Maximum number of edges in a simple directed graph with V vertices?

<details><summary>Answer</summary>V(V − 1).</details>

**12. (Predict the output)** Grid `["..", "#."]` with 4-direction moves between open cells: how many edges?

<details><summary>Answer</summary>2: (0,0)–(0,1) and (0,1)–(1,1).</details>

---

## Mastery checklist

- [ ] I can build adjacency lists (directed, undirected, weighted) from an edge list without the `fill([])` bug.
- [ ] I can choose list vs matrix and justify it with V, E and the operations needed.
- [ ] I can compute degrees, in/out-degrees and find sources, sinks or a universal sink.
- [ ] I can treat a grid or a rule as an implicit graph and generate neighbours on the fly.
- [ ] I ask the six clarifying questions (direction, weights, cycles, connectivity, labels, size) before coding.
