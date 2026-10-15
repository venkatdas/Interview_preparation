# Valid Square

| | |
|---|---|
| **Topic** | Geometric Algorithms |
| **Difficulty** | Medium |
| **Pattern** | six squared distances |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #593 — https://leetcode.com/problems/valid-square/ |
| **Solution file** | [03_valid_square.js](../solutions/03_valid_square.js) — open only after a real attempt |

## Problem

Given four points in the plane (any order), return true if they form a square with
positive area. The square may be rotated.

## Examples

```
Input: [0,0],[1,1],[1,0],[0,1]   Output: true
Input: [0,0],[1,1],[1,0],[0,12]  Output: false
Input: [1,0],[-1,0],[0,1],[0,-1] Output: true   (rotated 45 degrees)
```

## Constraints & clarifying questions

```
- Integer coordinates (so squared distances are exact integers; no sqrt needed)
- Points may coincide -> not a square (zero area)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *six squared distances* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(4!) = 24 orderings. Try every ordering as a polygon p0 p1 p2 p3 and check: four equal non-zero sides, both diagonals equal, and diagonal^2 = 2 * side^2 (that forces right angles).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Six pairwise squared distances)   O(1). A square has exactly 4 equal sides and 2 equal diagonals among its 6 point pairs, and diagonal^2 = 2 * side^2.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all four points identical -> false (d[0] === 0)
- a rhombus that is not a square (diagonals differ) -> false
- a rectangle that is not a square (sides differ) -> false
- rotated squares
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(4!) = 24 orderings

```
Try every ordering as a polygon p0 p1 p2 p3 and check: four equal non-zero sides,
both diagonals equal, and diagonal^2 = 2 * side^2 (that forces right angles).
```

### APPROACH 2 — Optimal (Six pairwise squared distances)   O(1)

```
A square has exactly 4 equal sides and 2 equal diagonals among its 6 point pairs, and
diagonal^2 = 2 * side^2. So: compute the 6 squared distances, sort, and require
  d[0] === d[1] === d[2] === d[3] > 0   (sides)
  d[4] === d[5]                           (diagonals)
  d[4] === 2 * d[0]                       (right angles)
Why sufficient: 4 equal sides -> rhombus; equal diagonals -> rectangle; both -> square.

Dry run on [0,0],[1,1],[1,0],[0,1]:
  distances: (0,0)-(1,1)=2, (0,0)-(1,0)=1, (0,0)-(0,1)=1, (1,1)-(1,0)=1, (1,1)-(0,1)=1, (1,0)-(0,1)=2
  sorted [1,1,1,1,2,2]: sides 1 > 0, diagonals 2 === 2, 2 === 2*1 -> true
```

### Edge cases

```
- all four points identical -> false (d[0] === 0)
- a rhombus that is not a square (diagonals differ) -> false
- a rectangle that is not a square (sides differ) -> false
- rotated squares
```

Full JavaScript solution with tests: [03_valid_square.js](../solutions/03_valid_square.js). Run it with `node 03_valid_square.js` from the solutions folder.

</details>

## Common mistakes

- Assuming the points come in order around the square; they can be in any order.
- Not rejecting the case where points coincide (side length 0).
- Using `Math.sqrt` and comparing floats; squared distances are exact integers.

## Related follow-ups

- [Minimum Area Rectangle](05_minimum_area_rectangle.md)
- Valid Boomerang (LeetCode #1037)
- Largest Triangle Area (LeetCode #812)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
