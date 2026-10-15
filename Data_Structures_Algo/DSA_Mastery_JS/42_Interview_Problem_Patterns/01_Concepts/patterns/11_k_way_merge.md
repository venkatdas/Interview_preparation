# 11. K-way Merge

You have k sorted lists and want one sorted output (or the smallest few items, or the smallest
range covering all lists). Put the **head of each list** into a min-heap. Pop the smallest, output
it, and push the next element **from the same list**. The heap never holds more than k items,
so each of the N total elements costs O(log k): O(N log k) overall.

It is the "merge" step of merge sort, generalized from 2 lists to k.

**Teaches in depth:** [Heaps & Priority Queues](../../../19_Heaps_And_Priority_Queues/README.md), [Linked Lists](../../../15_Linked_Lists/README.md), [Divide & Conquer](../../../30_Divide_And_Conquer/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at k-way merge |
|---|---|
| "merge k sorted lists / arrays / files" | the textbook case |
| "kth smallest in a sorted matrix" | each row is a sorted list |
| "smallest range covering at least one number from each list" | heap of current heads + track the max |
| "k pairs with smallest sums" from two sorted arrays | each `a[i]` + sorted `b` is a list |
| "ugly numbers", "super ugly numbers" | merge several generated sorted sequences |
| "external sort", "logs from k servers sorted by time" | system-design flavour of the same idea |

**Constraint hints**

- k lists with N total elements, k up to 10^4: concatenating and sorting is O(N log N); k-way merge is O(N log k).
- Two lists only -> plain two pointers, no heap needed ([02](02_two_pointers.md)).

## 2. When it applies (preconditions)

- Each input sequence is **already sorted** (or can be generated in sorted order lazily).
- You consume output in sorted order, often only a prefix of it (kth smallest), which makes the lazy heap approach even better.

## 3. When it does NOT apply

- **Unsorted inputs.** `[[3, 1], [2]]`: the heap starts with heads 3 and 2, outputs 2, then 3, then 1 — the output is not sorted. Sort each list first (then it is just sorting) or use a single heap of everything.
- **Only k = 2.** A heap adds overhead; two pointers is simpler and O(N).
- **You need random access to the merged result many times.** Merge once into an array, then index it.

## 4. The template

```js
// Merge k sorted arrays with a heap of [value, listIndex, elementIndex]. O(N log k).
function mergeKSorted(lists) {
  const heap = new MinHeap((a, b) => a[0] - b[0] || a[1] - b[1]);
  lists.forEach((list, i) => { if (list.length) heap.push([list[0], i, 0]); });
  const out = [];
  while (heap.size()) {
    const [value, li, ei] = heap.pop();
    out.push(value);
    if (ei + 1 < lists[li].length) heap.push([lists[li][ei + 1], li, ei + 1]); // refill from same list
  }
  return out;
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`mergeKSorted`, uses `MinHeap` from [templates.js](../../02_Implementations/templates.js)) and [tests/patterns.test.js](../../tests/patterns.test.js) (random lists vs `flat().sort()`).

**Dry run** `mergeKSorted([[1, 4], [2, 3], [0]])`:

| heap (value, list) | pop | push next from that list | out |
|---|---|---|---|
| (1,0) (2,1) (0,2) | 0 | — (list 2 empty) | [0] |
| (1,0) (2,1) | 1 | (4,0) | [0, 1] |
| (2,1) (4,0) | 2 | (3,1) | [0, 1, 2] |
| (3,1) (4,0) | 3 | — | [0, 1, 2, 3] |
| (4,0) | 4 | — | [0, 1, 2, 3, 4] |

## 5. Variations

- **Linked lists:** push nodes; `out.next = node`; push `node.next` if not null. Or divide and conquer: merge lists in pairs, O(N log k) too, no heap.
- **Kth smallest in a sorted matrix:** push the first element of each row; pop k times. (Binary search on value is the alternative.)
- **Smallest range covering k lists:** keep the current max of the heap's contents; range = `[heap.peek(), currentMax]`; stop when any list runs out.
- **K pairs with smallest sums:** start with `(a[i] + b[0], i, 0)` for i < k; refill with `j + 1`.
- **Generated sequences (ugly numbers):** pointers into one result array, one per prime, take the minimum each step.

## 6. Common pitfalls

1. Pushing **all** elements into the heap at once: correct, but O(N log N) time and O(N) memory — you lose the benefit.
2. Forgetting to store which list (and which index) an element came from, so you cannot refill.
3. Pushing empty lists (`list[0]` is `undefined`, and `undefined - x` is `NaN`, which breaks the heap order).
4. Using `array.shift()` to advance each list: O(length) per call. Keep an index instead.
5. For linked lists, pushing `null` nodes into the heap.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Merge Two Sorted Lists | Easy | the k = 2 base case | [statement](../../../15_Linked_Lists/03_Problems/01_Easy/02_merge_two_sorted_lists.md) · [solution](../../../15_Linked_Lists/03_Problems/solutions/02_merge_two_sorted_lists.js) |
| 2 | Merge Sorted Array | Easy | two pointers from the back | [statement](../../../06_Two_Pointers/03_Problems/01_Easy/08_merge_sorted_array.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/08_merge_sorted_array.js) |
| 3 | Kth Smallest Element in a Sorted Matrix | Medium | rows as k lists | [statement](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/16_kth_smallest_in_sorted_matrix.md) · [solution](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/solutions/16_kth_smallest_in_sorted_matrix.js) |
| 4 | Ugly Number II | Medium | merge generated sequences | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/15_ugly_number_ii.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/15_ugly_number_ii.js) |
| 5 | Sort List | Medium | merge sort on a list | [statement](../../../15_Linked_Lists/03_Problems/02_Medium/19_sort_list.md) · [solution](../../../15_Linked_Lists/03_Problems/solutions/19_sort_list.js) |
| 6 | Merge k Sorted Lists | Hard | heap of heads | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/07_merge_k_sorted_lists.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/07_merge_k_sorted_lists.js) |
| 7 | Merge k Sorted Lists (divide & conquer) | Hard | pairwise merging | [statement](../../../30_Divide_And_Conquer/03_Problems/03_Hard/04_merge_k_sorted_lists.md) · [solution](../../../30_Divide_And_Conquer/03_Problems/solutions/04_merge_k_sorted_lists.js) |
| 8 | Smallest Range Covering Elements from K Lists | Hard | heap + running max | [statement](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/13_smallest_range_k_lists.md) · [solution](../../../19_Heaps_And_Priority_Queues/03_Problems/solutions/13_smallest_range_k_lists.js) |

## 8. Self-check

**Q1.** Why is k-way merge O(N log k) and not O(N log N)?

<details><summary>Answer</summary>

The heap holds at most k items (one per list), so each push/pop is O(log k), and each of the N elements is pushed and popped once.

</details>

**Q2.** How does "merge in pairs" (divide and conquer) reach the same bound without a heap?

<details><summary>Answer</summary>

Merge lists 1+2, 3+4, ... in rounds. Each round touches all N elements once, and there are log k rounds, so O(N log k).

</details>

**Q3.** In Smallest Range Covering K Lists, when do you stop?

<details><summary>Answer</summary>

When the popped minimum's list has no next element. After that, no range can include an element from that list beyond what you have seen, so no better range exists.

</details>

---

Previous: [10. Top-K & Heaps](10_top_k_and_heaps.md) · Next: [12. Recursion & Backtracking](12_recursion_and_backtracking.md) · [Pattern index](../../README.md)
