# Merge Intervals

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | sort by start + sweep |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #56 — https://leetcode.com/problems/merge-intervals/ |
| **Solution file** | [03_merge_intervals.js](../solutions/03_merge_intervals.js) — open only after a real attempt |

## Problem

Given an array of intervals [start, end], merge all overlapping intervals and
return the non-overlapping intervals that cover the same ranges.
(The full intervals topic lives in 31_Intervals; this file shows the sort-based core.)

## Examples

```
Input: [[1,3],[2,6],[8,10],[15,18]]   Output: [[1,6],[8,10],[15,18]]
Input: [[1,4],[4,5]]                  Output: [[1,5]]    (touching counts as overlap)
```

## Constraints & clarifying questions

```
- Do touching intervals [1,4],[4,5] merge? (yes, start <= end)
- Is the input sorted? (no, that is the whole point)
- Can start > end? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort by start + sweep* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. Repeatedly scan all pairs, merge any overlapping pair, restart until no pair overlaps.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by start, then one sweep)   O(n log n) time, O(n) space. Sort by start.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> []
- one interval -> itself
- an interval fully inside another: [[1,10],[2,3]] -> [[1,10]] (max of ends matters)
- unsorted input with overlaps far apart: [[5,6],[1,10]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
Repeatedly scan all pairs, merge any overlapping pair, restart until no pair
overlaps. Up to n merges, each costing O(n) scanning.
```

### APPROACH 2 — Optimal (sort by start, then one sweep)   O(n log n) time, O(n) space

```
Sort by start. Walk through: if the current interval starts at or before the end
of the last merged interval, they overlap -> extend the last one's end to the max.
Otherwise push it as a new interval. Sorting guarantees that any interval that
could overlap the last merged one is adjacent to it.

Dry run [[1,3],[2,6],[8,10],[15,18]] (already sorted by start):
  merged = [[1,3]]
  [2,6]: 2 <= 3 -> extend -> [[1,6]]
  [8,10]: 8 > 6 -> push -> [[1,6],[8,10]]
  [15,18]: 15 > 10 -> push -> [[1,6],[8,10],[15,18]]
```

### Edge cases

```
- [] -> []
- one interval -> itself
- an interval fully inside another: [[1,10],[2,3]] -> [[1,10]] (max of ends matters)
- unsorted input with overlaps far apart: [[5,6],[1,10]]
```

Full JavaScript solution with tests: [03_merge_intervals.js](../solutions/03_merge_intervals.js). Run it with `node 03_merge_intervals.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to sort by start first.
- Treating touching intervals like [1,4] and [4,5] as separate; they overlap here.
- Updating the end with the new interval's end instead of `Math.max(lastEnd, end)`, which shrinks a containing interval.

## Related follow-ups

- [Merge Intervals (Intervals)](../../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md) — the intervals topic version
- [Insert Interval](../../../31_Intervals/03_Problems/02_Medium/04_insert_interval.md) — one new interval into a sorted list
- [Meeting Rooms II](06_meeting_rooms_ii.md) — count overlaps instead of merging

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
