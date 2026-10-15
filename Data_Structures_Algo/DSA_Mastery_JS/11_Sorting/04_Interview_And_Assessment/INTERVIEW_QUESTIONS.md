# Sorting — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. Compare merge sort, quicksort and heap sort.

<details><summary>Model answer</summary>

Merge sort: O(n log n) always, stable, O(n) extra memory. Quicksort: O(n log n) average, O(n²) worst case (bad pivots), in place with O(log n) stack, usually fastest in practice; not stable. Heap sort: O(n log n) always, O(1) extra space, not stable, slower in practice due to poor cache use.

</details>

### 2. What does "stable" mean and when does it matter?

<details><summary>Model answer</summary>

Equal keys keep their original relative order. It matters when you sort by several keys in passes (sort by name, then stably by age keeps names ordered within each age) or when the original order carries meaning. JavaScript's `Array.prototype.sort` is guaranteed stable since ES2019.

</details>

### 3. Why can no comparison sort beat O(n log n) in the worst case?

<details><summary>Model answer</summary>

A comparison sort is a decision tree whose leaves are the n! possible orderings. A binary tree with n! leaves has height at least log2(n!), which is Θ(n log n) by Stirling's approximation. So some input needs that many comparisons.

</details>

### 4. How do counting sort and radix sort beat n log n?

<details><summary>Model answer</summary>

They do not compare elements; they use the values as indices. Counting sort is O(n + k) for integer keys in a range of size k. Radix sort applies a stable counting sort digit by digit: O(d · (n + b)). They only work for integer-like keys with a bounded range.

</details>

### 5. How do you avoid quicksort's O(n²) worst case?

<details><summary>Model answer</summary>

Pick a random pivot (or median-of-three) so sorted or reverse-sorted input does not always produce the most unbalanced split. Use three-way partitioning when there are many duplicates. Introsort switches to heap sort when recursion gets too deep, guaranteeing O(n log n).

</details>

### 6. What is wrong with `arr.sort()` for numbers, and how do comparators work?

<details><summary>Model answer</summary>

Without a comparator values are compared as strings, so `[10, 9, 1]` becomes `[1, 10, 9]`. A comparator `(a, b) => ...` returns a negative number if a comes first, positive if b comes first, 0 if equal. `(a, b) => a - b` sorts numbers ascending. Returning a boolean is a bug.

</details>

### 7. How does quickselect find the k-th smallest element in O(n) average?

<details><summary>Model answer</summary>

Partition around a random pivot; the pivot lands at its final index p. If p = k you are done; otherwise recurse (or loop) only into the side containing k. Expected work is n + n/2 + n/4 + ... = O(n). Worst case O(n²), made unlikely by random pivots.

</details>

### 8. When is insertion sort a good choice?

<details><summary>Model answer</summary>

For tiny arrays (it has very low overhead) and nearly sorted data, where it runs in O(n + inversions). That is why TimSort and many library sorts use insertion sort on small runs.

</details>

### 9. How can merge sort count inversions or "smaller elements after self"?

<details><summary>Model answer</summary>

During the merge, when you take an element from the right half before elements of the left half, each remaining left element forms an inversion with it. Count those in O(1) per step. Total O(n log n) instead of the O(n²) double loop. For "count smaller after self", sort indices and add, for each left element, how many right elements were placed before it.

</details>

### 10. Explain the Largest Number comparator.

<details><summary>Model answer</summary>

Convert to strings and order a before b when `a + b > b + a` (as strings). This works because it defines a consistent total order for concatenation. Edge case: if the first result is "0", return "0" (all zeros).

</details>

### 11. When should you NOT sort?

<details><summary>Model answer</summary>

When you only need the min, max or top k (one pass, a heap, or quickselect is cheaper), when original order or indices matter, for streaming data, or when a hash map solves the problem in O(n).

</details>

### 12. What sort does V8 use and what is its complexity?

<details><summary>Model answer</summary>

TimSort: a hybrid of merge sort and insertion sort that finds existing sorted runs. O(n log n) worst case, O(n) on already sorted input, stable, O(n) extra memory.

</details>
