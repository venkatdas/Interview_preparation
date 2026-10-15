# Vertical Order Traversal of a Binary Tree

| | |
|---|---|
| **Topic** | N-ary Trees and Miscellaneous |
| **Difficulty** | Hard |
| **Pattern** | grid coordinates + sort |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #987 — https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/ |
| **Solution file** | [07_vertical_order_traversal.js](../solutions/07_vertical_order_traversal.js) — open only after a real attempt |

## Problem

Give the root position (row 0, col 0). A node at (row, col) has its left child at
(row+1, col-1) and right child at (row+1, col+1). Return the values column by column
(left to right). Inside a column, order by row (top to bottom); nodes with the SAME
row and column are ordered by value.

## Examples

```
Input: [3,9,20,null,null,15,7]   Output: [[9],[3,15],[20],[7]]
Input: [1,2,3,4,5,6,7]           Output: [[4],[2],[1,5,6],[3],[7]]
       Explanation: 5 and 6 are both at (2, 0); 5 < 6 so 5 comes first
Input: [1,2,3,4,6,5,7]           Output: [[4],[2],[1,5,6],[3],[7]]   (same cell, sorted by value)
```

## Constraints & clarifying questions

```
- Tie-break for the same (row, col): by value? (yes; LeetCode 314 "Vertical Order"
  instead orders ties left-to-right, which is a BFS without sorting)
- Empty tree -> []
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *grid coordinates + sort* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (collect triples, sort everything, group)   O(n log n) time, O(n) space. DFS collecting (col, row, val) for every node.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS into a Map col -> cells, sort only within columns)   O(n log n) worst, O(n) space. BFS visits rows in order, so inside a column the rows already arrive sorted.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> []
- all nodes in one column (a zigzag path)
- same cell with values that need reordering: [1,2,3,4,6,5,7] -> 5 before 6
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (collect triples, sort everything, group)   O(n log n) time, O(n) space

```
DFS collecting (col, row, val) for every node. Sort by col, then row, then val.
Group consecutive equal cols. One big sort does all the ordering at once.
```

### APPROACH 2 — Optimal (BFS into a Map col -> cells, sort only within columns)   O(n log n) worst, O(n) space

```
BFS visits rows in order, so inside a column the rows already arrive sorted. Only
nodes sharing a (row, col) cell need sorting by value. Keep a Map col -> array of
{row, val}; track minCol/maxCol to output columns in order without sorting the keys.
Worst case is still O(n log n) (all nodes in one cell), but usually close to O(n).

Dry run on [1,2,3,4,5,6,7]:
  BFS: (1: r0 c0) (2: r1 c-1) (3: r1 c1) (4: r2 c-2) (5: r2 c0) (6: r2 c0) (7: r2 c2)
  col -2: [4]   col -1: [2]   col 0: [1, 5, 6]   col 1: [3]   col 2: [7]
  cell (r2, c0) holds 5, 6 -> sort by value -> 5, 6
```

### Edge cases

```
- empty -> []
- all nodes in one column (a zigzag path)
- same cell with values that need reordering: [1,2,3,4,6,5,7] -> 5 before 6
```

Full JavaScript solution with tests: [07_vertical_order_traversal.js](../solutions/07_vertical_order_traversal.js). Run it with `node 07_vertical_order_traversal.js` from the solutions folder.

</details>

## Common mistakes

- Ignoring the tie rule: same row and column must be sorted by value.
- Using BFS order alone, which does not sort equal positions by value.
- Forgetting negative columns when indexing an array (use a Map or shift by the min column).

## Related follow-ups

- Binary Tree Vertical Order Traversal (LeetCode #314)
- [Binary Tree Level Order Traversal](../../../01_Binary_Trees/03_Problems/02_Medium/10_level_order_traversal.md) (20_Trees/01_Binary_Trees)
- [Binary Tree Right Side View](../../../01_Binary_Trees/03_Problems/02_Medium/12_right_side_view.md) (20_Trees/01_Binary_Trees)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
