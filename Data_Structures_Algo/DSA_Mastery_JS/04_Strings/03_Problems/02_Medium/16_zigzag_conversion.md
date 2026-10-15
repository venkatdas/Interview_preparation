# Zigzag Conversion

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | simulation, row buckets |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #6 — https://leetcode.com/problems/zigzag-conversion/ |
| **Solution file** | [16_zigzag_conversion.js](../solutions/16_zigzag_conversion.js) — open only after a real attempt |

## Problem

Write the string in a zigzag pattern over numRows rows (down the first column, then
diagonally up to the top, then down again...), then read the rows left to right, top
to bottom, and return that string.

## Examples

```
Input: s = "PAYPALISHIRING", numRows = 3   Output: "PAHNAPLSIIGYIR"
  P   A   H   N
  A P L S I I G
  Y   I   R
Input: s = "PAYPALISHIRING", numRows = 4   Output: "PINALSIGYAHRPI"
  P     I    N
  A   L S  I G
  Y A   H R
  P     I
Input: s = "A", numRows = 1   Output: "A"
```

## Constraints & clarifying questions

```
- numRows = 1? (no zigzag, return s unchanged; also when numRows >= s.length)
- Do we need the actual grid? (no, only the row strings)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *simulation, row buckets* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * numRows) time, O(n * numRows) space. Actually build a 2D grid of characters, walk it with (row, col) following the zigzag, then read row by row skipping empty cells.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (row buckets with a bouncing direction)   O(n) time, O(n) space. We only need which ROW each character lands in, not the column.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- numRows = 1      -> s (would otherwise divide by zero in the math variant)
- numRows >= n     -> s (every char in its own row, read in order)
- ""               -> ""
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * numRows) time, O(n * numRows) space

```
Actually build a 2D grid of characters, walk it with (row, col) following the zigzag,
then read row by row skipping empty cells. Works, but wastes space on empty cells.
```

### APPROACH 2 — Optimal (row buckets with a bouncing direction)   O(n) time, O(n) space

```
We only need which ROW each character lands in, not the column. Keep one array per
row. Walk the string with a `row` index that moves down until it hits the bottom,
then up until it hits the top, flipping direction at the edges. Append each character
to its row. Finally join the rows.
(Math variant: characters in row 0 and row numRows-1 are every cycle = 2*(numRows-1)
apart; middle rows get two characters per cycle. Same complexity, trickier to get right.)

Dry run on "PAYPALIS", numRows=3:
  P row0 (down)   A row1   Y row2 (hit bottom, flip)   P row1   A row0 (hit top, flip)
  L row1   I row2 (flip)   S row1
  rows: ["PA", "APLS", "YI"] -> "PAAPLSYI"
```

### Edge cases

```
- numRows = 1      -> s (would otherwise divide by zero in the math variant)
- numRows >= n     -> s (every char in its own row, read in order)
- ""               -> ""
```

Full JavaScript solution with tests: [16_zigzag_conversion.js](../solutions/16_zigzag_conversion.js). Run it with `node 16_zigzag_conversion.js` from the solutions folder.

</details>

## Common mistakes

- Not special-casing numRows = 1, where the direction flip never happens and the loop breaks.
- Flipping direction one step late, so the row index goes out of range.
- Trying to compute the result with a closed-form index formula and getting cycle length wrong (it is 2·numRows − 2).

## Related follow-ups

- [Spiral Matrix](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/07_spiral_matrix.md) — another simulated traversal
- [Diagonal Traverse](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/11_diagonal_traverse.md) — bouncing direction changes
- [Count and Say](17_count_and_say.md) — string simulation

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
