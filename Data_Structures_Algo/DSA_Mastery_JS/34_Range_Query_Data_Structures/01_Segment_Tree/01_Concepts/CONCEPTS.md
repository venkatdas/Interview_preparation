# Segment Tree

A **segment tree** is a binary tree built on top of an array where every node stores a
summary (sum, min, max, ...) of a **contiguous slice** of the array. The root summarises the
whole array, its two children summarise the two halves, and so on down to leaves that hold
single elements. Think of a company org chart where every manager knows the total sales of
everyone below them: to get the sales of "teams 3 to 7" you ask a few managers instead of
every single employee, and when one employee's number changes only their chain of managers
needs an update.

It answers the question: **"what is f(nums[l..r]) right now?"** while the array keeps changing.

---

## Prerequisites

- [Prefix Sums](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) — the static version of "range sum"; know why it fails when values change.
- [Trees](../../../20_Trees) — recursion on left / right children.
- [Divide and Conquer](../../../30_Divide_And_Conquer/README.md) — a segment tree is divide and conquer that remembers its answers.

**Essential vs Advanced:** point update + range query with a generic merge is **Essential** (it is the go-to answer for "range query with updates"). Lazy propagation, trees over values, dynamic (sparse) trees and descend queries are **Advanced**.

---

## Why it matters / when to use

Reach for a segment tree when a problem has these signals:

- "Range sum / min / max / gcd of `nums[l..r]`" **and** "update `nums[i]`" are mixed together
- Prefix sums ([Prefix Sums And Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md)) would work, except the array is mutable
- "After each operation, report the maximum/sum so far" (online queries)
- Counting "how many values in a value range have we seen" (index the tree by **value**, not position)
- Range updates ("add 5 to every element in `[l, r]`") → segment tree **with lazy propagation**
- Coordinates up to 10^9 → **coordinate compression** first, then a tree over the compressed indices

If the array never changes, prefer a prefix sum (sum) or a sparse table
([Sparse Table](../../03_Sparse_Table/README.md)) for min/max. If you only need prefix sums with point updates,
a Fenwick tree ([Fenwick Tree](../../02_Fenwick_Tree/README.md)) is shorter.

---

## How it works

Array `nums = [5, 2, 8, 6, 3, 1, 7, 4]` and a **sum** tree. Each node shows `[range] = sum`.

```
                        [0..7] = 36
                 /                         \
          [0..3] = 21                   [4..7] = 15
         /          \                  /          \
    [0..1]=7     [2..3]=14        [4..5]=4      [6..7]=11
    /    \       /     \          /    \        /     \
  [0]=5 [1]=2  [2]=8  [3]=6    [4]=3  [5]=1  [6]=7  [7]=4
```

**Query** `sum(2..5)`: start at the root. The root range `[0..7]` is only partly inside `[2..5]`,
so ask both children. `[0..3]` is partial → ask `[0..1]` (completely outside → contributes
identity 0) and `[2..3]` (**completely inside** → return its stored 14, do not go deeper).
`[4..7]` is partial → `[4..5]` is inside → 4; `[6..7]` outside → 0. Answer `14 + 4 = 18`.
Only a handful of nodes were visited, never more than about `4·log n`.

**Update** `nums[5] = 10`: change leaf `[5]` to 10, then walk up fixing each ancestor:
`[4..5] = 13`, `[4..7] = 24`, `[0..7] = 45`. That is exactly `log n + 1` nodes.

### Three rules a node obeys during a query

```
node range completely OUTSIDE [l, r]  -> return identity (0 for sum, +Inf for min)
node range completely INSIDE  [l, r]  -> return the stored value, stop
otherwise (partial overlap)           -> merge(query(left child), query(right child))
```

### Two ways to store the tree

**Recursive (top-down)**: node `i` has children `2i+1` and `2i+2`, allocate `4n` slots so any
`n` fits. Easiest to extend with lazy tags, pairs, custom merges.

**Iterative (bottom-up)**: array of size `2n`, leaves at `n..2n-1`, parent of `i` is `i >> 1`.
About 15 lines, very fast, no recursion. Works for any `n`, not only powers of two.

