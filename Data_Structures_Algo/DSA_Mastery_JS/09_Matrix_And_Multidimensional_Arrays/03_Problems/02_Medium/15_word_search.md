# Word Search

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | grid backtracking |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #79 — https://leetcode.com/problems/word-search/ |
| **Solution file** | [15_word_search.js](../solutions/15_word_search.js) — open only after a real attempt |

## Problem

Given an m x n board of letters and a word, return true if the word can be formed by a
path of horizontally or vertically adjacent cells, using each cell at most once.

## Examples

```
board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
word = "ABCCED"   Output: true
word = "SEE"      Output: true
word = "ABCB"     Output: false   Explanation: B cannot be reused
```

## Constraints & clarifying questions

```
- Diagonal moves? (no)
- Can I mark the board temporarily? (yes, as long as I restore it)
- Board up to 6x6, word up to 15 chars -> exponential backtracking is fine
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *grid backtracking* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (try every path with a visited Set, no board mutation)   O(m n * 3^L) time, O(L) space. From every cell, DFS matching the word letter by letter, tracking visited cells in a Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (backtracking with in-place marking)   O(m n * 3^L) time, O(L) recursion. Start a DFS from every cell whose letter matches word[0].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- word longer than the number of cells -> false
- single-letter word
- word requires revisiting a cell ("ABCB") -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (try every path with a visited Set, no board mutation)   O(m n * 3^L) time, O(L) space

```
From every cell, DFS matching the word letter by letter, tracking visited cells in a Set.
Same search as the optimal, just slower bookkeeping.
```

### APPROACH 2 — Optimal (backtracking with in-place marking)   O(m n * 3^L) time, O(L) recursion

```
Start a DFS from every cell whose letter matches word[0]. At each step, if the current cell
matches word[index], temporarily overwrite it with '#' (so it cannot be reused), try the
four neighbours for index + 1, then restore the letter. The 3^L bound: after the first
step each cell has at most 3 unvisited neighbours.
Pruning that interviewers like: bail early if the board does not contain enough of each
letter, or search from the rarer end of the word.

Dry run for "SEE": start at (1,3)='S' -> (2,3)='E' -> (2,2)='E' -> index 3 == length -> true
```

### Edge cases

```
- word longer than the number of cells -> false
- single-letter word
- word requires revisiting a cell ("ABCB") -> false
```

Full JavaScript solution with tests: [15_word_search.js](../solutions/15_word_search.js). Run it with `node 15_word_search.js` from the solutions folder.

</details>

## Common mistakes

- Not un-marking a cell after exploring it (no backtracking), so later paths cannot reuse it.
- Reusing the same cell twice in one path.
- Building substrings during the search instead of passing an index into the word.

## Related follow-ups

- [Word Search (Backtracking)](../../../13_Backtracking/03_Problems/02_Medium/11_word_search.md) — the same problem in the backtracking topic
- [Word Search II](../../../22_Tries/03_Problems/03_Hard/10_word_search_ii.md) — many words at once with a trie
- [Number of Islands](14_number_of_islands.md) — grid DFS without backtracking

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
