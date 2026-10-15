# Binary Search

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Easy |
| **Pattern** | template 1 exact |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #704 — https://leetcode.com/problems/binary-search/ |
| **Solution file** | [01_binary_search.js](../solutions/01_binary_search.js) — open only after a real attempt |

## Problem

Given a sorted array of distinct integers and a target, return the index of the
target, or -1 if it is not present. Must run in O(log n).

## Examples

```
Input: nums = [-1,0,3,5,9,12], target = 9   Output: 4
Input: nums = [-1,0,3,5,9,12], target = 2   Output: -1
```

## Constraints & clarifying questions

```
- Sorted ascending? Distinct? (yes, yes)
- n up to 10^4; values fit in 32 bits
- Empty array -> -1
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *template 1 exact* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (linear scan)   O(n) time, O(1) space. Walk the array and compare each element.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Template 1, left &lt;= right)   O(log n) time, O(1) space. Keep an inclusive range [left, right] that must contain the target if it exists.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> -1
- single element, match and no match
- target smaller than everything / larger than everything (loop must terminate)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (linear scan)   O(n) time, O(1) space

```
Walk the array and compare each element. Ignores the sorted property.
```

### APPROACH 2 — Optimal (Template 1, left &lt;= right)   O(log n) time, O(1) space

```
Keep an inclusive range [left, right] that must contain the target if it exists.
Look at the middle: equal -> done; smaller -> target is to the right (left = mid + 1);
bigger -> target is to the left (right = mid - 1). Stop when the range is empty.

Dry run nums = [-1,0,3,5,9,12], target = 9:
  left=0 right=5 mid=2 nums[2]=3 < 9  -> left=3
  left=3 right=5 mid=4 nums[4]=9 === 9 -> return 4
target = 2:
  mid=2 (3) > 2 -> right=1; mid=0 (-1) < 2 -> left=1; mid=1 (0) < 2 -> left=2 > right -> -1
```

### Edge cases

```
- [] -> -1
- single element, match and no match
- target smaller than everything / larger than everything (loop must terminate)
```

Full JavaScript solution with tests: [01_binary_search.js](../solutions/01_binary_search.js). Run it with `node 01_binary_search.js` from the solutions folder.

</details>

## Common mistakes

- Using `while (lo < hi)` with `hi = n - 1`, which skips checking the last remaining element.
- Setting `lo = mid` or `hi = mid` in the closed-interval version, which can loop forever.
- Computing `mid` with `(lo + hi) >> 1` and claiming it works for any size; it truncates to 32 bits.

## Related follow-ups

- [Search Insert Position](02_search_insert_position.md) — the lower-bound variant
- [Find First and Last Position of Element in Sorted Array](../02_Medium/04_first_and_last_position.md) — both bounds
- [Search in a Binary Search Tree](../../../21_Binary_Search_Trees/03_Problems/01_Easy/01_search_in_bst.md) — the same halving on a tree

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
