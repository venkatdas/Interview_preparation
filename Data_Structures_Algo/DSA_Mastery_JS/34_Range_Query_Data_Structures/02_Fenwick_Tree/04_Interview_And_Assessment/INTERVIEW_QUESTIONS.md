# Fenwick Tree (BIT) — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. What does `tree[i]` store in a Fenwick tree?

<details><summary>Model answer</summary>

The sum of the `lowbit(i) = i & -i` elements ending at position i (1-indexed), i.e. positions `(i - lowbit(i), i]`. For example `tree[6]` covers positions 5..6, `tree[8]` covers 1..8.
</details>

### 2. Walk through `prefixSum(i)` and explain why it is O(log n).

<details><summary>Model answer</summary>

Add `tree[i]`, then `i -= i & -i` (drop the lowest set bit), repeat until i = 0. Each step removes one set bit, and i has at most log2(n)+1 bits, so at most O(log n) steps.
</details>

### 3. Why does `update` use `i += i & -i`?

<details><summary>Model answer</summary>

The nodes whose ranges contain position i are exactly i, then i plus its lowbit, and so on: adding the lowest set bit moves to the next larger block that still covers i. Each step increases the lowest set bit, so there are O(log n) steps.
</details>

### 4. Why is the internal array 1-indexed?

<details><summary>Model answer</summary>

`0 & -0 = 0`, so with index 0 `update` would loop forever (`i += 0`) and `prefixSum` would stop immediately. Shifting every external index by +1 avoids this.
</details>

### 5. How do you get a range sum and a point value?

<details><summary>Model answer</summary>

`rangeSum(l, r) = prefixSum(r) - prefixSum(l - 1)`. A single value is `rangeSum(i, i)`. Many people also keep a plain copy of the array so "set to value" can be turned into a delta.
</details>

### 6. How do you count inversions (or "smaller after self") with a BIT?

<details><summary>Model answer</summary>

Compress values to ranks. Scan from right to left; for each value, query how many already-inserted values have rank < its rank (prefixSum(rank-1)), then insert it (`update(rank, +1)`). Total O(n log n).
</details>

### 7. Can a Fenwick tree answer range minimum queries?

<details><summary>Model answer</summary>

Not in general. Range queries rely on subtracting prefix answers, and min has no inverse. Prefix minimum with only "decrease" updates works, but for general range min use a segment tree or sparse table.
</details>

### 8. How do you build a BIT in O(n) instead of O(n log n)?

<details><summary>Model answer</summary>

Copy values into `tree[1..n]`, then for i from 1 to n add `tree[i]` into `tree[i + lowbit(i)]` if that parent exists. Each node pushes its total to exactly one parent once.
</details>

### 9. How do you support range add + point query?

<details><summary>Model answer</summary>

Store a difference array in the BIT: to add v on [l, r], do `update(l, +v)` and `update(r+1, -v)`. The value at i is `prefixSum(i)`. For range add + range sum, use two BITs (the classic `B1`, `B2` trick).
</details>

### 10. How do you find the k-th smallest element in a BIT of counts?

<details><summary>Model answer</summary>

Binary lifting: start at pos 0 and try steps of size 2^j from large to small; if `pos + step ≤ n` and `tree[pos + step] < k`, move there and subtract. The answer is `pos + 1` (1-indexed). O(log n), no binary search over prefix sums needed.
</details>

### 11. When would you choose a BIT over a segment tree in an interview?

<details><summary>Model answer</summary>

When the operation is sum / count / xor with point updates — the code is about 10 lines, less error-prone and faster. Choose a segment tree for min/max, custom merges, or range-assign updates.
</details>

### 12. What does a 2D BIT cost?

<details><summary>Model answer</summary>

O(log R · log C) per update and per prefix query, O(R·C) memory. Rectangle sums use inclusion-exclusion over four prefix queries.
</details>
