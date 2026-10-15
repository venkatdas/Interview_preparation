# Count of Range Sum

| | |
|---|---|
| **Topic** | Segment Tree |
| **Difficulty** | Hard |
| **Pattern** | prefix sums + counting tree over values |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #327 — https://leetcode.com/problems/count-of-range-sum/ |
| **Solution file** | [06_count_of_range_sum.js](../solutions/06_count_of_range_sum.js) — open only after a real attempt |

## Problem

Given an integer array nums and two integers lower and upper, count how many
subarrays have a sum in the inclusive range [lower, upper].

## Examples

```
Input: nums = [-2,5,-1], lower = -2, upper = 2   Output: 3
  subarrays [-2], [-1], [-2,5,-1] have sums -2, -1, 2
Input: nums = [0], lower = 0, upper = 0   Output: 1
```

## Constraints & clarifying questions

```
- n up to 10^5, values up to +-2^31 -> sums fit in a double exactly (< 2^53)
- Subarrays are contiguous and non-empty
- lower <= upper always
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix sums + counting tree over values* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every start, extend the end and keep a running sum; count when it is in range.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Prefix sums + segment tree counting)   O(n log n) time, O(n) space. Let P[i] = sum of nums[0..i-1], P[0] = 0.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element equal to lower/upper boundary
- all zeros with lower = upper = 0 -> n(n+1)/2
- no subarray in range -> 0
- negative lower/upper
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start, extend the end and keep a running sum; count when it is in range.
```

### APPROACH 2 — Optimal (Prefix sums + segment tree counting)   O(n log n) time, O(n) space

```
Let P[i] = sum of nums[0..i-1], P[0] = 0. The sum of nums[j..i-1] is P[i] - P[j].
For each i we want the number of earlier j with  lower <= P[i] - P[j] <= upper,
i.e.  P[i] - upper <= P[j] <= P[i] - lower.  That is: "how many SEEN prefix sums lie
in a value range?" -- a counting segment tree indexed by VALUE.
1. Compute all prefix sums, sort + dedupe them -> compressed indices.
2. Tree over the compressed values, each leaf counts how many times that prefix sum
   has been inserted so far.
3. Sweep i from 0..n: before inserting P[i], find [lowIdx, highIdx] with binary search
   (first value >= P[i]-upper, last value <= P[i]-lower) and add query(lowIdx, highIdx).
   Then insert P[i].
(The same sweep works with a Fenwick tree - see ../../34_Range_Query_Data_Structures/02_Fenwick_Tree/ - and a
merge-sort variant lives in ../../../30_Divide_And_Conquer/.)

Dry run: nums = [-2,5,-1], lower=-2, upper=2
  P = [0, -2, 3, 2]; sorted unique = [-2, 0, 2, 3]
  i=0 P=0: need P[j] in [0-2, 0+2] = [-2, 2] -> nothing inserted yet -> 0; insert 0
  i=1 P=-2: need [-4, 0] -> inserted {0} -> 1; insert -2
  i=2 P=3: need [1, 5] -> inserted {0,-2} -> 0; insert 3
  i=3 P=2: need [0, 4] -> inserted {0,-2,3} -> 0 and 3 -> 2; total 3
```

### Edge cases

```
- single element equal to lower/upper boundary
- all zeros with lower = upper = 0 -> n(n+1)/2
- no subarray in range -> 0
- negative lower/upper
```

Full JavaScript solution with tests: [06_count_of_range_sum.js](../solutions/06_count_of_range_sum.js). Run it with `node 06_count_of_range_sum.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the empty prefix `prefix[0] = 0`, which misses ranges that start at index 0.
- Counting `prefix[j] - prefix[i]` for i > j as well (order matters: query before inserting the current prefix).
- Overflowing 32-bit thinking: prefix sums reach about 10^10, still safe in JS Numbers but not in Int32Array.

## Related follow-ups

- [Count of Smaller Numbers After Self](../../../02_Fenwick_Tree/03_Problems/03_Hard/02_count_of_smaller_numbers_after_self.md)
- [Reverse Pairs](../../../02_Fenwick_Tree/03_Problems/03_Hard/03_reverse_pairs.md)
- [Count of Range Sum with a sorted list](../../../../35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/03_Problems/03_Hard/05_count_of_range_sum_sorted_list.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
