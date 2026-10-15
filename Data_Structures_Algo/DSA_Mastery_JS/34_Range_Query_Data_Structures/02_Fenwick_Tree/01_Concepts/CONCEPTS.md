# Fenwick Tree (Binary Indexed Tree, BIT)

A **Fenwick tree** is a tiny array trick that gives you **prefix sums with point updates**,
both in O(log n), with about 10 lines of code. Think of a cash register that keeps running
subtotals for "blocks" of receipts: block sizes are powers of two, chosen so that any prefix
"receipts 1..i" can be assembled from at most `log n` blocks, and changing one receipt only
touches the `log n` blocks that contain it.

It answers the question **"what is the sum of nums[0..i] right now?"** while the array is
being updated. Everything else (range sum, counting, order statistics) is built on that.

---

## Prerequisites

- [Bit Manipulation](../../../14_Bit_Manipulation/README.md) — `i & -i` (lowest set bit) is the whole trick.
- [Prefix Sums](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) — a BIT is a prefix-sum array that tolerates updates.
- Coordinate compression ([Sorting](../../../11_Sorting/README.md) + binary search) for counting problems.

**Essential vs Advanced:** point update + prefix/range sum and the "counting BIT over compressed values" pattern are **Essential**. `findKth` (binary lifting), range-update variants and the 2D BIT are **Advanced**.

---

## Why it matters / when to use

- "Prefix sum / range sum" **and** "point update" mixed together (same as a segment tree,
  but a quarter of the code)
- **Counting things seen so far by value**: "how many earlier numbers are smaller than x?"
  (inversions, Count of Smaller Numbers After Self, Reverse Pairs)
- "k-th smallest element currently present" (binary lifting on a counting BIT)
- Online insertion cost problems (Create Sorted Array through Instructions)
- 2D grids with point updates + rectangle sums (2D BIT)

Use a segment tree instead when the operation is not invertible (min / max do not support
`prefix(r) - prefix(l-1)`), or when you need range updates with lazy propagation.
Use a plain prefix-sum array ([Prefix Sums And Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md)) when there are no updates.

---

## How it works

### The lowbit idea

`lowbit(i) = i & -i` is the value of the lowest set bit of `i` (two's complement makes
`-i` flip everything above that bit).

```
i = 12 = 0b1100      -i = ...110100      i & -i = 0b100 = 4
i = 6  = 0b0110      lowbit = 2
i = 7  = 0b0111      lowbit = 1
i = 8  = 0b1000      lowbit = 8
```

The tree is a 1-indexed array `tree[1..n]` where **`tree[i]` stores the sum of the
`lowbit(i)` elements ending at position `i`**:

```
position:    1    2    3    4    5    6    7    8
tree[8] ---> [=======================================]   covers 1..8  (lowbit 8)
tree[4] ---> [=================]                         covers 1..4  (lowbit 4)
tree[2] ---> [=======]                                   covers 1..2
tree[6] -------------------------[=======]               covers 5..6
tree[1] ---> [==]                                        covers 1
tree[3] -------------[==]                                covers 3
tree[5] -----------------------[==]                      covers 5
tree[7] ---------------------------------[==]            covers 7
```

### Query: prefixSum(7) = nums[1..7]

Start at `i = 7`, add `tree[i]`, then **drop the lowest bit** (`i -= lowbit(i)`), repeat until 0.

```
i = 7 (0111)  add tree[7]  (covers 7)      i -> 6
i = 6 (0110)  add tree[6]  (covers 5..6)   i -> 4
i = 4 (0100)  add tree[4]  (covers 1..4)   i -> 0  stop
```
Three blocks `[1..4] + [5..6] + [7]` tile exactly `1..7`. Every step clears one set bit, so
at most `log n` steps.

### Update: nums[3] += 5

Start at `i = 3`, add to `tree[i]`, then move to the **next block that contains position 3**
(`i += lowbit(i)`), repeat while `i <= n`.

```
i = 3 (0011)  tree[3] += 5   i -> 4
i = 4 (0100)  tree[4] += 5   i -> 8
i = 8 (1000)  tree[8] += 5   i -> 16 > n  stop
```
Those are exactly the blocks that cover position 3: `[3]`, `[1..4]`, `[1..8]`.

### The 1-indexed trap

`lowbit(0) = 0`, so index 0 would loop forever (`i += 0`) or never add anything. That is why
the array is **1-indexed**: the public API takes 0-indexed positions and adds 1 internally.
Forgetting the `+ 1` is the number one BIT bug.

### Counting inversions with a BIT

Inversions = pairs `i < j` with `nums[i] > nums[j]`. Sweep from the right with a BIT of
counts indexed by value (compress values to `0..m-1` first):

```
nums = [3, 1, 2]       ranks: 1->0, 2->1, 3->2
i=2 (2): seen smaller = prefixCount(rank 0) = 0; insert rank 1
i=1 (1): seen smaller = prefixCount(-1)     = 0; insert rank 0
i=0 (3): seen smaller = prefixCount(rank 1) = 2; insert rank 2      answer 2  -> (3,1), (3,2)
```

