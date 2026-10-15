# Unique Paths

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Medium |
| **Pattern** | count paths |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #62 — https://leetcode.com/problems/unique-paths/ |
| **Solution file** | [01_unique_paths.js](../solutions/01_unique_paths.js) — open only after a real attempt |

## Problem

A robot stands at the top-left corner of an m x n grid and wants to reach the
bottom-right corner. It can only move RIGHT or DOWN. How many distinct paths exist?

## Examples

```
Input: m = 3, n = 7   Output: 28
Input: m = 3, n = 2   Output: 3    Explanation: RDD, DRD, DDR
Input: m = 1, n = 1   Output: 1    Explanation: already there
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 100 (answer fits in a JS number, <= 2 * 10^9)
- Only right / down moves? (yes)
- Any blocked cells? (no, see 02-unique-paths-ii for that)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *count paths* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space. paths(i, j) = paths(i-1, j) + paths(i, j-1).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — One row   O(m*n) time, O(n) space. row[j] += row[j-1]: row[j] still holds "above", row[j-1] already holds "left".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- m = 1 or n = 1 -> exactly 1 path
- m = n = 1      -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space

```
paths(i, j) = paths(i-1, j) + paths(i, j-1). The same cell is recomputed many times
(paths(1,1) is reached from (1,2), (2,1), ... all over again).
```

### APPROACH 2 — Memoization   O(m*n) time, O(m*n) space

```
Same recursion, but store each (i, j) result in a table so it is computed once.
```

### APPROACH 3 — Tabulation   O(m*n) time, O(m*n) space

```
Fill the table top to bottom, left to right, so parents are always ready.

Dry run m = 3, n = 3:
     j=0  j=1  j=2
i=0 [ 1    1    1 ]
i=1 [ 1    2    3 ]      dp[1][1] = 1 + 1 = 2, dp[1][2] = 1 + 2 = 3
i=2 [ 1    3    6 ]      dp[2][2] = 3 + 3 = 6  -> answer 6
```

### APPROACH 4 — One row   O(m*n) time, O(n) space

```
row[j] += row[j-1]: row[j] still holds "above", row[j-1] already holds "left".
```

### DP definition

```
STATE
dp[i][j] = number of distinct paths from (0, 0) to cell (i, j)
RECURRENCE
dp[i][j] = dp[i-1][j] + dp[i][j-1]   (you arrive from above or from the left)
BASE CASES
dp[0][j] = 1 for all j, dp[i][0] = 1 for all i   (only one straight line)
ANSWER
dp[m-1][n-1]
```

### Edge cases

```
- m = 1 or n = 1 -> exactly 1 path
- m = n = 1      -> 1
```

Full JavaScript solution with tests: [01_unique_paths.js](../solutions/01_unique_paths.js). Run it with `node 01_unique_paths.js` from the solutions folder.

</details>

## Common mistakes

- Initialising the first row and column to 0; there is exactly ONE way to reach any cell on them (straight line).
- Swapping m (rows) and n (columns) when building the table — harmless for this count, fatal in grid problems with contents.
- Computing the binomial `C(m+n-2, m-1)` with factorials, which overflow 2^53 long before the answer does.

## Related follow-ups

- [Unique Paths II](02_unique_paths_ii.md)
- [Minimum Path Sum](03_minimum_path_sum.md)
- [Climbing Stairs (the 1D version)](../../../01_One_Dimensional_DP/03_Problems/01_Easy/02_climbing_stairs.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
