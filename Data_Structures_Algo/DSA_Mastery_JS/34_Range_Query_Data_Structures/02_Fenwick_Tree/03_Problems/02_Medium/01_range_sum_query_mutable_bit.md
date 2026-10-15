# Range Sum Query - Mutable, Fenwick version

| | |
|---|---|
| **Topic** | Fenwick Tree (Binary Indexed Tree) |
| **Difficulty** | Medium |
| **Pattern** | prefix sums + point updates |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #307 — https://leetcode.com/problems/range-sum-query-mutable/ |
| **Solution file** | [01_range_sum_query_mutable_bit.js](../solutions/01_range_sum_query_mutable_bit.js) — open only after a real attempt |

## Problem

Design NumArray with update(index, val) that sets nums[index] = val and
sumRange(left, right) that returns the sum of nums[left..right] inclusive.
Both are called many times in any order.

## Examples

```
nums = [1, 3, 5]
  sumRange(0, 2) -> 9
  update(1, 2)       nums = [1, 2, 5]
  sumRange(0, 2) -> 8
```

## Constraints & clarifying questions

```
- Up to 3 * 10^4 calls of each kind -> O(n) per call is too slow overall
- Values can be negative (deltas can be negative, which a BIT handles fine)
- update sets a VALUE; a BIT adds a DELTA, so we must remember current values
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix sums + point updates* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(1) update, O(n) sumRange. Keep the plain array and loop for every sumRange.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Fenwick tree)   O(log n) update, O(log n) sumRange, O(n) space. A Fenwick tree stores partial sums so that prefixSum(i) = sum(nums[0..i]) is the sum of O(log n) stored blocks, and a point update touches O(log n) blocks.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- left === right
- updating to the same value (delta 0)
- n = 1
- negative values
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(1) update, O(n) sumRange

```
Keep the plain array and loop for every sumRange.
```

### APPROACH 2 — Optimal (Fenwick tree)   O(log n) update, O(log n) sumRange, O(n) space

```
A Fenwick tree stores partial sums so that prefixSum(i) = sum(nums[0..i]) is the sum of
O(log n) stored blocks, and a point update touches O(log n) blocks.
  sumRange(l, r) = prefixSum(r) - prefixSum(l - 1)
  update(i, val): delta = val - nums[i]; nums[i] = val; bit.add(i, delta)

Dry run, nums = [1, 3, 5], 1-indexed tree slots:
  tree[1] = nums[1..1] = 1, tree[2] = nums[1..2] = 4, tree[3] = nums[3..3] = 5
  sumRange(0, 2) = prefixSum(2) (0-indexed) -> i = 3: +tree[3] = 5, i = 3 - 1 = 2: +tree[2] = 4,
                   i = 2 - 2 = 0 stop -> 9
  update(1, 2): delta = 2 - 3 = -1; i = 2: tree[2] = 3; i = 2 + 2 = 4 > n stop
  sumRange(0, 2) = tree[3] + tree[2] = 5 + 3 = 8
```

### Edge cases

```
- left === right
- updating to the same value (delta 0)
- n = 1
- negative values
```

Full JavaScript solution with tests: [01_range_sum_query_mutable_bit.js](../solutions/01_range_sum_query_mutable_bit.js). Run it with `node 01_range_sum_query_mutable_bit.js` from the solutions folder.

</details>

## Common mistakes

- Calling `bit.update(i, val)` with the new value; a BIT stores deltas, so pass `val - nums[i]` and remember the old value.
- Mixing 0-indexed input with the 1-indexed internal array (an index-0 update with `i += i & -i` loops forever).
- Building with n separate updates (O(n log n)) is fine, but forgetting the O(n) build exists when asked.

## Related follow-ups

- [Range Sum Query - Mutable (segment tree)](../../../01_Segment_Tree/03_Problems/02_Medium/01_range_sum_query_mutable.md)
- Range Sum Query 2D - Mutable (LeetCode #308)
- [Count of Smaller Numbers After Self](../03_Hard/02_count_of_smaller_numbers_after_self.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
