# Reverse Pairs

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Hard |
| **Pattern** | merge sort with counting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #493 — https://leetcode.com/problems/reverse-pairs/ |
| **Solution file** | [14_reverse_pairs.js](../solutions/14_reverse_pairs.js) — open only after a real attempt |

## Problem

Count the pairs (i, j) with i < j and nums[i] > 2 * nums[j].

## Examples

```
Input: [1,3,2,3,1]   Output: 2   ((3,1) at indices 1,4 and (3,1) at indices 3,4)
Input: [2,4,3,5,1]   Output: 3   ((4,1), (3,1), (5,1))
```

## Constraints & clarifying questions

```
- n <= 5 * 10^4, values up to 2^31 - 1 (2 * nums[j] can exceed 32-bit; JS doubles are fine)
- Negative numbers? (yes, 2 * negative is still comparable)
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

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. Check every pair i &lt; j.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (merge sort with a SEPARATE counting pass)   O(n log n) time, O(n) space. Same framework as Count of Smaller Numbers After Self, with one twist: the condition nums[i] > 2 * nums[j] is NOT the same as the merge order comparison nums[i] > nums[j], so we cannot count while merging.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] and single element -> 0
- sorted ascending -> 0
- negatives: [-5, -3] -> is -5 > -6? yes -> 1  (double of a negative gets smaller)
- large values near 2^31: 2 * value does not overflow in JS
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
Check every pair i < j.
```

### APPROACH 2 — Optimal (merge sort with a SEPARATE counting pass)   O(n log n) time, O(n) space

```
Same framework as Count of Smaller Numbers After Self, with one twist: the condition
nums[i] > 2 * nums[j] is NOT the same as the merge order comparison nums[i] > nums[j],
so we cannot count while merging. Instead, before merging two sorted halves, do a
dedicated two-pointer pass: for each left element (ascending), advance a pointer j
over the right half while left[i] > 2 * right[j]; everything before j pairs with
left[i]. Because both halves are sorted, j never moves backwards -> O(n) per level.
Then merge normally.

Dry run [1,3,2,3,1]:
  split [1,3] [2,3,1]
  [1,3] -> sorted, count pass between [1] and [3]: 1 > 6? no -> 0
  [2,3,1] -> [2] | [3,1]:  [3,1]: 3 > 2*1 = 2? yes -> count 1, merge -> [1,3]
             [2] vs [1,3]: 2 > 2? no -> 0, merge -> [1,2,3]
  top: [1,3] vs [1,2,3]: 1 > 2? no; 3 > 2*1 = 2 yes j=1; 3 > 4? no -> count 1
  total 0 + 1 + 0 + 1 = 2
```

### Edge cases

```
- [] and single element -> 0
- sorted ascending -> 0
- negatives: [-5, -3] -> is -5 > -6? yes -> 1  (double of a negative gets smaller)
- large values near 2^31: 2 * value does not overflow in JS
```

Full JavaScript solution with tests: [14_reverse_pairs.js](../solutions/14_reverse_pairs.js). Run it with `node 14_reverse_pairs.js` from the solutions folder.

</details>

## Common mistakes

- Counting pairs during the merge itself; count in a separate pass before merging, because the condition (2x) differs from the sort order.
- Integer overflow on `2 * nums[j]` in other languages; JS doubles are fine here.
- Using `>=` instead of strict `>`.

## Related follow-ups

- [Count of Smaller Numbers After Self](13_count_smaller_after_self.md) — merge-sort counting per element
- [Reverse Pairs (Fenwick Tree)](../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/03_Problems/03_Hard/03_reverse_pairs.md) — a BIT approach
- Count inversions — the classic version without the factor 2

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
