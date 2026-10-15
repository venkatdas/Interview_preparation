# Merge k Sorted Lists

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Hard |
| **Pattern** | k-way merge |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #23 — https://leetcode.com/problems/merge-k-sorted-lists/ |
| **Solution file** | [07_merge_k_sorted_lists.js](../solutions/07_merge_k_sorted_lists.js) — open only after a real attempt |

## Problem

You are given an array of k linked lists, each sorted ascending. Merge them
into one sorted linked list and return its head.

## Examples

```
Input: [[1,4,5],[1,3,4],[2,6]]   Output: [1,1,2,3,4,4,5,6]
Input: []                        Output: []
Input: [[]]                      Output: []
```

## Constraints & clarifying questions

```
- k up to 10^4, total nodes N up to 10^4 * 500 -> need N log k
- Lists can be null/empty
- Should I reuse nodes or create new ones? (reuse: relink the existing nodes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *k-way merge* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (collect + sort)   O(N log N) time, O(N) space. Walk every list, push all values into an array, sort, rebuild a list.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (k-way merge with a min-heap)   O(N log k) time, O(k) space. At any moment the next smallest node overall is the smallest among the CURRENT HEADS of the k lists.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- lists = [] or all lists empty -> null
- a single list -> return it unchanged
- duplicate values across lists
- negative values
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (collect + sort)   O(N log N) time, O(N) space

```
Walk every list, push all values into an array, sort, rebuild a list.
Ignores the fact that each list is already sorted.
```

### APPROACH 2 — Optimal (k-way merge with a min-heap)   O(N log k) time, O(k) space

```
At any moment the next smallest node overall is the smallest among the
CURRENT HEADS of the k lists. Keep those heads in a min-heap (size <= k):
  1. push the head of every non-empty list
  2. pop the smallest, append it to the result
  3. if the popped node has a next, push that next (same list's new head)
Each of the N nodes is pushed and popped once at O(log k).

Dry run on [[1,4,5],[1,3,4],[2,6]]:
  heap = {1(a),1(b),2(c)}  pop 1(a) -> push 4(a)   result 1
  heap = {1(b),2(c),4(a)}  pop 1(b) -> push 3(b)   result 1,1
  heap = {2(c),3(b),4(a)}  pop 2(c) -> push 6(c)   result 1,1,2
  heap = {3(b),4(a),6(c)}  pop 3(b) -> push 4(b)   result 1,1,2,3
  heap = {4(a),4(b),6(c)}  pop 4(a) -> push 5(a)   ...
  ... continues until the heap is empty -> 1,1,2,3,4,4,5,6

(Alternative with the same complexity: divide and conquer, merge pairs of
lists like merge sort.)
```

### Edge cases

```
- lists = [] or all lists empty -> null
- a single list -> return it unchanged
- duplicate values across lists
- negative values
```

Full JavaScript solution with tests: [07_merge_k_sorted_lists.js](../solutions/07_merge_k_sorted_lists.js). Run it with `node 07_merge_k_sorted_lists.js` from the solutions folder.

</details>

## Common mistakes

- Pushing empty (null) lists into the heap.
- Comparing nodes instead of `node.val`.
- Merging one list at a time into the result (O(kN)).

## Related follow-ups

- [Merge k Sorted Lists](../../../15_Linked_Lists/03_Problems/03_Hard/18_merge_k_sorted_lists.md) (15_Linked_Lists)
- [Merge Two Sorted Lists](../../../15_Linked_Lists/03_Problems/01_Easy/02_merge_two_sorted_lists.md) (15_Linked_Lists)
- [Smallest Range Covering Elements from K Lists](13_smallest_range_k_lists.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
