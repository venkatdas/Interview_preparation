# 09. Monotonic Stack & Monotonic Queue

A **monotonic stack** keeps its elements sorted (always increasing or always decreasing from
bottom to top). When a new element breaks the order, you pop until the order is restored — and
every pop is a moment where you learn something: "the popped element just found its next
greater (or smaller) element". Each index is pushed once and popped once, so the whole scan is
O(n), even though there is a `while` inside the `for`.

A **monotonic queue (deque)** is the same idea with removal from the front too. It gives the
max or min of a **sliding window** in O(1) per step.

**Teaches in depth:** [Monotonic Stacks & Queues](../../../18_Monotonic_Stacks_And_Queues/README.md), [Stacks](../../../16_Stacks/README.md), [Queues & Deques](../../../17_Queues_And_Deques/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at a monotonic stack / queue |
|---|---|
| "next greater / smaller element", "next warmer day" | pop resolves the answer for the popped index |
| "previous smaller", "how far to the left until..." | the stack top after popping is the answer |
| "stock span", "number of consecutive days" | count how many were popped (or index gap) |
| "largest rectangle in histogram", "maximal rectangle" | each bar's left/right smaller boundaries |
| "sum of subarray minimums" | each element's contribution range |
| "remove k digits to make smallest", "smallest subsequence" | greedy pop of bigger digits |
| "max / min of every window of size k" | monotonic deque |

**Constraint hints**

- n up to 10^5 and the brute force "for each i scan right until..." is O(n^2) -> monotonic stack makes it O(n).
- "Shortest subarray with sum >= k" with **negative** numbers -> prefix sums + monotonic deque.

## 2. When it applies (preconditions)

- For each element you need the **nearest** element to the left or right that is bigger/smaller.
- Once an element is "beaten" by a newer, better one, it can never be the answer for anyone later. That "dominated forever" property is what allows popping.

## 3. When it does NOT apply

- **Not nearest, but k-th greater or "any greater within distance d".** For `[1, 5, 3, 4]`, "the second greater element to the right of 1" is 4, but the monotonic stack only tracks the first greater (5). Use two stacks (a special trick), a heap, or a sorted structure.
- **Global order questions.** "Kth largest overall" has nothing to do with neighbors; use a heap ([10](10_top_k_and_heaps.md)).
- **Window of variable, condition-based size** (e.g. "longest window where max - min <= limit") needs *two* deques plus a sliding window — the plain template is not enough alone.

## 4. The template

```js
// Next greater value to the right (-1 if none). Stack holds indices with decreasing values.
function nextGreater(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      result[stack.pop()] = nums[i];   // nums[i] resolves everything smaller on top
    }
    stack.push(i);
  }
  return result;
}

// Max of every window of size k with a monotonic deque. O(n).
function slidingWindowMax(nums, k) {
  if (k <= 0 || k > nums.length) return [];
  const dq = [];                                   // indices, values decreasing front -> back
  let head = 0;                                    // dq[head..] is the live deque (no O(n) shift)
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[head] <= i - k) head++;                 // front fell out of the window
    if (i >= k - 1) out.push(nums[dq[head]]);
  }
  return out;
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`nextGreater`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`previousSmallerIndex`, `slidingWindowMax`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `nextGreater([2, 1, 5, 3])`:

| i | nums[i] | pops (resolved) | stack (values) after push |
|---|---|---|---|
| 0 | 2 | — | [2] |
| 1 | 1 | — | [2, 1] |
| 2 | 5 | 1 -> 5, 2 -> 5 | [5] |
| 3 | 3 | — | [5, 3] |

Result `[5, 5, -1, -1]`.

## 5. Variations

- **Next smaller:** flip the comparison (`>` instead of `<`).
- **Previous greater/smaller:** read the stack top *after* popping, before pushing.
- **Circular array:** loop `i` from 0 to 2n - 1 and use `i % n`.
- **Histogram:** when a bar is popped, its width spans from the new top + 1 to `i - 1`.
- **Contribution technique:** `sum of subarray minimums` = Σ `a[i] * left[i] * right[i]`; break ties with `<` on one side and `<=` on the other to avoid double counting.
- **Greedy digit removal:** pop while the top is bigger than the current digit and k > 0.

## 6. Common pitfalls

1. Storing **values** instead of **indices**: you lose the position needed for distances and widths.
2. Using `queue.shift()` for the deque front. It is O(n) in JS. Keep a `head` index (as above) or a real deque.
3. Strict vs non-strict comparison with duplicates: decide whether equal values pop each other.
4. Forgetting leftover elements in the stack at the end (they have no greater element: keep `-1`, or flush them for histograms with a sentinel bar of height 0).
5. Thinking it is O(n^2) because of the nested loop. Each index is pushed once and popped at most once: amortized O(n).

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Next Greater Element I & II | Easy | basic + circular | [statement](../../../16_Stacks/03_Problems/01_Easy/06_next_greater_element.md) · [solution](../../../16_Stacks/03_Problems/solutions/06_next_greater_element.js) |
| 2 | Daily Temperatures | Medium | index distance to next greater | [statement](../../../16_Stacks/03_Problems/02_Medium/05_daily_temperatures.md) · [solution](../../../16_Stacks/03_Problems/solutions/05_daily_temperatures.js) |
| 3 | Online Stock Span | Medium | previous greater | [statement](../../../18_Monotonic_Stacks_And_Queues/03_Problems/02_Medium/01_online_stock_span.md) · [solution](../../../18_Monotonic_Stacks_And_Queues/03_Problems/solutions/01_online_stock_span.js) |
| 4 | Remove K Digits | Medium | greedy monotonic stack | [statement](../../../16_Stacks/03_Problems/02_Medium/09_remove_k_digits.md) · [solution](../../../16_Stacks/03_Problems/solutions/09_remove_k_digits.js) |
| 5 | Sum of Subarray Minimums | Medium | contribution ranges | [statement](../../../18_Monotonic_Stacks_And_Queues/03_Problems/02_Medium/03_sum_of_subarray_minimums.md) · [solution](../../../18_Monotonic_Stacks_And_Queues/03_Problems/solutions/03_sum_of_subarray_minimums.js) |
| 6 | Shortest Unsorted Continuous Subarray | Medium | boundaries via stack | [statement](../../../18_Monotonic_Stacks_And_Queues/03_Problems/02_Medium/02_shortest_unsorted_continuous_subarray.md) · [solution](../../../18_Monotonic_Stacks_And_Queues/03_Problems/solutions/02_shortest_unsorted_continuous_subarray.js) |
| 7 | Sliding Window Maximum | Hard | monotonic deque | [statement](../../../07_Sliding_Window/03_Problems/03_Hard/12_sliding_window_maximum.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/12_sliding_window_maximum.js) |
| 8 | Largest Rectangle in Histogram | Hard | left/right smaller | [statement](../../../18_Monotonic_Stacks_And_Queues/03_Problems/03_Hard/04_largest_rectangle_in_histogram.md) · [solution](../../../18_Monotonic_Stacks_And_Queues/03_Problems/solutions/04_largest_rectangle_in_histogram.js) |
| 9 | Maximal Rectangle | Hard | histogram per row | [statement](../../../18_Monotonic_Stacks_And_Queues/03_Problems/03_Hard/05_maximal_rectangle.md) · [solution](../../../18_Monotonic_Stacks_And_Queues/03_Problems/solutions/05_maximal_rectangle.js) |
| 10 | Shortest Subarray with Sum at Least K | Hard | prefix sums + deque | [statement](../../../17_Queues_And_Deques/03_Problems/03_Hard/08_shortest_subarray_sum_at_least_k.md) · [solution](../../../17_Queues_And_Deques/03_Problems/solutions/08_shortest_subarray_sum_at_least_k.js) |

## 8. Self-check

**Q1.** Why is the monotonic stack O(n) with a nested `while`?

<details><summary>Answer</summary>

Every index is pushed exactly once and popped at most once. The total number of inner-loop iterations across the entire scan is at most n.

</details>

**Q2.** In Sliding Window Maximum, why can we drop smaller elements from the back of the deque forever?

<details><summary>Answer</summary>

If `nums[j] <= nums[i]` and `j < i`, then `j` leaves the window earlier than `i` and is never bigger. So `j` can never be the maximum of any future window.

</details>

**Q3.** Which comparison gives "next greater or equal" instead of "next strictly greater"?

<details><summary>Answer</summary>

Pop while `nums[top] <= nums[i]`. Then an equal value also resolves the popped index.

</details>

---

Previous: [08. Intervals & Sweep Line](08_intervals_and_sweep_line.md) · Next: [10. Top-K & Heaps](10_top_k_and_heaps.md) · [Pattern index](../../README.md)
