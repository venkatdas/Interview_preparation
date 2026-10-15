# Range Sum Query - Mutable

| | |
|---|---|
| **Topic** | Segment Tree |
| **Difficulty** | Medium |
| **Pattern** | point update + range sum |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #307 — https://leetcode.com/problems/range-sum-query-mutable/ |
| **Solution file** | [01_range_sum_query_mutable.js](../solutions/01_range_sum_query_mutable.js) — open only after a real attempt |

## Problem

Design a class NumArray that holds an integer array and supports:
  - update(index, val): set nums[index] = val
  - sumRange(left, right): return the sum of nums[left..right] (inclusive)
Both operations are called many times, mixed together.

## Examples

```
nums = [1, 3, 5]
  sumRange(0, 2) -> 9
  update(1, 2)       nums becomes [1, 2, 5]
  sumRange(0, 2) -> 8
```

## Constraints & clarifying questions

```
- How many operations? (up to 3 * 10^4 of each -> O(n) per op is too slow in total)
- Are values negative? (yes, sums can be negative)
- Is the array ever empty? (assume n >= 1)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *point update + range sum* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(1) update, O(n) sumRange, O(n) space. Keep the plain array.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Segment tree)   O(log n) update, O(log n) sumRange, O(n) space. Build a tree where every node stores the sum of a range; the root covers the whole array, leaves cover one element each.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- left === right (single element)
- update to the same value (harmless)
- n not a power of two (the iterative tree handles it without padding)
- negative numbers
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(1) update, O(n) sumRange, O(n) space

```
Keep the plain array. update is a direct write; sumRange loops from left to right.
A prefix-sum array (../../08_Prefix_Sums_And_Difference_Arrays/) flips this: O(1) query but O(n) update,
because every prefix after `index` changes. Neither is good when both ops are frequent.
```

### APPROACH 2 — Optimal (Segment tree)   O(log n) update, O(log n) sumRange, O(n) space

```
Build a tree where every node stores the sum of a range; the root covers the whole
array, leaves cover one element each. A point update rewrites one leaf and the
log n ancestors above it. A range query visits at most ~4 log n nodes: nodes fully
inside [left, right] return their stored sum immediately.

Dry run, nums = [1, 3, 5], iterative tree of size 2n = 6 (leaves at index 3..5):
  tree = [_, 9, 4, 1, 3, 5]      tree[1] = root = tree[2] + tree[3], tree[2] = 3 + 5 ? no:
  building bottom-up: tree[2] = tree[4] + tree[5] = 3 + 5 = 8, tree[1] = tree[2] + tree[3] = 8 + 1 = 9
  -> tree = [_, 9, 8, 1, 3, 5]
  sumRange(0, 2): lo = 3, hi = 6
    lo odd  -> take tree[3] = 1, lo = 4;  hi even -> skip;  lo = 2, hi = 3
    lo even -> skip; hi odd -> take tree[2] = 8;  lo = 1, hi = 1 -> stop. answer 9
  update(1, 2): tree[4] = 2, then tree[2] = 2 + 5 = 7, tree[1] = 7 + 1 = 8
  sumRange(0, 2) -> 8
```

### Edge cases

```
- left === right (single element)
- update to the same value (harmless)
- n not a power of two (the iterative tree handles it without padding)
- negative numbers
```

Full JavaScript solution with tests: [01_range_sum_query_mutable.js](../solutions/01_range_sum_query_mutable.js). Run it with `node 01_range_sum_query_mutable.js` from the solutions folder.

</details>

## Common mistakes

- Treating `update(i, val)` as "add val" instead of "set to val"; with a Fenwick tree you must add `val - nums[i]`.
- Allocating only `2n` nodes for the recursive tree layout; use `4n` (or the iterative bottom-up layout).
- Forgetting to recompute parents after changing a leaf.

## Related follow-ups

- [Range Sum Query - Mutable, Fenwick version](../../../02_Fenwick_Tree/03_Problems/02_Medium/01_range_sum_query_mutable_bit.md)
- [Range Minimum Query with updates](02_range_minimum_query.md)
- Range Sum Query 2D - Mutable (LeetCode #308)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
