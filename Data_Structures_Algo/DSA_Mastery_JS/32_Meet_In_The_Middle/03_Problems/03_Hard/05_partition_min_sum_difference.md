# Partition Array Into Two Arrays to Minimize Sum Difference

| | |
|---|---|
| **Topic** | Meet in the Middle |
| **Difficulty** | Hard |
| **Pattern** | sums grouped by subset size + binary search |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Bit Manipulation](../../../14_Bit_Manipulation/README.md) |
| **Source** | LeetCode #2035 — https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/ (statement paraphrased) |
| **Solution file** | [05_partition_min_sum_difference.js](../solutions/05_partition_min_sum_difference.js) — open only after a real attempt |

## Problem

`nums` has exactly `2n` integers. Split it into two arrays of **exactly `n` elements each**.
Return the smallest possible absolute difference between the two arrays' sums.

## Examples

```
nums=[3,9,7,3]          Output: 2   ([3,9] = 12 vs [7,3] = 10)
nums=[-36,36]           Output: 72
nums=[2,-1,0,4,-2,-9]   Output: 0   ([2,4,-9] vs [-1,0,-2], both -3)
```

## Constraints & clarifying questions

```
- 1 <= n <= 15 (so up to 30 numbers), |nums[i]| <= 1e7
- Both groups must have EXACTLY n elements.
- C(30,15) ≈ 1.5e8 splits — too slow to try them all in JS within limits.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** 30 numbers, huge values, a subset-choice problem → meet in the middle. The twist is the fixed group size.

</details>

<details><summary>Hint 2</summary>

**Start simple.** If the first group has sum `S`, the difference is `|total − 2S|`. So you only need `S` as close as possible to `total / 2`.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Split into left and right halves of n each. If the first group takes `k` items from the left, it takes `n − k` from the right. Bucket each half's subset sums by size; for each `k`, combine bucket `k` of the left with the sorted bucket `n − k` of the right using binary search.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** `total / 2` may be fractional or negative — compare with `|total − 2(a + r)|` to stay in integers. Check both neighbours of the insertion point.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(C(2n, n) · n) time

Try every mask with exactly n bits set.

### APPROACH 2 — Optimal (meet in the middle by size + binary search)   O(2^n · n) time, O(2^n) space

```
left  = subsetSumsBySize(first n numbers)
right = subsetSumsBySize(last n numbers), each bucket sorted
for k in 0..n:
    for a in left[k]:
        find r in right[n-k] closest to total/2 - a
        best = min(best, |total - 2(a + r)|)
```

Dry run `[3,9,7,3]` (total 22, aim S ≈ 11):

```
left  [3,9]: size0 [0]  size1 [3,9]  size2 [12]
right [7,3]: size0 [0]  size1 [3,7]  size2 [10]
k=0: 0 + 10 = 10        -> |22 - 20| = 2
k=1: 3 + 7 = 10 -> 2 ;  9 + 3 = 12 -> 2
k=2: 12 + 0 = 12        -> 2
answer 2
```

### Edge cases

```
- n = 1 -> |a - b|
- all equal values -> 0
```

### Common mistakes

- Ignoring the size constraint and searching all right sums — gives groups of the wrong size.
- Integer division of `total / 2` dropping the .5 for odd totals.

Full JavaScript solution with tests: [05_partition_min_sum_difference.js](../solutions/05_partition_min_sum_difference.js).

</details>

## Related follow-ups

- LeetCode #1049 Last Stone Weight II (no size constraint, small values → DP)
- LeetCode #416 Partition Equal Subset Sum
- Split into groups of sizes k and 2n − k (same bucketing)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
