# Number of Enclaves

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | DFS from border |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1020 — https://leetcode.com/problems/number-of-enclaves/ |
| **Solution file** | [15_number_of_enclaves.js](../solutions/15_number_of_enclaves.js) — open only after a real attempt |

## Problem

Grid of 0 (sea) and 1 (land). You can walk between 4-adjacent land cells and walk off
the grid from any border cell. Return the number of land cells from which you CANNOT
walk off the grid (they are enclosed by water).

## Examples

```
Input: [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]   Output: 3
Explanation: the (1,0) cell is on the border; the three cells (1,2),(2,1),(2,2) are enclosed.
Input: [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]   Output: 0  (all land touches the border)
```

## Constraints & clarifying questions

```
- Mutate the grid? (yes)
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

**Start simple.** APPROACH 1 — Brute force (DFS each land region, check border)   O(m*n) with bookkeeping. Same as Surrounded Regions brute force: collect each region, if it never touches the border add its size.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (reverse: sink everything reachable from the border). O(m*n) time, O(m*n) space 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all land -> 0 (every region touches the border)
- no land -> 0
- land only in the middle -> that count
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS each land region, check border)   O(m*n) with bookkeeping

```
Same as Surrounded Regions brute force: collect each region, if it never touches the
border add its size.
```

### APPROACH 2 — Optimal (reverse: sink everything reachable from the border)

```
O(m*n) time, O(m*n) space
  1. DFS from every border land cell, turning the land into 0 (those cells can escape).
  2. Count the remaining 1s - they are the enclaves.

Dry run on example 1:
  border land: (1,0). sink it (its neighbours are sea). Remaining 1s: (1,2),(2,1),(2,2) = 3.
```

### Edge cases

```
- all land -> 0 (every region touches the border)
- no land -> 0
- land only in the middle -> that count
```

Full JavaScript solution with tests: [15_number_of_enclaves.js](../solutions/15_number_of_enclaves.js). Run it with `node 15_number_of_enclaves.js` from the solutions folder.

</details>

## Common mistakes

- Counting land cells that touch the border.
- Counting islands instead of land cells.
- Starting the border flood only from corners instead of all border cells.

## Related follow-ups

- [Surrounded Regions](13_surrounded_regions.md)
- [Number of Islands](05_number_of_islands.md)
- Number of Closed Islands (LeetCode #1254)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
