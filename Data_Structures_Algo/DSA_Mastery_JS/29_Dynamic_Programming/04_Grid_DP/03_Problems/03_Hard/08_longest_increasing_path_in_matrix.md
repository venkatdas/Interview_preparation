# Longest Increasing Path in a Matrix

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Hard |
| **Pattern** | memo DFS over a value-DAG |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #329 — https://leetcode.com/problems/longest-increasing-path-in-matrix/ |
| **Solution file** | [08_longest_increasing_path_in_matrix.js](../solutions/08_longest_increasing_path_in_matrix.js) — open only after a real attempt |

## Problem

Given an m x n matrix of integers, return the length of the longest path such that
every step moves to a 4-direction neighbour (up / down / left / right) with a STRICTLY
larger value. You may start anywhere. No diagonal moves, no wrapping.

## Examples

```
Input: [[9,9,4],[6,6,8],[2,1,1]]   Output: 4   Explanation: 1 -> 2 -> 6 -> 9
Input: [[3,4,5],[3,2,6],[2,2,1]]   Output: 4   Explanation: 3 -> 4 -> 5 -> 6
Input: [[1]]                       Output: 1
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 200
- Strictly increasing? (yes -> no cycles are possible, so the grid is a DAG)
- Path length counts cells (a single cell is a path of length 1)

WHY THIS IS STILL DP WITH 4 DIRECTIONS
Normally 4-direction moves create cycles and DP has no fill order. Here a move is only
allowed to a strictly larger value, so you can never come back: the cells form a DAG
ordered by value. Memoized DFS computes each cell once.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *memo DFS over a value-DAG* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force DFS from every cell   O(2^(m+n)) worst, O(m*n) stack. Explore every increasing path.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Tabulation by sorted values   O(m*n log(m*n)) time, O(m*n) space. Sort all cells by value (descending).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1x1 -> 1
- all equal values -> 1 (no move is allowed)
- a snake path through the whole grid -> length m*n (deep recursion for memo DFS)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force DFS from every cell   O(2^(m+n)) worst, O(m*n) stack

```
Explore every increasing path. The same cell gets re-explored from every path that
reaches it.
```

### APPROACH 2 — Memoized DFS   O(m*n) time, O(m*n) space

```
Cache longest(i, j). Each cell is expanded once; each expansion looks at 4 neighbours.

Dry run on [[9,9,4],[6,6,8],[2,1,1]]:
  longest(2,1) [value 1]: neighbours 6 (up), 2 (left), 1 (right, not larger)
    longest(2,0) [2]: up is 6 -> longest(1,0) [6]: up is 9 -> longest(0,0) [9] = 1
      longest(1,0) = 1 + 1 = 2, longest(2,0) = 1 + 2 = 3
    longest(1,1) [6]: up 9 -> 1, right 8 -> longest(1,2) [8]: up 4 no, down 1 no -> 1
      longest(1,1) = 2
  longest(2,1) = 1 + max(3, 2) = 4  -> answer 4
```

### APPROACH 3 — Tabulation by sorted values   O(m*n log(m*n)) time, O(m*n) space

```
Sort all cells by value (descending). Process them in that order: when we reach a cell,
every strictly larger neighbour has already been finalised. This is a topological order
of the DAG, so a plain loop works with no recursion (safe for deep paths).
```

### DP definition

```
STATE
longest(i, j) = length of the longest increasing path STARTING at (i, j)
RECURRENCE
longest(i, j) = 1 + max(longest(ni, nj)) over neighbours with matrix[ni][nj] > matrix[i][j]
BASE CASES
a cell with no larger neighbour -> 1
ANSWER
max over all cells of longest(i, j)
```

### Edge cases

```
- 1x1 -> 1
- all equal values -> 1 (no move is allowed)
- a snake path through the whole grid -> length m*n (deep recursion for memo DFS)
```

Full JavaScript solution with tests: [08_longest_increasing_path_in_matrix.js](../solutions/08_longest_increasing_path_in_matrix.js). Run it with `node 08_longest_increasing_path_in_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Keeping a `visited` set as in normal DFS; because the path is strictly increasing there can be no cycle, and the memo is the only cache needed.
- Trying a row-by-row table: moves go in all four directions, so there is no fixed fill order — use memoized DFS (or topological order by value).
- Allowing equal neighbours, which are not strictly increasing.

## Related follow-ups

- [Topological sort (Kahn) on the value DAG](../../../../26_Topological_Sorting/README.md)
- [Minimum Path Sum](../02_Medium/03_minimum_path_sum.md)
- Number of Increasing Paths in a Grid (LeetCode #2328)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
