# Median of Two Sorted Arrays

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Hard |
| **Pattern** | partition search |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #4 — https://leetcode.com/problems/median-of-two-sorted-arrays/ |
| **Solution file** | [16_median_of_two_sorted_arrays.js](../solutions/16_median_of_two_sorted_arrays.js) — open only after a real attempt |

## Problem

Given two sorted arrays of sizes m and n, return the median of the combined sorted
array in O(log(m + n)).

## Examples

```
Input: [1,3], [2]       Output: 2.0    (merged [1,2,3])
Input: [1,2], [3,4]     Output: 2.5    (merged [1,2,3,4], (2+3)/2)
Input: [], [1]          Output: 1.0
```

## Constraints & clarifying questions

```
- Either array may be empty, but not both
- Median of an even count = average of the two middle values
- Values can be negative
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *partition search* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (merge)   O(m + n) time, O(m + n) space. Merge the two arrays like merge sort, then pick the middle element(s).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search the partition of the smaller array)   O(log min(m, n)) time, O(1) space. Think of cutting each array into a left part and a right part so that: - left parts together hold half of all elements: (m + n + 1) / 2 (rounded down) - every element in the left parts &lt;= every element in the right parts If we cut A after i elements, B must be

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one array empty
- all of A smaller than all of B (cut at i = m)
- duplicates across arrays
- sizes 1 and 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (merge)   O(m + n) time, O(m + n) space

```
Merge the two arrays like merge sort, then pick the middle element(s). Simple,
and what you should write first in an interview before attempting the log version.
```

### APPROACH 2 — Optimal (binary search the partition of the smaller array)   O(log min(m, n)) time, O(1) space

```
Think of cutting each array into a left part and a right part so that:
  - left parts together hold half of all elements: (m + n + 1) / 2 (rounded down)
  - every element in the left parts <= every element in the right parts
If we cut A after i elements, B must be cut after j = half - i elements. The second
condition only needs checking at the boundary:
  A[i-1] <= B[j]  and  B[j-1] <= A[i]
Binary search i over [0, m] (A is the SHORTER array so j is never negative):
  A[i-1] > B[j]  -> i is too big  -> hi = i - 1
  B[j-1] > A[i]  -> i is too small -> lo = i + 1
  else found. Median = max(left parts) if odd total, else avg(max(left), min(right)).
Use -Infinity / +Infinity for out-of-range neighbours so empty parts work.

Dry run A=[1,2], B=[3,4]: m=2 n=2 half=2
  lo=0 hi=2 i=1 j=1: A[0]=1 <= B[1]=4 ok; B[0]=3 <= A[1]=2? NO -> i too small -> lo=2
  i=2 j=0: A[1]=2 <= B[0]=3 ok; B[-1]=-Inf <= A[2]=+Inf ok -> found
  maxLeft = max(A[1]=2, B[-1]=-Inf) = 2; minRight = min(A[2]=+Inf, B[0]=3) = 3
  total even -> (2 + 3) / 2 = 2.5
```

### Edge cases

```
- one array empty
- all of A smaller than all of B (cut at i = m)
- duplicates across arrays
- sizes 1 and 1
```

Full JavaScript solution with tests: [16_median_of_two_sorted_arrays.js](../solutions/16_median_of_two_sorted_arrays.js). Run it with `node 16_median_of_two_sorted_arrays.js` from the solutions folder.

</details>

## Common mistakes

- Binary searching the longer array; search the shorter one so the partition of the other is always valid.
- Not using ±Infinity for empty left or right parts at the edges.
- Getting the odd/even total case wrong when computing the median from the partition.

## Related follow-ups

- [Merge Sorted Array](../../../03_Arrays/03_Problems/01_Easy/09_merge_sorted_array.md) — the O(m + n) merge baseline
- [Find Median from Data Stream](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/08_find_median_data_stream.md) — medians online with two heaps
- [Kth Smallest Element in a Sorted Matrix](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/16_kth_smallest_in_sorted_matrix.md) — k-th order statistic across sorted rows

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