### 2D BIT (mention)

`tree[i][j]` covers a rectangle of rows `(i - lowbit(i), i]` by columns `(j - lowbit(j), j]`.
Update and prefix query nest the 1D loops: O(log R · log C) each. Rectangle sum uses
inclusion–exclusion of four prefix queries. See `FenwickTree2D` in [02_Implementations/fenwick_tree.js](../02_Implementations/fenwick_tree.js).

---

## Pseudocode (Essential)

```
# tree is 1-indexed, size n + 1, all zeros
update(i, delta):            # i is 1-indexed
  while i <= n:
    tree[i] += delta
    i += i & -i              # jump to the next block that covers i

prefixSum(i):                # sum of positions 1..i
  s = 0
  while i > 0:
    s += tree[i]
    i -= i & -i              # drop the lowest set bit
  return s

rangeSum(l, r) = prefixSum(r) - prefixSum(l - 1)
```

---

## Dry run — prefixSum(7) and update(3, +5) with n = 8 (Essential)

| step | operation | i (binary) | i & -i | block added / touched | next i |
|---|---|---|---|---|---|
| 1 | prefixSum(7) | 7 (0111) | 1 | tree[7] = [7..7] | 6 |
| 2 | | 6 (0110) | 2 | tree[6] = [5..6] | 4 |
| 3 | | 4 (0100) | 4 | tree[4] = [1..4] | 0 → stop |
| 4 | update(3, +5) | 3 (0011) | 1 | tree[3] += 5 | 4 |
| 5 | | 4 (0100) | 4 | tree[4] += 5 | 8 |
| 6 | | 8 (1000) | 8 | tree[8] += 5 | 16 > n → stop |

Three blocks [7], [5..6], [1..4] exactly tile [1..7]; three blocks [3], [1..4], [1..8] are exactly the ones containing position 3.

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| build from array | O(n) | O(n) | or n updates = O(n log n) |
| update(i, delta) | O(log n) | O(1) | walk `i += lowbit(i)` |
| prefixSum(i) | O(log n) | O(1) | walk `i -= lowbit(i)` |
| rangeSum(l, r) | O(log n) | O(1) | `prefix(r) - prefix(l-1)`: needs an invertible op |
| findKth(k) | O(log n) | O(1) | binary lifting on a counting BIT |
| 2D update / query | O(log R · log C) | O(R·C) | |

Comparison:

| Structure | Query | Update | Range update | Ops supported | Code size |
|-----------|-------|--------|--------------|---------------|-----------|
| Prefix sum array | O(1) | O(n) | - | invertible (sum, xor) | tiny |
| Fenwick tree | O(log n) | O(log n) | with 2 BITs (add only) | invertible | ~10 lines |
| Segment tree | O(log n) | O(log n) | lazy, O(log n) | any merge (min/max/gcd) | ~40 lines |
| Sparse table | O(1) | - (static) | - | idempotent (min/max/gcd) | ~15 lines |

---

## JavaScript implementation

Full code with randomized tests against a plain loop: [02_Implementations/fenwick_tree.js](../02_Implementations/fenwick_tree.js)
(`FenwickTree` with `update`, `prefixSum`, `rangeSum`, `findKth`, and `FenwickTree2D`).
The core is tiny:

```js
class FenwickTree {
  constructor(n) { this.n = n; this.tree = new Array(n + 1).fill(0); }   // 1-indexed
  update(index, delta) {                       // nums[index] += delta, index 0-indexed
    for (let i = index + 1; i <= this.n; i += i & -i) this.tree[i] += delta;
  }
  prefixSum(index) {                           // sum of nums[0..index]
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += this.tree[i];
    return sum;
  }
  rangeSum(left, right) { return this.prefixSum(right) - this.prefixSum(left - 1); }
}
```

Remember: `update` takes a **delta**, not a new value. To "set `nums[i] = v`" keep a copy of
the current values and add `v - nums[i]`.

---

## Patterns / variations

### 1. Range sum with point updates

```js
const bit = new FenwickTree(nums.length);
nums.forEach((v, i) => bit.update(i, v));
bit.rangeSum(2, 5);          // sum of nums[2..5]
bit.update(3, 10 - nums[3]); // set nums[3] = 10
```

### 2. Counting BIT over compressed values ("how many seen are < x")

```js
const sorted = [...new Set(nums)].sort((a, b) => a - b);
const rank = new Map(sorted.map((v, i) => [v, i]));
const bit = new FenwickTree(sorted.length);
for (let i = nums.length - 1; i >= 0; i--) {      // sweep from the right
  const r = rank.get(nums[i]);
  counts[i] = bit.prefixSum(r - 1);               // seen values with smaller rank
  bit.update(r, 1);
}
```
Use when: inversions, smaller-after-self, reverse pairs (compress `v` and `2v` together),
count of range sum (compress prefix sums).

### 3. k-th element (binary lifting)

