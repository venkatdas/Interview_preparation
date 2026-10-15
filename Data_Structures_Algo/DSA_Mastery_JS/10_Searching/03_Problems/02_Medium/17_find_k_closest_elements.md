# Find K Closest Elements

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | search the window start |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #658 — https://leetcode.com/problems/find-k-closest-elements/ |
| **Solution file** | [17_find_k_closest_elements.js](../solutions/17_find_k_closest_elements.js) — open only after a real attempt |

## Problem

Given a sorted array, an integer k and a value x, return the k elements closest to x,
sorted ascending. Ties: the smaller element wins (|a - x| === |b - x| and a < b -> a).

## Examples

```
Input: arr = [1,2,3,4,5], k = 4, x = 3    Output: [1,2,3,4]
Input: arr = [1,2,3,4,5], k = 4, x = -1   Output: [1,2,3,4]
Input: arr = [1,1,2,3,4,5], k = 4, x = 4  Output: [2,3,4,5]   (|5-4|=1 beats |1-4|=3)
```

## Constraints & clarifying questions

```
- Sorted ascending, 1 <= k <= n
- x may be outside the array's range
- Output must be sorted (so the answer is a contiguous window of the array!)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *search the window start* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort by distance)   O(n log n). Sort a copy by (|v - x|, v), take the first k, sort those ascending.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search the window's left edge)   O(log(n - k) + k) time, O(1) extra. Because the output is sorted and comes from a sorted array, it is a window arr[left..left+k-1].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k === n -> whole array
- x smaller than all -> first k; larger than all -> last k
- duplicates and ties
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort by distance)   O(n log n)

```
Sort a copy by (|v - x|, v), take the first k, sort those ascending.
```

### APPROACH 2 — Optimal (binary search the window's left edge)   O(log(n - k) + k) time, O(1) extra

```
Because the output is sorted and comes from a sorted array, it is a window
arr[left..left+k-1]. Binary search `left` over [0, n - k]. For a candidate left,
compare the element just outside on the left (arr[mid]) with the element just outside
on the right (arr[mid + k]):
  if x - arr[mid] > arr[mid + k] - x  -> the right element is closer: window should shift right (lo = mid + 1)
  else                                -> keep or move left (hi = mid)
The subtraction form (not Math.abs) handles ties correctly: when equal, we prefer the
smaller elements, i.e. we do NOT shift right.

Dry run arr=[1,2,3,4,5], k=4, x=3: lo=0 hi=1
  mid=0: x - arr[0] = 2, arr[4] - x = 2 -> not greater -> hi=0
  lo === hi === 0 -> [1,2,3,4]
```

### Edge cases

```
- k === n -> whole array
- x smaller than all -> first k; larger than all -> last k
- duplicates and ties
```

Full JavaScript solution with tests: [17_find_k_closest_elements.js](../solutions/17_find_k_closest_elements.js). Run it with `node 17_find_k_closest_elements.js` from the solutions folder.

</details>

## Common mistakes

- Breaking ties toward the larger value; ties go to the smaller element.
- Searching the window start over `[0, n - 1]` instead of `[0, n - k]`.
- Returning the elements in order of distance instead of sorted order.

## Related follow-ups

- [Find First and Last Position of Element in Sorted Array](04_first_and_last_position.md) — lower bound
- [K Closest Points to Origin](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/04_k_closest_points.md) — the heap approach
- [3Sum Closest](../../../06_Two_Pointers/03_Problems/02_Medium/14_three_sum_closest.md) — closeness with pointers

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
