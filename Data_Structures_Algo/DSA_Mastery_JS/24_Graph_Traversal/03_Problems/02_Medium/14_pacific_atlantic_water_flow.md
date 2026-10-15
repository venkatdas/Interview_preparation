# Pacific Atlantic Water Flow

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | DFS from border, two sets |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #417 — https://leetcode.com/problems/pacific-atlantic-water-flow/ |
| **Solution file** | [14_pacific_atlantic_water_flow.js](../solutions/14_pacific_atlantic_water_flow.js) — open only after a real attempt |

## Problem

heights[r][c] is the height of a cell. The Pacific ocean touches the top and left
edges, the Atlantic touches the bottom and right edges. Water flows from a cell to a
4-neighbour if the neighbour's height is <= the current height. Return all cells from
which water can flow to BOTH oceans.

## Examples

```
Input: [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
```

## Constraints & clarifying questions

```
- Equal heights flow? (yes, <=)
- Output order? (any)
- 1 x 1 grid? (that cell touches both oceans -> [[0,0]])
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS from border, two sets* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS downhill from every cell)   O((m*n)^2) time. For each cell, DFS following "neighbour &lt;= me" and record whether we touched the top/ left edge (Pacific) and the bottom/right edge (Atlantic).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (reverse: DFS UPHILL from each ocean)   O(m*n) time, O(m*n) space. Flip the direction: start at the ocean cells and climb to neighbours with height >= current.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty grid -> []
- 1 x 1 -> [[0,0]]
- all equal heights -> every cell
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS downhill from every cell)   O((m*n)^2) time

```
For each cell, DFS following "neighbour <= me" and record whether we touched the top/
left edge (Pacific) and the bottom/right edge (Atlantic). m*n starts, each O(m*n).
```

### APPROACH 2 — Optimal (reverse: DFS UPHILL from each ocean)   O(m*n) time, O(m*n) space

```
Flip the direction: start at the ocean cells and climb to neighbours with height >=
current. Everything reached from the Pacific border can drain to the Pacific; same for
the Atlantic. Answer = intersection of the two reachable sets. Two flood fills total.

Dry run on [[1,2],[4,3]]:
  pacific starts: row 0 (1,2) and col 0 (1,4). climb: from 2 -> (1,1)=3 >= 2 yes.
    pacific = all 4 cells.
  atlantic starts: row 1 (4,3) and col 1 (2,3). climb: from 2 -> (0,0)=1? 1 >= 2 no.
    from 3 -> (0,1)=2 no; from 4 -> (0,0)=1 no.  atlantic = {(0,1),(1,0),(1,1)}
  both = [[0,1],[1,0],[1,1]]
```

### Edge cases

```
- empty grid -> []
- 1 x 1 -> [[0,0]]
- all equal heights -> every cell
```

Full JavaScript solution with tests: [14_pacific_atlantic_water_flow.js](../solutions/14_pacific_atlantic_water_flow.js). Run it with `node 14_pacific_atlantic_water_flow.js` from the solutions folder.

</details>

## Common mistakes

- Searching downhill from each cell instead of uphill from each ocean.
- Using `>` instead of `>=` when climbing from the ocean (equal heights flow).
- Mixing up which borders touch which ocean.

## Related follow-ups

- [Surrounded Regions](13_surrounded_regions.md)
- [Number of Enclaves](15_number_of_enclaves.md)
- [Longest Increasing Path in a Matrix](../../../26_Topological_Sorting/03_Problems/03_Hard/07_longest_increasing_path_in_matrix.md) (26_Topological_Sorting)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
