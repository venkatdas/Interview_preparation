# Unique Paths

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Medium |
| **Pattern** | binomial coefficient C(m+n-2, m-1) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #62 — https://leetcode.com/problems/unique-paths/ |
| **Solution file** | [02_unique_paths.js](../solutions/02_unique_paths.js) — open only after a real attempt |

## Problem

A robot stands in the top-left cell of an `m x n` grid. It may only step right or down.
Count how many different routes take it to the bottom-right cell.

## Examples

```
Input: m = 3, n = 7   Output: 28
Input: m = 3, n = 2   Output: 3     (RDD, DRD, DDR)
Input: m = 1, n = 1   Output: 1     (already at the goal)
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 100, and the answer is promised to fit in 2 * 10^9
- Outside that promise, should we return a BigInt? (good thing to ask)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Every route is a word made of D and R moves. Read *Counting principles* and *Combinations* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Grid DP: ways[r][c] = ways[r-1][c] + ways[r][c-1]. One rolling row is enough.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Any route has exactly m-1 downs and n-1 rights, in some order. Choose which of the m+n-2 positions are downs: C(m+n-2, m-1).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Compute C(N, k) multiplicatively with k = min(m-1, n-1). For big grids the intermediate product passes 2^53, so use BigInt.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m*n) time, O(n) space

```
Grid DP with one rolling row: row[c] += row[c-1] for every row after the first.
```

### APPROACH 2 — Optimal (combinatorial formula)   O(min(m, n)) time, O(1) space

```
N = m+n-2, k = min(m-1, n-1)
res = 1
for i in 1..k: res = res * (N-k+i) / i   // res is C(N-k+i, i): always an integer
```

### Dry run

```
m = 3, n = 7 -> N = 8, k = 2
  i=1: res = 1 * 7 / 1 = 7
  i=2: res = 7 * 8 / 2 = 28   -> 28
```

### Complexity

- Brute force: O(m*n) time, O(n) space
- Optimal: O(min(m, n)) time, O(1) space

### Edge cases

```
- m = 1 or n = 1 -> 1
- (m, n) and (n, m) give the same answer
- 100 x 100 is about 2.3e58 -> needs BigInt
```

### Common mistakes

- Dividing at the end instead of each step (overflows much earlier).
- Using floating point division with doubles for large values and rounding wrong.
- Off by one: the robot makes m-1 downs, not m.

Full JavaScript solution with tests: [02_unique_paths.js](../solutions/02_unique_paths.js). Run it with `node 02_unique_paths.js` from the solutions folder.

</details>

## Related follow-ups

- Unique Paths II (LeetCode #63) — obstacles break the formula, back to DP
- Minimum Path Sum (LeetCode #64)
- Number of lattice paths below the diagonal — Catalan numbers

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
