# 02. Two Pointers

Two indices walk through the data so that each step **throws away** candidates you no longer
need. Two shapes cover almost every problem:

- **Opposite ends:** `left = 0`, `right = n - 1`, move inward. Works when the array is sorted (or symmetric, like a palindrome).
- **Same direction (slow / fast, reader / writer):** `read` scans every element, `write` marks where the next kept element goes. Used for in-place filtering.

Each pointer moves at most n times, so the loop is O(n) instead of the O(n^2) "check every pair".

**Teaches in depth:** [Two Pointers](../../../06_Two_Pointers/README.md), [Arrays](../../../03_Arrays/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at two pointers |
|---|---|
| "sorted array", "pair / triplet that sums to" | sum too small -> move left up; too big -> move right down |
| "palindrome", "reverse", "compare from both ends" | symmetric positions meet in the middle |
| "in place", "O(1) extra space", "remove / move zeroes" | reader/writer pointers overwrite the array |
| "container", "most water", "trap" | the shorter side limits the answer, so move it |
| "merge two sorted arrays / lists" | one pointer per input |
| "is subsequence" | one pointer per string |

**Constraint hints**

- Sorted input + "pair" -> O(n) two pointers beats O(n log n) binary search per element.
- "Do not allocate another array" -> same-direction reader/writer.
- 3Sum / 4Sum: sort once O(n log n), then fix one (or two) values and run two pointers.

## 2. When it applies (preconditions)

- Opposite ends: moving one pointer must **provably** discard options. Sorted order gives that: if `a[l] + a[r] < target`, then `a[l]` with any element left of `r` is even smaller, so `l` can move.
- Same direction: you keep a prefix `[0, write)` that is already correct and grow it.

## 3. When it does NOT apply

- **Unsorted input where indices must be returned.** Two Sum on `[3, 1, 2]` target 5: sorting
  gives `[1, 2, 3]` and the pair `(2, 3)`, but the original indices are lost unless you carry them along. A hash map ([01](01_hash_map_and_frequency_counting.md)) is simpler and O(n).
- **Subarray sum = k with negative numbers.** `[1, -1, 5]`, k = 5: the window logic "grow when small, shrink when big" breaks because adding an element can make the sum smaller. Use prefix sums + a map ([04](04_prefix_sums_and_difference_arrays.md)).
- **No monotonic rule for moving.** If neither pointer can be safely moved, you are guessing. That means a different pattern (DP, hashing).

## 4. The template

```js
// Opposite ends (sorted input): indices of a pair summing to target, or null
function twoPointersOppositeEnds(sorted, target) {
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}

// Same direction (reader / writer): remove duplicates from a sorted array
function dedupeSorted(sorted) {
  const out = sorted.slice();
  let write = 0;                                   // out[0..write-1] is the answer so far
  for (let read = 0; read < out.length; read++) {
    if (read === 0 || out[read] !== out[write - 1]) out[write++] = out[read];
  }
  out.length = write;
  return out;
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`twoPointersOppositeEnds`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`dedupeSorted`, `threeSum`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `twoPointersOppositeEnds([1, 3, 4, 6, 9], 10)`:

| left | right | sum | move |
|---|---|---|---|
| 0 (1) | 4 (9) | 10 | found -> [0, 4] |

and with target 7: `1+9=10` too big -> right=3; `1+6=7` -> [0, 3].

## 5. Variations

- **3Sum / 3Sum Closest / 4Sum:** sort, loop the first index (and second for 4Sum), two pointers on the rest; skip equal neighbors to avoid duplicate answers.
- **Container With Most Water:** move the pointer at the **shorter** wall; moving the taller one can never help.
- **Trapping Rain Water:** keep `leftMax` and `rightMax`; process the side with the smaller max.
- **Dutch national flag (Sort Colors):** three pointers `low`, `mid`, `high`.
- **Squares of a sorted array:** largest squares are at the ends; fill the output from the back.
- **Two inputs:** merge sorted arrays, is-subsequence, backspace compare (scan from the back).

## 6. Common pitfalls

1. `nums.sort()` without a comparator sorts **as strings**: `[10, 9, 1].sort()` is `[1, 10, 9]`. Always `sort((a, b) => a - b)`.
2. `while (left <= right)` vs `left < right`: for pairs you need two *different* elements, so `<`.
3. Forgetting to skip duplicates in 3Sum returns `[-1, 0, 1]` twice.
4. Moving both pointers after a match when duplicates matter for counting (e.g. counting pairs) undercounts.
5. Sorting destroys original indices. Sort `[value, index]` pairs if you need them.
6. Mutating the caller's array in place when they did not expect it. Say so or copy first.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Valid Palindrome II | Easy | ends move inward, one skip allowed | [statement](../../../06_Two_Pointers/03_Problems/01_Easy/02_valid_palindrome_ii.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/02_valid_palindrome_ii.js) |
| 2 | Squares of a Sorted Array | Easy | largest at the ends | [statement](../../../06_Two_Pointers/03_Problems/01_Easy/07_squares_of_sorted_array.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/07_squares_of_sorted_array.js) |
| 3 | Move Zeroes | Easy | reader / writer | [statement](../../../06_Two_Pointers/03_Problems/01_Easy/05_move_zeroes.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/05_move_zeroes.js) |
| 4 | Two Sum II (sorted) | Medium | opposite ends | [statement](../../../06_Two_Pointers/03_Problems/02_Medium/03_two_sum_ii_sorted.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/03_two_sum_ii_sorted.js) |
| 5 | Container With Most Water | Medium | move the shorter wall | [statement](../../../06_Two_Pointers/03_Problems/02_Medium/11_container_with_most_water.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/11_container_with_most_water.js) |
| 6 | 3Sum | Medium | sort + fix one + two pointers | [statement](../../../06_Two_Pointers/03_Problems/02_Medium/13_three_sum.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/13_three_sum.js) |
| 7 | Sort Colors | Medium | three pointers | [statement](../../../06_Two_Pointers/03_Problems/02_Medium/16_sort_colors.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/16_sort_colors.js) |
| 8 | Boats to Save People | Medium | pair heaviest with lightest | [statement](../../../06_Two_Pointers/03_Problems/02_Medium/17_boats_to_save_people.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/17_boats_to_save_people.js) |
| 9 | Trapping Rain Water | Hard | left/right max | [statement](../../../06_Two_Pointers/03_Problems/03_Hard/12_trapping_rain_water.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/12_trapping_rain_water.js) |

## 8. Self-check

**Q1.** In Container With Most Water, why is it safe to move the shorter wall?

<details><summary>Answer</summary>

The area is `min(h[l], h[r]) * width`. If `h[l]` is the shorter wall, every container that keeps
`l` and uses a right wall closer than `r` has a smaller width and height at most `h[l]`. So none of them can beat the current one, and `l` can be discarded.

</details>

**Q2.** Why does 3Sum sort first, and what does that cost?

<details><summary>Answer</summary>

Sorting enables the opposite-ends rule and makes duplicates adjacent so you can skip them. It costs O(n log n), which is dominated by the O(n^2) main loop.

</details>

**Q3.** What does the `write` pointer mean in the reader/writer template?

<details><summary>Answer</summary>

It is the length of the finished prefix: `out[0..write-1]` already holds the answer. Each kept element goes to `out[write]` and `write` grows by one. That is the loop invariant.

</details>

---

Previous: [01. Hash Map & Frequency Counting](01_hash_map_and_frequency_counting.md) · Next: [03. Sliding Window](03_sliding_window.md) · [Pattern index](../../README.md)
