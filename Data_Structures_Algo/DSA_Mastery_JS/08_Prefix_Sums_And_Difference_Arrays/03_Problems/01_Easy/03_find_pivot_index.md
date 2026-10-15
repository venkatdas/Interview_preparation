# Find Pivot Index

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Easy |
| **Pattern** | left sum vs right sum |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #724 — https://leetcode.com/problems/find-pivot-index/ |
| **Solution file** | [03_find_pivot_index.js](../solutions/03_find_pivot_index.js) — open only after a real attempt |

## Problem

Return the leftmost index where the sum of all numbers strictly to its left equals the
sum of all numbers strictly to its right. Return -1 if none exists.

## Examples

```
Input: [1, 7, 3, 6, 5, 6]   Output: 3   Explanation: left 1+7+3 = 11, right 5+6 = 11
Input: [1, 2, 3]            Output: -1
Input: [2, 1, -1]           Output: 0   Explanation: left sum is 0 (nothing), right 1 + -1 = 0
```

## Constraints & clarifying questions

```
- Edge pivots allowed (index 0 or n-1 with an empty side summing to 0)? (yes)
- Return the leftmost? (yes)
- Negatives? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *left sum vs right sum* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each index, sum the left part and the right part separately.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (total sum + running left sum)   O(n) time, O(1) space. rightSum(i) = total - leftSum(i) - nums[i].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single element -> 0 (both sides empty)
- Empty -> -1
- Pivot at the last index: [1, -1, 2] -> 2
- No pivot -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each index, sum the left part and the right part separately.
```

### APPROACH 2 — Optimal (total sum + running left sum)   O(n) time, O(1) space

```
rightSum(i) = total - leftSum(i) - nums[i]. So walk once keeping leftSum:
  if leftSum === total - leftSum - nums[i] -> i is the pivot
  leftSum += nums[i]
No prefix ARRAY needed: the running sum is a prefix sum computed on the fly.

Dry run on [1, 7, 3, 6, 5, 6], total 28:
  i=0 left 0,  right 28-0-1 = 27  no; left=1
  i=1 left 1,  right 28-1-7 = 20  no; left=8
  i=2 left 8,  right 28-8-3 = 17  no; left=11
  i=3 left 11, right 28-11-6 = 11 YES -> 3
```

### Edge cases

```
- Single element -> 0 (both sides empty)
- Empty -> -1
- Pivot at the last index: [1, -1, 2] -> 2
- No pivot -> -1
```

Full JavaScript solution with tests: [03_find_pivot_index.js](../solutions/03_find_pivot_index.js). Run it with `node 03_find_pivot_index.js` from the solutions folder.

</details>

## Common mistakes

- Including nums[i] in the left sum before comparing.
- Returning the last pivot instead of the leftmost one.
- Forgetting index 0 can be the pivot (left sum is 0).

## Related follow-ups

- [Product of Array Except Self](../02_Medium/04_product_of_array_except_self.md) — left and right aggregates around i
- Find the Middle Index in Array (LeetCode #1991) — the same problem
- [Ways to Split Array Into Three Subarrays](../03_Hard/14_ways_to_split_array.md) — splits judged by prefix sums

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
