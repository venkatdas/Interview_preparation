# SCC, Bridges, Bipartite and Euler — Quiz

Answer each question before opening it. Aim for 10/12. Back to the [topic README](../README.md) · [interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Multiple choice)** Which graph is NOT bipartite?
A) a tree  B) a 6-cycle  C) a 5-cycle  D) a graph with no edges

<details><summary>Answer</summary>

**C.** An odd cycle can't be 2-coloured. Trees and even cycles are always bipartite.

</details>

**2. (Predict the output)** SCCs of the directed graph 0->1, 1->2, 2->0, 2->3, 3->4, 4->3, plus an isolated node 5?

<details><summary>Answer</summary>

`{0,1,2}`, `{3,4}`, `{5}`. Tarjan emits them as {3,4}, {0,1,2}, {5} (reverse topological order within each DFS).

</details>

**3. (Predict the output)** `findBridges(5, [[0,1],[1,2],[2,0],[1,3],[3,4]])`?

<details><summary>Answer</summary>

`[[3,4],[1,3]]` (any order). Edges in the triangle are never bridges. The tail edges are.

</details>

**4. (Spot the bug)** Bipartite check:
```js
const color = new Array(n).fill(-1);
color[0] = 0; const q = [0];
while (q.length) { /* colour neighbours, return false on conflict */ }
return true;
```

<details><summary>Answer</summary>

It only explores node 0's component. If the graph is disconnected and the odd cycle is
somewhere else, it wrongly returns true. Loop over every node and start a new BFS from
each one that has no colour yet.

</details>

**5. (Spot the bug)** Tarjan:
```js
for (const v of adj[u]) {
  if (ids[v] === -1) { dfs(v); low[u] = Math.min(low[u], low[v]); }
  else low[u] = Math.min(low[u], ids[v]);
}
```

<details><summary>Answer</summary>

The `onStack[v]` check is missing. A cross edge into an SCC that is already finished
lowers `low[u]` by mistake, so separate components get merged. Example: 0<->1, 2<->3,
2->1. Visit 0 and 1 first ({0,1} finishes), then start at 2. The edge 2->1 drags low[2]
down to 1, so {2,3} is never emitted as its own SCC.

</details>

**6. (Multiple choice)** The articulation-point test for a non-root u with child v is:
A) `low[v] > ids[u]`  B) `low[v] >= ids[u]`  C) `low[u] === ids[u]`  D) `ids[v] > low[u]`

<details><summary>Answer</summary>

**B.** A is the bridge test, and C is Tarjan's test for the root of an SCC.

</details>

**7. (Find the counterexample)** "The DFS root is always an articulation point." Break it.

<details><summary>Answer</summary>

A triangle 0-1-2 rooted at 0. DFS goes 0 -> 1 -> 2, so the root has only **one** DFS
child, and removing 0 leaves 1-2 still connected. The root is a cut vertex only when it
has 2 or more DFS children.

</details>

**8. (Complexity)** Kosaraju time and extra space?

<details><summary>Answer</summary>

O(V + E) time. O(V + E) extra space, because it builds the reversed graph (plus O(V) for visited flags and the finish order).

</details>

**9. (Predict the output)** Hierholzer on `Map { 0 => [1, 2], 2 => [0] }` from 0?

<details><summary>Answer</summary>

`[0, 2, 0, 1]`. The walk goes 0->1 first and gets stuck at 1, so 1 is finalised last.
Then it goes 0->2->0. Reversing the finish order gives 0, 2, 0, 1, which uses all 3 edges.

</details>

**10. (True/False)** An undirected connected graph with exactly two odd-degree vertices has an Eulerian circuit.

<details><summary>Answer</summary>

**False.** It has an Eulerian **path** that starts at one odd vertex and ends at the other. A circuit needs every degree to be even.

</details>

**11. (Multiple choice)** Shortest Path Visiting All Nodes (n <= 12). The BFS `visited` key should be:
A) node  B) mask  C) (node, mask)  D) (node, steps)

<details><summary>Answer</summary>

**C.** The same node with a different set of visited nodes is a different situation.

</details>

**12. (Spot the bug)** Bus Routes:
```js
function numBuses(routes, source, target) {
  // BFS over routes ...
  // returns -1 if target never reached
}
numBuses([[1, 2, 3]], 5, 5); // returns -1
```

<details><summary>Answer</summary>

It is missing the early `if (source === target) return 0;`. You are already at the target, so no bus is needed, even when the stop is on no route.

</details>

---

## Mastery checklist

- [ ] I can 2-colour a graph with BFS and explain the odd-cycle condition.
- [ ] I can code Tarjan's SCC from memory and explain Kosaraju in words.
- [ ] I can find bridges and articulation points and explain `>` vs `>=` and the root rule.
- [ ] I can state the Eulerian path conditions and code Hierholzer (iterative).
- [ ] I can design a state-space BFS, including the right `visited` key and its size.
