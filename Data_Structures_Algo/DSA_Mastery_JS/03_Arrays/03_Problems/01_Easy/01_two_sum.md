# Two Sum

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | hash map (one pass) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1 — https://leetcode.com/problems/two-sum/ |
| **Solution file** | [01_two_sum.js](../solutions/01_two_sum.js) — open only after a real attempt |

## Problem

Given an array of integers `nums` and an integer `target`, return the indices of
the two numbers that add up to `target`. Exactly one answer exists, and you may
not use the same element twice.

## Examples

```
Input: nums = [2, 7, 11, 15], target = 9   Output: [0, 1]   Explanation: 2 + 7 = 9
Input: nums = [3, 2, 4], target = 6        Output: [1, 2]   Explanation: 3 + 3 is not allowed (same index)
Input: nums = [3, 3], target = 6           Output: [0, 1]
```

## Constraints & clarifying questions

```
- Is the array sorted? (no -> otherwise two pointers would work, see 06_Two_Pointers)
- Can there be negative numbers? (yes)
- Return indices or values? (indices) Does the order of the pair matter? (no)
- Is there always exactly one solution? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *hash map (one pass)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Try every pair (i, j) with i &lt; j and check nums[i] + nums[j] === target.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (hash map, one pass)   O(n) time, O(n) space. For each number ask: "have I already seen target - num?" A Map from value -> index answers that in O(1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Duplicates that form the answer: [3, 3] -> the check happens BEFORE inserting, so index 0 is found for index 1
- Negative numbers and zero: [-1, 0, 1], target 0 -> [0, 2]
- Two elements only
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Try every pair (i, j) with i < j and check nums[i] + nums[j] === target.
```

### APPROACH 2 — Optimal (hash map, one pass)   O(n) time, O(n) space

```
For each number ask: "have I already seen target - num?" A Map from value -> index
answers that in O(1). If yes, done. If no, store the current number and move on.
One pass is enough because when we reach the SECOND number of the pair, the first
one is already in the map.

Dry run on [2, 7, 11, 15], target 9:
  i=0 num=2  need 7  not in map  -> map {2:0}
  i=1 num=7  need 2  in map at 0 -> return [0, 1]
```

### Edge cases

```
- Duplicates that form the answer: [3, 3] -> the check happens BEFORE inserting, so index 0 is found for index 1
- Negative numbers and zero: [-1, 0, 1], target 0 -> [0, 2]
- Two elements only
```

Full JavaScript solution with tests: [01_two_sum.js](../solutions/01_two_sum.js). Run it with `node 01_two_sum.js` from the solutions folder.

</details>

## Common mistakes

- Storing the current number in the map *before* checking for its complement, so `[3]` with target 6 wrongly pairs an element with itself.
- Returning the values instead of the indices the problem asks for.
- Sorting the array to use two pointers and losing the original indices.

## Related follow-ups

- [Two Sum II - Input Array Is Sorted](../../../06_Two_Pointers/03_Problems/02_Medium/03_two_sum_ii_sorted.md) — same goal, sorted input lets two pointers replace the map
- [3Sum](../02_Medium/17_3sum.md) — fix one number, then solve Two Sum on the rest
- [4Sum II](../../../05_Hashing/03_Problems/02_Medium/14_four_sum_ii.md) — the complement-lookup idea applied to pair sums

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
