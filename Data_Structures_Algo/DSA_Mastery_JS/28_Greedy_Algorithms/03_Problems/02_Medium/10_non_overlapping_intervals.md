# Non-overlapping Intervals

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | interval scheduling |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #435 — https://leetcode.com/problems/non-overlapping-intervals/ |
| **Solution file** | [10_non_overlapping_intervals.js](../solutions/10_non_overlapping_intervals.js) — open only after a real attempt |

## Problem

Given intervals [start, end], return the minimum number of intervals to remove so that
the rest do not overlap. Touching intervals ([1,2] and [2,3]) do NOT overlap.

## Examples

```
Input: [[1,2],[2,3],[3,4],[1,3]]   Output: 1   Explanation: remove [1,3]
Input: [[1,2],[1,2],[1,2]]         Output: 2
Input: [[1,2],[2,3]]               Output: 0
```

## Constraints & clarifying questions

```
- Do touching intervals count as overlapping? (no)
- Is the input sorted? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *interval scheduling* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time. Try every subset, keep the largest subset that is pairwise non-overlapping.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (interval scheduling: sort by END)   O(n log n) time, O(1) extra. "Minimum removals" = n - "maximum non-overlapping intervals you can keep".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty or single interval -> 0
- all identical -> n - 1
- one giant interval covering all others -> remove the giant one (sorting by end handles it)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time

```
Try every subset, keep the largest subset that is pairwise non-overlapping. Answer is
n - (size of that subset).
```

### APPROACH 2 — Optimal (interval scheduling: sort by END)   O(n log n) time, O(1) extra

```
"Minimum removals" = n - "maximum non-overlapping intervals you can keep". Sort by end.
Keep an interval if it starts at or after the end of the last kept one.
```

### WHY GREEDY WORKS

```
Among all intervals that could come first, the one that ENDS earliest leaves the most room
for the rest. Exchange argument: take any optimal kept set; replace its earliest-ending
interval by the globally earliest-ending one. It still fits (it ends no later), the set is
the same size. Repeat for the rest -> the greedy set is optimal.

Dry run on [[1,2],[2,3],[3,4],[1,3]]:
  sorted by end: [1,2],[2,3],[1,3],[3,4]
  keep [1,2]      lastEnd=2
  [2,3] 2>=2 keep lastEnd=3
  [1,3] 1<3  remove (count 1)
  [3,4] 3>=3 keep lastEnd=4   -> 1
```

### Edge cases

```
- empty or single interval -> 0
- all identical -> n - 1
- one giant interval covering all others -> remove the giant one (sorting by end handles it)
```

Full JavaScript solution with tests: [10_non_overlapping_intervals.js](../solutions/10_non_overlapping_intervals.js). Run it with `node 10_non_overlapping_intervals.js` from the solutions folder.

</details>

## Common mistakes

- Sorting by start and keeping the first interval - a long early interval blocks many others. Sort by END.
- Treating touching intervals like `[1,2]` and `[2,3]` as overlapping; here they are fine.
- Returning the number kept instead of the number removed.

## Related follow-ups

- [Minimum Number of Arrows to Burst Balloons](../02_Medium/11_minimum_arrows_burst_balloons.md)
- [Meeting Rooms II](../../../31_Intervals/03_Problems/02_Medium/09_meeting_rooms_ii.md)
- Maximum Length of Pair Chain (LeetCode #646)
- Maximum Profit in Job Scheduling (LeetCode #1235) - weighted, needs DP

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
