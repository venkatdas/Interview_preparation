# Minimum Score Triangulation of Polygon

| | |
|---|---|
| **Topic** | Interval DP |
| **Difficulty** | Medium |
| **Pattern** | min-cost split (boundary style) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1039 — https://leetcode.com/problems/minimum-score-triangulation-of-polygon/ |
| **Solution file** | [03_minimum_score_triangulation.js](../solutions/03_minimum_score_triangulation.js) — open only after a real attempt |

## Problem

You have a convex polygon with n vertices. values[i] is the number written on
vertex i (in clockwise order). Triangulate the polygon into n - 2 triangles.
The score of a triangle is the product of its three vertex values; the score of a
triangulation is the sum of its triangle scores. Return the minimum possible score.

## Examples

```
Input: [1, 2, 3]        Output: 6     Explanation: one triangle, 1*2*3
Input: [3, 7, 4, 5]     Output: 144   Explanation: 3*7*5 + 4*5*7 = 105+140 = 245
                                      or 3*4*5 + 3*4*7 = 60 + 84 = 144 (better)
Input: [1, 3, 1, 4, 1, 5] Output: 13
```

## Constraints & clarifying questions

```
- 3 <= n <= 50, 1 <= values[i] <= 100
- Is the polygon always convex? (yes, so any diagonal is valid)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *min-cost split (boundary style)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(Catalan(n)) ~ O(4^n) time, O(n) space. The edge (l, r) must belong to exactly one triangle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Memo / Tabulation (Interval DP, boundary style)   O(n^3) time, O(n^2) space. STATE      dp[l][r] = min score to triangulate the polygon formed by vertices l..r (the edge l-r is one of its sides) RECURRENCE dp[l][r] = min over k in (l, r) of dp[l][k] + dp[k][r] + values[l] * values[k] * values[r] Note the sub-ranges SHARE vertex k (boun

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n == 3 -> single triangle
- all values 1 -> answer is n - 2 (number of triangles)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(Catalan(n)) ~ O(4^n) time, O(n) space

```
The edge (l, r) must belong to exactly one triangle. Try every third vertex k strictly
between l and r; that triangle splits the polygon into two smaller polygons
l..k and k..r. Recurse on both.
```

### APPROACH 2 — Memo / Tabulation (Interval DP, boundary style)   O(n^3) time, O(n^2) space

```
STATE      dp[l][r] = min score to triangulate the polygon formed by vertices l..r
                        (the edge l-r is one of its sides)
  RECURRENCE dp[l][r] = min over k in (l, r) of
                        dp[l][k] + dp[k][r] + values[l] * values[k] * values[r]
             Note the sub-ranges SHARE vertex k (boundary style, not [k+1, r]).
  BASE CASES dp[l][r] = 0 when r - l < 2   (fewer than 3 vertices: no triangle)
  ANSWER     dp[0][n-1]

Dry run on [3, 7, 4, 5]:
  len 3: dp[0][2] = 3*7*4 = 84    dp[1][3] = 7*4*5 = 140
  len 4: dp[0][3] = min( k=1: dp[0][1] + dp[1][3] + 3*7*5 = 0+140+105 = 245,
                         k=2: dp[0][2] + dp[2][3] + 3*4*5 = 84+0+60   = 144 ) = 144

       r=0  r=1  r=2   r=3
  l=0 [ 0 ][ 0 ][ 84 ][ 144 ]
  l=1 [ - ][ 0 ][  0 ][ 140 ]
  l=2 [ - ][ - ][  0 ][   0 ]
  l=3 [ - ][ - ][  - ][   0 ]
```

### Edge cases

```
- n == 3 -> single triangle
- all values 1 -> answer is n - 2 (number of triangles)
```

Full JavaScript solution with tests: [03_minimum_score_triangulation.js](../solutions/03_minimum_score_triangulation.js). Run it with `node 03_minimum_score_triangulation.js` from the solutions folder.

</details>

## Common mistakes

- Trying to triangulate with a greedy choice of the smallest vertex; it fails, every apex k must be tried.
- Allowing k = i or k = j as the apex; the triangle (i, k, j) needs i < k < j.
- Base case: an interval with fewer than 3 vertices (`j - i < 2`) costs 0, not Infinity.

## Related follow-ups

- [Matrix Chain Multiplication](02_matrix_chain_multiplication.md)
- [Burst Balloons](../03_Hard/06_burst_balloons.md)
- Polygon triangulation count (Catalan numbers)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
