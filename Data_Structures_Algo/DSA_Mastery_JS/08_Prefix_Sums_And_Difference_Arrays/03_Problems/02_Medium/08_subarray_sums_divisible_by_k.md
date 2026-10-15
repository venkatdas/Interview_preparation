# Subarray Sums Divisible by K

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | remainder buckets |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #974 — https://leetcode.com/problems/subarray-sums-divisible-by-k/ |
| **Solution file** | [08_subarray_sums_divisible_by_k.js](../solutions/08_subarray_sums_divisible_by_k.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return the number of non-empty
contiguous subarrays whose sum is divisible by k.

## Examples

```
Input: nums = [4, 5, 0, -2, -3, 1], k = 5   Output: 7
  Explanation: [4,5,0,-2,-3,1], [5], [5,0], [5,0,-2,-3], [0], [0,-2,-3], [-2,-3]
Input: nums = [5], k = 9                    Output: 0
```

## Constraints & clarifying questions

```
- Negatives? (yes -> careful with JS modulo: -3 % 5 === -3)
- k >= 1? (yes)
- Count, not list? (count)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *remainder buckets* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Every (start, end) with a running sum; count when sum % k === 0.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix remainders + counts)   O(n + k) time, O(k) space. (prefix[i] - prefix[j]) is divisible by k  &lt;=>  prefix[i] % k === prefix[j] % k.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single element not divisible -> 0
- All multiples of k -> n(n+1)/2
- k = 1 -> every subarray counts
- Negative running sums
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Every (start, end) with a running sum; count when sum % k === 0.
```

### APPROACH 2 — Optimal (prefix remainders + counts)   O(n + k) time, O(k) space

```
(prefix[i] - prefix[j]) is divisible by k  <=>  prefix[i] % k === prefix[j] % k.
So count how many earlier prefixes had each remainder. For the current remainder r,
every earlier prefix with remainder r closes a valid subarray.
Remainders live in [0, k), so an array of size k works instead of a Map.
Normalise negatives: ((x % k) + k) % k. Seed remainder 0 with 1 (empty prefix).

Dry run on [4, 5, 0, -2, -3, 1], k = 5:
  counts [1,0,0,0,0], running 0, answer 0
  4:  running 4, rem 4  -> +0, counts[4]=1
  5:  running 9, rem 4  -> +1 (1), counts[4]=2
  0:  running 9, rem 4  -> +2 (3), counts[4]=3
  -2: running 7, rem 2  -> +0, counts[2]=1
  -3: running 4, rem 4  -> +3 (6), counts[4]=4
  1:  running 5, rem 0  -> +1 (7), counts[0]=2
  7
```

### Edge cases

```
- Single element not divisible -> 0
- All multiples of k -> n(n+1)/2
- k = 1 -> every subarray counts
- Negative running sums
```

Full JavaScript solution with tests: [08_subarray_sums_divisible_by_k.js](../solutions/08_subarray_sums_divisible_by_k.js). Run it with `node 08_subarray_sums_divisible_by_k.js` from the solutions folder.

</details>

## Common mistakes

- Using `prefix % k` directly; in JavaScript a negative prefix gives a negative remainder. Normalise with `((p % k) + k) % k`.
- Forgetting to seed remainder 0 with count 1.
- Counting pairs with n·(n−1)/2 at the end but also adding on the fly, which double counts.

## Related follow-ups

- [Subarray Sum Equals K](05_subarray_sum_equals_k.md) — exact sum instead of remainder
- Continuous Subarray Sum (LeetCode #523) — divisible by k with length at least 2
- Make Sum Divisible by P (LeetCode #1590) — remove the shortest subarray

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
