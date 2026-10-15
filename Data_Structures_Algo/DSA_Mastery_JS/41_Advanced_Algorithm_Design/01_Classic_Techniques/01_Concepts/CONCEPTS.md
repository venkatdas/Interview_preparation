# Classic Techniques

This folder is a toolbox of named tricks that are each "one idea long" but show up again and
again: Kadane, Boyer-Moore voting, Floyd's cycle finding on arrays, the Dutch national flag,
reservoir sampling, Fisher-Yates, quickselect, meet-in-the-middle, two heaps, cyclic sort,
prefix/suffix decomposition, sqrt decomposition and binary lifting. Think of them as the
cooking techniques (braise, deglaze, fold) rather than recipes: once you know them you
recognise them inside bigger problems.

Each section: what it does, why it works, a snippet, and when to use it. Runnable versions
with randomized tests are in [classic_techniques.js](../02_Implementations/classic_techniques.js).

---

## Prerequisites

- [Arrays](../../../03_Arrays/README.md) and [Two Pointers](../../../06_Two_Pointers/README.md) — most tricks here are single-pass array scans.
- [Linked Lists](../../../15_Linked_Lists/README.md) — Floyd's cycle detection.
- [Heaps](../../../19_Heaps_And_Priority_Queues/README.md) — two heaps.
- [Trees](../../../20_Trees) — binary lifting and Euler tours.
- [Sorting](../../../11_Sorting/README.md) and [Searching](../../../10_Searching/README.md) — quickselect, meet in the middle.

**Essential vs Advanced:** sections 1–7, 10 and 11 (Kadane, Boyer-Moore, Floyd, Dutch flag, reservoir sampling, Fisher-Yates, quickselect, cyclic sort, prefix-suffix) are **Essential**. Sections 8, 12, 13, 14 (meet in the middle, sqrt decomposition, binary lifting, Euler tour) are **Advanced**.

---

## Why it matters / when to use

- "O(1) extra space" + "find the duplicate / majority / missing number" → voting, Floyd, cyclic sort
- "Random", "stream of unknown length", "uniformly" → reservoir sampling, Fisher-Yates
- "k-th largest/smallest" without sorting → quickselect (expected O(n))
- `n <= 40` with subsets → meet in the middle (2^20 per half)
- "k-th ancestor", "LCA with many queries" → binary lifting
- "Range query + point update, keep it simple" → sqrt decomposition
- "Running median" → two heaps; "product except self" → prefix/suffix arrays

---

## How it works

### 1. Kadane (maximum subarray sum) — O(n)

```js
let bestEndingHere = nums[0], best = nums[0];
for (let i = 1; i < nums.length; i++) {
  bestEndingHere = Math.max(nums[i], bestEndingHere + nums[i]);   // extend or restart
  best = Math.max(best, bestEndingHere);
}
```
Why: the best subarray ending at `i` either extends the best one ending at `i-1` or starts
fresh - a negative prefix never helps. Use when: Maximum Subarray, maximum circular
subarray (total - minimum subarray), best time to buy/sell stock (on differences).

### 2. Boyer-Moore majority vote — O(n), O(1)

```js
let candidate = null, count = 0;
for (const x of nums) { if (count === 0) candidate = x; count += x === candidate ? 1 : -1; }
```
Why: pair each element with a *different* element and throw both away; an element with
more than n/2 copies cannot be fully cancelled. **k = n/3 version**: at most `k - 1 = 2`
elements can exceed n/3, so keep 2 candidate slots; a non-matching element decrements
**both** (cancels 3 distinct values at once). Survivors are candidates only - **verify** with
a counting pass. Use when: Majority Element I/II, "appears more than n/k times".

### 3. Floyd's tortoise & hare on an array — O(n), O(1)

```
nums = [1, 3, 4, 2, 2]   treat i -> nums[i] as a pointer:   1 -> 3 -> 2 -> 4 -> 2 -> 4 ...
                                                            tail: 1, 3   cycle: 2 <-> 4
the duplicate value is the node two edges point INTO = the cycle entrance = 2
```
Phase 1: slow ×1, fast ×2 until they meet. Phase 2: restart slow at the beginning, move both
×1; they meet at the entrance. Use when: Find the Duplicate Number, Linked List Cycle II,
"happy number" style iterations.

