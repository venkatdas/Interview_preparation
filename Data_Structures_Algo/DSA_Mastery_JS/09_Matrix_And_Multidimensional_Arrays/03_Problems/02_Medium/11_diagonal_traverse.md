# Diagonal Traverse

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | r + c diagonals, alternate |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #498 — https://leetcode.com/problems/diagonal-traverse/ |
| **Solution file** | [11_diagonal_traverse.js](../solutions/11_diagonal_traverse.js) — open only after a real attempt |

## Problem

Return all elements of an m x n matrix in diagonal zigzag order: the first anti-diagonal
going up-right, the next going down-left, alternating.

## Examples

```
Input: [[1,2,3],[4,5,6],[7,8,9]]   Output: [1,2,4,7,5,3,6,8,9]
Input: [[1,2],[3,4]]               Output: [1,2,3,4]
```

## Constraints & clarifying questions

```
- Which direction first? (up-right, so the first diagonal after [1] is 2 then 4)
- Non-square allowed? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *r + c diagonals, alternate* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (group by r + c, then reverse every other group)   O(m n) time, O(m n) space. Cells on the same anti-diagonal share d = r + c.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (walk each diagonal directly)   O(m n) time, O(1) extra. For d from 0 to m + n - 2: the diagonal's cells are (r, d - r) for valid r.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single row / single column -> just that row / column in order
- empty -> []
- 1x1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (group by r + c, then reverse every other group)   O(m n) time, O(m n) space

```
Cells on the same anti-diagonal share d = r + c. Bucket cells by d (row-major order gives
each bucket in down-left order), then reverse the buckets with even d so they go up-right.
```

### APPROACH 2 — Optimal (walk each diagonal directly)   O(m n) time, O(1) extra

```
For d from 0 to m + n - 2: the diagonal's cells are (r, d - r) for valid r. Going
"up-right" means r decreasing; "down-left" means r increasing. Compute the start cell
for the chosen direction, step along while in bounds. No buckets, no reversing.

Dry run on 3x3:
  d=0 up:   (0,0)=1
  d=1 down: (0,1)=2 (1,0)=4
  d=2 up:   (2,0)=7 (1,1)=5 (0,2)=3
  d=3 down: (1,2)=6 (2,1)=8
  d=4 up:   (2,2)=9      -> [1,2,4,7,5,3,6,8,9]
```

### Edge cases

```
- single row / single column -> just that row / column in order
- empty -> []
- 1x1
```

Full JavaScript solution with tests: [11_diagonal_traverse.js](../solutions/11_diagonal_traverse.js). Run it with `node 11_diagonal_traverse.js` from the solutions folder.

</details>

## Common mistakes

- Getting the boundary rules wrong when going up-right at the last column (move down, not right).
- Reversing every diagonal instead of every other one.
- Failing on a single row or a single column.

## Related follow-ups

- [Spiral Matrix](07_spiral_matrix.md) — another simulated traversal
- [Zigzag Conversion](../../../04_Strings/03_Problems/02_Medium/16_zigzag_conversion.md) — bouncing direction
- Diagonal Traverse II (LeetCode #1424) — jagged rows, group by r + c

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
