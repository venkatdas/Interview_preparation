# Meet in the Middle — Concepts

> Essential sections: 1–10, 12, 14. Advanced: 11, 13 (size-constrained and "transform the target" variants), 15.

---

## 1. Prerequisites

- [Backtracking](../../13_Backtracking/README.md): you must be able to list all subsets of an array.
- [Bit Manipulation](../../14_Bit_Manipulation/README.md): a subset of k items is a k-bit mask.
- [Searching](../../10_Searching/README.md): binary search, lower bound / upper bound.
- [Two Pointers](../../06_Two_Pointers/README.md): counting pairs in two sorted lists.
- [Hashing](../../05_Hashing/README.md): frequency maps for "count pairs that sum to X".
- [Complexity Analysis](../../01_Complexity_Analysis): you should know why 2^40 is hopeless and 2^20 is easy.

---

## 2. Intuition

Some problems really do need you to look at every subset. With n = 20 that is 2^20 ≈ one million
subsets. That's fine. With n = 40 it's 2^40 ≈ one trillion. That's not.

The trick: **a subset of the whole array = a subset of the left half + a subset of the right half.**
So list the subsets of each half on their own (about a million each). Then, instead of pairing every
left subset with every right subset (that would bring back the trillion), **sort** one list and use
binary search, two pointers, or a hash map to find the right partner for each left sum quickly.

You "meet in the middle": one side walks in from the left, one from the right, and they meet at the
target.

---

## 3. Mental model / analogy

Think of a combination lock with 40 switches. Trying every setting takes forever. But if the lock's
"value" is just the sum of a left panel (20 switches) and a right panel (20 switches), you can write
down every value the left panel can make in a notebook, sort it, and then for every right setting
look up the matching left value in the sorted notebook.

```
nums = [ a0 a1 ... a19 | a20 a21 ... a39 ]
            left half          right half

 left sums  L (2^20 values)        right sums R (2^20 values, SORTED)
 ┌──────────┐                       ┌──────────┐
 │  l_0     │──── want target - l ─▶│ binary   │
 │  l_1     │                       │ search   │
 │  ...     │                       │ / 2 ptrs │
 │  l_last  │                       │ / hash   │
 └──────────┘                       └──────────┘

 work: 2^20 + 2^20 (build) + 2^20 * log(2^20) (combine)   ≈ 2 * 10^7
 vs.   2^40 ≈ 10^12 for the plain brute force
```

---

## 4. Why it exists

Exponential problems with **no** polynomial algorithm (subset sum, knapsack with huge weights,
partition) still show up with small n. Dynamic programming over sums doesn't help when the values are
huge (up to 10^9) because the DP table would be 10^9+ wide. Meet in the middle is the go-to tool when:

- n is too big for 2^n (n ≈ 30 to 45), but
- n/2 is small enough for 2^(n/2) (≈ 10^5 to 10^7), and
- the answer for the whole set can be built from **one** answer from each half (usually a sum).

---

## 5. How it works, step by step

1. **Split** the array into `left = nums[0 .. n/2)` and `right = nums[n/2 .. n)`.
2. **Enumerate** every subset sum of `left` → list `L`. Same for `right` → list `R`.
   Each list has 2^(n/2) entries (duplicates kept: different subsets with the same sum are different answers).
3. **Prepare** `R` for fast lookups: sort it, or put it in a frequency map.
4. **Combine**: for every `l` in `L`, find the matching `r` values in `R`:
   - "exactly equal to T" → hash map lookup of `T - l` (count with frequencies),
   - "closest to T" → binary search for `T - l`, check both neighbours,
   - "at most T" (counting) → sort both, two pointers.
5. Return the combined answer.

---

## 6. Pseudocode

```
function mitm(nums, target):
    left, right = split nums in half
    L = all subset sums of left
    R = all subset sums of right, sorted
    best = +infinity
    for l in L:
        pos = lowerBound(R, target - l)        # first R[pos] >= target - l
        if pos < len(R):  best = min(best, |l + R[pos] - target|)
        if pos > 0:       best = min(best, |l + R[pos-1] - target|)
    return best
```

---

## 7. JavaScript implementation

Full code with self-tests: [`02_Implementations/meet_in_the_middle.js`](../02_Implementations/meet_in_the_middle.js).
Helpers: `splitHalves`, `subsetSums`, `sortedSubsetSums`, `subsetSumsBySize`, `countPairsAtMost`,
`closestPairSum`, `countPairsEqual`, `lowerBound`, `upperBound`, `countSubsetsAtMost`, `closestSubsetSum`.

The two core pieces:

```js
// Sorted subset sums WITHOUT calling sort: merge(cur, cur + x) stays sorted.
function sortedSubsetSums(arr) {
  let cur = [0];
  for (const x of arr) {
    const next = [];
    let i = 0, j = 0;
    while (i < cur.length || j < cur.length) {
      if (j === cur.length || (i < cur.length && cur[i] <= cur[j] + x)) next.push(cur[i++]);
      else next.push(cur[j++] + x);
    }
    cur = next;
  }
  return cur;
}

// Count pairs a + b <= target in two sorted lists: O(|A| + |B|).
function countPairsAtMost(A, B, target) {
  let j = B.length - 1, count = 0;
  for (const a of A) {
    while (j >= 0 && a + B[j] > target) j--;
    if (j < 0) break;
    count += j + 1;
  }
  return count;
}
```

