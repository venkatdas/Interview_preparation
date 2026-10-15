# Paint House

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | state machine (3 colours) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #256 — https://leetcode.com/problems/paint-house/ |
| **Solution file** | [13_paint_house.js](../solutions/13_paint_house.js) — open only after a real attempt |

## Problem

There are n houses in a row. Painting house i with red/blue/green costs
costs[i][0] / costs[i][1] / costs[i][2]. No two adjacent houses may have
the same colour. Return the minimum total cost.

## Examples

```
Input: [[17,2,17],[16,16,5],[14,3,19]]   Output: 10
  Explanation: blue(2) + green(5) + blue(3) = 10
Input: [[7,6,2]]                           Output: 2
```

## Constraints & clarifying questions

```
- 1 <= n <= 100, exactly 3 colours
- Can the list be empty? (return 0)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *state machine (3 colours)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. For each house, try the two colours that differ from the previous one.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. Only the previous row (3 numbers) is needed.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- One house -> min of its three costs
- Empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
For each house, try the two colours that differ from the previous one.
```

### APPROACH 2 — Memoization   O(n * 3) time, O(n * 3) space


### APPROACH 3 — Tabulation   O(n * 3) time, O(n * 3) space

```
Dry run, costs = [[17,2,17],[16,16,5],[14,3,19]]:
  house : red    blue   green
  0     : 17     2      17
  1     : 16+2   16+17  5+2    -> 18   33   7
  2     : 14+7   3+7    19+18  -> 21   10   37
  answer = min(21, 10, 37) = 10
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space

```
Only the previous row (3 numbers) is needed.
```

### DP definition

```
STATE:       dp[i][c] = min cost to paint houses 0..i with house i coloured c
RECURRENCE:  dp[i][c] = costs[i][c] + min(dp[i-1][other colours])
BASE CASES:  dp[0][c] = costs[0][c]
ANSWER:      min(dp[n-1][0], dp[n-1][1], dp[n-1][2])
Note: state is (index, colour) - the colour is the "what did I do last" piece
that the plain index can't capture. This is the gateway to state-machine DP.
```

### Edge cases

```
- One house -> min of its three costs
- Empty -> 0
```

Full JavaScript solution with tests: [13_paint_house.js](../solutions/13_paint_house.js). Run it with `node 13_paint_house.js` from the solutions folder.

</details>

## Common mistakes

- Greedily picking the cheapest colour per house; the cheap choice now can force an expensive one later.
- Updating the three colour states in place, so a new value is read where the old one was needed.
- Forgetting the empty input (cost 0) or a single house (min of its row).

## Related follow-ups

- [House Robber](05_house_robber.md)
- [Best Time to Buy and Sell Stock with Cooldown](18_stock_with_cooldown.md)
- Paint House II (LeetCode 265)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
