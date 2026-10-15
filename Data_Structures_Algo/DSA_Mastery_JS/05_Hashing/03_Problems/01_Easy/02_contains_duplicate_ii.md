# Contains Duplicate II

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Easy |
| **Pattern** | index map |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #219 — https://leetcode.com/problems/contains-duplicate-ii/ |
| **Solution file** | [02_contains_duplicate_ii.js](../solutions/02_contains_duplicate_ii.js) — open only after a real attempt |

## Problem

Given an integer array nums and an integer k, return true if there are two
distinct indices i and j such that nums[i] === nums[j] and |i - j| <= k.

## Examples

```
Input: nums = [1, 2, 3, 1], k = 3       Output: true    Explanation: 1 at index 0 and 3, distance 3
Input: nums = [1, 0, 1, 1], k = 1       Output: true    Explanation: 1 at index 2 and 3
Input: nums = [1, 2, 3, 1, 2, 3], k = 2 Output: false   Explanation: repeats are 3 apart
```

## Constraints & clarifying questions

```
- Can k be 0? (then the answer is always false, two distinct indices can't be 0 apart)
- Can k be larger than the array? (yes -> same as plain "contains duplicate")
- Negative numbers? (fine)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *index map* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * k) time, O(1) space. For each index i, look at the next k elements and compare.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (index map)   O(n) time, O(n) space. Store value -> the LAST index where we saw it.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 -> false
- empty / single element -> false
- duplicates farther than k apart -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k) time, O(1) space

```
For each index i, look at the next k elements and compare.
```

### APPROACH 2 — Optimal (index map)   O(n) time, O(n) space

```
Store value -> the LAST index where we saw it. When we see a value again, the
closest earlier copy is the last one, so only that distance matters.
  for each i:
    if lastIndex has nums[i] and i - lastIndex.get(nums[i]) <= k -> true
    lastIndex.set(nums[i], i)   (always overwrite with the newest index)

Dry run on [1, 2, 3, 1], k = 3:
  i=0 1 -> not seen, map {1:0}
  i=1 2 -> not seen, map {1:0, 2:1}
  i=2 3 -> not seen, map {1:0, 2:1, 3:2}
  i=3 1 -> seen at 0, 3 - 0 = 3 <= 3 -> true

Alternative: a sliding Set of the last k values (remove nums[i - k] as you go).
That keeps space at O(k) instead of O(n).
```

### Edge cases

```
- k = 0 -> false
- empty / single element -> false
- duplicates farther than k apart -> false
```

Full JavaScript solution with tests: [02_contains_duplicate_ii.js](../solutions/02_contains_duplicate_ii.js). Run it with `node 02_contains_duplicate_ii.js` from the solutions folder.

</details>

## Common mistakes

- Storing only the first index of each value; you need the *most recent* index to measure the smallest distance.
- Off-by-one on the window: the condition is `i - j <= k`, inclusive.
- Keeping a Set window but forgetting to delete `nums[i - k]` when it slides out.

## Related follow-ups

- [Contains Duplicate](../../../03_Arrays/03_Problems/01_Easy/03_contains_duplicate.md) — no distance constraint
- [Contains Duplicate III](../../../35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/03_Problems/03_Hard/02_contains_duplicate_iii.md) — add a value tolerance
- [Longest Substring Without Repeating Characters](../../../07_Sliding_Window/03_Problems/02_Medium/03_longest_substring_without_repeating.md) — the window-with-set idea

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
