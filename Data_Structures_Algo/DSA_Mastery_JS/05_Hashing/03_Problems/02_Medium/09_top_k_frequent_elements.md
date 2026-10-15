# Top K Frequent Elements

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Medium |
| **Pattern** | frequency + bucket sort |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #347 — https://leetcode.com/problems/top-k-frequent-elements/ |
| **Solution file** | [09_top_k_frequent_elements.js](../solutions/09_top_k_frequent_elements.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return the k most frequent elements.
The answer is guaranteed to be unique. Return in any order.

## Examples

```
Input: nums = [1, 1, 1, 2, 2, 3], k = 2   Output: [1, 2]
Input: nums = [1], k = 1                  Output: [1]
```

## Constraints & clarifying questions

```
- Is k always valid (1 <= k <= number of distinct elements)? (yes)
- Ties? ("answer is unique" means no ambiguous ties for the k-th spot)
- Follow-up they always ask: can you do better than O(n log n)? (yes: bucket sort)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *frequency + bucket sort* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (count + sort)   O(n log n) time, O(n) space. Count with a Map, turn into [value, count] pairs, sort by count descending, take k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count + bucket sort)   O(n) time, O(n) space. Key insight: a count can never exceed n.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k equals the number of distinct values -> return all of them
- Single element
- All elements the same
- Negative numbers (keys in a Map, no problem)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (count + sort)   O(n log n) time, O(n) space

```
Count with a Map, turn into [value, count] pairs, sort by count descending, take k.
```

### APPROACH 2 — Optimal (count + bucket sort)   O(n) time, O(n) space

```
Key insight: a count can never exceed n. So make an array `buckets` of size n + 1
where buckets[c] holds every value that appears exactly c times.
Then walk buckets from the END (highest count) and collect values until we have k.

Dry run on [1, 1, 1, 2, 2, 3], k = 2:
  counts = {1:3, 2:2, 3:1}
  buckets: index 1 -> [3], index 2 -> [2], index 3 -> [1]
  walk from index 6 down: idx 3 -> take 1 (have 1); idx 2 -> take 2 (have 2) -> stop
  result [1, 2]

(A min-heap of size k gives O(n log k); see 19_Heaps_And_Priority_Queues. Bucket sort is
the one that beats O(n log n) outright.)
```

### Edge cases

```
- k equals the number of distinct values -> return all of them
- Single element
- All elements the same
- Negative numbers (keys in a Map, no problem)
```

Full JavaScript solution with tests: [09_top_k_frequent_elements.js](../solutions/09_top_k_frequent_elements.js). Run it with `node 09_top_k_frequent_elements.js` from the solutions folder.

</details>

## Common mistakes

- Sorting all entries by count (O(n log n)) when bucket sort gives O(n).
- Creating buckets of size n instead of n + 1; a value can appear n times.
- Returning counts instead of the elements.

## Related follow-ups

- [Kth Largest Element in an Array](../../../11_Sorting/03_Problems/02_Medium/04_kth_largest_element.md) — selection with quickselect or a heap
- [Sort Characters By Frequency](../../../11_Sorting/03_Problems/02_Medium/07_sort_characters_by_frequency.md) — frequency then order
- Top K Frequent Words (LeetCode #692) — ties broken alphabetically

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
