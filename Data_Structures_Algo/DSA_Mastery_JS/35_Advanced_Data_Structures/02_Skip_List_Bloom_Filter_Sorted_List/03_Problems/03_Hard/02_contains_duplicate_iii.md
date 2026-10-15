# Contains Duplicate III

| | |
|---|---|
| **Topic** | Skip List, Bloom Filter and Sorted List |
| **Difficulty** | Hard |
| **Pattern** | sorted sliding window + ceiling |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #220 — https://leetcode.com/problems/contains-duplicate-iii/ |
| **Solution file** | [02_contains_duplicate_iii.js](../solutions/02_contains_duplicate_iii.js) — open only after a real attempt |

## Problem

Given nums and two integers indexDiff (k) and valueDiff (t), return true if there are
indices i != j with |i - j| <= k and |nums[i] - nums[j]| <= t.

## Examples

```
Input: nums = [1,2,3,1], k = 3, t = 0   Output: true   (1 at index 0 and 3)
Input: nums = [1,5,9,1,5,9], k = 2, t = 3   Output: false
```

## Constraints & clarifying questions

```
- k >= 1, t >= 0; n up to 10^5 -> O(n k) is too slow for big k
- Values up to +-10^9: differences fit in doubles exactly
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sorted sliding window + ceiling* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * k) time. For each i check the next k indices.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Sliding window kept in a sorted structure)   O(n log k) time, O(k) space. Keep the last k values in a SortedList (TreeSet substitute).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- t = 0 -> plain "duplicate within k"
- k >= n -> whole array
- negative numbers
- single element -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k) time

```
For each i check the next k indices.
```

### APPROACH 2 — Optimal (Sliding window kept in a sorted structure)   O(n log k) time, O(k) space

```
Keep the last k values in a SortedList (TreeSet substitute). For nums[i], the closest
candidate is ceiling(nums[i] - t): the smallest stored value >= nums[i] - t. If it exists
and is <= nums[i] + t we found a pair. Then add nums[i] and, once the window has more
than k values, remove nums[i - k].
(Bucket approach: bucket id = floor(x / (t + 1)); same or adjacent buckets -> O(n).)

Dry run: nums = [1,5,9,1,5,9], k = 2, t = 3
  i=0: window {} -> add 1                 {1}
  i=1: ceiling(5-3=2) = none -> add 5     {1,5}
  i=2: ceiling(6) = none -> add 9; size 3 > 2 -> remove nums[0]=1   {5,9}
  i=3: ceiling(-2) = 5, 5 <= 1+3=4? no -> add 1; remove 5   {1,9}
  i=4: ceiling(2) = 9, 9 <= 8? no -> add 5; remove 9       {1,5}
  i=5: ceiling(6) = none -> false
```

### Edge cases

```
- t = 0 -> plain "duplicate within k"
- k >= n -> whole array
- negative numbers
- single element -> false
```

Full JavaScript solution with tests: [02_contains_duplicate_iii.js](../solutions/02_contains_duplicate_iii.js). Run it with `node 02_contains_duplicate_iii.js` from the solutions folder.

</details>

## Common mistakes

- Letting the window grow to k + 1 elements; remove `nums[i - k - 1]` before checking.
- Bucketing negatives with `Math.trunc` instead of `Math.floor`, which puts -1 and 1 in the same bucket.
- Only checking the element's own bucket; with bucket width `t + 1` you must also check the two neighbouring buckets.

## Related follow-ups

- [Sliding Window](../../../../07_Sliding_Window/README.md)
- Contains Duplicate II (LeetCode #219)
- [Count of Range Sum, sorted-list version](05_count_of_range_sum_sorted_list.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
