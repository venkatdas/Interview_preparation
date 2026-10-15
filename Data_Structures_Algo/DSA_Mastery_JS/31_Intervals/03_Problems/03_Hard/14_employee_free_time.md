# Employee Free Time

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Hard |
| **Pattern** | merge all, read the gaps |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #759 — https://leetcode.com/problems/employee-free-time/ |
| **Solution file** | [14_employee_free_time.js](../solutions/14_employee_free_time.js) — open only after a real attempt |

## Problem

schedule[i] is the sorted list of working intervals [start, end) of employee i.
Return the list of finite intervals during which EVERY employee is free, sorted.
Ignore the infinite free time before the first job and after the last.

## Examples

```
Input: [[[1,2],[5,6]],[[1,3]],[[4,10]]]   Output: [[3,4]]
Input: [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]   Output: [[5,6],[7,9]]
```

## Constraints & clarifying questions

```
- Can zero-length gaps like [3,3] count? (no, only positive length)
- Each employee's list is sorted and disjoint? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *merge all, read the gaps* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(T * n) time where T = coordinate range. Mark every busy unit of time in a Set from every employee; then scan from the global min to max and collect unmarked runs.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (flatten, sort, merge, read the gaps)   O(N log N) time, O(N) space. (N = total number of intervals.) Who owns an interval does not matter: free-for-everyone time is exactly the complement of the UNION of all busy intervals.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one employee with gaps -> their own gaps
- fully overlapping schedules -> []
- touching intervals ([1,3],[3,5]) -> no gap
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(T * n) time where T = coordinate range

```
Mark every busy unit of time in a Set from every employee; then scan from the global min to
max and collect unmarked runs. Only for small integer coordinates.
```

### APPROACH 2 — Optimal (flatten, sort, merge, read the gaps)   O(N log N) time, O(N) space

```
(N = total number of intervals.) Who owns an interval does not matter: free-for-everyone
time is exactly the complement of the UNION of all busy intervals. So flatten everything
into one list, sort by start, and walk with `busyUntil` = the max end seen so far.
Whenever the next interval starts AFTER busyUntil, the gap [busyUntil, start] is free.
(A k-way merge with a heap gives O(N log k) but the same idea; sorting is simpler.)

Dry run on [[[1,2],[5,6]],[[1,3]],[[4,10]]]:
  flat sorted: [1,2],[1,3],[4,10],[5,6]
  busyUntil=2; [1,3] 1<=2 -> busyUntil=3; [4,10] 4>3 -> free [3,4], busyUntil=10; [5,6] -> 10
  -> [[3,4]]
```

### Edge cases

```
- one employee with gaps -> their own gaps
- fully overlapping schedules -> []
- touching intervals ([1,3],[3,5]) -> no gap
```

Full JavaScript solution with tests: [14_employee_free_time.js](../solutions/14_employee_free_time.js). Run it with `node 14_employee_free_time.js` from the solutions folder.

</details>

## Common mistakes

- Trying to intersect free times per employee instead of taking the complement of the union of busy times.
- Reporting zero-length gaps (touching intervals produce no free time).
- Including the infinite time before the first or after the last busy interval.

## Related follow-ups

- [Merge Intervals](../02_Medium/03_merge_intervals.md)
- [Interval List Intersections](../02_Medium/05_interval_list_intersections.md)
- [Merge k Sorted Lists](../../../30_Divide_And_Conquer/03_Problems/03_Hard/04_merge_k_sorted_lists.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
