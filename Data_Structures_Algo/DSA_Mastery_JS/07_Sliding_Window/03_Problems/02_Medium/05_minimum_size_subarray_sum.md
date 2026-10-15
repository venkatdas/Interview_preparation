# Minimum Size Subarray Sum

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | variable, shortest |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #209 — https://leetcode.com/problems/minimum-size-subarray-sum/ |
| **Solution file** | [05_minimum_size_subarray_sum.js](../solutions/05_minimum_size_subarray_sum.js) — open only after a real attempt |

## Problem

Given an array of POSITIVE integers nums and an integer target, return the minimal
length of a contiguous subarray whose sum is >= target. Return 0 if none exists.

## Examples

```
Input: target = 7, nums = [2, 3, 1, 2, 4, 3]   Output: 2   Explanation: [4, 3]
Input: target = 4, nums = [1, 4, 4]            Output: 1
Input: target = 11, nums = [1, 1, 1, 1, 1]     Output: 0
```

## Constraints & clarifying questions

```
- All positive? (YES, essential: that makes "sum >= target" monotonic in window size)
- "At least target", not "equal to"? (at least)
- Follow-up: O(n log n) with prefix sums + binary search exists, but O(n) window is better here
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *variable, shortest* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every start, extend until the running sum reaches target; record the length.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (variable window, "shortest valid")   O(n) time, O(1) space. expand: windowSum += nums[right] while windowSum >= target:            (valid -> record, then try a smaller window) best = min(best, right - left + 1) windowSum -= nums[left]; left++ Because numbers are positive, removing from the left always decreases the sum

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- No subarray reaches target -> 0
- A single element >= target -> 1
- Whole array needed -> n
- Empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start, extend until the running sum reaches target; record the length.
```

### APPROACH 2 — Optimal (variable window, "shortest valid")   O(n) time, O(1) space

```
expand: windowSum += nums[right]
  while windowSum >= target:            (valid -> record, then try a smaller window)
    best = min(best, right - left + 1)
    windowSum -= nums[left]; left++
Because numbers are positive, removing from the left always decreases the sum, so
once the window is invalid we must expand again. left never moves backward -> O(n).

Dry run on target 7, [2, 3, 1, 2, 4, 3]:
  r=0 sum 2            r=1 sum 5            r=2 sum 6        (all < 7, keep expanding)
  r=3 sum 8  >= 7 -> window [0..3] len 4, best 4; drop 2 -> sum 6, left=1
  r=4 sum 10 >= 7 -> window [1..4] len 4;         drop 3 -> sum 7, left=2
             7 >= 7 -> window [2..4] len 3, best 3; drop 1 -> sum 6, left=3
  r=5 sum 9  >= 7 -> window [3..5] len 3;         drop 2 -> sum 7, left=4
             7 >= 7 -> window [4..5] len 2, best 2; drop 4 -> sum 3, left=5
  best 2
```

### Edge cases

```
- No subarray reaches target -> 0
- A single element >= target -> 1
- Whole array needed -> n
- Empty -> 0
```

Full JavaScript solution with tests: [05_minimum_size_subarray_sum.js](../solutions/05_minimum_size_subarray_sum.js). Run it with `node 05_minimum_size_subarray_sum.js` from the solutions folder.

</details>

## Common mistakes

- Using a sliding window when numbers can be negative; it only works here because all values are positive.
- Returning Infinity instead of 0 when no subarray reaches the target.
- Updating the answer after shrinking instead of before each shrink step.

## Related follow-ups

- [Shortest Subarray with Sum at Least K](../../../17_Queues_And_Deques/03_Problems/03_Hard/08_shortest_subarray_sum_at_least_k.md) — negatives allowed, needs a monotonic deque
- [Subarray Sum Equals K](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/05_subarray_sum_equals_k.md) — exact sum with negatives, prefix sums + map
- [Minimum Window Substring](../03_Hard/14_minimum_window_substring.md) — shortest window that covers a requirement

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
