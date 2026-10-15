# Falling Squares

| | |
|---|---|
| **Topic** | Segment Tree |
| **Difficulty** | Hard |
| **Pattern** | coordinate compression + lazy range-assign/max |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #699 — https://leetcode.com/problems/falling-squares/ |
| **Solution file** | [03_falling_squares.js](../solutions/03_falling_squares.js) — open only after a real attempt |

## Problem

Squares are dropped one by one onto the x-axis. positions[i] = [left, sideLength].
A square falls straight down until it lands on the ground or on top of an earlier
square (squares that only touch at an edge do NOT stack). After each drop return the
current maximum height of any stack.

## Examples

```
Input: [[1,2],[2,3],[6,1]]   Output: [2,5,5]
  square 1 covers x in [1,3), height 2
  square 2 covers [2,5): overlaps square 1 -> lands at 2, top = 5
  square 3 covers [6,7): nothing below -> top = 1, max stays 5
Input: [[100,100],[200,100]]   Output: [100,100]   (they only touch at x = 200)
```

## Constraints & clarifying questions

```
- How many squares? (up to 1000 -> O(n^2) brute is fine; we still show the tree)
- Coordinates up to 10^8 -> cannot index the axis directly; compress coordinates.
- Edge touching counts as not overlapping (use half-open intervals [left, right)).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *coordinate compression + lazy range-assign/max* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n) space. Keep a list of landed squares (left, right, top).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Coordinate compression + segment tree, range-max with range-assign). O(n log n) time, O(n) space 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single square
- squares that touch only at an edge
- a square that spans several earlier squares (takes the highest)
- huge coordinates (compression handles them)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
Keep a list of landed squares (left, right, top). For a new square, scan all earlier
ones; its base is the max top among those whose [left, right) overlaps. Store it.
```

### APPROACH 2 — Optimal (Coordinate compression + segment tree, range-max with range-assign)

```
O(n log n) time, O(n) space
1. Collect every left and right-1 (the last integer column each square covers), sort,
   dedupe -> each real coordinate maps to a small index. Now the axis has <= 2n cells.
2. Segment tree over those cells storing the current height of each cell, with
   lazy "assign" tags (set every cell in a range to a value) and range-max query.
3. For each square: base = queryMax(l, r); newTop = base + side; assign(l, r, newTop);
   answer = max(answer, newTop).

Dry run on [[1,2],[2,3],[6,1]]:
  columns used: square1 [1,2], square2 [2,4], square3 [6,6] -> coords {1,2,4,6} -> idx 0..3
  square1: l=0 (x=1) r=1 (x=2); max = 0; top 2; assign idx0..1 = 2; ans 2
  square2: x in [2,4] -> idx1..2; max = 2 (idx1); top 5; assign idx1..2 = 5; ans 5
  square3: x=6 -> idx3..3; max = 0; top 1; ans stays 5
  -> [2,5,5]

Why compress with right - 1 and not right? If we used right, square [1,2] (covers
columns 1,2) and [3,1] (column 3) would share coordinate 3 and wrongly overlap.
```

### Edge cases

```
- single square
- squares that touch only at an edge
- a square that spans several earlier squares (takes the highest)
- huge coordinates (compression handles them)
```

Full JavaScript solution with tests: [03_falling_squares.js](../solutions/03_falling_squares.js). Run it with `node 03_falling_squares.js` from the solutions folder.

</details>

## Common mistakes

- Treating the right edge as inclusive; a square on [left, left + size) does not touch one starting exactly at left + size.
- Building a segment tree over raw coordinates up to 10^8 instead of compressing them.
- Using "range add" instead of "range assign": the new height replaces the old ones, it does not add to them.

## Related follow-ups

- [My Calendar III](04_my_calendar_iii.md)
- [Range Minimum Query with updates](../02_Medium/02_range_minimum_query.md)
- The Skyline Problem (LeetCode #218)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
