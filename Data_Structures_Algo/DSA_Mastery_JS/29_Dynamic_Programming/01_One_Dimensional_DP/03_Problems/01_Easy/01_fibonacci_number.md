# Fibonacci Number

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Easy |
| **Pattern** | fibonacci family |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #509 — https://leetcode.com/problems/fibonacci-number/ |
| **Solution file** | [01_fibonacci_number.js](../solutions/01_fibonacci_number.js) — open only after a real attempt |

## Problem

F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2). Given n, return F(n).

## Examples

```
Input: n = 2   Output: 1   Explanation: F(1) + F(0) = 1 + 0
Input: n = 3   Output: 2   Explanation: F(2) + F(1) = 1 + 1
Input: n = 10  Output: 55
```

## Constraints & clarifying questions

```
- Is n always >= 0? (yes, 0 <= n <= 30 on LeetCode)
- Do we need to worry about overflow? (not for n <= 30; beyond ~78 use BigInt)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fibonacci family* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space (call stack). Translate the definition directly.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. We only ever read dp[i-1] and dp[i-2], so keep two variables and slide them.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 0
- n = 1 -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space (call stack)

```
Translate the definition directly. fib(5) calls fib(3) twice, fib(2) three
times... the same work is repeated exponentially many times.
```

### APPROACH 2 — Memoization (top-down)   O(n) time, O(n) space

```
Same recursion, but store each answer in a cache the first time we compute it.
Every fib(i) is now computed once.
```

### APPROACH 3 — Tabulation (bottom-up)   O(n) time, O(n) space

```
Fill an array from 0 to n. Each cell only looks at the two cells before it.

Dry run, n = 6:
  i   : 0  1  2  3  4  5  6
  dp  : 0  1  1  2  3  5  8
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space

```
We only ever read dp[i-1] and dp[i-2], so keep two variables and slide them.
```

### DP definition

```
STATE:       dp[i] = the i-th Fibonacci number
RECURRENCE:  dp[i] = dp[i-1] + dp[i-2]
BASE CASES:  dp[0] = 0, dp[1] = 1
ANSWER:      dp[n]
```

### Edge cases

```
- n = 0 -> 0
- n = 1 -> 1
```

Full JavaScript solution with tests: [01_fibonacci_number.js](../solutions/01_fibonacci_number.js). Run it with `node 01_fibonacci_number.js` from the solutions folder.

</details>

## Common mistakes

- Plain recursion without a cache: `fib(40)` makes over a billion calls because the same sub-problems are recomputed.
- Forgetting the base cases `fib(0) = 0` and `fib(1) = 1`, so the recursion never stops or starts from the wrong values.
- Rolling two variables in the wrong order (overwriting `a` before computing the new `b`). Use a temporary or destructuring.

## Related follow-ups

- [Climbing Stairs](02_climbing_stairs.md)
- [N-th Tribonacci Number](04_nth_tribonacci.md)
- [House Robber](../02_Medium/05_house_robber.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
