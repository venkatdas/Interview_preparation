# Non-overlapping Intervals

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | greedy by end |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #435 — https://leetcode.com/problems/non-overlapping-intervals/ |
| **Solution file** | [06_non_overlapping_intervals.js](../solutions/06_non_overlapping_intervals.js) — open only after a real attempt |

## Problem

Return the minimum number of intervals to remove so that the remaining intervals do not
overlap. Touching intervals ([1,2],[2,3]) do not overlap.

## Examples

```
Input: [[1,2],[2,3],[3,4],[1,3]]   Output: 1   Explanation: remove [1,3]
Input: [[1,2],[1,2],[1,2]]         Output: 2
Input: [[1,2],[2,3]]               Output: 0
```

## Constraints & clarifying questions

```
- Touching is fine? (yes)
- Sorted input? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *greedy by end* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time. Try every subset of intervals to keep; the largest pairwise non-overlapping one wins.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by END, keep greedily)   O(n log n) time, O(1) extra. "Minimum removals" = n - "maximum intervals you can keep".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> 0
- all the same -> n - 1
- one big interval covering all small ones -> 1 (remove the big one)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time

```
Try every subset of intervals to keep; the largest pairwise non-overlapping one wins.
Answer = n - its size.
```

### APPROACH 2 — Optimal (sort by END, keep greedily)   O(n log n) time, O(1) extra

```
"Minimum removals" = n - "maximum intervals you can keep". The classic interval-scheduling
greedy: sort by end, keep an interval if it starts at or after the last kept end.
(Alternative that interviewers also accept: sort by START and, on overlap, drop the one
with the LARGER end - same count.)
```

### WHY GREEDY WORKS

```
Keeping the interval that ends earliest leaves the most room for everything after it; any
optimal set can be rewritten to start with it (exchange argument) without losing size.

Dry run on [[1,2],[2,3],[3,4],[1,3]]:
  sorted by end: [1,2],[2,3],[1,3],[3,4]
  keep [1,2] (end 2); keep [2,3] (end 3); [1,3] starts 1 < 3 -> remove; keep [3,4]  -> 1
```

### Edge cases

```
- empty -> 0
- all the same -> n - 1
- one big interval covering all small ones -> 1 (remove the big one)
```

Full JavaScript solution with tests: [06_non_overlapping_intervals.js](../solutions/06_non_overlapping_intervals.js). Run it with `node 06_non_overlapping_intervals.js` from the solutions folder.

</details>

## Common mistakes

- Sorting by start and keeping greedily; a single long interval can block many short ones.
- Treating touching intervals as overlapping; here `[1,2]` and `[2,3]` do not overlap.
- Counting kept intervals and returning that instead of n minus kept.

## Related follow-ups

- [Minimum Number of Arrows to Burst Balloons](../02_Medium/07_minimum_number_of_arrows.md)
- [Non-overlapping Intervals (greedy topic)](../../../28_Greedy_Algorithms/03_Problems/02_Medium/10_non_overlapping_intervals.md)
- Maximum Length of Pair Chain (LeetCode #646)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
