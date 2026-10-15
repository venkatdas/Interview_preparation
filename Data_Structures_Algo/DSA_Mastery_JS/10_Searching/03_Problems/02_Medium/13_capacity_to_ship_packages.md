# Capacity To Ship Packages Within D Days

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | search on answer |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1011 — https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/ |
| **Solution file** | [13_capacity_to_ship_packages.js](../solutions/13_capacity_to_ship_packages.js) — open only after a real attempt |

## Problem

Packages must be shipped IN ORDER within `days` days. Each day the ship loads
consecutive packages up to its capacity. Return the minimum capacity that gets
everything shipped on time.

## Examples

```
Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5   Output: 15
  day1: 1,2,3,4,5  day2: 6,7  day3: 8  day4: 9  day5: 10
Input: weights = [3,2,2,4,1,4], days = 3   Output: 6
Input: weights = [1,2,3,1,1], days = 4     Output: 3
```

## Constraints & clarifying questions

```
- Order must be preserved (cannot reorder packages) -> greedy fill is correct
- 1 <= days <= n, so an answer always exists
- Lower bound for capacity: max(weights) (the biggest package must fit)
- Upper bound: sum(weights) (ship everything in one day)
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

**Start simple.** APPROACH 1 — Brute force   O(n * sum). Try every capacity from max(weights) up to sum(weights); for each, simulate the greedy loading and return the first that fits in `days`.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search on the answer)   O(n log sum) time, O(1) space. daysNeeded(capacity): greedily fill each day as much as possible; count days.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- days === n -> max(weights)
- days === 1 -> sum(weights)
- single package
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * sum)

```
Try every capacity from max(weights) up to sum(weights); for each, simulate the
greedy loading and return the first that fits in `days`.
```

### APPROACH 2 — Optimal (binary search on the answer)   O(n log sum) time, O(1) space

```
daysNeeded(capacity): greedily fill each day as much as possible; count days.
It is monotonic (more capacity -> fewer or equal days), so search the first
capacity in [max, sum] with daysNeeded <= days.

Dry run [3,2,2,4,1,4], days 3: lo = 4, hi = 16
  mid=10: days: [3,2,2]=7 +4=11 no -> day2 [4,1,4]=9 -> 2 days <= 3 -> hi=10
  mid=7:  [3,2,2]=7 | [4,1]=5 +4=9 no -> [4] -> 3 days <= 3 -> hi=7
  mid=5:  [3,2]=5 | [2]... +4=6 no -> [4,1]=5 | [4] -> 4 days > 3 -> lo=6
  mid=6:  [3,2]=5 +2=7 no -> [2,4]=6 | [1,4]=5 -> 3 days -> hi=6
  lo === hi === 6 -> 6
```

### Edge cases

```
- days === n -> max(weights)
- days === 1 -> sum(weights)
- single package
```

Full JavaScript solution with tests: [13_capacity_to_ship_packages.js](../solutions/13_capacity_to_ship_packages.js). Run it with `node 13_capacity_to_ship_packages.js` from the solutions folder.

</details>

## Common mistakes

- Starting the low bound at 1 instead of `max(weights)`; a ship must carry the heaviest package.
- Reordering packages; they must ship in the given order.
- Counting days off by one in the greedy check (start with day = 1).

## Related follow-ups

- [Koko Eating Bananas](12_koko_eating_bananas.md) — same template
- [Split Array Largest Sum](../03_Hard/14_split_array_largest_sum.md) — identical structure with k parts
- Magnetic Force Between Two Balls (LeetCode #1552) — maximise the minimum instead

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
