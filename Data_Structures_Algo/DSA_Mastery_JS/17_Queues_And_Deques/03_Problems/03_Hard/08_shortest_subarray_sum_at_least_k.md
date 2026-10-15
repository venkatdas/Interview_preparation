# Shortest Subarray with Sum at Least K

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Hard |
| **Pattern** | monotonic deque on prefix sums |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #862 — https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/ |
| **Solution file** | [08_shortest_subarray_sum_at_least_k.js](../solutions/08_shortest_subarray_sum_at_least_k.js) — open only after a real attempt |

## Problem

Given an integer array nums (may contain NEGATIVES) and an integer k,
return the length of the shortest non-empty contiguous subarray whose sum
is at least k. Return -1 if none exists.

## Examples

```
Input: nums = [1], k = 1             Output: 1
Input: nums = [1,2], k = 4           Output: -1
Input: nums = [2,-1,2], k = 3        Output: 3
Input: nums = [84,-37,32,40,95], k = 167   Output: 3   Explanation: 32+40+95
```

## Constraints & clarifying questions

```
- Negatives allowed? (yes - that's what breaks the simple sliding window:
  growing the window can DECREASE the sum)
- k positive? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *monotonic deque on prefix sums* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (prefix sums, all pairs)   O(n^2) time, O(n) space. prefix[i] = sum of nums[0..i-1].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (monotonic increasing deque of prefix indices)   O(n) time, O(n) space. We want, for each j, the LARGEST i &lt; j with prefix[j] - prefix[i] >= k.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element >= k -> 1
- no valid subarray -> -1
- negatives that make a later, shorter window possible (84,-37,32,40,95)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (prefix sums, all pairs)   O(n^2) time, O(n) space

```
prefix[i] = sum of nums[0..i-1]. Subarray (i, j] has sum prefix[j] - prefix[i].
Try every pair i < j, keep the shortest with sum >= k.
```

### APPROACH 2 — Optimal (monotonic increasing deque of prefix indices)   O(n) time, O(n) space

```
We want, for each j, the LARGEST i < j with prefix[j] - prefix[i] >= k.
Walk j left to right, keeping a deque of candidate start indices i with
prefix values INCREASING from front to back. Two pruning rules:
  (a) while prefix[j] - prefix[front] >= k: record j - front, pop FRONT.
      (front is the earliest start; once it works for this j, any later j
       would give a longer subarray, so we never need front again)
  (b) while prefix[back] >= prefix[j]: pop BACK.
      (j is a later start with a smaller-or-equal prefix: strictly better
       than back for every future end, so back is useless)
  then push j.
Each index enters and leaves the deque once -> O(n).

Dry run on [2,-1,2], k=3:  prefix = [0,2,1,3]
  j=0 p=0   deque [0]
  j=1 p=2   (a) 2-0<3 no ; (b) 0>=2 no ; deque [0,1]
  j=2 p=1   (a) 1-0<3 no ; (b) prefix[1]=2>=1 pop ; deque [0,2]
  j=3 p=3   (a) 3-0>=3 -> length 3, pop front ; 3-1<3 stop ; (b) no ; deque [2,3]
  answer 3
```

### Edge cases

```
- single element >= k -> 1
- no valid subarray -> -1
- negatives that make a later, shorter window possible (84,-37,32,40,95)
```

Full JavaScript solution with tests: [08_shortest_subarray_sum_at_least_k.js](../solutions/08_shortest_subarray_sum_at_least_k.js). Run it with `node 08_shortest_subarray_sum_at_least_k.js` from the solutions folder.

</details>

## Common mistakes

- Using a plain sliding window, which fails with negative numbers.
- Prefix array of length n instead of n + 1 (missing the empty prefix 0).
- Forgetting to pop from the back when a new prefix is ≤ the back (that keeps the deque increasing).

## Related follow-ups

- [Sliding Window Maximum](07_sliding_window_maximum.md)
- Minimum Size Subarray Sum (LeetCode #209)
- Subarray Sum Equals K (LeetCode #560)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
