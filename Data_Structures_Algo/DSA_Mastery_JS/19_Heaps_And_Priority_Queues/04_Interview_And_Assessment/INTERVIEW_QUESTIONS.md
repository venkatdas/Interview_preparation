# Heaps & Priority Queues — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What is a binary heap?

<details><summary>Model answer</summary>

A complete binary tree stored in an array where every parent is ≤ its children (min-heap) or ≥ (max-heap). For index i: parent `(i - 1) >> 1`, children `2i + 1` and `2i + 2`. Completeness keeps the height at ⌊log₂ n⌋, so push and pop are O(log n), peek is O(1).

</details>

### 2. Walk through push and pop.

<details><summary>Model answer</summary>

Push: append at the end (keeps the tree complete), then **sift up**: swap with the parent while smaller. Pop: save the root, move the last element to the root, shrink, then **sift down**: swap with the smaller child while larger than it. Each walks one root-to-leaf path: O(log n).

</details>

### 3. Why is building a heap from n items O(n), not O(n log n)?

<details><summary>Model answer</summary>

Bottom-up heapify sifts down from the last parent to the root. Half the nodes are leaves (0 work), a quarter move at most 1 level, an eighth at most 2, ... The sum n·Σ h/2^(h+1) converges to O(n). Pushing one at a time is O(n log n).

</details>

### 4. JavaScript has no built-in priority queue. What do you do in an interview?

<details><summary>Model answer</summary>

Write a small array-based heap class with a comparator (about 30 lines), or ask whether you may assume one exists. For tiny inputs, sorting or a sorted array may be acceptable — state the complexity trade-off.

</details>

### 5. Kth largest element: heap vs sort vs quickselect?

<details><summary>Model answer</summary>

Sort: O(n log n). Min-heap of size k (pop when size > k; top is the answer): O(n log k), O(k) space, works on streams. Quickselect: O(n) average, O(n²) worst, in place, needs the whole array. For a stream use the heap.

</details>

### 6. Why use a **min**-heap to find the k **largest** elements?

<details><summary>Model answer</summary>

The heap holds the current top k. Its root is the smallest of them, the one to evict when something bigger arrives. Peek/compare is O(1) and evict is O(log k). A max-heap of all n would cost O(n) space.

</details>

### 7. How does the two-heap median work?

<details><summary>Model answer</summary>

A max-heap holds the smaller half, a min-heap the larger half. Insert into one, move its top to the other, then rebalance so sizes differ by at most 1. The median is the top of the bigger heap, or the average of both tops. O(log n) add, O(1) median.

</details>

### 8. How does a heap merge k sorted lists?

<details><summary>Model answer</summary>

Push the head of each list. Pop the smallest, append it to the output, push its successor from the same list. The heap never has more than k items, so total O(N log k) for N elements.

</details>

### 9. What is "lazy deletion" and when is it used?

<details><summary>Model answer</summary>

Heaps can't delete an arbitrary element efficiently. Instead, record that it is deleted (a Map of counts) and discard it when it surfaces at the top. Used in sliding window median and some Dijkstra implementations (skip stale distances).

</details>

### 10. Is heap sort stable? What are its strengths?

<details><summary>Model answer</summary>

Not stable (swaps across the array reorder equal keys). Strengths: O(n log n) worst case and O(1) extra space. Weakness: poor cache locality, so in practice it's slower than quicksort/merge sort.

</details>

### 11. How do you break ties in a heap comparator, e.g. Top K Frequent Words?

<details><summary>Model answer</summary>

Make the comparator total: first by frequency, then by word. For a min-heap of size k that evicts the "worst", the worst is lower frequency, or for equal frequency the lexicographically **larger** word. Then reverse the popped order at the end.

</details>

### 12. When does a greedy + heap approach appear?

<details><summary>Model answer</summary>

When you repeatedly need the best available option as the set changes: connect sticks (always merge two smallest), IPO (among affordable projects, take the most profitable), meeting rooms (earliest ending room), task scheduler, Dijkstra, Prim.

</details>

### 13. How would you find the k-th smallest element in a sorted n × n matrix?

<details><summary>Model answer</summary>

Heap: push the first element of each row, pop k times, each time pushing the next element of the popped row: O(k log n). Or binary search on the value range with a count of elements ≤ mid: O(n log(range)).

</details>
