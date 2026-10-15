# Minimum Number of Arrows to Burst Balloons

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | interval scheduling |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #452 — https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/ |
| **Solution file** | [11_minimum_arrows_burst_balloons.js](../solutions/11_minimum_arrows_burst_balloons.js) — open only after a real attempt |

## Problem

Each balloon spans [xStart, xEnd] on a line. An arrow shot straight up at x bursts every
balloon with xStart <= x <= xEnd. Return the minimum number of arrows to burst all balloons.

## Examples

```
Input: [[10,16],[2,8],[1,6],[7,12]]   Output: 2   Explanation: x=6 bursts [2,8],[1,6]; x=11 bursts [10,16],[7,12]
Input: [[1,2],[3,4],[5,6],[7,8]]      Output: 4
Input: [[1,2],[2,3],[3,4],[4,5]]      Output: 2   Explanation: touching counts as overlap here
```

## Constraints & clarifying questions

```
- Is an arrow at exactly xEnd enough? (yes, inclusive -> touching balloons share an arrow)
- Coordinates can be large/negative? (yes; use a - b comparator, not subtraction overflow tricks)
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

**Start simple.** APPROACH 1 — Brute force   O(2^n * n) time. Candidate arrow positions are the balloon ends.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort by END, shoot at the end)   O(n log n) time, O(1) extra. Sort by xEnd.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no balloons -> 0
- one balloon -> 1
- all balloons share a point -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n * n) time

```
Candidate arrow positions are the balloon ends. Try every subset of candidate positions and
check whether it covers all balloons; take the smallest.
```

### APPROACH 2 — Optimal (sort by END, shoot at the end)   O(n log n) time, O(1) extra

```
Sort by xEnd. Shoot the first arrow at the end of the first balloon. Every following balloon
that starts at or before that arrow is already burst. The first one that starts after it
needs a new arrow, shot at ITS end. Count arrows.
```

### WHY GREEDY WORKS

```
The earliest-ending balloon must be hit by some arrow at x <= its end. Moving that arrow
right to exactly its end never un-bursts anything (every other balloon ends later) and can
only burst more balloons. So "shoot at the earliest end" is always a safe first move,
and the remaining balloons form the same problem.

Dry run on [[10,16],[2,8],[1,6],[7,12]]:
  sorted by end: [1,6],[2,8],[7,12],[10,16]
  arrow at 6 (count 1); [2,8] starts 2 <= 6 burst; [7,12] starts 7 > 6 -> arrow at 12 (count 2)
  [10,16] starts 10 <= 12 burst -> 2
```

### Edge cases

```
- no balloons -> 0
- one balloon -> 1
- all balloons share a point -> 1
```

Full JavaScript solution with tests: [11_minimum_arrows_burst_balloons.js](../solutions/11_minimum_arrows_burst_balloons.js). Run it with `node 11_minimum_arrows_burst_balloons.js` from the solutions folder.

</details>

## Common mistakes

- Treating touching balloons `[1,2]` and `[2,3]` as separate - one arrow at x = 2 bursts both.
- Sorting with `a[1] - b[1]` on values near ±2^31 is fine in JS, but in other languages it overflows - mention it.
- Updating the arrow position to the new balloon's START instead of its END.

## Related follow-ups

- [Non-overlapping Intervals](../02_Medium/10_non_overlapping_intervals.md)
- [Minimum Number of Arrows (Intervals topic)](../../../31_Intervals/03_Problems/02_Medium/07_minimum_number_of_arrows.md)
- Set Intersection Size At Least Two (LeetCode #757)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
