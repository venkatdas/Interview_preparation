# 06. Binary Search & Binary Search on the Answer

Binary search throws away half of the remaining candidates on every step, so it needs only
about log2(n) steps: 20 steps for a million items. It works whenever you can ask a yes/no
question whose answers look like `false false false true true true` — a **monotonic predicate**.
Your job is to find the first `true`.

That predicate can be about an array ("is `arr[i] >= target`?") or about the **answer itself**
("can we finish with speed k?"). The second form, *binary search on the answer*, turns many
"minimum X such that..." optimization problems into O(n log range).

**Teaches in depth:** [Searching](../../../10_Searching/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at binary search |
|---|---|
| "sorted array", "find target / insert position" | classic search, lower bound |
| "first / last position of", "count of x" | lower bound and upper bound |
| "rotated sorted array" | one half is always sorted |
| "minimum speed / capacity / days such that ..." | search the answer space with a feasibility check |
| "maximize the minimum", "minimize the maximum" | same: the check is monotonic |
| "peak element", "bitonic" | compare `mid` with `mid + 1` to pick a side |
| "O(log n)" required | almost always binary search |

**Constraint hints**

- Answer range up to 10^9 and a check costing O(n) -> O(n log 10^9) ≈ 30n. Fine.
- "sqrt", "kth smallest in a matrix", "median of two sorted arrays" -> search on values, not indices.

## 2. When it applies (preconditions)

- There is a predicate `P(x)` that is **monotonic** on the search space: once true, it stays true.
- You can evaluate `P(x)` cheaply (O(1) for arrays, O(n) for "simulate with capacity x").
- The search space has known bounds `[lo, hi]` that surely contain the answer.

## 3. When it does NOT apply

- **Unsorted data with no monotonic question.** `[4, 1, 3, 2]`, "find 3": `mid = 1` (value 1 < 3) suggests "go right", but nothing guarantees 3 is to the right. Use a hash set or a linear scan.
- **Non-monotonic feasibility.** "Pick a speed so that the total time is *exactly* H": exact equality is not monotonic (several speeds may give the same time, and some H are impossible). Rephrase as "time <= H" (monotonic) or use another method.
- **Rotated array with duplicates** (`[1, 1, 1, 0, 1]`): when `nums[lo] === nums[mid] === nums[hi]` you cannot tell which half is sorted. You must shrink by one (`lo++`), so the worst case becomes O(n).

## 4. The template

```js
function lowerBound(arr, target) {                 // first index with arr[i] >= target
  let left = 0;
  let right = arr.length;                          // answer can be arr.length (insert at end)
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (arr[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}

// canDo(x) is false...false true...true; find the first true in [low, high]
function binarySearchOnAnswer(low, high, canDo) {
  while (low < high) {
    const mid = low + ((high - low) >> 1);
    if (canDo(mid)) high = mid;
    else low = mid + 1;
  }
  return low;
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`binarySearch`, `lowerBound`, `upperBound`, `binarySearchOnAnswer`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`searchRotated`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** Koko: piles `[3, 6, 7, 11]`, H = 8, `canDo(k) = sum(ceil(p / k)) <= 8`, range [1, 11]:

| low | high | mid | hours(mid) | canDo | move |
|---|---|---|---|---|---|
| 1 | 11 | 6 | 1+1+2+2 = 6 | true | high = 6 |
| 1 | 6 | 3 | 1+2+3+4 = 10 | false | low = 4 |
| 4 | 6 | 5 | 1+2+2+3 = 8 | true | high = 5 |
| 4 | 5 | 4 | 1+2+2+3 = 8 | true | high = 4 -> answer 4 |

## 5. Variations

- **Last true** (maximize): search for the first false and subtract one, or use `mid = low + ((high - low + 1) >> 1)` with `low = mid` on true.
- **upperBound:** `arr[mid] <= target` moves left up. Count of x = `upperBound(x) - lowerBound(x)`.
- **Rotated array:** decide which half is sorted, then whether the target is inside it.
- **Peak element:** if `nums[mid] < nums[mid + 1]` a peak is to the right.
- **Search on real numbers:** loop a fixed 60–100 times instead of `low < high`.
- **2D matrix:** treat a row-major sorted matrix as one array of length rows*cols.

## 6. Common pitfalls

1. **Infinite loop** when `low = mid` with `mid = floor((low + high) / 2)`: with `low = 4, high = 5`, mid is 4 forever. Use the "first true" form above, or round mid up.
2. Mixing conventions: `[left, right]` closed with `while (left <= right)` vs `[left, right)` half-open with `while (left < right)`. Pick one per function.
3. `(left + right) >> 1` is fine in JS for indices, but `>>` is 32-bit: for values above 2^31 (answer ranges up to 10^10) use `Math.floor((left + right) / 2)`.
4. Wrong bounds on the answer: Koko's low is 1 (not 0, which divides by zero) and high is `max(piles)`.
5. Writing a check that is not monotonic, e.g. using `===` instead of `<=`.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Binary Search | Easy | classic | [statement](../../../10_Searching/03_Problems/01_Easy/01_binary_search.md) · [solution](../../../10_Searching/03_Problems/solutions/01_binary_search.js) |
| 2 | Search Insert Position | Easy | lower bound | [statement](../../../10_Searching/03_Problems/01_Easy/02_search_insert_position.md) · [solution](../../../10_Searching/03_Problems/solutions/02_search_insert_position.js) |
| 3 | First Bad Version | Easy | first true | [statement](../../../10_Searching/03_Problems/01_Easy/03_first_bad_version.md) · [solution](../../../10_Searching/03_Problems/solutions/03_first_bad_version.js) |
| 4 | First and Last Position | Medium | lower + upper bound | [statement](../../../10_Searching/03_Problems/02_Medium/04_first_and_last_position.md) · [solution](../../../10_Searching/03_Problems/solutions/04_first_and_last_position.js) |
| 5 | Search in Rotated Sorted Array | Medium | sorted half | [statement](../../../10_Searching/03_Problems/02_Medium/07_search_rotated_sorted_array.md) · [solution](../../../10_Searching/03_Problems/solutions/07_search_rotated_sorted_array.js) |
| 6 | Find Peak Element | Medium | compare with neighbor | [statement](../../../10_Searching/03_Problems/02_Medium/10_find_peak_element.md) · [solution](../../../10_Searching/03_Problems/solutions/10_find_peak_element.js) |
| 7 | Koko Eating Bananas | Medium | search on speed | [statement](../../../10_Searching/03_Problems/02_Medium/12_koko_eating_bananas.md) · [solution](../../../10_Searching/03_Problems/solutions/12_koko_eating_bananas.js) |
| 8 | Capacity to Ship Packages | Medium | search on capacity | [statement](../../../10_Searching/03_Problems/02_Medium/13_capacity_to_ship_packages.md) · [solution](../../../10_Searching/03_Problems/solutions/13_capacity_to_ship_packages.js) |
| 9 | Split Array Largest Sum | Hard | minimize the maximum | [statement](../../../10_Searching/03_Problems/03_Hard/14_split_array_largest_sum.md) · [solution](../../../10_Searching/03_Problems/solutions/14_split_array_largest_sum.js) |
| 10 | Median of Two Sorted Arrays | Hard | binary search a partition | [statement](../../../10_Searching/03_Problems/03_Hard/16_median_of_two_sorted_arrays.md) · [solution](../../../10_Searching/03_Problems/solutions/16_median_of_two_sorted_arrays.js) |

## 8. Self-check

**Q1.** What are safe `low` and `high` for Capacity to Ship Packages within D days?

<details><summary>Answer</summary>

`low = max(weights)` (every package must fit on some day), `high = sum(weights)` (ship everything in one day). The answer always lies in that range.

</details>

**Q2.** Why does `lowerBound` start with `right = arr.length` instead of `arr.length - 1`?

<details><summary>Answer</summary>

If every element is smaller than the target, the correct insertion point is `arr.length`. Using a half-open range `[left, right)` lets the search return that value.

</details>

**Q3.** "Maximize the minimum distance between k cows placed in stalls." What is the predicate and its direction?

<details><summary>Answer</summary>

`canPlace(d)` = "we can place k cows with every gap >= d" (greedy left to right). It is true for small d and becomes false once d is too big (true...true false...false), so you search for the **last true**.

</details>

---

Previous: [05. Fast & Slow Pointers](05_fast_and_slow_pointers.md) · Next: [07. Sorting + Greedy Selection](07_sorting_and_greedy_selection.md) · [Pattern index](../../README.md)
