# Subsets II

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | sort + skip duplicates |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #90 — https://leetcode.com/problems/subsets-ii/ |
| **Solution file** | [02_subsets_ii.js](../solutions/02_subsets_ii.js) — open only after a real attempt |

## Problem

Given an array of integers that MAY contain duplicates, return all possible
subsets without duplicate subsets.

## Examples

```
Input: [1,2,2]   Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
                 Explanation: [1,2] must appear once, even though there are two 2s.
Input: [0]       Output: [[],[0]]
```

## Constraints & clarifying questions

```
- Can I sort the input? (yes, order does not matter for subsets)
- Are [1,2] and [2,1] the same subset? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + skip duplicates* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * 2^n) time, O(n * 2^n) space. Generate all subsets as in problem 01, sort each one, turn it into a string key like "1,2", and use a Set to drop duplicates.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort + skip duplicates at the same level)   O(n * 2^n) time, O(n) extra. Sort first so equal values sit next to each other.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all elements equal [2,2,2] -> [[],[2],[2,2],[2,2,2]]
- no duplicates -> same as Subsets
- [] -> [[]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * 2^n) time, O(n * 2^n) space

```
Generate all subsets as in problem 01, sort each one, turn it into a string key
like "1,2", and use a Set to drop duplicates.
```

### APPROACH 2 — Optimal (sort + skip duplicates at the same level)   O(n * 2^n) time, O(n) extra

```
Sort first so equal values sit next to each other. In the for-loop, if nums[i]
equals nums[i-1] AND i > start, we already explored a branch starting with this
value at this level -> skip. (i > start, not i > 0, so that going DEEPER with a
repeated value is still allowed: [2,2] is a real subset.)

Dry run on [1,2,2] (sorted):
  go(0,[])   record []
    i=0 push 1 -> go(1,[1]) record [1]
      i=1 push 2 -> go(2,[1,2]) record [1,2]
        i=2 push 2 -> go(3,[1,2,2]) record [1,2,2]   (i=2 == start=2 -> allowed)
      i=2: nums[2]==nums[1] and 2 > start(1) -> SKIP  (would repeat [1,2])
    i=1 push 2 -> go(2,[2]) record [2]
      i=2 push 2 -> go(3,[2,2]) record [2,2]
    i=2: nums[2]==nums[1] and 2 > start(0) -> SKIP  (would repeat [2])
  6 subsets.
```

### Edge cases

```
- all elements equal [2,2,2] -> [[],[2],[2,2],[2,2,2]]
- no duplicates -> same as Subsets
- [] -> [[]]
```

Full JavaScript solution with tests: [02_subsets_ii.js](../solutions/02_subsets_ii.js). Run it with `node 02_subsets_ii.js` from the solutions folder.

</details>

## Common mistakes

- Skipping duplicates without sorting first, so equal values are not adjacent and the skip rule misses them.
- Using `i > 0` instead of `i > start` in the skip rule, which wrongly removes valid subsets like `[2, 2]`.
- Deduplicating at the end with a Set of strings: correct but wastes exponential work.

## Related follow-ups

- [Subsets](01_subsets.md)
- [Permutations II](04_permutations_ii.md)
- [Combination Sum II](07_combination_sum_ii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
