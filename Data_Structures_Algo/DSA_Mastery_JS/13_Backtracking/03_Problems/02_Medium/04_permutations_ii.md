# Permutations II

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | used array + skip duplicates |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #47 — https://leetcode.com/problems/permutations-ii/ |
| **Solution file** | [04_permutations_ii.js](../solutions/04_permutations_ii.js) — open only after a real attempt |

## Problem

Given an array that may contain duplicates, return all UNIQUE permutations.

## Examples

```
Input: [1,1,2]   Output: [[1,1,2],[1,2,1],[2,1,1]]
                 Explanation: swapping the two 1s gives the same ordering, count it once.
Input: [1,2,3]   Output: all 6 permutations
```

## Constraints & clarifying questions

```
- Can I sort the input? (yes)
- How many duplicates? If all n are equal there is just one permutation.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *used array + skip duplicates* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * n!) time, O(n * n!) space. Generate all n!

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort + skip duplicates with the used[] rule)   O(n * n!) worst, O(n) extra. Sort so duplicates are adjacent.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [1,1,1] -> [[1,1,1]]
- [] -> [[]]
- no duplicates -> same as Permutations
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * n!) time, O(n * n!) space

```
Generate all n! permutations (with indices, so duplicates are "different"), then
dedupe with a Set of joined strings.
```

### APPROACH 2 — Optimal (sort + skip duplicates with the used[] rule)   O(n * n!) worst, O(n) extra

```
Sort so duplicates are adjacent. At each level, if nums[i] === nums[i-1] and
nums[i-1] is NOT used, skip nums[i]. Why? If the earlier copy is unused, it means
we already finished (or skipped) the branch that puts "a 1" in this position; using
the second copy here would rebuild the identical branch. We only let the copies be
used in order: first 1 before second 1.

Dry run on [1,1,2] (indices a=1, b=1, c=2):
  level 0: i=0 take a ... produces [1,1,2],[1,2,1]
           i=1 (b): nums[1]==nums[0] and used[0]=false -> SKIP (would duplicate the branch above)
           i=2 take 2 -> [2,?,?]: i=0 take a -> i=1 take b (used[0] true -> allowed) -> [2,1,1]
                                  i=1 (b) with used[0]=false -> SKIP
  3 permutations.
```

### Edge cases

```
- [1,1,1] -> [[1,1,1]]
- [] -> [[]]
- no duplicates -> same as Permutations
```

Full JavaScript solution with tests: [04_permutations_ii.js](../solutions/04_permutations_ii.js). Run it with `node 04_permutations_ii.js` from the solutions folder.

</details>

## Common mistakes

- Copying the subsets skip rule (`i > start`) — permutations have no start index.
- Getting the `!used[i-1]` condition backwards, which either keeps duplicates or drops every result.
- Not sorting the input before applying the skip rule.

## Related follow-ups

- [Permutations](03_permutations.md)
- [Subsets II](02_subsets_ii.md)
- [Combination Sum II](07_combination_sum_ii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
