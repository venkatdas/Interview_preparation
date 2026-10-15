# Sparse Table & Range Minimum Query (RMQ)

A **sparse table** precomputes the answer for every block of length 1, 2, 4, 8, ... starting
at every index. After that, **any** range-min (or max, gcd, ...) query on a **static** array is
answered in **O(1)** by looking at just two overlapping blocks. Think of a mountain guide who
has memorised the lowest point of every 1-km, 2-km, 4-km, ... stretch of a trail: to find the
lowest point between km 5 and km 12 she only needs two 8-km stretches (5–13 and 4–12), and it
doesn't matter that they overlap.

It answers the question **"what is min/max of nums[l..r]?"** when the array never changes.

---

## Prerequisites

- [Prefix Sums](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) — the same "precompute, then answer in O(1)" idea.
- [Bit Manipulation](../../../14_Bit_Manipulation/README.md) — powers of two and `floor(log2 x)`.
- [Segment Tree](../../01_Segment_Tree/README.md) — the dynamic alternative.

**Essential vs Advanced:** the idempotent O(1) range-min/max query is **Essential** to know (and to code if asked). Disjoint O(log n) queries for non-idempotent ops, LCP via RMQ and LCA via Euler tour + RMQ are **Advanced**.

---

## Why it matters / when to use

- Many range-min / range-max queries on an array that **does not change** ("offline", "static")
- Sliding window max as an alternative to the deque (and it also handles windows of
  *different* sizes)
- Lowest common ancestor via Euler tour + RMQ ([Classic Techniques](../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/README.md))
- Longest common prefix of two suffixes = range-min over the LCP array
- Any **idempotent** operation: min, max, gcd, bitwise and/or, "is sorted" flags

Signals that you should **not** use it: updates between queries (→ segment tree
[Segment Tree](../../01_Segment_Tree/README.md)), sum queries (→ prefix sums [Prefix Sums And Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md), or Fenwick
[Fenwick Tree](../../02_Fenwick_Tree/README.md) if mutable).

---

## How it works

`table[k][i]` = op over the `2^k` elements starting at `i`, i.e. `nums[i .. i + 2^k - 1]`.

```
nums     = [5, 2, 8, 6, 3, 1, 7]          index:   0  1  2  3  4  5  6

table[0] = [5, 2, 8, 6, 3, 1, 7]          blocks of 1
table[1] = [2, 2, 6, 3, 1, 1]             blocks of 2: min(nums[i], nums[i+1])
table[2] = [2, 2, 1, 1]                   blocks of 4: min(table[1][i], table[1][i+2])
                                          (no blocks of 8 fit in 7 elements)
```

**Build**: each row is made from the previous one: `table[k][i] = op(table[k-1][i],
table[k-1][i + 2^(k-1)])` - two half blocks. `log n` rows × `n` entries = O(n log n).

**Query `[l, r]`**: let `len = r - l + 1` and `k = floor(log2 len)`. Take the block of
length `2^k` that **starts at l** and the one that **ends at r**:

```
query(1, 5): len = 5, k = 2 (block length 4)

index:      0   1   2   3   4   5   6
            5   2   8   6   3   1   7
                [---------------]           table[2][1] = min(2,8,6,3) = 2
                    [---------------]       table[2][2] = min(8,6,3,1) = 1
                                            overlap on 8,6,3 - harmless for min
answer = min(2, 1) = 1
```

### Why only idempotent operations?

The two blocks overlap. `min(a, b, b, c)` is still `min(a, b, c)`, so counting `b` twice is
fine. `sum` would count the overlap twice and be wrong. If you need sum you must use
**disjoint** blocks: walk the binary representation of `len` and take one block per set bit -
that is O(log n), not O(1) (see `queryDisjoint` in [02_Implementations/sparse_table.js](../02_Implementations/sparse_table.js)). At that point a
prefix-sum array is simpler.

### Computing `floor(log2 len)` fast

