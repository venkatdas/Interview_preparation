# Pascal's Triangle II

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Easy |
| **Pattern** | recursion on the previous row |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #119 — https://leetcode.com/problems/pascals-triangle-ii/ (statement paraphrased in our own words) |
| **Solution file** | [05_pascals_triangle_ii.js](../solutions/05_pascals_triangle_ii.js) — open only after a real attempt |

## Problem

Return row number rowIndex (0-indexed) of Pascal's triangle. Each number is the sum of
the two numbers directly above it; every row starts and ends with 1.

## Examples

```
rowIndex = 0 -> [1]
rowIndex = 3 -> [1, 3, 3, 1]
rowIndex = 4 -> [1, 4, 6, 4, 1]
```

## Constraints & clarifying questions

```
- 0 <= rowIndex <= 33 (values fit in a Number)
- Follow-up: O(rowIndex) extra space
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Row k depends only on row k - 1. That is a one-call recursion over rows.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Compute each cell independently with C(r, c) = C(r-1, c-1) + C(r-1, c). Notice the explosion of repeated calls.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Get the whole previous row recursively once, then build the new row from adjacent pairs. Updating in place from right to left needs no second array.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** rowIndex 0 -> [1]. If you update left to right in place you overwrite values you still need.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (cell-by-cell recursion)   O(2^k) time, O(k) stack

```
C(r, c) = C(r-1, c-1) + C(r-1, c), with C(r, 0) = C(r, r) = 1. Compute each cell of the
row independently. Lots of overlapping calls -> exponential. Good to SEE why memo helps.
```

### APPROACH 2 — Optimal (recursion on whole rows)   O(k^2) time, O(k) extra space

```
PROMISE: getRow(k) returns row k.
  base: getRow(0) = [1]
  step: prev = getRow(k - 1); row k is [1, prev[0]+prev[1], ..., prev[k-2]+prev[k-1], 1].
Each level does O(k) work, k levels -> O(k^2). Only one row is alive per stack frame
at the end of each call (we can even update prev in place from right to left).

Dry run getRow(3):
  getRow(0) = [1]
  getRow(1) = [1, 1]
  getRow(2) = [1, 1+1, 1]        = [1, 2, 1]
  getRow(3) = [1, 1+2, 2+1, 1]   = [1, 3, 3, 1]
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| cell recursion | O(2^k) | O(k) stack |
| row recursion | O(k^2) | O(k) row + O(k) stack |
| formula C(k, c+1) = C(k, c) * (k-c)/(c+1) | O(k) | O(k) |

### Edge cases

```
- rowIndex = 0 -> [1];  rowIndex = 1 -> [1, 1]
```

### Common mistakes

- Updating in place left to right.
- Off-by-one: row index is 0-based, so row k has k + 1 numbers.
- Building all rows and keeping them (O(k^2) memory) when only one is needed.

Full JavaScript solution with tests: [05_pascals_triangle_ii.js](../solutions/05_pascals_triangle_ii.js). Run it with `node 05_pascals_triangle_ii.js` from the solutions folder.

</details>

## Related follow-ups

- Pascal's Triangle (LeetCode #118)
- Unique Paths (LeetCode #62)
- Find Triangular Sum of an Array (LeetCode #2221)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
