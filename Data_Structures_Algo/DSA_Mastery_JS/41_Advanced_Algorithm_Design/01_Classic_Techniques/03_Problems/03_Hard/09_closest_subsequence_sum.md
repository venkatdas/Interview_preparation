# Closest Subsequence Sum

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Hard |
| **Pattern** | meet in the middle |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1755 — https://leetcode.com/problems/closest-subsequence-sum/ |
| **Solution file** | [09_closest_subsequence_sum.js](../solutions/09_closest_subsequence_sum.js) — open only after a real attempt |

## Problem

Given nums (length up to 40) and a goal, choose a subsequence (possibly empty) whose sum
is as close as possible to goal. Return the minimum |sum - goal|.

## Examples

```
Input: nums = [5,-7,3,5], goal = 6      Output: 0   (5 - 7 + 3 + 5 = 6)
Input: nums = [7,-9,15,-2], goal = -5   Output: 1   (7 - 9 - 2 = -4)
Input: nums = [1,2,3], goal = -7        Output: 7   (empty subsequence)
```

## Constraints & clarifying questions

```
- n <= 40: 2^40 subsets is too many, but 2^20 ~ 10^6 is fine -> meet in the middle
- Values up to +-10^7, goal up to +-10^9: sums fit in doubles exactly
- Empty subsequence allowed (sum 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *meet in the middle* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time. Enumerate every subset with a bitmask and track the closest sum.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Meet in the middle)   O(2^(n/2) * n) time, O(2^(n/2)) space. Split nums into two halves A and B.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- goal reachable exactly -> 0 (can stop early)
- all numbers positive with negative goal -> |goal| (empty subsequence)
- n = 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time

```
Enumerate every subset with a bitmask and track the closest sum. Only for n <= ~20.
```

### APPROACH 2 — Optimal (Meet in the middle)   O(2^(n/2) * n) time, O(2^(n/2)) space

```
Split nums into two halves A and B. Enumerate all subset sums of A (2^20 at most) and all
of B. Sort B's sums. For each sum a in A we need b closest to goal - a: binary search
(or two pointers over both sorted lists) finds it in O(log). Total O(2^(n/2) * n/2).

Dry run: nums = [5,-7,3,5], goal = 6
  A = [5,-7] -> sums {0, 5, -7, -2};  B = [3,5] -> sums sorted [0, 3, 5, 8]
  a=0: need 6 -> closest 5 or 8 -> diff 1
  a=5: need 1 -> closest 0 or 3 -> diff 1
  a=-7: need 13 -> closest 8 -> diff 5
  a=-2: need 8 -> exact -> diff 0   => answer 0
```

### Edge cases

```
- goal reachable exactly -> 0 (can stop early)
- all numbers positive with negative goal -> |goal| (empty subsequence)
- n = 1
```

Full JavaScript solution with tests: [09_closest_subsequence_sum.js](../solutions/09_closest_subsequence_sum.js). Run it with `node 09_closest_subsequence_sum.js` from the solutions folder.

</details>

## Common mistakes

- Enumerating all 2^40 subsets; split into two halves of 20 and combine.
- Forgetting the empty subsequence (sum 0) in each half.
- Two-pointer or binary search on unsorted half sums; sort one side first.

## Related follow-ups

- [Partition Array Into Two Arrays to Minimize Sum Difference](10_partition_array_minimize_sum_difference.md)
- 4Sum II (LeetCode #454)
- [Subset Sum / Knapsack](../../../../29_Dynamic_Programming/02_Knapsack/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
