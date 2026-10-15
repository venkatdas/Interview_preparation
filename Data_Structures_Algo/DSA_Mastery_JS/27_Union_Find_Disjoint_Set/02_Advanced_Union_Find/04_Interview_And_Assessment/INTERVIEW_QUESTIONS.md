# Advanced Union-Find — Interview Questions

Answer each question out loud first, then open the model answer. Back to the [topic README](../README.md) or the [concepts guide](../01_Concepts/CONCEPTS.md).

---

### 1. What is a weighted union-find, and what invariant does it keep?

<details><summary>Model answer</summary>

Each node stores a weight relating it to its parent. For ratios: `value[x] = weight[x] * value[parent[x]]`. After `find(x)` compresses the path, `weight[x] = value[x] / value[root]`, so any two nodes in the same set can be compared through their common root: `a / b = weight[a] / weight[b]`.

</details>

### 2. Derive the union formula for "a / b = k".

<details><summary>Model answer</summary>

After finds, `a = w(a) * ra` and `b = w(b) * rb`. We want `a = k * b`, so `w(a) * ra = k * w(b) * rb`, giving `ra = (k * w(b) / w(a)) * rb`. Attach ra under rb with `weight[ra] = k * w(b) / w(a)`.

</details>

### 3. In weighted `find`, why must the weight update happen after the recursive call?

<details><summary>Model answer</summary>

`weight[x]` is relative to the old parent p. To make it relative to the root, multiply by p's weight relative to the root, which is only correct once p itself has been compressed. So: `root = find(p)`, then `weight[x] *= weight[p]`, then `parent[x] = root`.

</details>

### 4. How do you adapt weighted union-find for differences (`a - b = d`) or parity (same / different team)?

<details><summary>Model answer</summary>

Differences: weights start at 0, `find` adds (`w(x) += w(p)`), union sets `w(ra) = d + w(b) - w(a)`, query returns `w(a) - w(b)`. Parity: weights in {0, 1}, combine with XOR; a constraint "different" between nodes already in the same set with equal parity is a contradiction (this checks bipartiteness online).

</details>

### 5. Why can't a rollback union-find use path compression?

<details><summary>Model answer</summary>

Compression rewrites many parent pointers during a single find; undoing a union would need to restore all of them, which is expensive and complicated. Without compression, each union changes exactly one parent pointer and one size, so undo is O(1). Union by size alone still keeps finds at O(log n).

</details>

### 6. How does rollback work, and why push `null` for a no-op union?

<details><summary>Model answer</summary>

Each successful union pushes `{child, parent}` on a history stack; rollback pops it, resets `parent[child] = child`, subtracts the child's size from the parent and increments the count. Pushing `null` for no-op unions keeps a strict one-union-one-rollback pairing, so callers can always undo the last k unions with k rollbacks. A snapshot is the history length.

</details>

### 7. Where is rollback union-find used?

<details><summary>Model answer</summary>

Offline dynamic connectivity (edges inserted and deleted over time, queries answered after reading everything): build a segment tree over time, add each edge to the time ranges it is alive, DFS the tree applying unions on the way down and rolling back on the way up. Also backtracking searches that try an edge and undo it.

</details>

### 8. Evaluate Division: union-find vs graph DFS?

<details><summary>Model answer</summary>

DFS: build a weighted directed graph with `a->b = k` and `b->a = 1/k`, answer each query by searching, multiplying along the path: O(V + E) per query. Weighted union-find: near-O(1) per query after building, and new equations can be added between queries. DFS is easier to explain; union-find scales better with many queries.

</details>

### 9. In Evaluate Division, what is the answer for `x / x` if x never appeared? Why?

<details><summary>Model answer</summary>

-1. We know nothing about x; it might not even be defined. Only variables that appeared in some equation get `a / a = 1`.

</details>

### 10. Lexicographically Smallest Equivalent String: why skip union by size?

<details><summary>Model answer</summary>

The representative must be the smallest letter of its group, so we attach the larger root under the smaller one. With only 26 letters, tree depth cannot hurt performance, so giving up union by size costs nothing.

</details>

### 11. Satisfiability of Equality Equations: why two passes?

<details><summary>Model answer</summary>

An inequality can only be checked after all equalities that might connect its two sides have been applied. `["a!=c", "a==b", "b==c"]` is unsatisfiable, but a one-pass check would test `a!=c` before a and c are connected and miss it. Pass 1 unions all `==`; pass 2 checks every `!=`.

</details>

### 12. When do you use a Map-based union-find instead of arrays?

<details><summary>Model answer</summary>

When keys are strings or sparse large integers (emails, variable names, coordinates up to 10^9) and you do not know them up front. Auto-add on `find`. If performance matters, map keys to dense integer ids first and use arrays.

</details>

### 13. How would you detect a contradictory equation (`a / b = 2` and later `a / b = 3`)?

<details><summary>Model answer</summary>

Before union, find both roots. If they are already in the same set, compute the implied ratio `weight[a] / weight[b]` and compare with the new k using a tolerance. If they differ, it is a contradiction. The plain `union` in this folder silently ignores a same-set equation.

</details>

### 14. Number of Islands II: what extra state do you need beyond the union-find?

<details><summary>Model answer</summary>

A set (or boolean grid) of cells that are already land, so a repeated position does not increase the count, and so you only union with neighbours that are land. Keep `count`: +1 for a new land cell, -1 for each successful union with a neighbour.

</details>
