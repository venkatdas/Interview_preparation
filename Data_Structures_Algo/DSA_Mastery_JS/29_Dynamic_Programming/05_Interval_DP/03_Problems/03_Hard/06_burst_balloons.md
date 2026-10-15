# Burst Balloons

| | |
|---|---|
| **Topic** | Interval DP |
| **Difficulty** | Hard |
| **Pattern** | "last operation" trick |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #312 — https://leetcode.com/problems/burst-balloons/ |
| **Solution file** | [06_burst_balloons.js](../solutions/06_burst_balloons.js) — open only after a real attempt |

## Problem

You have n balloons in a row with numbers on them. When you burst balloon i you get
nums[i-1] * nums[i] * nums[i+1] coins (treat an out-of-range neighbour as 1). After
bursting, balloons i-1 and i+1 become adjacent. Burst all balloons in the order that
gives the maximum coins.

## Examples

```
Input: [3, 1, 5, 8]   Output: 167
  Explanation: burst 1 -> 3*1*5 = 15, [3,5,8]; burst 5 -> 3*5*8 = 120, [3,8];
               burst 3 -> 1*3*8 = 24, [8]; burst 8 -> 1*8*1 = 8. Total 167.
Input: [1, 5]         Output: 10   (5 first: 1*5*1 = 5, then 1: 1*1*1 = 1 -> 6;
                                    1 first: 1*1*5 = 5, then 5: 1*5*1 = 5 -> 10)
```

## Constraints & clarifying questions

```
- 1 <= n <= 300, 0 <= nums[i] <= 100
- Zeros are allowed (bursting a zero gives 0 coins, but it still disappears).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *"last operation" trick* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(n!) time, O(n) space. Try every balloon as the next one to burst, remove it from the array, recurse on the smaller array.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Memo / Tabulation (Interval DP, "LAST operation" trick)   O(n^3) time, O(n^2) space. The hard part: choosing the FIRST balloon to burst does not split the problem, because after it bursts the two sides become neighbours and keep affecting each other.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single balloon -> nums[0]
- Contains zeros -> still must be burst, contributes 0 when it is the middle
- Empty array -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(n!) time, O(n) space

```
Try every balloon as the next one to burst, remove it from the array, recurse on the
smaller array. n choices, then n-1, ... -> n!. Only feasible for n <= 8.
```

### APPROACH 2 — Memo / Tabulation (Interval DP, "LAST operation" trick)   O(n^3) time, O(n^2) space

```
The hard part: choosing the FIRST balloon to burst does not split the problem, because
after it bursts the two sides become neighbours and keep affecting each other.

The fix: pad the array with 1s -> padded = [1, ...nums, 1], and ask which balloon is
burst LAST in the open range (l, r). If balloon k is burst last, then at that moment
everything between l and r except k is already gone, so its neighbours are exactly
padded[l] and padded[r]. Before that, the ranges (l, k) and (k, r) were cleared
independently -- they never touched each other because k was a wall between them.

  STATE      dp[l][r] = max coins from bursting ALL balloons strictly between l and r
                        (padded indices; balloons l and r themselves stay)
  RECURRENCE dp[l][r] = max over k in (l, r) of
                        dp[l][k] + dp[k][r] + padded[l] * padded[k] * padded[r]
  BASE CASES dp[l][r] = 0 when r - l <= 1   (nothing strictly between)
  ANSWER     dp[0][n+1]

Dry run on [3, 1, 5]:  padded = [1, 3, 1, 5, 1]
  len 3 (one balloon inside):
    dp[0][2] = 1*3*1 = 3      dp[1][3] = 3*1*5 = 15     dp[2][4] = 1*5*1 = 5
  len 4:
    dp[0][3] = max(k=1: 0 + dp[1][3] + 1*3*5 = 15+15 = 30,
                   k=2: dp[0][2] + 0 + 1*1*5 = 3+5 = 8)  = 30
    dp[1][4] = max(k=2: 0 + dp[2][4] + 3*1*1 = 5+3 = 8,
                   k=3: dp[1][3] + 0 + 3*5*1 = 15+15 = 30) = 30
  len 5:
    dp[0][4] = max(k=1: 0 + dp[1][4] + 1*3*1 = 30+3 = 33,
                   k=2: dp[0][2] + dp[2][4] + 1*1*1 = 3+5+1 = 9,
                   k=3: dp[0][3] + 0 + 1*5*1 = 30+5 = 35) = 35
  answer 35  (burst 1, then 3, then 5: 15 + 15 + 5)
```

### Edge cases

```
- Single balloon -> nums[0]
- Contains zeros -> still must be burst, contributes 0 when it is the middle
- Empty array -> 0
```

Full JavaScript solution with tests: [06_burst_balloons.js](../solutions/06_burst_balloons.js). Run it with `node 06_burst_balloons.js` from the solutions folder.

</details>

## Common mistakes

- Choosing which balloon to burst FIRST; the neighbours then change. Choose which balloon bursts LAST inside (l, r), so its neighbours are the fixed borders.
- Forgetting the padding 1s at both ends.
- Using closed intervals and double-counting the borders; keep l and r exclusive.

## Related follow-ups

- [Matrix Chain Multiplication](../02_Medium/02_matrix_chain_multiplication.md)
- [Minimum Cost to Cut a Stick](05_minimum_cost_to_cut_a_stick.md)
- [Remove Boxes](08_remove_boxes.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
