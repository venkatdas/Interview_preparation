# Possible Bipartition

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Medium |
| **Pattern** | bipartite / UF enemy trick |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #886 — https://leetcode.com/problems/possible-bipartition/ |
| **Solution file** | [02_possible_bipartition.js](../solutions/02_possible_bipartition.js) — open only after a real attempt |

## Problem

n people labelled 1..n. dislikes[i] = [a, b] means a and b must NOT be in the same
group. Can you split everyone into two groups?

## Examples

```
Input: n = 4, dislikes = [[1,2],[1,3],[2,4]]         Output: true   ({1,4} and {2,3})
Input: n = 3, dislikes = [[1,2],[1,3],[2,3]]         Output: false  (triangle)
Input: n = 5, dislikes = [[1,2],[2,3],[3,4],[4,5],[1,5]]   Output: false (5-cycle)
```

## Constraints & clarifying questions

```
- 1-indexed people? (yes)
- People with no dislikes? (go anywhere)

It is exactly "is the dislike graph bipartite".
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bipartite / UF enemy trick* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (union-find with "enemy" nodes)   O((n + d) * alpha). Use a UnionFind of size 2n: node i and node i + n ("the group opposite to i").

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS 2-colouring)   O(n + d) time, O(n + d) space. Build an adjacency list over 1..n, then run the bipartite BFS from every uncoloured person.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no dislikes -> true
- n = 1
- duplicate dislike pairs
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (union-find with "enemy" nodes)   O((n + d) * alpha)

```
Use a UnionFind of size 2n: node i and node i + n ("the group opposite to i").
For each dislike (a, b): if a and b are already in the same set -> false.
Otherwise union(a, b + n) and union(b, a + n): "a is with b's enemies, b with a's".
Shown as `unionFindVersion`.
```

### APPROACH 2 — Optimal (BFS 2-colouring)   O(n + d) time, O(n + d) space

```
Build an adjacency list over 1..n, then run the bipartite BFS from every uncoloured
person.

Dry run n=4, [[1,2],[1,3],[2,4]]:
  color 1 = 0 -> 2 = 1, 3 = 1 -> from 2: 4 = 0. No conflicts -> true.
```

### Edge cases

```
- no dislikes -> true
- n = 1
- duplicate dislike pairs
```

Full JavaScript solution with tests: [02_possible_bipartition.js](../solutions/02_possible_bipartition.js). Run it with `node 02_possible_bipartition.js` from the solutions folder.

</details>

## Common mistakes

- Building a directed graph from dislikes; "a dislikes b" constrains both of them, so add both directions.
- People are 1-indexed; size arrays n + 1.
- Enemy-trick union-find: checking `connected(a, b)` AFTER doing the unions for that pair.

## Related follow-ups

- [Is Graph Bipartite?](01_is_graph_bipartite.md)
- [Satisfiability of Equality Equations](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/05_satisfiability_of_equality_equations.md)
- [Number of Provinces](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/04_number_of_provinces.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
