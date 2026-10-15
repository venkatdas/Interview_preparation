# Median of Two Sorted Arrays

| | |
|---|---|
| **Topic** | Divide and Conquer |
| **Difficulty** | Hard |
| **Pattern** | binary search on the partition |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #4 — https://leetcode.com/problems/median-of-two-sorted-arrays/ |
| **Solution file** | [07_median_of_two_sorted_arrays.js](../solutions/07_median_of_two_sorted_arrays.js) — open only after a real attempt |

## Problem

Given two sorted arrays nums1 (size m) and nums2 (size n), return the median of all
m + n numbers. Required complexity: O(log(m + n)).

## Examples

```
Input: [1,3], [2]      Output: 2.0
Input: [1,2], [3,4]    Output: 2.5
Input: [], [1]         Output: 1.0
```

## Constraints & clarifying questions

```
- One array may be empty, but not both
- Median of an even count = average of the two middle values
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *binary search on the partition* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(m + n) time, O(m + n) space. Merge the two arrays (two pointers) and read the middle element(s).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Binary search on the partition of the shorter array)   O(log(min(m, n))). We want to cut both arrays into a LEFT part and a RIGHT part such that - left parts together hold half of all elements:  i + j = (m + n + 1) / 2 - every left element &lt;= every right element:  A[i-1] &lt;= B[j] and B[j-1] &lt;= A[i] Binary search i (how many of A go l

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one array empty
- all of A smaller than all of B (partition at the edge: i = m)
- duplicates across arrays
- single element total
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m + n) time, O(m + n) space

```
Merge the two arrays (two pointers) and read the middle element(s).
```

### APPROACH 2 — Optimal (Binary search on the partition of the shorter array)   O(log(min(m, n)))

```
We want to cut both arrays into a LEFT part and a RIGHT part such that
  - left parts together hold half of all elements:  i + j = (m + n + 1) / 2
  - every left element <= every right element:  A[i-1] <= B[j] and B[j-1] <= A[i]
Binary search i (how many of A go left) in [0, m]; j is then fixed. If A[i-1] > B[j],
i is too big -> move left; if B[j-1] > A[i], i is too small -> move right.
Once found: maxLeft = max(A[i-1], B[j-1]); minRight = min(A[i], B[j]).
Odd total -> maxLeft; even -> (maxLeft + minRight) / 2. Use +-Infinity for edges.
This is divide & conquer in the "throw away half the search space each step" sense.

Dry run A = [1,2], B = [3,4]: m = n = 2, half = 2
  i = 1, j = 1: A[0]=1 <= B[1]=4 ok; B[0]=3 <= A[1]=2? no -> i too small -> lo = 2
  i = 2, j = 0: A[1]=2 <= B[0]=3 ok; B[-1]=-Inf <= A[2]=+Inf ok -> found
  maxLeft = max(2, -Inf) = 2; minRight = min(+Inf, 3) = 3; even -> 2.5
```

### Edge cases

```
- one array empty
- all of A smaller than all of B (partition at the edge: i = m)
- duplicates across arrays
- single element total
```

Full JavaScript solution with tests: [07_median_of_two_sorted_arrays.js](../solutions/07_median_of_two_sorted_arrays.js). Run it with `node 07_median_of_two_sorted_arrays.js` from the solutions folder.

</details>

## Common mistakes

- Binary searching over the LONGER array - search the shorter one so the other index never goes out of range.
- Forgetting the ±Infinity sentinels when a partition is at the very edge.
- Mixing up odd and even total length when reading the median.

## Related follow-ups

- Kth Smallest Element in Two Sorted Arrays (classic follow-up)
- Find K-th Smallest Pair Distance (LeetCode #719)
- [Searching](../../../10_Searching/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
