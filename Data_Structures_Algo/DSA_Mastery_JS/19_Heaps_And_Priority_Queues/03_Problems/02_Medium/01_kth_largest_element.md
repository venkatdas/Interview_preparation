# Kth Largest Element in an Array

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | top K (min-heap size k) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #215 — https://leetcode.com/problems/kth-largest-element-in-an-array/ |
| **Solution file** | [01_kth_largest_element.js](../solutions/01_kth_largest_element.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return the k-th largest element
(in sorted order, not the k-th distinct element).

## Examples

```
Input: nums = [3,2,1,5,6,4], k = 2        Output: 5   Explanation: sorted desc 6,5,... -> 2nd is 5
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4  Output: 4   Explanation: 6,5,5,4 -> 4th is 4
```

## Constraints & clarifying questions

```
- Is k always valid (1 <= k <= n)? (yes)
- Duplicates count separately? (yes: "k-th largest in sorted order")
- Can I sort? (allowed, but the interviewer wants better than O(n log n))
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *top K (min-heap size k)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space. Sort descending and take index k-1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (min-heap of size k)   O(n log k) time, O(k) space. Keep a MIN-heap that holds the k largest elements seen so far.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> maximum
- k = n -> minimum
- all duplicates -> that value
- negative numbers
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space

```
Sort descending and take index k-1. Simple, but sorts everything even though
we only care about the top k.
```

### APPROACH 2 — Optimal (min-heap of size k)   O(n log k) time, O(k) space

```
Keep a MIN-heap that holds the k largest elements seen so far. Its top is the
SMALLEST of those k, which is exactly the k-th largest overall.
For each number: push it; if the heap grows past k, pop the smallest (it can
never be the answer because k bigger numbers exist).

Dry run on nums = [3,2,1,5,6,4], k = 2:
  push 3           heap = [3]
  push 2           heap = [2,3]
  push 1 -> size 3, pop 1   heap = [2,3]
  push 5 -> pop 2           heap = [3,5]
  push 6 -> pop 3           heap = [5,6]
  push 4 -> pop 4           heap = [5,6]
  answer = heap.peek() = 5

(Quickselect gives O(n) average and is also worth mentioning; see 11_Sorting.)
```

### Edge cases

```
- k = 1 -> maximum
- k = n -> minimum
- all duplicates -> that value
- negative numbers
```

Full JavaScript solution with tests: [01_kth_largest_element.js](../solutions/01_kth_largest_element.js). Run it with `node 01_kth_largest_element.js` from the solutions folder.

</details>

## Common mistakes

- Using a max-heap of all n elements and popping k times (works, but O(n + k log n) and O(n) space; know the size-k min-heap).
- Default `sort()` without a comparator (sorts as strings).
- Off-by-one: k-th largest is index `n - k` in ascending order.

## Related follow-ups

- [Kth Largest Element in a Stream](../01_Easy/02_kth_largest_in_stream.md)
- [Top K Frequent Elements](05_top_k_frequent_elements.md)
- [Kth Smallest Element in a Sorted Matrix](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/16_kth_smallest_in_sorted_matrix.md) (09_Matrix_And_Multidimensional_Arrays)
- [K Closest Points to Origin](04_k_closest_points.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