### 4. Dutch national flag — O(n), O(1)

```js
let low = 0, mid = 0, high = nums.length - 1;
while (mid <= high) {
  if (nums[mid] === 0) { swap(low++, mid++); }
  else if (nums[mid] === 2) { swap(mid, high--); }     // do not advance mid: unknown value swapped in
  else mid++;
}
```
Invariant: `[0, low)` zeros, `[low, mid)` ones, `(high, n)` twos. Use when: Sort Colors,
3-way partition in quicksort (duplicates), "move all x to the front/back".

### 5. Reservoir sampling — uniform k from a stream of unknown length

```js
const reservoir = []; let seen = 0;
for (const item of stream) {
  seen++;
  if (reservoir.length < k) reservoir.push(item);
  else { const j = Math.floor(Math.random() * seen); if (j < k) reservoir[j] = item; }
}
```
Why: item `i` enters with probability `k/i` and survives each later step `j` with
probability `1 - 1/j`; the product telescopes to `k/n`. Use when: Linked List Random Node,
Random Pick Index, sampling log lines.

### 6. Fisher-Yates shuffle — uniform permutation in O(n)

```js
for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
```
Why: position `n-1` gets each element with probability `1/n`, then `n-2` gets each remaining
one with `1/(n-1)`, ... → every permutation `1/n!`. **`sort(() => Math.random() - 0.5)` is
biased** (comparison sorts assume a consistent order). Use when: Shuffle an Array, random
test generation.

### 7. Randomised algorithms: quickselect — expected O(n)

Partition around a random pivot (3-way to handle duplicates), recurse only into the side
containing `k`. Expected work `n + n/2 + n/4 + ... = 2n`. Worst case O(n²) is astronomically
unlikely with random pivots. Use when: Kth Largest Element, K Closest Points, median.

### 8. (Advanced) Meet in the middle — 2^(n/2) instead of 2^n

```js
const left = subsetSums(nums.slice(0, n / 2));          // 2^(n/2) sums
const right = subsetSums(nums.slice(n / 2)).sort();     // 2^(n/2) sums, sorted
for (const a of left) binarySearch(right, goal - a);   // combine in O(log)
```
Use when: `n <= 40` and the answer combines two independent halves (Closest Subsequence
Sum, Partition to Minimize Difference - group by subset size, 4-Sum count variants).

### 9. Two heaps ([Heaps](../../../19_Heaps_And_Priority_Queues/README.md))

A max-heap for the lower half and a min-heap for the upper half; rebalance so sizes differ
by at most one; the median is at the tops. Use when: Find Median from Data Stream, Sliding
Window Median (with lazy deletion), IPO (two heaps on different keys).

### 10. Cyclic sort — values 1..n in O(n), O(1)

```js
let i = 0;
while (i < nums.length) { const home = nums[i] - 1; if (nums[i] !== nums[home]) swap(i, home); else i++; }
```
Each swap puts one value in its home for good. Afterwards, `nums[i] !== i + 1` reveals
missing / duplicate numbers. Use when: Missing Number, Find All Duplicates, First Missing
Positive.

### 11. Prefix-suffix decomposition

Answer for `i` = f(everything left of `i`) combined with g(everything right of `i`).
Precompute `prefix[]` left-to-right and `suffix[]` right-to-left. Use when: Product of Array
Except Self, Trapping Rain Water (max-left / max-right), Best Time to Buy and Sell Stock III,
Shortest Unsorted Subarray.

### 12. (Advanced) Sqrt decomposition (brief)

```
n = 16, block size B = 4:   [a0 a1 a2 a3][a4 a5 a6 a7][a8 a9 a10 a11][a12 a13 a14 a15]
blockSum:                     S0            S1            S2              S3
query(2, 13) = a2 + a3  +  S1 + S2  +  a12 + a13      ->  O(B + n/B) = O(sqrt n)
update(i, v): values[i] = v, blockSum[i / B] += delta  ->  O(1)
```
Simpler than a segment tree, slower (O(√n)), works for min/max too (recompute one block).

