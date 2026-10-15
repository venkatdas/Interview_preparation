# 04. Prefix Sums & Difference Arrays

A **prefix sum** array stores running totals: `prefix[i]` = sum of the first i elements. Then the
sum of any range `nums[i..j]` is one subtraction: `prefix[j + 1] - prefix[i]`. A **difference
array** is the reverse trick: to add a value to a whole range, change only its two ends, then
take one running sum at the end.

Combined with a hash map, prefix sums also count subarrays with a given sum in O(n), even with
negative numbers (where a sliding window fails).

**Teaches in depth:** [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at prefix sums |
|---|---|
| "sum of range [i, j]", many queries | O(1) per query after O(n) setup |
| "subarray sum equals k", "divisible by k" | `prefix[j] - prefix[i] = k` -> look up `prefix[j] - k` in a map |
| "equal number of 0s and 1s" | map 0 -> -1, then "sum equals 0" |
| "pivot / balance index", "left sum equals right sum" | `left = prefix[i]`, `right = total - prefix[i+1]` |
| "add x to every element from l to r" many times | difference array |
| "bookings", "car pooling", "how many at time t" | range adds, then one sweep |
| "sum of a sub-rectangle" | 2D prefix sums |

**Constraint hints**

- Many range queries (q up to 10^5) on a **static** array -> prefix sums. If the array also changes between queries, use a Fenwick or segment tree ([Range Query Data Structures](../../../34_Range_Query_Data_Structures)).
- Negative numbers + "subarray sum equals k" -> prefix + map, not a window.

## 2. When it applies (preconditions)

- The operation is **invertible** (sum, XOR, count): you can "subtract" a prefix. Min and max are not invertible.
- The data does not change between queries (or all updates come before all queries, for difference arrays).

## 3. When it does NOT apply

- **Range minimum.** `nums = [3, 1, 2]`: knowing "min of the first 3 is 1" and "min of the first 1 is 3" does not tell you the min of `nums[1..2]`. Min cannot be subtracted. Use a sparse table or segment tree.
- **Updates mixed with queries.** After `nums[0] += 5`, every prefix changes: O(n) per update. Use a Fenwick tree (O(log n) both).
- **Longest subarray with sum <= k.** "Equals" turns into a single map lookup; "at most" needs a sorted structure or monotonic tricks, not a plain map.

## 4. The template

```js
function buildPrefixSum(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix; // sum of nums[i..j] = prefix[j + 1] - prefix[i]
}

function countSubarraysWithSum(nums, k) {
  const seen = new Map([[0, 1]]); // prefix sum -> how many times seen
  let running = 0;
  let count = 0;
  for (const x of nums) {
    running += x;
    count += seen.get(running - k) || 0;
    seen.set(running, (seen.get(running) || 0) + 1);
  }
  return count;
}

function applyRangeAdds(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, delta] of updates) {
    diff[l] += delta;                              // start adding at l
    diff[r + 1] -= delta;                          // stop after r
  }
  const out = new Array(n).fill(0);
  let running = 0;
  for (let i = 0; i < n; i++) { running += diff[i]; out[i] = running; }
  return out;
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`buildPrefixSum`, `countSubarraysWithSum`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`applyRangeAdds`, `buildPrefix2D`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `countSubarraysWithSum([1, 2, 1, 2], 3)`:

| x | running | running - k | seen before update | count |
|---|---|---|---|---|
| 1 | 1 | -2 | {0:1} | 0 |
| 2 | 3 | 0 | {0:1, 1:1} | 1 |
| 1 | 4 | 1 | {0:1, 1:1, 3:1} | 2 |
| 2 | 6 | 3 | {0:1, 1:1, 3:1, 4:1} | 3 |

## 5. Variations

- **Longest subarray with sum k:** store the *first* index of each prefix sum instead of a count.
- **Divisible by k:** key = `((running % k) + k) % k` (JS `%` can be negative).
- **Contiguous Array (0s and 1s):** treat 0 as -1, find the longest sum-0 subarray.
- **Product except self:** prefix products from the left, suffix products from the right.
- **2D prefix sums:** inclusion–exclusion, `buildPrefix2D` returns an O(1) query function.
- **Difference array in 2D / on events:** Corporate Flight Bookings, Car Pooling.

## 6. Common pitfalls

1. Forgetting the seed `seen = {0: 1}`: subarrays that start at index 0 are missed.
2. Updating the map *before* looking up: with k = 0 every element counts itself as an empty subarray.
3. Off-by-one: the prefix array has length n + 1. Range `[i, j]` uses `prefix[j + 1] - prefix[i]`.
4. Negative modulo in JS: `-1 % 5` is `-1`, not `4`.
5. Huge sums exceed `Number.MAX_SAFE_INTEGER` (2^53 - 1). Use `BigInt` or a modulus if values can be large.
6. Difference array of size n instead of n + 1: `diff[r + 1]` overflows when `r = n - 1`.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Range Sum Query - Immutable | Easy | O(1) range queries | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/01_Easy/02_range_sum_query_immutable.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/02_range_sum_query_immutable.js) |
| 2 | Find Pivot Index | Easy | left vs right sums | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/01_Easy/03_find_pivot_index.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/03_find_pivot_index.js) |
| 3 | Subarray Sum Equals K | Medium | prefix + count map | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/05_subarray_sum_equals_k.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/05_subarray_sum_equals_k.js) |
| 4 | Contiguous Array | Medium | 0 -> -1, first index map | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/07_contiguous_array.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/07_contiguous_array.js) |
| 5 | Subarray Sums Divisible by K | Medium | remainder counts | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/08_subarray_sums_divisible_by_k.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/08_subarray_sums_divisible_by_k.js) |
| 6 | Range Sum Query 2D | Medium | 2D inclusion–exclusion | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/11_range_sum_query_2d.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/11_range_sum_query_2d.js) |
| 7 | Corporate Flight Bookings | Medium | difference array | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/12_corporate_flight_bookings.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/12_corporate_flight_bookings.js) |
| 8 | Car Pooling | Medium | difference array over time | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/13_car_pooling.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/13_car_pooling.js) |
| 9 | Product of Array Except Self | Medium | prefix and suffix products | [statement](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/04_product_of_array_except_self.md) · [solution](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/solutions/04_product_of_array_except_self.js) |

## 8. Self-check

**Q1.** Why does `countSubarraysWithSum` start with `seen = {0: 1}`?

<details><summary>Answer</summary>

A subarray `nums[0..j]` has sum `prefix[j+1] - prefix[0]`, and `prefix[0] = 0`. Seeding 0 once represents "the empty prefix", so subarrays that start at index 0 are counted.

</details>

**Q2.** 10^5 updates "add 3 to positions 100..5000", then one final read of the array. Cost?

<details><summary>Answer</summary>

Difference array: O(1) per update, O(n) for the final running sum. Total O(n + q), instead of O(n * q) for touching every position.

</details>

**Q3.** Why can't you use prefix sums for "range max" queries?

<details><summary>Answer</summary>

Max is not invertible: you cannot "remove" the max of a prefix to get the max of the remaining part. Use a sparse table (static) or a segment tree (with updates).

</details>

---

Previous: [03. Sliding Window](03_sliding_window.md) · Next: [05. Fast & Slow Pointers](05_fast_and_slow_pointers.md) · [Pattern index](../../README.md)
