# Pascal's Triangle

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Easy |
| **Pattern** | Pascal's rule C(r,c)=C(r-1,c-1)+C(r-1,c) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #118 — https://leetcode.com/problems/pascals-triangle/ |
| **Solution file** | [01_pascals_triangle.js](../solutions/01_pascals_triangle.js) — open only after a real attempt |

## Problem

Given a whole number `numRows`, build the first `numRows` rows of Pascal's triangle.
Each row begins and ends with 1. Every inner value equals the sum of the two values
directly above it in the previous row.

## Examples

```
Input: numRows = 5   Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
Input: numRows = 1   Output: [[1]]
```

## Constraints & clarifying questions

```
- 1 <= numRows <= 30 (values stay far below 2^53; plain numbers are fine)
- numRows = 0? (return [])
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Each cell is a binomial coefficient C(r, c). Re-read *Pascal's triangle* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Compute every cell on its own with the multiplicative nCr formula. It works, but repeats a lot of work (about O(n^3)).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Row r only needs row r-1: `row[c] = prev[c-1] + prev[c]`. Why? To choose c items from r, either you take the last item (choose c-1 from the rest) or you skip it (choose c from the rest).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** numRows = 0 -> []. Row 0 and row 1 have no inner cells, so the inner loop must not run for them.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time, O(n^2) space

```
Compute C(r, c) for every cell with the multiplicative formula.
Each cell costs O(c), so the triangle costs about O(n^3).
```

### APPROACH 2 — Optimal (Pascal's rule)   O(n^2) time, O(n^2) space (the output itself)

```
Build row r from row r-1:
  row = [1, ..., 1] (length r+1)
  for c in 1..r-1: row[c] = prev[c-1] + prev[c]
```

### Dry run

```
numRows = 4
  r=0  [1]
  r=1  [1,1]
  r=2  [1, 1+1, 1]       = [1,2,1]
  r=3  [1, 1+2, 2+1, 1]  = [1,3,3,1]
```

### Complexity

- Brute force: O(n^3) time, O(n^2) space
- Optimal: O(n^2) time, O(n^2) space (the output itself)

### Edge cases

```
- numRows = 0 -> []
- numRows = 1 -> [[1]]
- row r sums to 2^r (a quick sanity check)
```

### Common mistakes

- Filling inner cells for rows 0 and 1 (index -1 reads undefined -> NaN).
- Sharing the same array object between rows (mutating one row changes another).

Full JavaScript solution with tests: [01_pascals_triangle.js](../solutions/01_pascals_triangle.js). Run it with `node 01_pascals_triangle.js` from the solutions folder.

</details>

## Related follow-ups

- Pascal's Triangle II (LeetCode #119) — one row with O(k) space
- Unique Paths (LeetCode #62) — the same numbers on a grid
- nCr mod p for n up to 10^6 — see the concepts guide, factorial tables

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
