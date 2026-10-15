# Maximum Average Subarray I

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Easy |
| **Pattern** | fixed window |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #643 — https://leetcode.com/problems/maximum-average-subarray-i/ |
| **Solution file** | [01_maximum_average_subarray.js](../solutions/01_maximum_average_subarray.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, find the contiguous subarray of length
exactly k with the maximum average. Return that average.

## Examples

```
Input: nums = [1, 12, -5, -6, 50, 3], k = 4   Output: 12.75   Explanation: (12 - 5 - 6 + 50) / 4
Input: nums = [5], k = 1                      Output: 5.0
```

## Constraints & clarifying questions

```
- Exactly k, not "at least k"? (exactly)
- 1 <= k <= nums.length? (yes)
- Negatives allowed? (yes; a FIXED window doesn't care, only variable-size windows on sums do)
- Floating point tolerance? (answers within 1e-5 accepted)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fixed window* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * k) time, O(1) space. For every start index, sum the next k elements.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (fixed-size sliding window)   O(n) time, O(1) space. Max average = max sum / k, so track the max window SUM.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k === nums.length -> average of the whole array
- All negative -> still the max (least negative) window
- k = 1 -> max element
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k) time, O(1) space

```
For every start index, sum the next k elements. Recomputes overlapping sums.
```

### APPROACH 2 — Optimal (fixed-size sliding window)   O(n) time, O(1) space

```
Max average = max sum / k, so track the max window SUM.
Sum the first k elements. Then for each new right index, add nums[right] and subtract
nums[right - k] (the element that just left on the left). Keep the best sum.

Dry run on [1, 12, -5, -6, 50, 3], k = 4:
  first window [1,12,-5,-6] sum = 2, best = 2
  right=4: + 50 - 1  -> 51, best 51
  right=5: + 3 - 12  -> 42
  best 51 / 4 = 12.75
```

### Edge cases

```
- k === nums.length -> average of the whole array
- All negative -> still the max (least negative) window
- k = 1 -> max element
```

Full JavaScript solution with tests: [01_maximum_average_subarray.js](../solutions/01_maximum_average_subarray.js). Run it with `node 01_maximum_average_subarray.js` from the solutions folder.

</details>

## Common mistakes

- Recomputing each window sum from scratch (O(n·k)).
- Initialising the best value to 0, which is wrong when every number is negative.
- Dividing inside the loop and comparing floating averages; compare sums and divide once at the end.

## Related follow-ups

- [Maximum Sum Subarray of Size K](02_max_sum_subarray_size_k.md) — the same fixed window on sums
- Maximum Average Subarray II (LeetCode #644) — length at least k, needs binary search on the answer
- [Moving Average from Data Stream](../../../17_Queues_And_Deques/03_Problems/01_Easy/06_moving_average.md) — a fixed window over a stream

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