```js
findKth(k) {                       // smallest position with prefixSum >= k
  let pos = 0, step = 1 << Math.floor(Math.log2(this.n));
  for (; step > 0; step >>= 1) {
    if (pos + step <= this.n && this.tree[pos + step] < k) { pos += step; k -= this.tree[pos]; }
  }
  return pos;                      // 0-indexed answer
}
```
Use when: "remove the k-th remaining element" (Josephus-style), order statistics.

### 4. Range update + point query (difference array in a BIT)

Store the **difference array** in the BIT: to add `v` on `[l, r]` do `update(l, v)` and
`update(r + 1, -v)`; a point query is `prefixSum(i)`. For range update + range sum you need
two BITs (a well-known formula) - at that point a lazy segment tree is clearer.

### 5. 2D BIT

Point update + rectangle sum on a grid (Range Sum Query 2D - Mutable, LC 308).

---

## Alternatives and trade-offs

| Approach | Update | Query | Code size | Notes |
|---|---|---|---|---|
| Plain array + loop | O(1) | O(n) | tiny | fine for few queries |
| Prefix-sum array | O(n) | O(1) | tiny | static data only |
| **Fenwick tree** | O(log n) | O(log n) | ~10 lines | sums, counts, anything invertible (`+`/`-`, xor) |
| Segment tree | O(log n) | O(log n) | ~40 lines | also min/max/gcd/custom merges and lazy range updates |
| Merge sort counting | — | O(n log n) total | medium | offline inversion-style counts without a BIT |
| Sorted list + bisect | O(√n) or O(log n) | O(log n) | medium | when you also need the actual neighbours |

---

## When this does NOT apply

- The operation has **no inverse** (min, max, gcd): `rangeSum(l, r) = prefix(r) - prefix(l-1)` needs subtraction. Use a [segment tree](../../01_Segment_Tree/README.md) or a [sparse table](../../03_Sparse_Table/README.md).
- You need **range assign** ("set all of [l, r] to v") — use a lazy segment tree.
- The array is static — a plain prefix-sum array is simpler and O(1).
- Values are huge and unknown in advance (online, no compression possible) — use a dynamic segment tree or a balanced BST.

---

## Common mistakes & edge cases

- **Forgetting the 1-index shift**: `i = index + 1` in both loops. Index 0 has `lowbit 0`.
- Loop bounds: update goes **up** while `i <= n`; query goes **down** while `i > 0`.
- `prefixSum(-1)` must return 0 (loop starts at `i = 0` and does nothing) so that
  `rangeSum(0, r)` works.
- Using a BIT for **min/max**: `prefix(r) - prefix(l-1)` does not exist for min. Use a segment
  tree (a BIT can do prefix-min only if values never decrease).
- **Passing a value instead of a delta** to `update`.
- Compression: remember to include every value you will query (e.g. `2 * v` in Reverse Pairs).
- Large answers: use `% 1e9+7` when the problem asks, and remember sums up to ~2^53 are exact
  in JS doubles.

---

## Interview tips

- Lead with: *"A Fenwick tree gives O(log n) prefix sums and point updates with ~10 lines;
  I'd pick it over a segment tree when I only need sums/counts."*
- Draw the lowbit table for 1..8 - it convinces the interviewer you understand the covering
  blocks, not just memorised the loops.
- For counting problems, say *"index the BIT by value after coordinate compression, sweep
  from one side, and ask how many seen values are smaller"*.
- State the limitation out loud: invertible operations only (sum, xor, count), no min/max.
- If asked for range updates, mention the difference-array trick and that two BITs handle
  range-add/range-sum, but a lazy segment tree is the clearer tool.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Range Sum Query - Mutable (BIT) | Medium | prefix sums + point updates | 03_Problems/solutions/01_range_sum_query_mutable_bit.js |
| 02 | Count of Smaller Numbers After Self | Hard | counting BIT over values, sweep right to left | 03_Problems/solutions/02_count_of_smaller_numbers_after_self.js |
| 03 | Reverse Pairs | Hard | compress v and 2v together, counting BIT | 03_Problems/solutions/03_reverse_pairs.js |
| 04 | Create Sorted Array through Instructions | Hard | counting BIT, smaller & greater per insert | 03_Problems/solutions/04_create_sorted_array_through_instructions.js |
| 05 | Count Good Triplets in an Array | Hard | positions mapping + left/right counts | 03_Problems/solutions/05_count_good_triplets_in_an_array.js |

---

## Practice more

Medium: Range Sum Query - Mutable (307), Range Sum Query 2D - Mutable (308),
Queries on a Permutation With Key (1409), Number of Pairs Satisfying Inequality (2426),
Longest Increasing Subsequence (300, BIT version), Minimum Number of Operations to Make Array
Sorted style counting, Count Number of Teams (1395)

Hard: Count of Smaller Numbers After Self (315), Count of Range Sum (327), Reverse Pairs (493),
Create Sorted Array through Instructions (1649), Count Good Triplets in an Array (2179),
Number of Pairs Satisfying Inequality (2426), Maximum Sum Queries (2736),
Increasing Subsequences counting, Kth Smallest Instructions / Josephus with BIT
