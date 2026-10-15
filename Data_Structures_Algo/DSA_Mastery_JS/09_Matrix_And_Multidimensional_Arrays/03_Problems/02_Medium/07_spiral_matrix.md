# Spiral Matrix

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | shrinking bounds |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #54 — https://leetcode.com/problems/spiral-matrix/ |
| **Solution file** | [07_spiral_matrix.js](../solutions/07_spiral_matrix.js) — open only after a real attempt |

## Problem

Return all elements of an m x n matrix in spiral order (clockwise from the top-left).

## Examples

```
Input: [[1,2,3],[4,5,6],[7,8,9]]              Output: [1,2,3,6,9,8,7,4,5]
Input: [[1,2,3,4],[5,6,7,8],[9,10,11,12]]     Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```

## Constraints & clarifying questions

```
- Non-square allowed? (yes - this is where bugs hide)
- Empty matrix? (return [])
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *shrinking bounds* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate walking with a visited grid)   O(m n) time, O(m n) space. Start at (0,0) heading right.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (four shrinking walls)   O(m n) time, O(1) extra (besides output). Keep top, bottom, left, right.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1 x n and n x 1 -> the guards matter
- 1 x 1 -> [x]
- [] -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate walking with a visited grid)   O(m n) time, O(m n) space

```
Start at (0,0) heading right. Step until the next cell is out of bounds or visited, then
turn clockwise. Stop after m*n cells. Simple to reason about, needs a visited matrix.
```

### APPROACH 2 — Optimal (four shrinking walls)   O(m n) time, O(1) extra (besides output)

```
Keep top, bottom, left, right. Each loop: walk the top row (then top++), the right column
(right--), the bottom row if top <= bottom (bottom--), the left column if left <= right
(left++). The two `if` guards prevent double-visiting on the final single row/column.

Dry run on 3x4 [[1,2,3,4],[5,6,7,8],[9,10,11,12]]:
  top row:    1 2 3 4     top=1
  right col:  8 12        right=2
  bottom row: 11 10 9     bottom=1
  left col:   5           left=1
  top row:    6 7         top=2 > bottom -> stop
```

### Edge cases

```
- 1 x n and n x 1 -> the guards matter
- 1 x 1 -> [x]
- [] -> []
```

Full JavaScript solution with tests: [07_spiral_matrix.js](../solutions/07_spiral_matrix.js). Run it with `node 07_spiral_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Not re-checking `top <= bottom` and `left <= right` before the bottom-row and left-column passes, which duplicates elements for non-square matrices.
- Using a visited matrix and direction array is fine but costs O(m·n) extra space.
- Failing on a single row or a single column.

## Related follow-ups

- [Spiral Matrix II](08_spiral_matrix_ii.md) — write instead of read
- [Diagonal Traverse](11_diagonal_traverse.md) — another traversal order
- Spiral Matrix III (LeetCode #885) — spiral that starts inside and leaves the grid

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
