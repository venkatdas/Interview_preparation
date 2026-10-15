# Minimum Value to Get Positive Step by Step Sum

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Easy |
| **Pattern** | prefix min |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1413 — https://leetcode.com/problems/minimum-value-to-get-positive-step-by-step-sum/ |
| **Solution file** | [10_minimum_value_positive_step_sum.js](../solutions/10_minimum_value_positive_step_sum.js) — open only after a real attempt |

## Problem

Given an integer array nums, you start with a value startValue and add the elements
one by one left to right. Return the minimum positive startValue such that the running
sum is always >= 1.

## Examples

```
Input: [-3, 2, -3, 4, 2]   Output: 5
  Explanation: with 5: 5, 2, 4, 1, 5, 7 (all >= 1). With 4 the sum would hit 0.
Input: [1, 2]              Output: 1
Input: [1, -2, -3]         Output: 5
```

## Constraints & clarifying questions

```
- Must startValue itself be >= 1? (yes, "minimum positive")
- "Always >= 1" at every step including after the last? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix min* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * answer) time. Try startValue = 1, 2, 3, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix minimum)   O(n) time, O(1) space. The running sum with startValue s is s + prefix[i].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All positive -> 1
- Starts with a big negative
- Prefix dips below zero then recovers (the dip still decides the answer)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * answer) time

```
Try startValue = 1, 2, 3, ... and simulate each until one works.
```

### APPROACH 2 — Optimal (prefix minimum)   O(n) time, O(1) space

```
The running sum with startValue s is s + prefix[i]. It must stay >= 1 at every i, so
s >= 1 - prefix[i] for all i, i.e. s = 1 - min(prefix). If the minimum prefix is already
>= 0, then s = 1 (it must be positive).
We only need the running minimum of the prefix sums, not the array.

Dry run on [-3, 2, -3, 4, 2]:
  running: -3, -1, -4, 0, 2   minimum -4
  answer = max(1, 1 - (-4)) = 5
```

### Edge cases

```
- All positive -> 1
- Starts with a big negative
- Prefix dips below zero then recovers (the dip still decides the answer)
```

Full JavaScript solution with tests: [10_minimum_value_positive_step_sum.js](../solutions/10_minimum_value_positive_step_sum.js). Run it with `node 10_minimum_value_positive_step_sum.js` from the solutions folder.

</details>

## Common mistakes

- Returning `-minPrefix` instead of `1 - minPrefix` (the running sum must stay at least 1).
- Returning 0 or a negative value when every prefix is positive; the answer is at least 1.
- Simulating every start value one by one (slow).

## Related follow-ups

- [Running Sum of 1d Array](01_running_sum.md) — the prefix sums used here
- [Gas Station](../../../28_Greedy_Algorithms/03_Problems/02_Medium/07_gas_station.md) — a running balance that must not go negative
- [Best Time to Buy and Sell Stock](../../../03_Arrays/03_Problems/01_Easy/02_best_time_to_buy_and_sell_stock.md) — running minimum

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