Precompute `log[1..n]` with `log[i] = log[i >> 1] + 1`. Avoid `Math.log2` in the hot path
(floating point can land on `2.9999999` for exact powers of two).

---

## Pseudocode (Essential)

```
build(a):
  log[1] = 0; for x in 2..n: log[x] = log[x / 2] + 1
  table[0] = a
  for k in 1..log[n]:
    for i in 0..n - 2^k:
      table[k][i] = op(table[k-1][i], table[k-1][i + 2^(k-1)])

query(l, r):                     # op must be idempotent (min, max, gcd, and, or)
  k = log[r - l + 1]
  return op(table[k][l], table[k][r - 2^k + 1])
```

---

## Dry run — queries on nums = [5, 2, 8, 6, 3, 1, 7] (Essential)

| query | len | k = log[len] | block 1 | block 2 | answer |
|---|---|---|---|---|---|
| (0, 6) | 7 | 2 | table[2][0] = min(5,2,8,6) = 2 | table[2][3] = min(6,3,1,7) = 1 | **1** |
| (2, 4) | 3 | 1 | table[1][2] = min(8,6) = 6 | table[1][3] = min(6,3) = 3 | **3** |
| (3, 3) | 1 | 0 | table[0][3] = 6 | table[0][3] = 6 | **6** |
| (1, 2) | 2 | 1 | table[1][1] = min(2,8) = 2 | table[1][1] = 2 | **2** |

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| build | O(n log n) | O(n log n) | `log n` rows |
| query (idempotent op) | O(1) | - | two overlapping blocks |
| query (any associative op) | O(log n) | - | disjoint blocks |
| update | not supported | - | rebuild = O(n log n) |

Comparison for range queries:

| Structure | Build | Query | Update | Ops | Best for |
|-----------|-------|-------|--------|-----|----------|
| Prefix sum | O(n) | O(1) | O(n) | invertible (sum, xor) | static sums |
| Sparse table | O(n log n) | O(1) | none | idempotent (min, max, gcd) | static min/max, many queries |
| Fenwick tree | O(n) | O(log n) | O(log n) | invertible | mutable sums/counts |
| Segment tree | O(n) | O(log n) | O(log n) | any merge | mutable anything, range updates |
| Monotonic deque | O(n) total | O(1) amortized | - | min/max | fixed-size sliding windows |

---

## JavaScript implementation

Full code with randomized tests against a plain loop (min, max, gcd, and disjoint sum):
[02_Implementations/sparse_table.js](../02_Implementations/sparse_table.js). Core:

```js
class SparseTable {
  constructor(values, op = Math.min) {
    this.n = values.length; this.op = op;
    this.log = new Array(this.n + 1).fill(0);
    for (let i = 2; i <= this.n; i++) this.log[i] = this.log[i >> 1] + 1;
    this.table = [values.slice()];
    for (let k = 1; (1 << k) <= this.n; k++) {
      const prev = this.table[k - 1], half = 1 << (k - 1), row = [];
      for (let i = 0; i + (1 << k) <= this.n; i++) row.push(op(prev[i], prev[i + half]));
      this.table.push(row);
    }
  }
  query(l, r) {                                   // inclusive, O(1)
    const k = this.log[r - l + 1];
    return this.op(this.table[k][l], this.table[k][r - (1 << k) + 1]);
  }
}
```

---

## Patterns / variations

### 1. Static RMQ (min / max / gcd)

```js
const st = new SparseTable(nums, Math.max);
st.query(l, r);                                   // O(1)
```
Use when: many queries, no updates.

### 2. Fixed-size windows share one level

```js
const level = Math.floor(Math.log2(k));          // all windows have length k
answer[i] = Math.max(table[level][i], table[level][i + k - (1 << level)]);
```
Use when: Sliding Window Maximum. (Deque is O(n) and uses O(k) space; sparse table is
O(n log n) but trivially correct.)

### 3. LCP of suffixes = range-min over the LCP array

