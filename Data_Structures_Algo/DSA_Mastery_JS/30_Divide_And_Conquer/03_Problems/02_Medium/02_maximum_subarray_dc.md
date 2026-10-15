# Maximum Subarray, divide & conquer version

| | |
|---|---|
| **Topic** | Divide and Conquer |
| **Difficulty** | Medium |
| **Pattern** | left / right / crossing |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #53 — https://leetcode.com/problems/maximum-subarray/ |
| **Solution file** | [02_maximum_subarray_dc.js](../solutions/02_maximum_subarray_dc.js) — open only after a real attempt |

## Problem

Find the contiguous subarray (at least one element) with the largest sum; return the sum.

## Examples

```
Input: [-2,1,-3,4,-1,2,1,-5,4]   Output: 6   ([4,-1,2,1])
Input: [1]                       Output: 1
Input: [5,4,-1,7,8]              Output: 23
```

## Constraints & clarifying questions

```
- At least one element; all-negative arrays return the largest single element
- The follow-up on LeetCode literally says "try the divide and conquer approach"
- Kadane's O(n) one-pass is the usual answer (../../41_Advanced_Algorithm_Design/01_Classic_Techniques/); D&C is the
  recursion-pattern exercise
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *left / right / crossing* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. For every start, extend the end with a running sum and track the max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Divide & conquer)   O(n log n) time, O(log n) stack space. Split at mid.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element
- all negative -> max element
- all positive -> whole array
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
For every start, extend the end with a running sum and track the max.
```

### APPROACH 2 — Optimal (Divide & conquer)   O(n log n) time, O(log n) stack space

```
Split at mid. The best subarray is
  (a) entirely in the left half  -> recurse
  (b) entirely in the right half -> recurse
  (c) crossing mid               -> best suffix ending at mid + best prefix starting at mid+1
(c) is O(n) per level, log n levels -> T(n) = 2T(n/2) + O(n) = O(n log n) (master theorem, case 2).

Dry run on [-2,1,-3,4]:
  split: left [-2,1], right [-3,4]
  left: split [-2] | [1]: best 1; crossing: -2 + 1 = -1 -> left = 1
  right: split [-3] | [4]: best 4; crossing: -3 + 4 = 1 -> right = 4
  crossing at top: best suffix of [-2,1] = 1, best prefix of [-3,4] = 1 -> 2
  answer max(1, 4, 2) = 4
```

### Edge cases

```
- single element
- all negative -> max element
- all positive -> whole array
```

Full JavaScript solution with tests: [02_maximum_subarray_dc.js](../solutions/02_maximum_subarray_dc.js). Run it with `node 02_maximum_subarray_dc.js` from the solutions folder.

</details>

## Common mistakes

- Initialising the best crossing sums to 0 - an all-negative array then returns 0 instead of the largest element.
- Letting the crossing sum skip the middle element: the left part must END at mid and the right part must START at mid + 1.
- Forgetting the empty-array decision (clarify with the interviewer).

## Related follow-ups

- Maximum Product Subarray (LeetCode #152)
- Maximum Sum Circular Subarray (LeetCode #918)
- [Count of Smaller Numbers After Self](../03_Hard/06_count_of_smaller_numbers_after_self.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
