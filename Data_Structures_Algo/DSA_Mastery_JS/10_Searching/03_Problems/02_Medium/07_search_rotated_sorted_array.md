# Search in Rotated Sorted Array

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | rotated, pick the sorted half |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #33 — https://leetcode.com/problems/search-in-rotated-sorted-array/ |
| **Solution file** | [07_search_rotated_sorted_array.js](../solutions/07_search_rotated_sorted_array.js) — open only after a real attempt |

## Problem

A sorted array of DISTINCT integers was rotated at an unknown pivot
([0,1,2,4,5,6,7] -> [4,5,6,7,0,1,2]). Return the index of target, or -1. O(log n).

## Examples

```
Input: [4,5,6,7,0,1,2], 0   Output: 4
Input: [4,5,6,7,0,1,2], 3   Output: -1
Input: [1], 0               Output: -1
```

## Constraints & clarifying questions

```
- Distinct values? (yes; duplicates break the "which half is sorted" test -> problem 08)
- Rotation may be 0 (array fully sorted)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *rotated, pick the sorted half* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n). Linear scan.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (one binary search, pick the sorted half)   O(log n) time, O(1) space. At any mid, at least one of [left..mid] and [mid..right] is sorted: if nums[left] &lt;= nums[mid] -> left half is sorted if nums[left] &lt;= target &lt; nums[mid] -> target is in it: right = mid - 1 else                                -> left = mid + 1 else            

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no rotation (plain sorted)
- rotated by 1 ([5,1,2,3,4]) and by n-1 ([2,3,4,5,1])
- single element; two elements [3,1]
- target is the pivot (the minimum) or the maximum
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n)

```
Linear scan. (Or: find the rotation point in O(log n), then binary search the right
half - two searches; the optimal does it in one.)
```

### APPROACH 2 — Optimal (one binary search, pick the sorted half)   O(log n) time, O(1) space

```
At any mid, at least one of [left..mid] and [mid..right] is sorted:
  if nums[left] <= nums[mid] -> left half is sorted
      if nums[left] <= target < nums[mid] -> target is in it: right = mid - 1
      else                                -> left = mid + 1
  else                       -> right half is sorted
      if nums[mid] < target <= nums[right] -> left = mid + 1
      else                                 -> right = mid - 1
We only ever trust the range check on the SORTED half, which is why it is safe.

Dry run [4,5,6,7,0,1,2], target 0:
  l=0 r=6 mid=3 (7): nums[0]=4 <= 7 -> left half sorted; 4 <= 0 < 7? no -> l=4
  l=4 r=6 mid=5 (1): nums[4]=0 <= 1 -> left half sorted; 0 <= 0 < 1? yes -> r=4
  l=4 r=4 mid=4 (0) === target -> 4
```

### Edge cases

```
- no rotation (plain sorted)
- rotated by 1 ([5,1,2,3,4]) and by n-1 ([2,3,4,5,1])
- single element; two elements [3,1]
- target is the pivot (the minimum) or the maximum
```

Full JavaScript solution with tests: [07_search_rotated_sorted_array.js](../solutions/07_search_rotated_sorted_array.js). Run it with `node 07_search_rotated_sorted_array.js` from the solutions folder.

</details>

## Common mistakes

- Deciding the sorted half with `<` instead of `<=` when comparing `nums[lo]` and `nums[mid]`, which breaks two-element arrays.
- Checking the target against the wrong half's bounds (must be inside the sorted half to go there).
- Finding the pivot first and then searching is valid but easy to get off by one; know both ways.

## Related follow-ups

- [Search in Rotated Sorted Array II](08_search_rotated_sorted_array_ii.md) — duplicates allowed
- [Find Minimum in Rotated Sorted Array](09_find_minimum_rotated_sorted_array.md) — find the pivot itself
- [Binary Search](../01_Easy/01_binary_search.md) — the plain version

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
