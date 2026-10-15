# Spiral Matrix II

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | shrinking bounds (fill) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #59 — https://leetcode.com/problems/spiral-matrix-ii/ |
| **Solution file** | [08_spiral_matrix_ii.js](../solutions/08_spiral_matrix_ii.js) — open only after a real attempt |

## Problem

Given n, generate an n x n matrix filled with 1 .. n^2 in spiral order (clockwise).

## Examples

```
Input: 3   Output: [[1,2,3],[8,9,4],[7,6,5]]
Input: 1   Output: [[1]]
```

## Constraints & clarifying questions

```
- n >= 1? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *shrinking bounds (fill)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (walk and turn when blocked)   O(n^2) time, O(1) extra. Fill the grid with 0 (0 means empty).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (four shrinking walls, same as Spiral Matrix)   O(n^2) time, O(1) extra. Identical skeleton to problem 07, but writing a counter instead of reading.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> [[1]]
- n = 2 -> [[1,2],[4,3]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (walk and turn when blocked)   O(n^2) time, O(1) extra

```
Fill the grid with 0 (0 means empty). Walk right; when the next cell is out of bounds or
already filled, turn clockwise. Place the next number each step.
```

### APPROACH 2 — Optimal (four shrinking walls, same as Spiral Matrix)   O(n^2) time, O(1) extra

```
Identical skeleton to problem 07, but writing a counter instead of reading. Because the
matrix is square, the two guards are still needed for the final cell when n is odd
(the centre is a 1x1 remaining square).

Dry run for n = 3:
  top row:    1 2 3     top=1
  right col:  4 5       right=1
  bottom row: 6 7       bottom=1
  left col:   8         left=1
  top row:    9         -> [[1,2,3],[8,9,4],[7,6,5]]
```

### Edge cases

```
- n = 1 -> [[1]]
- n = 2 -> [[1,2],[4,3]]
```

Full JavaScript solution with tests: [08_spiral_matrix_ii.js](../solutions/08_spiral_matrix_ii.js). Run it with `node 08_spiral_matrix_ii.js` from the solutions folder.

</details>

## Common mistakes

- Shrinking boundaries in the wrong order, overwriting already-filled cells.
- Creating rows with a shared array (`Array(n).fill(Array(n))`).
- Missing the centre cell when n is odd.

## Related follow-ups

- [Spiral Matrix](07_spiral_matrix.md) — read in spiral order
- [Pascal's Triangle](../01_Easy/05_pascals_triangle.md) — build a 2D structure row by row
- [Rotate Image](06_rotate_image.md) — layer-by-layer thinking

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
