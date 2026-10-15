# Rectangle Overlap

| | |
|---|---|
| **Topic** | Geometric Algorithms |
| **Difficulty** | Easy |
| **Pattern** | interval overlap per axis |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #836 — https://leetcode.com/problems/rectangle-overlap/ |
| **Solution file** | [01_rectangle_overlap.js](../solutions/01_rectangle_overlap.js) — open only after a real attempt |

## Problem

Axis-aligned rectangles are given as [x1, y1, x2, y2] (bottom-left, top-right).
Return true if the two rectangles overlap with POSITIVE area (touching edges or corners
does not count).

## Examples

```
Input: rec1 = [0,0,2,2], rec2 = [1,1,3,3]   Output: true
Input: rec1 = [0,0,1,1], rec2 = [1,0,2,1]   Output: false   (share an edge only)
Input: rec1 = [0,0,1,1], rec2 = [2,2,3,3]   Output: false
```

## Constraints & clarifying questions

```
- Can a rectangle be degenerate (zero width/height)? (LeetCode: yes -> never overlaps)
- Coordinates up to +-10^9 -> no float math, no area computation needed
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *interval overlap per axis* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(area) time. Sample every unit cell of rec1 and check whether its centre lies strictly inside rec2.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Interval overlap on each axis)   O(1). The intersection of two axis-aligned rectangles is the rectangle [max(x1s), max(y1s)] ..

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- identical rectangles -> true
- touching at a corner -> false
- degenerate (x1 === x2) -> false
- one inside the other -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(area) time

```
Sample every unit cell of rec1 and check whether its centre lies strictly inside rec2.
Only works for small integer coordinates; shown as a sanity reference.
```

### APPROACH 2 — Optimal (Interval overlap on each axis)   O(1)

```
The intersection of two axis-aligned rectangles is the rectangle
  [max(x1s), max(y1s)] .. [min(x2s), min(y2s)]
and it has positive area iff  max(x1s) < min(x2s)  AND  max(y1s) < min(y2s).
(The popular form "a1 < b2 && b1 < a2" is the same thing for proper rectangles, but it
wrongly says "overlap" for a degenerate zero-width rectangle; the max/min form does not.)

Dry run on [0,0,2,2] vs [1,1,3,3]:
  x: max(0,1)=1 < min(2,3)=2 -> overlap;  y: max(0,1)=1 < min(2,3)=2 -> overlap -> true
[0,0,1,1] vs [1,0,2,1]: x: max(0,1)=1 < min(1,2)=1 is false -> no overlap -> false
[2,2,2,5] vs [0,0,4,4]: x: max(2,0)=2 < min(2,4)=2 is false -> false (degenerate)
```

### Edge cases

```
- identical rectangles -> true
- touching at a corner -> false
- degenerate (x1 === x2) -> false
- one inside the other -> true
```

Full JavaScript solution with tests: [01_rectangle_overlap.js](../solutions/01_rectangle_overlap.js). Run it with `node 01_rectangle_overlap.js` from the solutions folder.

</details>

## Common mistakes

- Counting rectangles that only touch at an edge or corner as overlapping; the problem asks for positive area, so use strict `<`.
- Enumerating every corner-inside-other-rectangle case; a cross shape overlaps with no corner inside either rectangle.
- Forgetting degenerate (zero-width or zero-height) rectangles, which can never overlap.

## Related follow-ups

- [Rectangle Area](../02_Medium/02_rectangle_area.md)
- [Merge Intervals](../../../31_Intervals/README.md) (same per-axis overlap test)
- Rectangle Area II (LeetCode #850)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
