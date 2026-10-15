# Pascal's Triangle

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Easy |
| **Pattern** | build row from previous |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #118 — https://leetcode.com/problems/pascals-triangle/ |
| **Solution file** | [05_pascals_triangle.js](../solutions/05_pascals_triangle.js) — open only after a real attempt |

## Problem

Return the first numRows rows of Pascal's triangle. Each row starts and ends with 1, and
every other entry is the sum of the two entries directly above it.

## Examples

```
Input: 5   Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
Input: 1   Output: [[1]]
```

## Constraints & clarifying questions

```
- numRows >= 1? (yes; handle 0 anyway -> [])
- Row values can get large (binomials); fine for numRows <= 30
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *build row from previous* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (binomial formula)   O(n^2 * n) time. Entry (r, c) is C(r, c) = r!

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (build each row from the previous one)   O(n^2) time, O(n^2) output. Row r has r + 1 entries.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- numRows = 0 -> []
- numRows = 1 -> [[1]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (binomial formula)   O(n^2 * n) time

```
Entry (r, c) is C(r, c) = r! / (c! (r-c)!). Compute each with a loop. Works but risks
floating point error for big rows and recomputes a lot.
```

### APPROACH 2 — Optimal (build each row from the previous one)   O(n^2) time, O(n^2) output

```
Row r has r + 1 entries. row[0] = row[r] = 1, and row[c] = prev[c-1] + prev[c].
This is the "jagged 2D array" shape: rows of different lengths, each built from the last.

Dry run for numRows = 4:
  [1]
  [1,1]
  [1, 1+1, 1] = [1,2,1]
  [1, 1+2, 2+1, 1] = [1,3,3,1]
```

### Edge cases

```
- numRows = 0 -> []
- numRows = 1 -> [[1]]
```

Full JavaScript solution with tests: [05_pascals_triangle.js](../solutions/05_pascals_triangle.js). Run it with `node 05_pascals_triangle.js` from the solutions folder.

</details>

## Common mistakes

- Off-by-one on numRows (returning one row too many or too few).
- Reading `prev[j - 1]` for j = 0; the first and last entries of each row are always 1.
- Pushing the same row array object twice and mutating it.

## Related follow-ups

- Pascal's Triangle II (LeetCode #119) — only one row, O(k) space
- [Unique Paths](../../../29_Dynamic_Programming/04_Grid_DP/03_Problems/02_Medium/01_unique_paths.md) — the same binomial numbers in a grid
- [Count Primes](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/02_Medium/08_count_primes.md) — another table-building math problem

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
