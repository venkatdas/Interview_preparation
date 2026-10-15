# Divide & Conquer

**Divide and conquer** solves a problem by splitting it into smaller copies of itself,
solving those (recursively, down to a trivial base case), and **combining** the answers.
Think of counting the people in a stadium: split the crowd in half, have two helpers count
each half (who split again, and again), then add the two numbers. The "add" is the combine
step, and it is where the real thinking happens.

You already used it without naming it: merge sort and quick sort ([Sorting](../../11_Sorting/README.md)),
binary search ([Searching](../../10_Searching/README.md)), and every recursive tree traversal
([Binary Trees](../../20_Trees/01_Binary_Trees/README.md), [Backtracking](../../13_Backtracking/README.md)).

---

## Prerequisites (Essential)

- Recursion: base case, call stack, returning values up the stack ([Backtracking](../../13_Backtracking/README.md) uses the same muscles).
- [Sorting](../../11_Sorting/README.md) - merge sort is the textbook divide and conquer.
- [Searching](../../10_Searching/README.md) - binary search is divide and conquer with one half thrown away.
- Logarithms: "how many times can I halve n?" -> log2(n) ([Complexity Analysis](../../01_Complexity_Analysis/01_Time_Complexity/README.md)).

## Mental model (Essential)

A manager gets a big job, cuts it in two, hands each half to an assistant (who does the same
thing), and when the two reports come back the manager writes ONE summary from them.
The manager never looks at the raw data again, only at the two reports.

```
                 [ whole problem ]                 <- combine(left report, right report)
                 /               \
      [ left half ]             [ right half ]     <- each is the SAME problem, smaller
       /       \                 /        \
    [..]      [..]            [..]       [..]      <- base cases answered directly
```

---

## Why it matters / when to use

- The problem on the whole input is the **same problem** on each half, plus some
  cross-boundary work: "maximum subarray", "count inversions", "closest pair of points"
- "Merge k sorted things" (lists, arrays, skylines)
- Fast exponentiation, fast multiplication (Karatsuba), matrix power (Fibonacci in O(log n))
- Problems whose answer is "all ways to split at every operator / every root" (Different
  Ways to Add Parentheses, Unique BSTs) - these turn into DP when sub-results repeat
- The interviewer says "can you do better than O(n^2)?" and the input has a natural midpoint

---

## How it works

### The three steps

```
solve(problem):
  if problem is tiny:  return the obvious answer            (BASE CASE)
  split problem into parts p1, p2, ...                      (DIVIDE)
  a1 = solve(p1), a2 = solve(p2), ...                       (CONQUER)
  return combine(a1, a2, ...)                               (COMBINE)
```

### The recursion tree (merge sort on 8 elements)

```
level 0:                  [8 elements]                 combine cost: 8
level 1:          [4]                    [4]           combine cost: 4 + 4 = 8
level 2:      [2]     [2]            [2]     [2]       combine cost: 8
level 3:    [1] [1] [1] [1]        [1] [1] [1] [1]     base cases
                                                       -> log n levels x n work = n log n
```

### Recurrences and the master theorem (simply)

Write the running time as `T(n) = a·T(n/b) + f(n)`:
`a` sub-problems, each of size `n/b`, plus `f(n)` work to divide and combine.
Compare `f(n)` with `n^(log_b a)` (the total number of leaves):

| Case | When | Result | Example |
|------|------|--------|---------|
| 1. Leaves dominate | `f(n)` grows slower than `n^(log_b a)` | `T(n) = Θ(n^(log_b a))` | `T(n) = 2T(n/2) + 1` → Θ(n) (tree traversal, max via D&C) |
| 2. Balanced | `f(n) = Θ(n^(log_b a))` | `T(n) = Θ(n^(log_b a) · log n)` | `T(n) = 2T(n/2) + n` → Θ(n log n) (merge sort, inversions, max subarray D&C) |
| 3. Combine dominates | `f(n)` grows faster | `T(n) = Θ(f(n))` | `T(n) = 2T(n/2) + n²` → Θ(n²) |

Quick ones to memorise: `T(n) = T(n/2) + 1 → log n` (binary search),
`T(n) = T(n/2) + n → n` (quickselect, case 3), `T(n) = 4T(n/2) + n → n²`,
`T(n) = 3T(n/2) + n → n^1.585` (Karatsuba). `T(n) = T(n-1) + n` is **not** D&C - it is
`n²` (plain recursion that shrinks by one, e.g. worst-case quick sort).

