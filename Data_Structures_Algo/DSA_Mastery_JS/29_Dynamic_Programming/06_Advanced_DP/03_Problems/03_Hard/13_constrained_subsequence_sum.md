# Constrained Subsequence Sum

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | DP + monotonic deque |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1425 — https://leetcode.com/problems/constrained-subsequence-sum/ |
| **Solution file** | [13_constrained_subsequence_sum.js](../solutions/13_constrained_subsequence_sum.js) — open only after a real attempt |

## Problem

Pick a non-empty subsequence of nums such that any two consecutive picked indices
are at most k apart (j - i <= k). Return the maximum possible sum.

## Examples

```
Input: nums = [10,2,-10,5,20], k = 2   Output: 37   Explanation: 10 + 2 + 5 + 20
Input: nums = [-1,-2,-3], k = 1        Output: -1   Explanation: must pick something
Input: nums = [10,-2,-10,-5,20], k = 2 Output: 23   Explanation: 10 + (-2) + (-5) + 20
```

## Constraints & clarifying questions

```
- 1 <= n, k <= 10^5 -> O(n * k) is too slow, we need O(n) or O(n log n).
- Values may be negative; the subsequence must be non-empty.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DP + monotonic deque* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(k^n) time, O(n) space. best(i) = nums[i] + max(0, best(i-1..i-k)), recomputed every time.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — DP + monotonic deque   O(n) time, O(k) extra space. "max over the last k dp values" is exactly Sliding Window Maximum.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all negative -> the single largest element
- k >= n -> plain "sum of positives, or max element if none positive"
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(k^n) time, O(n) space

```
best(i) = nums[i] + max(0, best(i-1..i-k)), recomputed every time.
```

### APPROACH 2 — 1D DP (Kadane with a window)   O(n * k) time, O(n) space

### APPROACH 3 — DP + monotonic deque   O(n) time, O(k) extra space

```
"max over the last k dp values" is exactly Sliding Window Maximum. Keep a deque of
indices whose dp values are DECREASING from front to back:
  - front = index with the largest dp in the window
  - before using it, pop the front if it is older than i - k
  - after computing dp[i], pop from the back every index with dp <= dp[i] (they can
    never be the max again while i is around), then push i.
Each index enters and leaves the deque once -> O(n) total.

Dry run nums = [10,2,-10,5,20], k = 2:
  i | window max | dp[i]            | deque (indices, front first)
  0 |  (none)    | 10               | [0]
  1 |  10        | 2 + 10 = 12      | [1]            (10 <= 12 popped)
  2 |  12        | -10 + 12 = 2     | [1, 2]
  3 |  12 (i-k=1 still valid) | 5 + 12 = 17 | [3]   (2 and 12 popped)
  4 |  17        | 20 + 17 = 37     | [4]
  answer = 37
```

### DP definition

```
STATE      dp[i] = max sum of a valid subsequence that ENDS at index i.
RECURRENCE dp[i] = nums[i] + max(0, max(dp[i-k .. i-1]))
("start fresh" if every reachable previous dp is negative - that is Kadane)
BASE CASES dp[0] = nums[0].
ANSWER     max of all dp[i].
The inner max over a window of size k is the O(k) part we want to kill.
```

### Edge cases

```
- all negative -> the single largest element
- k >= n -> plain "sum of positives, or max element if none positive"
```

Full JavaScript solution with tests: [13_constrained_subsequence_sum.js](../solutions/13_constrained_subsequence_sum.js). Run it with `node 13_constrained_subsequence_sum.js` from the solutions folder.

</details>

## Common mistakes

- Taking `max(0, best in window)` as the extension but forgetting that the subsequence must be non-empty (all-negative input → the largest element).
- Keeping indices in the deque that are more than k behind.
- Scanning the last k values for every i (O(n·k)) instead of keeping a monotonic deque of dp values.

## Related follow-ups

- [Sliding Window Maximum](../../../../18_Monotonic_Stacks_And_Queues/README.md)
- [Maximum Subarray](../../../01_One_Dimensional_DP/03_Problems/02_Medium/08_maximum_subarray.md)
- Jump Game VI (LeetCode #1696)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
