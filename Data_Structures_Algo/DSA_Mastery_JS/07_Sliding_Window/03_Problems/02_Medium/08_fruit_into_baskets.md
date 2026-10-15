# Fruit Into Baskets

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | variable, at most 2 distinct |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #904 — https://leetcode.com/problems/fruit-into-baskets/ |
| **Solution file** | [08_fruit_into_baskets.js](../solutions/08_fruit_into_baskets.js) — open only after a real attempt |

## Problem

fruits[i] is the type of fruit on tree i. You have two baskets, each holds one type
(unlimited amount). Starting at any tree, pick one fruit from every tree moving right,
stopping when you'd need a third type. Return the max number of fruits you can pick.
In plain words: longest contiguous subarray with at most 2 distinct values.

## Examples

```
Input: [1, 2, 1]            Output: 3
Input: [0, 1, 2, 2]         Output: 3   Explanation: [1, 2, 2]
Input: [1, 2, 3, 2, 2]      Output: 4   Explanation: [2, 3, 2, 2]
```

## Constraints & clarifying questions

```
- Exactly 2 baskets = at most 2 distinct types? (yes; the code takes k as a parameter)
- Contiguous? (yes, you can't skip trees)
- Single tree? (1)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *variable, at most 2 distinct* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every start, extend right while the distinct count stays &lt;= 2.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (variable window, at most k distinct via Map)   O(n) time, O(k) space. expand: counts[fruit]++ while counts.size > 2: counts[fruits[left]]--, delete at 0, left++ record right - left + 1 The Map's size IS the number of distinct types in the window, so deleting zero-count entries is essential.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All same type -> n
- Only 1 or 2 trees
- Empty -> 0
- Exactly 2 types alternating -> n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start, extend right while the distinct count stays <= 2.
```

### APPROACH 2 — Optimal (variable window, at most k distinct via Map)   O(n) time, O(k) space

```
expand: counts[fruit]++
  while counts.size > 2: counts[fruits[left]]--, delete at 0, left++
  record right - left + 1
The Map's size IS the number of distinct types in the window, so deleting zero-count
entries is essential.

Dry run on [1, 2, 3, 2, 2]:
  r=0 {1:1} len 1 | r=1 {1:1,2:1} len 2
  r=2 {1:1,2:1,3:1} size 3 -> drop 1 (left=1) {2:1,3:1} len 2
  r=3 {2:2,3:1} len 3 | r=4 {2:3,3:1} len 4
  best 4
```

### Edge cases

```
- All same type -> n
- Only 1 or 2 trees
- Empty -> 0
- Exactly 2 types alternating -> n
```

Full JavaScript solution with tests: [08_fruit_into_baskets.js](../solutions/08_fruit_into_baskets.js). Run it with `node 08_fruit_into_baskets.js` from the solutions folder.

</details>

## Common mistakes

- Deleting a fruit type from the map when its count reaches 0 is required; otherwise `map.size` overcounts distinct types.
- Treating it as "two most frequent fruits" instead of "longest contiguous run with at most two types".
- Shrinking only one step when more are needed (use `while`).

## Related follow-ups

- Longest Substring with At Most K Distinct Characters (LeetCode #340) — the general k version
- [Subarrays with K Different Integers](../03_Hard/11_subarrays_with_k_different_integers.md) — count windows with exactly k types
- [Longest Substring Without Repeating Characters](03_longest_substring_without_repeating.md) — same grow/shrink template

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
