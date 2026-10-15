# 01 Matrix

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | multi-source BFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #542 — https://leetcode.com/problems/01-matrix/ |
| **Solution file** | [12_01_matrix.js](../solutions/12_01_matrix.js) — open only after a real attempt |

## Problem

Given a binary matrix, return a matrix of the same size where each cell holds the
distance to the NEAREST 0 (4-directional moves). There is at least one 0.

## Examples

```
Input: [[0,0,0],[0,1,0],[0,0,0]]   Output: [[0,0,0],[0,1,0],[0,0,0]]
Input: [[0,0,0],[0,1,0],[1,1,1]]   Output: [[0,0,0],[0,1,0],[1,2,1]]
```

## Constraints & clarifying questions

```
- At least one 0 guaranteed? (yes)
- Return a new matrix or modify in place? (either - we return a new one)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *multi-source BFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS from every 1)   O((m*n)^2) time. For each 1 run a BFS until the first 0.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (multi-source BFS from all 0s)   O(m*n) time, O(m*n) space. All 0 cells are sources at distance 0.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all zeros -> all zeros
- 1 x 1 containing 0
- a 1 far from every 0 (long corridor) -> distance grows linearly
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS from every 1)   O((m*n)^2) time

```
For each 1 run a BFS until the first 0. Same shape as Walls and Gates brute force.
```

### APPROACH 2 — Optimal (multi-source BFS from all 0s)   O(m*n) time, O(m*n) space

```
All 0 cells are sources at distance 0. BFS outward; a 1 cell gets its distance the
first time it is reached. Identical to Walls and Gates with gates = 0s and no walls.

Dry run on [[0,0,0],[0,1,0],[1,1,1]]:
  queue = all 0 cells. Level 1 reaches (1,1),(2,0),(2,2) -> 1. Level 2 reaches (2,1) -> 2.

(A two-pass DP also works: top-left pass then bottom-right pass, O(1) extra space.
 BFS is the graph way and generalises.)
```

### Edge cases

```
- all zeros -> all zeros
- 1 x 1 containing 0
- a 1 far from every 0 (long corridor) -> distance grows linearly
```

Full JavaScript solution with tests: [12_01_matrix.js](../solutions/12_01_matrix.js). Run it with `node 12_01_matrix.js` from the solutions folder.

</details>

## Common mistakes

- BFS from every 1 to find the nearest 0 (O((RC)²)).
- Initializing 1-cells to 0 so they look already visited.
- Forgetting the DP alternative (two passes) exists and is O(1) extra space.

## Related follow-ups

- [Walls and Gates](11_walls_and_gates.md)
- [Rotting Oranges](10_rotting_oranges.md)
- [Shortest Path in Binary Matrix](16_shortest_path_in_binary_matrix.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
