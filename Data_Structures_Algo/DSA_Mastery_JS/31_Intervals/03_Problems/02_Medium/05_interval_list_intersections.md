# Interval List Intersections

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | two pointers |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #986 — https://leetcode.com/problems/interval-list-intersections/ |
| **Solution file** | [05_interval_list_intersections.js](../solutions/05_interval_list_intersections.js) — open only after a real attempt |

## Problem

Two lists of closed intervals, each sorted and pairwise disjoint. Return the intersection
of the two lists (every range that lies inside an interval of BOTH lists).

## Examples

```
Input: A = [[0,2],[5,10],[13,23],[24,25]], B = [[1,5],[8,12],[15,24],[25,26]]
Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
```

## Constraints & clarifying questions

```
- Closed intervals, so [5,5] is a valid (single point) intersection? (yes)
- Both lists sorted and disjoint? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two pointers* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * m) time. For every pair (a, b) compute the overlap and push it if non-empty.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers)   O(n + m) time, O(1) extra. Pointers i, j.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- either list empty -> []
- no overlaps at all -> []
- single-point overlaps -> [x,x]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * m) time

```
For every pair (a, b) compute the overlap and push it if non-empty. Sort the output.
```

### APPROACH 2 — Optimal (two pointers)   O(n + m) time, O(1) extra

```
Pointers i, j. The candidate intersection is [max(starts), min(ends)]; push it if
start <= end. Then advance whichever interval ENDS first: it cannot intersect anything
further in the other list (that list is sorted and disjoint), so it is done.

Dry run (first steps) on the example:
  A[0]=[0,2], B[0]=[1,5]: [1,2] push. A ends first -> i=1
  A[1]=[5,10], B[0]=[1,5]: [5,5] push. B ends first -> j=1
  A[1]=[5,10], B[1]=[8,12]: [8,10] push. A ends first -> i=2 ...
```

### Edge cases

```
- either list empty -> []
- no overlaps at all -> []
- single-point overlaps -> [x,x]
```

Full JavaScript solution with tests: [05_interval_list_intersections.js](../solutions/05_interval_list_intersections.js). Run it with `node 05_interval_list_intersections.js` from the solutions folder.

</details>

## Common mistakes

- Advancing both pointers after each comparison; only the interval that ends first is finished.
- Missing single-point intersections like `[3,3]` by using `<` instead of `<=`.
- Merging the two lists first and losing the information about which list each interval came from.

## Related follow-ups

- [Merge Intervals](../02_Medium/03_merge_intervals.md)
- [Employee Free Time](../03_Hard/14_employee_free_time.md)
- Merge Sorted Array (LeetCode #88)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
