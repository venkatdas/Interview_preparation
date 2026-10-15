# Combination Sum

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | reuse allowed (pass i), prune on remaining |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #39 — https://leetcode.com/problems/combination-sum/ |
| **Solution file** | [06_combination_sum.js](../solutions/06_combination_sum.js) — open only after a real attempt |

## Problem

Given an array of DISTINCT positive integers `candidates` and a `target`, return all
unique combinations where the chosen numbers sum to target. The SAME number may be
used an unlimited number of times.

## Examples

```
Input: candidates = [2,3,6,7], target = 7   Output: [[2,2,3],[7]]
Input: candidates = [2,3,5],   target = 8   Output: [[2,2,2,2],[2,3,3],[3,5]]
Input: candidates = [2],       target = 1   Output: []
```

## Constraints & clarifying questions

```
- All candidates positive? (yes, otherwise infinite loops with reuse)
- Distinct candidates? (yes; Combination Sum II handles duplicates + no reuse)
- Are [2,2,3] and [2,3,2] the same? (yes, one combination)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reuse allowed (pass i), prune on remaining* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   exponential, worse than optimal. Try every multiset: for each candidate, try using it 0,1,2,...

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- target smaller than every candidate -> []
- a candidate equal to target -> [[target]] is one of the answers
- target 0 -> [[]] (usually excluded by constraints, target >= 1)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   exponential, worse than optimal

```
Try every multiset: for each candidate, try using it 0,1,2,... times (up to target/c),
recursively over the candidate list. Correct, but it explores many counts that
overshoot the target before checking.
```

### APPROACH 2 — Optimal (Backtracking, pass `i` not `i+1`, prune on remaining)

```
O(n^(target/min)) time worst case, O(target/min) stack
Standard start-index backtracking. The only differences from subsets:
  - reuse allowed  -> recurse with go(i, ...) instead of go(i + 1, ...)
  - track `remaining`; record when it hits 0; prune when a candidate exceeds it
    (sort first so we can `break`, not just `continue`).

Dry run candidates=[2,3,6,7], target=7:
  go(0, [], 7)
    i=0 take 2 -> go(0,[2],5)
      i=0 take 2 -> go(0,[2,2],3)
        i=0 take 2 -> go(0,[2,2,2],1): 2 > 1 break
        i=1 take 3 -> go(1,[2,2,3],0): record [2,2,3]
        i=2: 6 > 3 break
      i=1 take 3 -> go(1,[2,3],2): 3 > 2 break
      i=2: 6 > 5 break
    i=1 take 3 -> go(1,[3],4): take 3 -> [3,3] rem 1 -> break; 6 > 4 break
    i=2 take 6 -> go(2,[6],1): break
    i=3 take 7 -> go(3,[7],0): record [7]
```

### Edge cases

```
- target smaller than every candidate -> []
- a candidate equal to target -> [[target]] is one of the answers
- target 0 -> [[]] (usually excluded by constraints, target >= 1)
```

Full JavaScript solution with tests: [06_combination_sum.js](../solutions/06_combination_sum.js). Run it with `node 06_combination_sum.js` from the solutions folder.

</details>

## Common mistakes

- Recursing with `i + 1`, which forbids reusing a candidate (that is Combination Sum II).
- Recursing from index 0, which produces `[2,3,2]` and `[3,2,2]` as different answers.
- Not stopping when the remaining target goes negative, so the search never ends with reuse allowed.

## Related follow-ups

- [Combination Sum II](07_combination_sum_ii.md)
- [Combination Sum IV](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/06_combination_sum_iv.md) (29_Dynamic_Programming/02_Knapsack)
- [Coin Change II](../../../29_Dynamic_Programming/02_Knapsack/03_Problems/02_Medium/05_coin_change_ii.md) (29_Dynamic_Programming/02_Knapsack)
- [Combinations](05_combinations.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
