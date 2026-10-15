# Vertical Columns

| | |
|---|---|
| **Set** | [Mixed Set 04](README.md) — problem 04 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [04_vertical_columns.js](solutions/04_vertical_columns.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

Picture a binary tree (level-order array, null = missing) drawn on a grid: the root is
at (row 0, col 0); a left child is at (row + 1, col - 1); a right child at
(row + 1, col + 1). Return the values column by column from the leftmost column to the
rightmost. Inside one column list values top to bottom (by row); if two nodes share
both row and column, list the smaller value first.

## Examples

```
Input: [3, 9, 20, null, null, 15, 7]   Output: [[9], [3, 15], [20], [7]]
Input: [1, 2, 3, 4, 6, 5, 7]           Output: [[4], [2], [1, 5, 6], [3], [7]]
       Explanation: 5 and 6 share (row 2, col 0) -> 5 first
Input: []                              Output: []
```

## Constraints & clarifying questions

```
- Up to 10^4 nodes. Values may repeat.
- Same row + same column -> smaller value first (state this rule out loud; it is the trap).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** BFS with (row, col) coordinates + hash map of columns + sorting with a tie rule. See [Binary Trees](../../../20_Trees/01_Binary_Trees/README.md), [Hashing](../../../05_Hashing/README.md) and [Sorting](../../../11_Sorting/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Collect (row, col, val) for every node and sort them all by (col, row, val).

</details>

<details><summary>Hint 3</summary>

**The key idea.** BFS already gives rows in order. Group by column in a map, remember min/max column, and sort each column by (row, val).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> []
- single node -> [[val]]
- a long left chain -> one value per column
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * C + n log n) time, O(n) space

```
Collect (row, col, val) for every node. For each column from min to max, filter the
nodes in that column and sort them by (row, val).
```

### APPROACH 2 — Optimal (BFS with coordinates + hash map of columns + sort per column)   O(n log n) time, O(n) space

```
BFS visits nodes row by row, so pushing (row, val) into map[col] keeps rows in order
already; only same-row ties need sorting. Track min/max column to emit columns without
sorting the keys. Sort each column by (row, val) — cheap, and safe.

Dry run on [1, 2, 3, 4, 6, 5, 7]:
  row 0: 1 at col 0
  row 1: 2 at -1, 3 at +1
  row 2: 4 at -2, 6 at 0, 5 at 0, 7 at +2
  col 0 holds (0,1), (2,6), (2,5) -> sorted (0,1), (2,5), (2,6) -> [1, 5, 6]
  answer [[4], [2], [1, 5, 6], [3], [7]]
```

### Edge cases

```
- empty tree -> []
- single node -> [[val]]
- a long left chain -> one value per column
```

### Common mistakes

```
- DFS without sorting by row: deeper nodes from the left subtree come first.
- Sorting only by value inside a column (destroys the top-to-bottom order).
```

Full JavaScript solution with tests: [04_vertical_columns.js](solutions/04_vertical_columns.js). Run it with `node solutions/04_vertical_columns.js` from this folder.

</details>

## Related follow-ups

- Only the top node of each column (top view)
- Only the bottom node of each column (bottom view)
- Sum per column

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
