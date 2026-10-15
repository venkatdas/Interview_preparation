# Find First and Last Position of Element in Sorted Array

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | lower + upper bound |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #34 — https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/ |
| **Solution file** | [04_first_and_last_position.js](../solutions/04_first_and_last_position.js) — open only after a real attempt |

## Problem

Given a sorted array (may contain duplicates) and a target, return [first, last]
index of the target, or [-1, -1] if absent. O(log n) required.

## Examples

```
Input: [5,7,7,8,8,10], 8   Output: [3,4]
Input: [5,7,7,8,8,10], 6   Output: [-1,-1]
Input: [], 0               Output: [-1,-1]
```

## Constraints & clarifying questions

```
- Duplicates allowed (that is the whole point)
- Non-decreasing order? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *lower + upper bound* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time. Scan once, remember the first and last index where nums[i] === target.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (lowerBound + upperBound)   O(log n) time, O(1) space. first = lowerBound(target): first index with value >= target.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- target absent (between values, below min, above max)
- whole array equals target -> [0, n-1]
- single occurrence -> [i, i]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time

```
Scan once, remember the first and last index where nums[i] === target.
```

### APPROACH 2 — Optimal (lowerBound + upperBound)   O(log n) time, O(1) space

```
first = lowerBound(target): first index with value >= target.
  If first === n or nums[first] !== target -> not present.
last = upperBound(target) - 1: upperBound is the first index with value > target,
  so the slot before it is the last copy of target.
Two binary searches, each O(log n).

Dry run [5,7,7,8,8,10], target 8:
  lowerBound: l=0 r=6 mid=3 (8 >= 8) r=3; mid=1 (7 < 8) l=2; mid=2 (7 < 8) l=3 -> 3
  upperBound: l=0 r=6 mid=3 (8 <= 8) l=4; mid=5 (10 > 8) r=5; mid=4 (8 <= 8) l=5 -> 5
  answer [3, 5 - 1] = [3, 4]
```

### Edge cases

```
- target absent (between values, below min, above max)
- whole array equals target -> [0, n-1]
- single occurrence -> [i, i]
```

Full JavaScript solution with tests: [04_first_and_last_position.js](../solutions/04_first_and_last_position.js). Run it with `node 04_first_and_last_position.js` from the solutions folder.

</details>

## Common mistakes

- Finding one occurrence and scanning outwards, which is O(n) for an array of equal values.
- Writing two nearly identical searches with a bug in one; use lowerBound(target) and lowerBound(target + 1) - 1.
- Not checking that the lower bound actually holds the target before returning it.

## Related follow-ups

- [Search Insert Position](../01_Easy/02_search_insert_position.md) — the lower bound alone
- [Find K Closest Elements](17_find_k_closest_elements.md) — lower bound then expand
- Count occurrences in a sorted array — upper bound minus lower bound

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
