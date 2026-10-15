# Find Minimum in Rotated Sorted Array

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | compare mid with right |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #153 — https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/ |
| **Solution file** | [09_find_minimum_rotated_sorted_array.js](../solutions/09_find_minimum_rotated_sorted_array.js) — open only after a real attempt |

## Problem

A sorted array of distinct integers was rotated 1..n times. Return the minimum
element in O(log n).

## Examples

```
Input: [3,4,5,1,2]       Output: 1
Input: [4,5,6,7,0,1,2]   Output: 0
Input: [11,13,15,17]     Output: 11  (rotated n times = not rotated)
```

## Constraints & clarifying questions

```
- Distinct values? (yes; with duplicates use the shrink trick from problem 08)
- Can the array be not rotated at all? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *compare mid with right* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n). Math.min(...nums) or a single scan.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (compare mid with RIGHT end)   O(log n) time, O(1) space. The minimum is the only element smaller than its left neighbour (the "drop").

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element
- not rotated -> nums[0]
- rotated by 1 ([2,3,4,5,1]) and by n-1 ([5,1,2,3,4])
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n)

```
Math.min(...nums) or a single scan.
```

### APPROACH 2 — Optimal (compare mid with RIGHT end)   O(log n) time, O(1) space

```
The minimum is the only element smaller than its left neighbour (the "drop").
Compare nums[mid] with nums[right]:
  nums[mid] > nums[right] -> the drop is to the RIGHT of mid: left = mid + 1
  nums[mid] < nums[right] -> mid could be the minimum, or the drop is left: right = mid
(Comparing with nums[left] instead does NOT work when the array is not rotated.)
Loop while left < right; nums[left] is the minimum.

Dry run [4,5,6,7,0,1,2]:
  l=0 r=6 mid=3 (7) > nums[6]=2 -> l=4
  l=4 r=6 mid=5 (1) < 2         -> r=5
  l=4 r=5 mid=4 (0) < nums[5]=1 -> r=4
  l === r === 4 -> nums[4] = 0
```

### Edge cases

```
- single element
- not rotated -> nums[0]
- rotated by 1 ([2,3,4,5,1]) and by n-1 ([5,1,2,3,4])
```

Full JavaScript solution with tests: [09_find_minimum_rotated_sorted_array.js](../solutions/09_find_minimum_rotated_sorted_array.js). Run it with `node 09_find_minimum_rotated_sorted_array.js` from the solutions folder.

</details>

## Common mistakes

- Comparing `nums[mid]` with `nums[lo]` instead of `nums[hi]`; the left comparison fails when the array is not rotated.
- Setting `hi = mid - 1` when `nums[mid] < nums[hi]`; mid may be the minimum.
- Forgetting the unrotated array, where the answer is `nums[0]`.

## Related follow-ups

- [Search in Rotated Sorted Array](07_search_rotated_sorted_array.md) — search instead of locate
- Find Minimum in Rotated Sorted Array II (LeetCode #154) — duplicates allowed
- [Find Peak Element](10_find_peak_element.md) — another "which side" binary search

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
