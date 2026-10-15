# Minimum Number of Arrows to Burst Balloons

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Medium |
| **Pattern** | greedy by end |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #452 — https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/ |
| **Solution file** | [07_minimum_number_of_arrows.js](../solutions/07_minimum_number_of_arrows.js) — open only after a real attempt |

## Problem

Each balloon covers [xStart, xEnd] on the x-axis. An arrow shot at x bursts every balloon
with xStart <= x <= xEnd. Return the minimum arrows to burst all balloons.

## Examples

```
Input: [[10,16],[2,8],[1,6],[7,12]]   Output: 2
Input: [[1,2],[3,4],[5,6],[7,8]]      Output: 4
Input: [[1,2],[2,3],[3,4],[4,5]]      Output: 2   Explanation: touching balloons share an arrow
```

## Constraints & clarifying questions

```
- Inclusive ends (touching shares an arrow)? (yes)
- Huge coordinates (+-2^31)? (yes - use a - b comparator, fine in JS)
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

**Start simple.** APPROACH 1 — Brute force   O(2^n * n) time. Arrow positions can be limited to balloon ends.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by end, shoot at the earliest end)   O(n log n) time, O(1) extra. Sort by xEnd.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- none -> 0
- all overlap at one point -> 1
- touching chain [1,2],[2,3],[3,4] -> 2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n * n) time

```
Arrow positions can be limited to balloon ends. Try every subset of those positions and
keep the smallest one that bursts everything.
```

### APPROACH 2 — Optimal (sort by end, shoot at the earliest end)   O(n log n) time, O(1) extra

```
Sort by xEnd. Shoot the first arrow at the first balloon's end. Skip every balloon whose
start <= that arrow (already burst). The first balloon that starts after the arrow needs a
new arrow at ITS end. This is "maximum number of non-overlapping groups", the same
interval-scheduling greedy as Non-overlapping Intervals, but with inclusive ends.

Dry run on [[10,16],[2,8],[1,6],[7,12]]:
  sorted by end: [1,6],[2,8],[7,12],[10,16]
  arrow@6: [2,8] 2<=6 burst; [7,12] 7>6 -> arrow@12; [10,16] 10<=12 burst -> 2
```

### Edge cases

```
- none -> 0
- all overlap at one point -> 1
- touching chain [1,2],[2,3],[3,4] -> 2
```

Full JavaScript solution with tests: [07_minimum_number_of_arrows.js](../solutions/07_minimum_number_of_arrows.js). Run it with `node 07_minimum_number_of_arrows.js` from the solutions folder.

</details>

## Common mistakes

- Assuming the answer equals the number of merged blocks; a chain of touching balloons may still need several arrows.
- Using `a[1] - b[1]` in the comparator with huge coordinates; values near ±2^31 are fine in JS numbers, but in other languages this overflows.
- Using `<` vs `<=` wrongly: balloons that touch at x can share one arrow at x.

## Related follow-ups

- [Non-overlapping Intervals](../02_Medium/06_non_overlapping_intervals.md)
- [Minimum Arrows (greedy topic)](../../../28_Greedy_Algorithms/03_Problems/02_Medium/11_minimum_arrows_burst_balloons.md)
- [Meeting Rooms II](../02_Medium/09_meeting_rooms_ii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
