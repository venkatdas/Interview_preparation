# The Skyline Problem

| | |
|---|---|
| **Topic** | Divide and Conquer |
| **Difficulty** | Hard |
| **Pattern** | merge two skylines |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #218 — https://leetcode.com/problems/the-skyline-problem/ |
| **Solution file** | [08_the_skyline_problem.js](../solutions/08_the_skyline_problem.js) — open only after a real attempt |

## Problem

buildings[i] = [left, right, height]. Return the skyline as a list of key points
[x, y]: every x where the outline height changes, with the new height y. The last point
always has y = 0. No two consecutive points may share the same y.

## Examples

```
Input: [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
Input: [[0,2,3],[2,5,3]]   Output: [[0,3],[5,0]]   (merged, no [2,3] duplicate height)
```

## Constraints & clarifying questions

```
- Up to 10^4 buildings, coordinates up to 2^31 -> cannot scan the x axis
- Buildings are sorted by left (given), heights >= 1
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *merge two skylines* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sweep with a scan of active buildings)   O(n^2) time. Collect every left and right edge, sort the x's.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Divide & conquer: merge two skylines)   O(n log n) time. One building's skyline is [[left, h], [right, 0]].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single building
- buildings sharing an edge with equal height (must merge)
- one building entirely inside a taller one (no points from the inner one)
- buildings with the same left edge
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sweep with a scan of active buildings)   O(n^2) time

```
Collect every left and right edge, sort the x's. At each x, the height is the max height
of all buildings with left <= x < right (scan all n). Emit a point when the height changes.
```

### APPROACH 2 — Optimal (Divide & conquer: merge two skylines)   O(n log n) time

```
One building's skyline is [[left, h], [right, 0]]. Split the buildings in half, compute
each half's skyline recursively, then MERGE the two skylines like merge sort: walk both
point lists by x, keep the current height of each side (hLeft, hRight), and the merged
height at any x is max(hLeft, hRight). Emit a point only when that max changes.
Merge is O(a + b) -> T(n) = 2T(n/2) + O(n) = O(n log n).
(The common alternative: sweep line with a max-heap of active heights + lazy deletion.)

Dry run on [[0,2,3],[2,5,3]]:
  left skyline  [[0,3],[2,0]], right skyline [[2,3],[5,0]]
  merge: x=0: hL=3, max 3 -> emit [0,3]
         x=2 (both): hL=0, hR=3 -> max 3 (unchanged) -> no emit
         x=5: hR=0 -> max 0 -> emit [5,0]
  -> [[0,3],[5,0]]
```

### Edge cases

```
- single building
- buildings sharing an edge with equal height (must merge)
- one building entirely inside a taller one (no points from the inner one)
- buildings with the same left edge
```

Full JavaScript solution with tests: [08_the_skyline_problem.js](../solutions/08_the_skyline_problem.js). Run it with `node 08_the_skyline_problem.js` from the solutions folder.

</details>

## Common mistakes

- Emitting a point every time instead of only when the max height actually changes.
- Wrong tie handling at equal x: process starts (tallest first) before ends, or you get extra points.
- Forgetting the final point at height 0 where the last building ends.

## Related follow-ups

- [Merge k Sorted Lists](../03_Hard/04_merge_k_sorted_lists.md)
- [Meeting Rooms II](../../../31_Intervals/03_Problems/02_Medium/09_meeting_rooms_ii.md)
- Rectangle Area II (LeetCode #850)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
