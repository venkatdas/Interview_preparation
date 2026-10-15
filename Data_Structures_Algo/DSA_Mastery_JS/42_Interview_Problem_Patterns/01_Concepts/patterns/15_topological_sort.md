# 15. Topological Sort

A topological order lists the nodes of a **directed acyclic graph (DAG)** so that every edge
`a -> b` has `a` before `b`. Think "put on socks before shoes". It exists **only if there is no
cycle**, so the same algorithm also answers "is there a circular dependency?".

Two ways to compute it:

- **Kahn's algorithm (BFS):** repeatedly take a node with in-degree 0 (nothing left that must come before it), remove its edges, repeat. If you could not take all n nodes, there is a cycle.
- **DFS post-order:** finish a node after all its descendants, then reverse the finish order. A "back edge" to a node still on the stack means a cycle.

**Teaches in depth:** [Topological Sorting](../../../26_Topological_Sorting/README.md), [Graphs](../../../23_Graphs/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at topological sort |
|---|---|
| "prerequisites", "course schedule", "must finish X before Y" | dependency edges |
| "build order", "task order", "compile order" | output a valid order |
| "is it possible to finish all" | cycle detection |
| "alien dictionary", "order of letters from sorted words" | build edges from adjacent word pairs |
| "minimum semesters / parallel courses" | Kahn by levels |
| "longest path in a DAG", "eventual safe states" | DP over topological order / reverse graph |

**Constraint hints**

- Up to 10^5 nodes and edges -> O(V + E) is expected; both versions qualify.
- "Return any valid order" means several answers can be correct — test with a validator, not a fixed array.

## 2. When it applies (preconditions)

- Edges are **directed** and represent "before" relationships.
- You need an order, the number of "rounds", or a yes/no on cycles.

## 3. When it does NOT apply

- **Undirected graphs.** "Order" makes no sense; an undirected edge `a - b` would need `a` before `b` and `b` before `a`. Use BFS/DFS or union-find.
- **Graphs with cycles where you still need an order.** `0 -> 1 -> 2 -> 0`: no topological order exists. You may need strongly connected components (condense each cycle into one node first).
- **Shortest path in a general weighted graph.** Topological DP only works in a DAG; with cycles use Dijkstra or Bellman-Ford ([14](14_graph_traversal_and_shortest_paths.md)).

## 4. The template

```js
// Kahn's algorithm. edges: [from, to] means from must come before to. [] if there is a cycle.
function topoSortKahn(n, edges) {
  const graph = buildAdjList(n, edges, true);
  const inDegree = new Array(n).fill(0);
  for (const [, to] of edges) inDegree[to]++;
  const queue = [];
  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);
  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const next of graph.get(node)) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }
  return order.length === n ? order : []; // fewer than n => cycle
}

// DFS version with 3 colors: 0 new, 1 on the current path, 2 finished
function topoSortDFS(n, edges) {
  const graph = buildAdjList(n, edges, true);
  const color = new Array(n).fill(0);
  const order = [];
  let hasCycle = false;
  function dfs(u) {
    color[u] = 1;
    for (const v of graph.get(u)) {
      if (color[v] === 1) { hasCycle = true; return; } // back edge -> cycle
      if (color[v] === 0) dfs(v);
      if (hasCycle) return;
    }
    color[u] = 2;
    order.push(u);                                     // post-order
  }
  for (let u = 0; u < n && !hasCycle; u++) if (color[u] === 0) dfs(u);
  return hasCycle ? [] : order.reverse();
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`topoSortKahn`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`topoSortDFS`, `isTopologicalOrder`) and [tests/patterns.test.js](../../tests/patterns.test.js) (random DAGs validated with `isTopologicalOrder`, random cyclic graphs must return `[]`).

**Dry run** Kahn on n = 4, edges `0->1, 0->2, 1->3, 2->3`:

| queue pop | order | in-degree updates | pushed |
|---|---|---|---|
| 0 | [0] | 1:0, 2:0 | 1, 2 |
| 1 | [0, 1] | 3:1 | — |
| 2 | [0, 1, 2] | 3:0 | 3 |
| 3 | [0, 1, 2, 3] | — | — |

## 5. Variations

- **Course Schedule (yes/no):** return `order.length === n`.
- **Minimum semesters:** run Kahn level by level; the number of levels is the answer.
- **Lexicographically smallest order:** replace the queue with a min-heap.
- **Alien dictionary:** compare adjacent words; the first differing letters give an edge. A longer word before its own prefix (`"abc"` before `"ab"`) is invalid.
- **Unique order (sequence reconstruction):** the queue must never hold more than one node.
- **DP on a DAG:** longest path, number of paths — process nodes in topological order.

## 6. Common pitfalls

1. Reversing the edge direction: `[course, prereq]` usually means `prereq -> course`. Read the statement twice.
2. Two colors instead of three in DFS: a "visited" node from a *previous* DFS is not a cycle; only a node on the *current* path is.
3. Forgetting isolated nodes (in-degree 0, no edges) — they must still appear in the order.
4. Duplicate edges inflate in-degrees; that is fine as long as you decrement once per edge too.
5. Recursive DFS on 10^5 nodes may overflow the stack — prefer Kahn in JS.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Course Schedule | Medium | cycle detection | [statement](../../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/01_course_schedule.js) |
| 2 | Course Schedule II | Medium | output the order | [statement](../../../26_Topological_Sorting/03_Problems/02_Medium/02_course_schedule_ii.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/02_course_schedule_ii.js) |
| 3 | Find Eventual Safe States | Medium | reverse graph / colors | [statement](../../../26_Topological_Sorting/03_Problems/02_Medium/03_find_eventual_safe_states.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/03_find_eventual_safe_states.js) |
| 4 | Minimum Height Trees | Medium | peel leaves (Kahn on undirected degrees) | [statement](../../../26_Topological_Sorting/03_Problems/02_Medium/04_minimum_height_trees.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/04_minimum_height_trees.js) |
| 5 | Parallel Courses | Medium | Kahn by levels | [statement](../../../26_Topological_Sorting/03_Problems/02_Medium/05_parallel_courses.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/05_parallel_courses.js) |
| 6 | Sequence Reconstruction | Medium | unique order | [statement](../../../26_Topological_Sorting/03_Problems/02_Medium/06_sequence_reconstruction.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/06_sequence_reconstruction.js) |
| 7 | Longest Increasing Path in a Matrix | Hard | DAG of increasing cells | [statement](../../../26_Topological_Sorting/03_Problems/03_Hard/07_longest_increasing_path_in_matrix.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/07_longest_increasing_path_in_matrix.js) |
| 8 | Alien Dictionary | Hard | build edges from words | [statement](../../../26_Topological_Sorting/03_Problems/03_Hard/08_alien_dictionary.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/08_alien_dictionary.js) |

## 8. Self-check

**Q1.** How does Kahn's algorithm detect a cycle?

<details><summary>Answer</summary>

Nodes on a cycle never reach in-degree 0 (each waits for another on the cycle), so they are never queued. If the final order has fewer than n nodes, a cycle exists.

</details>

**Q2.** Why reverse the DFS post-order?

<details><summary>Answer</summary>

A node finishes only after everything reachable from it has finished. So in post-order, every node appears *after* its descendants; reversing puts it *before* them, which is exactly the "before" requirement.

</details>

**Q3.** Words `["wrt", "wrf", "er", "ett", "rftt"]`. Which edges does the first pair give?

<details><summary>Answer</summary>

`"wrt"` vs `"wrf"`: the first difference is at index 2, `t` vs `f`, giving edge `t -> f`. Only the first differing position counts.

</details>

---

Previous: [14. Graph Traversal & Shortest Paths](14_graph_traversal_and_shortest_paths.md) · Next: [16. Union-Find](16_union_find.md) · [Pattern index](../../README.md)
