# Sparse Table — Quiz

Back to the [topic README](../README.md).

**1. (Compute) For n = 10, how many rows does the table have?**

<details><summary>Answer</summary>

`floor(log2 10) + 1 = 3 + 1 = 4` rows (block sizes 1, 2, 4, 8).
</details>

**2. (Compute) For query (2, 8): len, k and the two block starts?**

<details><summary>Answer</summary>

len = 7, k = 2 (block length 4). Blocks start at 2 and at `8 - 4 + 1 = 5`: [2..5] and [5..8].
</details>

**3. (Multiple choice) Which op can use the O(1) overlapping query?**
a) sum  b) product  c) gcd  d) count of evens

<details><summary>Answer</summary>

c) gcd is idempotent: gcd(x, x) = x.
</details>

**4. (Spot the bug)**

```js
const k = Math.floor(Math.log2(r - l));
return Math.min(table[k][l], table[k][r - (1 << k) + 1]);
```

<details><summary>Answer</summary>

The length is `r - l + 1`, not `r - l`. With l = r it computes `log2(0) = -Infinity`.
</details>

**5. (Complexity) Build time and memory?**

<details><summary>Answer</summary>

O(n log n) time and O(n log n) memory.
</details>

**6. (Predict) nums = [4, 6, 1, 5, 7, 3]. What is table[1]? table[2]?**

<details><summary>Answer</summary>

table[1] = [4, 1, 1, 5, 3]; table[2] = [1, 1, 1] (min of [4,6,1,5], [6,1,5,7], [1,5,7,3]).
</details>

**7. (Spot the bug) Row k is allocated with length n and filled for `i < n`.**

<details><summary>Answer</summary>

For i > n - 2^k, `i + 2^(k-1)` points past the end of row k-1 and produces `undefined`/`NaN`. Only `n - 2^k + 1` entries are valid.
</details>

**8. (Multiple choice) The array gets point updates between queries. Best choice?**
a) sparse table  b) segment tree  c) rebuild prefix sums  d) sort

<details><summary>Answer</summary>

b) Updating a sparse table means rebuilding O(n log n) entries.
</details>

**9. (Define the state) In LCA via Euler tour + RMQ, what array is the sparse table built on?**

<details><summary>Answer</summary>

The depths along the Euler tour (storing the node index with each depth so the argmin is known).
</details>

**10. (Complexity) Answering q queries after building?**

<details><summary>Answer</summary>

O(q) total — O(1) each.
</details>

## Mastery checklist

- [ ] I can build the table by hand for a 7-element array.
- [ ] I can code build + O(1) query with an integer log table.
- [ ] I can explain why only idempotent operations work with overlapping blocks.
- [ ] I can compare sparse table, segment tree, Fenwick tree and prefix sums in one sentence each.
- [ ] I know at least two "hidden RMQ" uses (LCA, LCP).
