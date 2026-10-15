# Island Perimeter

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Easy |
| **Pattern** | grid scan / DFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #463 — https://leetcode.com/problems/island-perimeter/ |
| **Solution file** | [02_island_perimeter.js](../solutions/02_island_perimeter.js) — open only after a real attempt |

## Problem

A grid of 0 (water) and 1 (land) contains exactly one island (one connected group of
land cells, no lakes). Each cell is a 1 x 1 square. Return the perimeter of the island.

## Examples

```
Input: [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]   Output: 16
Input: [[1]]                                         Output: 4
Input: [[1,0]]                                       Output: 4
```

## Constraints & clarifying questions

```
- Exactly one island, no lakes? (yes per problem - but the counting approach works
  even with several islands)
- Can the grid be empty? (assume at least 1 x 1)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *grid scan / DFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS and count exposed sides)   O(m*n) time, O(m*n) space. Find a land cell, DFS the island.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count cells and shared edges)   O(m*n) time, O(1) space. Every land cell starts with 4 sides.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single cell -> 4
- a full row of k cells -> 2k + 2
- all water -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS and count exposed sides)   O(m*n) time, O(m*n) space

```
Find a land cell, DFS the island. For each land cell, each of its 4 sides contributes 1
to the perimeter if the side faces water or the edge of the grid. The DFS is not really
needed since there is only one island, but it is the "graph" way and it generalises to
"perimeter of the island containing (r, c)".
```

### APPROACH 2 — Optimal (count cells and shared edges)   O(m*n) time, O(1) space

```
Every land cell starts with 4 sides. Every pair of adjacent land cells hides 2 sides
(one on each cell). So:
  perimeter = 4 * land - 2 * sharedEdges
To count each shared edge once, only look DOWN and RIGHT from each land cell.

Dry run on [[1,1],[1,0]]:
  (0,0) land=1, right (0,1) land -> shared=1, down (1,0) land -> shared=2
  (0,1) land=2, down (1,1) water
  (1,0) land=3, right (1,1) water
  perimeter = 4*3 - 2*2 = 8   (draw it: an L shape of 3 squares has 8 unit sides)
```

### Edge cases

```
- single cell -> 4
- a full row of k cells -> 2k + 2
- all water -> 0
```

Full JavaScript solution with tests: [02_island_perimeter.js](../solutions/02_island_perimeter.js). Run it with `node 02_island_perimeter.js` from the solutions folder.

</details>

## Common mistakes

- Running a traversal when simple counting works (4 per land cell minus 2 per shared edge).
- Counting shared edges twice when subtracting.
- Forgetting grid borders count as perimeter.

## Related follow-ups

- [Number of Islands](../02_Medium/05_number_of_islands.md)
- [Max Area of Island](../02_Medium/06_max_area_of_island.md)
- [Flood Fill](01_flood_fill.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
