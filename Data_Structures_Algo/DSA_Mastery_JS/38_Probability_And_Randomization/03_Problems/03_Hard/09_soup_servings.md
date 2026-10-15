# Soup Servings

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Hard (LeetCode Medium) |
| **Pattern** | memoized probability DP + convergence cutoff |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #808 — https://leetcode.com/problems/soup-servings/ (statement paraphrased, not copied) |
| **Solution file** | [09_soup_servings.js](../solutions/09_soup_servings.js) — open only after a real attempt |

## Problem

Soups A and B each start with `n` ml. Each turn, one of four servings happens with probability 1/4: (100 ml A, 0 B), (75 A, 25 B), (50 A, 50 B), (25 A, 75 B). If a soup has less than requested, all of it is served. The process stops as soon as at least one soup is empty.

Return P(A becomes empty first) + 0.5 * P(A and B become empty on the same turn). Answers within 1e-5 are accepted.

## Examples

```
n = 50  -> 0.625
  servings 1 and 2 empty A first, serving 3 empties both, serving 4 empties B first:
  1/4 + 1/4 + 0.5 * 1/4 + 0 = 0.625
n = 100 -> 0.71875
n = 0   -> 0.5
```

## Constraints & clarifying questions

```
- 0 <= n <= 1e9 -> a DP of size n^2 is impossible
- The 1e-5 tolerance is a hint: an approximate shortcut is allowed
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Probability DP backwards (memoized recursion). See Pattern F in section 13 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** All servings are multiples of 25, so work in units of 25 ml: m = ceil(n / 25). Write f(a, b) with base cases (both empty 0.5, A empty 1, B empty 0) and memoize it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** n can be 1e9. Compute the expected amount served per turn: A loses 62.5 ml, B only 37.5 ml. A is favoured, so the answer climbs toward 1 as n grows. Find (by running your DP) the m where 1 - f(m, m) < 1e-5 and return 1 above it. It happens around m = 200.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** n = 0 -> 0.5. n not a multiple of 25 -> round UP. Check base cases in the right order (both empty first).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Plain recursion)   O(4^m) time

```
f(a, b) = 0.25 * (f(a-4, b) + f(a-3, b-1) + f(a-2, b-2) + f(a-1, b-3))
base: a<=0 && b<=0 -> 0.5, a<=0 -> 1, b<=0 -> 0
```

### APPROACH 2 — Optimal (Memoization + convergence cutoff)   O(min(m, 200)^2) time and space

```
m = ceil(n / 25)
if m >= 200: return 1          // answer already within 1e-5 of 1
memoized f(m, m)
```

### Dry run

```
n = 50 -> m = 2, f(2, 2)
  f(-2, 2) = 1    f(-1, 1) = 1    f(0, 0) = 0.5    f(1, -1) = 0
  0.25 * (1 + 1 + 0.5 + 0) = 0.625
```

### Complexity

- Brute force: O(4^m) time
- Optimal: O(min(m, 200)^2) time and space

### Edge cases

```
- n = 0 -> 0.5
- n = 1 and n = 25 give the same answer (both one unit)
- n = 1e9 -> 1 immediately, no giant memo
```

### Common mistakes

- Checking "a <= 0" before "a <= 0 && b <= 0" (loses the 0.5 case).
- Rounding n / 25 down.
- Hard-coding a cutoff without checking it (the tests verify 1 - f(200, 200) < 1e-5).
- Using a 2D array of size n x n for big n.

Full JavaScript solution with tests: [09_soup_servings.js](../solutions/09_soup_servings.js). Run it with `node 09_soup_servings.js` from the solutions folder.

</details>

## Related follow-ups

- New 21 Game (LeetCode 837)
- Knight Probability in Chessboard (LeetCode 688)
- Airplane Seat Assignment Probability (LeetCode 1227)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
