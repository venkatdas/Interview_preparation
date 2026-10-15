# Range Minimum Query with updates

| | |
|---|---|
| **Topic** | Segment Tree |
| **Difficulty** | Medium |
| **Pattern** | generic merge (min) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [02_range_minimum_query.js](../solutions/02_range_minimum_query.js) — open only after a real attempt |

## Problem

Given an integer array, answer two kinds of operations, many times, in any order:
  - update(index, value): nums[index] = value
  - minRange(left, right): the smallest value in nums[left..right] (inclusive)

## Examples

```
nums = [5, 2, 8, 6, 3]
  minRange(1, 3) -> 2
  update(1, 9)       nums = [5, 9, 8, 6, 3]
  minRange(1, 3) -> 6
  minRange(0, 4) -> 3
```

## Constraints & clarifying questions

```
- Is the array static (no updates)? -> then a sparse table (../../34_Range_Query_Data_Structures/03_Sparse_Table/)
  gives O(1) queries. Updates are what force us into a segment tree.
- Do we need the index of the minimum or only the value? (value here; index is a small change)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *generic merge (min)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(1) update, O(n) query. Loop from left to right and keep the smallest value seen.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Segment tree with merge = Math.min)   O(log n) both, O(n) space. Exactly the sum tree, but a node stores the MIN of its range and the identity for "nothing here" is +Infinity.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single-element array
- all equal values
- query covering the whole array
- negative values (Infinity identity still works)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(1) update, O(n) query

```
Loop from left to right and keep the smallest value seen.
```

### APPROACH 2 — Optimal (Segment tree with merge = Math.min)   O(log n) both, O(n) space

```
Exactly the sum tree, but a node stores the MIN of its range and the identity for
"nothing here" is +Infinity. This is why we write the tree with a generic merge.

Dry run, nums = [5, 2, 8, 6, 3] (recursive tree, node covers [lo, hi]):
           [0,4] = 2
         /           \
    [0,2] = 2       [3,4] = 3
    /      \         /     \
 [0,1]=2  [2,2]=8  [3,3]=6 [4,4]=3
 /    \
[0]=5 [1]=2
  minRange(1, 3): root partially overlaps -> ask [0,2] and [3,4]
    [0,2] partial -> [0,1] partial -> [0,0] outside (Inf), [1,1] inside (2) -> 2; [2,2] inside (8) -> min 2
    [3,4] partial -> [3,3] inside (6), [4,4] outside (Inf) -> 6
    answer min(2, 6) = 2
  update(1, 9): leaf [1]=9, then [0,1]=min(5,9)=5, [0,2]=min(5,8)=5, root=min(5,3)=3
  minRange(1, 3) -> min(9, 8, 6) = 6
```

### Edge cases

```
- single-element array
- all equal values
- query covering the whole array
- negative values (Infinity identity still works)
```

Full JavaScript solution with tests: [02_range_minimum_query.js](../solutions/02_range_minimum_query.js). Run it with `node 02_range_minimum_query.js` from the solutions folder.

</details>

## Common mistakes

- Using 0 as the identity for min; the identity must be `Infinity` so empty halves never win.
- Reusing a sum segment tree and only renaming the method, but leaving `+` as the merge.
- Reaching for a sparse table even though the array changes; sparse tables cannot handle updates cheaply.

## Related follow-ups

- [Range Sum Query - Mutable](01_range_sum_query_mutable.md)
- [Range Minimum Queries, static (sparse table)](../../../03_Sparse_Table/03_Problems/02_Medium/01_range_min_queries_offline.md)
- [Falling Squares](../03_Hard/03_falling_squares.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
