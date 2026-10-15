# Insert Interval

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | three-phase insert |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #57 — https://leetcode.com/problems/insert-interval/ |
| **Solution file** | [04_insert_interval.js](../solutions/04_insert_interval.js) — open only after a real attempt |

## Problem

intervals is sorted by start and non-overlapping. Insert newInterval, merging as needed,
and return the still-sorted, non-overlapping result.

## Examples

```
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]   Output: [[1,5],[6,9]]
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
```

## Constraints & clarifying questions

```
- Input is sorted and non-overlapping? (yes - so no sort needed)
- Touching merges? (yes, [1,3] + [3,5] -> [1,5])
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *three-phase insert* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) time, O(n) space. Append the new interval and run Merge Intervals.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (three-phase scan)   O(n) time, O(n) space. Phase 1: copy intervals that end BEFORE newInterval starts (entirely to the left).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty intervals -> [newInterval]
- new interval before everything / after everything
- new interval swallows everything
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) time, O(n) space

```
Append the new interval and run Merge Intervals. Correct, but wastes the sorted input.
```

### APPROACH 2 — Optimal (three-phase scan)   O(n) time, O(n) space

```
Phase 1: copy intervals that end BEFORE newInterval starts (entirely to the left).
Phase 2: every interval that starts at or before newInterval's end overlaps it -> absorb:
         start = min, end = max. Then push the merged interval once.
Phase 3: copy the rest (entirely to the right).

Dry run on [[1,2],[3,5],[6,7],[8,10],[12,16]], new [4,8]:
  phase 1: [1,2] ends 2 < 4 -> push
  phase 2: [3,5] starts 3 <= 8 -> new = [3,8]; [6,7] -> [3,8]; [8,10] starts 8 <= 8 -> [3,10]
           [12,16] starts 12 > 10 -> stop; push [3,10]
  phase 3: push [12,16]
```

### Edge cases

```
- empty intervals -> [newInterval]
- new interval before everything / after everything
- new interval swallows everything
```

Full JavaScript solution with tests: [04_insert_interval.js](../solutions/04_insert_interval.js). Run it with `node 04_insert_interval.js` from the solutions folder.

</details>

## Common mistakes

- Re-sorting the already-sorted input (wastes O(n log n) and ignores a given guarantee).
- Wrong boundary in phase 1: intervals that merely touch the new one must be merged, not copied.
- Forgetting to push the merged new interval when it lands at the very end or the list is empty.

## Related follow-ups

- [Merge Intervals](../02_Medium/03_merge_intervals.md)
- [Data Stream as Disjoint Intervals](../03_Hard/13_data_stream_as_disjoint_intervals.md)
- [My Calendar I](../02_Medium/11_my_calendar_i.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