```
n = 5, nums = [a b c d e]       tree index:  1   2   3   4   5   6   7   8   9
                                  content:  root  .   .   .   a   b   c   d   e
                                                            ^ leaves start at n = 5
```

### Lazy propagation (range updates)

Problem: "add +3 to every element in `[2..5]`" would touch 4 leaves and all their ancestors,
O(n) in the worst case. Fix: when a node's range is **completely inside** the update range,
record the pending change on the node as a **lazy tag** and stop. Children are only fixed
later, when someone actually needs to look at them.

```
rangeAdd(2..5, +3) on the tree above:

                        [0..7] sum += 4*3 = 48        (fixed on the way back up)
                 /                         \
          [0..3] sum=27                 [4..7] sum=21
         /          \                  /          \
    [0..1]=7     [2..3]=20 lazy=+3  [4..5]=10 lazy=+3   [6..7]=11
                   ^ covered: add 3 * (2 elements), tag it, DO NOT descend
                   (leaves [2] and [3] still say 8 and 6 - they are "stale but tagged")

later, query(3..3) walks into [2..3]:
    first PUSH DOWN: [2] = 8+3 = 11, [3] = 6+3 = 9, both children get lazy=+3 (they're leaves,
    nothing below), then clear [2..3].lazy. Now answer from [3] = 9.
```

The invariant: **a node's stored value is always correct for its own range; only its
descendants may be stale, and the tag says how to repair them.**

---

## Pseudocode (Essential)

```
build(node, lo, hi):
  if lo == hi: tree[node] = a[lo]; return
  mid = (lo + hi) / 2
  build(2node+1, lo, mid); build(2node+2, mid+1, hi)
  tree[node] = merge(tree[2node+1], tree[2node+2])

update(node, lo, hi, i, v):
  if lo == hi: tree[node] = v; return
  go into the half that contains i
  tree[node] = merge(children)                 # fix on the way back up

query(node, lo, hi, l, r):
  if r < lo or hi < l: return IDENTITY         # no overlap
  if l <= lo and hi <= r: return tree[node]    # full overlap
  return merge(query(left half), query(right half))   # partial overlap
```

---

## Dry run — sum query(1, 3) on [1, 3, 5, 7] (Essential)

Tree: node0 = [0..3] = 16, node1 = [0..1] = 4, node2 = [2..3] = 12, leaves node3..node6 = 1, 3, 5, 7.

| call | node covers | relation to [1,3] | returns |
|---|---|---|---|
| query(node0, 0, 3) | [0..3] | partial → recurse | 3 + 12 = **15** |
| query(node1, 0, 1) | [0..1] | partial → recurse | 0 + 3 = 3 |
| query(node3, 0, 0) | [0..0] | no overlap | 0 (identity) |
| query(node4, 1, 1) | [1..1] | full | 3 |
| query(node2, 2, 3) | [2..3] | full | 12 |

Five node visits instead of reading three array cells — small here, but at n = 10^5 it is about 4 log n ≈ 70 visits instead of up to 10^5.

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| build | O(n) | O(n) | 2n (iterative) or 4n (recursive) slots |
| point update | O(log n) | O(1) | leaf + its ancestors |
| range query | O(log n) | O(1) | at most ~4 log n nodes visited |
| range update (lazy) | O(log n) | O(n) extra | one extra `lazy` array |
| range update (no lazy) | O(n) | - | why lazy exists |
| k-th / first index where ... | O(log n) | - | "descend" queries, see patterns |

Compare: prefix sum = O(1) query / O(n) update; plain array = O(n) query / O(1) update.
Segment tree balances both at O(log n).

---

## JavaScript implementation

Full code with randomized tests against a plain loop: [02_Implementations/segment_tree.js](../02_Implementations/segment_tree.js)
(`SegmentTree` recursive, `IterativeSegmentTree`, `LazySegmentTree`). The iterative core:

