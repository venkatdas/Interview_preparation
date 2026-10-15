# Sort List

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | merge sort on a linked list |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #148 — https://leetcode.com/problems/sort-list/ |
| **Solution file** | [12_sort_list.js](../solutions/12_sort_list.js) — open only after a real attempt |

## Problem

Given the head of a singly linked list, return the list sorted ascending.
Follow-up: O(n log n) time and O(1) extra memory (ignoring recursion stack).

## Examples

```
Input: 4 -> 2 -> 1 -> 3          Output: 1 -> 2 -> 3 -> 4
Input: -1 -> 5 -> 3 -> 4 -> 0    Output: -1 -> 0 -> 3 -> 4 -> 5
Input: (empty)                   Output: (empty)
```

## Constraints & clarifying questions

```
- n <= 5 * 10^4, values can be negative
- Singly linked: no random access, so quick sort / heap sort are awkward -> merge sort
- May I create new nodes? (better to relink the existing ones)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *merge sort on a linked list* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) time, O(n) space. Copy the values into an array, sort the array, write the values back into the nodes.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (top-down merge sort on the list)   O(n log n) time, O(log n) stack. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty list, single node
- two nodes (the split must put exactly one in each half or you recurse forever)
- duplicates, negatives, already sorted
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) time, O(n) space

```
Copy the values into an array, sort the array, write the values back into the nodes.
Works, but misses the point (an interviewer wants the list manipulation).
```

### APPROACH 2 — Optimal (top-down merge sort on the list)   O(n log n) time, O(log n) stack

```
1. base case: 0 or 1 node -> already sorted
  2. find the middle with slow/fast pointers (fast moves 2, slow moves 1), cut the list
  3. sort both halves recursively
  4. merge two sorted lists with a dummy head (see 15_Linked_Lists)
Recursion depth is log n (~16 for 5 * 10^4), so the stack is safe.
(The true O(1)-space version is bottom-up: merge runs of size 1, 2, 4, ... iteratively.)

Dry run 4 -> 2 -> 1 -> 3:
  split: slow stops at 2 -> left 4->2, right 1->3
  sort left: split 4 | 2 -> merge -> 2->4
  sort right: split 1 | 3 -> merge -> 1->3
  merge 2->4 with 1->3: 1, 2, 3, 4
```

### Edge cases

```
- empty list, single node
- two nodes (the split must put exactly one in each half or you recurse forever)
- duplicates, negatives, already sorted
```

Full JavaScript solution with tests: [12_sort_list.js](../solutions/12_sort_list.js). Run it with `node 12_sort_list.js` from the solutions folder.

</details>

## Common mistakes

- Not cutting the list in half (`slow.next = null`), so recursion never ends.
- Finding the middle with fast starting at head for a 2-node list, which never splits; start fast at head.next.
- Copying values into an array and sorting; it works but misses the O(1)-space linked-list merge.

## Related follow-ups

- [Sort List (Linked Lists)](../../../15_Linked_Lists/03_Problems/02_Medium/19_sort_list.md) — the linked-list topic version
- [Merge Two Sorted Lists](../../../15_Linked_Lists/03_Problems/01_Easy/02_merge_two_sorted_lists.md) — the merge step
- [Merge k Sorted Lists](../../../15_Linked_Lists/03_Problems/03_Hard/18_merge_k_sorted_lists.md) — merging many lists

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
