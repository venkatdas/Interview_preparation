# Reshape the Matrix

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Easy |
| **Pattern** | 1D index <-> 2D index |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #566 — https://leetcode.com/problems/reshape-the-matrix/ |
| **Solution file** | [04_reshape_the_matrix.js](../solutions/04_reshape_the_matrix.js) — open only after a real attempt |

## Problem

Reshape an m x n matrix into an r x c matrix keeping the row-major order of elements.
If r * c !== m * n, return the original matrix unchanged.

## Examples

```
Input: mat = [[1,2],[3,4]], r = 1, c = 4   Output: [[1,2,3,4]]
Input: mat = [[1,2],[3,4]], r = 2, c = 4   Output: [[1,2],[3,4]]   Explanation: 8 != 4 cells
```

## Constraints & clarifying questions

```
- Return the same reference or a copy when impossible? (same reference is accepted)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *1D index <-> 2D index* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (flatten then chunk)   O(m n) time, O(m n) space. Flatten into a 1D array, then slice it into rows of length c.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (1D index &lt;-> 2D index arithmetic)   O(m n) time, O(r c) output. Walk a single counter k from 0 to m*n - 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- same shape requested -> a copy with same contents
- 1 x n -> n x 1
- size mismatch -> original
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (flatten then chunk)   O(m n) time, O(m n) space

```
Flatten into a 1D array, then slice it into rows of length c. Easy to read.
```

### APPROACH 2 — Optimal (1D index &lt;-> 2D index arithmetic)   O(m n) time, O(r c) output

```
Walk a single counter k from 0 to m*n - 1. The source cell is
  (Math.floor(k / n), k % n)      and the target cell is   (Math.floor(k / c), k % c).
No intermediate array. This "flatten index" trick also powers binary search on a sorted
matrix and many grid DP problems.

Dry run on [[1,2],[3,4]], r=1, c=4 (n=2):
  k=0: src (0,0)=1 -> dst (0,0)
  k=1: src (0,1)=2 -> dst (0,1)
  k=2: src (1,0)=3 -> dst (0,2)
  k=3: src (1,1)=4 -> dst (0,3)   -> [[1,2,3,4]]
```

### Edge cases

```
- same shape requested -> a copy with same contents
- 1 x n -> n x 1
- size mismatch -> original
```

Full JavaScript solution with tests: [04_reshape_the_matrix.js](../solutions/04_reshape_the_matrix.js). Run it with `node 04_reshape_the_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Not returning the original matrix when r·c differs from the element count.
- Mixing up the flat-index formula: new cell is `[k / c | 0][k % c]` for the *new* column count c.
- Building rows with a shared reference (`fill([])`).

## Related follow-ups

- [Transpose Matrix](01_transpose_matrix.md) — another shape change
- [Search a 2D Matrix](../../../10_Searching/03_Problems/02_Medium/11_search_2d_matrix.md) — the same flat-index trick for binary search
- [Spiral Matrix II](../02_Medium/08_spiral_matrix_ii.md) — fill a matrix by a rule

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
