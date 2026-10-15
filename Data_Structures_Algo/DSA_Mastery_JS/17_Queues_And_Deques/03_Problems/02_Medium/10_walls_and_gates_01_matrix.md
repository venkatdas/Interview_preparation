# Walls and Gates / 01 Matrix

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Medium |
| **Pattern** | multi-source BFS, distances |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #286 — https://leetcode.com/problems/walls-and-gates/; LeetCode #542 — https://leetcode.com/problems/01-matrix/ |
| **Solution file** | [10_walls_and_gates_01_matrix.js](../solutions/10_walls_and_gates_01_matrix.js) — open only after a real attempt |

## Problem

Walls and Gates: a grid with -1 (wall), 0 (gate), INF (empty room). Fill each
empty room with the distance to its NEAREST gate. Rooms that can't reach a
gate stay INF.

01 Matrix: a binary grid. For each cell, return the distance to the nearest 0.
Same idea: the 0s are the "gates", and there are no walls.

## Examples

```
Walls and Gates:
  [[INF,-1,0,INF],          [[3,-1,0,1],
   [INF,INF,INF,-1],   ->    [2,2,1,-1],
   [INF,-1,INF,-1],          [1,-1,2,-1],
   [0,-1,INF,INF]]           [0,-1,3,4]]
01 Matrix:
  [[0,0,0],[0,1,0],[1,1,1]]  ->  [[0,0,0],[0,1,0],[1,2,1]]
```

## Constraints & clarifying questions

```
- 4-directional moves? (yes)
- Multiple gates / zeros? (yes -> multi-source BFS again)
- In-place modification OK? (Walls and Gates: yes. 01 Matrix: return a new grid)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *multi-source BFS, distances* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS from every room)   O((m*n)^2) time. For each empty cell run its own BFS until it hits a gate.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (multi-source BFS from all gates at once)   O(m*n) time, O(m*n) space. Flip the question: instead of "how far is each room from a gate", ask "how far does each gate reach".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no gates at all -> everything stays INF (Walls and Gates)
- room fully surrounded by walls -> stays INF
- 1x1 grid
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS from every room)   O((m*n)^2) time

```
For each empty cell run its own BFS until it hits a gate. Each BFS is O(m*n),
and there are O(m*n) cells.
```

### APPROACH 2 — Optimal (multi-source BFS from all gates at once)   O(m*n) time, O(m*n) space

```
Flip the question: instead of "how far is each room from a gate", ask "how
far does each gate reach". Start BFS from ALL gates simultaneously (all at
distance 0). The first time BFS reaches a room, that is its nearest-gate
distance (BFS visits in increasing distance order). Set it and enqueue it.
A room with a value already set has been visited; skip it.

Dry run (01 Matrix [[0,0,0],[0,1,0],[1,1,1]]):
  queue = all zeros (7 cells), their dist = 0
  level 1: (1,1) gets 1, (2,0) gets 1, (2,2) gets 1
  level 2: (2,1) gets 2
  done.
```

### Edge cases

```
- no gates at all -> everything stays INF (Walls and Gates)
- room fully surrounded by walls -> stays INF
- 1x1 grid
```

Full JavaScript solution with tests: [10_walls_and_gates_01_matrix.js](../solutions/10_walls_and_gates_01_matrix.js). Run it with `node 10_walls_and_gates_01_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Running a BFS from every empty cell (O(cells²)) instead of one multi-source BFS.
- Overwriting walls (-1) or gates (0) during the search.
- In 01 Matrix, initializing ones to 0 so they look already visited.

## Related follow-ups

- [Rotting Oranges](09_rotting_oranges.md)
- [Walls and Gates](../../../24_Graph_Traversal/03_Problems/02_Medium/11_walls_and_gates.md) (24_Graph_Traversal)
- [01 Matrix](../../../24_Graph_Traversal/03_Problems/02_Medium/12_01_matrix.md) (24_Graph_Traversal)
- As Far from Land as Possible (LeetCode #1162)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
