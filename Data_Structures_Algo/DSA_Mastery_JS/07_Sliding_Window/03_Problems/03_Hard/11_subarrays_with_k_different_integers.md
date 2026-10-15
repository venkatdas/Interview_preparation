# Subarrays with K Different Integers

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Hard |
| **Pattern** | at most K trick |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #992 — https://leetcode.com/problems/subarrays-with-k-different-integers/ |
| **Solution file** | [11_subarrays_with_k_different_integers.js](../solutions/11_subarrays_with_k_different_integers.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return the number of contiguous
subarrays that contain EXACTLY k distinct integers.

## Examples

```
Input: nums = [1, 2, 1, 2, 3], k = 2   Output: 7
  Explanation: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]
Input: nums = [1, 2, 1, 3, 4], k = 3   Output: 3
  Explanation: [1,2,1,3], [2,1,3], [1,3,4]
```

## Constraints & clarifying questions

```
- Count, not list? (count)
- 1 <= k <= n? (yes)
- Values positive ints? (any hashable values work)
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

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(k) space. For every start, extend right with a Set; count windows whose set size === k; break at > k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (the "at most K" trick)   O(n) time, O(k) space. "Exactly k" is NOT monotonic (growing a window can go from k to k+1 distinct, then shrinking can bring it back).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> count of all runs' subarrays
- k > distinct values in nums -> 0
- All same value with k = 1 -> n(n+1)/2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(k) space

```
For every start, extend right with a Set; count windows whose set size === k; break at > k.
```

### APPROACH 2 — Optimal (the "at most K" trick)   O(n) time, O(k) space

```
"Exactly k" is NOT monotonic (growing a window can go from k to k+1 distinct, then
shrinking can bring it back). But "AT MOST k" IS monotonic, and:
    exactly(k) = atMost(k) - atMost(k - 1)
atMost(k): standard longest-valid window. For each right, every subarray that ends at
right and starts in [left, right] is valid -> add (right - left + 1).

Dry run of atMost on [1, 2, 1, 2, 3], k = 2:
  r=0 {1} left 0 -> +1 (total 1)
  r=1 {1,2} -> +2 (3)
  r=2 {1,2} -> +3 (6)
  r=3 {1,2} -> +4 (10)
  r=4 {1:2,2:2,3:1} size 3 -> shrink: drop nums[0]=1 -> {1:1,2:2,3:1} still 3
                                      drop nums[1]=2 -> {1:1,2:1,3:1} still 3
                                      drop nums[2]=1 -> {2:1,3:1} size 2, left=3 -> +2 (12)
  atMost(2) = 12. atMost(1): r=0 +1, r=1 shrink to [1] +1, r=2 +1, r=3 +1, r=4 +1 = 5
  exactly(2) = 12 - 5 = 7
```

### Edge cases

```
- k = 1 -> count of all runs' subarrays
- k > distinct values in nums -> 0
- All same value with k = 1 -> n(n+1)/2
```

Full JavaScript solution with tests: [11_subarrays_with_k_different_integers.js](../solutions/11_subarrays_with_k_different_integers.js). Run it with `node 11_subarrays_with_k_different_integers.js` from the solutions folder.

</details>

## Common mistakes

- Trying a single window for "exactly k"; it cannot decide when to shrink. Use atMost(k) - atMost(k - 1).
- Not deleting a key when its count drops to 0, so distinct counts stay too high.
- Adding 1 per valid window instead of `right - left + 1` (all windows ending at right).

## Related follow-ups

- [Count Number of Nice Subarrays](../02_Medium/13_count_nice_subarrays.md) — exactly k odds, same trick
- [Fruit Into Baskets](../02_Medium/08_fruit_into_baskets.md) — the at-most-2 building block
- Count Complete Subarrays in an Array (LeetCode #2799) — exactly all distinct values

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
