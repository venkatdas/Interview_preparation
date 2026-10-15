# Number of Islands II

| | |
|---|---|
| **Topic** | Advanced Union-Find |
| **Difficulty** | Hard |
| **Pattern** | online union-find on a grid with a Map |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #305 — https://leetcode.com/problems/number-of-islands-ii/ |
| **Solution file** | [04_number_of_islands_ii.js](../solutions/04_number_of_islands_ii.js) — open only after a real attempt |

## Problem

An m x n grid starts all water. positions[i] = [row, col] turns that cell into land,
one at a time. After each operation return the number of islands (4-directionally
connected land groups).

## Examples

```
Input: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]   Output: [1,1,2,3]
  (0,0) -> 1 island; (0,1) joins it -> 1; (1,2) separate -> 2; (2,1) separate -> 3
Input: m = 1, n = 1, positions = [[0,0]]   Output: [1]
```

## Constraints & clarifying questions

```
- Can the same cell be added twice? (yes -> the count must not change)
- Up to 10^4 operations on a 10^4 x 10^4 grid -> cannot re-scan the grid each time,
  and cannot even allocate m*n cells eagerly in some variants (use a Map)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *online union-find on a grid with a Map* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(k * m * n) time. After each addition, flood-fill the whole grid and count components.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Online union-find)   O(k * alpha) time, O(m * n) space. Each land cell is a node id = row * n + col.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- duplicate positions -> same count as before
- a cell that joins two or more islands -> count drops by the number of successful unions
- 1x1 grid
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(k * m * n) time

```
After each addition, flood-fill the whole grid and count components.
```

### APPROACH 2 — Optimal (Online union-find)   O(k * alpha) time, O(m * n) space

```
Each land cell is a node id = row * n + col. When a cell becomes land:
  count++ (it is a new island by itself)
  for each of its 4 neighbours that is land: if union succeeds, count--
Union-find is perfect because we only ever ADD connections, never remove them.

Dry run on the example:
  (0,0): count 1; no land neighbours                                -> 1
  (0,1): count 2; neighbour (0,0) is land, union -> count 1          -> 1
  (1,2): count 2; neighbours (0,2),(2,2),(1,1) water                 -> 2
  (2,1): count 3; neighbours (1,1),(2,0),(2,2) water                 -> 3
```

### Edge cases

```
- duplicate positions -> same count as before
- a cell that joins two or more islands -> count drops by the number of successful unions
- 1x1 grid
```

Full JavaScript solution with tests: [04_number_of_islands_ii.js](../solutions/04_number_of_islands_ii.js). Run it with `node 04_number_of_islands_ii.js` from the solutions folder.

</details>

## Common mistakes

- Double-counting a position that was already added.
- Uniting with neighbours that are water (not yet added).
- Forgetting to bounds-check neighbours at the grid edges.

## Related follow-ups

- [Number of Islands II (basics folder)](../../../01_Union_Find_Basics/03_Problems/03_Hard/10_number_of_islands_ii.md)
- [Number of Islands](../../../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md)
- [Swim in Rising Water](../../../../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/03_Hard/05_swim_in_rising_water.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
