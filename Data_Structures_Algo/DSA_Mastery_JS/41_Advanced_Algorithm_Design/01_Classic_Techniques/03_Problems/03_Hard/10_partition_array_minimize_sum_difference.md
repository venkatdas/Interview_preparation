# Partition Array Into Two Arrays to Minimize Sum Difference

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Hard |
| **Pattern** | meet in the middle, grouped by size |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #2035 — https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/ |
| **Solution file** | [10_partition_array_minimize_sum_difference.js](../solutions/10_partition_array_minimize_sum_difference.js) — open only after a real attempt |

## Problem

nums has 2n elements. Split it into two arrays of EXACTLY n elements each so that the
absolute difference of their sums is as small as possible. Return that difference.

## Examples

```
Input: [3,9,7,3]          Output: 2   ([3,9] and [7,3]: 12 vs 10)
Input: [-36,36]           Output: 72
Input: [2,-1,0,4,-2,-9]   Output: 0   ([2,4,-9] and [-1,0,-2]: -3 vs -3)
```

## Constraints & clarifying questions

```
- n <= 15 (so 2n <= 30): C(30, 15) ~ 1.5 * 10^8 subsets is too many to enumerate directly
- Both parts must have exactly n elements (that is what makes it hard)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *meet in the middle, grouped by size* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(C(2n, n) * n) time. Enumerate every bitmask with exactly n bits set; compute the difference.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Meet in the middle, grouped by subset size)   O(2^n * n) time. Split into left half L and right half R (n each).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 2n = 2 -> |a - b|
- negative numbers (sums go negative, binary search still fine)
- perfect split -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(C(2n, n) * n) time

```
Enumerate every bitmask with exactly n bits set; compute the difference. Fine for 2n <= 16.
```

### APPROACH 2 — Optimal (Meet in the middle, grouped by subset size)   O(2^n * n) time

```
Split into left half L and right half R (n each). For every subset of L record its sum,
grouped by SIZE k (0..n); same for R, with each size group sorted.
We pick k elements from L and n - k from R for the first array. Its sum is a + b; the other
array has total - (a + b). The difference is |total - 2(a + b)|, so we want a + b as close
to total / 2 as possible: for each a in L[k], binary search R[n-k] for the value closest
to total/2 - a.
2^15 subsets per side, each binary search O(log 2^15) -> fast.

Dry run on [3,9,7,3]: n = 2, L = [3,9], R = [7,3], total = 22, target sum 11
  L by size: {0: [0], 1: [3, 9], 2: [12]};  R by size: {0: [0], 1: [3, 7], 2: [10]}
  k=0: a=0, need 11 from R[2]=[10] -> 10 -> diff |22 - 20| = 2
  k=1: a=3, need 8 from R[1]=[3,7] -> 7 -> sum 10 -> diff 2;  a=9, need 2 -> 3 -> sum 12 -> diff 2
  k=2: a=12, need -1 from R[0]=[0] -> 12 -> diff 2
  answer 2
```

### Edge cases

```
- 2n = 2 -> |a - b|
- negative numbers (sums go negative, binary search still fine)
- perfect split -> 0
```

Full JavaScript solution with tests: [10_partition_array_minimize_sum_difference.js](../solutions/10_partition_array_minimize_sum_difference.js). Run it with `node 10_partition_array_minimize_sum_difference.js` from the solutions folder.

</details>

## Common mistakes

- Combining any left subset with any right subset; the sizes must add up to exactly n (k from the left, n - k from the right).
- Using subset-sum DP: values up to 10^7 in magnitude (and negatives) make a DP over sums infeasible.
- Comparing absolute differences with floats; keep sums as integers.

## Related follow-ups

- [Closest Subsequence Sum](09_closest_subsequence_sum.md)
- Last Stone Weight II (LeetCode #1049)
- [Minimum Subset Sum Difference](../../../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/09_minimum_subset_sum_difference.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
