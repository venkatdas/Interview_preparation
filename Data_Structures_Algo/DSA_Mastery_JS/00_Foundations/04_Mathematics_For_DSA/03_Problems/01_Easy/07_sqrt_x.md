# Sqrt

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Easy |
| **Pattern** | binary search on the answer |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #69 — https://leetcode.com/problems/sqrtx/ |
| **Solution file** | [07_sqrt_x.js](../solutions/07_sqrt_x.js) — open only after a real attempt |

## Problem

Given a non-negative integer x, return the square root of x rounded DOWN to an integer.
Do not use Math.sqrt or **.

## Examples

```
Input: 4    Output: 2
Input: 8    Output: 2    Explanation: sqrt(8) = 2.828..., round down
Input: 0    Output: 0
```

## Constraints & clarifying questions

```
- x up to 2^31 - 1, so mid * mid can reach ~4.6e18: safe in JS (below 2^53), but overflows
  in 32/64-bit int languages, where you would compare mid <= x / mid instead.
- Round down, not nearest? (down)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *binary search on the answer* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (count up)   O(sqrt x) time, O(1) space. Try 1, 2, 3, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search on the answer)   O(log x) time, O(1) space. The condition "mid * mid &lt;= x" is true for all small mid and false for all large mid.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 0 and 1 -> themselves
- perfect square -> exact root (16 -> 4)
- 2^31 - 1 -> 46340
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (count up)   O(sqrt x) time, O(1) space

```
Try 1, 2, 3, ... while i * i <= x. The last i that fits is the answer. For x = 2^31
that is about 46,000 steps: fine, but we can do far better.
```

### APPROACH 2 — Optimal (binary search on the answer)   O(log x) time, O(1) space

```
The condition "mid * mid <= x" is true for all small mid and false for all large mid.
That monotonic shape is exactly what binary search needs. Search mid in [1, x/2]
(for x >= 2, sqrt(x) <= x/2). Keep the last mid that satisfied the condition.
This is a teaser for "binary search on the answer", see 10_Searching.

Dry run on x = 8:
  low=1 high=4 mid=2: 4 <= 8 ok,  answer=2, low=3
  low=3 high=4 mid=3: 9 > 8 no,   high=2
  low=3 > high=2 stop -> 2
```

### Edge cases

```
- 0 and 1 -> themselves
- perfect square -> exact root (16 -> 4)
- 2^31 - 1 -> 46340
```

Full JavaScript solution with tests: [07_sqrt_x.js](../solutions/07_sqrt_x.js). Run it with `node 07_sqrt_x.js` from the solutions folder.

</details>

## Common mistakes

- Returning the rounded root; the answer is the floor.
- Using `mid * mid` in a language with 32-bit ints (overflow); compare `mid <= x / mid` there.
- Wrong bounds for x = 0 and x = 1.

## Related follow-ups

- [Sqrt (Searching)](../../../../10_Searching/03_Problems/01_Easy/05_sqrt_x.md) — the same problem in the searching topic
- [Pow](../02_Medium/06_pow_x_n.md) — fast exponentiation
- Valid Perfect Square (LeetCode #367) — exact square check

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
