# Constrained Subsequence Sum

| | |
|---|---|
| **Topic** | DP Optimizations (Advanced) |
| **Difficulty** | Hard |
| **Pattern** | monotonic deque over dp (with restart) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1425 — https://leetcode.com/problems/constrained-subsequence-sum/ |
| **Solution file** | [03_constrained_subsequence_sum.js](../solutions/03_constrained_subsequence_sum.js) — open only after a real attempt |
| **Interview frequency** | Occasional in hard rounds at top-tier companies; a well-known deque-DP question. |

## Problem

Given an integer array `nums` and an integer `k`, choose a **non-empty** subsequence such
that any two neighbouring chosen indices `i < j` satisfy `j - i <= k`. Return the largest
possible sum of the chosen elements.

## Examples

```
Input: nums = [10,2,-10,5,20], k = 2     Output: 37   (10, 2, 5, 20)
Input: nums = [-1,-2,-3], k = 1          Output: -1   (must pick at least one)
Input: nums = [10,-2,-10,-5,20], k = 2   Output: 23   (10, -2, -5, 20)
```

## Constraints & clarifying questions

```
- 1 <= k <= n <= 1e5, -1e4 <= nums[i] <= 1e4
- Non-empty? (yes -> all negative gives the max element)
- Is k a bound on the index gap? (yes: j - i <= k)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 40 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "Best subsequence ending at i" DP plus a sliding window maximum. Compare with Jump Game VI.

</details>

<details><summary>Hint 2</summary>

**Start simple.** `dp[i] = nums[i] + max(0, dp[i-k], ..., dp[i-1])`; the answer is `max(dp)`. Why `max(0, ...)`? Because a subsequence may start fresh at i.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The inner max is a window max over the last k dp values: monotonic deque of indices with decreasing dp, exactly like Jump Game VI.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** All-negative input (answer is the max element, not 0), n = 1, k >= n.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force DP   O(n·k) time, O(n) space

```
dp[i] = nums[i] + max(0, max(dp[i-k..i-1]))
answer = max over i of dp[i]
```

### APPROACH 2 — Optimal (monotonic deque)   O(n) time, O(k) space

```
for i in 0..n-1:
  pop front while front < i - k
  dp[i] = nums[i] + max(0, dp[front] if deque non-empty else 0)
  ans = max(ans, dp[i])
  pop back while dp[back] <= dp[i]; push i
```

Dry run on [10,2,-10,5,20], k = 2:

```
i | best in window | dp[i] | deque
0 | none -> 0      | 10    | [0:10]
1 | 10             | 12    | [1:12]
2 | 12             | 2     | [1:12, 2:2]
3 | 12             | 17    | [3:17]
4 | 17             | 37    | [4:37]      answer 37
```

### Complexity

O(n) time (each index in and out of the deque once), O(k) space for the deque (O(n) for dp).

### Edge cases

```
- all negative -> max element (dp[i] = nums[i] since the window max is clamped by 0)
- k >= n       -> any subsequence is allowed: sum of positives, or max element if none
```

### Common mistakes

- Returning `dp[n-1]` instead of `max(dp)` — the subsequence can end anywhere.
- Forgetting the `max(0, ...)` restart, which forces chains to include bad prefixes.

Full JavaScript solution with tests: [03_constrained_subsequence_sum.js](../solutions/03_constrained_subsequence_sum.js). Run it with `node 03_constrained_subsequence_sum.js` from the solutions folder.

</details>

## Related follow-ups

- Jump Game VI (LeetCode 1696) — problem 01 here
- Maximum Subarray (LeetCode 53) — the k = 1, contiguous cousin
- Delivering Boxes from Storage to Ports (LeetCode 1687) — deque DP, hard

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
