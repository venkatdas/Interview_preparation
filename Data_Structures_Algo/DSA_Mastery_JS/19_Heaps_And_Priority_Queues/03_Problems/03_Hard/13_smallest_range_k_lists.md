# Smallest Range Covering Elements from K Lists

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Hard |
| **Pattern** | k-way merge + track max |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #632 — https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/ |
| **Solution file** | [13_smallest_range_k_lists.js](../solutions/13_smallest_range_k_lists.js) — open only after a real attempt |

## Problem

You have k sorted lists. Find the smallest range [a, b] that contains at
least one number from EACH list. Smaller width wins; on a tie, smaller a.

## Examples

```
Input: [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]   Output: [20,24]
  Explanation: 24 from list 1, 20 from list 2, 22 from list 3; width 4 is the best possible
Input: [[1,2,3],[1,2,3],[1,2,3]]                     Output: [1,1]
```

## Constraints & clarifying questions

```
- Each list non-empty and sorted? (yes)
- k up to 3500, total elements up to 10^5 -> need about N log k
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *k-way merge + track max* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(N^2 * k) time, O(N) space. Collect all values, sort them.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (k-way merge with a min-heap + track max)   O(N log k) time, O(k) space. This is "merge k sorted lists" with a twist.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> [first, first]
- identical lists -> [x, x]
- lists of length 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(N^2 * k) time, O(N) space

```
Collect all values, sort them. For every candidate start value a, extend b
until every list has a value in [a, b] (check by scanning each list).
Keep the best. Far too slow for big input but easy to trust in tests.
```

### APPROACH 2 — Optimal (k-way merge with a min-heap + track max)   O(N log k) time, O(k) space

```
This is "merge k sorted lists" with a twist. Keep one element from each
list in a min-heap (start with each list's first). At any moment the heap
holds k numbers, one per list, so [heap.min, currentMax] is a valid range.
To try to shrink it, the only move that can help is to advance the list
that owns the MINIMUM (advancing anything else can only raise the max).
  loop:
    range = [heap.min, max]; keep if smaller
    pop the min; if its list is exhausted -> stop (no more valid ranges)
    push the next element of that list; update max

Dry run on [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]:
  heap {0,4,5} max 5   -> range [0,5]  w5     pop 0, push 9  max 9
  heap {4,5,9}         -> [4,9]  w5          pop 4, push 10 max 10
  heap {5,9,10}        -> [5,10] w5          pop 5, push 18 max 18
  heap {9,10,18}       -> [9,18] w9          pop 9, push 12
  heap {10,12,18}      -> [10,18] w8         pop 10, push 15
  heap {12,15,18}      -> [12,18] w6         pop 12, push 20 max 20
  heap {15,18,20}      -> [15,20] w5         pop 15, push 24 max 24
  heap {18,20,24}      -> [18,24] w6         pop 18, push 22
  heap {20,22,24}      -> [20,24] w4  best   pop 20, list 2 exhausted -> stop
  answer [20,24]
```

### Edge cases

```
- k = 1 -> [first, first]
- identical lists -> [x, x]
- lists of length 1
```

Full JavaScript solution with tests: [13_smallest_range_k_lists.js](../solutions/13_smallest_range_k_lists.js). Run it with `node 13_smallest_range_k_lists.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to track the current maximum while the heap gives the minimum.
- Stopping only when all lists are exhausted; stop as soon as any list runs out.
- Updating the best range with `>=` and losing the tie-break on the smaller start.

## Related follow-ups

- [Merge k Sorted Lists](07_merge_k_sorted_lists.md)
- Minimum Window Substring (LeetCode #76)
- [Find Median from Data Stream](08_find_median_data_stream.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
