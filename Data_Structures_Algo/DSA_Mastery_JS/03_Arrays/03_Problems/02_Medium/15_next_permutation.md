# Next Permutation

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Medium |
| **Pattern** | scan from right + reverse |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #31 — https://leetcode.com/problems/next-permutation/ |
| **Solution file** | [15_next_permutation.js](../solutions/15_next_permutation.js) — open only after a real attempt |

## Problem

Rearrange the array into the next lexicographically greater permutation of its
numbers (the arrangement that would come right after it if all permutations were
sorted). If no greater permutation exists, rearrange into the smallest one (sorted
ascending). In place, O(1) extra space.

## Examples

```
Input: [1, 2, 3]   Output: [1, 3, 2]
Input: [3, 2, 1]   Output: [1, 2, 3]   Explanation: already the largest, wrap to smallest
Input: [1, 1, 5]   Output: [1, 5, 1]
Input: [1, 3, 2]   Output: [2, 1, 3]
```

## Constraints & clarifying questions

```
- Duplicates allowed? (yes - use strict comparisons so equal values are skipped)
- In place? (yes)
- Single element / empty? (unchanged)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *scan from right + reverse* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n! * n) time, O(n! * n) space. Generate every permutation, sort them, find the current one and return the next (or the first).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (scan from the right + swap + reverse)   O(n) time, O(1) space. Think of the number as digits.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Fully descending -> sorted ascending
- All equal [2, 2, 2] -> unchanged (no pivot, reverse gives the same thing)
- Two elements -> swap
- Single element / empty
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n! * n) time, O(n! * n) space

```
Generate every permutation, sort them, find the current one and return the next
(or the first). Only feasible for tiny arrays; here it is used to validate the optimal.
```

### APPROACH 2 — Optimal (scan from the right + swap + reverse)   O(n) time, O(1) space

```
Think of the number as digits. To make it only slightly bigger:
  1. From the right, find the first index `pivot` where nums[pivot] < nums[pivot+1].
     Everything right of pivot is non-increasing (it is the largest arrangement of
     those digits, so it cannot grow). If no pivot, the whole array is descending:
     reverse it and return.
  2. From the right, find the first `successor` with nums[successor] > nums[pivot]
     (the smallest digit on the right that is bigger than the pivot). Swap them.
  3. The suffix after pivot is still descending; reverse it to make it the SMALLEST
     arrangement.

Dry run on [1, 3, 2]:
  step 1: from right, 3 > 2 no; 1 < 3 yes -> pivot = 0 (value 1)
  step 2: from right, first value > 1 is 2 at index 2 -> swap -> [2, 3, 1]
  step 3: reverse suffix [3, 1] -> [2, 1, 3]

Dry run on [1, 5, 8, 4, 7, 6, 5, 3, 1]:
  pivot = index 3 (4 < 7); successor = index 6 (5, first from right > 4)
  swap -> [1,5,8,5,7,6,4,3,1]; reverse suffix -> [1,5,8,5,1,3,4,6,7]
```

### Edge cases

```
- Fully descending -> sorted ascending
- All equal [2, 2, 2] -> unchanged (no pivot, reverse gives the same thing)
- Two elements -> swap
- Single element / empty
```

Full JavaScript solution with tests: [15_next_permutation.js](../solutions/15_next_permutation.js). Run it with `node 15_next_permutation.js` from the solutions folder.

</details>

## Common mistakes

- Swapping the pivot with the *first* larger element to the right instead of the *rightmost* larger one (the smallest larger value).
- Sorting the suffix after the swap; it is already in descending order, so a reverse is enough and O(n).
- Forgetting the all-descending case, where the answer is the fully reversed (smallest) arrangement.

## Related follow-ups

- Permutations (LeetCode #46) — generate all arrangements with backtracking
- Permutation Sequence (LeetCode #60) — jump straight to the k-th permutation
- [Largest Number](../../../11_Sorting/03_Problems/02_Medium/05_largest_number.md) — another ordering-by-digits puzzle

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