```js
class IterativeSegmentTree {
  constructor(values, merge = (a, b) => a + b, identity = 0) {
    this.n = values.length; this.merge = merge; this.identity = identity;
    this.tree = new Array(2 * this.n).fill(identity);
    for (let i = 0; i < this.n; i++) this.tree[this.n + i] = values[i];        // leaves
    for (let i = this.n - 1; i >= 1; i--) this.tree[i] = merge(this.tree[2*i], this.tree[2*i+1]);
  }
  update(index, value) {
    let i = index + this.n; this.tree[i] = value;
    while (i > 1) { i >>= 1; this.tree[i] = this.merge(this.tree[2*i], this.tree[2*i+1]); }
  }
  query(l, r) {                     // inclusive
    let resL = this.identity, resR = this.identity;
    for (let lo = l + this.n, hi = r + this.n + 1; lo < hi; lo >>= 1, hi >>= 1) {
      if (lo & 1) resL = this.merge(resL, this.tree[lo++]);  // lo is a right child
      if (hi & 1) resR = this.merge(this.tree[--hi], resR);  // hi-1 is a left child
    }
    return this.merge(resL, resR);
  }
}
```

Passing `merge` and `identity` makes one class serve sum (`+`, 0), min (`Math.min`, `Infinity`),
max (`Math.max`, `-Infinity`), gcd (`gcd`, 0), or even pairs like `(length, count)`.

---

## Patterns / variations

### 1. Generic merge (sum / min / max / pairs)

```js
const sumTree = new IterativeSegmentTree(nums);                         // sum
const minTree = new IterativeSegmentTree(nums, Math.min, Infinity);     // min
// pair merge: longest increasing subsequence length + how many of them
const merge = (a, b) => a.len > b.len ? a : b.len > a.len ? b : { len: a.len, cnt: a.cnt + b.cnt };
```
Use when: the problem combines two numbers per node (best + count, max + second max,
max subarray sum needs `{sum, bestPrefix, bestSuffix, best}`).

### 2. Tree over VALUES (counting / order statistics)

```js
// "how many earlier numbers are smaller than x?"
const sorted = [...new Set(nums)].sort((a, b) => a - b);          // coordinate compression
const idx = new Map(sorted.map((v, i) => [v, i]));
const tree = new IterativeSegmentTree(new Array(sorted.length).fill(0));
for (const x of nums) {
  const smaller = tree.query(0, idx.get(x) - 1);                  // count of seen values < x
  tree.update(idx.get(x), tree.query(idx.get(x), idx.get(x)) + 1); // insert x
}
```
Use when: counting inversions, Count of Smaller Numbers After Self, Count of Range Sum.
(A Fenwick tree is the usual tool here - same idea, shorter code.)

### 3. Lazy propagation (range add / range assign)

```js
// node fully covered by the update -> tag it, do not descend
if (l <= lo && hi <= r) { sum[node] += delta * (hi - lo + 1); lazy[node] += delta; return; }
pushDown(node, lo, hi);  // ALWAYS before touching children
```
Use when: "add v to [l, r]", "set [l, r] to v" (store the pending value + a flag), My Calendar III,
Falling Squares, painting / booking intervals.

### 4. Dynamic (sparse) segment tree

Create child nodes only when touched. Lets you build a tree over `[0, 1e9)` with O(q log C)
memory. Used in `03_Problems/solutions/04_my_calendar_iii.js`. Alternative: coordinate compression when
all queries are known up front (offline).

### 5. Descend queries ("first index where prefix sum >= k")

Walk from the root: if the left child's sum >= k go left, else subtract it and go right.
O(log n). Used for "k-th one" / order statistics on a counting tree.

---

## Alternatives and trade-offs

| Need | Best tool | Why not a segment tree? |
|---|---|---|
| Range sum, array never changes | [prefix sums](../../../08_Prefix_Sums_And_Difference_Arrays/README.md), O(1) query | overkill |
| Range min/max, array never changes | [sparse table](../../03_Sparse_Table/README.md), O(1) query | segment tree is O(log n) per query |
| Prefix sums / counts with point updates | [Fenwick tree](../../02_Fenwick_Tree/README.md) | Fenwick is ~10 lines and has a smaller constant |
| Range min/max/gcd/custom merge with updates | **segment tree** | — |
| Range add + range sum/min | **lazy segment tree** (or two Fenwick trees for sum) | — |
| Few queries, small n (≤ 10^3) | plain loop, O(n) per query | simpler to write and debug |

