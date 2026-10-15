# Word Ladder

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Hard |
| **Pattern** | BFS implicit graph |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #127 — https://leetcode.com/problems/word-ladder/ |
| **Solution file** | [18_word_ladder.js](../solutions/18_word_ladder.js) — open only after a real attempt |

## Problem

Given beginWord, endWord and a wordList, a transformation sequence changes one letter
at a time, and every intermediate word must be in wordList. Return the LENGTH (number
of words) of the shortest sequence from beginWord to endWord, or 0 if none exists.

## Examples

```
Input: begin = "hit", end = "cog", list = ["hot","dot","dog","lot","log","cog"]
Output: 5   ("hit" -> "hot" -> "dot" -> "dog" -> "cog")
Input: same but list without "cog"   Output: 0
```

## Constraints & clarifying questions

```
- All words same length? (yes)
- beginWord need not be in the list; endWord must be (else 0)
- Lowercase letters only? (yes)

This is an IMPLICIT GRAPH: node = word, edge = differ by one letter. Unweighted
shortest path -> BFS.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS implicit graph* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (build the explicit graph by comparing all pairs). O(N^2 * L) to build + O(N^2) BFS, N words of length L Compare every pair of words character by character; connect them if exactly one differs.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS generating neighbours on the fly)   O(N * L * 26) time. For the current word, try every position and every letter a-z.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- endWord not in list -> 0
- beginWord === endWord (not in LeetCode constraints; we return 1 if end is in the list)
- no path -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (build the explicit graph by comparing all pairs)

```
O(N^2 * L) to build + O(N^2) BFS, N words of length L
Compare every pair of words character by character; connect them if exactly one
differs. Then BFS. Fine for a few hundred words, too slow for 5000.
```

### APPROACH 2 — Optimal (BFS generating neighbours on the fly)   O(N * L * 26) time

```
For the current word, try every position and every letter a-z. If the result is in the
word set (and unvisited), it is a neighbour. Remove words from the set when visited
(the set IS the visited structure). Level-by-level BFS; the level number is the answer.

Dry run on hit -> cog:
  level 1: {hit}
  level 2: hot             (the only 1-letter change in the list)
  level 3: dot, lot
  level 4: dog, log
  level 5: cog  -> return 5

(Bidirectional BFS is a further speedup: expand from both ends, always the smaller
 side. Mention it in the interview.)
```

### Edge cases

```
- endWord not in list -> 0
- beginWord === endWord (not in LeetCode constraints; we return 1 if end is in the list)
- no path -> 0
```

Full JavaScript solution with tests: [18_word_ladder.js](../solutions/18_word_ladder.js). Run it with `node 18_word_ladder.js` from the solutions folder.

</details>

## Common mistakes

- Returning the number of edges instead of the number of words in the sequence.
- Not removing words from the dictionary Set once visited (exponential revisits).
- Forgetting to return 0 when endWord is not in the list.

## Related follow-ups

- [Open the Lock](../02_Medium/17_open_the_lock.md)
- Word Ladder II (LeetCode #126)
- Minimum Genetic Mutation (LeetCode #433)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
