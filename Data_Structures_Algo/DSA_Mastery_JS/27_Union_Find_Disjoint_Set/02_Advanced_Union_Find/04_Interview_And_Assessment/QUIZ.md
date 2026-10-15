# Advanced Union-Find — Quiz

Answer without looking at notes, then check. Back to the [topic README](../README.md).

---

### Q1. (Predict the output)

```js
const w = new WeightedUnionFind();
w.union('a', 'b', 2);
w.union('b', 'c', 3);
console.log(w.query('a', 'c'), w.query('c', 'b'), w.query('a', 'z'));
```

<details><summary>Answer</summary>

`6`, about `0.3333` (1/3), and `null`. a = 2b = 6c; c / b = 1/3; z is unknown.

</details>

### Q2. (Predict the output)

```js
const uf = new UnionFindRollback(4);
uf.union(0, 1); uf.union(2, 3);
const snap = uf.snapshot();
uf.union(1, 2); uf.union(0, 3);
uf.rollbackTo(snap);
console.log(uf.count, uf.connected(0, 3), uf.connected(2, 3));
```

<details><summary>Answer</summary>

`2 false true`. `union(0, 3)` was a no-op (pushed null), `union(1, 2)` a real merge; rolling back to the snapshot undoes both, leaving `{0,1}` and `{2,3}`.

</details>

### Q3. (Spot the bug) Weighted find:

```js
find(x) {
  if (this.parent.get(x) === x) return x;
  const p = this.parent.get(x);
  this.weight.set(x, this.weight.get(x) * this.weight.get(p));
  const root = this.find(p);
  this.parent.set(x, root);
  return root;
}
```

<details><summary>Answer</summary>

The weight is updated **before** p is compressed, so `weight[p]` is still relative to p's old parent, not the root. Call `find(p)` first, then multiply.

</details>

### Q4. (Spot the bug) Rollback variant:

```js
find(x) {
  if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
  return this.parent[x];
}
```

<details><summary>Answer</summary>

It uses path compression. `rollback()` only restores the one pointer the union changed, but compression has rewritten other pointers that still point to the old merged root. After a rollback, nodes can stay attached to the wrong set. Use a plain loop with no compression.

</details>

### Q5. (Complexity) Find in the rollback variant?

<details><summary>Answer</summary>

**O(log n)** worst case, from union by size alone. Rollback itself is O(1).

</details>

### Q6. (Multiple choice) `a / b = 4`. Currently `w(a) = 2` (relative to root ra) and `w(b) = 3` (relative to rb). When attaching ra under rb, `weight[ra]` is:

A. 4 * 2 / 3  B. 4 * 3 / 2  C. 4  D. 2 / (3 * 4)

<details><summary>Answer</summary>

**B** = 6. `ra = k * w(b) / w(a) * rb`. Check: a = 2 * ra = 2 * 6 rb = 12 rb, b = 3 rb, so a / b = 4.

</details>

### Q7. (Predict the output) Satisfiability on `["a==b", "b!=c", "c==a"]`.

<details><summary>Answer</summary>

`false`. After the equalities a, b, c are one group, so `b != c` is violated.

</details>

### Q8. (Predict the output) Lexicographically Smallest Equivalent String: `s1 = "parker", s2 = "morris", baseStr = "parser"`.

<details><summary>Answer</summary>

**`"makkek"`**. The pairs are p-m, a-o, r-r, k-r, e-i, r-s, so the groups are {m, p}, {a, o}, {k, r, s}, {e, i}, with smallest letters m, a, k, e. Then `parser` maps p->m, a->a, r->k, s->k, e->e, r->k. The trap is merging e into the r group: e is only linked to i, never to r or s.

</details>

### Q9. (Multiple choice) Which problem needs a weighted union-find?

A. Number of Provinces  B. Evaluate Division  C. Accounts Merge  D. Redundant Connection

<details><summary>Answer</summary>

**B.** It needs the ratio between nodes, not just membership.

</details>

### Q10. (Predict the output) Evaluate Division with `equations = [["a","b"]], values = [2]`, queries `[["b","a"], ["a","a"], ["x","x"]]`.

<details><summary>Answer</summary>

`[0.5, 1, -1]`.

</details>

### Q11. (True / false) A parity (XOR) weighted union-find can check whether a graph is bipartite while edges arrive one by one.

<details><summary>Answer</summary>

**True.** Each edge says "different colour" (parity 1). If both endpoints are already in one set with the same parity to the root, the graph is not bipartite.

</details>

### Q12. (Multiple choice) In Number of Islands II, positions `[[0,0],[0,0]]` on a 1 x 1 grid give:

A. `[1, 2]`  B. `[1, 1]`  C. `[1, 0]`  D. an error

<details><summary>Answer</summary>

**B.** The second add is a duplicate; the count must not change.

</details>

### Q13. (Find the counterexample) "In weighted union-find, if `find(a) === find(b)` you can just ignore the new equation." Give an input where this hides a problem.

<details><summary>Answer</summary>

`a / b = 2`, then `a / b = 3`. The second equation contradicts the first, but because a and b are already in one set it is silently ignored. Fine for Evaluate Division (inputs are consistent), wrong for "Check for Contradictions in Equations", where you must compare `weight[a] / weight[b]` with the new value.

</details>

---

## Mastery checklist

- [ ] I can derive the weighted union formula `w(ra) = k * w(b) / w(a)` on paper without notes.
- [ ] I can implement rollback union-find and explain why it must not compress paths.
- [ ] I can adapt the weighted version to differences and to parity (XOR).
- [ ] I know the two-pass trick for equality / inequality constraints.
- [ ] I solved Evaluate Division with both union-find and DFS, and can compare them.
