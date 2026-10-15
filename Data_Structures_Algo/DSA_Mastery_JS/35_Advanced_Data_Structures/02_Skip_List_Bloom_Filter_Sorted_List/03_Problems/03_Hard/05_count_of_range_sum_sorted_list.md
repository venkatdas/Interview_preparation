# Count of Range Sum, sorted-list version

| | |
|---|---|
| **Topic** | Skip List, Bloom Filter and Sorted List |
| **Difficulty** | Hard |
| **Pattern** | prefix sums + countBetween |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #327 — https://leetcode.com/problems/count-of-range-sum/ |
| **Solution file** | [05_count_of_range_sum_sorted_list.js](../solutions/05_count_of_range_sum_sorted_list.js) — open only after a real attempt |

## Problem

Count the subarrays of nums whose sum lies in [lower, upper] (inclusive).

## Examples

```
Input: nums = [-2,5,-1], lower = -2, upper = 2   Output: 3   ([-2], [-1], [-2,5,-1])
Input: nums = [0], lower = 0, upper = 0           Output: 1
```

## Constraints & clarifying questions

```
- n up to 10^5; sums fit in doubles
- Subarrays are non-empty and contiguous
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix sums + countBetween* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. For every start extend the end with a running sum and count.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Prefix sums + sorted list of seen prefixes). O(n log n) comparisons + O(n) per insert for the splice => O(n^2) worst case memmove, but with a tiny constant; fine up to ~10^5 in practice.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element
- lower === upper
- all zeros with range [0,0] -> n(n+1)/2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
For every start extend the end with a running sum and count.
```

### APPROACH 2 — Optimal (Prefix sums + sorted list of seen prefixes)

```
O(n log n) comparisons + O(n) per insert for the splice => O(n^2) worst case memmove,
  but with a tiny constant; fine up to ~10^5 in practice.
sum(j..i-1) = P[i] - P[j]. For each new prefix P[i], count earlier prefixes P[j] with
  P[i] - upper <= P[j] <= P[i] - lower
That is countBetween(P[i] - upper, P[i] - lower) on a sorted multiset of seen prefixes
(two bisects). Then insert P[i].
Alternatives with guaranteed O(n log n): Fenwick tree over compressed prefix sums
(../../34_Range_Query_Data_Structures/02_Fenwick_Tree/), segment tree (../../34_Range_Query_Data_Structures/01_Segment_Tree/), or merge sort
(../../../30_Divide_And_Conquer/).

Dry run: nums = [-2,5,-1], lower -2, upper 2; prefixes 0, -2, 3, 2
  seen {0}:   P=-2: count in [-4, 0] -> 1 (the 0)        seen {-2, 0}
  P=3:        count in [1, 5]  -> 0                        seen {-2, 0, 3}
  P=2:        count in [0, 4]  -> 2 (0 and 3)              total 3
```

### Edge cases

```
- single element
- lower === upper
- all zeros with range [0,0] -> n(n+1)/2
```

Full JavaScript solution with tests: [05_count_of_range_sum_sorted_list.js](../solutions/05_count_of_range_sum_sorted_list.js). Run it with `node 05_count_of_range_sum_sorted_list.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to insert the empty prefix 0 before scanning.
- Querying with the bounds the wrong way round: you need earlier prefixes `p` with `cur - upper <= p <= cur - lower`.
- Assuming `splice` insertion is O(log n); it is O(n) worst case, fine for interviews but say so.

## Related follow-ups

- [Count of Range Sum (segment tree)](../../../../34_Range_Query_Data_Structures/01_Segment_Tree/03_Problems/03_Hard/06_count_of_range_sum.md)
- [Count of Smaller Numbers After Self](../../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/03_Problems/03_Hard/02_count_of_smaller_numbers_after_self.md)
- [Contains Duplicate III](02_contains_duplicate_iii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
