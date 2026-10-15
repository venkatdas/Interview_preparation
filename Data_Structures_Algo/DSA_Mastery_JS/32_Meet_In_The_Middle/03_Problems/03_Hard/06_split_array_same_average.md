# Split Array With Same Average

| | |
|---|---|
| **Topic** | Meet in the Middle |
| **Difficulty** | Hard |
| **Pattern** | shift by average, zero-sum subset, hash set |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Hashing](../../../05_Hashing/README.md) |
| **Source** | LeetCode #805 — https://leetcode.com/problems/split-array-with-same-average/ (statement paraphrased) |
| **Solution file** | [06_split_array_same_average.js](../solutions/06_split_array_same_average.js) — open only after a real attempt |

## Problem

Given an integer array `nums`, decide whether every element can be placed into one of two
**non-empty** arrays `A` and `B` so that the average of `A` equals the average of `B`.

## Examples

```
nums=[1,2,3,4,5,6,7,8]   Output: true    ([1,4,5,8] and [2,3,6,7], both 4.5)
nums=[3,1]               Output: false
nums=[5,5,5]             Output: true
```

## Constraints & clarifying questions

```
- 1 <= n <= 30, 0 <= nums[i] <= 1e4
- Both arrays must be non-empty.
- 2^30 subsets is too many; 2^15 per half is fine.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** n ≤ 30 subset question → meet in the middle, but first transform the condition.

</details>

<details><summary>Hint 2</summary>

**Start simple.** If A and B have the same average, what is that average in terms of the whole array?

</details>

<details><summary>Hint 3</summary>

**The key idea.** Both equal `total / n`. Replace each value by `nums[i] * n − total` (multiplying keeps it integral). Now you need a non-empty **proper** subset with sum 0. Find it with meet in the middle: zero-sum subset in either half alone, or left sum `x` plus right sum `−x`.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Don't pair the WHOLE left half with the WHOLE right half — that's the entire array, which leaves B empty. `n = 1` is always false.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n · n) time

Check every non-empty proper mask: `sum * n === total * size`.

### APPROACH 2 — Optimal (meet in the middle + hash set)   O(2^(n/2)) time and space

```
b[i] = nums[i] * n - total          (sum(b) = 0)
leftSums, rightSums = all mask sums of each half
1. any non-empty left mask with sum 0  -> true
2. any non-empty right mask with sum 0 -> true
3. set S = sums of non-empty, NOT-full left masks
   any non-empty right mask with sum s and -s in S -> true
otherwise false
```

Why excluding only the full left is safe: full left + some right subset R with total 0 means the
rest of the right half (non-empty, since R isn't everything) also sums to 0 — step 2 finds it.

Dry run `[3,1]`: total 4, n 2 → b = [2, −2]. Left {2} (full), right {−2} (full). Steps 1–2 fail,
step 3 can't use the full left → false.

### Edge cases

```
- n = 1          -> false
- all equal      -> true (n >= 2)
- [0, 0]         -> true
```

### Common mistakes

- Comparing averages with floating-point division.
- Allowing the whole array as "A" (B empty).

Full JavaScript solution with tests: [06_split_array_same_average.js](../solutions/06_split_array_same_average.js).

</details>

## Related follow-ups

- Solve it with DP over (size, sum) since values are ≤ 1e4 — compare the two approaches
- LeetCode #956 Tallest Billboard (pair-of-sums with a difference state)
- LeetCode #698 Partition to K Equal Sum Subsets

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
