# Maximal Rectangle

| | |
|---|---|
| **Topic** | Monotonic Stacks and Queues |
| **Difficulty** | Hard |
| **Pattern** | histogram per row |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #85 — https://leetcode.com/problems/maximal-rectangle/ |
| **Solution file** | [05_maximal_rectangle.js](../solutions/05_maximal_rectangle.js) — open only after a real attempt |

## Problem

Given a binary matrix of '0' / '1' characters, return the area of the largest rectangle
containing only '1's.

## Examples

```
Input: [["1","0","1","0","0"],
        ["1","0","1","1","1"],
        ["1","1","1","1","1"],
        ["1","0","0","1","0"]]        Output: 6   (rows 1-2, columns 2-4)
Input: [["0"]]   Output: 0
Input: [["1"]]   Output: 1
```

## Constraints & clarifying questions

```
- Cells are the characters '0'/'1' (not numbers)
- rows, cols up to 200 -> O(rows * cols) ideal; O(rows^2 * cols) also passes
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *histogram per row* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(rows^2 * cols^2) time. For every top-left and bottom-right corner, check that the rectangle is all ones using a 2D prefix sum of ones (O(1) per check).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Row-by-row histogram + Largest Rectangle in Histogram)   O(rows * cols). For each row build heights[c] = number of consecutive '1's ending at this row in column c (reset to 0 on a '0').

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty matrix -> 0
- all zeros -> 0
- all ones -> rows * cols
- a single column
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(rows^2 * cols^2) time

```
For every top-left and bottom-right corner, check that the rectangle is all ones using a
2D prefix sum of ones (O(1) per check). Fine for tiny inputs only.
```

### APPROACH 2 — Optimal (Row-by-row histogram + Largest Rectangle in Histogram)   O(rows * cols)

```
For each row build heights[c] = number of consecutive '1's ending at this row in column c
(reset to 0 on a '0'). Every rectangle with its bottom edge on this row is a rectangle in
that histogram, so run the O(cols) monotonic-stack histogram solution per row.

Dry run on the example:
  row 0 heights [1,0,1,0,0] -> best 1
  row 1 heights [2,0,2,1,1] -> best 3 (columns 2-4, height 1)
  row 2 heights [3,1,3,2,2] -> best 6 (columns 2-4, height 2)
  row 3 heights [4,0,0,3,0] -> best 4
  answer 6
```

### Edge cases

```
- empty matrix -> 0
- all zeros -> 0
- all ones -> rows * cols
- a single column
```

Full JavaScript solution with tests: [05_maximal_rectangle.js](../solutions/05_maximal_rectangle.js). Run it with `node 05_maximal_rectangle.js` from the solutions folder.

</details>

## Common mistakes

- Not resetting a column height to 0 when the cell is `0`.
- Comparing the cell with the number 1 when the matrix holds strings `"1"`.
- Trying to grow rectangles directly in 2-D (O(R²C²)).

## Related follow-ups

- [Largest Rectangle in Histogram](04_largest_rectangle_in_histogram.md)
- Maximal Square (LeetCode #221)
- Count Submatrices With All Ones (LeetCode #1504)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
