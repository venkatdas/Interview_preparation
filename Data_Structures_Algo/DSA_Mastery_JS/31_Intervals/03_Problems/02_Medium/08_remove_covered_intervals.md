# Remove Covered Intervals

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | sort start asc, end desc |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1288 — https://leetcode.com/problems/remove-covered-intervals/ |
| **Solution file** | [08_remove_covered_intervals.js](../solutions/08_remove_covered_intervals.js) — open only after a real attempt |

## Problem

Interval [a,b) is covered by [c,d) if c <= a and b <= d. Remove every interval that is
covered by another one and return how many intervals remain.

## Examples

```
Input: [[1,4],[3,6],[2,8]]   Output: 2   Explanation: [3,6] is inside [2,8]
Input: [[1,4],[2,3]]         Output: 1
```

## Constraints & clarifying questions

```
- Are all intervals distinct? (yes, per problem)
- Does an interval cover itself? (not relevant since they are distinct)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort start asc, end desc* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each interval, check if any OTHER interval covers it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by start asc, end DESC; track max end)   O(n log n) time, O(1) extra. Sort by start ascending; for equal starts put the LONGER one first (end descending).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single interval -> 1
- same start, different ends -> only the longest survives
- chain of nested intervals -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each interval, check if any OTHER interval covers it.
```

### APPROACH 2 — Optimal (sort by start asc, end DESC; track max end)   O(n log n) time, O(1) extra

```
Sort by start ascending; for equal starts put the LONGER one first (end descending).
Scan with `maxEnd` = the largest end seen so far. If the current end <= maxEnd, the current
interval is covered by an earlier one (earlier start, bigger-or-equal end). Otherwise it
survives and becomes the new maxEnd.
The tie-break matters: with [1,4],[1,6], putting [1,6] first lets it cover [1,4].

Dry run on [[1,4],[3,6],[2,8]]:
  sorted: [1,4],[2,8],[3,6]
  [1,4]: 4 > -inf -> keep, maxEnd=4
  [2,8]: 8 > 4    -> keep, maxEnd=8
  [3,6]: 6 <= 8   -> covered   -> 2
```

### Edge cases

```
- single interval -> 1
- same start, different ends -> only the longest survives
- chain of nested intervals -> 1
```

Full JavaScript solution with tests: [08_remove_covered_intervals.js](../solutions/08_remove_covered_intervals.js). Run it with `node 08_remove_covered_intervals.js` from the solutions folder.

</details>

## Common mistakes

- Sorting by start only; with equal starts the longer interval must come first or a covered one slips through.
- Comparing with the previous interval instead of the maximum end seen so far.
- Confusing "covered" with "overlapping": partial overlap does not remove anything.

## Related follow-ups

- [Merge Intervals](../02_Medium/03_merge_intervals.md)
- [Non-overlapping Intervals](../02_Medium/06_non_overlapping_intervals.md)
- Russian Doll Envelopes (LeetCode #354)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
