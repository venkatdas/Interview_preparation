# Grid to Graph

| | |
|---|---|
| **Topic** | Graphs (representation) |
| **Difficulty** | Medium |
| **Pattern** | implicit graph to explicit |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [06_grid_to_graph.js](../solutions/06_grid_to_graph.js) — open only after a real attempt |

## Problem

A grid of strings uses `'.'` for an open cell and `'#'` for a wall. Turn it into an explicit undirected
graph: cell `(r, c)` becomes vertex `id = r * cols + c`, and two OPEN cells that share a side
(up, down, left, right) are connected. Return `{ n, adj, edgeCount }` where `n = rows * cols`,
`adj[id]` is the sorted neighbour list (walls get an empty list) and `edgeCount` counts each edge once.

## Examples

```
Input: ["..",
        ".#"]
Output: n = 4, adj = [[1,2],[0],[0],[]], edgeCount = 2
Explanation: ids are 0 1 / 2 3; cell 3 is a wall
```

## Constraints & clarifying questions

```
- 4 or 8 directions? (4)
- Empty grid? (n = 0, adj = [], edgeCount = 0)
- Do walls get a vertex id? (yes, with no neighbours, so ids stay r * cols + c)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Implicit graphs: a grid is a graph where neighbours are computed, not stored.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Compare every pair of open cells and connect those at Manhattan distance 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A cell has at most 4 possible neighbours. Visit them in an order that keeps each list sorted by id.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all walls        -> no edges
- single open cell  -> one vertex, no neighbours
- 1 x N corridor    -> a path with N - 1 edges
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

Compare every pair of cells: O((R·C)²) time.

### APPROACH 2 — Optimal

For each open cell check up, left, right, down (this order is increasing id), add in-bounds open neighbours, and sum the list lengths. Each undirected edge is seen from both ends, so `edgeCount = sum / 2`. O(R·C) time and space.

```
ids: 0 1 / 2 3 (3 is a wall)
id 0: right 1 open, down 2 open -> [1,2]
id 1: left 0 open, down 3 wall  -> [0]
id 2: up 0 open, right 3 wall   -> [0]
id 3: wall                      -> []
edgeCount = (2 + 1 + 1) / 2 = 2
```

Full JavaScript solution with tests: [06_grid_to_graph.js](../solutions/06_grid_to_graph.js). Run it with `node 06_grid_to_graph.js` from the solutions folder.

</details>

## Common mistakes

- Computing ids as `r * rows + c` instead of `r * cols + c` (breaks non-square grids).
- Checking bounds after reading `grid[nr][nc]`, which crashes on row -1.
- Counting each undirected edge twice in edgeCount.

## Related follow-ups

- [Number of Islands](../../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md) (24_Graph_Traversal)
- [Flood Fill](../../../24_Graph_Traversal/03_Problems/01_Easy/01_flood_fill.md) (24_Graph_Traversal)
- [Shortest Path in Binary Matrix](../../../24_Graph_Traversal/03_Problems/02_Medium/16_shortest_path_in_binary_matrix.md) (24_Graph_Traversal)
- [Edge List to Adjacency List](../01_Easy/01_edge_list_to_adjacency_list.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
