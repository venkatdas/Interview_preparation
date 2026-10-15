# Longest Increasing Path in a Matrix

| | |
|---|---|
| **Topic** | Topological Sorting |
| **Difficulty** | Hard |
| **Pattern** | DFS + memo as topological DP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #329 — https://leetcode.com/problems/longest-increasing-path-in-a-matrix/ |
| **Solution file** | [07_longest_increasing_path_in_matrix.js](../solutions/07_longest_increasing_path_in_matrix.js) — open only after a real attempt |

## Problem

Given an m x n integer matrix, return the length of the longest path where each step
moves to a 4-neighbour with a STRICTLY larger value.

## Examples

```
Input: [[9,9,4],[6,6,8],[2,1,1]]   Output: 4   (1 -> 2 -> 6 -> 9)
Input: [[3,4,5],[3,2,6],[2,2,1]]   Output: 4   (3 -> 4 -> 5 -> 6)
Input: [[1]]                       Output: 1
```

## Constraints & clarifying questions

```
- Strictly increasing? (yes - so there can be no cycles: the graph "smaller -> larger"
  is automatically a DAG, which is why memoisation works without a visited set)
- Diagonals? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS + memo as topological DP* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain DFS from every cell, no memo)   exponential. From every cell, DFS to every larger neighbour, return 1 + max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS + memo = DP in topological order)   O(m*n) time, O(m*n). longest(r, c) = 1 + max(longest(neighbour)) over strictly larger neighbours.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1 x 1 -> 1
- all equal values -> 1 (no strictly larger neighbour)
- a snake path through the whole matrix -> m*n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain DFS from every cell, no memo)   exponential

```
From every cell, DFS to every larger neighbour, return 1 + max. Each cell is recomputed
many times - O(2^(m+n)) in the worst case.
```

### APPROACH 2 — Optimal (DFS + memo = DP in topological order)   O(m*n) time, O(m*n)

```
longest(r, c) = 1 + max(longest(neighbour)) over strictly larger neighbours.
Because edges only go to larger values, the graph is a DAG, and memoised DFS computes
every cell exactly once, AFTER its successors - that is a topological order computed
implicitly. (The explicit alternative: Kahn's on the "smaller -> larger" edges, counting
levels - also O(m*n).)

Dry run on [[9,9,4],[6,6,8],[2,1,1]]:
  longest(2,1) [value 1]: neighbours (2,0)=2 -> longest(2,0)
    longest(2,0) [2]: neighbours (1,0)=6 -> longest(1,0)
      longest(1,0) [6]: neighbours (0,0)=9 -> 1 (no larger neighbours) ... = 2
    = 3
  = 4. memo stores every result; later cells reuse them. Answer 4.
```

### Edge cases

```
- 1 x 1 -> 1
- all equal values -> 1 (no strictly larger neighbour)
- a snake path through the whole matrix -> m*n
```

Full JavaScript solution with tests: [07_longest_increasing_path_in_matrix.js](../solutions/07_longest_increasing_path_in_matrix.js). Run it with `node 07_longest_increasing_path_in_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Keeping a visited set for the current path; it is unnecessary because strictly increasing moves can never loop.
- Not memoising, which makes the DFS exponential.
- Allowing equal neighbours; the path must be STRICTLY increasing.

## Related follow-ups

- [Longest Increasing Path in a Matrix (DP view)](../../../29_Dynamic_Programming/04_Grid_DP/03_Problems/03_Hard/08_longest_increasing_path_in_matrix.md)
- [Longest Increasing Subsequence](../../../29_Dynamic_Programming/03_Strings_And_Sequences/03_Problems/02_Medium/03_longest_increasing_subsequence.md)
- [Pacific Atlantic Water Flow](../../../24_Graph_Traversal/03_Problems/02_Medium/14_pacific_atlantic_water_flow.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
