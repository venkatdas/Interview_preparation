# Minimum Cost to Make at Least One Valid Path in a Grid

| | |
|---|---|
| **Topic** | Shortest Paths |
| **Difficulty** | Hard |
| **Pattern** | 0-1 BFS |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1368 — https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/ |
| **Solution file** | [08_minimum_cost_valid_path.js](../solutions/08_minimum_cost_valid_path.js) — open only after a real attempt |

## Problem

Each grid cell has an arrow: 1 = right, 2 = left, 3 = down, 4 = up. Starting at (0,0)
you follow arrows for free; changing a cell's arrow (once) costs 1. Return the minimum
cost so that a path from (0,0) to (m-1,n-1) exists.

## Examples

```
Input: [[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]   Output: 3
Input: [[1,1,3],[3,2,2],[1,1,4]]                   Output: 0
Input: [[1,2],[4,3]]                               Output: 1
```

## Constraints & clarifying questions

```
- Moving in the arrow direction costs 0, any other direction costs 1? (yes)
- You can change an arrow at most once but it never matters: once you leave a cell you
  do not return on a shortest path.

This is a shortest path where every edge weighs 0 or 1: the classic 0-1 BFS case.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *0-1 BFS* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (Dijkstra)   O(m*n log(m*n)). Treat each move as an edge with weight 0 (arrow direction) or 1 (any other).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (0-1 BFS with a deque)   O(m*n) time, O(m*n) space. Same relaxation, but instead of a heap: 0-cost moves push to the FRONT of the deque, 1-cost moves push to the BACK.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1 x 1 -> 0
- arrows already form a path -> 0
- every arrow points away -> at most m + n - 2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (Dijkstra)   O(m*n log(m*n))

```
Treat each move as an edge with weight 0 (arrow direction) or 1 (any other). Standard
Dijkstra with the heap. Shown as `dijkstraVersion`.
```

### APPROACH 2 — Optimal (0-1 BFS with a deque)   O(m*n) time, O(m*n) space

```
Same relaxation, but instead of a heap: 0-cost moves push to the FRONT of the deque,
1-cost moves push to the BACK. The deque stays sorted by cost, so the first time we pop
the target its cost is minimal.

Dry run on [[1,2],[4,3]]  (arrows: (0,0) right, (0,1) left, (1,0) up, (1,1) down):
  pop (0,0) cost 0: right -> (0,1) cost 0 (front); down -> (1,0) cost 1 (back)
  pop (0,1) cost 0: its arrow is left (back to (0,0), no better); down -> (1,1) cost 1
  pop (1,0) cost 1 ... pop (1,1) cost 1 -> answer 1
```

### Edge cases

```
- 1 x 1 -> 0
- arrows already form a path -> 0
- every arrow points away -> at most m + n - 2
```

Full JavaScript solution with tests: [08_minimum_cost_valid_path.js](../solutions/08_minimum_cost_valid_path.js). Run it with `node 08_minimum_cost_valid_path.js` from the solutions folder.

</details>

## Common mistakes

- Mapping arrow values 1-4 to the wrong directions (1 right, 2 left, 3 down, 4 up).
- Pushing a cost-1 move to the FRONT of the deque; only cost-0 moves go to the front.
- Using a visited set on push in 0-1 BFS; a cell can be improved later by a 0-cost edge.

## Related follow-ups

- [Path With Minimum Effort](../02_Medium/03_path_with_minimum_effort.md)
- [Shortest Path in a Grid with Obstacles Elimination](09_shortest_path_with_obstacles_elimination.md)
- [01 Matrix](../../../../24_Graph_Traversal/03_Problems/02_Medium/12_01_matrix.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
