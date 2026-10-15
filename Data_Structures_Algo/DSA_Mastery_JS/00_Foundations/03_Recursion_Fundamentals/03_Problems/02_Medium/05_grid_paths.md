# Count Paths in a Small Grid

| | |
|---|---|
| **Topic** | Recursion Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | recursion tree + memoization |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [05_grid_paths.js](../solutions/05_grid_paths.js) — open only after a real attempt |

## Problem

A robot starts at the top-left cell (0, 0) of a grid and wants to reach the
bottom-right cell. It may only move RIGHT or DOWN. Some cells are blocked
(value 1); open cells are 0. Count the number of distinct paths. Also report how
many recursive calls were made, to see the recursion tree shrink with memoization.

## Examples

```
Input: [[0,0,0],
        [0,0,0]]          Output: 3   (RRD, RDR, DRR)
Input: [[0,0,0],
        [0,1,0],
        [0,0,0]]          Output: 2   (around the block either way)
Input: [[1]]              Output: 0   (start blocked)
Input: [[0]]              Output: 1   (already there)
```

## Constraints & clarifying questions

```
- Grid up to 15 x 15 -> naive recursion makes millions of calls; memo makes 225.
- Can start or end be blocked? (yes -> 0)
- Answer fits in a Number? (yes for 15 x 15: C(28,14) = 40,116,600)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Recursion with overlapping subproblems*. Sections 3 (recursion tree) and 5.7 (memoization) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^(r+c)) time, O(r+c) stack. paths(r, c) = number of ways from (r, c) to the end. out of grid or blocked -> 0 at the end -> 1

</details>

<details><summary>Hint 3</summary>

**The key idea.** Let `paths(r, c)` be the number of ways from `(r, c)` to the end: 0 if outside or blocked, 1 at the end, else `paths(r, c+1) + paths(r+1, c)`. The same cell is reached from many call paths, so cache its answer.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- start blocked / end blocked -> 0
- 1 x 1 open grid -> 1
- a full blocked row -> 0
- empty grid [] -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^(r+c)) time, O(r+c) stack

```
paths(r, c) = number of ways from (r, c) to the end.
  out of grid or blocked -> 0
  at the end             -> 1
  otherwise              -> paths(r, c + 1) + paths(r + 1, c)
The recursion tree branches twice per level and has depth r + c.
```

### APPROACH 2 — Optimal (same recursion + memo)   O(r * c) time, O(r * c) space

```
Cell (r, c) is reached by MANY different call paths but its answer never changes,
so cache it in a Map keyed by "r,c" (or a 2D array). Each cell is computed once.

Dry run 2 x 3 open grid (end = (1,2)):
  paths(1,2) = 1 (end)
  paths(1,1) = paths(1,2) + paths(2,1)=0 -> 1
  paths(1,0) = 1;  paths(0,2) = paths(0,3)=0 + paths(1,2) = 1
  paths(0,1) = paths(0,2) + paths(1,1) = 1 + 1 = 2
  paths(0,0) = paths(0,1) + paths(1,0) = 2 + 1 = 3
```

### Edge cases

```
- start blocked / end blocked -> 0
- 1 x 1 open grid -> 1
- a full blocked row -> 0
- empty grid [] -> 0
```

### Common mistakes

```
- Checking "at the end" before "blocked" (a blocked end would count as 1).
- Memo key collisions like r * 10 + c on grids wider than 10.
- Sharing a memo across different grids.
```

Full JavaScript solution with tests: [05_grid_paths.js](../solutions/05_grid_paths.js). Run it with `node 05_grid_paths.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #62 Unique Paths.
- LeetCode #63 Unique Paths II.
- LeetCode #64 Minimum Path Sum.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