### 13. (Advanced) Binary lifting / LCA on trees — O(n log n) build, O(log n) query

```
up[0][v] = parent[v]                      (2^0 = 1 step up)
up[k][v] = up[k-1][ up[k-1][v] ]          (2^k steps = 2^(k-1) steps twice)

            r                 kthAncestor(v, 5): 5 = 101b -> up[0] then up[2]
           /                  lca(u, v):
          a   depth 1           1. lift the deeper node to the other's depth
         /                      2. if equal, done
        b     depth 2           3. for k from high to low: if up[k][u] !== up[k][v], jump both
       / \                      4. answer = up[0][u]
      u   v   depth 3
```

```js
function lca(u, v) {
  if (depth[u] < depth[v]) [u, v] = [v, u];
  u = kthAncestor(u, depth[u] - depth[v]);
  if (u === v) return u;
  for (let k = LOG - 1; k >= 0; k--) if (up[k][u] !== up[k][v]) { u = up[k][u]; v = up[k][v]; }
  return up[0][u];
}
```
Use when: Kth Ancestor of a Tree Node, many LCA queries, "distance between two nodes"
(`depth[u] + depth[v] - 2·depth[lca]`), jumping on functional graphs.

### 14. (Advanced) Euler tour (brief)

Write nodes down in DFS order with entry/exit times; a subtree becomes a contiguous range
(`tin[v]..tout[v]`), so subtree queries turn into range queries (Fenwick / segment tree),
and LCA becomes a range-minimum over depths ([Sparse Table](../../../34_Range_Query_Data_Structures/03_Sparse_Table/README.md)).

---

## Pseudocode (Essential)

```
Boyer-Moore vote (majority > n/2)
  candidate = none; count = 0
  for x in nums:
    if count == 0: candidate = x
    count += (x == candidate) ? 1 : -1
  verify candidate with one more pass if a majority is not guaranteed

Floyd on an array (values 1..n, length n+1)
  slow = fast = nums[0]
  repeat: slow = nums[slow]; fast = nums[nums[fast]] until slow == fast
  slow = nums[0]
  while slow != fast: slow = nums[slow]; fast = nums[fast]
  return slow                                # cycle entrance = duplicate

Reservoir sampling (keep 1 item)
  for i, item in stream (i from 1):
    with probability 1/i: answer = item

Fisher-Yates
  for i from n-1 down to 1: j = random in [0, i]; swap a[i], a[j]

Binary lifting (Advanced)
  up[0][v] = parent[v]; up[k][v] = up[k-1][ up[k-1][v] ]
  kth(v, k): for each set bit b of k: v = up[b][v]
```

---

## Dry run — Floyd on nums = [1, 3, 4, 2, 2] (Essential)

Treat index → value as "next pointer": 0 → 1 → 3 → 2 → 4 → 2 → 4 … the cycle is 2 → 4 → 2, entered at 2.

| phase | step | slow | fast | note |
|---|---|---|---|---|
| 1 | start | 1 | 1 | both at nums[0] |
| 1 | 1 | nums[1] = 3 | nums[nums[1]] = nums[3] = 2 | |
| 1 | 2 | nums[3] = 2 | nums[nums[2]] = nums[4] = 2 | slow == fast = 2 → meet |
| 2 | reset | nums[0] = 1 | 2 | slow restarts from the head |
| 2 | 1 | nums[1] = 3 | nums[2] = 4 | |
| 2 | 2 | nums[3] = 2 | nums[4] = 2 | equal → duplicate is **2** |

---

## Operations & complexity

