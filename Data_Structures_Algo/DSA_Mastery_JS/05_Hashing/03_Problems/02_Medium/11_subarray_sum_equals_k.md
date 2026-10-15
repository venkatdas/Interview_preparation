# Subarray Sum Equals K

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Medium |
| **Pattern** | prefix sum + hash |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #560 — https://leetcode.com/problems/subarray-sum-equals-k/ |
| **Solution file** | [11_subarray_sum_equals_k.js](../solutions/11_subarray_sum_equals_k.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return the number of contiguous
subarrays whose elements sum to k.

## Examples

```
Input: nums = [1, 1, 1], k = 2      Output: 2   Explanation: [1,1] at 0-1 and at 1-2
Input: nums = [1, 2, 3], k = 3      Output: 2   Explanation: [1,2] and [3]
Input: nums = [1, -1, 0], k = 0     Output: 3   Explanation: [1,-1], [0], [1,-1,0]
```

## Constraints & clarifying questions

```
- Negative numbers? (yes -> sliding window does NOT work, because adding an element
  can make the sum go down. That is exactly why we need prefix sums + hashing.)
- Count subarrays, or return them? (count)
- Can k be 0 or negative? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix sum + hash* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every start index, extend the end index and keep a running sum; count when it equals k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix sum + hash map)   O(n) time, O(n) space. Let prefix[i] = sum of nums[0..i].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 with zeros/negatives: [0, 0] -> 3 ([0], [0], [0,0])
- Single element equal to k -> 1
- Empty -> 0
- Whole array sums to k (needs the {0:1} seed)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start index, extend the end index and keep a running sum; count when it
equals k. (The O(n^3) version recomputes the sum each time; don't do that.)
```

### APPROACH 2 — Optimal (prefix sum + hash map)   O(n) time, O(n) space

```
Let prefix[i] = sum of nums[0..i]. The sum of nums[j+1..i] is prefix[i] - prefix[j].
We want prefix[i] - prefix[j] === k, i.e. prefix[j] === prefix[i] - k.
So while walking, keep a map: prefixSum -> how many times it has occurred so far.
At each i, add map.get(runningSum - k) to the answer, then record runningSum.
Seed the map with {0: 1} for the empty prefix (so subarrays starting at index 0 count).

Dry run on [1, 2, 3], k = 3:
  map = {0:1}, sum = 0, count = 0
  1: sum=1, need 1-3=-2 (0 times), map {0:1, 1:1}
  2: sum=3, need 0 -> 1 time, count=1, map {0:1, 1:1, 3:1}
  3: sum=6, need 3 -> 1 time, count=2, map {..., 6:1}
  answer 2
```

### Edge cases

```
- k = 0 with zeros/negatives: [0, 0] -> 3 ([0], [0], [0,0])
- Single element equal to k -> 1
- Empty -> 0
- Whole array sums to k (needs the {0:1} seed)
```

Full JavaScript solution with tests: [11_subarray_sum_equals_k.js](../solutions/11_subarray_sum_equals_k.js). Run it with `node 11_subarray_sum_equals_k.js` from the solutions folder.

</details>

## Common mistakes

- Using a sliding window; it fails because numbers can be negative.
- Forgetting to seed the map with `{0: 1}`, which misses subarrays that start at index 0.
- Adding the current prefix to the map before checking `prefix - k`, which counts empty subarrays when k = 0.

## Related follow-ups

- [Subarray Sum Equals K (Prefix Sums)](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/05_subarray_sum_equals_k.md) — the same problem in the prefix-sum topic
- [Contiguous Array](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/07_contiguous_array.md) — map 0 to -1, then find sum 0
- [Subarray Sums Divisible by K](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/08_subarray_sums_divisible_by_k.md) — prefix remainders

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
