# 3Sum Closest

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | sort + opposite ends |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #16 — https://leetcode.com/problems/3sum-closest/ |
| **Solution file** | [14_three_sum_closest.js](../solutions/14_three_sum_closest.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer target, find three integers whose sum is
closest to target. Return that sum. Exactly one answer is guaranteed.

## Examples

```
Input: nums = [-1, 2, 1, -4], target = 1   Output: 2   Explanation: -1 + 2 + 1 = 2
Input: nums = [0, 0, 0], target = 1        Output: 0
```

## Constraints & clarifying questions

```
- At least 3 numbers? (yes)
- Return the sum, not the triplet? (sum)
- Ties? ("exactly one solution" means no two sums are equally close)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + opposite ends* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^3) time, O(1) space. Try every triplet, track the sum with the smallest |sum - target|.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort + fix one + two pointers)   O(n^2) time, O(1) extra space. Same skeleton as 3Sum.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Exactly 3 numbers -> their sum
- Target far outside the range (e.g. 100) -> the 3 largest
- Negative target
- Exact match -> early return
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time, O(1) space

```
Try every triplet, track the sum with the smallest |sum - target|.
```

### APPROACH 2 — Optimal (sort + fix one + two pointers)   O(n^2) time, O(1) extra space

```
Same skeleton as 3Sum. For each fixed i, move left/right on the rest:
  - compute sum; if |sum - target| beats the best so far, record it.
  - sum < target -> we need a bigger sum -> left++
  - sum > target -> right--
  - sum == target -> can't do better than distance 0, return immediately.
Why no answer is skipped: when sum < target, pairing nums[left] with anything
left of `right` gives an even smaller sum, i.e. farther from target. So nums[left]
is done for this i.

Dry run on sorted [-4, -1, 1, 2], target 1:
  i=0 (-4): L=1(-1) R=3(2): sum -3, dist 4, best -3; -3 < 1 -> L=2
            L=2(1) R=3(2): sum -1, dist 2, best -1; -1 < 1 -> L=3 stop
  i=1 (-1): L=2(1) R=3(2): sum 2, dist 1, best 2; 2 > 1 -> R=2 stop
  i=2: fewer than 2 elements remain -> done. answer 2
```

### Edge cases

```
- Exactly 3 numbers -> their sum
- Target far outside the range (e.g. 100) -> the 3 largest
- Negative target
- Exact match -> early return
```

Full JavaScript solution with tests: [14_three_sum_closest.js](../solutions/14_three_sum_closest.js). Run it with `node 14_three_sum_closest.js` from the solutions folder.

</details>

## Common mistakes

- Initialising the best sum to 0 or Infinity instead of a real triple sum, which can return a sum that does not exist.
- Comparing raw differences instead of absolute differences.
- Not returning immediately on an exact match.

## Related follow-ups

- [3Sum](13_three_sum.md) — exact target zero
- 3Sum Smaller (LeetCode #259) — count triplets below a target
- [Find K Closest Elements](../../../10_Searching/03_Problems/02_Medium/17_find_k_closest_elements.md) — "closest" with binary search

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
