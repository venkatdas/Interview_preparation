# 10. Top-K & Heaps

A heap (priority queue) always gives you the smallest (min-heap) or largest (max-heap) item in
O(1), and lets you add or remove in O(log n). JavaScript has **no built-in heap**, so you must
be able to write one in about 10 minutes (`MinHeap` in templates.js).

The signature trick: to keep the **k largest** items, use a **min-heap of size k**. The root is the
smallest of the kept items — the first one to throw out when something bigger arrives. This costs
O(n log k) instead of O(n log n) for a full sort.

**Teaches in depth:** [Heaps & Priority Queues](../../../19_Heaps_And_Priority_Queues/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at a heap |
|---|---|
| "k largest / smallest / closest / most frequent" | bounded heap of size k |
| "kth largest" (also in a stream) | min-heap of size k, answer is the root |
| "median of a stream" | two heaps: max-heap low half, min-heap high half |
| "repeatedly take the smallest / largest and combine" | pop, combine, push (sticks, stones) |
| "schedule the next task", "most profitable available" | greedy + heap over time |
| "merge k sorted", "smallest range from k lists" | k-way merge ([11](11_k_way_merge.md)) |
| "shortest path with weights" | Dijkstra = BFS with a heap ([14](14_graph_traversal_and_shortest_paths.md)) |

**Constraint hints**

- k much smaller than n -> O(n log k) heap beats O(n log n) sort.
- Values in a small range (e.g. frequencies <= n) -> bucket sort can give O(n) top-k.
- One-off "kth largest" with no stream -> quickselect is O(n) average.

## 2. When it applies (preconditions)

- You repeatedly need the current best item while items are being added or removed.
- Or you need a top-k subset and k is small relative to n.

## 3. When it does NOT apply

- **Arbitrary deletion or "kth in the middle" queries.** "Remove the element 7 from the middle and tell me the 3rd smallest" — a heap can only remove the root efficiently. Use a sorted structure (balanced BST, sorted list with binary search) or lazy deletion.
- **Sorted output of everything.** If you need all n items in order, just sort: same O(n log n), simpler code.
- **Window max/min** where items leave in arrival order: a monotonic deque is O(n) total versus O(n log n) for a heap with lazy deletion ([09](09_monotonic_stack_and_queue.md)).
  *Counterexample:* `nums = [1, 3, 2]`, k = 2. A heap of the window holds 1 and 3; when 1 leaves, you cannot remove it from the middle of a max-heap without searching.

## 4. The template

```js
// Kth largest with a min-heap of size k. O(n log k).
function kthLargest(nums, k) {
  if (k < 1 || k > nums.length) return undefined;
  const heap = new MinHeap();
  for (const x of nums) {
    heap.push(x);
    if (heap.size() > k) heap.pop();               // drop the smallest; the k largest survive
  }
  return heap.peek();
}

// k most frequent values (ties: smaller value first)
function topKFrequent(nums, k) {
  const freq = frequencyMap(nums);
  const heap = new MinHeap((a, b) => a[1] - b[1] || b[0] - a[0]);
  for (const entry of freq) {
    heap.push(entry);
    if (heap.size() > k) heap.pop();
  }
  const out = [];
  while (heap.size()) out.push(heap.pop()[0]);
  return out.reverse();                            // most frequent first
}
```

`MinHeap` (push, pop, peek, size, custom comparator) is in [templates.js](../../02_Implementations/templates.js).
Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`kthLargest`, `topKFrequent`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `kthLargest([3, 2, 1, 5, 6, 4], 2)`:

| x | heap after push | size > 2? pop | heap |
|---|---|---|---|
| 3 | [3] | no | [3] |
| 2 | [2, 3] | no | [2, 3] |
| 1 | [1, 2, 3] | pop 1 | [2, 3] |
| 5 | [2, 3, 5] | pop 2 | [3, 5] |
| 6 | [3, 5, 6] | pop 3 | [5, 6] |
| 4 | [4, 5, 6] | pop 4 | [5, 6] -> root 5 |

## 5. Variations

- **Max-heap:** pass `(a, b) => b - a`.
- **K closest points:** max-heap of size k by distance (pop the farthest).
- **Two heaps (median):** keep sizes balanced (differ by at most 1); median from the roots.
- **Greedy + heap over time:** IPO (unlock projects by capital, pick max profit), Meeting Rooms II (min-heap of end times), Task Scheduler.
- **Lazy deletion:** mark removed items in a map; discard them when they reach the root (Sliding Window Median).
- **Bucket sort top-k frequent:** buckets indexed by frequency, O(n).

## 6. Common pitfalls

1. Using a max-heap of all n items for top-k: works, but O(n log n) and O(n) memory; the size-k min-heap is what interviewers want.
2. `arr.sort()` on numbers inside the heap (string order). Use the comparator.
3. Forgetting that `pop()` on an empty heap returns `undefined` — check `size()` first.
4. Comparator with mixed types: `a[1] - b[1]` assumes numbers; for strings use `localeCompare` or `<`.
5. Pushing an object and then **mutating** its priority: the heap does not re-order itself. Push a new entry instead.
6. Sorting the heap's internal array to "read it in order" — pop repeatedly instead.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Kth Largest Element in a Stream | Easy | min-heap of size k | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/01_Easy/02_kth_largest_in_stream.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/02_kth_largest_in_stream.js) |
| 2 | Last Stone Weight | Easy | repeatedly take the two largest | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/01_Easy/03_last_stone_weight.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/03_last_stone_weight.js) |
| 3 | Kth Largest Element in an Array | Medium | heap or quickselect | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/01_kth_largest_element.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/01_kth_largest_element.js) |
| 4 | K Closest Points to Origin | Medium | max-heap of size k | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/04_k_closest_points.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/04_k_closest_points.js) |
| 5 | Top K Frequent Elements | Medium | count + heap | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/05_top_k_frequent_elements.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/05_top_k_frequent_elements.js) |
| 6 | Top K Frequent Words | Medium | heap with tie-break | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/06_top_k_frequent_words.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/06_top_k_frequent_words.js) |
| 7 | Reorganize String | Medium | greedy with max-heap | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/10_reorganize_string.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/10_reorganize_string.js) |
| 8 | Find Median from Data Stream | Hard | two heaps | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/08_find_median_data_stream.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/08_find_median_data_stream.js) |
| 9 | IPO | Hard | two heaps over capital | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/14_ipo.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/14_ipo.js) |
| 10 | Sliding Window Median | Hard | two heaps + lazy deletion | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/16_sliding_window_median.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/16_sliding_window_median.js) |

## 8. Self-check

**Q1.** Why a **min**-heap for the k **largest** items?

<details><summary>Answer</summary>

The root must be the item you would throw away next — the smallest of the kept k. When a new item is bigger than the root, it replaces it. A max-heap would put the best item at the root, which is the one you want to keep.

</details>

**Q2.** Complexity of top-k with a size-k heap over n items?

<details><summary>Answer</summary>

O(n log k) time and O(k) extra space (plus O(n) for a frequency map if you count first).

</details>

**Q3.** For Find Median from Data Stream, what invariant do the two heaps keep?

<details><summary>Answer</summary>

Every value in the low max-heap is <= every value in the high min-heap, and their sizes differ by at most 1. The median is the root of the bigger heap, or the average of both roots when sizes are equal.

</details>

---

Previous: [09. Monotonic Stack & Queue](09_monotonic_stack_and_queue.md) · Next: [11. K-way Merge](11_k_way_merge.md) · [Pattern index](../../README.md)
