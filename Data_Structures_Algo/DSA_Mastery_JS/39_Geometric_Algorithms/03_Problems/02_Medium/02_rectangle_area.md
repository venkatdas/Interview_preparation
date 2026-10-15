# Rectangle Area

| | |
|---|---|
| **Topic** | Geometric Algorithms |
| **Difficulty** | Medium |
| **Pattern** | inclusion-exclusion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #223 — https://leetcode.com/problems/rectangle-area/ |
| **Solution file** | [02_rectangle_area.js](../solutions/02_rectangle_area.js) — open only after a real attempt |

## Problem

Two axis-aligned rectangles are given by their bottom-left and top-right corners
(ax1, ay1, ax2, ay2) and (bx1, by1, bx2, by2). Return the total area covered by the two
rectangles (the union; overlapping area counted once).

## Examples

```
Input: A = (-3,0,3,4), B = (0,-1,9,2)   Output: 45   (24 + 27 - 6 overlap)
Input: A = (-2,-2,2,2), B = (-2,-2,2,2)  Output: 16
```

## Constraints & clarifying questions

```
- Coordinates up to +-10^4 -> areas up to ~4 * 10^8, fine as JS numbers
- Rectangles may not overlap at all
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *inclusion-exclusion* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(area) time. Count unit cells covered by A or B with a Set of cell keys.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Inclusion-exclusion)   O(1). union = area(A) + area(B) - area(A intersect B) The intersection of axis-aligned rectangles is itself an axis-aligned rectangle: width  = min(ax2, bx2) - max(ax1, bx1) height = min(ay2, by2) - max(ay1, by1) and it is empty (area 0) when either is &lt;= 0.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no overlap (negative width or height -> clamp to 0)
- identical rectangles -> area once
- one inside the other -> the bigger area
- touching edge -> overlap 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(area) time

```
Count unit cells covered by A or B with a Set of cell keys. Only for small coordinates.
```

### APPROACH 2 — Optimal (Inclusion-exclusion)   O(1)

```
union = area(A) + area(B) - area(A intersect B)
The intersection of axis-aligned rectangles is itself an axis-aligned rectangle:
  width  = min(ax2, bx2) - max(ax1, bx1)
  height = min(ay2, by2) - max(ay1, by1)
and it is empty (area 0) when either is <= 0.

Dry run on the example:
  area A = 6 * 4 = 24; area B = 9 * 3 = 27
  width = min(3, 9) - max(-3, 0) = 3; height = min(4, 2) - max(0, -1) = 2 -> overlap 6
  union = 24 + 27 - 6 = 45
```

### Edge cases

```
- no overlap (negative width or height -> clamp to 0)
- identical rectangles -> area once
- one inside the other -> the bigger area
- touching edge -> overlap 0
```

Full JavaScript solution with tests: [02_rectangle_area.js](../solutions/02_rectangle_area.js). Run it with `node 02_rectangle_area.js` from the solutions folder.

</details>

## Common mistakes

- Adding the two areas without subtracting the overlap (inclusion-exclusion).
- Letting the overlap width or height go negative when the rectangles are apart; clamp each to 0.
- Computing overlap as `min(right) - max(left)` but mixing up which coordinates are x and which are y.

## Related follow-ups

- [Rectangle Overlap](../01_Easy/01_rectangle_overlap.md)
- Rectangle Area II (LeetCode #850)
- [Minimum Area Rectangle](05_minimum_area_rectangle.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
