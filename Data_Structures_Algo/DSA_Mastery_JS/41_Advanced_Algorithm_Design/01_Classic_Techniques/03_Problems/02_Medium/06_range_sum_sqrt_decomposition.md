# Range Sum with Sqrt Decomposition

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Medium |
| **Pattern** | sqrt decomposition |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #307 — https://leetcode.com/problems/range-sum-query-mutable/ |
| **Solution file** | [06_range_sum_sqrt_decomposition.js](../solutions/06_range_sum_sqrt_decomposition.js) — open only after a real attempt |

## Problem

Support update(index, value) and sumRange(left, right) on an integer array, both called
many times, with a structure simpler than a segment tree.

## Examples

```
nums = [1, 3, 5, 7, 9, 11]
  sumRange(1, 4) -> 24
  update(2, 10)      nums = [1, 3, 10, 7, 9, 11]
  sumRange(1, 4) -> 29
```

## Constraints & clarifying questions

```
- n and the number of operations both around 10^4..10^5 -> O(sqrt n) per op is fine
- Values can be negative
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sqrt decomposition* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(1) update, O(n) query. Plain array with a loop.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Sqrt decomposition)   O(1) update, O(sqrt n) query, O(sqrt n) extra space. Cut the array into blocks of size B = floor(sqrt n) and store each block's sum.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 (block size 1)
- n not a multiple of the block size (last block is short)
- query inside one block
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(1) update, O(n) query

```
Plain array with a loop.
```

### APPROACH 2 — Optimal (Sqrt decomposition)   O(1) update, O(sqrt n) query, O(sqrt n) extra space

```
Cut the array into blocks of size B = floor(sqrt n) and store each block's sum.
  update: change the element and add the delta to its block sum.
  query [l, r]: walk i from l; if i is at a block start and the whole block fits in the
  range, add the block sum and jump B; otherwise add the single element.
At most 2 partial blocks (2B elements) and n/B whole blocks -> O(sqrt n).
Compared to a Fenwick tree (O(log n) both) it is slower but the easiest "better than O(n)"
structure to explain, and it also handles non-invertible ops (min/max) with O(sqrt n) update.

Dry run: nums = [1,3,5,7,9,11], B = 2, blocks = [4, 12, 20]
  sumRange(1, 4): i=1 partial -> 3; i=2 block start, block [2,3] fits -> +12, i=4;
                  i=4 block start but [4,5] does not fit (r=4) -> +9 -> 24
  update(2, 10): delta 5 -> blocks = [4, 17, 20]
  sumRange(1, 4): 3 + 17 + 9 = 29
```

### Edge cases

```
- n = 1 (block size 1)
- n not a multiple of the block size (last block is short)
- query inside one block
```

Full JavaScript solution with tests: [06_range_sum_sqrt_decomposition.js](../solutions/06_range_sum_sqrt_decomposition.js). Run it with `node 06_range_sum_sqrt_decomposition.js` from the solutions folder.

</details>

## Common mistakes

- Updating the value array but forgetting to adjust the block sum by `newValue - oldValue`.
- Using a whole block when it only partially overlaps the query range.
- Choosing a block size that is not about √n, which makes one of the two loops dominate.

## Related follow-ups

- [Range Sum Query - Mutable (segment tree)](../../../../34_Range_Query_Data_Structures/01_Segment_Tree/03_Problems/02_Medium/01_range_sum_query_mutable.md)
- [Range Sum Query - Mutable (Fenwick tree)](../../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/03_Problems/02_Medium/01_range_sum_query_mutable_bit.md)
- Range Sum Query - Immutable (LeetCode #303)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
