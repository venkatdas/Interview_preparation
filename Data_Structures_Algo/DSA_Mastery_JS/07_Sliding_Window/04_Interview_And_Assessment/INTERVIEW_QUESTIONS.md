# Sliding Window — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. What problem does a sliding window solve, and what is the speed-up?

<details><summary>Model answer</summary>

Questions about contiguous subarrays or substrings ("longest", "shortest", "max sum of size k", "count windows"). Instead of recomputing every window from scratch (O(n·k) or O(n²)), you update the window state by adding the element that enters and removing the one that leaves. Each element enters and leaves at most once, so it is O(n).

</details>

### 2. Fixed-size vs variable-size windows: how do the templates differ?

<details><summary>Model answer</summary>

Fixed: build the first k elements, then for each new right index add `a[right]` and remove `a[right − k]`. Variable: expand `right` every step; while the window breaks the rule, shrink from `left`; then record the answer. For "shortest valid window", shrink while the window is *valid* and record inside that loop.

</details>

### 3. Why is the variable window O(n) even though it has a nested `while`?

<details><summary>Model answer</summary>

`left` only moves forward and never passes `right`. Across the whole run `left` moves at most n times in total, so all `while` iterations together are O(n). Total work is O(n) + O(n).

</details>

### 4. Why does the sliding window fail for "subarray sum equals k" when numbers can be negative?

<details><summary>Model answer</summary>

The window relies on monotonicity: adding an element makes the sum bigger, removing one makes it smaller. With negatives, adding can decrease the sum, so you cannot tell whether to grow or shrink. Use prefix sums with a hash map instead.

</details>

### 5. How do you count subarrays with exactly k distinct values?

<details><summary>Model answer</summary>

Exactly(k) = AtMost(k) − AtMost(k − 1). AtMost(k) is a standard window: for each right end, shrink until at most k distinct remain, then add `right − left + 1` (all windows ending at right that start in `[left, right]`). Exactly k cannot be shrunk directly because removing an element might drop below k and you would not know when to stop.

</details>

### 6. Explain the monotonic deque for Sliding Window Maximum.

<details><summary>Model answer</summary>

Keep indices in a deque whose values are decreasing from front to back. When a new value arrives, pop from the back every index with a smaller or equal value (they can never be a future maximum while the newer, bigger value is in the window). Pop the front if it left the window. The front is the current maximum. Each index is pushed and popped at most once: O(n).

</details>

### 7. In Longest Repeating Character Replacement, why is it OK to never decrease `maxFreq`?

<details><summary>Model answer</summary>

The window is valid when `length − maxFreq ≤ k`. The answer only improves if a window with a larger `maxFreq` appears. A stale (too high) `maxFreq` can make the window look valid when it is not, but then the window just slides without growing, so the best length recorded is never wrong. It saves recomputing the max over 26 letters.

</details>

### 8. How do you decide between sliding window, two pointers and prefix sums?

<details><summary>Model answer</summary>

Contiguous range plus a condition that changes monotonically as the window grows or shrinks → sliding window. Pairs from sorted input or in-place compaction → two pointers. Many range queries, or exact sum targets with negatives → prefix sums (with a hash map for counting).

</details>

### 9. Minimum Window Substring: what state do you track?

<details><summary>Model answer</summary>

A `need` map of required counts from t, a `have` map for the window, and a counter `formed` of how many distinct characters currently meet their required count. Expand right; when `formed` equals the number of distinct required characters, record the window and shrink from the left until it breaks. Store start and length, slice once at the end.

</details>

### 10. Where does the sliding window show up outside interview puzzles?

<details><summary>Model answer</summary>

Rate limiting (requests in the last 60 seconds), moving averages in dashboards, network flow control (TCP window), streaming analytics, and debouncing logic. The same "add new, drop old" idea keeps per-event cost constant.

</details>

### 11. What edge cases do you test for a window problem?

<details><summary>Model answer</summary>

Empty input, k larger than the array, k = 0 or 1, all elements equal, a window that is the whole array, no valid window at all (return 0 or ""), and for counting problems a map entry that drops to 0 and must be deleted.

</details>
