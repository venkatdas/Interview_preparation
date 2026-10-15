# Partition to K Equal Sum Subsets

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Medium |
| **Pattern** | bitmask DP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #698 — https://leetcode.com/problems/partition-to-k-equal-sum-subsets/ |
| **Solution file** | [11_partition_k_equal_sum_subsets.js](../solutions/11_partition_k_equal_sum_subsets.js) — open only after a real attempt |

## Problem

Can the array be split into k non-empty subsets whose sums are all equal?

## Examples

```
Input: nums = [4,3,2,3,5,2,1], k = 4   Output: true
  Explanation: target 5: (5), (1,4), (2,3), (2,3)
Input: nums = [1,2,3,4], k = 3          Output: false   Explanation: 10 is not divisible by 3
```

## Constraints & clarifying questions

```
- 1 <= k <= n <= 16  (n <= 16 screams "bitmask DP": 2^16 = 65536 states)
- sum % k !== 0 or max(nums) > target -> false immediately.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bitmask DP* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion / backtracking)   O(k^n) time, O(n) space. Assign each number to one of k buckets, recurse, backtrack when a bucket overflows.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Bitmask DP   O(2^n * n) time, O(2^n) space. The idea: fill the buckets ONE AFTER ANOTHER.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> always true
- sum % k !== 0 -> false
- an element larger than target -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion / backtracking)   O(k^n) time, O(n) space

```
Assign each number to one of k buckets, recurse, backtrack when a bucket overflows.
```

### APPROACH 2 — Bitmask DP   O(2^n * n) time, O(2^n) space

```
The idea: fill the buckets ONE AFTER ANOTHER. We never need to know which bucket a
number went into, only WHICH numbers are used so far (a subset = a bitmask) and how
full the current bucket is - and that is determined by the mask: (sum of mask) % target.
```

### DP definition

```
STATE      dp[mask] = true if the numbers in `mask` can be arranged so that every
bucket except possibly the last is exactly full (the last holds
           sumOf(mask) % target).
RECURRENCE dp[mask | (1 &lt;&lt; i)] = true if dp[mask] is true, bit i is not in mask, and
(sumOf(mask) % target) + nums[i] <= target   (fits in the current bucket).
BASE CASES dp[0] = true (nothing used, all buckets empty).
ANSWER     dp[(1 &lt;&lt; n) - 1]  (all numbers used; sum is k * target so all buckets full).
Dry run nums = [2,1,3], k = 2, target 3 (bits: 0 -> 2, 1 -> 1, 2 -> 3):
  mask 000 sum 0 rem 0 : add 2 -> 001 ok, add 1 -> 010 ok, add 3 -> 100 ok
  mask 001 sum 2 rem 2 : add 1 -> 011 (2+1=3 ok), add 3 -> 2+3 > 3 no
  mask 010 sum 1 rem 1 : add 2 -> 011 ok, add 3 -> no
  mask 011 sum 3 rem 0 : add 3 -> 111 ok      -> dp[111] = true -> answer true
```

### Edge cases

```
- k = 1 -> always true
- sum % k !== 0 -> false
- an element larger than target -> false
```

Full JavaScript solution with tests: [11_partition_k_equal_sum_subsets.js](../solutions/11_partition_k_equal_sum_subsets.js). Run it with `node 11_partition_k_equal_sum_subsets.js` from the solutions folder.

</details>

## Common mistakes

- Skipping the quick checks: `sum % k !== 0` or any number larger than `sum / k` means false immediately.
- Memoising on (mask, current bucket) when the mask alone already determines the partial bucket sum (`sum(mask) % target`).
- Trying identical numbers in the same position repeatedly in the backtracking version; sort descending and skip duplicates.

## Related follow-ups

- [Partition Equal Subset Sum](../../../02_Knapsack/03_Problems/02_Medium/03_subset_sum_partition_equal.md)
- Matchsticks to Square (LeetCode #473)
- [Find the Shortest Superstring](../03_Hard/14_shortest_superstring_tsp.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
