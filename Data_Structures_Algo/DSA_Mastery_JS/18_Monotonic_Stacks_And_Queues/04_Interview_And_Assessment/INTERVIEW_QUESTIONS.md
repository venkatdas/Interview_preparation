# Monotonic Stacks & Queues — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What is a monotonic stack?

<details><summary>Model answer</summary>

A stack whose values (usually stored as indices) are kept increasing or decreasing from bottom to top. Before pushing a new item you pop everything that would break the order. The popped items have just found their "next smaller/greater" element: the new item.

</details>

### 2. Why is the monotonic stack O(n) despite a `while` inside a `for`?

<details><summary>Model answer</summary>

Amortized analysis: each index is pushed exactly once and popped at most once, so the total number of pops across the whole loop is ≤ n. Total work is O(n).

</details>

### 3. How do you choose increasing vs decreasing?

<details><summary>Model answer</summary>

Ask what pops an element. For "next **greater**", a bigger incoming value resolves the top, so the stack stays **decreasing**. For "next **smaller**", a smaller incoming value pops, so the stack stays **increasing**. The stack holds items still waiting for their answer.

</details>

### 4. Why store indices instead of values?

<details><summary>Model answer</summary>

Indices give distances (days until warmer, widths of rectangles), let you look values up again, distinguish duplicates, and let a deque check whether its front has left a window.

</details>

### 5. How do duplicates affect "sum of subarray minimums"-style counting?

<details><summary>Model answer</summary>

Each subarray must be counted once. With equal values, both could claim to be "the minimum". Use a strict comparison on one side and non-strict on the other (e.g. previous **less**, next **less-or-equal**), so ties are broken consistently.

</details>

### 6. How does the largest-rectangle-in-histogram algorithm compute widths?

<details><summary>Model answer</summary>

Keep an increasing stack. When bar `i` is lower than the top, pop the top `h`; its rectangle spans from the new top + 1 to `i − 1`, width `i − newTop − 1` (or `i` if the stack is empty). A height-0 sentinel at the end pops everything left.

</details>

### 7. How does Maximal Rectangle reduce to the histogram problem?

<details><summary>Model answer</summary>

Process the matrix row by row, keeping `heights[c]` = number of consecutive 1s ending at the current row in column c (reset to 0 on a 0). Each row is a histogram; run the stack algorithm per row. O(rows × cols).

</details>

### 8. What is a monotonic deque and how does it differ from a monotonic stack?

<details><summary>Model answer</summary>

Same invariant, but items can also leave from the front when they slide out of a window. The front is the current window's best (max or min). Used for sliding window max/min, Jump Game VI (max of the last k DP values), and shortest subarray with sum ≥ K.

</details>

### 9. Jump Game VI: why does a deque beat a heap?

<details><summary>Model answer</summary>

`dp[i] = nums[i] + max(dp[i−k..i−1])`. A max-heap with lazy deletion works in O(n log n). A decreasing deque of indices gives the window max in O(1) amortized, so O(n) total.

</details>

### 10. Online Stock Span: what does the stack store?

<details><summary>Model answer</summary>

Pairs `[price, span]` with prices decreasing. When a new price arrives, pop every pair with price ≤ new price and add their spans to the new span (1 + sum). Push the new pair. Amortized O(1) per call.

</details>

### 11. When is a monotonic stack the wrong tool?

<details><summary>Model answer</summary>

When queries are arbitrary ranges rather than nearest-to-one-side (use a sparse table or segment tree), when elements change over time, or when you need the k-th largest rather than the nearest greater.

</details>

### 12. How would you explain a monotonic stack solution in an interview?

<details><summary>Model answer</summary>

Start with the O(n²) "for each element scan to the right". Point out the waste: elements that are smaller than a later element can never be anyone's answer. Introduce the stack as "elements still waiting for their answer", state the invariant, show one dry run, then argue O(n) via push/pop counts.

</details>
