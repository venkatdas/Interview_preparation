# Arrays — Interview Questions

Conceptual questions interviewers ask about arrays. Try to answer out loud first, then open the model answer. Theory lives in [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. Why is reading `arr[i]` O(1) but `arr.includes(x)` O(n)?

<details><summary>Model answer</summary>

Array slots sit side by side in memory, so the address of slot `i` is `start + i * slotSize`: one multiply, one add, one read. That does not depend on n. `includes` has no index for values, so it must compare `x` with each slot until it finds a match or reaches the end; in the worst case it looks at all n slots.

</details>

### 2. What does "amortized O(1)" mean for `push` on a dynamic array?

<details><summary>Model answer</summary>

When the backing store is full, the array allocates a bigger block (usually double) and copies everything, which costs O(n) for that one push. But doubling means copies happen at sizes 1, 2, 4, ..., n/2, which add up to less than n. So n pushes cost less than 2n work in total, and the *average* per push is O(1). A single push can still be slow; amortized talks about the sequence.

</details>

### 3. Why are `shift` and `unshift` slow, and what do you use instead for a queue?

<details><summary>Model answer</summary>

Both move every remaining element one slot (left for `shift`, right for `unshift`), so they are O(n). For a queue, keep a `head` index and read `arr[head++]` instead of shifting, or use a circular buffer / deque class. That makes dequeue O(1).

</details>

### 4. Explain Kadane's algorithm and why it is correct.

<details><summary>Model answer</summary>

Walk the array keeping `cur`, the best sum of a subarray that *ends at the current index*. For each `x`, either extend the previous subarray (`cur + x`) or start fresh at `x`; take the larger. The answer is the maximum `cur` seen. It is correct because any best subarray ends somewhere, and at that index `cur` is exactly the best sum ending there: if the best prefix before it were negative, dropping it can only help. O(n) time, O(1) space.

</details>

### 5. When would you choose a hash map over sorting + two pointers for "find a pair with sum target"?

<details><summary>Model answer</summary>

Hash map: O(n) time, O(n) space, keeps original indices, works on unsorted input. Sort + two pointers: O(n log n) time, O(1) extra space (if sorting in place is allowed), but loses original indices unless you sort index pairs. Pick the map when indices are needed or speed matters; pick pointers when memory is tight or the input is already sorted.

</details>

### 6. How do you remove elements from an array in place without `splice` in a loop?

<details><summary>Model answer</summary>

Use a write pointer. Read every element once; when it should be kept, copy it to `arr[write]` and increment `write`. At the end `arr[0..write-1]` is the result and `write` is the new length. This is O(n) time and O(1) space. `splice` inside a loop is O(n) per call (O(n²) total) and also skips elements because indices shift.

</details>

### 7. How does rotating an array by k using three reversals work?

<details><summary>Model answer</summary>

To rotate right by k: set `k %= n`, reverse the whole array, then reverse the first k elements and reverse the remaining n − k. Reversing the whole array puts the last k elements at the front but backwards; the two partial reversals fix the order inside each part. O(n) time, O(1) space.

</details>

### 8. What is the "index as hash" trick and when can you use it?

<details><summary>Model answer</summary>

When values are in the range 1..n (or 0..n−1) and you may modify the input, use the array itself as a presence table: for value v, mark slot `v − 1` (for example by negating it, or by swapping v into its home slot in cyclic sort). Afterwards, unmarked slots reveal missing values and double-marked slots reveal duplicates. It gives O(n) time with O(1) extra space. It does not work for arbitrary ranges or when the input must stay unchanged.

</details>

### 9. What is the shared-row trap when creating a 2D array in JavaScript?

<details><summary>Model answer</summary>

`new Array(rows).fill(new Array(cols).fill(0))` (or `fill([])`) puts the *same* row object into every slot, because `fill` copies the reference. Writing `grid[0][1] = 5` then changes every row. Use `Array.from({ length: rows }, () => new Array(cols).fill(0))` so the callback builds a fresh row each time.

</details>

### 10. How would you find the majority element in O(n) time and O(1) space?

<details><summary>Model answer</summary>

Boyer-Moore voting: keep a `candidate` and a `count`. For each value, if `count` is 0 set `candidate = value`; then add 1 if the value equals the candidate, else subtract 1. Pairs of different values cancel out, and a value that appears more than n/2 times cannot be fully cancelled, so it survives as the candidate. If a majority is not guaranteed, do a second pass to verify the count.

</details>

### 11. Why is `[10, 9, 1].sort()` wrong, and what is the sort complexity in JavaScript?

<details><summary>Model answer</summary>

Without a comparator, `sort` converts values to strings and compares them lexicographically, giving `[1, 10, 9]`. Use `sort((a, b) => a - b)`. V8 uses TimSort: O(n log n) time, stable, sorts in place, with up to O(n) temporary memory.

</details>

### 12. How do you compute "product of array except self" without division?

<details><summary>Model answer</summary>

Two passes. Left pass: `answer[i]` = product of all elements before i. Right pass: keep a running `suffix` product from the end and multiply it into `answer[i]`, then update `suffix *= nums[i]`. Each index gets (product of left side) × (product of right side). O(n) time, O(1) extra space besides the output, and zeros need no special case.

</details>
