# Guess Number Higher or Lower

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Easy |
| **Pattern** | exact with an oracle |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #374 — https://leetcode.com/problems/guess-number-higher-or-lower/ |
| **Solution file** | [06_guess_number.js](../solutions/06_guess_number.js) — open only after a real attempt |

## Problem

I pick a number in 1..n. You guess; an API guess(num) returns
  -1 if my number is LOWER than your guess, 1 if HIGHER, 0 if correct.
Return my number.

## Examples

```
n = 10, pick = 6   Output: 6
n = 1,  pick = 1   Output: 1
n = 2,  pick = 1   Output: 1
```

## Constraints & clarifying questions

```
- n up to 2^31 - 1 (use Math.floor for mid, not >> on the sum)
- The API is the only information source; minimise calls
- Be careful with the sign convention: -1 means "go lower"
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *exact with an oracle* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) calls. Guess 1, 2, 3, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Template 1 with an oracle instead of an array)   O(log n) calls, O(1) space. Exactly binary search: the hidden number plays the role of "target", the API plays the role of the comparison.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1
- pick = 1 or pick = n (boundaries)
- huge n: at most ~31 calls
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) calls

```
Guess 1, 2, 3, ... until the API says 0.
```

### APPROACH 2 — Optimal (Template 1 with an oracle instead of an array)   O(log n) calls, O(1) space

```
Exactly binary search: the hidden number plays the role of "target", the API plays
the role of the comparison. guess(mid) === 0 -> found; === -1 -> hi = mid - 1;
=== 1 -> lo = mid + 1.

Dry run n=10, pick=6:
  lo=1 hi=10 mid=5 guess -> 1 (higher)  -> lo=6
  lo=6 hi=10 mid=8 guess -> -1 (lower)  -> hi=7
  lo=6 hi=7  mid=6 guess -> 0 -> 6
```

### Edge cases

```
- n = 1
- pick = 1 or pick = n (boundaries)
- huge n: at most ~31 calls
```

Full JavaScript solution with tests: [06_guess_number.js](../solutions/06_guess_number.js). Run it with `node 06_guess_number.js` from the solutions folder.

</details>

## Common mistakes

- Mixing up the API sign convention (-1 means your guess is too high).
- Moving `lo = mid` instead of `mid + 1`, causing an infinite loop.
- Searching 0..n instead of 1..n.

## Related follow-ups

- [Binary Search](01_binary_search.md) — the plain array version
- [First Bad Version](03_first_bad_version.md) — a boolean API instead of three-way
- Guess Number Higher or Lower II (LeetCode #375) — minimise worst-case cost with DP

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
