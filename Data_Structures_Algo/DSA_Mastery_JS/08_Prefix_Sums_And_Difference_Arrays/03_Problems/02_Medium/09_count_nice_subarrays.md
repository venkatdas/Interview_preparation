# Count Number of Nice Subarrays

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | transform + prefix count |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1248 — https://leetcode.com/problems/count-number-of-nice-subarrays/ |
| **Solution file** | [09_count_nice_subarrays.js](../solutions/09_count_nice_subarrays.js) — open only after a real attempt |

## Problem

A subarray is "nice" if it contains exactly k odd numbers. Return the number of nice
contiguous subarrays.

## Examples

```
Input: nums = [1, 1, 2, 1, 1], k = 3   Output: 2
Input: nums = [2, 4, 6], k = 1         Output: 0
Input: nums = [2, 2, 2, 1, 2, 2, 1, 2, 2, 2], k = 2   Output: 16
```

## Constraints & clarifying questions

```
- Exactly k? (yes)
- 1 <= k <= n? (yes)
- Positive integers? (yes; only parity matters)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *transform + prefix count* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each start, extend right counting odds; count when === k, break when > k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (transform to 0/1, then "subarray sum equals k")   O(n) time, O(n) space. Prefix-sum view (07_Sliding_Window solves it with the "at most k" window trick): replace each number by 1 if odd, 0 if even.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- No odd numbers -> 0
- All odd, k = 1 -> n
- k larger than total odds -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each start, extend right counting odds; count when === k, break when > k.
```

### APPROACH 2 — Optimal (transform to 0/1, then "subarray sum equals k")   O(n) time, O(n) space

```
Prefix-sum view (07_Sliding_Window solves it with the "at most k" window trick):
replace each number by 1 if odd, 0 if even. "Exactly k odds" = "subarray sum equals k".
That is problem 05 (Subarray Sum Equals K) verbatim: running count of odds, map of
prefix counts, add map[running - k] at each step.
Since the prefix count only goes up to n, an array of size n + 1 can replace the Map.

Dry run on [1, 1, 2, 1, 1], k = 3 (parities 1,1,0,1,1):
  counts[0]=1, running 0
  1: running 1, need -2 -> 0; counts[1]=1
  1: running 2, need -1 -> 0; counts[2]=1
  0: running 2, need -1 -> 0; counts[2]=2
  1: running 3, need 0  -> 1; counts[3]=1
  1: running 4, need 1  -> 1; counts[4]=1
  2
```

### Edge cases

```
- No odd numbers -> 0
- All odd, k = 1 -> n
- k larger than total odds -> 0
```

Full JavaScript solution with tests: [09_count_nice_subarrays.js](../solutions/09_count_nice_subarrays.js). Run it with `node 09_count_nice_subarrays.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to map each number to 1 (odd) or 0 (even) before applying prefix sums.
- Missing the seed `{0: 1}` in the prefix-count map.
- Counting "at most k" and reporting it as "exactly k".

## Related follow-ups

- [Count Number of Nice Subarrays (Sliding Window)](../../../07_Sliding_Window/03_Problems/02_Medium/13_count_nice_subarrays.md) — the atMost(k) - atMost(k-1) approach
- [Subarray Sum Equals K](05_subarray_sum_equals_k.md) — the same counting with general values
- Binary Subarrays With Sum (LeetCode #930) — identical structure

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
