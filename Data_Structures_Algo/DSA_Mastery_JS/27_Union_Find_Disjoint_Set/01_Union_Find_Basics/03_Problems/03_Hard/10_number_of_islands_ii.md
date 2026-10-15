# Number of Islands II

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Hard |
| **Pattern** | dynamic components on a grid |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #305 — https://leetcode.com/problems/number-of-islands-ii/ |
| **Solution file** | [10_number_of_islands_ii.js](../solutions/10_number_of_islands_ii.js) — open only after a real attempt |

## Problem

Start with an m x n grid of all water. positions[i] = [r, c] turns that cell into land,
one at a time. After EACH addition, report the number of islands. Return the list of
counts.

## Examples

```
Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]   Output: [1,1,2,3]
Explanation:
  add (0,0): 1 island
  add (0,1): joins (0,0) -> 1
  add (1,2): separate -> 2
  add (2,1): separate -> 3
```

## Constraints & clarifying questions

```
- Can the same position appear twice? (yes - the count must NOT change)
- Up to 10^4 positions on a 10^4 x 10^4 grid -> we cannot afford a traversal per step
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *dynamic components on a grid* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (re-run DFS island count after every addition). O(k * m * n) time Keep the grid, after each new land cell run Number of Islands from scratch.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find, incremental)   O(k * alpha) time, O(m*n) space. This is the "dynamic connectivity" case where DFS loses and union-find wins.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- duplicate position -> same count as before
- adding a cell that joins 3 or 4 islands at once -> islands decreases by up to 3
- 1 x 1 grid
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (re-run DFS island count after every addition)

```
O(k * m * n) time
Keep the grid, after each new land cell run Number of Islands from scratch.
Way too slow for big inputs, but a perfect correctness oracle for tests.
```

### APPROACH 2 — Optimal (Union-Find, incremental)   O(k * alpha) time, O(m*n) space

```
This is the "dynamic connectivity" case where DFS loses and union-find wins.
  1. UnionFind over m*n cell ids (id = r * n + c); islands = 0; land = Set.
  2. For each position:
     - if already land: push current islands, continue
     - mark land, islands++
     - for each of the 4 neighbours that is land: if union succeeds, islands--
     - push islands

Dry run m=3,n=3 positions [[0,0],[0,1],[1,2],[2,1]]:
  (0,0): islands 1, no land neighbours             -> [1]
  (0,1): islands 2, neighbour (0,0) union ok -> 1  -> [1,1]
  (1,2): islands 2, no land neighbours             -> [1,1,2]
  (2,1): islands 3, (1,1)? water (2,0)? water      -> [1,1,2,3]
```

### Edge cases

```
- duplicate position -> same count as before
- adding a cell that joins 3 or 4 islands at once -> islands decreases by up to 3
- 1 x 1 grid
```

Full JavaScript solution with tests: [10_number_of_islands_ii.js](../solutions/10_number_of_islands_ii.js). Run it with `node 10_number_of_islands_ii.js` from the solutions folder.

</details>

## Common mistakes

- Adding land on a cell that is already land and incrementing the count again.
- Re-running a full DFS after each addition (O(k * m * n)) instead of uniting with the up-to-4 land neighbours.
- Using `r * rows + c` instead of `r * cols + c` for the cell id.

## Related follow-ups

- [Number of Islands](../../../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md)
- [Number of Islands II (advanced folder)](../../../02_Advanced_Union_Find/03_Problems/03_Hard/04_number_of_islands_ii.md)
- Making A Large Island (LeetCode #827)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
