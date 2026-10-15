# Open the Lock

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | BFS implicit graph |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #752 — https://leetcode.com/problems/open-the-lock/ |
| **Solution file** | [17_open_the_lock.js](../solutions/17_open_the_lock.js) — open only after a real attempt |

## Problem

A lock has 4 wheels, each showing 0-9 and wrapping around (9 -> 0 and 0 -> 9). It starts
at "0000". One move turns ONE wheel one step. Some combinations are "deadends": if the
lock ever shows one, it jams. Return the minimum moves to reach `target`, or -1.

## Examples

```
Input: deadends = ["0201","0101","0102","1212","2002"], target = "0202"   Output: 6
Explanation: "0000" -> "1000" -> "1100" -> "1200" -> "1201" -> "1202" -> "0202"
Input: deadends = ["8888"], target = "0009"   Output: 1   ("0000" -> "0009")
Input: deadends = ["0000"], target = "8888"   Output: -1  (start is a dead end)
```

## Constraints & clarifying questions

```
- Is "0000" itself possibly a deadend? (yes -> -1)
- target === "0000"? (0 moves)

This is an IMPLICIT GRAPH: 10,000 nodes (every combination), each with 8 neighbours
(4 wheels x 2 directions). Unweighted, shortest path -> BFS.
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

**Start simple.** APPROACH 1 — Brute force (DFS with depth limit / iterative deepening)   very slow. Try all sequences of moves of length 1, then 2, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS over combinations)   O(10^4 * 8) time, O(10^4) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- start is a deadend -> -1
- target === "0000" -> 0
- target unreachable (walled in by deadends) -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS with depth limit / iterative deepening)   very slow

```
Try all sequences of moves of length 1, then 2, ... until one reaches the target.
8^k sequences at depth k. Included as a `dfsDeepening` reference only on tiny inputs.
```

### APPROACH 2 — Optimal (BFS over combinations)   O(10^4 * 8) time, O(10^4) space

```
1. visited = deadends (treat them as already visited so we never enter them)
  2. if "0000" is a deadend -> -1
  3. BFS level by level; generate 8 neighbours by +1 / -1 on each wheel with wrap-around
  4. first time we see target -> current level

Dry run (deadends none, target "0002"):
  level 0: "0000"
  level 1: "1000","9000","0100","0900","0010","0090","0001","0009"
  level 2: ... includes "0002" (from "0001") -> answer 2
```

### Edge cases

```
- start is a deadend -> -1
- target === "0000" -> 0
- target unreachable (walled in by deadends) -> -1
```

Full JavaScript solution with tests: [17_open_the_lock.js](../solutions/17_open_the_lock.js). Run it with `node 17_open_the_lock.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the wheel wraps (9 -> 0 and 0 -> 9).
- Not checking whether "0000" itself is a deadend.
- Using DFS, which does not give the minimum number of turns.

## Related follow-ups

- [Word Ladder](../03_Hard/18_word_ladder.md)
- Minimum Genetic Mutation (LeetCode #433)
- [Shortest Path in Binary Matrix](16_shortest_path_in_binary_matrix.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
