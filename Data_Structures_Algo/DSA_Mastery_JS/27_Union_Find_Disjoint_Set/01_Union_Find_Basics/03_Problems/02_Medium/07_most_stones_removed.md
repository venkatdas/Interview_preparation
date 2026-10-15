# Most Stones Removed with Same Row or Column

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | union rows and columns |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #947 — https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/ |
| **Solution file** | [07_most_stones_removed.js](../solutions/07_most_stones_removed.js) — open only after a real attempt |

## Problem

Stones sit on integer grid points, at most one per point. A stone can be removed if
another stone shares its row OR its column. Return the maximum number of stones that
can be removed.

## Examples

```
Input: [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]   Output: 5
Input: [[0,0],[0,2],[1,1],[2,0],[2,2]]         Output: 3
Input: [[0,0]]                                 Output: 0
```

## Constraints & clarifying questions

```
- Coordinates up to 10^4 -> rows and columns can be used as node ids directly
- At most 1000 stones
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *union rows and columns* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS over stones, O(n^2) edges)   O(n^2) time. Treat each stone as a node; two stones are adjacent if same row or same column.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find on rows and columns)   O(n * alpha) time, O(n) space. Clever trick: do not union stones; union the stone's ROW with its COLUMN.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one stone -> 0
- no two stones share anything -> 0
- all in one row -> n - 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS over stones, O(n^2) edges)   O(n^2) time

```
Treat each stone as a node; two stones are adjacent if same row or same column.
Count components with DFS by comparing every pair. 1000 stones -> 10^6 checks, fine.
```

### APPROACH 2 — Optimal (Union-Find on rows and columns)   O(n * alpha) time, O(n) space

```
Clever trick: do not union stones; union the stone's ROW with its COLUMN. Give columns
ids offset by 10001 so they never collide with row ids. Every stone merges its row set
and column set. Number of components = number of distinct roots among the row/column
ids that actually appear.

Dry run on [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]:
  stone (0,0): union(row0, col0)   stone (0,1): union(row0, col1)
  stone (1,0): union(row1, col0)   stone (1,2): union(row1, col2)
  stone (2,1): union(row2, col1)   stone (2,2): union(row2, col2)
  everything is one component -> 6 - 1 = 5
```

### KEY INSIGHT: stones that share rows/columns form connected components. In any

```
component you can remove every stone except one (remove leaves first, like peeling
a tree). So:  answer = stones - number of components.
```

### Edge cases

```
- one stone -> 0
- no two stones share anything -> 0
- all in one row -> n - 1
```

Full JavaScript solution with tests: [07_most_stones_removed.js](../solutions/07_most_stones_removed.js). Run it with `node 07_most_stones_removed.js` from the solutions folder.

</details>

## Common mistakes

- Returning the number of components instead of `stones - components`.
- Mixing up row and column ids when uniting a row with a column; offset columns (e.g. `col + 10001` or a string key) so they do not collide with rows.
- Trying to simulate removals greedily; the order never matters, only the component structure does.

## Related follow-ups

- [Number of Connected Components](01_number_of_connected_components.md)
- [Accounts Merge](06_accounts_merge.md)
- [Number of Islands](../../../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