### Classic examples

- **Merge sort**: split, sort halves, merge in O(n). `2T(n/2) + n`.
- **Quick sort**: partition in O(n), recurse on both sides. Expected `n log n`.
- **Binary search**: look at the middle, recurse on one half. `T(n/2) + 1`.
- **Counting inversions**: merge sort, and while merging, every time you take from the right
  half it is smaller than all remaining left elements → add `left.length - i`.
- **Maximum subarray (D&C)**: best of (left half, right half, crossing the middle).
- **Closest pair of points** (idea): sort by x, split, recurse, then only check points within
  `d` of the dividing line, sorted by y, at most 7 neighbours each. `n log n`.
- **Karatsuba** (idea): multiply two n-digit numbers with **3** half-size multiplications
  instead of 4: `(a·10^k + b)(c·10^k + d)` needs `ac`, `bd`, `(a+b)(c+d) - ac - bd`.
- **Fast exponentiation**: `x^n = (x^(n/2))²` (times `x` if odd). `log n` multiplications.
- **Merge k sorted lists**: pairwise, `N log k`.
- **Skyline**: merge two skylines like merge sort, emitting a point only when the max height changes.

### When divide & conquer becomes dynamic programming

If the sub-problems **overlap** (the same sub-input is solved many times), memoise them:
`Different Ways to Add Parentheses` recomputes the same substrings; `fib(n) = fib(n-1) +
fib(n-2)` recomputes everything. D&C with a memo table **is** top-down DP
([Dynamic Programming](../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md)). If sub-problems are disjoint (merge sort halves),
memoisation buys nothing.

---

## Dry run: counting inversions on [2, 4, 1, 3, 5] (Essential)

Divide: `[2, 4]` and `[1, 3, 5]`. Each half sorts itself with 0 inversions inside
(`[2,4]` is sorted, `[1,3,5]` is sorted). Now the combine step merges them:

| Step | left[i] | right[j] | Compare | Action | count | merged |
|------|---------|----------|---------|--------|-------|--------|
| 1 | 2 (i=0) | 1 (j=0) | 2 > 1 | take 1; it is smaller than all 2 remaining left items -> count += 2 | 2 | [1] |
| 2 | 2 (i=0) | 3 (j=1) | 2 <= 3 | take 2 | 2 | [1,2] |
| 3 | 4 (i=1) | 3 (j=1) | 4 > 3 | take 3; 1 remaining left item -> count += 1 | 3 | [1,2,3] |
| 4 | 4 (i=1) | 5 (j=2) | 4 <= 5 | take 4 | 3 | [1,2,3,4] |
| 5 | - | 5 | left empty | append 5 | 3 | [1,2,3,4,5] |

Answer: 3 inversions: (2,1), (4,1), (4,3). The cross pairs were counted in bulk, which is
why the whole thing stays O(n log n) instead of O(n²).

## Assumptions and limitations of each algorithm (Advanced)

| Algorithm | Assumes | Limitation |
|-----------|---------|------------|
| Merge sort / count inversions | elements are comparable | O(n) extra memory; slower than in-place sorts on small arrays |
| Quick sort / quickselect | a good pivot (random) | O(n²) worst case with bad pivots; recursion depth can reach n |
| Max subarray D&C | non-empty array | O(n log n) - Kadane's O(n) is strictly better in practice |
| Fast power | exponent is a non-negative integer (negative -> 1 / x^|n|) | floating point loses precision; modular products past 2^53 need `mulMod` or BigInt |
| Median of two sorted arrays | both inputs are already sorted | the partition indices are easy to get off by one |
| Merge k sorted lists | each input list is sorted | pairwise merging allocates new arrays each level (O(N) extra) |
| Closest pair / Karatsuba | points in the plane / big integers | constant factors are large; only worth it for big n |

---

## Operations & complexity

