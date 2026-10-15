# 03. Sliding Window

A sliding window is a **contiguous** range `[left, right]` that moves through an array or
string. Instead of recomputing every subarray from scratch (O(n^2) or worse), you **add** the
element entering on the right and **remove** the one leaving on the left. Each index enters
once and leaves once, so the work is O(n).

Two kinds:

- **Fixed size k:** the window always has k elements.
- **Variable size:** grow with `right`; shrink with `left` while the window is invalid (for "longest") or while it is still valid (for "shortest").

**Teaches in depth:** [Sliding Window](../../../07_Sliding_Window/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at a sliding window |
|---|---|
| "contiguous subarray / substring" | a window is exactly a contiguous range |
| "longest / shortest / maximum / minimum length" | optimize the window length |
| "of size k", "every k consecutive" | fixed window |
| "at most k distinct", "at most k replacements / flips" | variable window with a validity count |
| "contains all characters of", "anagram of p in s" | window with a frequency map |
| "sum >= target" with **positive** numbers | shrink while still valid |

**Constraint hints**

- n up to 10^5 and "substring" -> O(n) or O(n log n). Brute force over all substrings is O(n^2) or O(n^3).
- Values are **non-negative** -> sums grow when you extend and shrink when you cut. That monotonicity is what makes shrinking safe.

## 2. When it applies (preconditions)

The validity must be **monotonic**: if a window is valid, every smaller window inside it is valid
too (for "longest"), or if it is valid, every bigger window containing it is valid too (for
"shortest"). Then the left pointer never needs to move back.

## 3. When it does NOT apply

- **Negative numbers with a sum condition.** "Shortest subarray with sum >= 3" on `[1, -2, 3]`:
  the window sums are 1, then -1, then 2, so the window is never "valid" and the template returns 0.
  The real answer is 1 (`[3]`). The negative number broke the rule "extending only increases the sum".
  Use prefix sums + a monotonic deque ([09](09_monotonic_stack_and_queue.md)), or prefix sums + map for "equals k" ([04](04_prefix_sums_and_difference_arrays.md)).
- **Subsequences** (not contiguous). "Longest increasing subsequence" can skip elements, so no window. Use DP ([20](20_subarray_vs_subsequence.md)).
- **"Exactly k" counts directly.** Count windows with exactly k distinct values via
  `atMost(k) - atMost(k - 1)`; a single window cannot count them.

## 4. The template

```js
// Fixed window
function maxSumFixedWindow(nums, k) {
  if (k <= 0 || k > nums.length) return -Infinity;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];          // add the new element, drop the old one
    best = Math.max(best, sum);
  }
  return best;
}

// Variable window, LONGEST valid: shrink while invalid, then record
function longestWithAtMostKDistinct(arr, k) {
  const count = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < arr.length; right++) {
    count.set(arr[right], (count.get(arr[right]) || 0) + 1);
    while (count.size > k) {                       // window invalid -> shrink from the left
      const x = arr[left++];
      count.set(x, count.get(x) - 1);
      if (count.get(x) === 0) count.delete(x);
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// Variable window, SHORTEST valid: record, then shrink while still valid
function minSubarrayLenAtLeast(nums, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {                        // valid -> record, then try to shrink
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`maxSumFixedWindow`, `longestWithAtMostKDistinct`, `minSubarrayLenAtLeast`), [templates.js](../../02_Implementations/templates.js) (`longestUniqueSubstring`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `minSubarrayLenAtLeast([2, 3, 1, 2, 4, 3], 7)`:

| right | add | sum | shrink steps | best |
|---|---|---|---|---|
| 0..2 | 2,3,1 | 6 | none | Inf |
| 3 | 2 | 8 | record 4, drop 2 -> 6 | 4 |
| 4 | 4 | 10 | record 4, drop 3 -> 7, record 3, drop 1 -> 6 | 3 |
| 5 | 3 | 9 | record 3, drop 2 -> 7, record 2, drop 4 -> 3 | 2 |

## 5. Variations

- **Longest substring without repeats:** store the last index of each char and jump `left` past it (`longestUniqueSubstring`).
- **Character replacement:** valid while `windowLen - maxFreq <= k`.
- **Anagram / permutation in string:** fixed window of length `p.length` plus a "matched" counter.
- **Minimum window substring:** shortest window covering all needed counts; track `formed`.
- **Exactly k:** `atMost(k) - atMost(k - 1)` (Subarrays with K Different Integers, Count Nice Subarrays).
- **Window maximum:** the window is fixed but you need its max -> monotonic deque.

## 6. Common pitfalls

1. Using `if` instead of `while` when shrinking: one step may not be enough to restore validity.
2. Recording the answer in the wrong place: "longest" records after shrinking; "shortest" records inside the shrink loop.
3. Forgetting to delete zero counts from the `Map`, so `count.size` is wrong.
4. Applying it to negative numbers with sum conditions (see section 3).
5. Off-by-one in length: it is `right - left + 1`.
6. Building `s.slice(left, right + 1)` every step makes it O(n^2). Store indices and slice once at the end.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Maximum Average Subarray I | Easy | fixed window sum | [statement](../../../07_Sliding_Window/03_Problems/01_Easy/01_maximum_average_subarray.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/01_maximum_average_subarray.js) |
| 2 | Longest Substring Without Repeating | Medium | variable, last-seen map | [statement](../../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/03_longest_substring_without_repeating.js) |
| 3 | Longest Repeating Character Replacement | Medium | len - maxFreq <= k | [statement](../../../07_Sliding_Window/03_Problems/02_Medium/04_longest_repeating_character_replacement.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/04_longest_repeating_character_replacement.js) |
| 4 | Minimum Size Subarray Sum | Medium | shortest, positives | [statement](../../../07_Sliding_Window/03_Problems/02_Medium/05_minimum_size_subarray_sum.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/05_minimum_size_subarray_sum.js) |
| 5 | Permutation in String | Medium | fixed window counts | [statement](../../../07_Sliding_Window/03_Problems/02_Medium/06_permutation_in_string.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/06_permutation_in_string.js) |
| 6 | Fruit Into Baskets | Medium | at most 2 distinct | [statement](../../../07_Sliding_Window/03_Problems/02_Medium/08_fruit_into_baskets.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/08_fruit_into_baskets.js) |
| 7 | Max Consecutive Ones III | Medium | at most k zeros | [statement](../../../07_Sliding_Window/03_Problems/02_Medium/09_max_consecutive_ones_iii.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/09_max_consecutive_ones_iii.js) |
| 8 | Subarrays with K Different Integers | Hard | atMost(k) - atMost(k-1) | [statement](../../../07_Sliding_Window/03_Problems/03_Hard/11_subarrays_with_k_different_integers.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/11_subarrays_with_k_different_integers.js) |
| 9 | Minimum Window Substring | Hard | shortest covering window | [statement](../../../07_Sliding_Window/03_Problems/03_Hard/14_minimum_window_substring.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/14_minimum_window_substring.js) |

## 8. Self-check

**Q1.** Why is the variable window O(n) even though it has a nested `while`?

<details><summary>Answer</summary>

`left` only moves forward and never past `right`, so across the whole run it moves at most n times. Total pointer moves are at most 2n.

</details>

**Q2.** Count subarrays with *exactly* 3 distinct values. What do you compute?

<details><summary>Answer</summary>

`atMost(3) - atMost(2)`, where `atMost(k)` adds `right - left + 1` (the number of valid windows ending at `right`) on every step.

</details>

**Q3.** "Longest subarray with sum <= k" and the array has negatives. Window or not?

<details><summary>Answer</summary>

Not a plain window: removing a negative from the left can *increase* the sum, so validity is not monotonic. Use prefix sums with a sorted structure / monotonic stack of prefix minima, or binary search over prefix sums.

</details>

---

Previous: [02. Two Pointers](02_two_pointers.md) · Next: [04. Prefix Sums & Difference Arrays](04_prefix_sums_and_difference_arrays.md) · [Pattern index](../../README.md)
