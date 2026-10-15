# Maximum Size Subarray Sum Equals k

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | prefix + hash map (first index) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #325 — https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/ |
| **Solution file** | [06_maximum_size_subarray_sum_equals_k.js](../solutions/06_maximum_size_subarray_sum_equals_k.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return the length of the LONGEST
contiguous subarray whose sum equals k. Return 0 if none exists.

## Examples

```
Input: nums = [1, -1, 5, -2, 3], k = 3   Output: 4   Explanation: [1, -1, 5, -2]
Input: nums = [-2, -1, 2, 1], k = 1      Output: 2   Explanation: [-1, 2]
```

## Constraints & clarifying questions

```
- Negatives? (yes)
- Longest, not count? (longest -> store FIRST index of each prefix, not a count)
- Empty / no match -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix + hash map (first index)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each start, extend right with a running sum; record the length when it hits k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix sum + map of FIRST index)   O(n) time, O(n) space. Subarray (j, i] has sum prefix[i] - prefix[j] = k  ->  prefix[j] = prefix[i] - k.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Whole array -> n (seed handles it)
- k = 0 with repeated prefix values
- Single element equal to k -> 1
- No subarray -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each start, extend right with a running sum; record the length when it hits k.
```

### APPROACH 2 — Optimal (prefix sum + map of FIRST index)   O(n) time, O(n) space

```
Subarray (j, i] has sum prefix[i] - prefix[j] = k  ->  prefix[j] = prefix[i] - k.
For the LONGEST subarray ending at i we want the SMALLEST such j, so store each prefix
value's first occurrence and never overwrite it. Seed {0: -1}: the empty prefix sits
"before index 0", so a subarray starting at 0 has length i - (-1) = i + 1.

Dry run on [1, -1, 5, -2, 3], k = 3:
  map {0:-1}
  i=0 run 1   need -2 no   map {0:-1, 1:0}
  i=1 run 0   need -3 no   0 already in map (keep -1)
  i=2 run 5   need 2  no   map {..., 5:2}
  i=3 run 3   need 0  -> at -1 -> length 3 - (-1) = 4  best 4; map {..., 3:3}
  i=4 run 6   need 3  -> at 3  -> length 1; map {..., 6:4}
  4
```

### Edge cases

```
- Whole array -> n (seed handles it)
- k = 0 with repeated prefix values
- Single element equal to k -> 1
- No subarray -> 0
```

Full JavaScript solution with tests: [06_maximum_size_subarray_sum_equals_k.js](../solutions/06_maximum_size_subarray_sum_equals_k.js). Run it with `node 06_maximum_size_subarray_sum_equals_k.js` from the solutions folder.

</details>

## Common mistakes

- Overwriting the stored index for a repeated prefix sum; keep the *first* index to get the longest subarray.
- Seeding the map with `{0: 0}` instead of `{0: -1}`, which makes lengths off by one.
- Using a sliding window with negative numbers.

## Related follow-ups

- [Subarray Sum Equals K](05_subarray_sum_equals_k.md) — count instead of longest
- [Contiguous Array](07_contiguous_array.md) — the same longest-zero-sum idea
- [Minimum Size Subarray Sum](../../../07_Sliding_Window/03_Problems/02_Medium/05_minimum_size_subarray_sum.md) — shortest, positives only

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
