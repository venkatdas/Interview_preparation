# Single Element in a Sorted Array

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | index parity |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #540 — https://leetcode.com/problems/single-element-in-a-sorted-array/ |
| **Solution file** | [18_single_element_sorted_array.js](../solutions/18_single_element_sorted_array.js) — open only after a real attempt |

## Problem

A sorted array where every element appears exactly twice, except one element that
appears once. Find that element in O(log n) time and O(1) space.

## Examples

```
Input: [1,1,2,3,3,4,4,8,8]   Output: 2
Input: [3,3,7,7,10,11,11]    Output: 10
```

## Constraints & clarifying questions

```
- Length is odd (2k + 1), sorted, exactly one single
- O(log n) required (XOR of everything is O(n) and a nice warm-up answer)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *index parity* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (XOR)   O(n) time, O(1) space. XOR all elements: pairs cancel (a ^ a = 0), leaving the single one.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search on index parity)   O(log n) time, O(1) space. BEFORE the single element, pairs start at EVEN indices: (0,1), (2,3), ...

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element array
- single at the very start or very end
- negatives
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (XOR)   O(n) time, O(1) space

```
XOR all elements: pairs cancel (a ^ a = 0), leaving the single one. See 14_Bit_Manipulation.
```

### APPROACH 2 — Optimal (binary search on index parity)   O(log n) time, O(1) space

```
BEFORE the single element, pairs start at EVEN indices: (0,1), (2,3), ...
AFTER it, pairs start at ODD indices: (5,6), (7,8), ...
So for an even mid: if nums[mid] === nums[mid + 1], the pair pattern is still intact
-> the single is to the RIGHT (left = mid + 2). Otherwise it is at mid or to the left.
Force mid to be even (if odd, mid--) so the check is uniform.
Loop while left < right; nums[left] is the single.

Dry run [1,1,2,3,3,4,4,8,8]:
  l=0 r=8 mid=4 (even): nums[4]=3 === nums[5]=4? no  -> r=4
  l=0 r=4 mid=2 (even): nums[2]=2 === nums[3]=3? no  -> r=2
  l=0 r=2 mid=1 -> make even: 0: nums[0]=1 === nums[1]=1 yes -> l=2
  l === r === 2 -> nums[2] = 2
```

### Edge cases

```
- single element array
- single at the very start or very end
- negatives
```

Full JavaScript solution with tests: [18_single_element_sorted_array.js](../solutions/18_single_element_sorted_array.js). Run it with `node 18_single_element_sorted_array.js` from the solutions folder.

</details>

## Common mistakes

- XOR of everything works but is O(n); the problem asks for O(log n).
- Not forcing mid to be even (or comparing with the right neighbour based on parity), which breaks the pairing logic.
- Using `lo <= hi` and stepping past the answer.

## Related follow-ups

- Single Number (LeetCode #136) — unsorted, use XOR
- [Find Peak Element](10_find_peak_element.md) — pick a side by local comparison
- [Binary Search](../01_Easy/01_binary_search.md) — the base template

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
