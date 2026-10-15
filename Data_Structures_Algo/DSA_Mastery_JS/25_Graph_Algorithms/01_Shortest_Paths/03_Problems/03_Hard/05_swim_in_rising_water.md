# Swim in Rising Water

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Hard |
| **Pattern** | Dijkstra min-max on grid |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #778 — https://leetcode.com/problems/swim-in-rising-water/ |
| **Solution file** | [05_swim_in_rising_water.js](../solutions/05_swim_in_rising_water.js) — open only after a real attempt |

## Problem

n x n grid where grid[r][c] is the elevation of that cell (a permutation of 0..n*n-1).
At time t the water level is t; you can move between 4-adjacent cells only if BOTH have
elevation <= t. Starting at (0,0), find the least t at which you can reach (n-1,n-1).

## Examples

```
Input: [[0,2],[1,3]]   Output: 3   (you must pass through 3 eventually)
Input: [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]
Output: 16
```

## Constraints & clarifying questions

```
- The answer is at least max(grid[0][0], grid[n-1][n-1])? (yes)
- Min-max path problem again: minimise the maximum cell on the path.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dijkstra min-max on grid* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (binary search on t + DFS reachability)   O(n^2 log n^2). "Can we reach the end using only cells &lt;= t" is monotonic.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dijkstra, min-max)   O(n^2 log n). dist[cell] = minimum "water level needed" to reach that cell = max(dist[prev], grid[cell]).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1 x 1 -> grid[0][0]
- start cell is the highest -> answer is grid[0][0]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (binary search on t + DFS reachability)   O(n^2 log n^2)

```
"Can we reach the end using only cells <= t" is monotonic. Binary search t in
[0, n*n - 1] with a DFS check. Also a fine interview answer.
```

### APPROACH 2 — Optimal (Dijkstra, min-max)   O(n^2 log n)

```
dist[cell] = minimum "water level needed" to reach that cell =
  max(dist[prev], grid[cell]). Pop the smallest; the first time we pop the target,
that value is the answer.

Dry run on [[0,2],[1,3]]:
  pop (0,0) level 0: (0,1) -> max(0,2)=2, (1,0) -> max(0,1)=1
  pop (1,0) level 1: (1,1) -> max(1,3)=3
  pop (0,1) level 2: (1,1) -> max(2,3)=3 no better
  pop (1,1) level 3 -> answer 3

(Union-find alternative: add cells in elevation order, union with lower neighbours,
 stop when start and end connect.)
```

### Edge cases

```
- 1 x 1 -> grid[0][0]
- start cell is the highest -> answer is grid[0][0]
```

Full JavaScript solution with tests: [05_swim_in_rising_water.js](../solutions/05_swim_in_rising_water.js). Run it with `node 05_swim_in_rising_water.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the starting cell's own height: the answer is at least grid[0][0].
- Using `d + height` instead of `Math.max(d, height)`.
- Plain BFS without a heap: the order in which cells become reachable depends on height, not on step count.

## Related follow-ups

- [Path With Minimum Effort](../02_Medium/03_path_with_minimum_effort.md)
- [Min Cost to Connect All Points (MST view of min-max paths)](../../../02_Minimum_Spanning_Trees/03_Problems/02_Medium/02_min_cost_to_connect_all_points.md)
- [Number of Islands II (union-find alternative)](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/03_Hard/10_number_of_islands_ii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
