# Merge Intervals

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | sort by start + merge |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #56 — https://leetcode.com/problems/merge-intervals/ |
| **Solution file** | [03_merge_intervals.js](../solutions/03_merge_intervals.js) — open only after a real attempt |

## Problem

Given a list of intervals [start, end], merge every pair that overlaps (touching counts)
and return the non-overlapping result.

## Examples

```
Input: [[1,3],[2,6],[8,10],[15,18]]   Output: [[1,6],[8,10],[15,18]]
Input: [[1,4],[4,5]]                  Output: [[1,5]]   Explanation: touching merges
```

## Constraints & clarifying questions

```
- Is the input sorted? (no)
- Does [1,4] and [4,5] merge? (yes)
- Should the output be sorted? (yes, by start)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort by start + merge* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n) space. Repeat: find any two intervals that overlap, replace them with their union.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by start + scan)   O(n log n) time, O(n) space. Sort by start.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> []
- single interval -> same
- one interval contains all others ([1,10],[2,3]) -> [[1,10]]; max() handles it
- unsorted with negatives
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
Repeat: find any two intervals that overlap, replace them with their union. Stop when
no pair overlaps. Each pass is O(n^2) and there can be n passes -> O(n^3) worst case.
```

### APPROACH 2 — Optimal (sort by start + scan)   O(n log n) time, O(n) space

```
Sort by start. Keep the last merged interval. For each next interval: if it starts at or
before the last one's end, extend the end (max); otherwise push it as a new block.
After sorting, anything that overlaps the current block must start before its end, so a
single pass catches every merge.

Dry run on [[1,3],[2,6],[8,10],[15,18]]:
  result=[[1,3]]
  [2,6]: 2 <= 3 -> extend to [1,6]
  [8,10]: 8 > 6 -> push -> [[1,6],[8,10]]
  [15,18]: 15 > 10 -> push -> [[1,6],[8,10],[15,18]]
```

### Edge cases

```
- [] -> []
- single interval -> same
- one interval contains all others ([1,10],[2,3]) -> [[1,10]]; max() handles it
- unsorted with negatives
```

Full JavaScript solution with tests: [03_merge_intervals.js](../solutions/03_merge_intervals.js). Run it with `node 03_merge_intervals.js` from the solutions folder.

</details>

## Common mistakes

- Comparing with the previous input interval instead of the last merged block.
- Setting the merged end to the new end instead of the max of both ends (breaks when one interval contains another).
- Not merging touching intervals like `[1,4]` and `[4,5]`.
- Assuming the input is already sorted (it is not in this problem).

## Related follow-ups

- [Insert Interval](../02_Medium/04_insert_interval.md)
- [Employee Free Time](../03_Hard/14_employee_free_time.md)
- [Partition Labels](../../../28_Greedy_Algorithms/03_Problems/02_Medium/09_partition_labels.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