---

## 8. Dry run

Count subsets of `nums = [3, -1, 4, 2]` with sum ≤ 3.

Split: left = `[3, -1]`, right = `[4, 2]`.

Sorted left sums by merging:

| step | cur | cur + x | merged |
|---|---|---|---|
| start | [0] | | [0] |
| x = 3 | [0] | [3] | [0, 3] |
| x = -1 | [0, 3] | [-1, 2] | [-1, 0, 2, 3] |

Sorted right sums: `[0, 2, 4, 6]`.

Two pointers (`j` starts at the last index of R = 3):

| i | L[i] | j moves while L[i] + R[j] > 3 | final j | add j + 1 | total |
|---|---|---|---|---|---|
| 0 | -1 | -1+6=5 > 3 → j=2; -1+4=3 ok | 2 | 3 | 3 |
| 1 | 0 | 0+4=4 > 3 → j=1; 0+2=2 ok | 1 | 2 | 5 |
| 2 | 2 | 2+2=4 > 3 → j=0; 2+0 ok | 0 | 1 | 6 |
| 3 | 3 | 3+0=3 ok | 0 | 1 | 7 |

Answer: **7**. (Check by hand: the 16 subset sums are 0,3,-1,4,2,7,3,6,5,2,1,9,8,6,4,5 → seven of them are ≤ 3.)

---

## 9. Edge cases

- **Empty array**: only the empty subset, sum 0.
- **Odd n**: halves have sizes ⌊n/2⌋ and ⌈n/2⌉ — that's fine.
- **Duplicate values / duplicate sums**: keep them all; counting problems need multiplicities.
- **Empty subset**: is it allowed? Each half's list contains 0 (the empty half-subset). If the problem
  forbids the empty overall subset, subtract it (or skip the `(0 from L, 0 from R)` pair).
- **Non-empty / proper subset rules** (e.g. "both groups non-empty"): be careful not to pair the
  *full* left with the *full* right.
- **Negative numbers**: everything still works; just don't use "early break when sum too large" tricks that assume positives.
- **Big values**: 40 × 10^9 = 4·10^10 fits exactly in a JS number (< 2^53). Products may not — use `BigInt` if you multiply.

---

## 10. Complexity analysis

Let `h = n/2`.

| Operation | Time | Space | Why |
|---|---|---|---|
| enumerate half sums (iterative doubling) | O(2^h) | O(2^h) | each new element doubles the list |
| sorted half sums (merge trick) | O(2^h) | O(2^h) | each doubling is a linear merge; total 1 + 2 + 4 + … = O(2^h) |
| sorted half sums (sort afterwards) | O(2^h · h) | O(2^h) | sorting 2^h items costs 2^h · log(2^h) |
| combine with hash map | O(2^h) expected | O(2^h) | one lookup per left sum |
| combine with binary search | O(2^h · h) | O(1) extra | one log-time search per left sum |
| combine with two pointers | O(2^h) | O(1) extra | both pointers only move one way |
| sums grouped by size + binary search | O(2^h · h) | O(2^h) | same total sums, just bucketed |
| brute force for comparison | O(2^n) | O(n) | 2^40 ≈ 10^12 — far too slow |

**The n ≈ 40 rule.** 2^20 ≈ 10^6 values per half, ~8 MB as a JS array of numbers. That's comfortable.
At n = 50, 2^25 ≈ 3.3·10^7 per half (~270 MB): borderline. Past that, meet in the middle stops helping.

---

## 11. Alternatives (Advanced)

| Approach | When it wins | When it loses |
|---|---|---|
| Plain brute force / backtracking, O(2^n) | n ≤ 20–25 | n ≈ 40 |
| Backtracking with pruning (branch & bound) | strong pruning (all positive values, sorted) | adversarial inputs |
| DP over sums, O(n · S) | values small (S ≤ ~10^7) | values up to 10^9 |
| **Meet in the middle, O(2^(n/2) · n)** | n ≈ 30–45, values huge | n ≥ 50 (memory), or values small (DP is simpler) |
| Greedy / math insight | special structure (e.g. sorted, divisibility) | general inputs |

Rule of thumb: **small values → DP; small n → meet in the middle.**

---

## 12. Common mistakes (and why they happen)

1. **Pairing every left sum with every right sum.** That's 2^h · 2^h = 2^n again. The whole point is a
   *fast* combine (sort + search, two pointers, or hash).
2. **De-duplicating sums when counting.** Two subsets with the same sum are two answers. Use a
   frequency map, not a `Set`, when you count. (A `Set` is fine for yes/no questions.)
3. **Forgetting both neighbours in a closest search.** `lowerBound` gives the first `≥` value; the
   best partner can be the one just before it.
4. **Recursion for 2^20 items with array spreading** (`[...sums, s + x]`). That's quadratic copying.
   Use the iterative doubling loop.
