# Path With Minimum Effort

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Medium |
| **Pattern** | Dijkstra min-max on grid |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1631 — https://leetcode.com/problems/path-with-minimum-effort/ |
| **Solution file** | [03_path_with_minimum_effort.js](../solutions/03_path_with_minimum_effort.js) — open only after a real attempt |

## Problem

heights is a grid. You walk from the top-left to the bottom-right (4 directions). The
EFFORT of a route is the LARGEST absolute height difference between two consecutive
cells on it. Return the minimum possible effort.

## Examples

```
Input: [[1,2,2],[3,8,2],[5,3,5]]            Output: 2   (route 1,3,5,3,5 has max diff 2)
Input: [[1,2,3],[3,8,4],[5,3,5]]            Output: 1   (route 1,2,3,4,5)
Input: [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]   Output: 0
```

## Constraints & clarifying questions

```
- Minimising the MAX step, not the sum? (yes - "min-max" path)
- 1 x 1 grid -> 0
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

**Start simple.** APPROACH 1 — Brute force (binary search on effort + BFS)   O(m*n * log(maxHeight)). "Can we reach the end using only steps with diff &lt;= limit?" is monotonic in limit.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dijkstra with max instead of sum)   O(m*n log(m*n)). Same Dijkstra skeleton, but the "distance" of a path is the max edge on it: candidate = Math.max(effortSoFar, |h[next] - h[cur]|) The greedy argument still holds: the cell popped with the smallest max-so-far is final.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single cell -> 0
- single row -> max adjacent diff
- all equal -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (binary search on effort + BFS)   O(m*n * log(maxHeight))

```
"Can we reach the end using only steps with diff <= limit?" is monotonic in limit.
Binary search the limit (0..10^6) and BFS to check. A solid alternative, O(mn log H).
```

### APPROACH 2 — Optimal (Dijkstra with max instead of sum)   O(m*n log(m*n))

```
Same Dijkstra skeleton, but the "distance" of a path is the max edge on it:
  candidate = Math.max(effortSoFar, |h[next] - h[cur]|)
The greedy argument still holds: the cell popped with the smallest max-so-far is final.

Dry run on [[1,2,2],[3,8,2],[5,3,5]]:
  pop (0,0) effort 0: (0,1) diff 1 -> 1, (1,0) diff 2 -> 2
  pop (0,1) effort 1: (0,2) diff 0 -> 1, (1,1) diff 6 -> 6
  pop (0,2) effort 1: (1,2) diff 0 -> 1
  pop (1,2) effort 1: (2,2) diff 3 -> 3, (1,1) 6 -> 6 no better
  pop (1,0) effort 2: (2,0) diff 2 -> 2, (1,1) diff 5 -> 5
  pop (2,0) effort 2: (2,1) diff 2 -> 2
  pop (2,1) effort 2: (2,2) diff 2 -> 2 (better than 3)
  pop (2,2) effort 2 -> answer 2
```

### Edge cases

```
- single cell -> 0
- single row -> max adjacent diff
- all equal -> 0
```

Full JavaScript solution with tests: [03_path_with_minimum_effort.js](../solutions/03_path_with_minimum_effort.js). Run it with `node 03_path_with_minimum_effort.js` from the solutions folder.

</details>

## Common mistakes

- Summing the height differences: the cost of a path is its LARGEST single step, so relax with `Math.max(d, step)`.
- Marking a cell visited when it is pushed instead of when it is popped; a later, better route gets ignored.
- Forgetting the 1x1 grid, where the answer is 0.

## Related follow-ups

- [Swim in Rising Water](../03_Hard/05_swim_in_rising_water.md)
- [Minimum Cost to Make at Least One Valid Path](../03_Hard/08_minimum_cost_valid_path.md)
- [Shortest Path in Binary Matrix](../../../../24_Graph_Traversal/03_Problems/02_Medium/16_shortest_path_in_binary_matrix.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
