# Shortest Unsorted Continuous Subarray

| | |
|---|---|
| **Topic** | Monotonic Stacks and Queues |
| **Difficulty** | Medium |
| **Pattern** | monotonic stack vs prefix-max/suffix-min |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #581 — https://leetcode.com/problems/shortest-unsorted-continuous-subarray/ |
| **Solution file** | [02_shortest_unsorted_continuous_subarray.js](../solutions/02_shortest_unsorted_continuous_subarray.js) — open only after a real attempt |

## Problem

Find the length of the shortest contiguous subarray such that sorting only that
subarray makes the whole array sorted in non-decreasing order.

## Examples

```
Input: [2,6,4,8,10,9,15]   Output: 5   Explanation: sort [6,4,8,10,9]
Input: [1,2,3,4]           Output: 0
Input: [1]                 Output: 0
```

## Constraints & clarifying questions

```
- Non-decreasing counts as sorted (duplicates allowed)
- n up to 10^4; O(n log n) via sorting is accepted, O(n) is the follow-up
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *monotonic stack vs prefix-max/suffix-min* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort and compare)   O(n log n) time, O(n) space. Sort a copy; the answer spans from the first index where the arrays differ to the last.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Monotonic stack, then O(1)-space prefix-max / suffix-min)   O(n). Stack version: scan left to right with an increasing stack; whenever nums[i] is smaller than the stack top, every popped index is "out of place", so left = min(left, popped).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- already sorted -> 0
- single element -> 0
- duplicates: [1,3,2,2,2] -> 4
- fully reversed -> n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort and compare)   O(n log n) time, O(n) space

```
Sort a copy; the answer spans from the first index where the arrays differ to the last.
```

### APPROACH 2 — Optimal (Monotonic stack, then O(1)-space prefix-max / suffix-min)   O(n)

```
Stack version: scan left to right with an increasing stack; whenever nums[i] is smaller
than the stack top, every popped index is "out of place", so left = min(left, popped).
Mirror with a decreasing stack from the right to get `right`.
O(1)-space version (same idea without a stack): scanning left to right, an element that is
smaller than the running max is misplaced -> right = i. Scanning right to left, an element
larger than the running min is misplaced -> left = i. Answer right - left + 1 (or 0).

Dry run on [2,6,4,8,10,9,15] (O(1)-space version):
  left-to-right (running max):
    i=0: 2 (max 2)   i=1: 6 (max 6)   i=2: 4 < 6 -> right = 2   i=3: 8 (max 8)
    i=4: 10 (max 10) i=5: 9 < 10 -> right = 5   i=6: 15 (max 15)            => right = 5
  right-to-left (running min):
    i=6: 15 (min 15) i=5: 9 (min 9)   i=4: 10 > 9 -> left = 4   i=3: 8 (min 8)
    i=2: 4 (min 4)   i=1: 6 > 4 -> left = 1   i=0: 2 (min 2)                 => left = 1
  answer 5 - 1 + 1 = 5
```

### Edge cases

```
- already sorted -> 0
- single element -> 0
- duplicates: [1,3,2,2,2] -> 4
- fully reversed -> n
```

Full JavaScript solution with tests: [02_shortest_unsorted_continuous_subarray.js](../solutions/02_shortest_unsorted_continuous_subarray.js). Run it with `node 02_shortest_unsorted_continuous_subarray.js` from the solutions folder.

</details>

## Common mistakes

- Returning `end - start` instead of `end - start + 1`.
- Only comparing neighbours, which misses elements that belong much further left or right.
- Not returning 0 for an already sorted array.

## Related follow-ups

- [Sort an Array](../../../11_Sorting/03_Problems/02_Medium/01_sort_an_array.md) (11_Sorting)
- [Next Greater Element I & II](../../../16_Stacks/03_Problems/01_Easy/06_next_greater_element.md) (16_Stacks)
- [Daily Temperatures](../../../16_Stacks/03_Problems/02_Medium/05_daily_temperatures.md) (16_Stacks)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
