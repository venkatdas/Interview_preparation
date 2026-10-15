# Search in Rotated Sorted Array II

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | rotated with duplicates |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #81 — https://leetcode.com/problems/search-in-rotated-sorted-array-ii/ |
| **Solution file** | [08_search_rotated_sorted_array_ii.js](../solutions/08_search_rotated_sorted_array_ii.js) — open only after a real attempt |

## Problem

Same as problem 07, but the array MAY contain duplicates. Return true if target
exists, false otherwise.

## Examples

```
Input: [2,5,6,0,0,1,2], 0   Output: true
Input: [2,5,6,0,0,1,2], 3   Output: false
Input: [1,0,1,1,1], 0       Output: true   (the tricky case: nums[left] === nums[mid] === nums[right])
```

## Constraints & clarifying questions

```
- Duplicates allowed -> worst case becomes O(n) ([1,1,1,1,1,1,0,1]: no half is provably sorted)
- Return boolean, not index
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *rotated with duplicates* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n). nums.includes(target).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (rotated search + shrink on ties)   O(log n) average, O(n) worst, O(1) space. Same as problem 07 with one extra rule: when nums[left] === nums[mid] === nums[right] we cannot tell which half is sorted, so just drop both ends (left++, right--) and continue.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all duplicates and target absent -> O(n) but correct
- [] -> false
- target at the ends
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n)

```
nums.includes(target).
```

### APPROACH 2 — Optimal (rotated search + shrink on ties)   O(log n) average, O(n) worst, O(1) space

```
Same as problem 07 with one extra rule: when nums[left] === nums[mid] === nums[right]
we cannot tell which half is sorted, so just drop both ends (left++, right--) and
continue. Neither can be the target (we already compared mid). Everything else is
identical: decide the sorted half, check the range, move.

Dry run [1,0,1,1,1], target 0:
  l=0 r=4 mid=2 (1): nums[0]=1 === nums[2] === nums[4] -> l=1 r=3
  l=1 r=3 mid=2 (1): nums[1]=0 <= 1 -> left half [0,1] sorted; 0 <= 0 < 1 yes -> r=1
  l=1 r=1 mid=1 (0) === target -> true
```

### Edge cases

```
- all duplicates and target absent -> O(n) but correct
- [] -> false
- target at the ends
```

Full JavaScript solution with tests: [08_search_rotated_sorted_array_ii.js](../solutions/08_search_rotated_sorted_array_ii.js). Run it with `node 08_search_rotated_sorted_array_ii.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the case `nums[lo] === nums[mid] === nums[hi]`, where you cannot tell which half is sorted; shrink both ends by one.
- Claiming O(log n) worst case; with many duplicates it degrades to O(n).
- Returning an index when the problem asks for a boolean.

## Related follow-ups

- [Search in Rotated Sorted Array](07_search_rotated_sorted_array.md) — distinct values
- Find Minimum in Rotated Sorted Array II (LeetCode #154) — the same duplicate issue
- [Find Minimum in Rotated Sorted Array](09_find_minimum_rotated_sorted_array.md) — locate the rotation point

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
