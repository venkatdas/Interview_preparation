# Segment Tree — Quiz

Back to the [topic README](../README.md).

**1. (Complexity) Build, point update and range query of a segment tree cost?**

<details><summary>Answer</summary>

Build O(n), update O(log n), query O(log n). Space O(n) (4n slots recursive, 2n iterative).
</details>

**2. (Multiple choice) The identity for a range-max tree is:**
a) 0  b) -Infinity  c) Infinity  d) null

<details><summary>Answer</summary>

b) `-Infinity`, so an out-of-range child never wins a max.
</details>

**3. (Spot the bug)**

```js
query(node, lo, hi, l, r) {
  if (r < lo || hi < l) return 0;
  if (l <= lo && hi <= r) return this.tree[node];
  const mid = (lo + hi) >> 1;
  return Math.min(this.query(2*node+1, lo, mid, l, r), this.query(2*node+2, mid+1, hi, l, r));
}
```

<details><summary>Answer</summary>

It is a min tree but returns 0 for "no overlap". With positive values the answer becomes 0. Return `Infinity`.
</details>

**4. (Predict) Sum tree over `[2, 4, 6, 8]`. After `update(2, 10)`, what is `query(1, 3)`?**

<details><summary>Answer</summary>

Array becomes `[2, 4, 10, 8]`, so 4 + 10 + 8 = **22**.
</details>

**5. (Define the state) In a lazy range-add tree, what does `lazy[node] = 3` mean?**

<details><summary>Answer</summary>

Every element in this node's range has had +3 applied, and the node's own `sum` already includes it, but the children have not been told yet.
</details>

**6. (Multiple choice) Which query CANNOT be answered by merging two halves' summaries?**
a) range sum  b) range gcd  c) range median  d) range max

<details><summary>Answer</summary>

c) The median of a range is not a function of the medians of its halves.
</details>

**7. (Spot the bug) Lazy tree:** a range query goes into children without calling `pushDown` first.

<details><summary>Answer</summary>

Children still have stale sums (the pending tag was never applied to them), so partial queries return old values. Always push before recursing into children.
</details>

**8. (Complexity) Count of Smaller Numbers After Self with a value-indexed segment tree?**

<details><summary>Answer</summary>

O(n log n): sort/compress O(n log n), then n queries + n updates at O(log n) each.
</details>

**9. (Multiple choice) For n = 6, the recursive layout with children 2i+1, 2i+2 needs at most how many slots?**
a) 6  b) 12  c) 24 is always safe  d) 7

<details><summary>Answer</summary>

c) Allocating `4n = 24` is the always-safe rule (the true maximum here is 15, which is more than `2n = 12`).
</details>

**10. (Predict) Iterative tree with n = 4 stores leaves at which indices?**

<details><summary>Answer</summary>

`tree[4..7]`; parents at `tree[1..3]`; `tree[0]` is unused.
</details>

**11. (Complexity) A dynamic segment tree over [0, 10^9] after q updates uses how many nodes?**

<details><summary>Answer</summary>

O(q log C) where C = 10^9 — about 30 new nodes per update.
</details>

## Mastery checklist

- [ ] I can code a recursive segment tree (build / update / query) with a generic merge in under 15 minutes.
- [ ] I can explain the three cases of a query (no / full / partial overlap) and why it is O(log n).
- [ ] I can add lazy propagation for range add + range sum.
- [ ] I can turn a counting problem into a segment tree over compressed values.
- [ ] I can say when a Fenwick tree, sparse table or prefix sums would be better.
