# Koko Eating Bananas

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | search on answer |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #875 — https://leetcode.com/problems/koko-eating-bananas/ |
| **Solution file** | [12_koko_eating_bananas.js](../solutions/12_koko_eating_bananas.js) — open only after a real attempt |

## Problem

There are n piles of bananas, piles[i] bananas each. Koko eats at speed k bananas
per hour: each hour she picks a pile and eats k from it (if the pile has fewer, she
finishes it and does not continue to another pile that hour). Find the MINIMUM
integer k so she can eat everything within h hours.

## Examples

```
Input: piles = [3,6,7,11], h = 8    Output: 4
Input: piles = [30,11,23,4,20], h = 5    Output: 30
Input: piles = [30,11,23,4,20], h = 6    Output: 23
```

## Constraints & clarifying questions

```
- h >= piles.length (always possible, since at worst one pile per hour)
- piles[i] up to 10^9 -> answer range is 1..max(piles)
- Hours per pile = ceil(piles[i] / k)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *search on answer* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * max(piles)). Try k = 1, 2, 3, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search on the answer)   O(n log max(piles)) time, O(1) space. Predicate canFinish(k) = sum(ceil(pile / k)) &lt;= h.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one pile: ceil(pile / h)
- h === piles.length -> must be max(piles)
- huge h -> answer 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * max(piles))

```
Try k = 1, 2, 3, ... and return the first speed whose total hours <= h.
```

### APPROACH 2 — Optimal (binary search on the answer)   O(n log max(piles)) time, O(1) space

```
Predicate canFinish(k) = sum(ceil(pile / k)) <= h. It is monotonic: a faster speed
never needs more hours, so it looks like F F F T T T over k = 1..max. Find the first T.
lo = 1, hi = max(piles) (at speed max, every pile takes 1 hour, so hi is always feasible).

Dry run piles=[3,6,7,11], h=8:
  lo=1 hi=11 mid=6: hours = 1+1+2+2 = 6 <= 8 -> hi=6
  lo=1 hi=6  mid=3: hours = 1+2+3+4 = 10 > 8 -> lo=4
  lo=4 hi=6  mid=5: hours = 1+2+2+3 = 8 <= 8 -> hi=5
  lo=4 hi=5  mid=4: hours = 1+2+2+3 = 8 <= 8 -> hi=4
  lo === hi === 4 -> 4
```

### Edge cases

```
- one pile: ceil(pile / h)
- h === piles.length -> must be max(piles)
- huge h -> answer 1
```

Full JavaScript solution with tests: [12_koko_eating_bananas.js](../solutions/12_koko_eating_bananas.js). Run it with `node 12_koko_eating_bananas.js` from the solutions folder.

</details>

## Common mistakes

- Using `pile / k` without rounding up; each pile takes `Math.ceil(pile / k)` hours.
- Starting the search at 0, which divides by zero; the lower bound is 1.
- Searching the piles array instead of the range of speeds.

## Related follow-ups

- [Capacity To Ship Packages Within D Days](13_capacity_to_ship_packages.md) — the same binary search on the answer
- [Split Array Largest Sum](../03_Hard/14_split_array_largest_sum.md) — the hard version
- Minimum Number of Days to Make m Bouquets (LeetCode #1482) — another feasibility search

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
