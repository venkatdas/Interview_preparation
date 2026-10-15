# Sort List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | merge sort on a list |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #148 — https://leetcode.com/problems/sort-list/ |
| **Solution file** | [19_sort_list.js](../solutions/19_sort_list.js) — open only after a real attempt |

## Problem

Sort a linked list in ascending order. Follow-up: O(n log n) time and O(1)
extra memory (ignoring recursion stack, or using the bottom-up version).

## Examples

```
Input: 4 -> 2 -> 1 -> 3          Output: 1 -> 2 -> 3 -> 4
Input: -1 -> 5 -> 3 -> 4 -> 0    Output: -1 -> 0 -> 3 -> 4 -> 5
Input: (empty)                   Output: (empty)
```

## Constraints & clarifying questions

```
- Can I copy to an array and sort? (works, but the interviewer wants merge sort on the list)
- Why merge sort and not quicksort? (merge sort doesn't need random access; lists
  can't jump to index i cheaply)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *merge sort on a list* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (array sort)   O(n log n) time, O(n) space. Copy values to an array, sort, write back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (top-down merge sort)   O(n log n) time, O(log n) stack. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty, single node
- already sorted, reverse sorted, all equal
- negatives
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (array sort)   O(n log n) time, O(n) space

```
Copy values to an array, sort, write back.
```

### APPROACH 2 — Optimal (top-down merge sort)   O(n log n) time, O(log n) stack

```
1. Base case: 0 or 1 node is sorted.
2. Find the middle with slow/fast and CUT the list into two halves.
3. Sort each half recursively.
4. Merge the two sorted halves (Merge Two Sorted Lists).

Dry run on 4 -> 2 -> 1 -> 3:
  split: [4,2] [1,3]
    split [4,2] -> [4] [2]  merge -> 2 -> 4
    split [1,3] -> [1] [3]  merge -> 1 -> 3
  merge (2->4, 1->3) -> 1 -> 2 -> 3 -> 4

Why O(n log n)? log n levels of splitting, each level merges all n nodes.

(A bottom-up version merges runs of size 1, 2, 4, ... iteratively for true
O(1) extra space. Mention it if asked; the top-down version is what most
interviews expect.)
```

### Edge cases

```
- empty, single node
- already sorted, reverse sorted, all equal
- negatives
```

Full JavaScript solution with tests: [19_sort_list.js](../solutions/19_sort_list.js). Run it with `node 19_sort_list.js` from the solutions folder.

</details>

## Common mistakes

- Splitting at the second middle for two nodes, which recurses forever on the same pair.
- Forgetting to cut the list into two halves before recursing.
- Using quicksort with a bad pivot on already sorted input (O(n²)).

## Related follow-ups

- [Merge Two Sorted Lists](../01_Easy/02_merge_two_sorted_lists.md)
- [Sort an Array](../../../11_Sorting/03_Problems/02_Medium/01_sort_an_array.md) (11_Sorting)
- Insertion Sort List (LeetCode #147)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
