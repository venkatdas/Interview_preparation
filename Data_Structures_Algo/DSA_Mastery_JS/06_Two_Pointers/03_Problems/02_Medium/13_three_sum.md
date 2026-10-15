# 3Sum

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | sort + opposite ends |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #15 — https://leetcode.com/problems/3sum/ |
| **Solution file** | [13_three_sum.js](../solutions/13_three_sum.js) — open only after a real attempt |

## Problem

Given an integer array nums, return all UNIQUE triplets [a, b, c] (by value) such that
a + b + c === 0, using three different indices.

## Examples

```
Input: [-1, 0, 1, 2, -1, -4]   Output: [[-1, -1, 2], [-1, 0, 1]]
Input: [0, 1, 1]               Output: []
Input: [0, 0, 0]               Output: [[0, 0, 0]]
```

## Constraints & clarifying questions

```
- Unique by VALUE, so [-1,0,1] once even if -1 appears twice? (yes)
- Order of triplets / inside triplets? (any; tests sort them)
- Can I sort the input? (yes, O(n log n) is dwarfed by the O(n^2) main loop)
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

**Start simple.** APPROACH 1 — Brute force   O(n^3) time, O(k) space for de-duplication. Three nested loops, collect triplets that sum to 0, de-duplicate with a Set of sorted keys.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort, fix one, two pointers on the rest)   O(n^2) time, O(1) extra space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Fewer than 3 numbers -> []
- All zeros -> one triplet [0,0,0]
- No solution -> []
- Heavy duplicates: [-2,0,0,2,2] -> [[-2,0,2]] exactly once
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time, O(k) space for de-duplication

```
Three nested loops, collect triplets that sum to 0, de-duplicate with a Set of sorted keys.
```

### APPROACH 2 — Optimal (sort, fix one, two pointers on the rest)   O(n^2) time, O(1) extra space

```
1. Sort.
  2. For each index i (the "fixed" first element):
     - if nums[i] > 0, stop: three positives can't sum to 0.
     - if nums[i] === nums[i - 1], skip: we already produced all triplets starting with this value.
     - run Two Sum II on nums[i+1..] for target -nums[i] with left/right pointers.
     - on a hit, record it, then skip duplicates on BOTH sides before continuing.

Dry run on sorted [-4, -1, -1, 0, 1, 2]:
  i=0 (-4): target 4. L=1(-1) R=5(2): 1 < 4 -> L++... never reaches 4. nothing.
  i=1 (-1): target 1. L=2(-1) R=5(2): 1 == 1 -> record [-1,-1,2]; L=3, R=4
            L=3(0) R=4(1): 1 == 1 -> record [-1,0,1]; L=4 R=3 stop
  i=2 (-1): same as previous -> skip
  i=3 (0):  target 0. L=4(1) R=5(2): 3 > 0 -> R-- -> stop
  i=4 (1):  > 0 -> break
  [[-1,-1,2],[-1,0,1]]
```

### Edge cases

```
- Fewer than 3 numbers -> []
- All zeros -> one triplet [0,0,0]
- No solution -> []
- Heavy duplicates: [-2,0,0,2,2] -> [[-2,0,2]] exactly once
```

Full JavaScript solution with tests: [13_three_sum.js](../solutions/13_three_sum.js). Run it with `node 13_three_sum.js` from the solutions folder.

</details>

## Common mistakes

- Not skipping duplicates for the fixed number and after each match, producing repeated triplets.
- Skipping duplicates of the fixed number by comparing to `nums[i + 1]` instead of `nums[i - 1]`, which misses valid triplets.
- Not breaking early when the fixed number is positive (all later sums are positive).

## Related follow-ups

- [3Sum (Arrays)](../../../03_Arrays/03_Problems/02_Medium/17_3sum.md) — the same problem in the arrays topic
- [3Sum Closest](14_three_sum_closest.md) — closest instead of exact
- [4Sum](15_four_sum.md) — one more level

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
