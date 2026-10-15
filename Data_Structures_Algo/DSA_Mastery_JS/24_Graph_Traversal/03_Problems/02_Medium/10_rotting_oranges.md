# Rotting Oranges

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | multi-source BFS levels |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #994 — https://leetcode.com/problems/rotting-oranges/ |
| **Solution file** | [10_rotting_oranges.js](../solutions/10_rotting_oranges.js) — open only after a real attempt |

## Problem

Grid cells: 0 empty, 1 fresh orange, 2 rotten orange. Every minute, each rotten orange
rots its 4 fresh neighbours. Return the minutes until no fresh orange remains, or -1
if that is impossible.

## Examples

```
Input: [[2,1,1],[1,1,0],[0,1,1]]   Output: 4
Input: [[2,1,1],[0,1,1],[1,0,1]]   Output: -1   (bottom-left orange is unreachable)
Input: [[0,2]]                     Output: 0    (nothing fresh)
```

## Constraints & clarifying questions

```
- Multiple rotten oranges at the start? (yes -> multi-source)
- No oranges at all? (0)
- Can I mutate the grid? (yes; otherwise copy)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *multi-source BFS levels* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate minute by minute)   O(minutes * m*n) time. Each minute, scan the grid, collect fresh cells next to a rotten one, rot them all at once.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (multi-source BFS by levels)   O(m*n) time, O(m*n) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no fresh oranges -> 0 (even with no rotten ones)
- fresh orange with no rotten anywhere -> -1
- count minutes only when a level actually rots something (do not add +1 for the
  final empty level)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate minute by minute)   O(minutes * m*n) time

```
Each minute, scan the grid, collect fresh cells next to a rotten one, rot them all at
once. Stop when nothing changes. Minutes can be O(m*n), so O((m*n)^2) worst case.
```

### APPROACH 2 — Optimal (multi-source BFS by levels)   O(m*n) time, O(m*n) space

```
1. Push ALL rotten cells into the queue; count fresh cells.
  2. BFS level by level. Each level = one minute. Rot fresh neighbours, decrement fresh.
  3. If fresh > 0 at the end -> -1, else the number of levels that rotted something.

Dry run on [[2,1,1],[1,1,0],[0,1,1]]:
  queue [(0,0)] fresh=6
  min 1: (0,1),(1,0) rot                fresh=4
  min 2: (0,2),(1,1) rot                fresh=2
  min 3: (2,1) rot                      fresh=1
  min 4: (2,2) rot                      fresh=0
  answer 4
```

### Edge cases

```
- no fresh oranges -> 0 (even with no rotten ones)
- fresh orange with no rotten anywhere -> -1
- count minutes only when a level actually rots something (do not add +1 for the
  final empty level)
```

Full JavaScript solution with tests: [10_rotting_oranges.js](../solutions/10_rotting_oranges.js). Run it with `node 10_rotting_oranges.js` from the solutions folder.

</details>

## Common mistakes

- Starting BFS from one rotten orange at a time.
- Counting minutes per orange instead of per BFS level.
- Returning 0 instead of -1 when a fresh orange can never rot (or vice versa when there are no fresh oranges).

## Related follow-ups

- [Rotting Oranges](../../../17_Queues_And_Deques/03_Problems/02_Medium/09_rotting_oranges.md) (17_Queues_And_Deques)
- [Walls and Gates](11_walls_and_gates.md)
- [01 Matrix](12_01_matrix.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
