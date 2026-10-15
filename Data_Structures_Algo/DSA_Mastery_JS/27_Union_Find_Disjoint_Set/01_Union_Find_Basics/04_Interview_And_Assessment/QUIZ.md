# Union-Find Basics — Quiz

Answer without looking at notes, then check. Back to the [topic README](../README.md).

---

### Q1. (Predict the output) Using union by size (ties: the first argument's root stays root):

```js
const uf = new UnionFind(5);
uf.union(0, 1); uf.union(2, 3); uf.union(3, 4); uf.union(1, 4);
console.log(uf.count(), uf.sizeOf(0), uf.connected(0, 3));
```

<details><summary>Answer</summary>

`1 5 true`. The last union merges `{0,1}` with `{2,3,4}`; every element is in one group of size 5.

</details>

### Q2. (Predict the output) `[uf.union(0, 1), uf.union(1, 2), uf.union(2, 0), uf.union(1, 1)]` on a fresh `UnionFind(3)`.

<details><summary>Answer</summary>

`[true, true, false, false]`. `union(2, 0)` closes a cycle; `union(1, 1)` is a self-union and changes nothing.

</details>

### Q3. (Spot the bug)

```js
connected(a, b) {
  return this.parent[a] === this.parent[b];
}
```

<details><summary>Answer</summary>

Parents are not roots. In `0 <- 1 <- 2` (before compression), `parent[2] = 1` and `parent[0] = 0`, so 0 and 2 look disconnected. Compare `this.find(a) === this.find(b)`.

</details>

### Q4. (Spot the bug)

```js
union(a, b) {
  const ra = this.find(a), rb = this.find(b);
  this.parent[rb] = ra;
  this.count--;
}
```

<details><summary>Answer</summary>

Two bugs. (1) If `ra === rb` it still decrements `count`, so redundant edges make the component count wrong (and it never reports the cycle). Return early with `false`. (2) It ignores sizes, so trees can become long chains. Attach the smaller root under the larger.

</details>

### Q5. (Complexity) What is the worst-case cost of one `find` with union by size but **no** path compression?

<details><summary>Answer</summary>

**O(log n).** Union by size alone keeps every tree's height at most log2(n).

</details>

### Q6. (Multiple choice) Which problem is NOT a good fit for union-find?

A. Number of Provinces  B. Redundant Connection  C. Course Schedule  D. Accounts Merge

<details><summary>Answer</summary>

**C.** Course Schedule is about a **directed** graph (prerequisites). Union-find ignores direction; use topological sort.

</details>

### Q7. (Predict the output) Graph Valid Tree with `n = 4, edges = [[0,1],[2,3]]`.

<details><summary>Answer</summary>

`false`. No cycle, but two components (it is a forest). Quick check: 2 edges, not n - 1 = 3.

</details>

### Q8. (Multiple choice) In a 3 x 5 grid, what id does cell `(2, 1)` get with `id = r * cols + c`?

A. 7  B. 11  C. 3  D. 10

<details><summary>Answer</summary>

**B.** `2 * 5 + 1 = 11`. Using rows instead of cols (`2 * 3 + 1 = 7`) is the classic bug that makes ids collide.

</details>

### Q9. (Predict the output) Redundant Connection on `[[1,2],[2,3],[3,4],[1,4],[1,5]]`.

<details><summary>Answer</summary>

`[1, 4]`. Edges 1-2, 2-3, 3-4 connect 1..4; then 1-4 finds both already connected.

</details>

### Q10. (True / false) After `n - 1` successful unions on n elements, `count()` is 1.

<details><summary>Answer</summary>

**True.** Each successful union reduces the count by exactly one: n - (n - 1) = 1.

</details>

### Q11. (Predict the output) Number of Islands II on a 2 x 2 grid with positions `[[0,0],[1,1],[0,1],[0,1]]`.

<details><summary>Answer</summary>

`[1, 2, 1, 1]`. The third land cell joins both islands; the duplicate fourth position changes nothing.

</details>

### Q12. (Complexity) Number of Connected Components with n nodes and m edges using union-find with both optimisations?

<details><summary>Answer</summary>

**O(n + m * alpha(n))** time, effectively O(n + m), and **O(n)** space.

</details>

### Q13. (Multiple choice) Edges are removed one at a time and after each removal you must report the component count. All removals are known in advance. Best approach?

A. re-run DFS after each removal  B. union-find, processing removals in reverse as additions  C. union-find with `split`  D. topological sort

<details><summary>Answer</summary>

**B.** Union-find cannot split, but reversing time turns removals into additions. A works but is O(k(V + E)). C does not exist. D is for directed ordering.

</details>

---

## Mastery checklist

- [ ] I can write `UnionFind` with path compression, union by size and a component count from memory in under 5 minutes.
- [ ] I can explain why both optimisations together give near-constant amortised time, and what each alone gives.
- [ ] I know `union` returning false is my undirected cycle detector.
- [ ] I can map grid cells and string keys to union-find nodes without bugs.
- [ ] I can say when NOT to use union-find: directed graphs, paths/distances, online deletions.
