# Prefix Sums

A **prefix sum** array stores, at each index, the running total of everything before it.
Think of the odometer in a car: it shows total kilometres since the car was built. To
know how far you drove between two cities, you don't re-measure the road; you subtract
the odometer reading at the start from the reading at the end. Prefix sums let you answer
"what is the sum of this range?" with **one subtraction**, after a single O(n) build.

---

## Prerequisites

- [Arrays](../../03_Arrays/README.md): index arithmetic and off-by-one care.
- [Hashing](../../05_Hashing/README.md): the "prefix sum + map" pattern counts subarrays.
- [Sliding Window](../../07_Sliding_Window/README.md): know when a window is enough and when you need prefix sums.

---

## Why it matters / when to use

Look for these signals:

- "Sum of elements between index i and j", asked **many times** → prefix array, O(1) per query
- "Number of subarrays whose sum equals / is divisible by k" → prefix sum + hash map
- "Balance" problems: equal number of 0s and 1s, equal left and right sums (pivot index)
- "Add `v` to every element in range [l, r]" repeated many times → **difference array**
- "Sum of a rectangle in a grid" → **2D prefix sums**
- "XOR of a range", "product except self" → prefix with another operation
- Sliding window fails because numbers can be **negative** → prefix sums are the fix
- "Running sum", "cumulative", "so far"

Prefix sums work for any operation that has an **inverse**: sum (subtract), XOR (XOR
again), product without zeros (divide). They do **not** give range *max/min* (no inverse);
for that you need a segment tree or sparse table (`35_Advanced_Data_Structures`).

---

## How it works

### 1D prefix sums

```
index:    0   1   2   3   4
nums:    [2,  4,  1,  3,  5]
prefix:  [0,  2,  6,  7, 10, 15]      prefix[i] = nums[0] + ... + nums[i-1]
          ^ extra 0 at the front

sum(nums[1..3]) = 4 + 1 + 3 = 8
               = prefix[4] - prefix[1] = 10 - 2 = 8
```

Rule: `sum(l..r) = prefix[r + 1] - prefix[l]`. The leading 0 means `l = 0` needs no special case.

### Prefix sum + hash map ("subarray sum equals k")

A subarray `nums[j+1..i]` has sum `prefix[i+1] - prefix[j]`. We want that to equal `k`,
so we are looking for an earlier prefix equal to `currentPrefix - k`. Count how many
times each prefix value has appeared.

```
nums = [1, 2, 3], k = 3
running  seen map            need = running - k   found
  1      {0:1}               -2                   0
  3      {0:1, 1:1}           0                   1  ([1,2])
  6      {0:1, 1:1, 3:1}      3                   1  ([3])
answer 2
```

Always seed the map with `{0: 1}`: the empty prefix.

### Prefix with modulo ("divisible by k")

`(prefix[i] - prefix[j]) % k === 0` ⟺ `prefix[i] % k === prefix[j] % k`. So count prefix
**remainders**. In JS, `-1 % 5` is `-1`, so normalise: `((x % k) + k) % k`.

### Prefix XOR

`xor(l..r) = prefixXor[r + 1] ^ prefixXor[l]` because `a ^ a = 0`.

### 2D prefix sums

```
sums[r][c] = sum of the rectangle (0,0) .. (r-1,c-1)

build:  sums[r+1][c+1] = grid[r][c] + sums[r][c+1] + sums[r+1][c] - sums[r][c]
                                       (above)       (left)        (overlap counted twice)

query (r1,c1)..(r2,c2):
   sums[r2+1][c2+1] - sums[r1][c2+1] - sums[r2+1][c1] + sums[r1][c1]

   +-----------+        total       - top strip     - left strip   + top-left corner
   |  A  |  B  |                                                      (subtracted twice)
   +-----+-----+
   |  C  |  D  |   want D = ABCD - AB - AC + A
   +-----+-----+
```

### Difference arrays (range updates)

Prefix sums turned inside out. To add `v` to `[l, r]`:

```
diff[l] += v
diff[r + 1] -= v
```

After all updates, the running sum of `diff` is the final array. Each update is O(1),
one O(n) pass at the end.

```
n = 5, add 10 to [1, 3]:
diff:   [0, 10, 0, 0, -10, 0]
prefix: [0, 10, 10, 10, 0]      <- the +10 "turns on" at 1 and "turns off" at 4
```

### Prefix min / max and suffix sums

`prefixMax[i] = max(nums[0..i])`, `suffix[i] = sum(nums[i..n-1])`. These answer
"best on the left of i" / "total on the right of i" in O(1), which is how
Product of Array Except Self and Trapping Rain Water (array version) work.

---

## Pseudocode

```
BUILD (size n + 1, prefix[0] = 0)          RANGE SUM [l, r] inclusive
prefix[0] <- 0                             return prefix[r + 1] - prefix[l]
for i in 0..n-1:
    prefix[i + 1] <- prefix[i] + a[i]

COUNT SUBARRAYS WITH SUM k                 DIFFERENCE ARRAY (add v to [l, r])
count <- {0: 1}; p <- 0; ans <- 0          diff[l] += v
for x in a:                                diff[r + 1] -= v
    p += x                                 ... after all updates:
    ans += count[p - k] (or 0)             a[i] = running sum of diff[0..i]
    count[p] += 1
```

