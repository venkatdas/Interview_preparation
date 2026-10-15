# Maximum Gap

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | bucket / radix idea |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #164 — https://leetcode.com/problems/maximum-gap/ |
| **Solution file** | [09_maximum_gap.js](../solutions/09_maximum_gap.js) — open only after a real attempt |

## Problem

Given an unsorted integer array, return the maximum difference between two
successive elements in its SORTED form. Return 0 if fewer than 2 elements.
Follow-up: do it in linear time and linear space.

## Examples

```
Input: [3,6,9,1]   Output: 3   (sorted 1,3,6,9 -> gaps 2,3,3 -> 3)
Input: [10]        Output: 0
```

## Constraints & clarifying questions

```
- n <= 10^5, values 0..10^9 (so counting sort on the value is NOT ok; bucket/radix is)
- Duplicates? (yes -> gap 0 between them)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bucket / radix idea* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sort)   O(n log n) time. Sort, scan adjacent pairs, keep the max difference.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bucket sort idea / pigeonhole)   O(n) time, O(n) space. Key insight: with n numbers spread over [min, max], the maximum gap is AT LEAST (max - min) / (n - 1) (the average gap).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- fewer than 2 elements -> 0
- all equal -> 0 (width would be 0: guard with Math.max(1, ...))
- two elements -> their difference
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sort)   O(n log n) time

```
Sort, scan adjacent pairs, keep the max difference. Already fine for interviews;
the follow-up asks for O(n).
```

### APPROACH 2 — Optimal (bucket sort idea / pigeonhole)   O(n) time, O(n) space

```
Key insight: with n numbers spread over [min, max], the maximum gap is AT LEAST
(max - min) / (n - 1) (the average gap). So if we split the range into n - 1 buckets
of that width, the answer can never be between two numbers in the SAME bucket (that
gap would be smaller than the width). We only need, per bucket, its min and max,
then compare each bucket's min with the previous non-empty bucket's max.
(Radix sort followed by a scan is the other O(n) answer: O(d * n) with d = 10 digits.)

Dry run [3,6,9,1]: min=1 max=9 n=4 -> width = ceil(8/3) = 3, buckets:
  idx = floor((v - min) / width): 1->0, 3->0, 6->1, 9->2
  bucket0 [min 1, max 3] bucket1 [6,6] bucket2 [9,9]
  gaps between buckets: 6 - 3 = 3, 9 - 6 = 3 -> answer 3
```

### Edge cases

```
- fewer than 2 elements -> 0
- all equal -> 0 (width would be 0: guard with Math.max(1, ...))
- two elements -> their difference
```

Full JavaScript solution with tests: [09_maximum_gap.js](../solutions/09_maximum_gap.js). Run it with `node 09_maximum_gap.js` from the solutions folder.

</details>

## Common mistakes

- Sorting (O(n log n)) when the problem asks for linear time.
- Comparing gaps inside a bucket; the max gap is always between buckets.
- Bucket size of 0 when all values are equal (use at least 1).

## Related follow-ups

- [Sort an Array](01_sort_an_array.md) — counting and radix sort background
- [Contains Duplicate III](../../../35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/03_Problems/03_Hard/02_contains_duplicate_iii.md) — another bucketing trick
- [H-Index](10_h_index.md) — counting sort on bounded values

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
