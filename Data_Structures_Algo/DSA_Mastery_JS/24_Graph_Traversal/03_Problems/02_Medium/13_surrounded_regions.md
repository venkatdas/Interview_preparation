# Surrounded Regions

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | DFS from border |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #130 — https://leetcode.com/problems/surrounded-regions/ |
| **Solution file** | [13_surrounded_regions.js](../solutions/13_surrounded_regions.js) — open only after a real attempt |

## Problem

Board of 'X' and 'O'. Capture (flip to 'X') every region of 'O's that is completely
surrounded by 'X' - i.e. does NOT touch the border of the board. Modify in place.

## Examples

```
Input:            Output:
  X X X X           X X X X
  X O O X           X X X X
  X X O X           X X X X
  X O X X           X O X X     (the bottom O touches the border, it survives)
```

## Constraints & clarifying questions

```
- Does "touching the border" mean the O is ON the border cell? (yes)
- Diagonals? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS from border* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS every region, check if it touches the border). O(m*n) time but with visited bookkeeping and a 2-step process per region.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (reverse thinking: DFS from the border)   O(m*n) time, O(m*n). The Os that SURVIVE are exactly the ones connected to a border O.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- everything O -> nothing changes (all touch the border)
- 1 x n or n x 1 boards -> everything is on the border
- empty board
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS every region, check if it touches the border)

```
O(m*n) time but with visited bookkeeping and a 2-step process per region.
For every unvisited 'O', DFS to collect the whole region and note whether any cell is
on the border. If none is, flip the collected cells.
```

### APPROACH 2 — Optimal (reverse thinking: DFS from the border)   O(m*n) time, O(m*n)

```
The Os that SURVIVE are exactly the ones connected to a border O. So:
  1. For every border cell that is 'O', DFS and mark its region as 'S' (safe).
  2. Scan the board: 'O' -> 'X' (captured), 'S' -> 'O' (restore).
No per-region bookkeeping, one simple flood fill from the edges.

Dry run on the example:
  border Os: (3,1). DFS from it marks (3,1) = S (its neighbours are X).
  final scan: (1,1),(1,2),(2,2) are O -> X; (3,1) S -> O.
```

### Edge cases

```
- everything O -> nothing changes (all touch the border)
- 1 x n or n x 1 boards -> everything is on the border
- empty board
```

Full JavaScript solution with tests: [13_surrounded_regions.js](../solutions/13_surrounded_regions.js). Run it with `node 13_surrounded_regions.js` from the solutions folder.

</details>

## Common mistakes

- Flipping regions that touch the border.
- Searching from every O cell to see if it reaches the border (slow).
- Forgetting to restore the temporary border marks back to O.

## Related follow-ups

- [Number of Enclaves](15_number_of_enclaves.md)
- [Pacific Atlantic Water Flow](14_pacific_atlantic_water_flow.md)
- [Flood Fill](../01_Easy/01_flood_fill.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