| Technique | Time | Space | Notes |
|-----------|------|-------|-------|
| Kadane | O(n) | O(1) | |
| Boyer-Moore (n/2) | O(n) | O(1) | verify if existence not guaranteed |
| Boyer-Moore (n/k) | O(n·k) | O(k) | k-1 candidates + verification pass |
| Floyd on array | O(n) | O(1) | no modification of the array |
| Dutch national flag | O(n) | O(1) | 3-way partition |
| Reservoir sampling | O(n) per sample | O(k) | one pass, unknown n |
| Fisher-Yates | O(n) | O(1) | uniform |
| Quickselect | expected O(n) | O(1) | worst O(n²), random pivot |
| Meet in the middle | O(2^(n/2) · n) | O(2^(n/2)) | n <= ~40 |
| Two heaps | O(log n) per insert | O(n) | median O(1) |
| Cyclic sort | O(n) | O(1) | values 1..n |
| Prefix-suffix | O(n) | O(n) | |
| Sqrt decomposition | O(1) update, O(√n) query | O(√n) | |
| Binary lifting | O(n log n) build, O(log n) query | O(n log n) | static tree |

---

## JavaScript implementation

Full code with randomized tests against brute-force references: `classic-techniques.js`
(`kadane`, `majorityVote`, `majorityVoteK`, `floydFindDuplicate`, `dutchNationalFlag`,
`reservoirSample`, `fisherYates`, `quickSelect`, `cyclicSort`, `binaryLiftingLCA`,
`sqrtDecompositionRangeSum`). Quickselect as an example of the shape:

```js
function quickSelect(nums, k) {                       // k-th smallest, 0-indexed
  const arr = nums.slice(); let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const pivot = arr[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let lt = lo, gt = hi, i = lo;                     // 3-way partition around pivot
    while (i <= gt) {
      if (arr[i] < pivot) [arr[lt++], arr[i++]] = [arr[i], arr[lt]];
      else if (arr[i] > pivot) [arr[gt--], arr[i]] = [arr[i], arr[gt]];
      else i++;
    }
    if (k < lt) hi = lt - 1; else if (k > gt) lo = gt + 1; else return pivot;
  }
  return arr[lo];
}
```

---

## Patterns / variations

### 1. Vote, then verify
Any time the "majority" might not exist, add a counting pass. Costs O(n), saves a wrong answer.

### 2. Array as a linked list
`i -> nums[i]` turns Find the Duplicate, Missing Number variants and "jump game" style
problems into cycle detection.

### 3. Probability by telescoping product
Reservoir sampling and "random pick with weights" are proven by multiplying survival
probabilities; say the product out loud in an interview.

### 4. Halve the exponent of brute force
Meet in the middle: 2^40 → 2·2^20 + merge. Group by size when the two sides must balance.

### 5. Jump by powers of two
Binary lifting on trees, on functional graphs (`f` applied k times), and in "binary search on
a Fenwick tree" (`findKth`).

---

## Alternatives and trade-offs

| Problem shape | Simple approach | Classic technique | Why the technique |
|---|---|---|---|
| Majority element | hash map counts, O(n) space | Boyer-Moore, O(1) space | interviewer asks for constant space |
| Duplicate in 1..n | sort or Set | Floyd / binary search on value | read-only array + O(1) space |
| Random sample from a stream | store everything, pick index | reservoir sampling | unknown length, O(k) memory |
| Shuffle | sort with random comparator (biased!) | Fisher-Yates | provably uniform, O(n) |
| k-th smallest | sort, O(n log n) | quickselect, O(n) expected | one answer, not a full order |
| Subset sums with n ≈ 40 | 2^n enumeration | meet in the middle, O(2^(n/2) · n) | 2^40 is too many, 2^20 is fine |
| Range sum with updates | loop per query | sqrt decomposition O(√n) | simpler than a segment tree; slower than O(log n) |
| k-th ancestor / LCA, many queries | walk up, O(depth) | binary lifting, O(log n) | many queries on a static tree |

---

## When this does NOT apply

- The array may be modified freely and space is not restricted — sorting or a hash map is clearer than voting or Floyd.
- Values are not in the range 1..n (or there may be several duplicates of different values) — Floyd / cyclic-sort assumptions break.
- n is far above 40 for subset problems — meet in the middle is still exponential; look for DP on sums ([Knapsack](../../../29_Dynamic_Programming/02_Knapsack/README.md)) or a greedy argument.
- The tree changes (links/cuts) — binary lifting tables become stale; that needs link-cut trees or offline tricks.
- Randomised algorithms when the interviewer needs a deterministic worst case — mention median-of-medians for selection.