---

## Dry run on a concrete example

Subarray Sum Equals K on `[1, 2, 3]`, `k = 3`:

| x | prefix p | p - k | count[p - k] | ans | map after |
|---|---|---|---|---|---|
| - | 0 | - | - | 0 | {0:1} |
| 1 | 1 | -2 | 0 | 0 | {0:1, 1:1} |
| 2 | 3 | 0 | 1 | 1 | {0:1, 1:1, 3:1} |
| 3 | 6 | 3 | 1 | 2 | {0:1, 1:1, 3:1, 6:1} |

Answer 2: `[1, 2]` (found at p = 3 via the seed 0) and `[3]` (found at p = 6 via p = 3).

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| Build 1D prefix | O(n) | O(n) | once |
| Range sum query | O(1) | O(1) | `prefix[r+1] - prefix[l]` |
| Count subarrays with sum k | O(n) | O(n) | prefix + hash map |
| Build 2D prefix | O(rows · cols) | O(rows · cols) | |
| Rectangle sum query | O(1) | O(1) | 4 lookups |
| Difference array: one update | O(1) | O(n) total | |
| Difference array: materialise | O(n) | O(n) | once, after all updates |
| Point update on a prefix array | O(n) | | prefix sums are for **static** data; use a Fenwick tree for updates |

---

## JavaScript implementation

Full code with tests: `02_Implementations/prefix_sum.js` (`NumArray`, `NumMatrix`, `DifferenceArray`,
plus XOR / max / suffix helpers). Core:

```js
function buildPrefix(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;
}

class NumArray {
  #prefix;
  constructor(nums) { this.#prefix = buildPrefix(nums); }
  sumRange(left, right) { return this.#prefix[right + 1] - this.#prefix[left]; }
}

class DifferenceArray {
  #diff;
  constructor(n) { this.#diff = new Array(n + 1).fill(0); }
  addToRange(l, r, v) { this.#diff[l] += v; this.#diff[r + 1] -= v; }
  toArray() { /* running sum of #diff */ }
}
```

---

## Patterns / variations

### 1. Range-sum queries

```js
const prefix = buildPrefix(nums);
const sum = (l, r) => prefix[r + 1] - prefix[l];
```
Use when: many queries on an array that doesn't change.

### 2. Count subarrays with sum exactly k (hash map)

```js
function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let running = 0, count = 0;
  for (const num of nums) {
    running += num;
    count += seen.get(running - k) ?? 0;
    seen.set(running, (seen.get(running) ?? 0) + 1);
  }
  return count;
}
```
Use when: "exactly k", negatives allowed, "number of subarrays". For the **longest**
such subarray, store the *first* index of each prefix instead of a count.

### 3. Balance / transform trick

Map values so the question becomes "sum equals 0": 0 → -1 for "equal 0s and 1s"
(Contiguous Array), odd → 1 / even → 0 for "k odd numbers" (Nice Subarrays).

### 4. Remainder buckets

```js
const seen = new Map([[0, 1]]);
let running = 0, count = 0;
for (const num of nums) {
  running = ((running + num) % k + k) % k;   // keep it in [0, k)
  count += seen.get(running) ?? 0;
  seen.set(running, (seen.get(running) ?? 0) + 1);
}
```
Use when: "divisible by k", "sum is a multiple of k".

### 5. Prefix × suffix (two passes)

```js
// product of all elements except self, no division
const result = new Array(n).fill(1);
let left = 1;
for (let i = 0; i < n; i++) { result[i] = left; left *= nums[i]; }
let right = 1;
for (let i = n - 1; i >= 0; i--) { result[i] *= right; right *= nums[i]; }
```
Use when: "for each i, combine everything on the left with everything on the right".

### 6. Difference array for batch range updates

```js
const diff = new Array(n + 1).fill(0);
for (const [first, last, seats] of bookings) { diff[first - 1] += seats; diff[last] -= seats; }
// then running sum
```
Use when: flight bookings, car pooling (time as the index), "paint intervals", "add to ranges".

### 7. Prefix sums + binary search

Once prefix sums are built they are **monotonic** if all numbers are non-negative, so you
can binary search for "the first index where the prefix reaches X" (Ways to Split Array,
Minimum Size Subarray Sum in O(n log n)). See `10_Searching`.

---

## Alternatives and trade-offs

| Need | Prefix sums | Alternative | Trade-off |
|---|---|---|---|
| Many range-sum queries, no updates | O(n) build, O(1) query | sum the range each time O(n) | prefix wins once there is more than a handful of queries |
| Range sums **with** point updates | rebuild O(n) per update | Fenwick / segment tree O(log n) ([range queries](../../34_Range_Query_Data_Structures/README.md)) | trees handle updates |
| Many range updates, then read | difference array O(1) per update | update every cell O(length) | difference array needs all reads at the end |
| Longest subarray with sum ≤ k, positives only | prefix + binary search | sliding window O(n) | window is simpler when all values are positive |

