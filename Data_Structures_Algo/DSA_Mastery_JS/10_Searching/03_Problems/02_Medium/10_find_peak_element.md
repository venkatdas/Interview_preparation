# Find Peak Element

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | slope predicate |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #162 — https://leetcode.com/problems/find-peak-element/ |
| **Solution file** | [10_find_peak_element.js](../solutions/10_find_peak_element.js) — open only after a real attempt |

## Problem

A peak is an element strictly greater than its neighbours. Given an array where
nums[i] !== nums[i+1] for all i, return the index of ANY peak. Imagine
nums[-1] = nums[n] = -Infinity (the edges count as neighbours smaller than anything).
O(log n) required.

## Examples

```
Input: [1,2,3,1]         Output: 2   (3 is a peak)
Input: [1,2,1,3,5,6,4]   Output: 1 or 5   (two peaks, either is accepted)
```

## Constraints & clarifying questions

```
- Adjacent elements are never equal (otherwise "strictly greater" can fail everywhere)
- Any peak is fine? (yes)
- Unsorted input! Binary search still works because of the predicate below
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *slope predicate* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n). Scan; return the first i with nums[i] > nums[i+1] (that is a peak, since all previous elements were ascending).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search on the slope)   O(log n) time, O(1) space. Look at mid and mid + 1: nums[mid] &lt; nums[mid+1] -> we are going UPHILL.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element -> 0
- strictly increasing -> last index; strictly decreasing -> 0
- two elements
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n)

```
Scan; return the first i with nums[i] > nums[i+1] (that is a peak, since all
previous elements were ascending). If none, the last element is a peak.
```

### APPROACH 2 — Optimal (binary search on the slope)   O(log n) time, O(1) space

```
Look at mid and mid + 1:
  nums[mid] < nums[mid+1] -> we are going UPHILL. A peak must exist to the right
    (either the climb continues to the end, which is a peak, or it turns down somewhere)
    -> left = mid + 1
  nums[mid] > nums[mid+1] -> going DOWNHILL. mid itself or something to the left is a peak
    -> right = mid
Loop while left < right. The predicate "slope goes up at i" is false then true... not
globally, but every time we discard a half we keep a half that provably has a peak.

Dry run [1,2,1,3,5,6,4]:
  l=0 r=6 mid=3: 3 < 5 uphill -> l=4
  l=4 r=6 mid=5: 6 > 4 downhill -> r=5
  l=4 r=5 mid=4: 5 < 6 uphill -> l=5
  l === r === 5 -> index 5 (value 6) is a peak
```

### Edge cases

```
- single element -> 0
- strictly increasing -> last index; strictly decreasing -> 0
- two elements
```

Full JavaScript solution with tests: [10_find_peak_element.js](../solutions/10_find_peak_element.js). Run it with `node 10_find_peak_element.js` from the solutions folder.

</details>

## Common mistakes

- Believing binary search needs a sorted array; here the slope tells you which side must contain a peak.
- Reading `nums[mid + 1]` when mid is the last index; use `lo < hi` so mid + 1 is always valid.
- Returning the peak value instead of its index.

## Related follow-ups

- Peak Index in a Mountain Array (LeetCode #852) — exactly one peak
- Find a Peak Element II (LeetCode #1901) — the 2D version
- [Find Minimum in Rotated Sorted Array](09_find_minimum_rotated_sorted_array.md) — compare with a neighbour to pick a side

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
