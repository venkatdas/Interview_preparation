# Two Sum

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Easy |
| **Pattern** | complement lookup |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1 — https://leetcode.com/problems/two-sum/ |
| **Solution file** | [01_two_sum.js](../solutions/01_two_sum.js) — open only after a real attempt |

## Problem

Given an array of integers nums and an integer target, return the indices of the
two numbers that add up to target. Exactly one answer exists, and you may not use
the same element twice.

## Examples

```
Input: nums = [2, 7, 11, 15], target = 9   Output: [0, 1]   Explanation: 2 + 7 = 9
Input: nums = [3, 2, 4], target = 6        Output: [1, 2]   Explanation: 3 + 3 is NOT allowed (same index)
Input: nums = [3, 3], target = 6           Output: [0, 1]
```

## Constraints & clarifying questions

```
- Is exactly one answer guaranteed? (yes -> we can return as soon as we find it)
- Can numbers be negative? (yes, hashing doesn't care)
- Does the order of the returned indices matter? (no)
- Is the array sorted? (no -> if it were, two pointers would use O(1) space; see 06_Two_Pointers)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *complement lookup* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every pair (i, j) with i &lt; j check nums[i] + nums[j] === target.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (complement lookup with a Map)   O(n) time, O(n) space. The inner loop of the brute force only SEARCHES for one specific value: target - nums[i].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Two equal numbers that form the answer: [3, 3], 6 -> [0, 1] (check-then-insert handles it)
- Negative numbers and zero: [-1, 0, 1], 0 -> [0, 2]
- Duplicates that are NOT the answer: [3, 2, 4], 6 -> [1, 2], not [0, 0]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every pair (i, j) with i < j check nums[i] + nums[j] === target.
Two nested loops. Fine for tiny inputs, too slow for 10^5 elements.
```

### APPROACH 2 — Optimal (complement lookup with a Map)   O(n) time, O(n) space

```
The inner loop of the brute force only SEARCHES for one specific value:
target - nums[i]. A hash map answers "have I seen this value, and where?" in O(1).
Walk the array once. For each number:
  1. complement = target - num
  2. if the map already has complement -> answer is [map.get(complement), i]
  3. otherwise store num -> i in the map
Checking BEFORE inserting guarantees we never pair an element with itself.

Dry run on nums = [2, 7, 11, 15], target = 9:
  i=0 num=2  complement=7  map has 7? no   -> map = {2:0}
  i=1 num=7  complement=2  map has 2? YES  -> return [0, 1]
```

### Edge cases

```
- Two equal numbers that form the answer: [3, 3], 6 -> [0, 1] (check-then-insert handles it)
- Negative numbers and zero: [-1, 0, 1], 0 -> [0, 2]
- Duplicates that are NOT the answer: [3, 2, 4], 6 -> [1, 2], not [0, 0]
```

Full JavaScript solution with tests: [01_two_sum.js](../solutions/01_two_sum.js). Run it with `node 01_two_sum.js` from the solutions folder.

</details>

## Common mistakes

- Inserting the current value into the map before looking up its complement, which lets an element pair with itself.
- Overwriting an earlier index for a duplicate value and then worrying about it; with check-then-insert order, duplicates like `[3,3]` work naturally.
- Using `if (map.get(x))` as an existence check; index 0 is falsy. Use `map.has(x)`.

## Related follow-ups

- [Two Sum (Arrays)](../../../03_Arrays/03_Problems/01_Easy/01_two_sum.md) — the same problem in the arrays topic
- [Two Sum II - Input Array Is Sorted](../../../06_Two_Pointers/03_Problems/02_Medium/03_two_sum_ii_sorted.md) — sorted input, no map needed
- [4Sum II](../02_Medium/14_four_sum_ii.md) — pair sums with a complement map

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
