# Topological Sorting — Quiz

Answer without looking at notes, then check. Back to the [topic README](../README.md).

---

### Q1. (Multiple choice) Which graph has a topological order?

A. `0->1, 1->2, 2->0`  B. `0->1, 0->2, 1->2`  C. `0->0`  D. an undirected triangle

<details><summary>Answer</summary>

**B.** It is a DAG (order 0, 1, 2). A and C contain cycles (C is a self loop). D is undirected, so "before" is undefined.

</details>

### Q2. (Predict the output) `topoSortKahn(4, [[0, 2], [1, 2], [2, 3]])` with a FIFO queue that starts with nodes in increasing order.

<details><summary>Answer</summary>

`[0, 1, 2, 3]`. Start queue `[0, 1]`. Pop 0: in-degree of 2 becomes 1. Pop 1: in-degree of 2 becomes 0, push 2. Pop 2: push 3. Pop 3.

</details>

### Q3. (Predict the output) Kahn's algorithm on `n = 4`, edges `0->1, 1->2, 2->1, 2->3`. How many nodes end up in the order?

<details><summary>Answer</summary>

**1** (just node 0). After removing 0, node 1 still has in-degree 1 (from 2), and 2 has in-degree 1 (from 1). They block each other, so the queue empties. 1 < 4 means a cycle.

</details>

### Q4. (Complexity) What is the time complexity of Kahn's algorithm if you store the graph as an adjacency **matrix** instead of a list?

<details><summary>Answer</summary>

**O(V^2).** For each dequeued node you scan a whole row of V entries to find its neighbours. With an adjacency list it is O(V + E).

</details>

### Q5. (Spot the bug) Directed cycle detection:

```js
function hasCycle(n, adj) {
  const visited = new Array(n).fill(false);
  function dfs(u) {
    visited[u] = true;
    for (const v of adj[u]) {
      if (visited[v]) return true;
      if (dfs(v)) return true;
    }
    return false;
  }
  for (let u = 0; u < n; u++) if (!visited[u] && dfs(u)) return true;
  return false;
}
```

<details><summary>Answer</summary>

It treats any visited node as a cycle. On the diamond `0->1, 0->2, 1->3, 2->3`, node 3 is visited from 1, then seen again from 2, and the function wrongly returns true. Fix: use three colours and only report a cycle on a GRAY (still on the current path) node; mark a node BLACK when it finishes.

</details>

### Q6. (Spot the bug) DFS topological sort:

```js
function dfs(u) {
  order.push(u);                      // record the node
  color[u] = GRAY;
  for (const v of adj[u]) if (color[v] === WHITE) dfs(v);
  color[u] = BLACK;
}
// ... call dfs for each white node, then return order
```

<details><summary>Answer</summary>

It records nodes in **pre-order** (on entry). Pre-order is not a topological order: with edges `0->2, 1->2`, the outer loop calls dfs(0), which records 0 then 2, then dfs(1) records 1, giving `[0, 2, 1]`; but `1->2` needs 1 before 2. You must push **after** the loop (post-order) and then reverse the list. (It also never checks GRAY neighbours, so cycles go unnoticed.)

</details>

### Q7. (Multiple choice) "Minimum number of semesters" in Parallel Courses equals:

A. the number of nodes  B. the number of Kahn levels  C. the number of edges  D. the number of in-degree-0 nodes

<details><summary>Answer</summary>

**B.** Each level is one semester; the count equals the number of nodes on the longest path.

</details>

### Q8. (Predict the output) Alien Dictionary on `["z", "x", "z"]`.

<details><summary>Answer</summary>

`""`. Pair 1 gives `z -> x`, pair 2 gives `x -> z`. That is a cycle, so no valid alphabet exists.

</details>

### Q9. (Predict the output) Alien Dictionary on `["abc", "ab"]`.

<details><summary>Answer</summary>

`""`. No differing character exists, and the longer word comes first while the shorter is its prefix. No alphabet can sort a word before its own prefix.

</details>

### Q10. (Multiple choice) You need the lexicographically smallest valid order. What changes?

A. sort the edges first  B. use a min-heap instead of the queue  C. run DFS from the smallest node  D. nothing, Kahn already gives it

<details><summary>Answer</summary>

**B.** Always taking the smallest currently free node gives the smallest order. A, C and D do not guarantee it (D only happens to work when the queue always holds nodes in sorted order).

</details>

### Q11. (Complexity) Minimum Height Trees peels leaves layer by layer. Time and space?

<details><summary>Answer</summary>

**O(n) time and O(n) space.** A tree has n - 1 edges; each node is removed once and each edge decrements a degree once.

</details>

### Q12. (True / false) If every edge of a DAG is reversed, the reverse of any topological order of the original is a topological order of the new graph.

<details><summary>Answer</summary>

**True.** Edge `u -> v` had u before v. After reversing, the edge is `v -> u`, and in the reversed order v comes before u.

</details>

### Q13. (Predict the output) `longestPathInDag(5, [[0, 1], [1, 2], [0, 3], [3, 2], [2, 4]])` (counts edges).

<details><summary>Answer</summary>

**3.** For example `0 -> 1 -> 2 -> 4`.

</details>

---

## Mastery checklist

- [ ] I can write Kahn's algorithm from memory in under 5 minutes, including the `order.length < n` cycle check.
- [ ] I can explain why DFS finish order, reversed, is a topological order, and why only GRAY means a cycle.
- [ ] I always state the edge direction ("prerequisite -> course") before coding.
- [ ] I can adapt Kahn for levels (minimum rounds), uniqueness, and lexicographic order.
- [ ] I solved Course Schedule II and Alien Dictionary without hints, handling the prefix and isolated-letter edge cases.
