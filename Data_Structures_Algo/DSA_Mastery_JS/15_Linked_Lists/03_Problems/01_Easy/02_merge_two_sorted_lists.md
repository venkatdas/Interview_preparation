# Merge Two Sorted Lists

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Easy |
| **Pattern** | dummy + tail merge |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #21 — https://leetcode.com/problems/merge-two-sorted-lists/ |
| **Solution file** | [02_merge_two_sorted_lists.js](../solutions/02_merge_two_sorted_lists.js) — open only after a real attempt |

## Problem

You are given the heads of two sorted linked lists. Merge them into one sorted
list by splicing together the existing nodes. Return the head of the merged list.

## Examples

```
Input: 1 -> 2 -> 4,  1 -> 3 -> 4   Output: 1 -> 1 -> 2 -> 3 -> 4 -> 4
Input: (empty), (empty)           Output: (empty)
Input: (empty), 0                 Output: 0
```

## Constraints & clarifying questions

```
- Are both lists sorted ascending? (yes)
- Can I reuse the nodes or must I create new ones? (reuse)
- Duplicates allowed? (yes, keep all of them)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *dummy + tail merge* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O((n+m) log(n+m)) time, O(n+m) space. Dump all values into an array, sort it, build a new list.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (dummy head + two pointers)   O(n+m) time, O(1) space. Create a dummy node so we never special-case "which node is the head?".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one or both lists empty
- all values of one list smaller than the other
- equal values (take from either; we take from list1 for stability)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((n+m) log(n+m)) time, O(n+m) space

```
Dump all values into an array, sort it, build a new list. Ignores the fact
that the inputs are already sorted.
```

### APPROACH 2 — Optimal (dummy head + two pointers)   O(n+m) time, O(1) space

```
Create a dummy node so we never special-case "which node is the head?".
Keep a tail pointer at the end of the merged list. Compare the fronts of the
two lists, attach the smaller one to tail, and advance that list.
When one list runs out, attach the rest of the other list in one move.

Dry run on A = 1 -> 3,  B = 2 -> 4:
  dummy -> (tail = dummy)
  1 < 2  attach 1    dummy -> 1              A = 3
  3 > 2  attach 2    dummy -> 1 -> 2         B = 4
  3 < 4  attach 3    dummy -> 1 -> 2 -> 3    A = empty
  A empty: tail.next = B    dummy -> 1 -> 2 -> 3 -> 4
  return dummy.next
```

### Edge cases

```
- one or both lists empty
- all values of one list smaller than the other
- equal values (take from either; we take from list1 for stability)
```

Full JavaScript solution with tests: [02_merge_two_sorted_lists.js](../solutions/02_merge_two_sorted_lists.js). Run it with `node 02_merge_two_sorted_lists.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to attach the leftover tail of the longer list.
- Special-casing which list provides the head instead of using a dummy node.
- Creating new nodes when relinking existing ones is enough.

## Related follow-ups

- [Merge k Sorted Lists](../03_Hard/18_merge_k_sorted_lists.md)
- [Sort List](../02_Medium/19_sort_list.md)
- [Merge Sorted Array](../../../03_Arrays/03_Problems/01_Easy/09_merge_sorted_array.md) (03_Arrays)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
