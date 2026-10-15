# Combinations

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | start index, fixed size k, pruning |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #77 — https://leetcode.com/problems/combinations/ |
| **Solution file** | [05_combinations.js](../solutions/05_combinations.js) — open only after a real attempt |

## Problem

Given two integers n and k, return all combinations of k numbers chosen from 1..n.
Order inside a combination does not matter ([1,2] and [2,1] are the same).

## Examples

```
Input: n = 4, k = 2   Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
Input: n = 1, k = 1   Output: [[1]]
```

## Constraints & clarifying questions

```
- 1 <= k <= n <= 20
- Output size is C(n,k) = n! / (k!(n-k)!), e.g. C(20,10) = 184,756
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *start index, fixed size k, pruning* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * 2^n) time. Generate all 2^n subsets of 1..n (bit mask) and keep those with exactly k elements.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking with start index + pruning)   O(k * C(n,k)) time, O(k) extra. Same as subsets, but only record paths of length k, and stop early when there are not enough numbers left to fill the path: need = k - path.length numbers; available from i = n - i + 1 so i may go at most up to n - need + 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k === n -> one combination [1..n]
- k === 1 -> n single-element combinations
- k === 0 -> [[]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * 2^n) time

```
Generate all 2^n subsets of 1..n (bit mask) and keep those with exactly k elements.
Wasteful: for n=20,k=2 we build a million subsets to keep 190.
```

### APPROACH 2 — Optimal (Backtracking with start index + pruning)   O(k * C(n,k)) time, O(k) extra

```
Same as subsets, but only record paths of length k, and stop early when there are
not enough numbers left to fill the path:
  need = k - path.length numbers; available from i = n - i + 1
  so i may go at most up to n - need + 1.

Dry run n=4, k=2:
  go(1,[])
    i=1 [1]: go(2,[1]) i=2 [1,2] record; i=3 [1,3] record; i=4 [1,4] record
    i=2 [2]: go(3,[2]) i=3 [2,3] record; i=4 [2,4] record
    i=3 [3]: go(4,[3]) i=4 [3,4] record
    i=4: pruned, 4 > n - need + 1 = 4 - 2 + 1 = 3 (one number cannot fill two slots)
```

### Edge cases

```
- k === n -> one combination [1..n]
- k === 1 -> n single-element combinations
- k === 0 -> [[]]
```

Full JavaScript solution with tests: [05_combinations.js](../solutions/05_combinations.js). Run it with `node 05_combinations.js` from the solutions folder.

</details>

## Common mistakes

- Recording before `path.length === k`, which mixes in shorter combinations.
- Missing the pruning bound: when fewer than `k - path.length` numbers remain, the branch can never finish.
- Starting the loop at 0 when the numbers are 1..n (off by one).

## Related follow-ups

- [Subsets](01_subsets.md)
- [Combination Sum](06_combination_sum.md)
- Combination Sum III (LeetCode #216)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
