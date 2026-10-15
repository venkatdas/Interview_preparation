# Shortest Path in Binary Matrix

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | BFS, 8 directions |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1091 — https://leetcode.com/problems/shortest-path-in-binary-matrix/ |
| **Solution file** | [16_shortest_path_in_binary_matrix.js](../solutions/16_shortest_path_in_binary_matrix.js) — open only after a real attempt |

## Problem

n x n grid of 0 (open) and 1 (blocked). A clear path goes from (0,0) to (n-1,n-1)
through open cells, moving in any of the 8 directions (diagonals allowed). Return the
length of the shortest clear path (number of cells), or -1.

## Examples

```
Input: [[0,1],[1,0]]                 Output: 2   (diagonal)
Input: [[0,0,0],[1,1,0],[1,1,0]]     Output: 4
Input: [[1,0,0],[1,1,0],[1,1,0]]     Output: -1  (start is blocked)
```

## Constraints & clarifying questions

```
- 8 directions, not 4? (yes - read carefully, it changes the DIRS array)
- Path length counts cells, not moves? (cells: a 1 x 1 grid answer is 1)
- Start or end blocked -> -1
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS, 8 directions* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS trying all paths)   exponential time. DFS from (0,0) exploring every simple path and keeping the minimum length.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS, 8 directions)   O(n^2) time, O(n^2) space. Unweighted grid, shortest path -> BFS.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1 x 1 open grid -> 1
- start or end is 1 -> -1
- no route -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS trying all paths)   exponential time

```
DFS from (0,0) exploring every simple path and keeping the minimum length. Correct but
explodes on anything beyond tiny grids. DFS does NOT give shortest paths for free.
```

### APPROACH 2 — Optimal (BFS, 8 directions)   O(n^2) time, O(n^2) space

```
Unweighted grid, shortest path -> BFS. Store the path length with each cell (or use
levels). Return when we pop the target.

Dry run on [[0,0,0],[1,1,0],[1,1,0]]:
  queue [(0,0,len 1)]
  pop (0,0): push (0,1,2)              (1,0),(1,1) blocked
  pop (0,1): push (0,2,3), (1,2,3)     (diagonal to (1,2))
  pop (0,2): (1,2) already seen
  pop (1,2): push (2,2,4)
  pop (2,2): target -> 4
```

### Edge cases

```
- 1 x 1 open grid -> 1
- start or end is 1 -> -1
- no route -> -1
```

Full JavaScript solution with tests: [16_shortest_path_in_binary_matrix.js](../solutions/16_shortest_path_in_binary_matrix.js). Run it with `node 16_shortest_path_in_binary_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Using 4 directions when the problem allows 8.
- Not checking that the start or end cell is open.
- Returning the number of moves instead of the number of cells on the path.

## Related follow-ups

- [01 Matrix](12_01_matrix.md)
- [Rotting Oranges](10_rotting_oranges.md)
- [Path With Minimum Effort](../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/03_path_with_minimum_effort.md) (25_Graph_Algorithms/01_Shortest_Paths)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
