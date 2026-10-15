# Top K Frequent Elements

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | count + top K |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #347 — https://leetcode.com/problems/top-k-frequent-elements/ |
| **Solution file** | [05_top_k_frequent_elements.js](../solutions/05_top_k_frequent_elements.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return the k most frequent
elements. Any order is accepted.

## Examples

```
Input: nums = [1,1,1,2,2,3], k = 2   Output: [1,2]   Explanation: 1 appears 3x, 2 appears 2x
Input: nums = [1], k = 1             Output: [1]
```

## Constraints & clarifying questions

```
- Is the answer unique? (yes, guaranteed)
- k <= number of distinct elements? (yes)
- Must be better than O(n log n)? (the follow-up asks for it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *count + top K* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (count + sort)   O(n log n) time, O(n) space. Count with a Map, turn into [value, count] pairs, sort by count descending, take k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count + min-heap of size k)   O(n log k) time, O(n) space. Count frequencies in a Map (O(n)).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k equals number of distinct values -> return all
- all same element
- negative numbers
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (count + sort)   O(n log n) time, O(n) space

```
Count with a Map, turn into [value, count] pairs, sort by count descending,
take k. Sorting ALL distinct values is more than we need.
```

### APPROACH 2 — Optimal (count + min-heap of size k)   O(n log k) time, O(n) space

```
Count frequencies in a Map (O(n)). Then push each [value, count] into a
MIN-heap ordered by count, popping whenever size > k. The heap keeps the k
most frequent; the least frequent of those sits on top and gets evicted first.

Dry run on [1,1,1,2,2,3], k = 2:
  counts: {1:3, 2:2, 3:1}
  push [1,3]          heap = {[1,3]}
  push [2,2]          heap = {[2,2],[1,3]}   (top = count 2)
  push [3,1] -> size 3 -> pop [3,1]  heap = {[2,2],[1,3]}
  answer = [2,1] (any order)

Bucket sort gives true O(n): see 05_Hashing for that version. The heap
version is the one most interviewers expect you to code first.
```

### Edge cases

```
- k equals number of distinct values -> return all
- all same element
- negative numbers
```

Full JavaScript solution with tests: [05_top_k_frequent_elements.js](../solutions/05_top_k_frequent_elements.js). Run it with `node 05_top_k_frequent_elements.js` from the solutions folder.

</details>

## Common mistakes

- Sorting all unique values by frequency when a size-k heap or bucket sort is cheaper.
- Comparing keys instead of their counts in the heap.
- Map keys from `Object` become strings; use a `Map` to keep numbers.

## Related follow-ups

- [Top K Frequent Words](06_top_k_frequent_words.md)
- [Kth Largest Element in an Array](01_kth_largest_element.md)
- Sort Characters By Frequency (LeetCode #451)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