---

## When this does NOT apply

- The query is not **decomposable**: you cannot combine answers of two halves (e.g. "median of a range", "mode of a range") — use offline tricks (Mo's algorithm) or other structures.
- Ranges are not **contiguous** in index order (e.g. "all nodes in a subtree") — first flatten with an Euler tour, then a segment tree applies.
- Only one or two queries are asked — a plain loop wins.
- Coordinates are huge (10^9) and you did not compress or use a dynamic tree — memory blows up.

---

## Common mistakes & edge cases

- **Off-by-one on ranges.** Decide once: closed `[l, r]` (this folder) or half-open `[l, r)`.
  The iterative query converts to half-open internally (`hi = r + n + 1`).
- Using an **identity that breaks the merge**: min needs `Infinity`, max needs `-Infinity`, gcd
  needs 0. Returning `0` for an empty min range is a classic bug.
- **Lazy: forgetting to push down** before recursing into children, or forgetting to recompute
  the parent after children change.
- **Range assign vs range add** are different tags; assign overrides any pending add.
- **Edge-touching intervals**: for `[start, end)` bookings update `end - 1`, not `end`
  (Falling Squares, My Calendar III).
- **Coordinate compression**: compress every coordinate you will query, including `right - 1`.
- Recursion depth is fine (`log n` levels), but allocate `4n` for the recursive layout; `2n` is
  only safe for the iterative layout.

---

## Interview tips

- Say the key sentence first: *"A segment tree gives O(log n) for both range query and point
  update; prefix sums would make updates O(n)."*
- Name the three query cases (outside / inside / partial) out loud; that is the whole algorithm.
- Mention `merge` + `identity` and that the same code does sum/min/max.
- If asked about range updates, explain lazy tags in one line: *"tag a fully covered node, push
  the tag to children only when a later operation needs to look inside."*
- Know when a simpler tool wins: Fenwick for prefix sums with updates, sparse table for static
  RMQ, monotonic deque for sliding window max.
- Interviewers rarely want the full implementation typed out; a correct iterative version
  (~20 lines) is a strong signal if you can write it fast.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Range Sum Query - Mutable | Medium | point update + range sum | 03_Problems/solutions/01_range_sum_query_mutable.js |
| 02 | Range Minimum Query with updates | Medium | generic merge (min) | 03_Problems/solutions/02_range_minimum_query.js |
| 03 | Falling Squares | Hard | coordinate compression + lazy range-assign/max | 03_Problems/solutions/03_falling_squares.js |
| 04 | My Calendar III | Hard | sweep line vs dynamic tree with lazy range-add | 03_Problems/solutions/04_my_calendar_iii.js |
| 05 | Number of Longest Increasing Subsequence | Medium | tree over values with (length, count) pairs | 03_Problems/solutions/05_number_of_longest_increasing_subsequence.js |
| 06 | Count of Range Sum | Hard | prefix sums + counting tree over values | 03_Problems/solutions/06_count_of_range_sum.js |

---

## Practice more

Medium: Range Sum Query - Mutable (307), Count of Smaller Numbers After Self (315),
Longest Increasing Subsequence (300, segment tree version), Queue Reconstruction by Height (406),
Range Addition (370), Maximum Sum Queries style problems, Longest Substring of One Repeating
Character (2213), Number of Visible People in a Queue (1944)

Hard: Count of Range Sum (327), Reverse Pairs (493), Falling Squares (699), My Calendar III (732),
Rectangle Area II (850), Range Module (715), Create Sorted Array through Instructions (1649),
Count Good Triplets in an Array (2179), Booking Concert Tickets in Groups (2286),
Maximum Segment Sum After Removals (2382)
