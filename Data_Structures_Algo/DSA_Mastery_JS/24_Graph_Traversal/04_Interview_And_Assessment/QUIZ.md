# Graph Traversal — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

Graph used below (undirected): edges `0-1, 0-2, 1-3, 2-3, 3-4`, neighbours stored in ascending order.

---

**1. (Predict the output)** BFS order and distances from 0?

<details><summary>Answer</summary>Order `0 1 2 3 4`; distances `[0, 1, 1, 2, 3]`.</details>

**2. (Predict the output)** Recursive DFS order from 0?

<details><summary>Answer</summary>`0 1 3 2 4`.</details>

**3. (Complexity)** BFS on an adjacency list with V vertices and E edges?

<details><summary>Answer</summary>O(V + E) time, O(V) space.</details>

**4. (Spot the bug)**

```js
while (queue.length) {
  const u = queue.shift();
  if (seen.has(u)) continue;
  seen.add(u);
  for (const v of adj[u]) queue.push(v);
}
```

<details><summary>Answer</summary>Nodes are marked on dequeue, so the same node can be enqueued many times (and `shift` is O(n)). Mark when enqueuing: `if (!seen.has(v)) { seen.add(v); queue.push(v); }`, and use a head index.</details>

**5. (Multiple choice)** Shortest path in a grid where every move costs 1:
A) DFS  B) BFS  C) Dijkstra required  D) topological sort

<details><summary>Answer</summary>B.</details>

**6. (Predict the output)** Number of islands for `["110", "010", "001"]` (4-directional)?

<details><summary>Answer</summary>`2`.</details>

**7. (Spot the bug)** Grid DFS:

```js
function dfs(r, c) {
  if (grid[r][c] !== '1' || r < 0 || c < 0 || r >= R || c >= C) return;
  ...
}
```

<details><summary>Answer</summary>The cell is read before the bounds check, so `grid[-1]` is `undefined` and `grid[-1][c]` throws. Check bounds first.</details>

**8. (Multiple choice)** Rotting Oranges should start BFS from:
A) each fresh orange  B) one rotten orange  C) all rotten oranges at once  D) the top-left cell

<details><summary>Answer</summary>C (multi-source BFS).</details>

**9. (Complexity)** Word Ladder with N words of length L, generating neighbours by trying 26 letters per position?

<details><summary>Answer</summary>O(N · L · 26 · L) — for each word, L · 26 candidates, each costing O(L) to build/hash.</details>

**10. (Predict the output)** Is `n = 4, edges = [[0,1],[0,2],[0,3]]` a valid tree? And `n = 4, edges = [[0,1],[1,2],[2,0]]`?

<details><summary>Answer</summary>Yes (3 edges, connected). No (cycle, and vertex 3 is disconnected).</details>

**11. (Spot the bug)** Undirected cycle check with DFS:

```js
function hasCycle(u, seen) {
  seen.add(u);
  for (const v of adj[u]) { if (seen.has(v)) return true; if (hasCycle(v, seen)) return true; }
  return false;
}
```

<details><summary>Answer</summary>It reports a cycle for every edge, because the parent is always already seen. Pass the parent and ignore it: `if (v === parent) continue;`.</details>

**12. (Multiple choice)** Which problem is best solved by flooding from the border inward?
A) Number of Islands  B) Surrounded Regions  C) Clone Graph  D) Keys and Rooms

<details><summary>Answer</summary>B (also Number of Enclaves, Pacific Atlantic).</details>

---

## Mastery checklist

- [ ] I can write BFS (with a head pointer and level loop) and DFS (recursive and iterative) from memory.
- [ ] I always mark visited on enqueue/push and check grid bounds before reading cells.
- [ ] I can solve island, component and flood-fill problems on grids and adjacency lists.
- [ ] I can apply multi-source BFS and border-inward flooding.
- [ ] I can model implicit graphs (Word Ladder, Open the Lock) and pick BFS for fewest steps.
