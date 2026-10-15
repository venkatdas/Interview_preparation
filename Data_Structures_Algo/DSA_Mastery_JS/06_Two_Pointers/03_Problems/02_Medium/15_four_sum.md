# 4Sum

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | sort + nested opposite ends |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #18 — https://leetcode.com/problems/4sum/ |
| **Solution file** | [15_four_sum.js](../solutions/15_four_sum.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer target, return all UNIQUE quadruplets
[a, b, c, d] (four distinct indices) such that a + b + c + d === target.

## Examples

```
Input: nums = [1, 0, -1, 0, -2, 2], target = 0
Output: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]
Input: nums = [2, 2, 2, 2, 2], target = 8   Output: [[2, 2, 2, 2]]
```

## Constraints & clarifying questions

```
- Unique by value? (yes) Order? (any)
- Values up to 10^9? (sums fit in JS numbers fine; in other languages watch overflow)
- Generalise to k-Sum? (the recursive version below does)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + nested opposite ends* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^4) time. Four nested loops + a Set to de-duplicate sorted quadruplets.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort + two fixed + two pointers; generalised k-Sum)   O(n^3) time, O(1) extra. Sort.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Fewer than 4 elements -> []
- All equal and 4 copies sum to target -> one quadruplet
- Negative target
- No solution -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^4) time

```
Four nested loops + a Set to de-duplicate sorted quadruplets.
```

### APPROACH 2 — Optimal (sort + two fixed + two pointers; generalised k-Sum)   O(n^3) time, O(1) extra

```
Sort. Fix i, fix j > i, run two pointers on the rest for target - nums[i] - nums[j].
Skip duplicate values at every level (i, j, left, right) so each quadruplet appears once.

The generalised recursion:
  kSum(start, k, target):
    if k === 2 -> two-pointer scan of [start, end]
    else for each i from start: skip dups, recurse kSum(i + 1, k - 1, target - nums[i])
         and prepend nums[i] to every result.
Complexity: O(n^(k-1)) -> 2Sum O(n), 3Sum O(n^2), 4Sum O(n^3).

Dry run on sorted [-2, -1, 0, 0, 1, 2], target 0:
  i=0 (-2): need 3-sum of 2 from [-1,0,0,1,2]
    j=1 (-1): need pair sum 3 from [0,0,1,2]: L=2 R=5 0+2=2<3 L++; 0+2=2 L++; 1+2=3 hit -> [-2,-1,1,2]
    j=2 (0):  need pair 2 from [0,1,2]: 0+2=2 hit -> [-2,0,0,2]; L=4 R=4 stop
    j=3 (0):  duplicate of j=2 -> skip
    j=4 (1):  need pair 1 from [2]: fewer than 2 -> nothing
  i=1 (-1): need 3-sum of 1 from [0,0,1,2]
    j=2 (0): need pair 1 from [0,1,2]: 0+2=2>1 R--; 0+1=1 hit -> [-1,0,0,1]
    ...
  result has 3 quadruplets
```

### Edge cases

```
- Fewer than 4 elements -> []
- All equal and 4 copies sum to target -> one quadruplet
- Negative target
- No solution -> []
```

Full JavaScript solution with tests: [15_four_sum.js](../solutions/15_four_sum.js). Run it with `node 15_four_sum.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to skip duplicates at all four levels.
- Summing four large values can exceed 2^53 in other languages; in JS it is safe for the given limits, but mention it.
- Writing four nested loops instead of two loops plus two pointers.

## Related follow-ups

- [3Sum](13_three_sum.md) — the k = 3 case
- [4Sum II](../../../05_Hashing/03_Problems/02_Medium/14_four_sum_ii.md) — four separate arrays, hashing
- K-Sum generalisation — recursion down to Two Sum II

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
