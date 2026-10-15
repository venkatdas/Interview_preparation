# Word Search II

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Hard |
| **Pattern** | trie + backtracking |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #212 — https://leetcode.com/problems/word-search-ii/ |
| **Solution file** | [10_word_search_ii.js](../solutions/10_word_search_ii.js) — open only after a real attempt |

## Problem

Given an m x n board of letters and a list of words, return all words that
can be formed by a path of adjacent cells (up/down/left/right), using each
cell at most once per word.

## Examples

```
board = [["o","a","a","n"],
         ["e","t","a","e"],
         ["i","h","k","r"],
         ["i","f","l","v"]]
words = ["oath","pea","eat","rain"]   Output: ["oath","eat"]

board = [["a","b"],["c","d"]], words = ["abcb"]   Output: []
```

## Constraints & clarifying questions

```
- Return order? (any order; we sort in tests)
- Can a word appear twice in the result? (no, each found once)
- Board up to 12x12, up to 30,000 words of length <= 10.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *trie + backtracking* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS per word, like Word Search I)   O(W * m * n * 4^L). For each word, run a backtracking search from every cell.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie + ONE backtracking pass)   O(m * n * 4^L) time, O(total chars) space. Put all words in a trie.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- word longer than number of cells -> never found
- a word that is a prefix of another ("oat","oath") -> both found
- single-cell board
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS per word, like Word Search I)   O(W * m * n * 4^L)

```
For each word, run a backtracking search from every cell. 30,000 words times
a full board search is far too slow, but it is the natural starting point.
```

### APPROACH 2 — Optimal (Trie + ONE backtracking pass)   O(m * n * 4^L) time, O(total chars) space

```
Put all words in a trie. DFS from every cell, but move through the TRIE at
the same time as the board: only step onto a neighbour if the trie has that
letter as a child. When we reach a node with a stored word, add it to the
result and clear it (so it is not added twice). Mark visited cells by
temporarily writing '#' on the board, restore on the way back.
Pruning: after finishing a child with no children left, delete it from its
parent so later searches don't walk dead branches.

Dry run (board above, word "eat"):
  start at (1,0) 'e': trie root has 'e' -> go. mark '#'.
    neighbour (1,1) 't'? node(e) has no 't'. neighbour (0,0) 'o'? no.
    neighbour (2,0) 'i'? no. Actually 'e' -> 'a' needed: (1,1) is 't'... try
    from (1,3) 'e': neighbour (0,3) 'n' no, (2,3) 'r' no, (1,2) 'a' yes!
      from 'a': neighbour (1,1) 't' yes -> node has word "eat" -> found.
```

### Edge cases

```
- word longer than number of cells -> never found
- a word that is a prefix of another ("oat","oath") -> both found
- single-cell board
```

Full JavaScript solution with tests: [10_word_search_ii.js](../solutions/10_word_search_ii.js). Run it with `node 10_word_search_ii.js` from the solutions folder.

</details>

## Common mistakes

- Running a separate Word Search for every word.
- Adding the same found word more than once (clear it at the node after finding).
- Forgetting to restore the board cell after DFS.

## Related follow-ups

- [Word Search](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/15_word_search.md) (09_Matrix_And_Multidimensional_Arrays)
- [Implement Trie](../02_Medium/01_implement_trie.md)
- [Design Add and Search Words Data Structure](../02_Medium/02_add_and_search_words.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
