# Number of Islands

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | grid DFS / flood fill |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #200 — https://leetcode.com/problems/number-of-islands/ |
| **Solution file** | [14_number_of_islands.js](../solutions/14_number_of_islands.js) — open only after a real attempt |

## Problem

A grid of '1' (land) and '0' (water). An island is a group of '1's connected
horizontally or vertically (not diagonally). Count the islands.

## Examples

```
Input: [["1","1","0","0","0"],
        ["1","1","0","0","0"],
        ["0","0","1","0","0"],
        ["0","0","0","1","1"]]   Output: 3
```

## Constraints & clarifying questions

```
- 4-directional connectivity only? (yes)
- May I modify the grid? (usually yes; otherwise keep a visited set)
- Grid size up to 300x300 -> recursion depth up to 90k could overflow: use an explicit stack
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *grid DFS / flood fill* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS with a visited set, grid untouched)   O(m n) time, O(m n) space. For every unvisited land cell, BFS to mark its whole island visited and count 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS flood fill, sink the island)   O(m n) time, O(m n) worst-case stack. For every cell that is '1': count++, then DFS to turn every connected '1' into '0' ("sink it") so it is never counted again.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all water -> 0
- all land -> 1
- diagonal-only touching -> separate islands
- empty grid -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS with a visited set, grid untouched)   O(m n) time, O(m n) space

```
For every unvisited land cell, BFS to mark its whole island visited and count 1.
Same complexity as the optimal one; it just avoids mutating the input.
```

### APPROACH 2 — Optimal (DFS flood fill, sink the island)   O(m n) time, O(m n) worst-case stack

```
For every cell that is '1': count++, then DFS to turn every connected '1' into '0'
("sink it") so it is never counted again. Each cell is visited at most a constant number
of times. Implemented iteratively with a stack to be safe on big grids.
This is "connected components" on the implicit grid graph - see 23_Graphs/.

Dry run on the example:
  (0,0)='1' -> count 1, sink (0,0),(0,1),(1,0),(1,1)
  (2,2)='1' -> count 2, sink it
  (3,3)='1' -> count 3, sink (3,3),(3,4)   -> 3
```

### Edge cases

```
- all water -> 0
- all land -> 1
- diagonal-only touching -> separate islands
- empty grid -> 0
```

Full JavaScript solution with tests: [14_number_of_islands.js](../solutions/14_number_of_islands.js). Run it with `node 14_number_of_islands.js` from the solutions folder.

</details>

## Common mistakes

- Not marking a cell visited before (or as soon as) it is pushed, so cells get counted or queued many times.
- Comparing to the number 1 when the grid holds the strings "1" and "0".
- Using recursive DFS on a very large grid and hitting the call-stack limit; mention BFS or an explicit stack.

## Related follow-ups

- [Number of Islands (Graph Traversal)](../../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md) — the same problem in the graph topic
- [Max Area of Island](../../../24_Graph_Traversal/03_Problems/02_Medium/06_max_area_of_island.md) — size of each island
- [Surrounded Regions](../../../24_Graph_Traversal/03_Problems/02_Medium/13_surrounded_regions.md) — flood fill from the border

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
