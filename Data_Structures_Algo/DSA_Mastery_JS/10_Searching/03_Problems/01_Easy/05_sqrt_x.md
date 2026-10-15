# Sqrt

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Easy |
| **Pattern** | search on answer (last true) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #69 — https://leetcode.com/problems/sqrtx/ |
| **Solution file** | [05_sqrt_x.js](../solutions/05_sqrt_x.js) — open only after a real attempt |

## Problem

Given a non-negative integer x, return the integer square root of x rounded DOWN.
Do not use Math.sqrt or the ** operator.

## Examples

```
Input: 4    Output: 2
Input: 8    Output: 2   (sqrt(8) = 2.828..., round down)
Input: 0    Output: 0
```

## Constraints & clarifying questions

```
- 0 <= x <= 2^31 - 1, so mid * mid can reach ~4.6e18: fine in JS doubles (< 2^53)
  but overflows 32-bit ints elsewhere (compare mid <= x / mid instead)
- Round down, never up
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *search on answer (last true)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(sqrt(x)) time. Count up k = 0, 1, 2, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search on the answer, LAST true)   O(log x) time, O(1) space. The predicate k * k &lt;= x is true for small k then false: T T T F F F.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 0 -> 0, 1 -> 1
- perfect squares return exactly
- max int 2147483647 -> 46340
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(sqrt(x)) time

```
Count up k = 0, 1, 2, ... while k * k <= x; return the last k that fit.
For x ~ 2 * 10^9 that is ~46,000 steps: acceptable but not O(log).
```

### APPROACH 2 — Optimal (binary search on the answer, LAST true)   O(log x) time, O(1) space

```
The predicate k * k <= x is true for small k then false: T T T F F F. We want the
LAST true. Search [0, x]: if mid * mid <= x, the answer is mid or bigger (lo = mid,
so round mid UP to avoid an infinite loop); else hi = mid - 1.
(Equivalent: find the first k with k * k > x and return k - 1.)

Dry run x = 8:
  lo=0 hi=8 mid=4 16 > 8  -> hi=3
  lo=0 hi=3 mid=2 4 <= 8  -> lo=2
  lo=2 hi=3 mid=3 9 > 8   -> hi=2
  lo === hi === 2 -> 2
```

### Edge cases

```
- 0 -> 0, 1 -> 1
- perfect squares return exactly
- max int 2147483647 -> 46340
```

Full JavaScript solution with tests: [05_sqrt_x.js](../solutions/05_sqrt_x.js). Run it with `node 05_sqrt_x.js` from the solutions folder.

</details>

## Common mistakes

- Returning the rounded square root instead of the floor.
- Searching up to x for x = 0 or 1 incorrectly (handle small x).
- Using `Math.sqrt` when the point is to implement the search.

## Related follow-ups

- [Sqrt (Mathematics)](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/01_Easy/07_sqrt_x.md) — the same problem in the math topic
- Valid Perfect Square (LeetCode #367) — exact check instead of floor
- [Pow](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/02_Medium/06_pow_x_n.md) — the inverse direction, fast exponentiation

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
