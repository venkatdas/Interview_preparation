# Merge k Sorted Lists

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Hard |
| **Pattern** | divide & conquer / min-heap |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #23 — https://leetcode.com/problems/merge-k-sorted-lists/ |
| **Solution file** | [18_merge_k_sorted_lists.js](../solutions/18_merge_k_sorted_lists.js) — open only after a real attempt |

## Problem

You are given an array of k linked lists, each sorted ascending. Merge all
of them into one sorted linked list and return its head.

## Examples

```
Input: [1->4->5, 1->3->4, 2->6]   Output: 1->1->2->3->4->4->5->6
Input: []                         Output: (empty)
Input: [ (empty) ]                Output: (empty)
```

## Constraints & clarifying questions

```
- Can lists be empty / can the array be empty? (yes, both)
- What are k and N (total nodes)? (complexity is discussed in terms of both)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *divide & conquer / min-heap* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (collect and sort)   O(N log N) time, O(N) space. Dump every value into one array, sort it, rebuild a list.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal A (divide & conquer)   O(N log k) time, O(log k) stack. Pair the lists up and merge each pair (using Merge Two Sorted Lists), halving the number of lists each round.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty array, array of empty lists
- a single list -> return it
- lists of very different lengths
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (collect and sort)   O(N log N) time, O(N) space

```
Dump every value into one array, sort it, rebuild a list. Ignores the fact
that each list is already sorted.
```

### APPROACH 1b — Merge one by one   O(N * k) time

```
Merge list 1 with list 2, then with list 3... The growing result is
re-walked for every list, so this is slow when k is large.
```

### APPROACH 2 — Optimal A (divide & conquer)   O(N log k) time, O(log k) stack

```
Pair the lists up and merge each pair (using Merge Two Sorted Lists), halving
the number of lists each round. log k rounds, each touching all N nodes.

  round 0: [A, B, C, D]
  round 1: [merge(A,B), merge(C,D)]
  round 2: [merge(AB, CD)]
```

### APPROACH 3 — Optimal B (min-heap of list heads)   O(N log k) time, O(k) space

```
Keep the current head of every list in a min-heap keyed by value. Pop the
smallest, append it to the result, push that list's next node. Every node
enters and leaves the heap once -> N * log k. We implement a tiny binary heap
inline (full heap theory lives in 19_Heaps_And_Priority_Queues).

Dry run (heap) on [1->4, 1->3, 2]:
  heap {1,1,2}  pop 1 (list A) push 4 -> {1,2,4}   result 1
  pop 1 (B) push 3 -> {2,3,4}                      result 1 1
  pop 2 (C) nothing to push -> {3,4}               result 1 1 2
  pop 3, pop 4                                     result 1 1 2 3 4
```

### Edge cases

```
- empty array, array of empty lists
- a single list -> return it
- lists of very different lengths
```

Full JavaScript solution with tests: [18_merge_k_sorted_lists.js](../solutions/18_merge_k_sorted_lists.js). Run it with `node 18_merge_k_sorted_lists.js` from the solutions folder.

</details>

## Common mistakes

- Merging lists one by one into a growing result: O(k·N) time.
- Pushing null lists into the heap.
- Forgetting to push the popped node's `next` back into the heap.

## Related follow-ups

- [Merge Two Sorted Lists](../01_Easy/02_merge_two_sorted_lists.md)
- [Merge k Sorted Lists](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/07_merge_k_sorted_lists.md) (19_Heaps_And_Priority_Queues)
- [Smallest Range Covering Elements from K Lists](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/13_smallest_range_k_lists.md) (19_Heaps_And_Priority_Queues)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
