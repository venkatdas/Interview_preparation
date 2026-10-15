# Sliding Window — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Multiple choice — a sliding window applies directly to

A) subsequences  B) contiguous subarrays with a monotone condition  C) any pair of elements  D) sorted arrays only

<details><summary>Answer</summary>

**B.**

</details>

### Q2. Predict the output

```js
const a = [2, 1, 5, 1, 3, 2], k = 3;
let s = a[0] + a[1] + a[2], best = s;
for (let r = k; r < a.length; r++) { s += a[r] - a[r - k]; best = Math.max(best, s); }
console.log(best);
```

<details><summary>Answer</summary>

`9` (window `[5, 1, 3]`).

</details>

### Q3. Complexity — longest substring without repeating characters with a Set and an inner `while`

<details><summary>Answer</summary>

O(n) time: each character is added once and removed at most once. O(min(n, alphabet)) space.

</details>

### Q4. Spot the bug (distinct-count window)

```js
counts.set(x, counts.get(x) - 1);
while (counts.size > k) { ... }
```

<details><summary>Answer</summary>

When a count reaches 0 the key is not deleted, so `counts.size` still counts that value and the window shrinks too much. Add `if (counts.get(x) === 0) counts.delete(x);`.

</details>

### Q5. Multiple choice — for "count subarrays with exactly k odd numbers" the cleanest window approach is

A) shrink when odd count equals k  B) atMost(k) − atMost(k − 1)  C) sort first  D) binary search on k

<details><summary>Answer</summary>

**B.**

</details>

### Q6. Predict the output (minimum size subarray sum)

`target = 7`, `nums = [2, 3, 1, 2, 4, 3]`. What is the answer?

<details><summary>Answer</summary>

`2` (subarray `[4, 3]`).

</details>

### Q7. Spot the bug (minimum size subarray sum)

```js
while (sum >= target) { sum -= nums[left]; left++; best = Math.min(best, right - left + 1); }
```

<details><summary>Answer</summary>

The answer is recorded after shrinking, so it measures a window that may no longer be valid and is one too short. Record `best` before removing `nums[left]`.

</details>

### Q8. Complexity — Sliding Window Maximum with a monotonic deque vs a max-heap

<details><summary>Answer</summary>

Deque: O(n) time, O(k) space. Heap: O(n log k) (or O(n log n) with lazy deletion).

</details>

### Q9. Multiple choice — which input breaks the "shrink while sum > target" window?

A) all positive numbers  B) numbers containing negatives  C) all equal numbers  D) an empty array

<details><summary>Answer</summary>

**B.**

</details>

### Q10. Predict the deque contents

Running the max-deque on `[1, 3, -1, -3, 5]` with k = 3, which **indices** are in the deque right after processing index 3?

<details><summary>Answer</summary>

`[1, 2, 3]` (values 3, −1, −3, decreasing). Index 0 was popped when 3 arrived.

</details>

### Q11. Spot the bug (fixed window)

```js
for (let r = 0; r < n; r++) { sum += a[r]; sum -= a[r - k]; if (r >= k - 1) best = Math.max(best, sum); }
```

<details><summary>Answer</summary>

For `r < k`, `a[r - k]` is `undefined`, so `sum` becomes `NaN`. Only subtract when `r >= k`.

</details>

### Q12. Multiple choice — Fruit Into Baskets is the same as

A) longest subarray with at most 2 distinct values  B) two most frequent values  C) longest increasing run  D) maximum sum of size 2

<details><summary>Answer</summary>

**A.**

</details>

## Mastery checklist

- [ ] I can write the fixed and variable window templates from memory.
- [ ] I can explain why the variable window is O(n) despite the inner loop.
- [ ] I know when a window fails (negatives, subsequences, exactly-k) and what to use instead.
- [ ] I can solve Longest Substring Without Repeating Characters, Minimum Window Substring and Sliding Window Maximum.
- [ ] I scored at least 10/12 on this quiz.