Build suffix array → LCP array (Kasai) → sparse table over it. `lcp(i, j)` becomes
`min(lcp[rank[i]+1 .. rank[j]])`. Used in `03_Problems/solutions/03_longest_common_prefix_of_ranges.js`.

### 4. LCA via Euler tour + RMQ

Write down nodes in DFS order with their depth (Euler tour, length `2n-1`). The LCA of `u`
and `v` is the node with minimum depth between their first occurrences → sparse table query.

### 5. Binary search on the answer + RMQ check

"Longest subarray where max - min <= limit": sparse tables for max and min make each
check O(1), total O(n log n).

---

## Alternatives and trade-offs

| Approach | Build | Query | Update | Use when |
|---|---|---|---|---|
| Loop per query | — | O(n) | O(1) | few queries |
| **Sparse table** | O(n log n) | O(1) | rebuild O(n log n) | static array, many min/max/gcd queries |
| Segment tree | O(n) | O(log n) | O(log n) | array changes, or op is not idempotent |
| Monotonic deque | — | O(n) total | — | all windows have the same size (sliding window max) |
| Prefix sums | O(n) | O(1) | O(n) | sums on static data |

---

## When this does NOT apply

- The array is **updated** between queries — rebuilding is O(n log n); use a [segment tree](../../01_Segment_Tree/README.md).
- The operation is **not idempotent** (sum, product, count) — overlapping blocks double count; use prefix sums or `queryDisjoint` in O(log n).
- Memory is tight and n is very large (n log n numbers) — a segment tree uses O(n).
- Every window has the same length — a [monotonic deque](../../../18_Monotonic_Stacks_And_Queues/README.md) is O(n) total with O(k) memory.

---

## Common mistakes & edge cases

- Using `query` with a **non-idempotent** op (sum, product, count) - silently wrong.
- Off-by-one in the second block: it starts at `r - 2^k + 1`, not `r - 2^k`.
- Building rows that are too long: row `k` has only `n - 2^k + 1` entries.
- Floating point `Math.log2`: use the precomputed `log` table.
- Forgetting that there are **no updates**: if the problem has updates, say "segment tree"
  immediately.
- `n = 1`: there is only `table[0]`; `log[1] = 0`.

---

## Interview tips

- One-liner: *"Precompute min of every power-of-two block, answer any range in O(1) with two
  overlapping blocks; works because min is idempotent."*
- Draw `table[1]` and `table[2]` for a 7-element array and show one query - it takes
  30 seconds and proves you understand it.
- Immediately contrast: *"If the array changed I'd use a segment tree instead."*
- For Sliding Window Maximum, give the deque first (expected answer), mention sparse table
  as an alternative that handles arbitrary ranges.
- Know the memory cost: `n log n` numbers (for `n = 10^5` that's ~1.7 million entries, fine).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Range Minimum Queries (offline, static) | Medium | sparse table O(1) RMQ | 03_Problems/solutions/01_range_min_queries_offline.js |
| 02 | Sliding Window Maximum (sparse table) | Hard | fixed-size windows share one level | 03_Problems/solutions/02_sliding_window_maximum_sparse_table.js |
| 03 | Longest Common Prefix of two suffixes | Hard | suffix array + LCP array + RMQ | 03_Problems/solutions/03_longest_common_prefix_of_ranges.js |

---

## Practice more

Medium: Sliding Window Maximum (239), Longest Continuous Subarray With Absolute Diff <= Limit (1438),
Minimum Size Subarray Sum with max constraint, Number of Subarrays with Bounded Maximum (795),
Count Subarrays With Fixed Bounds (2444), Longest Repeating Substring (1062, suffix array version),
Lowest Common Ancestor of a Binary Tree (236, Euler tour + RMQ version)

Hard: Longest Duplicate Substring (1044), Number of Distinct Substrings in a String (1698),
Sum of Subarray Minimums (907, RMQ + divide), Maximum of Minimum Values in All Subarrays (1950),
Kth Ancestor of a Tree Node (1483), Range GCD queries (classic), Static Range Sum / Min (CSES)
