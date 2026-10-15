# Rotate Image

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | transpose + reverse (in place) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #48 — https://leetcode.com/problems/rotate-image/ |
| **Solution file** | [06_rotate_image.js](../solutions/06_rotate_image.js) — open only after a real attempt |

## Problem

Rotate an n x n matrix 90 degrees clockwise, IN PLACE (O(1) extra space).

## Examples

```
Input: [[1,2,3],[4,5,6],[7,8,9]]   Output: [[7,4,1],[8,5,2],[9,6,3]]
Input: [[1,2],[3,4]]               Output: [[3,1],[4,2]]
```

## Constraints & clarifying questions

```
- Square only? (yes - a non-square rotation changes dimensions and cannot be in place)
- Clockwise? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *transpose + reverse (in place)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n^2) space. Build a new matrix where result[c][n-1-r] = grid[r][c], then copy it back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (transpose + reverse each row)   O(n^2) time, O(1) space. Transpose flips over the main diagonal (rows become columns).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1x1 -> unchanged
- 2x2 -> works (loop c > r swaps only (0,1))
- transposing with c >= 0 instead of c > r would swap each pair twice and undo itself
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n^2) space

```
Build a new matrix where result[c][n-1-r] = grid[r][c], then copy it back. Correct, but
uses O(n^2) extra space which the problem forbids.
```

### APPROACH 2 — Optimal (transpose + reverse each row)   O(n^2) time, O(1) space

```
Transpose flips over the main diagonal (rows become columns). Reversing each row then
turns that into a clockwise rotation. Both steps are in place.
(For anticlockwise: transpose + reverse each COLUMN. For 180: reverse rows + reverse each row.)
Alternative: rotate 4 cells at a time in rings (more index arithmetic, same complexity).

Dry run on [[1,2,3],[4,5,6],[7,8,9]]:
  transpose -> [[1,4,7],[2,5,8],[3,6,9]]
  reverse rows -> [[7,4,1],[8,5,2],[9,6,3]]
```

### Edge cases

```
- 1x1 -> unchanged
- 2x2 -> works (loop c > r swaps only (0,1))
- transposing with c >= 0 instead of c > r would swap each pair twice and undo itself
```

Full JavaScript solution with tests: [06_rotate_image.js](../solutions/06_rotate_image.js). Run it with `node 06_rotate_image.js` from the solutions folder.

</details>

## Common mistakes

- Allocating a new matrix when the problem asks for in-place rotation.
- Transposing with j starting at 0, which swaps each pair twice and undoes the transpose.
- Reversing columns instead of rows (that rotates counter-clockwise).

## Related follow-ups

- [Transpose Matrix](../01_Easy/01_transpose_matrix.md) — the first half of the trick
- [Rotate Array](../../../03_Arrays/03_Problems/02_Medium/07_rotate_array.md) — reversal-based rotation in 1D
- Determine Whether Matrix Can Be Obtained By Rotation (LeetCode #1886) — apply the rotation up to four times

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
