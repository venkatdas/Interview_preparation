# Shortest Paths — Quiz

Answer each question before opening it. Aim for 12/14. Back to the [topic README](../README.md) · [interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Multiple choice)** A graph has 10^5 nodes, 2·10^5 edges, and weights between 0 and 100. You need distances from one source. Pick one:
A) BFS  B) Dijkstra with a binary heap  C) Bellman-Ford  D) Floyd-Warshall

<details><summary>Answer</summary>

**B.** The weights are non-negative and not all equal, so plain BFS is wrong. Bellman-Ford
would take about 2·10^10 steps. Floyd-Warshall needs V^2 = 10^10 memory cells.

</details>

**2. (Complexity)** What is the time complexity of Dijkstra with lazy deletion and a binary heap?

<details><summary>Answer</summary>

O((V + E) log V). With lazy deletion the heap can hold E entries, so it is really
O(E log E). Since log E <= 2 log V for simple graphs, the two are the same.

</details>

**3. (Predict the output)** What does `bellmanFord(3, [[0,1,4],[0,2,5],[2,1,-3]], 0)` return?

<details><summary>Answer</summary>

`{ dist: [0, 2, 5], hasNegativeCycle: false }`. In round 1, edge 2->1 improves node 1
from 4 to 5 - 3 = 2. Round 2 changes nothing.

</details>

**4. (Predict the output)** `dijkstra(4, [[0, 1, 3]], 0)` on an undirected graph returns?

<details><summary>Answer</summary>

`[0, 3, Infinity, Infinity]`. Nodes 2 and 3 cannot be reached, so they keep Infinity.

</details>

**5. (Spot the bug)**
```js
while (!heap.isEmpty()) {
  const [d, u] = heap.pop();
  for (const [v, w] of adj[u]) {
    if (d + w < dist[v]) { dist[v] = d + w; heap.push([dist[v], v]); }
  }
}
```

<details><summary>Answer</summary>

The stale-entry check `if (d > dist[u]) continue;` is missing. The answers are still
correct, because a stale `d` can never beat the stored distances. But old entries get
expanded again and again, so the code can blow up the running time on dense graphs.

</details>

**6. (Spot the bug)** Cheapest Flights with k stops:
```js
for (let r = 0; r <= k; r++)
  for (const [u, v, w] of flights)
    if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
```

<details><summary>Answer</summary>

It updates `dist` in place, so one round can chain several flights. Example:
0->1 (1), 1->2 (1), 0->2 (5), k = 0. This code returns 2, but the right answer is 5.
Copy the array each round: `const next = [...dist]`, relax into `next` reading from
`dist`, then set `dist = next`.

</details>

**7. (Multiple choice)** Which loop order is correct for Floyd-Warshall?
A) i, j, k  B) k, i, j  C) i, k, j  D) any order works

<details><summary>Answer</summary>

**B.** The intermediate node k must be the outer loop. (C and A can give wrong answers.)

</details>

**8. (True/False)** Bellman-Ford reports a negative cycle even if that cycle can't be reached from the source.

<details><summary>Answer</summary>

**False.** Nodes on an unreachable cycle keep `dist = Infinity`, and the
`dist[u] !== Infinity` guard stops them from ever relaxing. Bellman-Ford only finds
negative cycles reachable from the source. To find any negative cycle, add a virtual
source with 0-weight edges to every node.

</details>

**9. (Complexity)** Floyd-Warshall on V = 400: about how many inner-loop steps?

<details><summary>Answer</summary>

400^3 = 6.4·10^7. That is fine in JavaScript, well under a second. At V = 2000 it is 8·10^9, which is too slow.

</details>

**10. (Multiple choice)** Path With Maximum Probability: which change turns Dijkstra into the right algorithm?
A) relax with `d + p`, min-heap  B) relax with `d * p`, max-heap  C) relax with `Math.max(d, p)`, min-heap  D) BFS

<details><summary>Answer</summary>

**B.** Probabilities multiply along a path. They are all at most 1, so a longer path can never be more probable. That makes it safe to pop the largest product first.

</details>

**11. (Predict the output)** 0-1 BFS on edges `[[0,1,1],[0,2,0],[2,1,0]]` from 0, undirected. Distances?

<details><summary>Answer</summary>

`[0, 0, 0]`. Node 1 can be reached for free through 0 -> 2 -> 1.

</details>

**12. (Spot the bug)** Number of shortest paths:
```js
if (d + w < dist[v]) { dist[v] = d + w; ways[v] += ways[u]; heap.push([dist[v], v]); }
else if (d + w === dist[v]) ways[v] += ways[u];
```

<details><summary>Answer</summary>

When a strictly better distance is found, `ways[v]` must be **reset** to `ways[u]`, not
added to. The ways counted for the old, longer distance are no longer shortest paths.

</details>

**13. (Find the counterexample)** "Dijkstra works with negative edges as long as there is no negative cycle." Break it.

<details><summary>Answer</summary>

Take A->B (2), A->C (3), C->B (-2), B->D (1). An "eager" Dijkstra that finalises B at
distance 2 also finalises D at 3. But the true distance is A->C->B->D = 2. There is no
cycle at all, yet the answer is wrong.

</details>

**14. (Multiple choice)** Grid of up to 40×40 cells, at most k = 40 obstacle removals, every step costs 1. Best tool?
A) Dijkstra on cells  B) BFS on (r, c, removalsLeft)  C) Floyd-Warshall  D) DFS with memo on (r, c)

<details><summary>Answer</summary>

**B.** Every step costs the same, so BFS is enough. The extra rule (removals left)
must be part of the state, giving at most 40·40·41 states. D is wrong: DFS does not find
shortest paths, and memoising on (r, c) alone ignores the removals left.

</details>

---

## Mastery checklist

- [ ] I can pick the right algorithm from "weights + sources + size" in under 30 seconds and justify it.
- [ ] I can write a MinHeap and lazy-deletion Dijkstra from memory in under 15 minutes.
- [ ] I can explain why Dijkstra fails with negative edges and give a counterexample.
- [ ] I can write Bellman-Ford (including the k-rounds copy trick) and explain the V-th round check.
- [ ] I can adapt the relaxation rule (sum, max, product, counting ways) to a new problem.