---

## Common mistakes & edge cases

- Off-by-one: with the leading 0, `sum(l..r) = prefix[r+1] - prefix[l]`. Without it,
  you need a special case for `l = 0`. Pick one convention and stick to it.
- Forgetting to seed the map with `{0: 1}` (or `{0: -1}` when storing first indexes).
- Updating the map **before** checking for `running - k` (would let a subarray be empty).
- Negative modulo in JS: `-3 % 5 === -3`. Normalise with `((x % k) + k) % k`.
- Difference array: `diff` needs length `n + 1` so `diff[r + 1]` never goes out of bounds.
- 2D: mixing up `[row][col]` order, or forgetting the `+ sums[r1][c1]` term.
- Prefix sums don't support updates; if the interviewer adds "and the array changes",
  switch to a Fenwick tree / segment tree.
- Overflow is not an issue in JS up to 2^53, but mention it for other languages.

---

## When this does NOT apply

- **Frequent updates mixed with queries**: a static prefix array goes stale after each update. Use a Fenwick or segment tree.
- **Non-invertible operations** like max or min over arbitrary ranges: you cannot "subtract" a max. Use a sparse table or segment tree.
- **Products with zeros** cannot be "divided out"; use prefix and suffix products instead.
- **Huge sums** can pass `Number.MAX_SAFE_INTEGER` (2^53 - 1); use modulo or `BigInt`.

---

## Interview tips

- The first thing to say: "I'll precompute prefix sums in O(n), then each query is O(1)."
- For "count subarrays with property": "Two prefixes with the same ___ mean the subarray
  between them has ___." Fill in: same remainder → divisible; difference of k → sum k;
  same balance → equal counts.
- When you see "range update" and no point queries in between, say "difference array".
- Compare with sliding window: "Window needs a monotonic condition. With negatives I
  can't shrink safely, so I use prefix sums with a hash map instead."
- Related: `05_Hashing` (the map part), `07_Sliding_Window` (when it's monotonic),
  `10_Searching` (prefix + search), `09_Matrix_And_Multidimensional_Arrays` (2D prefix), `35_Advanced_Data_Structures` (Fenwick tree for dynamic prefix sums).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Running Sum of 1d Array | Easy | build prefix | 03_Problems/solutions/01_running_sum.js |
| 02 | Range Sum Query - Immutable | Easy | range query | 03_Problems/solutions/02_range_sum_query_immutable.js |
| 03 | Find Pivot Index | Easy | left sum vs right sum | 03_Problems/solutions/03_find_pivot_index.js |
| 04 | Product of Array Except Self | Medium | prefix × suffix | 03_Problems/solutions/04_product_of_array_except_self.js |
| 05 | Subarray Sum Equals K | Medium | prefix + hash map (count) | 03_Problems/solutions/05_subarray_sum_equals_k.js |
| 06 | Maximum Size Subarray Sum Equals k | Medium | prefix + hash map (first index) | 03_Problems/solutions/06_maximum_size_subarray_sum_equals_k.js |
| 07 | Contiguous Array | Medium | balance transform | 03_Problems/solutions/07_contiguous_array.js |
| 08 | Subarray Sums Divisible by K | Medium | remainder buckets | 03_Problems/solutions/08_subarray_sums_divisible_by_k.js |
| 09 | Count Number of Nice Subarrays | Medium | transform + prefix count | 03_Problems/solutions/09_count_nice_subarrays.js |
| 10 | Minimum Value to Get Positive Step by Step Sum | Easy | prefix min | 03_Problems/solutions/10_minimum_value_positive_step_sum.js |
| 11 | Range Sum Query 2D - Immutable | Medium | 2D prefix | 03_Problems/solutions/11_range_sum_query_2d.js |
| 12 | Corporate Flight Bookings | Medium | difference array | 03_Problems/solutions/12_corporate_flight_bookings.js |
| 13 | Car Pooling | Medium | difference array over time | 03_Problems/solutions/13_car_pooling.js |
| 14 | Ways to Split Array Into Three Subarrays | Hard | prefix + binary search | 03_Problems/solutions/14_ways_to_split_array.js |

---

## Practice more

Easy: Left and Right Sum Differences (2574), Number of Ways to Split Array (2270), Sum of
All Odd Length Subarrays (1588), Find the Highest Altitude (1732), Points That Intersect
With Cars (2848)

Medium: Continuous Subarray Sum (523), Make Sum Divisible by P (1590), Matrix Block Sum
(1314), Number of Submatrices That Sum to Target (1074, hard-ish), Path Sum III (437,
prefix on a tree), Minimum Operations to Reduce X to Zero (1658), Range Addition (370),
Count of Range Sum (327, hard), Binary Subarrays With Sum (930), Maximum Sum Circular
Subarray (918), Grid Game (2017)

Hard: Shortest Subarray with Sum at Least K (862), Count Subarrays With Score Less Than K
(2302), Maximum Score of Spliced Array (2321)
