# Range Sum Query - Immutable

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Easy |
| **Pattern** | range query |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #303 — https://leetcode.com/problems/range-sum-query-immutable/ |
| **Solution file** | [02_range_sum_query_immutable.js](../solutions/02_range_sum_query_immutable.js) — open only after a real attempt |

## Problem

Given an integer array nums, implement a class NumArray with
sumRange(left, right) returning the sum of nums[left..right] inclusive.
The array never changes; sumRange is called many times.

## Examples

```
nums = [-2, 0, 3, -5, 2, -1]
sumRange(0, 2) -> 1     sumRange(2, 5) -> -1     sumRange(0, 5) -> -3
```

## Constraints & clarifying questions

```
- Immutable? (yes; if updates were allowed we'd need a Fenwick/segment tree)
- How many queries? (up to 10^4 -> O(n) per query would be 10^9 total in the worst case)
- Inclusive bounds? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *range query* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per query, O(1) extra space. Loop from left to right and add.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix sums)   O(n) build, O(1) per query, O(n) space. prefix[i] = sum of nums[0..i-1], with prefix[0] = 0.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- left === right -> single element
- left = 0 (the leading 0 handles it)
- whole array
- all negative
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per query, O(1) extra space

```
Loop from left to right and add. Fine for one query, slow for thousands.
```

### APPROACH 2 — Optimal (prefix sums)   O(n) build, O(1) per query, O(n) space

```
prefix[i] = sum of nums[0..i-1], with prefix[0] = 0.
sumRange(l, r) = prefix[r + 1] - prefix[l]: total up to r, minus everything before l.

Dry run on [-2, 0, 3, -5, 2, -1]:
  prefix = [0, -2, -2, 1, -4, -2, -3]
  sumRange(2, 5) = prefix[6] - prefix[2] = -3 - (-2) = -1   (3 - 5 + 2 - 1 = -1)
  sumRange(0, 2) = prefix[3] - prefix[0] = 1
```

### Edge cases

```
- left === right -> single element
- left = 0 (the leading 0 handles it)
- whole array
- all negative
```

Full JavaScript solution with tests: [02_range_sum_query_immutable.js](../solutions/02_range_sum_query_immutable.js). Run it with `node 02_range_sum_query_immutable.js` from the solutions folder.

</details>

## Common mistakes

- Building a prefix array of size n and losing the "sum of nothing" slot; size n + 1 with `prefix[0] = 0` removes edge cases.
- Off-by-one in the query: sum(l..r) = prefix[r + 1] - prefix[l].
- Summing the range in each query (O(n) per query).

## Related follow-ups

- [Range Sum Query 2D - Immutable](../02_Medium/11_range_sum_query_2d.md) — the 2D prefix grid
- [Range Sum Query - Mutable](../../../34_Range_Query_Data_Structures/01_Segment_Tree/03_Problems/02_Medium/01_range_sum_query_mutable.md) — updates need a segment or Fenwick tree
- [Running Sum of 1d Array](01_running_sum.md) — the building block

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