---

## Common mistakes & edge cases

- Kadane with all-negative input: initialise with `nums[0]`, not `0`.
- Boyer-Moore II: the two candidates must be **different**; initialise with `null` and check
  `x === candA` before `countA === 0`.
- Floyd: start both pointers at `nums[0]` and use `do { } while` so they move before the
  first comparison.
- Dutch flag: after swapping with `high`, do **not** advance `mid`.
- Reservoir: the random index is in `[0, seen)`, compare `< k`. Off-by-one breaks uniformity.
- Fisher-Yates: `j` must be in `[0, i]` **inclusive**; excluding `i` makes it biased.
- Quickselect: use 3-way partition or arrays full of equal values become O(n²).
- Binary lifting: use `-1` (or the root) consistently for "no ancestor"; `LOG` must cover the
  deepest depth (`ceil(log2(n + 1))`).
- Meet in the middle: the empty subset (sum 0) belongs on both sides.

---

## Interview tips

- Name the technique as soon as you recognise it (*"this is reservoir sampling"*); it signals
  experience and lets the interviewer skip ahead.
- For probabilistic answers, give the probability argument before the code.
- When the constraint is `n <= 40`, say *"2^40 is too much, 2^20 is fine - meet in the middle"*.
- For `O(1) space` array puzzles, list the three candidates: voting, Floyd, cyclic sort.
- Binary lifting: draw the `up` table for a 5-node path; interviewers want the
  `up[k][v] = up[k-1][up[k-1][v]]` line and the "jump only if still different" loop.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Majority Element II | Medium | Boyer-Moore, k = n/3 | 03_Problems/solutions/01_majority_element_ii.js |
| 02 | Find the Duplicate Number | Medium | Floyd on an array (+ binary search on value) | 03_Problems/solutions/02_find_the_duplicate_number.js |
| 03 | Shuffle an Array | Medium | Fisher-Yates | 03_Problems/solutions/03_shuffle_an_array.js |
| 04 | Linked List Random Node | Medium | reservoir sampling, k = 1 | 03_Problems/solutions/04_linked_list_random_node.js |
| 05 | Random Pick Index | Medium | reservoir sampling over matches | 03_Problems/solutions/05_random_pick_index.js |
| 06 | Range Sum with Sqrt Decomposition | Medium | sqrt decomposition | 03_Problems/solutions/06_range_sum_sqrt_decomposition.js |
| 07 | Lowest Common Ancestor (binary lifting) | Hard | binary lifting + depth equalisation | 03_Problems/solutions/07_lowest_common_ancestor_binary_lifting.js |
| 08 | Kth Ancestor of a Tree Node | Hard | binary lifting | 03_Problems/solutions/08_kth_ancestor_of_a_tree_node.js |
| 09 | Closest Subsequence Sum | Hard | meet in the middle | 03_Problems/solutions/09_closest_subsequence_sum.js |
| 10 | Partition Array Into Two Arrays to Minimize Sum Difference | Hard | meet in the middle, grouped by size | 03_Problems/solutions/10_partition_array_minimize_sum_difference.js |

---

## Practice more

Easy: Majority Element (169), Maximum Subarray (53), Missing Number (268), Move Zeroes (283),
Sort Colors (75)

Medium: Kth Largest Element in an Array (215), K Closest Points to Origin (973), Product of
Array Except Self (238), Find All Duplicates in an Array (442), Maximum Sum Circular Subarray
(918), Random Pick with Weight (528), Insert Delete GetRandom O(1) (380), Linked List Cycle II
(142), Set Mismatch (645), Maximum Product Subarray (152), Sliding Window Median (480)

Hard: First Missing Positive (41), Find Median from Data Stream (295), Trapping Rain Water (42),
Kth Ancestor of a Tree Node (1483), Closest Subsequence Sum (1755), Partition Array Into Two
Arrays to Minimize Sum Difference (2035), Count Subarrays With Score Less Than K (2302),
Minimum Cost to Make Array Equal (2448), Maximum Score of a Good Subarray (1793)
