# Rotting Oranges

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Medium |
| **Pattern** | multi-source BFS, levels |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #994 — https://leetcode.com/problems/rotting-oranges/ |
| **Solution file** | [09_rotting_oranges.js](../solutions/09_rotting_oranges.js) — open only after a real attempt |

## Problem

In a grid, 0 = empty, 1 = fresh orange, 2 = rotten orange. Every minute, a
rotten orange rots its 4-directional fresh neighbours. Return the minimum
minutes until no fresh orange remains, or -1 if that is impossible.

## Examples

```
Input: [[2,1,1],[1,1,0],[0,1,1]]   Output: 4
Input: [[2,1,1],[0,1,1],[1,0,1]]   Output: -1   Explanation: bottom-left orange is unreachable
Input: [[0,2]]                     Output: 0    Explanation: nothing fresh to begin with
```

## Constraints & clarifying questions

```
- Several rotten oranges can start at once? (yes -> MULTI-SOURCE BFS)
- Diagonals count? (no, only 4 directions)
- Can I modify the grid? (yes; otherwise copy it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *multi-source BFS, levels* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate minute by minute)   O(minutes * m*n) time. Each minute, scan the whole grid, collect fresh cells next to rotten ones, rot them all at once.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (multi-source BFS with a queue)   O(m*n) time, O(m*n) space. BFS explores in "layers" of equal distance - exactly what minutes are.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no fresh oranges -> 0 (even with no rotten ones)
- no rotten oranges but fresh ones -> -1
- unreachable fresh orange -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate minute by minute)   O(minutes * m*n) time

```
Each minute, scan the whole grid, collect fresh cells next to rotten ones,
rot them all at once. Repeat until nothing changes. Worst case the rot
travels a long snake path, so minutes can be ~m*n -> O((m*n)^2).
```

### APPROACH 2 — Optimal (multi-source BFS with a queue)   O(m*n) time, O(m*n) space

```
BFS explores in "layers" of equal distance - exactly what minutes are.
  1. Put ALL rotten oranges in the queue at the start (distance 0) and count fresh ones.
  2. Process the queue level by level: for each cell, rot fresh neighbours,
     push them, decrement the fresh count.
  3. Each level processed = 1 minute (only count a minute if something rotted).
  4. If fresh > 0 at the end -> -1.

Dry run on [[2,1,1],[1,1,0],[0,1,1]]:
  minute 0: queue [(0,0)]  fresh=6
  minute 1: rot (0,1),(1,0)            fresh=4
  minute 2: rot (0,2),(1,1)            fresh=2
  minute 3: rot (2,1)                  fresh=1
  minute 4: rot (2,2)                  fresh=0  -> 4
```

### Edge cases

```
- no fresh oranges -> 0 (even with no rotten ones)
- no rotten oranges but fresh ones -> -1
- unreachable fresh orange -> -1
```

Full JavaScript solution with tests: [09_rotting_oranges.js](../solutions/09_rotting_oranges.js). Run it with `node 09_rotting_oranges.js` from the solutions folder.

</details>

## Common mistakes

- Running BFS from each rotten orange separately (wrong timing and slower); start them all at once.
- Counting minutes per dequeued orange instead of per level.
- Forgetting to return -1 when fresh oranges remain unreachable, or 0 when there are none.

## Related follow-ups

- [Rotting Oranges](../../../24_Graph_Traversal/03_Problems/02_Medium/10_rotting_oranges.md) (24_Graph_Traversal)
- [Walls and Gates](../../../24_Graph_Traversal/03_Problems/02_Medium/11_walls_and_gates.md) (24_Graph_Traversal)
- [01 Matrix](../../../24_Graph_Traversal/03_Problems/02_Medium/12_01_matrix.md) (24_Graph_Traversal)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
