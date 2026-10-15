# Minimum Height Trees

| | |
|---|---|
| **Topic** | Topological Sorting |
| **Difficulty** | Medium |
| **Pattern** | peel leaves (levels) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #310 — https://leetcode.com/problems/minimum-height-trees/ |
| **Solution file** | [04_minimum_height_trees.js](../solutions/04_minimum_height_trees.js) — open only after a real attempt |

## Problem

A tree with n nodes (0..n-1) is given as an undirected edge list. You can pick any node
as the root; the height is the longest path from the root to a leaf. Return all roots
that give the MINIMUM height.

## Examples

```
Input: n = 4, edges = [[1,0],[1,2],[1,3]]              Output: [1]
Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]  Output: [3,4]
Input: n = 1, edges = []                               Output: [0]
```

## Constraints & clarifying questions

```
- Input is guaranteed to be a tree? (yes)
- How many answers can there be? (at most 2 - the middle of the longest path)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *peel leaves (levels)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (BFS from every node, measure height)   O(n^2) time. For each node run a BFS to find the farthest node (= height).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (peel the leaves layer by layer - "topological sort on a tree"). O(n) time, O(n) space The best roots are the CENTRE of the tree: the middle node(s) of the longest path.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> [0]; n = 2 -> [0, 1]
- a straight line of odd length -> one centre; even length -> two centres
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (BFS from every node, measure height)   O(n^2) time

```
For each node run a BFS to find the farthest node (= height). Keep the nodes with the
minimal height. n BFS runs of O(n).
```

### APPROACH 2 — Optimal (peel the leaves layer by layer - "topological sort on a tree")

```
O(n) time, O(n) space
The best roots are the CENTRE of the tree: the middle node(s) of the longest path.
Find the centre by trimming leaves (degree 1 nodes) round by round, like Kahn's
algorithm with "in-degree 1" instead of 0. When 1 or 2 nodes remain, they are the
answer.

Dry run n=6, edges [[3,0],[3,1],[3,2],[3,4],[5,4]]:
  degree [1,1,1,4,2,1]   leaves [0,1,2,5]   remaining 6
  round 1: remove 0,1,2,5 -> remaining 2. degree[3]=1, degree[4]=1 -> new leaves [3,4]
  remaining <= 2 -> stop. answer [3,4]
```

### Edge cases

```
- n = 1 -> [0]; n = 2 -> [0, 1]
- a straight line of odd length -> one centre; even length -> two centres
```

Full JavaScript solution with tests: [04_minimum_height_trees.js](../solutions/04_minimum_height_trees.js). Run it with `node 04_minimum_height_trees.js` from the solutions folder.

</details>

## Common mistakes

- Not handling n = 1 (no edges): the answer is `[0]`, but the leaf loop may return an empty list.
- Peeling leaves one at a time instead of a whole layer at a time; the centres are whatever remains after the last full layer.
- Running BFS from every node (O(n^2)) when n can be 2 * 10^4.

## Related follow-ups

- [Parallel Courses](05_parallel_courses.md)
- [Graph Valid Tree](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/03_Problems/02_Medium/02_graph_valid_tree.md)
- Tree Diameter (LeetCode #1245)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
