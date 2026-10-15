# Matrix Chain Multiplication

| | |
|---|---|
| **Topic** | Interval DP |
| **Difficulty** | Medium |
| **Pattern** | min-cost split |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [02_matrix_chain_multiplication.js](../solutions/02_matrix_chain_multiplication.js) — open only after a real attempt |

## Problem

You are given an array dims of length n + 1. Matrix i (0-indexed, i from 0 to n-1)
has size dims[i] x dims[i+1]. Multiplying a (p x q) matrix by a (q x r) matrix costs
p * q * r scalar multiplications. Matrix multiplication is associative, so you may
put parentheses anywhere. Return the minimum total number of scalar multiplications
needed to multiply the whole chain.

## Examples

```
Input: dims = [2, 3, 4, 5]     Output: 64
  Explanation: (A*B)*C = 2*3*4 + 2*4*5 = 24 + 40 = 64;  A*(B*C) = 60 + 30 = 90
Input: dims = [10, 20, 30]     Output: 6000   (only two matrices, one way)
Input: dims = [40, 20, 30, 10, 30]   Output: 26000
```

## Constraints & clarifying questions

```
- At least 2 matrices? If dims.length == 2 there is one matrix -> cost 0.
- Values fit in a normal number? (yes for n <= ~100 with dims <= 500)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *min-cost split* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^n) time (Catalan-ish), O(n) space. For the chain of matrices l..r try every split k: multiply (l..k) and (k+1..r) first, then multiply the two results.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Memo / Tabulation (Interval DP, split point)   O(n^3) time, O(n^2) space. STATE      dp[l][r] = min cost to multiply matrices l..r (inclusive) RECURRENCE dp[l][r] = min over k in [l, r-1] of dp[l][k] + dp[k+1][r] + dims[l] * dims[k+1] * dims[r+1] (left block is dims[l] x dims[k+1], right block is dims[k+1] x dims[r+1]) BASE CASES dp

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- One matrix (dims.length == 2) -> 0
- Two matrices -> dims[0]*dims[1]*dims[2]
- Big values: the sum can be large, but still well within 2^53
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^n) time (Catalan-ish), O(n) space

```
For the chain of matrices l..r try every split k: multiply (l..k) and (k+1..r) first,
then multiply the two results. Each split recurses on both sides.
```

### APPROACH 2 — Memo / Tabulation (Interval DP, split point)   O(n^3) time, O(n^2) space

```
STATE      dp[l][r] = min cost to multiply matrices l..r (inclusive)
  RECURRENCE dp[l][r] = min over k in [l, r-1] of
                        dp[l][k] + dp[k+1][r] + dims[l] * dims[k+1] * dims[r+1]
             (left block is dims[l] x dims[k+1], right block is dims[k+1] x dims[r+1])
  BASE CASES dp[i][i] = 0   (a single matrix needs no multiplication)
  ANSWER     dp[0][n-1]

Dry run on dims = [2, 3, 4, 5]  (A=2x3, B=3x4, C=4x5):
  len 1: dp[0][0] = dp[1][1] = dp[2][2] = 0
  len 2: dp[0][1] = 0+0+2*3*4 = 24     dp[1][2] = 0+0+3*4*5 = 60
  len 3: dp[0][2] = min( k=0: dp[0][0]+dp[1][2]+2*3*5 = 90,
                         k=1: dp[0][1]+dp[2][2]+2*4*5 = 64 ) = 64

       r=0  r=1  r=2
  l=0 [ 0 ][ 24 ][ 64 ]
  l=1 [ - ][  0 ][ 60 ]
  l=2 [ - ][  - ][  0 ]
```

### Edge cases

```
- One matrix (dims.length == 2) -> 0
- Two matrices -> dims[0]*dims[1]*dims[2]
- Big values: the sum can be large, but still well within 2^53
```

Full JavaScript solution with tests: [02_matrix_chain_multiplication.js](../solutions/02_matrix_chain_multiplication.js). Run it with `node 02_matrix_chain_multiplication.js` from the solutions folder.

</details>

## Common mistakes

- Mixing up indices: with `dims` of length n + 1, matrix i is `dims[i-1] x dims[i]`, so the split cost is `dims[l-1] * dims[k] * dims[r]`.
- Iterating l and r in plain nested order so `dp[k+1][r]` is not ready yet; iterate by chain length.
- Letting the split point k equal r, which creates an empty right part.

## Related follow-ups

- [Minimum Score Triangulation](../02_Medium/03_minimum_score_triangulation.md)
- [Burst Balloons](../03_Hard/06_burst_balloons.md)
- [Minimum Cost to Cut a Stick](../03_Hard/05_minimum_cost_to_cut_a_stick.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
