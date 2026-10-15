# Tree Diameter

| | |
|---|---|
| **Topic** | Advanced Tree Techniques |
| **Difficulty** | Medium |
| **Pattern** | two BFS (farthest node) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Graph Traversal](../../../../24_Graph_Traversal/README.md) |
| **Source** | LeetCode #1245 — https://leetcode.com/problems/tree-diameter/ (statement paraphrased, not copied) |
| **Solution file** | [01_tree_diameter.js](../solutions/01_tree_diameter.js) — open only after a real attempt |

## Problem

An undirected tree has n nodes labelled 0..n-1, given as a list of n - 1 edges. Return the
diameter of the tree: the number of edges on the longest path between any two nodes.

## Examples

```
Input: edges = [[0,1],[0,2]]                     Output: 2   (1 - 0 - 2)
Input: edges = [[0,1],[1,2],[2,3],[1,4],[4,5]]   Output: 4   (3 - 2 - 1 - 4 - 5)
Input: edges = []   (single node)                Output: 0
```

## Constraints & clarifying questions

```
- n up to 10^4. Is the input guaranteed to be a tree? (yes: connected, n - 1 edges)
- Do we count edges or nodes? (edges)
- Can the tree be a long path? (yes -> avoid deep recursion)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "Longest path in a tree" is the *farthest node* pattern. Re-read section 5.1 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** BFS from every node and take the largest distance ever seen: O(n^2). Correct, but too slow for big n.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The node farthest from ANY start node is always an endpoint of some longest path. So you only need two BFS runs.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** n = 1 (no edges) -> 0. A star -> 2. A path of n nodes -> n - 1.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

BFS from every node; the answer is the maximum distance in any BFS.

### APPROACH 2 — Optimal (two BFS)   O(n) time, O(n) space

```
BFS from node 0 -> farthest node a.
BFS from a      -> farthest distance = diameter.
Why: if a were not an endpoint of a diameter x..y, the path from a through the point where
the s..a route meets x..y would give something at least as long - an exchange argument.

Dry run on [[0,1],[1,2],[2,3],[1,4],[4,5]]:
  BFS from 0: dist = [0,1,2,3,2,3]  -> a = 3 (first maximum)
  BFS from 3: dist = [3,2,1,0,3,4]  -> max 4 -> answer 4
```

### Edge cases

```
- n = 1 -> 0
- star -> 2
- path of 10^5 nodes -> BFS is iterative, no stack problems
```

### Common mistakes

- Adding edges in one direction only.
- Returning the number of NODES on the path instead of edges.
- Using two BFS on a graph with cycles or negative weights (only valid on trees with non-negative weights).

Full JavaScript solution with tests: [01_tree_diameter.js](../solutions/01_tree_diameter.js). Run it with `node 01_tree_diameter.js` from the solutions folder.

</details>

## Related follow-ups

- Diameter of Binary Tree (LeetCode #543)
- Diameter of N-Ary Tree (LeetCode #1522)
- Longest Path With Different Adjacent Characters (LeetCode #2246)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
