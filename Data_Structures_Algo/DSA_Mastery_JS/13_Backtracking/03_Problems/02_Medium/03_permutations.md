# Permutations

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | used array |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #46 — https://leetcode.com/problems/permutations/ |
| **Solution file** | [03_permutations.js](../solutions/03_permutations.js) — open only after a real attempt |

## Problem

Given an array of DISTINCT integers, return all possible orderings (permutations).

## Examples

```
Input: [1,2,3]   Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
Input: [0,1]     Output: [[0,1],[1,0]]
Input: [1]       Output: [[1]]
```

## Constraints & clarifying questions

```
- Distinct values? (yes; see Permutations II for duplicates)
- n <= 6 on LeetCode: n! grows fast (10! = 3.6 million)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *used array* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (insert into every position)   O(n * n!) time, O(n * n!) space. Build permutations of the first k elements, then insert element k+1 into every possible gap of every existing permutation.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking with used[])   O(n * n!) time, O(n) extra space. Order matters, so at every level we may pick ANY element that is not already in the path.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> [[]]  (one empty permutation)
- single element -> [[x]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (insert into every position)   O(n * n!) time, O(n * n!) space

```
Build permutations of the first k elements, then insert element k+1 into every
possible gap of every existing permutation. Iterative, no recursion needed.
  [] -> [[1]] -> [[2,1],[1,2]] -> [[3,2,1],[2,3,1],[2,1,3],[3,1,2],[1,3,2],[1,2,3]]
```

### APPROACH 2 — Optimal (Backtracking with used[])   O(n * n!) time, O(n) extra space

```
Order matters, so at every level we may pick ANY element that is not already in
the path. A boolean `used` array gives that check in O(1).
Record the path only when it is full (length n).

Dry run on [1,2]:
  go([])        used=[F,F]
    i=0 choose 1  path=[1] used=[T,F]
      i=0 used skip; i=1 choose 2 path=[1,2] -> full, record [1,2]; un-choose 2
    un-choose 1   path=[] used=[F,F]
    i=1 choose 2  path=[2] used=[F,T]
      i=0 choose 1 path=[2,1] -> record [2,1]; un-choose 1
    un-choose 2
```

### Edge cases

```
- [] -> [[]]  (one empty permutation)
- single element -> [[x]]
```

Full JavaScript solution with tests: [03_permutations.js](../solutions/03_permutations.js). Run it with `node 03_permutations.js` from the solutions folder.

</details>

## Common mistakes

- Using a start index (combination-style) so later elements can never come before earlier ones.
- Forgetting to reset `used[i] = false` after the recursive call.
- Using `path.includes(x)` to test "used": works only for distinct values and costs O(n) per check.

## Related follow-ups

- [Permutations II](04_permutations_ii.md)
- [Subsets](01_subsets.md)
- Next Permutation (LeetCode #31)
- Permutation Sequence (LeetCode #60)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
