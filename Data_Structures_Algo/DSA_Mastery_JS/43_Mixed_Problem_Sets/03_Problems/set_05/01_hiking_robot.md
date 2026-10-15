# Hiking Robot

| | |
|---|---|
| **Set** | [Mixed Set 05](README.md) — problem 01 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [01_hiking_robot.js](solutions/01_hiking_robot.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A robot stands on the top-left cell of a height map `grid` (rows x cols of integers)
and must reach the bottom-right cell, moving up/down/left/right. The robot has a climb
setting e: it can step between two neighbouring cells only if their heights differ by at
most e. Return the smallest e that lets the robot reach the goal.

## Examples

```
Input: [[1, 2, 2],
        [3, 8, 2],
        [5, 3, 5]]        Output: 2   Explanation: 1-3-5-3-5 needs at most 2
Input: [[4]]              Output: 0
Input: [[1, 10]]          Output: 9
```

## Constraints & clarifying questions

```
- Up to 100 x 100 cells, heights 0..10^6.
- Moves in 4 directions only.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Binary search on the answer + BFS reachability on a grid. See [Searching / Binary Search](../../../10_Searching/README.md) and [Graph Traversal (BFS/DFS)](../../../24_Graph_Traversal/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Try every candidate limit (the distinct neighbour differences) from small to large, BFS each time.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Reachability is monotonic in the limit, so binary search it. (Alternative: Dijkstra where a path costs its biggest step, or union-find adding edges by weight.)

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1x1 grid -> 0
- flat grid -> 0
- one row / one column -> max adjacent difference along the line
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(D * R * C) time, O(R * C) space (D = number of distinct differences)

```
Collect every height difference between neighbours (plus 0), sort them, and try them
one by one from smallest: BFS with that limit; the first that reaches the goal wins.
```

### APPROACH 2 — Optimal (binary search on the answer + BFS feasibility check)   O(R * C * log(maxH)) time, O(R * C) space

```
If limit e works, every larger e works too (more edges allowed), so the answer is the
first e in [0, maxH - minH] where BFS reaches the goal -> binary search.
(Alternative: Dijkstra where a path's cost is its largest step — same idea, different tool.)

Dry run on the 3x3 example (lo=0, hi=7):
  e=3: BFS reaches (2,2) via 1-2-2-2-5? 2->5 is 3 ok -> yes   hi=3
  e=1: from 1 -> 2 -> 2 -> 2, then 2->5 (3) and 2->8 (6) blocked; 1->3 (2) blocked -> no  lo=2
  e=2: 1->3->5->3->5 -> yes   hi=2
  answer 2
```

### Edge cases

```
- 1x1 grid -> 0
- flat grid -> 0
- one row / one column -> max adjacent difference along the line
```

### Common mistakes

```
- Marking cells visited only when popped (cells get queued many times).
- Setting hi to the max height instead of max - min (still correct, just more steps).
```

Full JavaScript solution with tests: [01_hiking_robot.js](solutions/01_hiking_robot.js). Run it with `node solutions/01_hiking_robot.js` from this folder.

</details>

## Related follow-ups

- Minimize the SUM of absolute climbs instead (plain Dijkstra)
- Diagonal moves allowed
- Return the path itself

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
