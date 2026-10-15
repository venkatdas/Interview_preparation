# Range Minimum Queries, offline / static

| | |
|---|---|
| **Topic** | Sparse Table (Range Minimum Query) |
| **Difficulty** | Medium |
| **Pattern** | sparse table O(1) RMQ |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [01_range_min_queries_offline.js](../solutions/01_range_min_queries_offline.js) — open only after a real attempt |

## Problem

Given a static integer array nums (no updates) and a list of queries [l, r], return
the minimum of nums[l..r] for every query.

## Examples

```
Input: nums = [5, 2, 8, 6, 3, 1, 7], queries = [[0,6],[2,4],[3,3],[1,2]]
Output: [1, 3, 6, 2]
```

## Constraints & clarifying questions

```
- Any updates between queries? (no -> sparse table; yes -> segment tree)
- How many queries vs array size? (q and n both up to 10^5 -> O(n*q) is too slow)
- Inclusive ranges, l <= r
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sparse table O(1) RMQ* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per query, O(n * q) total. Loop from l to r for every query.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Sparse table)   O(n log n) build, O(1) per query, O(n log n) space. table[k][i] = min of the 2^k elements starting at i.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- l === r (k = 0, both blocks are the same element)
- whole array
- n = 1
- negative numbers
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per query, O(n * q) total

```
Loop from l to r for every query.
```

### APPROACH 2 — Optimal (Sparse table)   O(n log n) build, O(1) per query, O(n log n) space

```
table[k][i] = min of the 2^k elements starting at i.
For [l, r] with length len, let k = floor(log2 len). The two blocks of length 2^k that
start at l and end at r cover the whole range (they overlap, which is fine for min).
answer = min(table[k][l], table[k][r - 2^k + 1]).

Dry run: nums = [5, 2, 8, 6, 3, 1, 7]
  table[0] = [5, 2, 8, 6, 3, 1, 7]
  table[1] = [2, 2, 6, 3, 1, 1]            (pairs)
  table[2] = [2, 2, 1, 1]                  (blocks of 4)
  query(2, 4): len 3, k = 1 -> min(table[1][2], table[1][3]) = min(6, 3) = 3
  query(0, 6): len 7, k = 2 -> min(table[2][0], table[2][3]) = min(2, 1) = 1
```

### Edge cases

```
- l === r (k = 0, both blocks are the same element)
- whole array
- n = 1
- negative numbers
```

Full JavaScript solution with tests: [01_range_min_queries_offline.js](../solutions/01_range_min_queries_offline.js). Run it with `node 01_range_min_queries_offline.js` from the solutions folder.

</details>

## Common mistakes

- Using `Math.log2` and `Math.floor` on large lengths, which can round wrong; precompute an integer log table.
- Allocating every level with length n instead of `n - 2^k + 1` and reading `undefined` past the end.
- Using a sparse table for sum and overlapping the two blocks (sum is not idempotent; overlaps get counted twice).

## Related follow-ups

- [Range Minimum Query with updates (segment tree)](../../../01_Segment_Tree/03_Problems/02_Medium/02_range_minimum_query.md)
- [Sliding Window Maximum, sparse table version](../03_Hard/02_sliding_window_maximum_sparse_table.md)
- LCA via Euler tour + RMQ ([Classic Techniques](../../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/README.md))

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
