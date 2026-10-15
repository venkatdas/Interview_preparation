# Subarray Sum Equals K

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | prefix + hash map (count) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #560 — https://leetcode.com/problems/subarray-sum-equals-k/ |
| **Solution file** | [05_subarray_sum_equals_k.js](../solutions/05_subarray_sum_equals_k.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return the number of contiguous
subarrays whose sum equals k.

## Examples

```
Input: nums = [1, 1, 1], k = 2       Output: 2
Input: nums = [1, 2, 3], k = 3       Output: 2   Explanation: [1,2] and [3]
Input: nums = [1, -1, 1, -1], k = 0  Output: 4   Explanation: [1,-1] x2, [-1,1], [1,-1,1,-1]
```

## Constraints & clarifying questions

```
- Negatives? (yes -> sliding window is out; prefix sums are in)
- Count, not the subarrays themselves? (count)
- k may be 0 or negative? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix + hash map (count)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (with a prefix array)   O(n^2) time, O(n) space. Build prefix[].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix sum + hash map of counts)   O(n) time, O(n) space. The prefix-sum view: subarray (j, i] has sum prefix[i] - prefix[j].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Whole array sums to k (the {0:1} seed catches it)
- All zeros with k = 0 -> n(n+1)/2
- Empty -> 0
- No match -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (with a prefix array)   O(n^2) time, O(n) space

```
Build prefix[]. For every pair (j < i), check prefix[i] - prefix[j] === k.
Already uses prefix sums to make each check O(1); the pairs are the problem.
```

### APPROACH 2 — Optimal (prefix sum + hash map of counts)   O(n) time, O(n) space

```
The prefix-sum view: subarray (j, i] has sum prefix[i] - prefix[j]. For a fixed i we
want the NUMBER of earlier j with prefix[j] === prefix[i] - k. A map
prefixValue -> count answers that in O(1). We never need the prefix array itself,
just the running value and the map. Seed with {0: 1} for the empty prefix.

Dry run on [1, -1, 1, -1], k = 0:
  map {0:1}, running 0, count 0
  +1 -> running 1,  need 1  -> 0;           map {0:1, 1:1}
  -1 -> running 0,  need 0  -> 1 (count 1); map {0:2, 1:1}
  +1 -> running 1,  need 1  -> 1 (count 2); map {0:2, 1:2}
  -1 -> running 0,  need 0  -> 2 (count 4); map {0:3, 1:2}
  4
```

### Edge cases

```
- Whole array sums to k (the {0:1} seed catches it)
- All zeros with k = 0 -> n(n+1)/2
- Empty -> 0
- No match -> 0
```

Full JavaScript solution with tests: [05_subarray_sum_equals_k.js](../solutions/05_subarray_sum_equals_k.js). Run it with `node 05_subarray_sum_equals_k.js` from the solutions folder.

</details>

## Common mistakes

- Using a sliding window although values can be negative.
- Forgetting to seed the count map with prefix 0 seen once.
- Inserting the current prefix into the map before querying `prefix - k`.

## Related follow-ups

- [Subarray Sum Equals K (Hashing)](../../../05_Hashing/03_Problems/02_Medium/11_subarray_sum_equals_k.md) — the same problem, hashing view
- [Maximum Size Subarray Sum Equals k](06_maximum_size_subarray_sum_equals_k.md) — longest instead of count
- [Subarray Sums Divisible by K](08_subarray_sums_divisible_by_k.md) — remainders instead of sums

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
