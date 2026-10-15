# Squares of a Sorted Array

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Easy |
| **Pattern** | opposite ends, fill from back |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #977 — https://leetcode.com/problems/squares-of-a-sorted-array/ |
| **Solution file** | [07_squares_of_sorted_array.js](../solutions/07_squares_of_sorted_array.js) — open only after a real attempt |

## Problem

Given an integer array sorted in non-decreasing order (may contain negatives), return
an array of the squares of each number, also sorted in non-decreasing order.

## Examples

```
Input: [-4, -1, 0, 3, 10]   Output: [0, 1, 9, 16, 100]
Input: [-7, -3, 2, 3, 11]   Output: [4, 9, 9, 49, 121]
```

## Constraints & clarifying questions

```
- Sorted input? (yes; negatives first)
- Can I do O(n)? (that's the follow-up; the trivial answer is square-then-sort)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *opposite ends, fill from back* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n log n) time, O(n) space. Square everything, then sort.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (opposite ends, fill output from the back)   O(n) time, O(n) output. Squares are big at BOTH ends (large negatives on the left, large positives on the right) and small in the middle.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All negative: [-3, -2, -1] -> [1, 4, 9] (pure reversal)
- All positive -> squares in order
- Single element, empty
- Equal absolute values: [-2, 2] -> [4, 4]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n log n) time, O(n) space

```
Square everything, then sort. Throws away the fact that the input was sorted.
```

### APPROACH 2 — Optimal (opposite ends, fill output from the back)   O(n) time, O(n) output

```
Squares are big at BOTH ends (large negatives on the left, large positives on the
right) and small in the middle. So the largest square is always at one of the two ends.
Compare |nums[left]| and |nums[right]|, write the bigger square at the END of the result,
move that pointer inward. Repeat until the pointers cross.

Dry run on [-4, -1, 0, 3, 10]:
  write=4  |-4|=4 vs |10|=10 -> result[4]=100, right=3
  write=3  4 vs 3            -> result[3]=16,  left=1
  write=2  1 vs 3            -> result[2]=9,   right=2
  write=1  1 vs 0            -> result[1]=1,   left=2
  write=0  0 vs 0            -> result[0]=0
  [0, 1, 9, 16, 100]
```

### Edge cases

```
- All negative: [-3, -2, -1] -> [1, 4, 9] (pure reversal)
- All positive -> squares in order
- Single element, empty
- Equal absolute values: [-2, 2] -> [4, 4]
```

Full JavaScript solution with tests: [07_squares_of_sorted_array.js](../solutions/07_squares_of_sorted_array.js). Run it with `node 07_squares_of_sorted_array.js` from the solutions folder.

</details>

## Common mistakes

- Squaring and then sorting (O(n log n)) when two pointers give O(n).
- Filling the output from the front; the largest square is at one of the ends, so fill from the back.
- Forgetting arrays that are all negative or all positive.

## Related follow-ups

- [Merge Sorted Array](08_merge_sorted_array.md) — fill from the back again
- [Two Sum II - Input Array Is Sorted](../02_Medium/03_two_sum_ii_sorted.md) — opposite-end pointers
- Sort Transformed Array (LeetCode #360) — a general quadratic instead of x^2

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
