# Minimum Spanning Trees — Quiz

Answer each question before opening it. Aim for 10/12. Back to the [topic README](../README.md) · [interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Multiple choice)** A spanning tree of a connected graph with 7 nodes has how many edges?
A) 7  B) 6  C) 21  D) depends on the weights

<details><summary>Answer</summary>

**B.** Every tree on V nodes has exactly V - 1 edges.

</details>

**2. (Predict the output)** `kruskal(4, [[0,1,1],[2,3,1]])`?

<details><summary>Answer</summary>

`{ weight: -1, edges: [] }`. Only 2 unions succeed, but 3 are needed, so the graph is disconnected.

</details>

**3. (Predict the output)** `kruskal(3, [[0,1,-4],[1,2,-1],[0,2,2]]).weight`?

<details><summary>Answer</summary>

**-5.** Negative weights are fine for MST. It takes -4 and -1, then skips 2 because 0 and 2 are already connected.

</details>

**4. (Complexity)** What is the time complexity of Kruskal on E edges, and which step dominates?

<details><summary>Answer</summary>

O(E log E), and the **sort** dominates. The union-find work is O(E α(V)), which is nearly linear.

</details>

**5. (Spot the bug)** Prim:
```js
heap.push([0, 0]); inTree[0] = true;
while (!heap.isEmpty()) {
  const [w, u] = heap.pop();
  total += w;
  for (const [v, vw] of adj[u]) if (!inTree[v]) { inTree[v] = true; heap.push([vw, v]); }
}
```

<details><summary>Answer</summary>

Nodes are marked "in tree" when they are **pushed**. So each node keeps the first edge
that reached it, even if a cheaper edge shows up later. Mark nodes when they are
**popped**, and skip popped nodes that are already in the tree.

</details>

**6. (Find the counterexample)** "The MST contains the shortest path between every pair of nodes." Break it.

<details><summary>Answer</summary>

Triangle A-B 2, B-C 2, A-C 3. The MST is {A-B, B-C}. Inside the MST, A to C costs 4, but the direct edge costs 3.

</details>

**7. (Find the counterexample)** "Greedy works: from each node, take its cheapest edge, and you get the MST." Break it.

<details><summary>Answer</summary>

Square 0-1 (1), 2-3 (1), 1-2 (5), 0-3 (6). Each node's cheapest edge gives only {0-1, 2-3},
which is two separate pieces, not a spanning tree. You still need the cheapest edge
**between** the two pieces (1-2). That "cheapest edge across a cut" rule is the real
greedy choice (it is what Boruvka's rounds do).

</details>

**8. (Multiple choice)** n = 2000 points, connect all of them at minimum Manhattan cost. Best approach?
A) Kruskal on all pairs  B) Prim with an O(n^2) array  C) Dijkstra from point 0  D) Floyd-Warshall

<details><summary>Answer</summary>

**B.** About 2·10^6 edges. Array Prim does about 4·10^6 simple steps and needs no edge list. Kruskal would have to sort 2·10^6 edges, which works but is slower and uses much more memory. C and D solve different problems.

</details>

**9. (True/False)** If all edge weights are distinct, the MST is unique.

<details><summary>Answer</summary>

**True.** With ties, there can be several MSTs, but they all have the same total weight.

</details>

**10. (Spot the bug)** Kruskal:
```js
edges.sort((a, b) => a[2] - b[2]);
for (const [u, v, w] of edges) { uf.union(u, v); total += w; }
```

<details><summary>Answer</summary>

It adds every edge's weight, even when `union` returns false (the edge would close a
cycle). Add the weight only when the union succeeds. Also, there is no connectivity
check, and it sorts the caller's array in place.

</details>

**11. (Multiple choice)** In "Critical and Pseudo-Critical Edges", edge e is critical when:
A) it is in the MST Kruskal happens to build  B) removing it makes the MST weight go up or disconnects the graph  C) it has the smallest weight  D) forcing it in keeps the weight the same

<details><summary>Answer</summary>

**B.** Option D is the test for pseudo-critical (for edges that are not critical).

</details>

**12. (Predict the output)** Water distribution: n = 2, wells = [1, 10], pipes = [[1, 2, 1]]. Minimum cost?

<details><summary>Answer</summary>

**2.** Build a well at house 1 (cost 1) and lay the pipe 1-2 (cost 1). In the virtual-node graph, the MST uses 0-1 (1) and 1-2 (1).

</details>

---

## Mastery checklist

- [ ] I can explain the cut property and why it makes greedy MST correct.
- [ ] I can write Kruskal with a hand-rolled union-find in under 10 minutes.
- [ ] I can write Prim with a heap (and the O(V^2) array version) and explain mark-on-pop.
- [ ] I can tell an MST problem apart from a shortest-path problem from the wording alone.
- [ ] I can apply the virtual-node and force-in / force-out tricks to new problems.