| Algorithm | Recurrence | Time | Extra space |
|-----------|------------|------|-------------|
| Merge sort / count inversions | 2T(n/2) + n | O(n log n) | O(n) |
| Maximum subarray (D&C) | 2T(n/2) + n | O(n log n) | O(log n) stack |
| Binary search | T(n/2) + 1 | O(log n) | O(1) iterative |
| Median of two sorted arrays | T(m/2) + 1 | O(log min(m, n)) | O(1) |
| Fast power | T(n/2) + 1 | O(log n) | O(1) iterative |
| Merge k sorted lists | pairwise | O(N log k) | O(log k) stack |
| Skyline (D&C merge) | 2T(n/2) + n | O(n log n) | O(n) |
| Different Ways to Add Parentheses | Catalan growth | O(Catalan(n)) outputs | memo |
| Karatsuba | 3T(n/2) + n | O(n^1.585) | O(n) |
| Closest pair | 2T(n/2) + n | O(n log n) | O(n) |

---

## JavaScript implementation

Full code with randomized tests against O(n²) references: [`02_Implementations/divide_and_conquer.js`](../02_Implementations/divide_and_conquer.js)
(`mergeSort`, `merge`, `countInversions`, `maxSubarrayDC`, `power`, `mulMod`,
`mergeKSortedArrays`). The inversion counter shows the shape:

```js
function countInversions(nums) {
  function sortAndCount(arr) {
    if (arr.length <= 1) return { sorted: arr, count: 0 };            // base case
    const mid = arr.length >> 1;
    const left = sortAndCount(arr.slice(0, mid));                      // conquer
    const right = sortAndCount(arr.slice(mid));
    let count = left.count + right.count, i = 0, j = 0;
    const merged = [];
    while (i < left.sorted.length && j < right.sorted.length) {        // combine
      if (left.sorted[i] <= right.sorted[j]) merged.push(left.sorted[i++]);
      else { count += left.sorted.length - i; merged.push(right.sorted[j++]); }  // cross pairs
    }
    return { sorted: merged.concat(left.sorted.slice(i), right.sorted.slice(j)), count };
  }
  return sortAndCount(nums).count;
}
```

---

## Patterns / variations

### 1. Count-while-merging

Any "pairs (i, j) with i < j and some order relation" question: inversions, reverse pairs
(`nums[i] > 2·nums[j]`), count of smaller after self, count of range sum (merge prefix sums).

### 2. Best of left / right / crossing

```js
return Math.max(solve(lo, mid), solve(mid + 1, hi), bestCrossing(lo, mid, hi));
```
Use when: maximum subarray, closest pair, largest rectangle (alternative to the stack).

### 3. Split at every operator / every root

```js
for (let i = 0; i < expr.length; i++) if (isOperator(expr[i]))
  for (const a of ways(expr.slice(0, i))) for (const b of ways(expr.slice(i + 1))) results.push(apply(a, expr[i], b));
```
Use when: Different Ways to Add Parentheses, Unique Binary Search Trees II, matrix chain
order. Memoise - it is DP in disguise.

### 4. Halve the exponent / the search space

Fast power, super pow (digit by digit), median of two sorted arrays (binary search on the
partition), Pow(x, n) with negative n.

### 5. Pairwise merge of k things

```js
function mergeRange(lo, hi) { if (lo === hi) return lists[lo]; const mid = (lo + hi) >> 1;
  return mergeTwo(mergeRange(lo, mid), mergeRange(mid + 1, hi)); }
```
Use when: Merge k Sorted Lists / Arrays, Skyline, "combine k sorted streams".

### 6. Parity / affine construction

Beautiful Array: build from `odd(beautiful(ceil(n/2)))` + `even(beautiful(floor(n/2)))`
because the property survives `x → 2x - 1` and `x → 2x`, and odd + even sums are never even.

---

## Alternatives (Essential)

| Problem | Brute force | Divide & conquer | Other better option |
|---------|-------------|------------------|---------------------|
| Maximum subarray | O(n²) all pairs | O(n log n) left/right/crossing | Kadane O(n) |
| Count inversions | O(n²) all pairs | O(n log n) merge-count | Fenwick tree O(n log n) ([Fenwick Tree](../../34_Range_Query_Data_Structures/02_Fenwick_Tree/README.md)) |
| x^n | O(n) multiply loop | O(log n) squaring | - |
| Merge k sorted lists | O(N k) pick-min scan | O(N log k) pairwise | min-heap O(N log k) |
| Skyline | O(n * width) height array | O(n log n) merge skylines | sweep line + heap O(n log n) |
| Different ways to add parentheses | - | exponential, recomputes | memoised D&C = interval DP |

