# Combination Sum II

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | no reuse, sort + skip duplicates |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #40 — https://leetcode.com/problems/combination-sum-ii/ |
| **Solution file** | [07_combination_sum_ii.js](../solutions/07_combination_sum_ii.js) — open only after a real attempt |

## Problem

Given a list of candidates (MAY contain duplicates) and a target, find all unique
combinations that sum to target. Each candidate may be used ONCE.

## Examples

```
Input: candidates = [10,1,2,7,6,1,5], target = 8
Output: [[1,1,6],[1,2,5],[1,7],[2,6]]
Input: candidates = [2,5,2,1,2], target = 5   Output: [[1,2,2],[5]]
```

## Constraints & clarifying questions

```
- Duplicates in input, but output combinations must be unique
- Each index used at most once (not each VALUE: [1,1,6] uses two different 1s)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *no reuse, sort + skip duplicates* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * 2^n). Enumerate all subsets by bit mask, keep the ones summing to target, sort each and dedupe through a Set of keys.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort + skip duplicates + no reuse + prune)   O(2^n) worst, O(n) extra. This is Subsets II + Combination Sum glued together: - sort - recurse with i + 1 (no reuse) - skip when i > start && sorted[i] === sorted[i-1] (same value at the same level) - break when sorted[i] > remaining Dry run candidates=[2,5,2,1,2] -> sorted [1,2,2,2,5

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- target not reachable -> []
- many equal candidates: [1,1,1,1], target 2 -> [[1,1]] once
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * 2^n)

```
Enumerate all subsets by bit mask, keep the ones summing to target, sort each and
dedupe through a Set of keys.
```

### APPROACH 2 — Optimal (sort + skip duplicates + no reuse + prune)   O(2^n) worst, O(n) extra

```
This is Subsets II + Combination Sum glued together:
  - sort
  - recurse with i + 1 (no reuse)
  - skip when i > start && sorted[i] === sorted[i-1] (same value at the same level)
  - break when sorted[i] > remaining

Dry run candidates=[2,5,2,1,2] -> sorted [1,2,2,2,5], target 5:
  go(0,[],5)
    i=0 take 1 -> go(1,[1],4)
      i=1 take 2 -> go(2,[1,2],2)
        i=2 take 2 -> go(3,[1,2,2],0) record [1,2,2]
        i=3 skip (dup of i=2 at this level); i=4 5>2 break
      i=2 skip dup; i=3 skip dup; i=4: 5 > 4 break
    i=1 take 2 -> go(2,[2],3): take 2 -> [2,2] rem 1 -> i=3 dup skip... nothing; 5 > 3 break
    i=2, i=3 skip dup
    i=4 take 5 -> go(5,[5],0) record [5]
```

### Edge cases

```
- target not reachable -> []
- many equal candidates: [1,1,1,1], target 2 -> [[1,1]] once
```

Full JavaScript solution with tests: [07_combination_sum_ii.js](../solutions/07_combination_sum_ii.js). Run it with `node 07_combination_sum_ii.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to sort, so duplicate values are not adjacent and the skip rule fails.
- Skipping duplicates with `i > 0` instead of `i > start`, losing answers like `[1, 1, 6]`.
- Using `continue` instead of `break` when a sorted candidate exceeds the remaining target (correct but slower).

## Related follow-ups

- [Combination Sum](06_combination_sum.md)
- [Subsets II](02_subsets_ii.md)
- [Target Sum](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/07_target_sum.md) (29_Dynamic_Programming/02_Knapsack)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
