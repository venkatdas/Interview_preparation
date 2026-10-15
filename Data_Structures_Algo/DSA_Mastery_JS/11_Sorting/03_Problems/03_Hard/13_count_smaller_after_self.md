# Count of Smaller Numbers After Self

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Hard |
| **Pattern** | merge sort with counting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #315 — https://leetcode.com/problems/count-of-smaller-numbers-after-self/ |
| **Solution file** | [13_count_smaller_after_self.js](../solutions/13_count_smaller_after_self.js) — open only after a real attempt |

## Problem

For each nums[i], count how many elements to its RIGHT are strictly smaller.
Return the array of counts.

## Examples

```
Input: [5,2,6,1]   Output: [2,1,1,0]
  5: 2 and 1 are smaller to the right -> 2
  2: 1 -> 1;  6: 1 -> 1;  1: nothing -> 0
Input: [-1,-1]     Output: [0,0]
```

## Constraints & clarifying questions

```
- n <= 10^5 (so O(n^2) is too slow), values can be negative
- Strictly smaller (equal elements do not count)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *merge sort with counting* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) extra. For each i, scan j > i and count nums[j] &lt; nums[i].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (merge sort over INDICES, count during merge)   O(n log n) time, O(n) space. Merge sort the array of indices by their values.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> []; single element -> [0]
- all equal -> all zeros (use strict < when taking from the right first)
- descending input -> [n-1, n-2, ..., 0]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) extra

```
For each i, scan j > i and count nums[j] < nums[i].
```

### APPROACH 2 — Optimal (merge sort over INDICES, count during merge)   O(n log n) time, O(n) space

```
Merge sort the array of indices by their values. While merging a left half and a
right half (both sorted, and every right element is originally to the RIGHT of every
left element), each time we take an element from the LEFT, every element already
taken from the RIGHT is (a) smaller than it and (b) positioned after it in the
original array. So counts[leftIndex] += (number taken from right so far).
Sorting indices (not values) lets us know which original position to credit.
(Alternatives: Binary Indexed Tree / Segment Tree, see 35_Advanced_Data_Structures.)

Dry run [5,2,6,1] -> indices [0,1,2,3]:
  split [0,1] [2,3]
  sort [0,1]: values 5,2 -> merge: take idx1 (2) from right (rightTaken=1); take idx0 (5) from left -> counts[0] += 1 -> [1,2]
  sort [2,3]: values 6,1 -> take idx3 (1) right (rightTaken=1); take idx2 (6) -> counts[2] += 1 -> [3,2]
  merge [1,0] (2,5) with [3,2] (1,6):
    2 vs 1 -> take idx3 (right, rightTaken=1)
    2 vs 6 -> take idx1 (left) counts[1] += 1
    5 vs 6 -> take idx0 (left) counts[0] += 1 -> counts[0] = 2
    leftover idx2
  counts = [2,1,1,0]
```

### Edge cases

```
- [] -> []; single element -> [0]
- all equal -> all zeros (use strict < when taking from the right first)
- descending input -> [n-1, n-2, ..., 0]
```

Full JavaScript solution with tests: [13_count_smaller_after_self.js](../solutions/13_count_smaller_after_self.js). Run it with `node 13_count_smaller_after_self.js` from the solutions folder.

</details>

## Common mistakes

- Sorting the values directly and losing their original indices; sort index arrays instead.
- Counting smaller elements on the wrong side during the merge (only right-half elements already placed count).
- Using an O(n^2) double loop on n = 10^5.

## Related follow-ups

- [Reverse Pairs](14_reverse_pairs.md) — the same merge-sort counting with 2x
- [Count of Smaller Numbers After Self (Fenwick Tree)](../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/03_Problems/03_Hard/02_count_of_smaller_numbers_after_self.md) — a BIT approach
- [Count of Range Sum](../../../34_Range_Query_Data_Structures/01_Segment_Tree/03_Problems/03_Hard/06_count_of_range_sum.md) — counting pairs of prefix sums

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