## When divide & conquer does NOT apply (Essential)

- **No useful combine step.** If merging two half-answers costs as much as solving from scratch
  (O(n²) combine), the split buys nothing.
- **Sub-problems overlap heavily.** Plain D&C recomputes them exponentially; use DP / memoisation.
- **The split is unbalanced.** Shrinking by one each call (`T(n) = T(n-1) + n`) is just
  recursion with O(n²) time and O(n) stack - and can overflow the JS call stack.
- **A linear scan already works.** Kadane, two pointers or a hash map often beat D&C on simplicity.
- **The answer depends on global order in a way halves cannot capture** (e.g. "longest path in
  a graph" - halves of a graph are not independent).

---

## Common mistakes & edge cases

- Missing or wrong **base case** (size 0 vs size 1; empty array in max subarray).
- Off-by-one in the split: use `[lo, mid]` and `[mid + 1, hi]`, or half-open slices, never both.
- Forgetting the **crossing** case or making it O(n²) (which kills the recurrence).
- Using `slice()` in every call is O(n) extra per level - fine for O(n log n) algorithms,
  wasteful for O(log n) ones (pass indices instead).
- Recursion depth: `log n` levels are fine; `n` levels (shrinking by one) can overflow the
  stack in JS around 10^4.
- Modular multiplication of two ~1e9 numbers overflows 2^53 - use `mulMod` or BigInt.
- Ties in count-while-merging: decide `<` vs `<=` so equal elements are not counted.

---

## Interview tips

- Say the three words: *divide, conquer, combine* - and immediately state the recurrence
  and its solution (*"2T(n/2) + n, so n log n"*). That is what "analyse the complexity" means.
- Draw the recursion tree for one level to explain the combine cost.
- For "can you beat O(n²)?" questions, ask yourself: *"If I had the answer for both halves,
  what extra work tells me the answer for the whole?"*
- Know Kadane for Maximum Subarray, but be ready for the D&C version (it is the stated
  follow-up on LeetCode).
- When sub-problems repeat, say *"this is overlapping, I'll memoise - it becomes DP"*.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Pow(x, n) and Super Pow | Medium | halve the exponent, digit-by-digit mod | 03_Problems/solutions/01_pow_and_super_pow.js |
| 02 | Maximum Subarray (D&C) | Medium | left / right / crossing | 03_Problems/solutions/02_maximum_subarray_dc.js |
| 03 | Different Ways to Add Parentheses | Medium | split at every operator + memo | 03_Problems/solutions/03_different_ways_to_add_parentheses.js |
| 04 | Merge k Sorted Lists | Hard | pairwise merge, N log k | 03_Problems/solutions/04_merge_k_sorted_lists.js |
| 05 | Beautiful Array | Medium | odd/even affine construction | 03_Problems/solutions/05_beautiful_array.js |
| 06 | Count of Smaller Numbers After Self | Hard | count while merging indices | 03_Problems/solutions/06_count_of_smaller_numbers_after_self.js |
| 07 | Median of Two Sorted Arrays | Hard | binary search on the partition | 03_Problems/solutions/07_median_of_two_sorted_arrays.js |
| 08 | The Skyline Problem | Hard | merge two skylines | 03_Problems/solutions/08_the_skyline_problem.js |

---

## Practice more

Easy: Convert Sorted Array to Binary Search Tree (108), Maximum Depth of Binary Tree (104),
Majority Element (169, D&C version)

Medium: Pow(x, n) (50), Super Pow (372), Sort an Array (912, merge sort), Kth Largest Element
in an Array (215, quickselect), Different Ways to Add Parentheses (241), Unique Binary Search
Trees II (95), Construct Binary Tree from Preorder and Inorder (105), Beautiful Array (932),
Longest Substring with At Least K Repeating Characters (395), Maximum Subarray (53),
Balance a Binary Search Tree (1382), Search a 2D Matrix II (240)

Hard: Merge k Sorted Lists (23), Median of Two Sorted Arrays (4), Count of Smaller Numbers
After Self (315), Reverse Pairs (493), Count of Range Sum (327), The Skyline Problem (218),
Burst Balloons (312), Number of Ways to Reorder Array to Get Same BST (1569)
