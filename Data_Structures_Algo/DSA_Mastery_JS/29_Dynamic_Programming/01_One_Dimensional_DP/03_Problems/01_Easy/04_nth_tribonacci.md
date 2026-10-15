# N-th Tribonacci Number

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Easy |
| **Pattern** | fibonacci (3 back) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1137 — https://leetcode.com/problems/n-th-tribonacci-number/ |
| **Solution file** | [04_nth_tribonacci.js](../solutions/04_nth_tribonacci.js) — open only after a real attempt |

## Problem

T(0) = 0, T(1) = 1, T(2) = 1, T(n) = T(n-1) + T(n-2) + T(n-3). Return T(n).

## Examples

```
Input: n = 4    Output: 4    Explanation: T3 = 0+1+1 = 2, T4 = 1+1+2 = 4
Input: n = 25   Output: 1389537
```

## Constraints & clarifying questions

```
- 0 <= n <= 37 (fits in a normal number)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fibonacci (3 back)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(3^n) time, O(n) space. Three recursive calls per level.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. Three rolling variables instead of two.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 0, n = 1 -> 1, n = 2 -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(3^n) time, O(n) space

```
Three recursive calls per level. Even worse than Fibonacci.
```

### APPROACH 2 — Memoization   O(n) time, O(n) space


### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, n = 6:
  i   : 0  1  2  3  4  5   6
  dp  : 0  1  1  2  4  7  13
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space

```
Three rolling variables instead of two.
```

### DP definition

```
STATE:       dp[i] = T(i)
RECURRENCE:  dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
BASE CASES:  dp[0] = 0, dp[1] = 1, dp[2] = 1
ANSWER:      dp[n]
```

### Edge cases

```
- n = 0 -> 0, n = 1 -> 1, n = 2 -> 1
```

Full JavaScript solution with tests: [04_nth_tribonacci.js](../solutions/04_nth_tribonacci.js). Run it with `node 04_nth_tribonacci.js` from the solutions folder.

</details>

## Common mistakes

- Getting the three base cases wrong: T0 = 0, T1 = 1, T2 = 1.
- Shifting three rolling variables in the wrong order and losing one of them.
- Using plain recursion, which grows like 1.84^n and times out quickly.

## Related follow-ups

- [Fibonacci Number](01_fibonacci_number.md)
- [Climbing Stairs](02_climbing_stairs.md)
- [Decode Ways](../02_Medium/10_decode_ways.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
