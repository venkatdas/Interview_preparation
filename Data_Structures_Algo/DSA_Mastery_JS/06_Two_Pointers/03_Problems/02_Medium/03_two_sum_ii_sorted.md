# Two Sum II - Input Array Is Sorted

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | opposite ends |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #167 — https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/ |
| **Solution file** | [03_two_sum_ii_sorted.js](../solutions/03_two_sum_ii_sorted.js) — open only after a real attempt |

## Problem

Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers
that add up to target. Return their 1-based indices [index1, index2] with
index1 < index2. Exactly one solution exists. Use only O(1) extra space.

## Examples

```
Input: numbers = [2, 7, 11, 15], target = 9   Output: [1, 2]
Input: numbers = [2, 3, 4], target = 6        Output: [1, 3]
Input: numbers = [-1, 0], target = -1         Output: [1, 2]
```

## Constraints & clarifying questions

```
- Sorted ascending? (yes; this is THE hint for two pointers)
- 1-based output? (yes, LeetCode quirk)
- O(1) space required? (yes -> rules out the hash map from 05_Hashing)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *opposite ends* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Check every pair.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (opposite-end pointers)   O(n) time, O(1) space. left at the smallest, right at the largest.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Negative numbers (sorted order still holds, the logic is unchanged)
- Duplicates: [1, 1, 3], target 2 -> [1, 2]
- Answer is the two ends
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Check every pair. Ignores the sorted order completely.
```

### APPROACH 2 — Optimal (opposite-end pointers)   O(n) time, O(1) space

```
left at the smallest, right at the largest.
  sum < target  -> we need more; the only way to grow the sum is left++
  sum > target  -> we need less; the only way to shrink the sum is right--
  sum == target -> done
Why this never misses: if sum < target, numbers[left] is too small to pair with
numbers[right] AND with anything to the left of right (those are even smaller).
So numbers[left] can be discarded for good. Symmetric for right.

Dry run on [2, 7, 11, 15], target 9:
  left=0 (2), right=3 (15): 17 > 9 -> right=2
  left=0 (2), right=2 (11): 13 > 9 -> right=1
  left=0 (2), right=1 (7):  9 == 9 -> [1, 2]

(Binary search for the complement is O(n log n) and also O(1) space; two pointers is better.)
```

### Edge cases

```
- Negative numbers (sorted order still holds, the logic is unchanged)
- Duplicates: [1, 1, 3], target 2 -> [1, 2]
- Answer is the two ends
```

Full JavaScript solution with tests: [03_two_sum_ii_sorted.js](../solutions/03_two_sum_ii_sorted.js). Run it with `node 03_two_sum_ii_sorted.js` from the solutions folder.

</details>

## Common mistakes

- Returning 0-based indices when the problem asks for 1-based.
- Using a hash map; it works but ignores the sorted input and uses O(n) space.
- Moving the wrong pointer: if the sum is too small, move left up; if too big, move right down.

## Related follow-ups

- [Two Sum](../../../05_Hashing/03_Problems/01_Easy/01_two_sum.md) — unsorted input needs a map
- [3Sum](13_three_sum.md) — this routine inside a loop
- [Container With Most Water](11_container_with_most_water.md) — another converging-pointer proof

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
