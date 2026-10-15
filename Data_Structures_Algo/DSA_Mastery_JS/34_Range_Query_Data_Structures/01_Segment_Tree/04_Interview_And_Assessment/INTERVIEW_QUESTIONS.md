# Segment Tree — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. When do you reach for a segment tree instead of prefix sums?

<details><summary>Model answer</summary>

When the array changes between queries. Prefix sums give O(1) queries but an update costs O(n) to rebuild. A segment tree gives O(log n) for both updates and queries, and it also works for min/max/gcd where prefix sums cannot subtract.
</details>

### 2. What does each node store, and what property must the merge operation have?

<details><summary>Model answer</summary>

Each node stores the merged summary of a contiguous slice `[lo, hi]`. The merge must be associative (`merge(merge(a,b),c) = merge(a,merge(b,c))`) and have an identity for empty ranges (0 for sum, Infinity for min). It does not need to be commutative if you always merge left then right.
</details>

### 3. Why is a range query O(log n)?

<details><summary>Model answer</summary>

At each depth of the tree at most two nodes are "partially" overlapping the query range (the ones containing the left and right borders); every other visited node is either fully inside (returned immediately) or fully outside. So the work per level is constant and there are O(log n) levels — about 4 log n node visits at most.
</details>

### 4. Why allocate 4n slots for the recursive array layout?

<details><summary>Model answer</summary>

The tree has height `ceil(log2 n)`, so the last level index can reach `2^(ceil(log2 n)+1) - 1`, which is less than `4n` for every n. `2n` is enough only when n is a power of two (or with the iterative bottom-up layout).
</details>

### 5. Explain the iterative (bottom-up) segment tree.

<details><summary>Model answer</summary>

Store leaves at `tree[n..2n-1]` and parents at `tree[i] = merge(tree[2i], tree[2i+1])` for i from n-1 down to 1. A query walks two pointers `lo = l + n`, `hi = r + n + 1` upward: whenever `lo` is a right child, consume it and move right; whenever `hi` is a right boundary of a left child, consume `tree[hi-1]`. Shorter code, no recursion, 2n memory.
</details>

### 6. What is lazy propagation and when is it needed?

<details><summary>Model answer</summary>

When updates cover a whole range (add v to [l, r]), updating every leaf is O(n). Instead, when a node is fully covered, update its summary and store a pending "tag" saying its children still owe this change. Push the tag down only when a later operation needs to go inside that node. Both range updates and range queries become O(log n).
</details>

### 7. How do you build a segment tree over values instead of indices?

<details><summary>Model answer</summary>

Compress the values to ranks 0..m-1, then use a tree where leaf v counts how many times value v has been seen. "How many seen values are < x" becomes a range sum `[0, rank(x)-1]`. This solves Count of Smaller Numbers After Self, Count of Range Sum, and LIS-count problems.
</details>

### 8. Coordinates go up to 10^9. What are your options?

<details><summary>Model answer</summary>

(1) Offline: collect all coordinates first and compress them. (2) Online: a dynamic segment tree that creates children only when visited — O(q log C) nodes. (3) Sometimes a sweep line with a sorted map is simpler (My Calendar III).
</details>

### 9. Segment tree vs Fenwick tree?

<details><summary>Model answer</summary>

Fenwick: shorter code, smaller constant, but only for invertible operations like sum or xor (queries are prefix-based). Segment tree: any associative merge (min, max, gcd, pairs), lazy range updates, descend queries. If the interviewer only needs range sums with point updates, either is fine — say both.
</details>

### 10. How do you find the first index where the prefix sum reaches k?

<details><summary>Model answer</summary>

Descend from the root: if the left child's sum is ≥ k, go left; otherwise subtract the left sum from k and go right. O(log n), versus O(log^2 n) for binary search over prefix queries.
</details>

### 11. What edge cases would you test?

<details><summary>Model answer</summary>

Single-element array, query of length 1, the whole range, updates to the first and last index, negative values, repeated updates to the same index, empty range (l > r → identity), and a random comparison against a plain loop.
</details>

### 12. How would you support "range assign" (set [l, r] to v) plus range sum?

<details><summary>Model answer</summary>

Store a pending assign value plus a flag per node. Applying it to a node sets `sum = v * (hi - lo + 1)` and overwrites any older pending tag (assignment overrides older adds/assigns). Push it down before descending.
</details>
