# Maximum Subarray

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Medium |
| **Pattern** | Kadane |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #53 — https://leetcode.com/problems/maximum-subarray/ |
| **Solution file** | [04_maximum_subarray.js](../solutions/04_maximum_subarray.js) — open only after a real attempt |

## Problem

Given an integer array, find the contiguous subarray (at least one element) with
the largest sum and return that sum.

## Examples

```
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]   Output: 6    Explanation: [4, -1, 2, 1]
Input: [1]                               Output: 1
Input: [5, 4, -1, 7, 8]                  Output: 23   Explanation: the whole array
Input: [-3, -1, -2]                      Output: -1   Explanation: must pick at least one element
```

## Constraints & clarifying questions

```
- Can all numbers be negative? (yes -> answer is the largest single element, NOT 0)
- Subarray means contiguous? (yes; "subsequence" would be a different problem)
- Return the sum or the subarray itself? (sum; indices are an easy follow-up)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kadane* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every start index, extend the end index and keep a running sum; track the max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kadane's algorithm)   O(n) time, O(1) space. At each index decide: "extend the best subarray ending at the previous index, or start a new subarray here?" If the previous running sum is negative it only hurts, so start fresh.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All negative -> max element
- Single element
- Zeros mixed in: [0, -1, 0] -> 0
- Empty array (not allowed by the problem; we return 0 defensively)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start index, extend the end index and keep a running sum; track the max.
(The naive triple loop that re-sums each subarray is O(n^3).)
```

### APPROACH 2 — Optimal (Kadane's algorithm)   O(n) time, O(1) space

```
At each index decide: "extend the best subarray ending at the previous index, or
start a new subarray here?" If the previous running sum is negative it only hurts,
so start fresh. currentSum = max(num, currentSum + num). Track the global best.

Dry run on [-2, 1, -3, 4, -1, 2, 1, -5, 4]:
  num -2: current = -2             best = -2
  num  1: current = max(1, -1)=1   best = 1
  num -3: current = max(-3,-2)=-2  best = 1
  num  4: current = max(4, 2)=4    best = 4
  num -1: current = 3              best = 4
  num  2: current = 5              best = 5
  num  1: current = 6              best = 6
  num -5: current = 1              best = 6
  num  4: current = 5              best = 6   -> 6
```

### Edge cases

```
- All negative -> max element
- Single element
- Zeros mixed in: [0, -1, 0] -> 0
- Empty array (not allowed by the problem; we return 0 defensively)
```

Full JavaScript solution with tests: [04_maximum_subarray.js](../solutions/04_maximum_subarray.js). Run it with `node 04_maximum_subarray.js` from the solutions folder.

</details>

## Common mistakes

- Initialising the best sum to 0, which returns 0 for an all-negative array instead of the largest (least negative) element.
- Resetting the running sum to 0 *before* adding the current element, which skips subarrays of length 1 that are negative.
- Confusing subarray (contiguous) with subsequence (any subset of elements).

## Related follow-ups

- [Maximum Product Subarray](14_maximum_product_subarray.md) — Kadane, but track both max and min
- [Best Time to Buy and Sell Stock](../01_Easy/02_best_time_to_buy_and_sell_stock.md) — Kadane on day-to-day differences
- Maximum Sum Circular Subarray (LeetCode #918) — Kadane plus total-minus-minimum trick

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
