# Count Number of Nice Subarrays

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | at most K trick |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1248 — https://leetcode.com/problems/count-number-of-nice-subarrays/ |
| **Solution file** | [13_count_nice_subarrays.js](../solutions/13_count_nice_subarrays.js) — open only after a real attempt |

## Problem

A subarray is "nice" if it contains exactly k odd numbers. Return the number of nice
contiguous subarrays.

## Examples

```
Input: nums = [1, 1, 2, 1, 1], k = 3   Output: 2   Explanation: [1,1,2,1] and [1,2,1,1]
Input: nums = [2, 4, 6], k = 1         Output: 0
Input: nums = [2, 2, 2, 1, 2, 2, 1, 2, 2, 2], k = 2   Output: 16
```

## Constraints & clarifying questions

```
- Exactly k, not at least? (exactly)
- Values positive? (yes; only parity matters, so map each to 0/1)
- 1 <= k <= n? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *at most K trick* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each start, extend right counting odds; count when odds === k; break when > k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal ("at most K" trick on a counter)   O(n) time, O(1) space. Treat each number as 1 (odd) or 0 (even).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- No odd numbers -> 0
- All odd, k = 1 -> n
- k larger than the number of odds -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each start, extend right counting odds; count when odds === k; break when > k.
```

### APPROACH 2 — Optimal ("at most K" trick on a counter)   O(n) time, O(1) space

```
Treat each number as 1 (odd) or 0 (even). "Exactly k odds" = atMost(k) - atMost(k - 1),
where atMost(k) counts subarrays with at most k ones using a window:
  expand: odds += nums[right] % 2
  while odds > k: odds -= nums[left] % 2; left++
  total += right - left + 1
(08_Prefix_Sums_And_Difference_Arrays solves the same problem with a prefix count + hash map. Compare them.)

Dry run of atMost on [1, 1, 2, 1, 1], k = 3:
  r=0 odds 1 +1 | r=1 odds 2 +2 | r=2 odds 2 +3 | r=3 odds 3 +4
  r=4 odds 4 > 3 -> drop nums[0]=1 odds 3 left=1 -> +4   total 14
  atMost(2): r=0 +1, r=1 +2, r=2 +3, r=3 odds 3 -> drop 1 (left=1) +3, r=4 odds 3 -> drop 1 (left=2) +3 = 12
  exactly(3) = 14 - 12 = 2
```

### Edge cases

```
- No odd numbers -> 0
- All odd, k = 1 -> n
- k larger than the number of odds -> 0
```

Full JavaScript solution with tests: [13_count_nice_subarrays.js](../solutions/13_count_nice_subarrays.js). Run it with `node 13_count_nice_subarrays.js` from the solutions folder.

</details>

## Common mistakes

- Using a plain "at most k" window and returning it directly; you need atMost(k) - atMost(k - 1) for "exactly k".
- Counting only one subarray per right end instead of `right - left + 1`.
- Forgetting the prefix-count map needs `{0: 1}` if you use the prefix-sum approach.

## Related follow-ups

- [Count Number of Nice Subarrays (Prefix Sums)](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/09_count_nice_subarrays.md) — the prefix-count approach
- [Subarrays with K Different Integers](../03_Hard/11_subarrays_with_k_different_integers.md) — the same exactly-k trick
- Binary Subarrays With Sum (LeetCode #930) — identical shape on 0/1 arrays

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
