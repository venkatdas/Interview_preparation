# Count of Smaller Numbers After Self

| | |
|---|---|
| **Topic** | Fenwick Tree (Binary Indexed Tree) |
| **Difficulty** | Hard |
| **Pattern** | counting BIT over values, sweep right to left |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #315 — https://leetcode.com/problems/count-of-smaller-numbers-after-self/ |
| **Solution file** | [02_count_of_smaller_numbers_after_self.js](../solutions/02_count_of_smaller_numbers_after_self.js) — open only after a real attempt |

## Problem

Given an integer array nums, return an array counts where counts[i] is the number of
elements to the RIGHT of i that are strictly smaller than nums[i].

## Examples

```
Input: [5,2,6,1]   Output: [2,1,1,0]
  right of 5: 2 and 1 are smaller -> 2; right of 2: 1 -> 1; right of 6: 1 -> 1; right of 1: 0
Input: [-1,-1]     Output: [0,0]
```

## Constraints & clarifying questions

```
- n up to 10^5, values in [-10^4, 10^4] -> O(n^2) is too slow; values are small enough
  to index directly, but compression works for any range.
- Strictly smaller (equal values do not count).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting BIT over values, sweep right to left* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) extra space. For each i, loop j > i and count nums[j] &lt; nums[i].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Fenwick tree over values, sweep from the right)   O(n log n). Walk from right to left keeping a Fenwick tree of COUNTS indexed by compressed value.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty array -> []
- all equal -> all zeros
- strictly decreasing -> [n-1, n-2, ..., 0]
- negative numbers (compression handles them)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) extra space

```
For each i, loop j > i and count nums[j] < nums[i].
```

### APPROACH 2 — Optimal (Fenwick tree over values, sweep from the right)   O(n log n)

```
Walk from right to left keeping a Fenwick tree of COUNTS indexed by compressed value.
For nums[i]: counts[i] = prefixSum(rank(nums[i]) - 1) = how many already-seen (to the
right) values are smaller. Then add 1 at rank(nums[i]).

Dry run on [5,2,6,1]: ranks 1->0, 2->1, 5->2, 6->3
  i=3 (1, rank 0): prefixSum(-1) = 0; insert rank 0           tree counts: [1,0,0,0]
  i=2 (6, rank 3): prefixSum(2) = 1; insert rank 3             [1,0,0,1]
  i=1 (2, rank 1): prefixSum(0) = 1; insert rank 1             [1,1,0,1]
  i=0 (5, rank 2): prefixSum(1) = 2; insert rank 2             [1,1,1,1]
  counts = [2,1,1,0]
```

### Edge cases

```
- empty array -> []
- all equal -> all zeros
- strictly decreasing -> [n-1, n-2, ..., 0]
- negative numbers (compression handles them)
```

Full JavaScript solution with tests: [02_count_of_smaller_numbers_after_self.js](../solutions/02_count_of_smaller_numbers_after_self.js). Run it with `node 02_count_of_smaller_numbers_after_self.js` from the solutions folder.

</details>

## Common mistakes

- Scanning left to right; you must scan right to left so the tree holds only elements AFTER the current one.
- Indexing the BIT by raw values that can be negative; compress (or shift) them first.
- Counting `<=` instead of strictly smaller, which wrongly counts duplicates.

## Related follow-ups

- [Reverse Pairs](03_reverse_pairs.md)
- [Count of Range Sum](../../../01_Segment_Tree/03_Problems/03_Hard/06_count_of_range_sum.md)
- [Create Sorted Array through Instructions](04_create_sorted_array_through_instructions.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
