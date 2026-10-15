# Shortest Path in a Grid with Obstacles Elimination

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Hard |
| **Pattern** | BFS on (r, c, k) state |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1293 — https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/ |
| **Solution file** | [09_shortest_path_with_obstacles_elimination.js](../solutions/09_shortest_path_with_obstacles_elimination.js) — open only after a real attempt |

## Problem

Grid of 0 (empty) and 1 (obstacle). You may remove at most k obstacles. Return the
minimum number of steps from (0,0) to (m-1,n-1), or -1 if impossible.

## Examples

```
Input: grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1   Output: 6
Explanation: go down through (3,2) by eliminating one obstacle: 6 steps instead of 10.
Input: grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1   Output: -1
```

## Constraints & clarifying questions

```
- k can be larger than the number of obstacles? (yes; if k >= m + n - 2 the straight
  Manhattan route is always possible -> answer m + n - 2)
- Start / end cells can be obstacles? (LeetCode: no)

The STATE is not just the cell. Two visits to the same cell with different numbers of
eliminations left are different situations. Node = (row, col, eliminationsLeft).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS on (r, c, k) state* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS with backtracking over all routes)   exponential. Try every path, decrementing k on obstacles, track the shortest.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS over (r, c, k) states)   O(m*n*k) time and space. All steps cost 1 -> BFS.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1 x 1 -> 0
- k = 0 -> plain BFS on free cells
- k >= m + n - 2 -> m + n - 2 immediately
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS with backtracking over all routes)   exponential

```
Try every path, decrementing k on obstacles, track the shortest. Only for tiny grids.
```

### APPROACH 2 — Optimal (BFS over (r, c, k) states)   O(m*n*k) time and space

```
All steps cost 1 -> BFS. Visited is per (cell, k). Pruning trick: store for each cell
the MOST eliminations we have ever arrived with; arriving with fewer or equal is never
better (same position, fewer resources), so skip it.

Dry run on grid [[0,1],[1,0]], k = 1:
  start (0,0,k=1) steps 0
  neighbours: (0,1) obstacle -> state (0,1,k=0) steps 1; (1,0) obstacle -> (1,0,0) steps 1
  from (0,1,0): (1,1) free -> (1,1,0) steps 2 -> target -> 2
```

### Edge cases

```
- 1 x 1 -> 0
- k = 0 -> plain BFS on free cells
- k >= m + n - 2 -> m + n - 2 immediately
```

Full JavaScript solution with tests: [09_shortest_path_with_obstacles_elimination.js](../solutions/09_shortest_path_with_obstacles_elimination.js). Run it with `node 09_shortest_path_with_obstacles_elimination.js` from the solutions folder.

</details>

## Common mistakes

- Keeping `visited` per cell only; the same cell with more eliminations left is a different, better state.
- Missing the shortcut: if k >= rows + cols - 2 the answer is simply rows + cols - 2.
- Reaching an obstacle with 0 eliminations left and still stepping onto it.

## Related follow-ups

- [Shortest Path Visiting All Nodes](../../../03_SCC_Bridges_Bipartite_Euler/03_Problems/03_Hard/10_shortest_path_visiting_all_nodes.md)
- [Shortest Path in Binary Matrix](../../../../24_Graph_Traversal/03_Problems/02_Medium/16_shortest_path_in_binary_matrix.md)
- [Cheapest Flights Within K Stops](../02_Medium/02_cheapest_flights_within_k_stops.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
