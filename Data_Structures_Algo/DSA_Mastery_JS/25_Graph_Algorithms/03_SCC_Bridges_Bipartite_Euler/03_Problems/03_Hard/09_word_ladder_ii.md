# Word Ladder II

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Hard |
| **Pattern** | BFS layers + backtracking |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #126 — https://leetcode.com/problems/word-ladder-ii/ |
| **Solution file** | [09_word_ladder_ii.js](../solutions/09_word_ladder_ii.js) — open only after a real attempt |

## Problem

Like Word Ladder, but return ALL shortest transformation sequences from beginWord to
endWord (each step changes one letter, every intermediate word is in wordList).
Return [] if there is none.

## Examples

```
Input: begin = "hit", end = "cog", list = ["hot","dot","dog","lot","log","cog"]
Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]
Input: same list without "cog"   Output: []
```

## Constraints & clarifying questions

```
- Order of the sequences? (any)
- Word length <= 5, list <= 500 (LeetCode) - still, the naive approach explodes
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS layers + backtracking* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS carrying whole paths)   exponential memory. BFS where each queue item is a full path.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS for distances, then DFS backwards)   O(N * L * 26 + paths). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- endWord not in list -> []
- beginWord in the list (ignore it as a target)
- many equal-length paths through the same middle word (the DAG approach shares work)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS carrying whole paths)   exponential memory

```
BFS where each queue item is a full path. Mark words visited per LEVEL (not per push)
so several paths can reach the same word at the same depth. Simple, but the number
of partial paths can be huge. Good for small inputs and as a reference.
```

### APPROACH 2 — Optimal (BFS for distances, then DFS backwards)   O(N * L * 26 + paths)

```
1. BFS from beginWord computing dist[word] (shortest number of steps). Stop once the
     level containing endWord is complete.
  2. DFS from endWord BACK to beginWord, only moving to neighbours whose dist is
     exactly one less. Every route found is a shortest path. Reverse each.
The BFS builds a "shortest-path DAG"; the DFS enumerates its paths and nothing else.

Dry run hit -> cog:
  dist: hit 0, hot 1, dot 2, lot 2, dog 3, log 3, cog 4
  DFS from cog (4): neighbours with dist 3: dog, log
    dog -> dot (2) -> hot (1) -> hit (0)  => [hit,hot,dot,dog,cog]
    log -> lot (2) -> hot (1) -> hit (0)  => [hit,hot,lot,log,cog]
```

### Edge cases

```
- endWord not in list -> []
- beginWord in the list (ignore it as a target)
- many equal-length paths through the same middle word (the DAG approach shares work)
```

Full JavaScript solution with tests: [09_word_ladder_ii.js](../solutions/09_word_ladder_ii.js). Run it with `node 09_word_ladder_ii.js` from the solutions folder.

</details>

## Common mistakes

- Storing whole paths inside the BFS queue; memory explodes. Store parents (or distances) and rebuild paths afterwards.
- Removing a word from the dictionary as soon as it is reached; remove it only after the whole level is processed, or other parents on the same level are lost.
- Forgetting that endWord must be in the word list; otherwise return [].

## Related follow-ups

- [Word Ladder](../../../../24_Graph_Traversal/03_Problems/03_Hard/18_word_ladder.md)
- [Number of Ways to Arrive at Destination](../../../01_Shortest_Paths/03_Problems/02_Medium/06_number_of_ways_to_arrive_at_destination.md)
- [Open the Lock](../../../../24_Graph_Traversal/03_Problems/02_Medium/17_open_the_lock.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
