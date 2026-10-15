# Kth Largest Element in an Array

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | quickselect |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #215 — https://leetcode.com/problems/kth-largest-element-in-an-array/ |
| **Solution file** | [04_kth_largest_element.js](../solutions/04_kth_largest_element.js) — open only after a real attempt |

## Problem

Return the k-th largest element in an unsorted array (k-th largest in SORTED order,
not the k-th distinct element). Can you do it without fully sorting?

## Examples

```
Input: nums = [3,2,1,5,6,4], k = 2           Output: 5
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4     Output: 4   (sorted desc: 6,5,5,4 -> 4)
```

## Constraints & clarifying questions

```
- 1 <= k <= n <= 10^5
- Duplicates count separately ([5,5] k=2 -> 5)
- Can I modify the input? (quickselect mutates; copy if not)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *quickselect* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space. Sort descending, return index k - 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Quickselect)   O(n) average, O(n^2) worst, O(1) extra space. k-th largest = (n - k)-th smallest (0-based).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> max; k = n -> min
- all duplicates [2,2,2], any k -> 2 (three-way partition keeps this O(n); plain Lomuto is O(n^2) but still correct)
- negatives
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space

```
Sort descending, return index k - 1. Clean and correct; mention it, then improve.
(A min-heap of size k gives O(n log k); see 19_Heaps_And_Priority_Queues.)
```

### APPROACH 2 — Optimal (Quickselect)   O(n) average, O(n^2) worst, O(1) extra space

```
k-th largest = (n - k)-th smallest (0-based). Partition around a random pivot:
the pivot lands at its final sorted index p. If p === target -> answer. If p < target,
the answer is on the right -> continue there; else continue on the left. Each round
discards part of the array -> n + n/2 + n/4 + ... = O(n) expected.

Dry run [3,2,1,5,6,4], k=2 -> target index 4:
  pivot 4 (say): partition -> [3,2,1,4,6,5], p = 3 < 4 -> search [4..5]
  pivot 5: partition [6,5] -> [5,6], p = 4 === target -> return 5
```

### Edge cases

```
- k = 1 -> max; k = n -> min
- all duplicates [2,2,2], any k -> 2 (three-way partition keeps this O(n); plain Lomuto is O(n^2) but still correct)
- negatives
```

Full JavaScript solution with tests: [04_kth_largest_element.js](../solutions/04_kth_largest_element.js). Run it with `node 04_kth_largest_element.js` from the solutions folder.

</details>

## Common mistakes

- Mixing up kth largest with index k; in ascending order it is index `n - k`.
- Quickselect with a fixed pivot, which is O(n^2) on sorted input.
- Using a max-heap of all n items when a min-heap of size k is enough.

## Related follow-ups

- [Kth Largest Element in an Array (Heaps)](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/01_kth_largest_element.md) — the heap approach
- [Top K Frequent Elements](../../../05_Hashing/03_Problems/02_Medium/09_top_k_frequent_elements.md) — selection on counts
- [Kth Largest Element in a Stream](../../../19_Heaps_And_Priority_Queues/03_Problems/01_Easy/02_kth_largest_in_stream.md) — the online version

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
