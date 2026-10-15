# Number of Islands

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | DFS components on grid |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #200 — https://leetcode.com/problems/number-of-islands/ |
| **Solution file** | [05_number_of_islands.js](../solutions/05_number_of_islands.js) — open only after a real attempt |

## Problem

Given an m x n grid of '1' (land) and '0' (water), count the islands. An island is a
group of land cells connected horizontally or vertically, surrounded by water.
THE classic graph interview question.

## Examples

```
Input:
  1 1 0 0 0
  1 1 0 0 0
  0 0 1 0 0
  0 0 0 1 1
Output: 3
```

## Constraints & clarifying questions

```
- Are diagonals connected? (no)
- May I modify the grid? (if not, use a visited matrix - shown in the BFS version)
- Values are characters '1'/'0' or numbers? (LeetCode: characters)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS components on grid* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS, no mutation, visited matrix)   O(m*n) time, O(m*n) space. Same complexity as the DFS version - there is no genuinely slower sensible approach - but it uses a queue and a separate visited matrix, which is what you write when the grid is read-only or very large (no recursion depth problem).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS "sink the island")   O(m*n) time, O(m*n) space (recursion). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty grid -> 0
- all water -> 0; all land -> 1
- single column / single row
- deep recursion on huge all-land grids -> prefer the BFS version
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS, no mutation, visited matrix)   O(m*n) time, O(m*n) space

```
Same complexity as the DFS version - there is no genuinely slower sensible approach -
but it uses a queue and a separate visited matrix, which is what you write when the
grid is read-only or very large (no recursion depth problem).
```

### APPROACH 2 — Optimal (DFS "sink the island")   O(m*n) time, O(m*n) space (recursion)

```
1. Scan every cell.
  2. When you find a '1': count++ and DFS to turn that whole island into '0' ("sink" it),
     so it is never counted again.
Sinking is the visited mark; no extra memory besides the call stack.

Dry run on
  1 1 0
  0 1 0
  0 0 1
  (0,0) is '1' -> count=1, sink: (0,0),(0,1),(1,1) become '0'
  scan on... (2,2) is '1' -> count=2, sink it
  answer 2
```

### Edge cases

```
- empty grid -> 0
- all water -> 0; all land -> 1
- single column / single row
- deep recursion on huge all-land grids -> prefer the BFS version
```

Full JavaScript solution with tests: [05_number_of_islands.js](../solutions/05_number_of_islands.js). Run it with `node 05_number_of_islands.js` from the solutions folder.

</details>

## Common mistakes

- Comparing cells with the number 1 when the grid holds strings `"1"`.
- Counting diagonal neighbours as connected.
- Mutating the caller's grid without saying so (mention it, or copy).

## Related follow-ups

- [Max Area of Island](06_max_area_of_island.md)
- [Number of Islands II](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/03_Hard/10_number_of_islands_ii.md) (27_Union_Find_Disjoint_Set/01_Union_Find_Basics)
- [Number of Enclaves](15_number_of_enclaves.md)
- [Number of Islands](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/14_number_of_islands.md) (09_Matrix_And_Multidimensional_Arrays)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
