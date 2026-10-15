# Split Array Largest Sum

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Hard |
| **Pattern** | search on answer (minimize max) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #410 — https://leetcode.com/problems/split-array-largest-sum/ |
| **Solution file** | [14_split_array_largest_sum.js](../solutions/14_split_array_largest_sum.js) — open only after a real attempt |

## Problem

Split an array of non-negative integers into k non-empty CONTIGUOUS subarrays so
that the largest subarray sum is as small as possible. Return that minimised
largest sum.

## Examples

```
Input: nums = [7,2,5,10,8], k = 2   Output: 18   ([7,2,5] and [10,8])
Input: nums = [1,2,3,4,5], k = 2    Output: 9    ([1,2,3] and [4,5])
Input: nums = [1,4,4], k = 3        Output: 4
```

## Constraints & clarifying questions

```
- 1 <= k <= n <= 1000, values up to 10^6
- Contiguous (this is what makes it identical in shape to "ship packages")
- "Minimise the maximum" is the classic signal for binary search on the answer
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *search on answer (minimize max)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DP)   O(k * n^2). dp[i][j] = best answer for the first i elements split into j parts: dp[i][j] = min over p &lt; i of max(dp[p][j-1], sum(p..i-1)).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search on the answer)   O(n log sum) time, O(1) space. Guess an upper limit L for a subarray sum.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k === 1 -> sum; k === n -> max
- zeros in the array (pieces can be empty-sum but not empty)
- single element
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DP)   O(k * n^2)

```
dp[i][j] = best answer for the first i elements split into j parts:
  dp[i][j] = min over p < i of max(dp[p][j-1], sum(p..i-1)).
Correct and a fine interview answer, but slower than the search.
```

### APPROACH 2 — Optimal (binary search on the answer)   O(n log sum) time, O(1) space

```
Guess an upper limit L for a subarray sum. Greedily cut: walk the array, start a
new piece whenever adding the next number would exceed L. If the number of pieces
<= k, L is feasible (we can always split pieces further to reach exactly k since
values are non-negative). Feasibility is monotonic in L -> binary search the smallest
feasible L in [max(nums), sum(nums)].

Dry run [7,2,5,10,8], k=2: lo=10 hi=32
  mid=21: [7,2,5]=14 +10=24 no -> [10,8]=18 -> 2 pieces <= 2 -> hi=21
  mid=15: [7,2,5]=14 | [10] +8=18 no -> [8] -> 3 > 2 -> lo=16
  mid=18: [7,2,5]=14 | [10,8]=18 -> 2 -> hi=18
  mid=17: [7,2,5] | [10] | [8] -> 3 -> lo=18
  lo === hi === 18
```

### Edge cases

```
- k === 1 -> sum; k === n -> max
- zeros in the array (pieces can be empty-sum but not empty)
- single element
```

Full JavaScript solution with tests: [14_split_array_largest_sum.js](../solutions/14_split_array_largest_sum.js). Run it with `node 14_split_array_largest_sum.js` from the solutions folder.

</details>

## Common mistakes

- Setting the low bound to 0 instead of `max(nums)`.
- In the feasibility check, counting parts starting from 0 instead of 1.
- Jumping to DP (O(k·n^2)) without mentioning the binary-search-on-answer approach.

## Related follow-ups

- [Capacity To Ship Packages Within D Days](../02_Medium/13_capacity_to_ship_packages.md) — the same problem in disguise
- [Koko Eating Bananas](../02_Medium/12_koko_eating_bananas.md) — search on the answer
- Painter's Partition / Book Allocation — classic names for the same idea

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
