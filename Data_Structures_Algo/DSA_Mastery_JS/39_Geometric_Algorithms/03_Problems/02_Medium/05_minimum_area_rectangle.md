# Minimum Area Rectangle

| | |
|---|---|
| **Topic** | Geometric Algorithms |
| **Difficulty** | Medium |
| **Pattern** | diagonal pairs + Set |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #939 — https://leetcode.com/problems/minimum-area-rectangle/ |
| **Solution file** | [05_minimum_area_rectangle.js](../solutions/05_minimum_area_rectangle.js) — open only after a real attempt |

## Problem

Given distinct points with integer coordinates, return the minimum area of an
AXIS-ALIGNED rectangle whose four corners are all among the points. Return 0 if none exists.

## Examples

```
Input: [[1,1],[1,3],[3,1],[3,3],[2,2]]          Output: 4
Input: [[1,1],[1,3],[3,1],[3,3],[4,1],[4,3]]    Output: 2
Input: [[0,0],[1,1]]                            Output: 0
```

## Constraints & clarifying questions

```
- Axis-aligned only (sides parallel to the axes); the rotated version is LeetCode 963
- Up to 500 points -> O(n^2) is fine, O(n^4) is not
- All points distinct
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *diagonal pairs + Set* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^4). Try every 4-subset and test whether it forms an axis-aligned rectangle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Diagonal pairs + point set)   O(n^2) time, O(n) space. Put every point in a Set of "x,y" keys.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- fewer than 4 points -> 0
- all points on one line -> 0
- several rectangles -> the smallest one
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^4)

```
Try every 4-subset and test whether it forms an axis-aligned rectangle.
```

### APPROACH 2 — Optimal (Diagonal pairs + point set)   O(n^2) time, O(n) space

```
Put every point in a Set of "x,y" keys. For every pair of points (x1, y1), (x2, y2) with
x1 != x2 and y1 != y2, treat them as OPPOSITE corners (a diagonal). The other two corners
are (x1, y2) and (x2, y1); if both exist, the rectangle is valid with area
|x1 - x2| * |y1 - y2|. Track the minimum. Each rectangle is found by both of its diagonals,
which is harmless.

Dry run on [[1,1],[1,3],[3,1],[3,3],[2,2]]:
  pair (1,1)-(3,3): need (1,3) and (3,1) -> both present -> area 4
  pair (1,1)-(2,2): need (1,2), (2,1) -> missing
  ... no smaller rectangle -> 4
```

### Edge cases

```
- fewer than 4 points -> 0
- all points on one line -> 0
- several rectangles -> the smallest one
```

Full JavaScript solution with tests: [05_minimum_area_rectangle.js](../solutions/05_minimum_area_rectangle.js). Run it with `node 05_minimum_area_rectangle.js` from the solutions folder.

</details>

## Common mistakes

- Trying all 4-point combinations, O(n^4).
- Treating two points that share an x or a y as a diagonal; a diagonal needs both coordinates different.
- Returning Infinity instead of 0 when no rectangle exists.

## Related follow-ups

- [Rectangle Area](02_rectangle_area.md)
- Minimum Area Rectangle II (LeetCode #963)
- [Valid Square](03_valid_square.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
