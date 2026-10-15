# Closest Subsequence Sum

| | |
|---|---|
| **Topic** | Meet in the Middle |
| **Difficulty** | Hard |
| **Pattern** | half sums + binary search |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Searching](../../../10_Searching/README.md) |
| **Source** | LeetCode #1755 — https://leetcode.com/problems/closest-subsequence-sum/ (statement paraphrased) |
| **Solution file** | [04_closest_subsequence_sum.js](../solutions/04_closest_subsequence_sum.js) — open only after a real attempt |

## Problem

Given an integer array `nums` and an integer `goal`, pick any subsequence (any set of positions,
possibly none) so that the absolute difference between its sum and `goal` is as small as possible.
Return that smallest difference.

## Examples

```
nums=[5,-7,3,5],  goal=6    Output: 0    (take all: 6)
nums=[7,-9,15,-2], goal=-5  Output: 1    (7 + -9 + -2 = -4)
nums=[1,2,3],     goal=-7   Output: 7    (take nothing: 0)
```

## Constraints & clarifying questions

```
- 1 <= n <= 40, |nums[i]| <= 1e7, |goal| <= 1e9
- Empty subsequence allowed? (yes, sum 0)
- Values are too large for a DP over sums.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** `n <= 40` plus huge values → meet in the middle.

</details>

<details><summary>Hint 2</summary>

**Start simple.** If you had a sorted list of numbers and a single value `l`, how would you find the list entry closest to `goal - l`?

</details>

<details><summary>Hint 3</summary>

**The key idea.** Enumerate all subset sums of each half. Sort the right list. For each left sum `l`, binary search the right list for `goal - l` and check the element at the insertion point and the one just before it.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Return early when the difference hits 0. Remember the empty subset is in both lists already (sum 0).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

Recursive include/exclude over all elements, tracking the best `|sum − goal|`.

### APPROACH 2 — Optimal (meet in the middle + binary search)   O(2^(n/2) · n) time, O(2^(n/2)) space

```
L = subset sums of left half
R = subset sums of right half, sorted
for l in L:
    p = lowerBound(R, goal - l)
    check R[p] and R[p-1]
```

Dry run `nums=[7,-9,15,-2], goal=-5`:

```
L = [0, 7, -9, -2]        R = [-2, 0, 13, 15]
l=0   want -5  -> R[0]=-2 -> diff 3       best 3
l=7   want -12 -> R[0]=-2 -> 5, diff 10   best 3
l=-9  want 4   -> 0 -> diff 4, 13 -> diff 9   best 3
l=-2  want -3  -> -2 -> -4, diff 1        best 1
```

### Edge cases

```
- exact hit -> 0, stop early
- all negatives with positive goal -> goal (choose nothing)
```

### Common mistakes

- Checking only `R[p]` and missing the closer `R[p-1]`.
- Default `sort()` on numbers (sorts as strings).

Full JavaScript solution with tests: [04_closest_subsequence_sum.js](../solutions/04_closest_subsequence_sum.js).

</details>

## Related follow-ups

- LeetCode #1981 Minimize the Difference Between Target and Chosen Elements
- Return the subsequence itself, not just the difference (store masks with the sums)
- Replace binary search with two pointers on two sorted lists (O(2^(n/2)) combine)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
