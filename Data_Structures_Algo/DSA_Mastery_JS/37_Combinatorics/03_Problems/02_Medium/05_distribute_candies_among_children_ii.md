# Distribute Candies Among Children II

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Medium |
| **Pattern** | stars and bars + inclusion–exclusion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #2929 — https://leetcode.com/problems/distribute-candies-among-children-ii/ |
| **Solution file** | [05_distribute_candies_among_children_ii.js](../solutions/05_distribute_candies_among_children_ii.js) — open only after a real attempt |

## Problem

You have `n` identical candies and 3 different children. Count the ways to give out all
the candies so that no child receives more than `limit`.

## Examples

```
Input: n = 5, limit = 2   Output: 3     ((1,2,2), (2,1,2), (2,2,1))
Input: n = 3, limit = 3   Output: 10
Input: n = 7, limit = 2   Output: 0
```

## Constraints & clarifying questions

```
- 1 <= n, limit <= 10^6
- Children are distinct, candies are identical
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Count everything, then subtract the bad cases. Read *Inclusion–exclusion* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Loop over the first two children's counts; the third is forced. O(limit^2) is too slow at 10^6, but fine for checking.

</details>

<details><summary>Hint 3</summary>

**The key idea.** No limit: C(n+2, 2). A child over the limit: hand them limit+1 first, then distribute the rest freely. Inclusion–exclusion: sum_j (-1)^j C(3,j) C(n - j(limit+1) + 2, 2).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** C(x, 2) must be 0 when x < 2, or negative x gives garbage. n > 3*limit -> 0.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(limit^2) time, O(1) space

```
for a in 0..limit, for b in 0..limit: c = n-a-b; count if 0 <= c <= limit
```

### APPROACH 2 — Optimal (stars and bars + inclusion–exclusion)   O(1) time, O(1) space

```
good = C(n+2,2) - 3*C(n-L+2,2) + 3*C(n-2L+2,2) - C(n-3L+2,2),  L = limit+1
```

### Dry run

```
n = 5, limit = 2, L = 3
  j=0: +C(7,2) = 21
  j=1: -3*C(4,2) = -18
  j=2: +3*C(1,2) = 0
  j=3: -C(-2,2) = 0     -> 3
```

### Complexity

- Brute force: O(limit^2) time, O(1) space
- Optimal: O(1) time, O(1) space

### Edge cases

```
- limit >= n -> C(n+2, 2)
- n > 3*limit -> 0
- answer up to ~5e11: fits a JS number exactly
```

### Common mistakes

- Subtracting overlaps once too often (forgetting the + for pairs).
- Letting C(x, 2) return a positive value for negative x ((-2)(-3)/2 = 3!).

Full JavaScript solution with tests: [05_distribute_candies_among_children_ii.js](../solutions/05_distribute_candies_among_children_ii.js). Run it with `node 05_distribute_candies_among_children_ii.js` from the solutions folder.

</details>

## Related follow-ups

- Distribute Candies Among Children I/III (LeetCode #2928)
- Count integer solutions with upper bounds for k variables — 2^k inclusion–exclusion
- Derangements (problem 06) — inclusion–exclusion over fixed points

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
