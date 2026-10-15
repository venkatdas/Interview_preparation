# Two Pointers — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. What are the main kinds of two-pointer patterns?

<details><summary>Model answer</summary>

(1) **Opposite ends** converging on sorted input (pair sums, container, palindromes). (2) **Same direction** read/write or slow/fast (compaction, dedupe, sliding windows). (3) **Two sequences**, one pointer each (merge, is-subsequence). (4) **Fast and slow on a linked list** (cycle, middle). (5) **Three-region partition** (Dutch flag).

</details>

### 2. Prove that the converging pointers in Two Sum II never skip the answer.

<details><summary>Model answer</summary>

If `a[l] + a[r] < target`, then `a[l]` paired with anything at or left of `r` is also too small (those values are ≤ `a[r]`), so `a[l]` cannot be in any answer inside the window; drop it (`l++`). Symmetrically, if the sum is too big, `a[r]` cannot pair with anything at or right of `l`; drop it (`r--`). Each step removes one element that provably is not part of a solution, so the answer pair is never discarded.

</details>

### 3. Why does Container With Most Water move the shorter line?

<details><summary>Model answer</summary>

Area = `min(h[l], h[r]) * (r − l)`. If you move the taller line inward, the width shrinks and the min height cannot exceed the shorter line, so the area can only stay the same or drop. Moving the shorter line is the only move that can possibly find a taller min. So all pairs that use the shorter line with a narrower partner are safely skipped.

</details>

### 4. Two pointers vs hash map for pair problems: what are the trade-offs?

<details><summary>Model answer</summary>

Hash map: O(n) time, O(n) space, works unsorted, keeps indices. Two pointers: needs sorted input (sorting costs O(n log n)), uses O(1) extra space, easily handles de-duplication (3Sum) and "closest" variants that a map cannot answer directly.

</details>

### 5. How does 3Sum avoid duplicate triplets without a Set?

<details><summary>Model answer</summary>

Sort first. Skip the fixed element `i` when `nums[i] === nums[i − 1]`. After finding a match, move both pointers and skip runs of equal values on each side. Equal values are adjacent after sorting, so skipping them removes duplicates in O(1) per step.

</details>

### 6. Explain the read/write pointer invariant.

<details><summary>Model answer</summary>

`write` marks the end of the finished part: everything in `[0, write)` is the answer so far, in order. `read` scans every element once; if it should be kept, copy it to `write` and advance `write`. Since `write ≤ read` always, you never overwrite an element you have not read yet.

</details>

### 7. Why does Merge Sorted Array fill from the back?

<details><summary>Model answer</summary>

nums1 has empty space at the end. Writing the largest remaining element at the back never overwrites an unread value of nums1, because the write index is always at or beyond the read index of nums1. Filling from the front would overwrite values you still need.

</details>

### 8. How does Floyd's cycle detection work and how do you find the cycle start?

<details><summary>Model answer</summary>

Slow moves 1 step, fast moves 2. If there is a cycle, fast gains one step per move inside the cycle, so they must meet. To find the start, reset one pointer to the head and move both one step at a time; they meet at the cycle entrance. This works because the distance from head to the entrance equals the distance from the meeting point to the entrance (modulo the cycle length).

</details>

### 9. Dutch national flag: why does `mid` not advance after swapping with `high`?

<details><summary>Model answer</summary>

The value that came from `high` has not been classified yet; it could be 0, 1 or 2. It must be examined on the next iteration. Values swapped from `low` are already known (they are 1s, or the same element), so `mid` can advance in that case.

</details>

### 10. Trapping Rain Water with two pointers: what is the key insight?

<details><summary>Model answer</summary>

Water above bar i is `min(maxLeft, maxRight) − h[i]`. Keep `leftMax` and `rightMax`. If `leftMax < rightMax`, the left side is the limiting wall for position `l` (the right side has something at least as tall), so you can settle `l` now and move it. Otherwise settle `r`. O(n) time, O(1) space.

</details>

### 11. When does the two-pointer technique NOT apply?

<details><summary>Model answer</summary>

When there is no monotonic reason to move a pointer: unsorted input where order matters, sums with negative numbers over subarrays, or conditions that can flip back and forth. Then use hashing, prefix sums or DP.

</details>

### 12. What is the complexity pattern for k-Sum with sorting and two pointers?

<details><summary>Model answer</summary>

2Sum O(n) after sorting, 3Sum O(n²), 4Sum O(n³): in general O(n^(k−1)) using k − 2 nested loops plus one two-pointer scan, plus O(n log n) for the sort.

</details>
