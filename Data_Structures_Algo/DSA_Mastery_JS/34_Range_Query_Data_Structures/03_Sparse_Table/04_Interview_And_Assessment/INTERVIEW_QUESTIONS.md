# Sparse Table — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. What does `table[k][i]` store?

<details><summary>Model answer</summary>

The result of the operation (e.g. min) over the `2^k` elements starting at index i: `nums[i .. i + 2^k - 1]`.
</details>

### 2. How is the table built and what does it cost?

<details><summary>Model answer</summary>

Row 0 is the array. Row k combines two halves from row k-1: `table[k][i] = op(table[k-1][i], table[k-1][i + 2^(k-1)])`. There are `floor(log2 n) + 1` rows of at most n entries: O(n log n) time and space.
</details>

### 3. How does an O(1) query work?

<details><summary>Model answer</summary>

Let `k = floor(log2(r - l + 1))`. The block of length 2^k starting at l and the one ending at r together cover [l, r] (they may overlap). Answer `op(table[k][l], table[k][r - 2^k + 1])`.
</details>

### 4. Why must the operation be idempotent?

<details><summary>Model answer</summary>

The two blocks can overlap, so elements in the overlap are counted twice. That is harmless when `op(x, x) = x` (min, max, gcd, bitwise and/or) but wrong for sum or product.
</details>

### 5. Can you still use a sparse table for sums?

<details><summary>Model answer</summary>

Yes, with disjoint blocks: walk the binary representation of the length and combine non-overlapping blocks, O(log n) per query. But a prefix-sum array is O(1) and simpler, so you would not.
</details>

### 6. Why precompute a log table instead of calling `Math.log2`?

<details><summary>Model answer</summary>

Speed (a lookup per query) and safety: floating-point `Math.log2` can be off near exact powers of two for some values. The integer recurrence `log[x] = log[x >> 1] + 1` is exact.
</details>

### 7. Sparse table vs segment tree?

<details><summary>Model answer</summary>

Sparse table: O(1) query, O(n log n) memory, no updates. Segment tree: O(log n) query, O(n) memory, supports updates and any associative merge. Choose sparse table only for static data with many queries.
</details>

### 8. How is a sparse table used for LCA?

<details><summary>Model answer</summary>

Do an Euler tour of the tree recording depth at each step. The LCA of u and v is the node with minimum depth between their first occurrences in the tour — a static range-min query, O(1) after O(n log n) preprocessing.
</details>

### 9. How is it used with suffix arrays?

<details><summary>Model answer</summary>

The LCP of suffixes i and j equals the minimum of the LCP array between their positions in the suffix array (`min(lcp[rank_i+1 .. rank_j])`). A sparse table answers each such query in O(1).
</details>

### 10. Sliding window maximum — sparse table or deque?

<details><summary>Model answer</summary>

Both work. The sparse table is O(n log n) build + O(1) per window; the monotonic deque is O(n) total with O(k) memory, so the deque is the expected answer. The sparse table is more flexible when windows have different sizes.
</details>

### 11. What edge cases matter?

<details><summary>Model answer</summary>

n = 1 (only row 0), l = r, ranges whose length is an exact power of two (both blocks coincide), the full range, duplicates, and negative values. Also: row k has only `n - 2^k + 1` valid entries.
</details>