5. **Ignoring a size constraint.** "Two groups of exactly n" means you must bucket sums by how many
   items they use (see `subsetSumsBySize`). Mixing sizes gives wrong answers.
6. **Allowing the whole array or the empty set when the problem forbids it.** Handle "non-empty" and
   "proper" carefully (Split Array With Same Average).
7. **Sorting with the default `Array.prototype.sort`.** It sorts as strings! Always pass `(a, b) => a - b`.
8. **Precision with averages.** Multiply instead of dividing: compare `sum * n` with `total * size`.

---

## 13. Patterns / variations with templates

### A. Exact target, count solutions → hash map

```js
const freq = new Map();
for (const r of R) freq.set(r, (freq.get(r) || 0) + 1);
let count = 0;
for (const l of L) count += freq.get(T - l) || 0;
```
Used by: 4Sum II (the "halves" are array pairs), Equal-Sum Split.

### B. Closest to target → sort one side + binary search

```js
R.sort((a, b) => a - b);
for (const l of L) {
  const p = lowerBound(R, T - l);
  if (p < R.length) best = Math.min(best, Math.abs(l + R[p] - T));
  if (p > 0)        best = Math.min(best, Math.abs(l + R[p - 1] - T));
}
```
Used by: Closest Subsequence Sum.

### C. Count sums ≤ target → sort both + two pointers

See `countPairsAtMost` above. Used by: Subset Sum Count ≤ Target.

### D. Size-constrained (Advanced) → bucket by subset size

If the chosen set must have exactly `k` items, a left subset of size `i` must pair with a right
subset of size `k - i`. Build `bySize[i]` for both halves and combine bucket `i` with bucket `k - i`.
Used by: Partition Array Into Two Arrays to Minimize Sum Difference.

### E. Transform the target (Advanced)

- "Two groups with equal sums" → give each item a sign ±1 and look for signed total 0.
- "Two groups with equal averages" → subtract the average from every item (multiply by n to stay
  integral), then look for a non-empty proper subset with sum 0.

### F. Not only subsets

The same idea works for anything that is "choose a path of length n" where the halves combine with
one lookup: 4 arrays → 2 + 2, bidirectional BFS on huge state spaces, or "first half of a path in a
grid meets the second half on the anti-diagonal" (XOR path counting).

---

## 14. Recognition clues

**Use it when:**
- n is around **30–45** (look at the constraints! `n <= 40` is a loud signal).
- The brute force is "try all subsets / all assignments" and the score is **additive** (sum, XOR, count).
- Values are **huge** (up to 10^9), so DP over sums is impossible.
- You can phrase the goal as "pick `x` from list A and `y` from list B with `x + y` = / ≤ / closest to T".

**Do NOT use it when:**
- n ≤ 20: plain enumeration is simpler.
- Values are small (sum ≤ ~10^6): subset-sum DP is simpler and faster.
- The score isn't decomposable into "left part ⊕ right part" (e.g. depends on the order of all items).
- n ≥ 50–60: even 2^(n/2) doesn't fit in memory.

---

## 15. Interview application

**Talk track:**
1. "Brute force is all 2^n subsets — with n = 40 that's 10^12, too slow."
2. "But n/2 = 20 gives 10^6 per half. Any subset is a left subset plus a right subset."
3. "I'll enumerate both halves' sums, sort the right one, and for each left sum binary search for the
   best partner. Time O(2^(n/2) · n), space O(2^(n/2))."
4. Mention the trade-off: "If the values were small I'd use DP over sums instead."

**Clarify:**
- Is the empty subset allowed? Must groups be non-empty? Is the group size fixed?
- Count assignments or just decide yes/no? (Frequency map vs set.)
- Value ranges (overflow? negative numbers?).

---

## 16. Problems in this topic

| # | Problem | Difficulty | Pattern |
|---|---|---|---|
| 01 | [4Sum II](../03_Problems/02_Medium/01_four_sum_ii.md) | Medium | 2 + 2 split, hash |
| 02 | [Subset Sum Count ≤ Target](../03_Problems/02_Medium/02_subset_sum_count_at_most.md) | Medium | sorted sums + two pointers |
| 03 | [Equal-Sum Split](../03_Problems/02_Medium/03_equal_sum_split.md) | Medium | signed sums + hash |
| 04 | [Closest Subsequence Sum](../03_Problems/03_Hard/04_closest_subsequence_sum.md) | Hard | binary search combine |
| 05 | [Partition Array Into Two Arrays to Minimize Sum Difference](../03_Problems/03_Hard/05_partition_min_sum_difference.md) | Hard | bucket by size |
| 06 | [Split Array With Same Average](../03_Problems/03_Hard/06_split_array_same_average.md) | Hard | transform target |

**Practice more:**
- LeetCode #956 Tallest Billboard (DP on difference is the intended solution; MITM also works)
- LeetCode #18 4Sum (compare with 4Sum II)
- LeetCode #1981 Minimize the Difference Between Target and Chosen Elements
- CSES 1628 "Meet in the Middle" (count subsets with sum exactly x, n = 40)
- LeetCode #127 Word Ladder (bidirectional BFS: the graph version of meeting in the middle)
