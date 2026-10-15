# Ways to Split Array Into Three Subarrays

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Hard |
| **Pattern** | prefix + binary search |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1712 — https://leetcode.com/problems/ways-to-split-array-into-three-subarrays/ |
| **Solution file** | [14_ways_to_split_array.js](../solutions/14_ways_to_split_array.js) — open only after a real attempt |

## Problem

Given an array of NON-NEGATIVE integers nums, count the ways to split it into three
non-empty contiguous parts left | mid | right such that
sum(left) <= sum(mid) <= sum(right). Return the count modulo 10^9 + 7.

## Examples

```
Input: [1, 1, 1]        Output: 1   Explanation: [1] [1] [1]
Input: [1, 2, 2, 2, 5, 0]   Output: 3   Explanation: [1]|[2]|[2,2,5,0], [1]|[2,2]|[2,5,0], [1,2]|[2,2]|[5,0]
Input: [3, 2, 1]        Output: 0
```

## Constraints & clarifying questions

```
- Non-negative? (YES: that makes prefix sums monotonic, which enables binary search)
- All three parts non-empty? (yes)
- n up to 10^5 -> O(n^2) = 10^10 is too slow; need O(n log n) or O(n)

Setup: prefix[i] = sum of nums[0..i-1]. A split is a pair of cut points (i, j) with
  left  = nums[0..i-1]   sum prefix[i]
  mid   = nums[i..j-1]   sum prefix[j] - prefix[i]
  right = nums[j..n-1]   sum total - prefix[j]
and 1 <= i < j <= n - 1.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix + binary search* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n) space. For every i, try every j and check the two inequalities with prefix sums.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix sums + binary search for the j range)   O(n log n) time, O(n) space. Fix the first cut i (left sum L = prefix[i]).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Fewer than 3 elements -> 0
- All zeros -> every (i, j) pair works: C(n-1, 2)
- Decreasing values -> 0
- Big counts -> apply the modulo
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
For every i, try every j and check the two inequalities with prefix sums.
```

### APPROACH 2 — Optimal (prefix sums + binary search for the j range)   O(n log n) time, O(n) space

```
Fix the first cut i (left sum L = prefix[i]). Which j work?
  sum(mid) >= L         <=>  prefix[j] >= 2L                         -> j >= some lowest jMin
  sum(mid) <= sum(right) <=>  prefix[j] - L <= total - prefix[j]
                         <=>  prefix[j] <= (total + L) / 2             -> j <= some highest jMax
Because prefix is non-decreasing, both bounds are found by binary search
(first index with prefix >= 2L; last index with prefix <= (total + L) / 2).
Also j must be in [i + 1, n - 1]. Count max(0, jMax - jMin + 1) for each i.
(Two moving pointers also work in O(n): both bounds only move right as i grows.)

Dry run on [1, 2, 2, 2, 5, 0], prefix = [0, 1, 3, 5, 7, 12, 12], total 12:
  i=1 L=1: need prefix[j] >= 2 -> jMin = 2; prefix[j] <= 6.5 -> jMax = 3; j in [2,3] -> 2 ways
  i=2 L=3: need prefix[j] >= 6 -> jMin = 4; prefix[j] <= 7.5 -> jMax = 4; j in [4,4] -> 1 way
  i=3 L=5: need prefix[j] >= 10 -> jMin = 5; prefix[j] <= 8.5 -> jMax = 4; empty
  i=4 L=7: prefix[j] >= 14 -> none
  total 3
```

### Edge cases

```
- Fewer than 3 elements -> 0
- All zeros -> every (i, j) pair works: C(n-1, 2)
- Decreasing values -> 0
- Big counts -> apply the modulo
```

Full JavaScript solution with tests: [14_ways_to_split_array.js](../solutions/14_ways_to_split_array.js). Run it with `node 14_ways_to_split_array.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the modulo 10^9 + 7 on the final count.
- Binary-searching the wrong bound: you need the first valid middle end and the last valid middle end.
- Allowing the right part to be empty.

## Related follow-ups

- [Find Pivot Index](../01_Easy/03_find_pivot_index.md) — a single split by prefix sums
- [Split Array Largest Sum](../../../10_Searching/03_Problems/03_Hard/14_split_array_largest_sum.md) — splitting judged by sums with binary search
- Number of Ways to Split Array (LeetCode #2270) — the two-part warm-up

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
