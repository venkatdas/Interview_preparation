# Max Area of Island

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | DFS returning size |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #695 — https://leetcode.com/problems/max-area-of-island/ |
| **Solution file** | [06_max_area_of_island.js](../solutions/06_max_area_of_island.js) — open only after a real attempt |

## Problem

Grid of 0/1. An island is a 4-directionally connected group of 1s. Return the area
(cell count) of the largest island, or 0 if there is none.

## Examples

```
Input: [[0,0,1,0,0],[0,1,1,0,0],[0,0,0,1,1],[1,0,0,1,1]]   Output: 4
Input: [[0,0,0]]                                          Output: 0
```

## Constraints & clarifying questions

```
- Can I mutate the grid? (yes here; otherwise keep a visited matrix)
- Diagonals? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS returning size* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS with visited matrix)   O(m*n) time, O(m*n) space. For each unvisited land cell run a BFS, counting cells popped.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS that RETURNS the size)   O(m*n) time, O(m*n) space. Same as Number of Islands, but the sink function returns 1 + sizes of the 4 neighbour calls.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all water -> 0
- all land -> m*n
- 1 x 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS with visited matrix)   O(m*n) time, O(m*n) space

```
For each unvisited land cell run a BFS, counting cells popped. Same complexity as the
DFS version; it is the no-recursion, no-mutation variant.
```

### APPROACH 2 — Optimal (DFS that RETURNS the size)   O(m*n) time, O(m*n) space

```
Same as Number of Islands, but the sink function returns 1 + sizes of the 4 neighbour
calls. Keep the max.

Dry run on [[1,1,0],[0,1,0],[0,0,1]]:
  area(0,0) = 1 + area(1,0)=0 + area(-1,0)=0 + area(0,1)=[1 + area(1,1)=[1 + 0...] ] ...
  = 3, max = 3. Later area(2,2) = 1. Answer 3.
```

### Edge cases

```
- all water -> 0
- all land -> m*n
- 1 x 1
```

Full JavaScript solution with tests: [06_max_area_of_island.js](../solutions/06_max_area_of_island.js). Run it with `node 06_max_area_of_island.js` from the solutions folder.

</details>

## Common mistakes

- Returning the number of islands instead of the largest area.
- Not marking cells visited before recursing, double-counting area.
- Forgetting a grid with no land returns 0.

## Related follow-ups

- [Number of Islands](05_number_of_islands.md)
- [Island Perimeter](../01_Easy/02_island_perimeter.md)
- Making A Large Island (LeetCode #827)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
