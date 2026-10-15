# Word Search

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | grid DFS mark/unmark |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #79 — https://leetcode.com/problems/word-search/ |
| **Solution file** | [11_word_search.js](../solutions/11_word_search.js) — open only after a real attempt |

## Problem

Given an m x n grid of letters and a word, return true if the word can be formed
by walking through adjacent cells (up/down/left/right). Each cell may be used once
per word.

## Examples

```
board = [["A","B","C","E"],
         ["S","F","C","S"],
         ["A","D","E","E"]]
Input: word = "ABCCED"   Output: true    (A->B->C->C->E->D snaking through the grid)
Input: word = "SEE"      Output: true
Input: word = "ABCB"     Output: false   (would need to reuse the B)
```

## Constraints & clarifying questions

```
- Diagonal moves? (no)
- Can I modify the board temporarily? (usually yes; otherwise keep a visited set)
- m, n <= 6, word length <= 15
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *grid DFS mark/unmark* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(m*n * 4^L). From every cell, DFS in all 4 directions without marking visited, carrying a Set of visited "r,c" strings and copying it at each step.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Grid DFS with mark/unmark)   O(m*n * 3^L) time, O(L) stack. For every cell that matches word[0], run dfs(row, col, index): - index === word.length -> found - out of bounds or letter mismatch -> false - mark the cell (board[r][c] = '#'), try the 4 neighbours with index + 1, restore the cell, return whether any neighbour

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- word longer than m*n -> false immediately
- single cell board, single letter word
- word with repeated letters needing different cells ("AAB" on a grid with one A)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m*n * 4^L)

```
From every cell, DFS in all 4 directions without marking visited, carrying a
Set of visited "r,c" strings and copying it at each step. Works but copies the
set O(L) times per call.
```

### APPROACH 2 — Optimal (Grid DFS with mark/unmark)   O(m*n * 3^L) time, O(L) stack

```
For every cell that matches word[0], run dfs(row, col, index):
  - index === word.length -> found
  - out of bounds or letter mismatch -> false
  - mark the cell (board[r][c] = '#'), try the 4 neighbours with index + 1,
    restore the cell, return whether any neighbour succeeded.
The mark prevents reusing a cell; the restore is the "un-choose".
Branching is 3 (not 4) after the first step because we never go back where we came from.

Dry run word="SEE" on the board above:
  start (1,0)='S': neighbours A,F,A -> no 'E' -> false
  start (1,3)='S': mark; down (2,3)='E' ok, index 1; mark; left (2,2)='E' ok, index 2
                   -> index === 3 -> true. Unmark on the way back up.
```

### Edge cases

```
- word longer than m*n -> false immediately
- single cell board, single letter word
- word with repeated letters needing different cells ("AAB" on a grid with one A)
```

Full JavaScript solution with tests: [11_word_search.js](../solutions/11_word_search.js). Run it with `node 11_word_search.js` from the solutions folder.

</details>

## Common mistakes

- Not restoring the cell after exploring, so later start positions see `#` and fail.
- Checking bounds after reading `board[r][c]`, which reads `undefined` rows and throws.
- Allowing the same cell twice in one path (forgetting to mark it).

## Related follow-ups

- [Word Search II](../../../22_Tries/03_Problems/03_Hard/10_word_search_ii.md) (22_Tries)
- [Number of Islands](../../../24_Graph_Traversal/03_Problems/02_Medium/05_number_of_islands.md) (24_Graph_Traversal)
- [Flood Fill](../../../24_Graph_Traversal/03_Problems/01_Easy/01_flood_fill.md) (24_Graph_Traversal)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
